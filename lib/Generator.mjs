
// @ts-check

import cssTreeData from "css-tree/dist/data";
import { version } from "css-tree/dist/version";
import path from "node:path";
import fs from "node:fs";
import chalk from "chalk";

/**
 * @typedef {Object} GeneratorOutputFiles
 * @property {string} types
 * @property {string} properties
 */

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
		"<color>": "[<color>|<--alpha()>]",
		"<length>": "[<length>|<--spacing()>]",
	};
	
	/**
	 * @type {GeneratorOutputFiles}
	 */
	static outputFiles = {
		types: path.join(process.cwd(), "dist", "types.json"),
		properties: path.join(process.cwd(), "dist", "properties.json"),
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

	get types() {
		return this.upgrade(cssTreeData.types);
	}

	get properties() {
		return this.upgrade(cssTreeData.properties);
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

	async generateTypes() {
		const { types: outputFile } = Generator.outputFiles;
		const upgraded = this.types;
		const contents = JSON.stringify(upgraded, null, 2);
		this.logInfo({
			title: "Generating upgraded types",
			description: `Found ${Object.keys(upgraded).length.toLocaleString()} type upgrade candidates`,
			emoji: "⚡",
			dataLabel: "Type candidates",
			data: Object.keys(upgraded).join(", "),
		});
		await fs.promises.writeFile(outputFile, contents, { encoding: "utf8" });
		this.logInfo({
			title: "Generated upgraded types",
			description: path.relative(process.cwd(), outputFile),
			emoji: "⚡",
			dataLabel: "Upgraded types",
			data: upgraded,
		});
	}

	async generateProperties() {
		const { properties: outputFile } = Generator.outputFiles;
		const upgraded = this.properties;
		const contents = JSON.stringify(upgraded, null, 2);
		this.logInfo({
			title: "Generating upgraded properties",
			description: `Found ${Object.keys(upgraded).length.toLocaleString()} property upgrade candidates`,
			emoji: "⚡",
			dataLabel: "Property candidates",
			data: Object.keys(upgraded).join(", "),
		});
		await fs.promises.writeFile(outputFile, contents, { encoding: "utf8" });
		this.logInfo({
			title: "Generated upgraded properties",
			description: path.relative(process.cwd(), outputFile),
			emoji: "⚡",
			dataLabel: "Upgraded properties",
			data: upgraded,
		});
	}

	async generate() {
		this.logInfo({
			title: "Generating",
			description: `Using css-tree v${version}`,
			emoji: "⚡",
			padding: "bottom",
			dataLabel: "Replacements",
			data: Generator.replacements,
		});
		await this.generateTypes();		
		await this.generateProperties();
		this.logInfo({
			title: "Generated successfully",
			description: path.relative(process.cwd(), "dist"),
			emoji: "⚡",
			padding: this.isVerbose ? undefined : "top",
			dataLabel: "Files",
			data: Object.values(Generator.outputFiles).map(file => path.relative(process.cwd(), file)),
		});
	}

}
