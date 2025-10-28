# Stylelint Config: Tailwind CSS

A [Stylelint](https://stylelint.io/) configuration for [Tailwind CSS](https://tailwindcss.com/) projects. This config was developed specifically for **Tailwind CSS v4+**. This configuration was developed because most of the other popular Stylelint configurations for Tailwind CSS simply ignore directives and functions. Instead, we implemented all [Tailwind CSS directives and functions](https://tailwindcss.com/docs/functions-and-directives) as syntax for [Stylelint's language options](https://stylelint.io/user-guide/configure/#languageoptions); so not only can you use them without Stylelint complaining, but Stylelint will actually help to ensure you are using them correctly.

## Getting started

### Install

```shell
npm install --save-dev @dreamsicle.io/stylelint-config-tailwindcss
```

### Include in `extends`

```javascript
/**
 * @type {import("stylelint").Config}
 */
const stylelintConfig = {
	// ...
	extends: [
		"stylelint-config-standard",
		"@dreamsicle.io/stylelint-config-tailwindcss",
	],
	// ...
};

export default stylelintConfig;
```

## Known issues

### @custom-variant inline syntax

The `@custom-variant` directive can be used to create a custom variant, and can be written as a nested statement, or inline. Currently, it does not seem to be possible to represent this using Stylelint's language options. We recommend using the nested syntax.

#### Supported `@custom-variant` syntax (nested)

```css
@custom-variant theme-midnight {
	&:where([data-theme="midnight"] *) {
		@slot;
	}
}
```

#### Unsupported `@custom-variant` syntax (inline)

```css
/* stylelint-disable-next-line at-rule-prelude-no-invalid */
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
```

> **Note:** You may continue to use this syntax if you prefer, but you should use a `stylelint-disable` comment when using it.
