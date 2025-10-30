
// @ts-check

import chalk from "chalk";

/**
 * @typedef {Object} LoggerInfoConfig
 * @property {string} title
 * @property {string} [emoji]
 * @property {string} [description]
 * @property {string} [dataLabel]
 * @property {unknown} [data]
 * @property {"top" | "bottom" | "both"} [padding]
 * @property {boolean} [isVerbose]
 */

/**
 * @typedef {Object} LoggerErrorConfig
 * @property {unknown} error
 * @property {boolean} [isVerbose]
 */

export default class Logger {

	/**
	 * @param {LoggerInfoConfig} config
	 */
	static info({ title, description, emoji, data, dataLabel, padding, isVerbose }) {
		const hasData = (!!data && !!isVerbose);
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
	 * @param {LoggerErrorConfig} config
	 */
	static error({ error, isVerbose }) {
		/**
		 * @type {Error}
		 */
		const errorInstance = (error instanceof Error) ? error : new Error((typeof error === 'string') ? error : 'An unknown error has occurred', { cause: error });
		if (isVerbose) {
			console.error(chalk.bold.redBright(`\n❌ Error: ${errorInstance.message}\n\n`), errorInstance, '\n');
		} else {
			console.error(chalk.bold.redBright(`\n❌ Error: ${errorInstance.message}\n`));
		}
	}

}
