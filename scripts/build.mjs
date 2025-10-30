// @ts-check

import Logger from "../lib/Logger.mjs";
import Generator from "../lib/Generator.mjs";

const args = process.argv.slice(2);
const isVerbose = args.includes('--verbose');

const generator = new Generator({
	isVerbose: isVerbose,
});

try {
	await generator.generate();
} catch(error) {
	Logger.error({ error, isVerbose });
	process.exit(1);
}
