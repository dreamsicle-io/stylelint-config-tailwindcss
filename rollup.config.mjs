import path from "node:path";
import { defineConfig } from "rollup";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonJS from "@rollup/plugin-commonjs";
import tailwindcssSyntax from "./lib/rollup-plugins/tailwindcssSyntax.mjs";

export default defineConfig({
	input: path.join("src", "stylelint.config.mjs"),
	output: [
		{
			file: path.join("dist", "stylelint.config.mjs"),
			format: "esm",
		},
		{
			file: path.join("dist", "stylelint.config.cjs"),
			format: "cjs",
		},
	],
	watch: {
    exclude: ["syntax/**"],
  },
	plugins: [
		json({
			namedExports: false,
			preferConst: true,
		}),
		nodeResolve(),
		commonJS(),
		tailwindcssSyntax(),
	],
});
