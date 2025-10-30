// @ts-check

import Logger from "../lib/Logger.mjs";
import SyntaxGenerator from "../lib/SyntaxGenerator.mjs";

const args = process.argv.slice(2);
const isVerbose = args.includes('--verbose');

const syntaxGenerator = new SyntaxGenerator({
	isVerbose: isVerbose,
});

try {
	await syntaxGenerator.generate();
} catch(error) {
	Logger.error({ error, isVerbose });
	process.exit(1);
}
