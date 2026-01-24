
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
				"--alpha()": "--alpha( <color> / <percentage> )",
				"--spacing()": "--spacing( <number> )",
				"tailwindcss-color": "<color> | <--alpha()>",
				"tailwindcss-length": "<length> | <--spacing()>",
				...types,
			},
			properties: {
				"flood-color": "<tailwindcss-color>",
				"lighting-color": "<tailwindcss-color>",
				...properties,
			},
			atRules: {
				"theme": {
					prelude: "inline | static",
				},
				"source": {
					prelude: "<string>",
				},
				"utility": {
					prelude: "<any-value>",
				},
				"variant": {
					prelude: "<any-value>",
				},
				"custom-variant": {
					prelude: "<any-value> | <any-value> <any-value>",
				},
				"reference": {
					prelude: "<string>",
				},
				"apply": {
					prelude: "<any-value>+",
				},
				...atRules,
			},
		},
	},
	rules: {
		"import-notation": "string",
		"nesting-selector-no-missing-scoping-root": [true, {
			ignoreAtRules: [
				"custom-variant",
				"utility",
			],
		}],
		"no-invalid-position-declaration": [true, {
			ignoreAtRules: [
				"utility"
			],
		}],
	},
};

export default stylelintConfig;
