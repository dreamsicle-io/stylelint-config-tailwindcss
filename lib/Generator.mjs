
// @ts-check

import cssTreeSyntax from 'css-tree/definition-syntax-data';
import { version } from "css-tree/dist/version";
import path from "node:path";
import fs from "node:fs";
import chalk from "chalk";

/**
 * @typedef {object} GeneratorLogInfoConfig
 * @property {string} title
 * @property {string} [emoji]
 * @property {string} [description]
 * @property {string} [dataLabel]
 * @property {any} [data]
 * @property {"top" | "bottom" | "both"} [padding]
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
		"<color>": "[ <color> | <--alpha()> ]",
		"<length>": "[ <length> | <--spacing()> ]",
	};
	
	/**
	 * @type {Record<string, string>}
	 */
	static paths = {
		distDir: path.join(process.cwd(), "dist"),
		distTypes: path.join(process.cwd(), "dist", "types.json"),
		distProperties: path.join(process.cwd(), "dist", "properties.json"),
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
	 * @param {GeneratorLogInfoConfig} config
	 */
	logInfo({ title, description, emoji, data, dataLabel, padding }) {
		const hasData = (data && this.isVerbose);
		/** 
		 * Construct the text.
		 * @type {string}
		 */
		let text = chalk.bold.green(title);
		if (description) text += ` ${chalk.dim("―")} ${description}`;
		if (emoji) text = `${emoji} ${text}`;
		// Add padding.
		if ((padding === "top") || (padding === "both")) text = `\n${text}`;
		if (((padding === "bottom") || (padding === "both")) && ! hasData) text = `${text}\n`;
		/** 
		 * Construct the params array.
		 * @type {any[]}
		 */
		let params = [text];
		// Construct the data.
		if (hasData) params.push(...[`\n\n💡 ${chalk.bold.cyan(dataLabel || "Data")} →`, data, "\n"]);
		console.info(...params);
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

		const candidates = Object.entries(defs).filter(([_type, syntax]) => {
			return Object.keys(Generator.replacements).some((key) => syntax.includes(key));
		});

		candidates.forEach(([type, syntax]) => {
			let upgradedSyntax = syntax;
			Object.entries(Generator.replacements).forEach(([key, replacement]) => {
				upgradedSyntax = upgradedSyntax.replaceAll(key, replacement);
			});
			upgraded[type] = upgradedSyntax;
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
		this.logInfo({
			title: "Generating upgraded types",
			description: `Found ${Object.keys(upgraded).length.toLocaleString()} type upgrade candidates`,
			emoji: "⏳",
			dataLabel: "Type candidates",
			data: Object.keys(upgraded).join(", "),
		});
		await fs.promises.writeFile(distTypes, contents, { encoding: "utf8" });
		this.logInfo({
			title: "Generated upgraded types",
			description: path.relative(process.cwd(), distTypes),
			emoji: "🔨",
			dataLabel: "Upgraded types",
			data: upgraded,
		});
	}

	async generateProperties() {
		const { distProperties } = Generator.paths;
		const upgraded = this.properties;
		const contents = JSON.stringify(upgraded, null, 2);
		this.logInfo({
			title: "Generating upgraded properties",
			description: `Found ${Object.keys(upgraded).length.toLocaleString()} property upgrade candidates`,
			emoji: "⏳",
			dataLabel: "Property candidates",
			data: Object.keys(upgraded).join(", "),
		});
		await fs.promises.writeFile(distProperties, contents, { encoding: "utf8" });
		this.logInfo({
			title: "Generated upgraded properties",
			description: path.relative(process.cwd(), distProperties),
			emoji: "🔨",
			dataLabel: "Upgraded properties",
			data: upgraded,
		});
	}

	async generate() {
		const { distTypes, distProperties } = Generator.paths;
		this.logInfo({
			title: "Generating syntax",
			description: `Using css-tree v${version}`,
			emoji: "⚡",
			padding: "bottom",
			dataLabel: "Replacements",
			data: Generator.replacements,
		});
		await this.createDist();
		await this.generateTypes();		
		await this.generateProperties();
		this.logInfo({
			title: "Generated syntax",
			description: `2 files generated successfully`,
			emoji: "🚀",
			padding: this.isVerbose ? undefined : "top",
			dataLabel: "Files",
			data: [distTypes, distProperties].map(file => path.relative(process.cwd(), file)),
		});
	}

}
