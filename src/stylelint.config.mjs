
// @ts-check

import types from "../syntax/types.json" with { type: "json" };
import properties from "../syntax/properties.json" with { type: "json" };
import atRules from "../syntax/at-rules.json" with { type: "json" };

/**
 * @type {import("stylelint").Config}
 */
const stylelintConfig = {
	languageOptions: {
		syntax: {
			types: {
				"tailwindcss-color": "<color> | <--alpha()>",
				"tailwindcss-length": "<length> | <--spacing()>",
				"--alpha()": "--alpha( <color> / <percentage> )",
				"--spacing()": "--spacing( <number> )",
				...types,
			},
			properties: {
				...properties,
			},
			atRules: {
				"theme": {
					prelude: "inline",
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
				...atRules,
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

export default stylelintConfig;
