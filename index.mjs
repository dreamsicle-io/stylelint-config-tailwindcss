
/*
 * Position helpers
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/CSS/position_value#formal_syntax
 */

const positionOne = "[ left | center | right | top | bottom | x-start | x-end | y-start | y-end | block-start | block-end | inline-start | inline-end | <length-percentage> | <--spacing()> ]";
const positionTwo = "[ [ left | center | right | x-start | x-end ] && [ top | center | bottom | y-start | y-end ] | [ left | center | right | x-start | x-end | <length-percentage> | <--spacing()> ] [ top | center | bottom | y-start | y-end | <length-percentage> | <--spacing()> ] | [ block-start | center | block-end ] && [ inline-start | center | inline-end ] | [ start | center | end ]{2} ]";
const positionThree = "[ [ left | center | right ] && [ [ top | bottom ] <length-percentage> | <--spacing()> ] | [ [ left | right ] <length-percentage> | <--spacing()> ] && [ top | center | bottom ] ]";
const positionFour = "[ [ [ left | right | x-start | x-end ] <length-percentage> | <--spacing()> ] && [ [ top | bottom | y-start | y-end ] <length-percentage> | <--spacing()> ] | [ [ block-start | block-end ] <length-percentage> | <--spacing()> ] && [ [ inline-start | inline-end ] <length-percentage> | <--spacing()> ] | [ [ start | end ] <length-percentage> | <--spacing()> ]{2} ]";

/*
 * Background helpers
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/CSS/background#formal_syntax
 */

const bgSize = "[ [ <length-percentage [0,∞]> | <--spacing()> | auto ]{1,2} | cover | contain ]";
const bgPosition = `[ [ ${positionOne} | ${positionTwo} | ${positionFour} ] | ${positionThree} ]`;
const bgLayer = `[ <bg-image> || ${bgPosition} [ / ${bgSize} ]? || <repeat-style> || <attachment> || <visual-box> || <visual-box> ]`;
const finalBGLayer = `[ <bg-image> || ${bgPosition} [ / ${bgSize} ]? || <repeat-style> || <attachment> || <visual-box> || <visual-box> || <'background-color'> ]`;

/*
 * Linear Gradient helpers
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient#formal_syntax
 */

const linearColorHint = `[ <length-percentage> | <--spacing()> ]`;
const colorStopLength = `[ [ <length-percentage> | <--spacing()> ]{1,2} ]`;
const linearColorStop = `[ [ <color> | <--alpha()> ] ${colorStopLength}? ]`;
const colorStopList = `[ ${linearColorStop} , [ ${linearColorHint}? , ${linearColorStop} ]#? ]`;
const linearGradientSyntax = `[ [ [ <angle> | <zero> | to <side-or-corner> ] || <color-interpolation-method> ]? , ${colorStopList} ]`;

/*
 * Radial Gradient helpers
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/CSS/radial-gradient#formal_syntax
 */

const radialGradientPosition = `[ ${positionOne} | ${positionTwo} | ${positionFour} ]`;
const radialExtent = "[ closest-corner | closest-side | farthest-corner | farthest-side ]";
const radialSize = `[ ${radialExtent} | [ <length [0,∞]> | <--spacing()> ] | [ <length-percentage [0,∞]> | <--spacing()> ]{2} ]`;
const radialShape = "[ circle | ellipse ]";
const radialGradientSyntax = `[ [ [ [ ${radialShape} || ${radialSize} ]? [ at ${radialGradientPosition} ]? ] || <color-interpolation-method> ]? , ${colorStopList} ]`;

/**
 * @type {import("stylelint").Config}
 */
const stylelintConfigTailwindCSS = {
	languageOptions: {
		syntax: {
			atRules: {
				// See: https://tailwindcss.com/docs/functions-and-directives#directives
				"theme": {
					prelude: "<custom-ident>",
				},
				"source": {
					prelude: "<string>",
				},
				"utility": {
					prelude: "<custom-ident>",
				},
				"variant": {
					prelude: "<custom-ident>",
				},
				"custom-variant": {
					prelude: "<custom-ident>",
				},
				"reference": {
					prelude: "<string>",
				},
				"apply": {
					prelude: "<custom-ident>+",
				},
			},
			types: {
				// See: https://tailwindcss.com/docs/functions-and-directives#functions
				"--alpha()": "--alpha( <color> / <percentage> )",
				"--spacing()": "--spacing( <number> )",
				"blur()": "blur( [ <length> | <--spacing()> ]? )",
				"drop-shadow()": "drop-shadow( [ [ <color> | <--alpha()> ]? && [ <length> | <--spacing()> ]{2,3} ] )",
				"image()": "image( <image-tags>? [ <image-src>? , [ <color> | <--alpha()> ]? ]! )",
				"cross-fade()": "cross-fade( [ [ <image> | [ <color> | <--alpha()> ] ] && <percentage [0,100]>? ]# )",
				"linear-gradient()": `linear-gradient( [ ${linearGradientSyntax} ] )`,
				"radial-gradient()": `radial-gradient( [ ${radialGradientSyntax} ] )`,
			},
			properties: {
				// Properties that accept `--alpha()`.
				"color": "| <--alpha()>",
				"accent-color": "auto | <'color'>",
				"caret-color": "auto | <'color'>",
				"text-decoration-color": "<'color'>",
				"text-emphasis-color": "<'color'>",
				"text-emphasis": "<'text-emphasis-style'> || <'text-emphasis-color'>",
				"background-color": "<'color'>",
				"border-color": "<'border-top-color'>{1,4}",
				"border-top-color": "| <--alpha()>",
				"border-right-color": "<'border-top-color'>",
				"border-bottom-color": "<'border-top-color'>",
				"border-left-color": "<'border-top-color'>",
				"border-block-color": "<'border-top-color'>{1,2}",
				"border-block-start-color": "<'border-top-color'>",
				"border-block-end-color": "<'border-top-color'>",
				"border-inline-color": "<'border-top-color'>{1,2}",
				"border-inline-start-color": "<'border-top-color'>",
				"border-inline-end-color": "<'border-top-color'>",
				"outline-color": "auto | <'color'>",
				"column-rule-color": "<'color'>",
				"fill": "| <--alpha()>",
				"stroke": "| <--alpha()>",
				"stop-color": "<'color'>",
				"flood-color": "<'color'>",
				"lighting-color": "<'color'>",
				// Properties that accept `--spacing()`.
				"width": "| <--spacing()>",
				"min-width": "| <--spacing()>",
				"max-width": "| <--spacing()>",
				"height": "| <--spacing()>",
				"min-height": "| <--spacing()>",
				"max-height": "| <--spacing()>",
				"block-size": "<'height'>",
				"min-block-size": "<'min-height'>",
				"max-block-size": "<'max-height'>",
				"inline-size": "<'width'>",
				"min-inline-size": "<'min-width'>",
				"max-inline-size": "<'max-width'>",
				"top": "| <--spacing()>",
				"right": "<'top'>",
				"bottom": "<'top'>",
				"left": "<'top'>",
				"inset": "<'top'>{1,4}",
				"inset-block": "<'top'>{1,2}",
				"inset-block-start": "<'top'>",
				"inset-block-end": "<'top'>",
				"inset-inline": "<'top'>{1,2}",
				"inset-inline-start": "<'top'>",
				"inset-inline-end": "<'top'>",
				"margin": "<'margin-top'>{1,4}",
				"margin-top": "| <--spacing()>",
				"margin-right": "<'margin-top'>",
				"margin-bottom": "<'margin-top'>",
				"margin-left": "<'margin-top'>",
				"margin-block": "<'margin-top'>{1,2}",
				"margin-block-start": "<'margin-top'>",
				"margin-block-end": "<'margin-top'>",
				"margin-inline": "<'margin-top'>{1,2}",
				"margin-inline-start": "<'margin-top'>",
				"margin-inline-end": "<'margin-top'>",
				"padding": "<'padding-top'>{1,4}",
				"padding-top": "| <--spacing()>",
				"padding-right": "<'padding-top'>",
				"padding-bottom": "<'padding-top'>",
				"padding-left": "<'padding-top'>",
				"padding-block": "<'padding-top'>{1,2}",
				"padding-block-start": "<'padding-top'>",
				"padding-block-end": "<'padding-top'>",
				"padding-inline": "<'padding-top'>{1,2}",
				"padding-inline-start": "<'padding-top'>",
				"padding-inline-end": "<'padding-top'>",
				"border-width": "<'border-top-width'>{1,4}",
				"border-top-width": "| <--spacing()>",
				"border-right-width": "<'border-top-width'>",
				"border-bottom-width": "<'border-top-width'>",
				"border-left-width": "<'border-top-width'>",
				"border-block-width": "<'border-top-width'>{1,2}",
				"border-block-start-width": "<'border-top-width'>",
				"border-block-end-width": "<'border-top-width'>",
				"border-inline-width": "<'border-top-width'>{1,2}",
				"border-inline-start-width": "<'border-top-width'>",
				"border-inline-end-width": "<'border-top-width'>",
				"outline-width": "| <--spacing()>",
				"outline-offset": "| <--spacing()>",
				"column-width": "| <--spacing()>",
				"flex-basis": "| <--spacing()>",
				"gap": "<'row-gap'> <'column-gap'>?",
				"row-gap": "| <--spacing()>",
				"column-gap": "| <--spacing()>",
				"letter-spacing": "| <--spacing()>",
				"word-spacing": "| <--spacing()>",
				"line-height": "| <--spacing()>",
				"text-indent": "| <--spacing()>",
				"scroll-padding": "<'scroll-padding-top'>{1,4}",
				"scroll-padding-top": "| <--spacing()>",
				"scroll-padding-right": "<'scroll-padding-top'>",
				"scroll-padding-bottom": "<'scroll-padding-top'>",
				"scroll-padding-left": "<'scroll-padding-top'>",
				"scroll-padding-block": "<'scroll-padding-top'>{1,2}",
				"scroll-padding-block-start": "<'scroll-padding-top'>",
				"scroll-padding-block-end": "<'scroll-padding-top'>",
				"scroll-padding-inline": "<'scroll-padding-top'>{1,2}",
				"scroll-padding-inline-start": "<'scroll-padding-top'>",
				"scroll-padding-inline-end": "<'scroll-padding-top'>",
				"scroll-margin": "<'scroll-margin-top'>{1,4}",
				"scroll-margin-top": "| <--spacing()>",
				"scroll-margin-right": "<'scroll-margin-top'>",
				"scroll-margin-bottom": "<'scroll-margin-top'>",
				"scroll-margin-left": "<'scroll-margin-top'>",
				"scroll-margin-block": "<'scroll-margin-top'>{1,2}",
				"scroll-margin-block-start": "<'scroll-margin-top'>",
				"scroll-margin-block-end": "<'scroll-margin-top'>",
				"scroll-margin-inline": "<'scroll-margin-top'>{1,2}",
				"scroll-margin-inline-start": "<'scroll-margin-top'>",
				"scroll-margin-inline-end": "<'scroll-margin-top'>",
				"text-decoration-thickness": "| <--spacing()>",
				"column-rule-width": "| <--spacing()>",
				"background-position": `${bgPosition}#`,
				"background-position-y": "[ center | [ [ top | bottom | y-start | y-end ]? <length-percentage>? <--spacing()>? ]! ]#",
				"background-position-x": "[ center | [ [ left | right | x-start | x-end ]? <length-percentage>? <--spacing()>? ]! ]#",
				"background-size": `${bgSize}#`,
				// Properties that accept both `--alpha()` and `--color()`.
				"border": "<'border-top'>",
				"border-top": "<'border-top-width'> || <'border-top-style'> || <'border-top-color'>",
				"border-bottom": "<'border-top'>",
				"border-left": "<'border-top'>",
				"border-right": "<'border-top'>",
				"border-block": "<'border-top'>",
				"border-block-start": "<'border-top'>",
				"border-block-end": "<'border-top'>",
				"border-inline": "<'border-top'>",
				"border-inline-start": "<'border-top'>",
				"border-inline-end": "<'border-top'>",
				"outline": "<'outline-width'> || <'outline-style'> || <'outline-color'>",
				"column-rule": "<'column-rule-width'> || <'column-rule-style'> || <'column-rule-color'>",
				"background": `${bgLayer}#? , ${finalBGLayer}`,
			},
		},
	},
	rules: {
		"import-notation": "string",
		"lightness-notation": "number",
		"hue-degree-notation": "number",
		"nesting-selector-no-missing-scoping-root": [true, {
			ignoreAtRules: [
				"custom-variant",
			],
		}],
	},
};

export default stylelintConfigTailwindCSS;
