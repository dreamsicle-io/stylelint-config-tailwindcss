
// @ts-check

import types from "./dist/types.json" with { type: "json" };
import properties from "./dist/properties.json" with { type: "json" };

/**
 * @type {import("stylelint").Config}
 */
const stylelintConfigTailwindCSS = {
	languageOptions: {
		syntax: {
			atRules: {
				"theme": {
					prelude: "<custom-ident>",
				},
				"source": {
					prelude: "<string>",
				},
				"utility": {
					prelude: "<custom-ident>",
				},
				"variant": {
					prelude: "<custom-ident>",
				},
				"custom-variant": {
					prelude: "<custom-ident>",
				},
				"reference": {
					prelude: "<string>",
				},
				"apply": {
					prelude: "<custom-ident>+",
				},
			},
			types: {
				"--alpha()": "--alpha( <color> / <percentage> )",
				"--spacing()": "--spacing( <number> )",
				...types,
			},
			properties: {
				...properties,
			},
		},
	},
	rules: {
		"import-notation": "string",
		"lightness-notation": "number",
		"hue-degree-notation": "number",
		"nesting-selector-no-missing-scoping-root": [true, {
			ignoreAtRules: [
				"custom-variant",
			],
		}],
	},
};

export default stylelintConfigTailwindCSS;
