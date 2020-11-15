import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import box from "/component/box.js";
import Tooltip from "/component/tooltip.js";

const colorCodes = {
	"#F0F8FF": "AliceBlue",
	"#FAEBD7": "AntiqueWhite",
	"#00FFFF": "Aqua",
	"#7FFFD4": "Aquamarine",
	"#F0FFFF": "Azure",
	"#F5F5DC": "Beige",
	"#FFE4C4": "Bisque",
	"#000000": "Black",
	"#FFEBCD": "BlanchedAlmond",
	"#0000FF": "Blue",
	"#8A2BE2": "BlueViolet",
	"#A52A2A": "Brown",
	"#DEB887": "BurlyWood",
	"#5F9EA0": "CadetBlue",
	"#7FFF00": "Chartreuse",
	"#D2691E": "Chocolate",
	"#FF7F50": "Coral",
	"#6495ED": "CornflowerBlue",
	"#FFF8DC": "Cornsilk",
	"#DC143C": "Crimson",
	// alias "#00FFFF": "Cyan",
	"#00008B": "DarkBlue",
	"#008B8B": "DarkCyan",
	"#B8860B": "DarkGoldenRod",
	"#A9A9A9": "DarkGray",
	// alias "#A9A9A9": "DarkGrey",
	"#006400": "DarkGreen",
	"#BDB76B": "DarkKhaki",
	"#8B008B": "DarkMagenta",
	"#556B2F": "DarkOliveGreen",
	"#FF8C00": "DarkOrange",
	"#9932CC": "DarkOrchid",
	"#8B0000": "DarkRed",
	"#E9967A": "DarkSalmon",
	"#8FBC8F": "DarkSeaGreen",
	"#483D8B": "DarkSlateBlue",
	"#2F4F4F": "DarkSlateGray",
	// alias "#2F4F4F": "DarkSlateGrey",
	"#00CED1": "DarkTurquoise",
	"#9400D3": "DarkViolet",
	"#FF1493": "DeepPink",
	"#00BFFF": "DeepSkyBlue",
	"#696969": "DimGray",
	// alias "#696969": "DimGrey",
	"#1E90FF": "DodgerBlue",
	"#B22222": "FireBrick",
	"#FFFAF0": "FloralWhite",
	"#228B22": "ForestGreen",
	"#FF00FF": "Fuchsia",
	"#DCDCDC": "Gainsboro",
	"#F8F8FF": "GhostWhite",
	"#FFD700": "Gold",
	"#DAA520": "GoldenRod",
	"#808080": "Gray",
	// alias "#808080": "Grey",
	"#008000": "Green",
	"#ADFF2F": "GreenYellow",
	"#F0FFF0": "HoneyDew",
	"#FF69B4": "HotPink",
	"#CD5C5C": "IndianRed",
	"#4B0082": "Indigo",
	"#FFFFF0": "Ivory",
	"#F0E68C": "Khaki",
	"#E6E6FA": "Lavender",
	"#FFF0F5": "LavenderBlush",
	"#7CFC00": "LawnGreen",
	"#FFFACD": "LemonChiffon",
	"#ADD8E6": "LightBlue",
	"#F08080": "LightCoral",
	"#E0FFFF": "LightCyan",
	"#FAFAD2": "LightGoldenRodYellow",
	"#D3D3D3": "LightGray",
	// alias "#D3D3D3": "LightGrey",
	"#90EE90": "LightGreen",
	"#FFB6C1": "LightPink",
	"#FFA07A": "LightSalmon",
	"#20B2AA": "LightSeaGreen",
	"#87CEFA": "LightSkyBlue",
	"#778899": "LightSlateGray",
	// alias "#778899": "LightSlateGrey",
	"#B0C4DE": "LightSteelBlue",
	"#FFFFE0": "LightYellow",
	"#00FF00": "Lime",
	"#32CD32": "LimeGreen",
	"#FAF0E6": "Linen",
	// alias "#FF00FF": "Magenta",
	"#800000": "Maroon",
	"#66CDAA": "MediumAquaMarine",
	"#0000CD": "MediumBlue",
	"#BA55D3": "MediumOrchid",
	"#9370DB": "MediumPurple",
	"#3CB371": "MediumSeaGreen",
	"#7B68EE": "MediumSlateBlue",
	"#00FA9A": "MediumSpringGreen",
	"#48D1CC": "MediumTurquoise",
	"#C71585": "MediumVioletRed",
	"#191970": "MidnightBlue",
	"#F5FFFA": "MintCream",
	"#FFE4E1": "MistyRose",
	"#FFE4B5": "Moccasin",
	"#FFDEAD": "NavajoWhite",
	"#000080": "Navy",
	"#FDF5E6": "OldLace",
	"#808000": "Olive",
	"#6B8E23": "OliveDrab",
	"#FFA500": "Orange",
	"#FF4500": "OrangeRed",
	"#DA70D6": "Orchid",
	"#EEE8AA": "PaleGoldenRod",
	"#98FB98": "PaleGreen",
	"#AFEEEE": "PaleTurquoise",
	"#DB7093": "PaleVioletRed",
	"#FFEFD5": "PapayaWhip",
	"#FFDAB9": "PeachPuff",
	"#CD853F": "Peru",
	"#FFC0CB": "Pink",
	"#DDA0DD": "Plum",
	"#B0E0E6": "PowderBlue",
	"#800080": "Purple",
	"#663399": "RebeccaPurple",
	"#FF0000": "Red",
	"#BC8F8F": "RosyBrown",
	"#4169E1": "RoyalBlue",
	"#8B4513": "SaddleBrown",
	"#FA8072": "Salmon",
	"#F4A460": "SandyBrown",
	"#2E8B57": "SeaGreen",
	"#FFF5EE": "SeaShell",
	"#A0522D": "Sienna",
	"#C0C0C0": "Silver",
	"#87CEEB": "SkyBlue",
	"#6A5ACD": "SlateBlue",
	"#708090": "SlateGray",
	// alias "#708090": "SlateGrey",
	"#FFFAFA": "Snow",
	"#00FF7F": "SpringGreen",
	"#4682B4": "SteelBlue",
	"#D2B48C": "Tan",
	"#008080": "Teal",
	"#D8BFD8": "Thistle",
	"#FF6347": "Tomato",
	"#40E0D0": "Turquoise",
	"#EE82EE": "Violet",
	"#F5DEB3": "Wheat",
	"#FFFFFF": "White",
	"#F5F5F5": "WhiteSmoke",
	"#FFFF00": "Yellow",
	"#9ACD32": "YellowGreen"
};

const colorNames = {
	"aliceblue": "#f0f8ff",
	"antiquewhite": "#faebd7",
	"aqua": "#00ffff",
	"aquamarine": "#7fffd4",
	"azure": "#f0ffff",
	"beige": "#f5f5dc",
	"bisque": "#ffe4c4",
	"black": "#000000",
	"blanchedalmond": "#ffebcd",
	"blue": "#0000ff",
	"blueviolet": "#8a2be2",
	"brown": "#a52a2a",
	"burlywood": "#deb887",
	"cadetblue": "#5f9ea0",
	"chartreuse": "#7fff00",
	"chocolate": "#d2691e",
	"coral": "#ff7f50",
	"cornflowerblue": "#6495ed",
	"cornsilk": "#fff8dc",
	"crimson": "#dc143c",
	"cyan": "#00ffff",
	"darkblue": "#00008b",
	"darkcyan": "#008b8b",
	"darkgoldenrod": "#b8860b",
	"darkgray": "#a9a9a9",
	"darkgrey": "#a9a9a9",
	"darkgreen": "#006400",
	"darkkhaki": "#bdb76b",
	"darkmagenta": "#8b008b",
	"darkolivegreen": "#556b2f",
	"darkorange": "#ff8c00",
	"darkorchid": "#9932cc",
	"darkred": "#8b0000",
	"darksalmon": "#e9967a",
	"darkseagreen": "#8fbc8f",
	"darkslateblue": "#483d8b",
	"darkslategray": "#2f4f4f",
	"darkslategrey": "#2f4f4f",
	"darkturquoise": "#00ced1",
	"darkviolet": "#9400d3",
	"deeppink": "#ff1493",
	"deepskyblue": "#00bfff",
	"dimgray": "#696969",
	"dimgrey": "#696969",
	"dodgerblue": "#1e90ff",
	"firebrick": "#b22222",
	"floralwhite": "#fffaf0",
	"forestgreen": "#228b22",
	"fuchsia": "#ff00ff",
	"gainsboro": "#dcdcdc",
	"ghostwhite": "#f8f8ff",
	"gold": "#ffd700",
	"goldenrod": "#daa520",
	"gray": "#808080",
	"grey": "#808080",
	"green": "#008000",
	"greenyellow": "#adff2f",
	"honeydew": "#f0fff0",
	"hotpink": "#ff69b4",
	"indianred": "#cd5c5c",
	"indigo": "#4b0082",
	"ivory": "#fffff0",
	"khaki": "#f0e68c",
	"lavender": "#e6e6fa",
	"lavenderblush": "#fff0f5",
	"lawngreen": "#7cfc00",
	"lemonchiffon": "#fffacd",
	"lightblue": "#add8e6",
	"lightcoral": "#f08080",
	"lightcyan": "#e0ffff",
	"lightgoldenrodyellow": "#fafad2",
	"lightgray": "#d3d3d3",
	"lightgrey": "#d3d3d3",
	"lightgreen": "#90ee90",
	"lightpink": "#ffb6c1",
	"lightsalmon": "#ffa07a",
	"lightseagreen": "#20b2aa",
	"lightskyblue": "#87cefa",
	"lightslategray": "#778899",
	"lightslategrey": "#778899",
	"lightsteelblue": "#b0c4de",
	"lightyellow": "#ffffe0",
	"lime": "#00ff00",
	"limegreen": "#32cd32",
	"linen": "#faf0e6",
	"magenta": "#ff00ff",
	"maroon": "#800000",
	"mediumaquamarine": "#66cdaa",
	"mediumblue": "#0000cd",
	"mediumorchid": "#ba55d3",
	"mediumpurple": "#9370db",
	"mediumseagreen": "#3cb371",
	"mediumslateblue": "#7b68ee",
	"mediumspringgreen": "#00fa9a",
	"mediumturquoise": "#48d1cc",
	"mediumvioletred": "#c71585",
	"midnightblue": "#191970",
	"mintcream": "#f5fffa",
	"mistyrose": "#ffe4e1",
	"moccasin": "#ffe4b5",
	"navajowhite": "#ffdead",
	"navy": "#000080",
	"oldlace": "#fdf5e6",
	"olive": "#808000",
	"olivedrab": "#6b8e23",
	"orange": "#ffa500",
	"orangered": "#ff4500",
	"orchid": "#da70d6",
	"palegoldenrod": "#eee8aa",
	"palegreen": "#98fb98",
	"paleturquoise": "#afeeee",
	"palevioletred": "#db7093",
	"papayawhip": "#ffefd5",
	"peachpuff": "#ffdab9",
	"peru": "#cd853f",
	"pink": "#ffc0cb",
	"plum": "#dda0dd",
	"powderblue": "#b0e0e6",
	"purple": "#800080",
	"rebeccapurple": "#663399",
	"red": "#ff0000",
	"rosybrown": "#bc8f8f",
	"royalblue": "#4169e1",
	"saddlebrown": "#8b4513",
	"salmon": "#fa8072",
	"sandybrown": "#f4a460",
	"seagreen": "#2e8b57",
	"seashell": "#fff5ee",
	"sienna": "#a0522d",
	"silver": "#c0c0c0",
	"skyblue": "#87ceeb",
	"slateblue": "#6a5acd",
	"slategray": "#708090",
	"slategrey": "#708090",
	"snow": "#fffafa",
	"springgreen": "#00ff7f",
	"steelblue": "#4682b4",
	"tan": "#d2b48c",
	"teal": "#008080",
	"thistle": "#d8bfd8",
	"tomato": "#ff6347",
	"turquoise": "#40e0d0",
	"violet": "#ee82ee",
	"wheat": "#f5deb3",
	"white": "#ffffff",
	"whitesmoke": "#f5f5f5",
	"yellow": "#ffff00",
	"yellowgreen": "#9acd32"
}


const app = ({
	query
}) => {


	const color = query.map(v => {
		try {
			let g;
			v = v.c;
			v = v.trim().toLowerCase().replace(/\s*/g, '');
			if (colorNames[v]) return v
			if ((g = v.match(/^#([\da-f])([\da-f])([\da-f])$/i)) ||
				(g = v.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i))) return m('span', '#',
				['red', 'green', 'blue'].map((c, i) => m('span' + b `color: ${c}`, g[i + 1])))
			if (g = v.match(/^(rgba?)\((\d+%?),(\d+%?),(\d+%?)(,[0-9.]+)?\)$/i)) return m('span', g[1], '(',
				m('span' + b `color: red`, g[2]), ',',
				m('span' + b `color: green`, g[3]), ',',
				m('span' + b `color: blue`, g[4]),
				g[5] || '', ')'
			)
		} catch (e) {
			return 'invalid color';
		}
	});

	const tip = query.map(v => {
		let g;
		try {
			v = v.c.trim().toLowerCase();
			
			if (colorNames[v]) {
				let triplet = colorNames[v];
				let g = triplet.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
				return m('table'+b`m 0`,
				    m('tr', 
				        m('th', 'html color name'),
				        m('td', m('tt', v))),
				    m('tr',
				        m('th', 'hex tripplet'),
				        m('td', m('tt', triplet))),
				    m('tr',
				        m('th', 'RGB color'),
				        m('td', m('tt', `rgb(${parseInt(g[1], 16)},${parseInt(g[2], 16)},${parseInt(g[3], 16)})`))));
			}
			if ((g = v.match(/^#([\da-f])([\da-f])([\da-f])$/i)) ||
				(g = v.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i)))
				return 'hex triplet für Farbwert rgb(' +
					parseInt(g[1], 16) + ',' +
					parseInt(g[2], 16) + ',' +
					parseInt(g[3], 16) + ')' +
					(colorCodes[v.toUpperCase()] ? `: Farbe "${colorCodes[v.toUpperCase()]}"` : "");
			if (g = v.match(/^rgb\(([0-9]+),([0-9]+),([0-9]+)\)$/i)) {
				let triplet = "#" + ((g[1] = parseInt(g[1])) > 15 ? g[1].toString(16) : "0" + g[1].toString(16)) +
					((g[2] = parseInt(g[2])) > 15 ? g[2].toString(16) : "0" + g[2].toString(16)) +
					((g[3] = parseInt(g[3])) > 15 ? g[3].toString(16) : "0" + g[3].toString(16));
				return 'RGB-Farbe zum hex triplet ' + triplet +
					(colorCodes[triplet.toUpperCase()] ? `: Farbe "${colorCodes[triplet.toUpperCase()]}"` : "");
			}
			return 'RGB Farbe'
		} catch (e) {
			return e.message;
		}
	})

	return {
		view: () => m(Tooltip, {
				tip: tip()
			},
			m('span' + b `
			
			font-family: monospace;
			font-weigth: bold
		`,
				color(), ' ',
				m('span' + b `
				display: inline-block;
				border: 1px solid black;
				height: .65em;
				width: 2em;
				
				background-color: ${query().c}`, '')
			)
		)
	}
}

app.options = [{
	a: 'c',
	t: 'text',
	r: true,
	d: '',
	c: 'rgb color: rgb(...) or #XXXXXX'
}, ];

export default app;