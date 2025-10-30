// @ts-check

import Generator from "../lib/Generator.mjs";

const args = process.argv.slice(2);
const isVerbose = args.includes('--verbose');

const generator = new Generator({
	isVerbose: isVerbose,
});

await generator.generate();
