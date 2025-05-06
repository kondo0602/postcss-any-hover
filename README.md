# PostCSS Any Hover

A PostCSS plugin that wraps `:hover` selectors with `@media (any-hover: hover) {}`.

The hover effect should be disabled on touch devices as it can cause the hover state to persist after a tap, resulting in unexpected UI behavior and a confusing user experience.

Wrap with `@media (any-hover: hover) {}` to apply the `:hover` effect only on hoverable devices.

```css
 /* before */
.foo:hover {
  color: red;
}

/* after */
@media (any-hover: hover) {
  .foo:hover {
    color: red;
  }
}
```

## Options

### `alsoApplyToFocusVisible`

Type: `Boolean` Default: `false`

You may want to apply the same style to `:focus-visible` as you do to `:hover` to clearly indicate which element is focused during keyboard navigation.

When using the `alsoApplyToFocusVisible` option, the styles defined for `:hover` will also be applied to `:focus-visible`.

```css
/* before */
.foo:hover {
  color: red;
}

/* after */
.foo:focus-visible {
  color: red;
}

@media (any-hover: hover) {
  .foo:hover {
    color: red;
  }
}
```
