import path from "node:path";
import { defineConfig } from "rollup";
import pluginJSON from "@rollup/plugin-json";
import pluginNodeResolve from "@rollup/plugin-node-resolve";
import pluginCommonJS from "@rollup/plugin-commonjs";

export default defineConfig({
	input: path.join(process.cwd(), "src", "stylelint.config.mjs"),
	output: [
		{
			file: path.join(process.cwd(), "dist", "stylelint.config.mjs"),
			format: "esm",
		},
		{
			file: path.join(process.cwd(), "dist", "stylelint.config.cjs"),
			format: "cjs",
		},
		{
			file: path.join(process.cwd(), "dist", "stylelint.config.js"),
			format: "cjs",
		},
	],
	plugins: [
		pluginJSON({
			namedExports: false,
			preferConst: true,
		}),
		pluginNodeResolve(),
		pluginCommonJS(),
	],
});
