
// @ts-check

import path from "node:path";
import fs from "node:fs";
import cssTreeSyntax from 'css-tree/definition-syntax-data';
import { version } from "css-tree/dist/version";
import Logger from './Logger.mjs';

/**
 * @typedef {Object} GeneratorLogInfoConfig
 * @property {string} title
 * @property {string} [emoji]
 * @property {string} [description]
 * @property {string} [dataLabel]
 * @property {any} [data]
 * @property {"top" | "bottom" | "both"} [padding]
 */

/**
 * @typedef {Object} GeneratorPaths
 * @property {string} distDir
 * @property {string} distTypes
 * @property {string} distAtRules
 * @property {string} distProperties
 */

/**
 * @typedef {Object} GeneratorAtRuleConfig
 * @property {string} [prelude]
 * @property {Record<string, string> | null} [descriptors]
 */

/**
 * @typedef {Object} GeneratorConfig
 * @property {boolean} [isVerbose]
 */

export default class Generator {

	/**
	 * @type {Record<string, string>}
	 */
	static replacements = {
		"<color>": "<tailwindcss-color>",
		"<length>": "<tailwindcss-length>",
	};
	
	/**
	 * @type {GeneratorPaths}
	 */
	static paths = {
		distDir: path.join(process.cwd(), "dist"),
		distTypes: path.join(process.cwd(), "dist", "types.json"),
		distProperties: path.join(process.cwd(), "dist", "properties.json"),
		distAtRules: path.join(process.cwd(), "dist", "at-rules.json"),
	};

	/**
	 * @type {GeneratorConfig}
	 */
	config;

	/**
	 * @param {GeneratorConfig} config
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
	 * @type {Record<string, GeneratorAtRuleConfig>}
	 */
	get atRules() {
		/**
	   * @type {Record<string, GeneratorAtRuleConfig>}
	   */
		const upgraded = {};

		/**
		 * @type {[string, GeneratorAtRuleConfig][]}
		 */
		const candidates = Object.entries(cssTreeSyntax.atrules).filter(
			/**
			 * @param {[string, GeneratorAtRuleConfig]} entry
			 */
			([_ruleName, config]) => {
				return Object.entries(config.descriptors || {}).some(([_descriptorName, syntax]) => {
					return Object.keys(Generator.replacements).some((from) => syntax.includes(from));
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
			return Object.keys(Generator.replacements).some((from) => syntax.includes(from));
		});

		candidates.forEach(([name, syntax]) => {
			let upgradedSyntax = syntax;
			Object.entries(Generator.replacements).forEach(([from, to]) => {
				upgradedSyntax = upgradedSyntax.replaceAll(from, to);
			});
			upgraded[name] = upgradedSyntax;
		});

		return upgraded;
	}

	async createDist() {
		const { distDir } = Generator.paths;
		try {
			await fs.promises.access(distDir);
		} catch {
			await fs.promises.mkdir(distDir);
		}
	}

	async generateTypes() {
		const { distTypes } = Generator.paths;
		const upgraded = this.types;
		const contents = JSON.stringify(upgraded, null, 2);
		Logger.info({
			title: "Upgrading types",
			description: `Found ${Object.keys(upgraded).length.toLocaleString()} type upgrade candidates`,
			emoji: "⏳",
			dataLabel: "Type candidates",
			data: Object.keys(upgraded).join(", "),
			isVerbose: this.isVerbose,
		});
		await fs.promises.writeFile(distTypes, contents, { encoding: "utf8" });
		Logger.info({
			title: "Types upgraded",
			description: path.relative(process.cwd(), distTypes),
			emoji: "🔨",
			dataLabel: "Upgraded types",
			data: upgraded,
			isVerbose: this.isVerbose,
		});
	}

	async generateProperties() {
		const { distProperties } = Generator.paths;
		const upgraded = this.properties;
		const contents = JSON.stringify(upgraded, null, 2);
		Logger.info({
			title: "Upgrading properties",
			description: `Found ${Object.keys(upgraded).length.toLocaleString()} property upgrade candidates`,
			emoji: "⏳",
			dataLabel: "Property candidates",
			data: Object.keys(upgraded).join(", "),
			isVerbose: this.isVerbose,
		});
		await fs.promises.writeFile(distProperties, contents, { encoding: "utf8" });
		Logger.info({
			title: "Properties upgraded",
			description: path.relative(process.cwd(), distProperties),
			emoji: "🔨",
			dataLabel: "Upgraded properties",
			data: upgraded,
			isVerbose: this.isVerbose,
		});
	}

	async generateAtRules() {
		const { distAtRules } = Generator.paths;
		const upgraded = this.atRules;
		const contents = JSON.stringify(upgraded, null, 2);
		Logger.info({
			title: "Upgrading at-rules",
			description: `Found ${Object.keys(upgraded).length.toLocaleString()} at-rule upgrade candidates`,
			emoji: "⏳",
			dataLabel: "At-rule candidates",
			data: Object.keys(upgraded).join(", "),
			isVerbose: this.isVerbose,
		});
		await fs.promises.writeFile(distAtRules, contents, { encoding: "utf8" });
		Logger.info({
			title: "At-rules upgraded",
			description: path.relative(process.cwd(), distAtRules),
			emoji: "🔨",
			dataLabel: "Upgraded at-rules",
			data: upgraded,
			isVerbose: this.isVerbose,
		});
	}

	async generate() {
		const { distTypes, distProperties, distAtRules } = Generator.paths;
		Logger.info({
			title: "Generating syntax",
			description: `Using css-tree v${version}`,
			emoji: "⚡",
			padding: "bottom",
			dataLabel: "Replacements",
			data: Generator.replacements,
			isVerbose: this.isVerbose,
		});
		await this.createDist();
		await this.generateTypes();		
		await this.generateProperties();
		await this.generateAtRules();		
		Logger.info({
			title: "Syntax generated",
			description: `2 files generated successfully`,
			emoji: "🚀",
			padding: this.isVerbose ? undefined : "top",
			dataLabel: "Files",
			data: [distTypes, distProperties, distAtRules].map(file => path.relative(process.cwd(), file)),
			isVerbose: this.isVerbose,
		});
	}

}
