import stylelintConfigTailwindCSS from "./dist/stylelint.config.mjs";

/**
 * @type {import("stylelint").Config}
 */
const stylelintConfig = {
	"extends": [
		"stylelint-config-standard",
	],
	...stylelintConfigTailwindCSS,
};

export default stylelintConfig;
