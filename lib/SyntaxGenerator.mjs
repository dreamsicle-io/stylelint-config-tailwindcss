
// @ts-check

import path from "node:path";
import fs from "node:fs";
import cssTreeSyntax from 'css-tree/definition-syntax-data';

/**
 * @typedef {Object} SyntaxGeneratorPaths
 * @property {string} syntaxDir
 * @property {string} syntaxTypes
 * @property {string} syntaxAtRules
 * @property {string} syntaxProperties
 */

/**
 * @typedef {Object} SyntaxGeneratorAtRuleConfig
 * @property {string} [prelude]
 * @property {Record<string, string> | null} [descriptors]
 */

export default class SyntaxGenerator {

	/**
	 * @type {Record<string, string>}
	 */
	static replacements = {
		"<color>": "<tailwindcss-color>",
		"<length>": "<tailwindcss-length>",
	};
	
	/**
	 * @type {SyntaxGeneratorPaths}
	 */
	static paths = {
		syntaxDir: path.join(process.cwd(), "syntax"),
		syntaxTypes: path.join(process.cwd(), "syntax", "types.json"),
		syntaxProperties: path.join(process.cwd(), "syntax", "properties.json"),
		syntaxAtRules: path.join(process.cwd(), "syntax", "at-rules.json"),
	};

	/**
	 * @type {Record<string, string>}
	 */
	get types() {
		return this.upgrade(cssTreeSyntax.types);
	}

	/**
	 * @type {Record<string, string>}
	 */
	get properties() {
		return this.upgrade(cssTreeSyntax.properties);
	}

	/**
	 * @type {Record<string, SyntaxGeneratorAtRuleConfig>}
	 */
	get atRules() {
		/**
		 * @type {Record<string, SyntaxGeneratorAtRuleConfig>}
		 */
		const upgraded = {};

		/**
		 * @type {[string, SyntaxGeneratorAtRuleConfig][]}
		 */
		const candidates = Object.entries(cssTreeSyntax.atrules).filter(
			/**
			 * @param {[string, SyntaxGeneratorAtRuleConfig]} entry
			 */
			([_ruleName, config]) => {
				return Object.entries(config.descriptors || {}).some(([_descriptorName, syntax]) => {
					return Object.keys(SyntaxGenerator.replacements).some((from) => syntax.includes(from));
				});
			}
		);

		candidates.forEach(([name, config]) => {
			const upgradedDescriptors = this.upgrade(config.descriptors ?? {});
			upgraded[name] = {
				...config,
				descriptors: {
					...config.descriptors,
					...upgradedDescriptors,
				},
			};
		});

		return upgraded;
	}

	/**
	 * @param {Record<string, string>} defs
	 * @returns {Record<string, string>}
	 */
	upgrade(defs) {
		/**
		 * @type {Record<string, string>}
		 */
		const upgraded = {};

		const candidates = Object.entries(defs).filter(([_name, syntax]) => {
			return Object.keys(SyntaxGenerator.replacements).some((from) => syntax.includes(from));
		});

		candidates.forEach(([name, syntax]) => {
			let upgradedSyntax = syntax;
			Object.entries(SyntaxGenerator.replacements).forEach(([from, to]) => {
				upgradedSyntax = upgradedSyntax.replaceAll(from, to);
			});
			upgraded[name] = upgradedSyntax;
		});

		return upgraded;
	}

	async createSyntaxDir() {
		const { syntaxDir } = SyntaxGenerator.paths;
		try {
			await fs.promises.access(syntaxDir);
		} catch {
			await fs.promises.mkdir(syntaxDir);
		}
	}

	async generateTypes() {
		const { syntaxTypes } = SyntaxGenerator.paths;
		const upgraded = this.types;
		const contents = JSON.stringify(upgraded, null, 2);
		await fs.promises.writeFile(syntaxTypes, contents, { encoding: "utf8" });
	}

	async generateProperties() {
		const { syntaxProperties } = SyntaxGenerator.paths
		const upgraded = this.properties;
		const contents = JSON.stringify(upgraded, null, 2);
		await fs.promises.writeFile(syntaxProperties, contents, { encoding: "utf8" });
	}

	async generateAtRules() {
		const { syntaxAtRules } = SyntaxGenerator.paths
		const upgraded = this.atRules;
		const contents = JSON.stringify(upgraded, null, 2);
		await fs.promises.writeFile(syntaxAtRules, contents, { encoding: "utf8" });
	}

	async generate() {
		await this.createSyntaxDir();
		await this.generateTypes();		
		await this.generateProperties();
		await this.generateAtRules();		
	}

}
