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

> **Note:** All types, properties, and at-rules and Stylelint rules are required for this configuration to funciton properly. There are no stylistic rules provided by it, as it inly includes what is needed to make Stylelint play well with Tailwind CSS.

## Development

This package has a build script that will generate only the syntax needed to override Stylelint's language options to suport Tailwind CSS functions and directives. This works by upgrading syntax from [CSS Tree](https://www.npmjs.com/package/css-tree), which is the same package Stylelint uses under the hood.

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
