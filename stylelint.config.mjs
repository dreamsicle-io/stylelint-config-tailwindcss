import configTailwindcss from "./dist/stylelint.config.mjs";

/**
 * @type {import("stylelint").Config}
 */
const stylelintConfig = {
	extends: [
		"stylelint-config-standard",
	],
	languageOptions: {
		...configTailwindcss.languageOptions,
	},
	rules: {
		...configTailwindcss.rules,
		"lightness-notation": "number",
		"hue-degree-notation": "number",
		
	}
};

export default stylelintConfig;
