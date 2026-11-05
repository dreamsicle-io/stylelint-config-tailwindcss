# Stylelint Config: Tailwind CSS 

[![Awesome Stylelint](https://awesome.re/badge.svg)](https://stylelint.io/awesome-stylelint/) [![NPM Downloads](https://img.shields.io/npm/dy/%40dreamsicle.io%2Fstylelint-config-tailwindcss?label=npm)](https://www.npmjs.com/package/@dreamsicle.io/stylelint-config-tailwindcss)


A [Stylelint](https://stylelint.io/) configuration for [Tailwind CSS](https://tailwindcss.com/) projects. Developed specifically for **Tailwind CSS v4+** and **Stylelint v16.17+** utilizing the new syntax `languageOptions`, this configuration was created because most of the other popular Stylelint configurations for Tailwind CSS simply ignore directives and functions. Instead, this config implements all [Tailwind CSS directives and functions](https://tailwindcss.com/docs/functions-and-directives) as syntax for [Stylelint's language options](https://stylelint.io/user-guide/configure/#languageoptions); so not only can you use them without Stylelint complaining, but Stylelint will actually help to ensure you are using them correctly.

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
	extends: [
		"stylelint-config-standard",
		"@dreamsicle.io/stylelint-config-tailwindcss",
	],
};

export default stylelintConfig;
```

## Exports

This package exports both an ESM module and a Common JS module. The default export is the ESM module.

- `dist/stylelint.config.mjs` - ESM
- `dist/stylelint.config.cjs` - Common JS

### Accessing specific keys

You can also decide to spread the imported config onto your stylelint object to extend `languageOptions`, `languageOptions.syntax`, `languageOptions.syntax.types`, `languageOptions.syntax.properties`, or `languageOptions.syntax.atRules`. Below is an example of how to fully spread everything provided by this config.

```javascript
import configTailwindcss from "@dreamsicle.io/stylelint-config-tailwindcss/dist/stylelint.config.mjs";

/**
 * @type {import("stylelint").Config}
 */
const stylelintConfig = {
	extends: [
		"stylelint-config-standard",
	],
	languageOptions: {
		...configTailwindcss.languageOptions,
		syntax: {
			...configTailwindcss.languageOptions.syntax,
			types: {
				...configTailwindcss.languageOptions.syntax.types,
			},
			properties: {
				...configTailwindcss.languageOptions.syntax.properties,
			},
			atRules: {
				...configTailwindcss.languageOptions.syntax.atRules,
			},
		}
	},
	rules: {
		...configTailwindcss.rules,
	}
};

export default stylelintConfig;
```

> **Note:** All types, properties, at-rules and Stylelint rules are required for this configuration to function properly. There are no stylistic rules provided by it, as it inly includes what is needed to make Stylelint play well with Tailwind CSS.

## Compatibility

This configuration is intended for use with **Tailwind CSS v4+**. However, Tailwind's documentation states that some old directives may still be used for [compatibility](https://tailwindcss.com/docs/functions-and-directives#compatibility). While this is out of the scope of this configuration, you can continue to use legacy directives like `@config` and `@plugin` by including them in `languageOptions.syntax` manually.

```javascript
/**
 * @type {import("stylelint").Config}
 */
const stylelintConfig = {
	extends: [
		"stylelint-config-standard",
		"@dreamsicle.io/stylelint-config-tailwindcss",
	],
	languageOptions: {
		syntax: {
			atRules: {
				/**
				 * @see https://tailwindcss.com/docs/functions-and-directives#config-directive
				 */
				config: {
					prelude: "<string>",
				}
				/**
				 * @see https://tailwindcss.com/docs/functions-and-directives#plugin-directive
				 */
				plugin: {
					prelude: "<string>",
				},
			},
		},
	},
};
```

> **Note:** The [`theme()`](https://tailwindcss.com/docs/functions-and-directives#theme-function) function is deprecated and should not be used. Use [CSS theme variables](https://tailwindcss.com/docs/theme#using-your-theme-variables) instead.

## Development

This package has a build script that will generate only the syntax needed to override Stylelint's language options to suport Tailwind CSS functions and directives. This works by upgrading syntax from [CSS Tree](https://www.npmjs.com/package/css-tree) including the latest patches provided by [@csstools/css-syntax-patches-for-csstree](@csstools/css-syntax-patches-for-csstree), which are the same packages Stylelint uses under the hood.

This is accomplished using our `SyntaxGenerator` class, used through a [Rollup](https://rollupjs.org/) plugin. The contents of these files are built to the `syntax` directory, then imported and built through rollup into an **ESM module** and a **Common JS** module located in the `dist` directory.

The contents of these files are passed to Stylelint's `languageOptions.syntax` through the config template found at `src/stylelint.config.mjs`. The generation of types, properties, and at-rules allows for automatic upgrading of CSS syntax to accept Tailwind CSS properties where they are accepted in the least destructive and most maintainable way possible.

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

### Clean

```
npm run clean
```

> **Note:** This will clean all built files and dependencies.
