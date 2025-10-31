// @ts-check

import SyntaxGenerator from "../SyntaxGenerator.mjs";

/**
 * @returns {import("rollup").Plugin}
 */
export default function tailwindcssSyntax() {
	return {
		name: 'tailwindcss-syntax',
		async buildStart() {
			this.info("Generating Tailwind CSS syntax...");
			const generator = new SyntaxGenerator();
			try {
				await generator.generate();
			} catch(error) {
				this.error((error instanceof Error) ? error.message : "An unknown error occurred");
			}
			this.info("Tailwind CSS syntax generated")
		},
	};
}
