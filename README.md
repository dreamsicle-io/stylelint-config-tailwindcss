# Stylelint Config: Tailwind CSS

A [Stylelint](https://stylelint.io/) configuration for [Tailwind CSS](https://tailwindcss.com/) projects. This config was developed specifically for **Tailwind CSS v4+** and **Stylelint v16.17+**. This configuration was developed because most of the other popular Stylelint configurations for Tailwind CSS simply ignore directives and functions. Instead, this config implements all [Tailwind CSS directives and functions](https://tailwindcss.com/docs/functions-and-directives) as syntax for [Stylelint's language options](https://stylelint.io/user-guide/configure/#languageoptions); so not only can you use them without Stylelint complaining, but Stylelint will actually help to ensure you are using them correctly.

## Getting started

### Install the package

```shell
npm install --save-dev @dreamsicle.io/stylelint-config-tailwindcss
```

### Include in your Stylelint config

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

### `@custom-variant` inline syntax

The [`@custom-variant` directive](https://tailwindcss.com/docs/adding-custom-styles#adding-custom-variants) can be used to create a custom variant, and can be written as a **nested statement**, or an **inline statement**. Currently, it does not seem to be possible to represent the **inline statement** using Stylelint's language options. We recommend using the **nested statement**.

#### Nested `@custom-variant` syntax: _Supported_

```css
@custom-variant theme-midnight {
	&:where([data-theme="midnight"] *) {
		@slot;
	}
}
```

#### Inline `@custom-variant` syntax: _Not supported_

```css
/* stylelint-disable-next-line at-rule-prelude-no-invalid */
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
```

> **Note:** You may continue to use the inline statement if you prefer, but you should use a `/* stylelint-disable-next-line at-rule-prelude-no-invalid */` comment when using it.

## Development

This package has a build script will generate syntax files for types, properties, and at-rules in the `syntax` directory. This works by upgrading syntax from [css-tree](https://www.npmjs.com/package/css-tree), which is the same package Stylelint uses under the hood. The contents of these files are passed to Stylelint's `languageOptions.syntax` through the config template found at `src/stylelint.config.mjs`. The generation of types, properties, and at-rules allows for automatic upgrading of CSS syntax to accept Tailwind CSS properties where they are accepted in the least destructive and most maintainable way possible.

### Start

```
npm start
```

> **Note:** This script will run rollup in watch mode, so that changes to the config template automatically rebuild.

### Build

```
npm run build
```

> **Note:** This script will run rollup to create a build, exiting on completion.

### Test

```
npm test
```

> **Note:** This will run stylelint against any CSS files found in the `tests` directory.

### Fix

```
npm run fix
```

> **Note:** This will run stylelint in _fix_ mode against any CSS files found in the `tests` directory.
