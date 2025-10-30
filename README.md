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

This package has a build script will generate `dist/types.json` and `dist/properties.json` files by upgrading syntax from [css-tree](https://www.npmjs.com/package/css-tree), which is the same package Stylelint uses under the hood. The contents of these files are passed to Stylelint's `languageOptions.syntax.types` and `languageOptions.syntax.properties` respectively. The generation of both types and properties allows for automatic upgrading of CSS syntax to accept Tailwind CSS properties where they are accepted.

### Build

```
npm run build
```

> **Note:** The logging of the build script can be made more verbose by passing the `--verbose` flag as `npm run build -- --verbose`.

### Test

```
npm test
```

> **Note:** This will run stylelint against any CSS files found in the `tests` directory.

### Logging

The build script will log its output to the console.

```
⚡ Generating syntax ― Using css-tree v3.1.0

⏳ Generating upgraded types ― Found 25 type upgrade candidates
🔨 Generated upgraded types ― dist\types.json
⏳ Generating upgraded properties ― Found 107 property upgrade candidates  
🔨 Generated upgraded properties ― dist\properties.json

🚀 Generated syntax ― 2 files generated successfully
```

