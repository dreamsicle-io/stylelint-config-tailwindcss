
// @ts-check

import path from "node:path";
import fs from "node:fs";
import cssTreeSyntax from 'css-tree/definition-syntax-data';
import { version } from "css-tree/dist/version";
import Logger from './Logger.mjs';

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

/**
 * @typedef {Object} SyntaxGeneratorConfig
 * @property {boolean} [isVerbose]
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
	 * @type {SyntaxGeneratorConfig}
	 */
	config;

	/**
	 * @param {SyntaxGeneratorConfig} config
	 */
	constructor(config) {
		this.config = config;
	}

	/**
	 * @type {boolean}
	 */
	get isVerbose() {
		return this.config.isVerbose ?? false;
	}

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
		Logger.info({
			title: "Upgrading types",
			description: `Found ${Object.keys(upgraded).length.toLocaleString("en-US")} type upgrade candidates`,
			emoji: "⏳",
			dataLabel: "Type candidates",
			data: Object.keys(upgraded).join(", "),
			isVerbose: this.isVerbose,
		});
		await fs.promises.writeFile(syntaxTypes, contents, { encoding: "utf8" });
		Logger.info({
			title: "Types upgraded",
			description: path.relative(process.cwd(), syntaxTypes),
			emoji: "🔨",
			dataLabel: "Upgraded types",
			data: upgraded,
			isVerbose: this.isVerbose,
		});
	}

	async generateProperties() {
		const { syntaxProperties } = SyntaxGenerator.paths;
		const upgraded = this.properties;
		const contents = JSON.stringify(upgraded, null, 2);
		Logger.info({
			title: "Upgrading properties",
			description: `Found ${Object.keys(upgraded).length.toLocaleString("en-US")} property upgrade candidates`,
			emoji: "⏳",
			dataLabel: "Property candidates",
			data: Object.keys(upgraded).join(", "),
			isVerbose: this.isVerbose,
		});
		await fs.promises.writeFile(syntaxProperties, contents, { encoding: "utf8" });
		Logger.info({
			title: "Properties upgraded",
			description: path.relative(process.cwd(), syntaxProperties),
			emoji: "🔨",
			dataLabel: "Upgraded properties",
			data: upgraded,
			isVerbose: this.isVerbose,
		});
	}

	async generateAtRules() {
		const { syntaxAtRules } = SyntaxGenerator.paths;
		const upgraded = this.atRules;
		const contents = JSON.stringify(upgraded, null, 2);
		Logger.info({
			title: "Upgrading at-rules",
			description: `Found ${Object.keys(upgraded).length.toLocaleString("en-US")} at-rule upgrade candidates`,
			emoji: "⏳",
			dataLabel: "At-rule candidates",
			data: Object.keys(upgraded).join(", "),
			isVerbose: this.isVerbose,
		});
		await fs.promises.writeFile(syntaxAtRules, contents, { encoding: "utf8" });
		Logger.info({
			title: "At-rules upgraded",
			description: path.relative(process.cwd(), syntaxAtRules),
			emoji: "🔨",
			dataLabel: "Upgraded at-rules",
			data: upgraded,
			isVerbose: this.isVerbose,
		});
	}

	async generate() {
		const { syntaxTypes, syntaxProperties, syntaxAtRules } = SyntaxGenerator.paths;
		const syntaxFiles = [syntaxTypes, syntaxProperties, syntaxAtRules];
		Logger.info({
			title: "Generating syntax",
			description: `Using css-tree v${version}`,
			emoji: "⚡",
			padding: "bottom",
			dataLabel: "Replacements",
			data: SyntaxGenerator.replacements,
			isVerbose: this.isVerbose,
		});
		await this.createSyntaxDir();
		await this.generateTypes();		
		await this.generateProperties();
		await this.generateAtRules();		
		Logger.info({
			title: "Syntax generated",
			description: `${syntaxFiles.length.toLocaleString("en-US")} files generated successfully`,
			emoji: "🚀",
			padding: this.isVerbose ? undefined : "top",
			dataLabel: "Files",
			data: syntaxFiles.map(file => path.relative(process.cwd(), file)),
			isVerbose: this.isVerbose,
		});
	}

}
