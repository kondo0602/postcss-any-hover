const { AtRule } = require('postcss')
const selectorParser = require('postcss-selector-parser')

const isHoverRule = (rule) => {
  return rule.type === 'rule' && rule.selector.includes(':hover')
}

const isAlreadyWrappedAtRule = (rule) => {
  return (
    rule.parent.type === 'atrule' &&
    (rule.parent.params.includes('hover: hover') || rule.parent.params.includes('any-hover: hover'))
  )
}

const classifySelectors = (selectorString) => {
  const transform = (selectors) => {
    const hoverSelectors = []
    const nonHoverSelectors = []

    selectors.each(selectorNode => {
      const selectorString = selectorNode.toString()
      selectorString.includes(':hover') ? hoverSelectors.push(selectorString) : nonHoverSelectors.push(selectorString)
    })

    return { hoverSelectors, nonHoverSelectors }
  }
  const processor = selectorParser(transform)

  return processor.transformSync(selectorString, { lossless: false })
}

const wrapWithAnyHover = (rule) => {
  return new AtRule({ name: 'media', params: '(any-hover: hover)' }).append(rule)
}

const convertHoverToFocusVisible = (selectors) => {
  return selectors.map(selector => selector.replace(':hover', ':focus-visible'))
}

module.exports = ({
  alsoApplyToFocusVisible   = false,
} = {}) => {
  return {
    postcssPlugin: 'postcss-any-hover',
    Rule (rule) {
      if (!isHoverRule(rule) || isAlreadyWrappedAtRule(rule)) return

      const { hoverSelectors, nonHoverSelectors } = classifySelectors(rule.selector)

      if (hoverSelectors.length === 0) return

      const wrappedAnyHoverRule = wrapWithAnyHover(rule.clone({ selectors: hoverSelectors }))
      rule.after(wrappedAnyHoverRule)

      if (alsoApplyToFocusVisible) {
        const focusVisibleSelectors = convertHoverToFocusVisible(hoverSelectors)
        rule.cloneAfter({ selectors: focusVisibleSelectors })
      }

      if (nonHoverSelectors.length > 0) {
        rule.cloneAfter({ selectors: nonHoverSelectors })
      }

      rule.remove()
    }
  }
}

module.exports.postcss = true
