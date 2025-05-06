import postcss from 'postcss'
import { describe, expect, test } from 'vitest'

import plugin from '.'

const run = async (input, output, opts = {}) => {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings().length).toEqual(0)
}

describe(':hover -> @media(any-hover: hover)', () => {
  test('Replaces a single :hover selector', () => {
    run(
      '.foo:hover { color: red }',
      '@media (any-hover: hover) {.foo:hover { color: red } }',
    )
  })

  test('Replaces a descendant:hover selector', () => {
    run(
      '.foo .fuga:hover { color: red }',
      '@media (any-hover: hover) {.foo .fuga:hover { color: red } }'
    )
  })

  test('Replaces multiple :hover selectors (all :hover)', () => {
    run(
      '.foo:hover, .fuga:hover { color: red }',
      '@media (any-hover: hover) {.foo:hover, .fuga:hover { color: red } }'
    )
  })

  test('Replaces only :hover selectors when mixed with non-:hover', () => {
    run(
      '.foo:hover, .fuga { color: red }',
      '.fuga { color: red }@media (any-hover: hover) {.foo:hover { color: red } }'
    )
  })

  test('Does not replace non-:hover selectors', () => {
    run(
      '.foo { color: red }',
      '.foo { color: red }',
    )
    run(
      '.hover { color: red }',
      '.hover { color: red }',
    )
    run(
      '.any-hover { color: red }',
      '.any-hover { color: red }',
    )
  })

  test('Does not replace already nested classes', () => {
    run(
      '@media (hover: hover) {.btn:hover { color: red }}',
      '@media (hover: hover) {.btn:hover { color: red }}'
    )
    run(
      '@media (any-hover: hover) {.btn:hover { color: red }}',
      '@media (any-hover: hover) {.btn:hover { color: red }}'
    )
  })

  test('Replaces :hover and also applies to :focus-visible when alsoApplyToFocusVisible is true', () => {
    run(
      '.foo:hover { color: red }',
      '.foo:focus-visible { color: red }@media (any-hover: hover) {.foo:hover { color: red } }',
      { alsoApplyToFocusVisible: true }
    )
  })

  test('Replaces multiple :hover selectors and also applies to :focus-visible when alsoApplyToFocusVisible is true', () => {
    run(
      '.foo:hover, .fuga:hover { color: red }',
      '.foo:focus-visible, .fuga:focus-visible { color: red }@media (any-hover: hover) {.foo:hover, .fuga:hover { color: red } }',
      { alsoApplyToFocusVisible: true }
    )
  })

  test('Replaces only :hover selectors when mixed with non-:hover, and also applies to :focus-visible when alsoApplyToFocusVisible is true', () => {
    run(
      '.foo:hover, .fuga { color: red }',
      '.fuga { color: red }.foo:focus-visible { color: red }@media (any-hover: hover) {.foo:hover { color: red } }',
      { alsoApplyToFocusVisible: true }
    )
  })
})
