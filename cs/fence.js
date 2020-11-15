import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import box from "/component/box.js";

var ciphertext = "";

const Fence = {
	n: 4,
	encrypt: function(txt, n, showSpaces = true) {
		var lines = [];

		txt = txt.trim().replace(/ /g, "⎵");

		for (let i = 0; i < n; i++) {
			lines[i] = "";
		}

		let k = 0;
		let safety = 0;
		do {
			safety++;
			for (let i = 0; i < n && k < txt.length; i++) {
				lines[i] += txt[k];
				for (let j = 0; j < n; j++) {
					if (j != i) {
						lines[j] += " ";
					}
				}
				k++;
			}
			for (let i = n - 2; i > 0 && k < txt.length; i--) {
				lines[i] += txt[k];
				for (let j = 0; j < n; j++) {
					if (j != i) {
						lines[j] += " ";
					}
				}
				k++;
			}
		} while (k < txt.length && safety < 100);

		console.log(lines.join("\n"));

		var cipher = "";
		for (let i = 0; i < n; i++) {
			cipher += lines[i].replace(/ /g, "");
		}
		if (!showSpaces) {
			cipher = cipher.replace(/⎵/g, " ");
		}
		return {steps: lines.join("\n"), txt: cipher};

	},
	decrypt: function(txt, n, showSpaces = false) {
		txt = txt.trim().replace(/ /g, "⎵");
		let lines = [];
		for (let i = 0; i < n; i++) {
			lines[i] = "";
		}
		let j = 0;
		for (let i = 0; i < n; i++) {
			let mask = this.pattern(i, n);
			let safety = 0;
			do {
				safety++;
				for (let k = 0; k < mask.length && lines[i].length < txt.length; k++) {
					if (mask[k] == "1" && j < txt.length) {
						lines[i] += txt[j++];
					} else {
						lines[i] += " ";
					}
				}
			} while (lines[i].length < txt.length && safety < 100)
		}
		console.log(lines.join("\n"));
		let res = [...lines[0]]
		for (let i = 1; i < lines.length; i++) {
			for (let j = 0; j < lines[i].length; j++) {
				if (lines[i][j] != " ") {
					res[j] = lines[i][j];
				}
			}
		}
		res=res.join("");
		if (!showSpaces) {
			res = res.replace(/⎵/g, " ");
		}
		return {steps: lines.join("\n"), txt: res};
	},
	pattern: function(k, n) {
		let p = "";
		for (let i = 0; i < n; i++) {
			p += (i == k ? "1" : "0");
		}
		for (let i = n - 2; i > 0; i--) {
			p += (i == k ? "1" : "0");
		}
		return p;
	}
}


const app = ({
	query,
	store,
	info
}) => {

	store.map(s => info({
		icn: app.icon,
	}));

	const access = (attr) => {
		let defaults = {
			n: 4,
			direction: "crypt"
		}
		if (store() && typeof(store()[attr]) !== "undefined") return store()[attr];
		if (query() && typeof(query()[attr]) !== "undefined") return query()[attr];
		return defaults[attr] || "";
	}

	return {
		view: () => {

			Fence.n = access("n");
			if (access("direction") == "crypt") {
				ciphertext = Fence.encrypt(access("plaintext"), access("n"), access("showSpaces"));
			} else {
				ciphertext = Fence.decrypt(access("plaintext"), access("n"), access("showSpaces"));
			}

			return m(box, {
					icon: app.icon,
				},
				[
					m("div" + b `mt 5px; mb 5px; d flex; fd: row`, [
						m("input", {
							type: "range",
							min: 2,
							max: 12,
							value: Fence.n,
							oninput: function(e) {
								store({
									...store(),
									n: parseInt(e.target.value)
								});
							}
						}),
						m("div" + b `ml 5px; ta: left; fs: 14px`, "n = " + Fence.n),

					]),
					m("div" + b `d flex; fd: row; mt 15px; mb: 5px;`, [
						m("div" + b `w 100px; mr 5px; mb 0px; min-height: 18px; br 3px; border: 1px solid black; ta center; fs 14px; ${(access("direction")=="decrypt"?"bc yellow;":"")}`, {
							onclick: function() {
								store({
									...store(),
									direction: "decrypt"
								});
							}
						}, "entschlüsseln"),
						m("div" + b `w 100px; mr 5px; mb 0px; min-height: 18px; br 3px; border: 1px solid black; ta center; fs 14px; ${(access("direction")=="crypt"?"bc yellow;":"")}`, {
							onclick: function() {
								store({
									...store(),
									direction: "crypt"
								});
							}
						}, "verschlüsseln"),
					]),
					m("div" + b `d flex; fd: row; mt 15px; mb: 5px;`, [
						m("input", {
							type: "checkbox",
							id: "showSpaces",
							checked: access("showSpaces"),
							oninput: (e) => {
								store({
									...store(),
									showSpaces: e.target.checked
								});
							}
						}),
						m("label"+b`ml 5px`, {
							for: "showSpaces"
						}, "Leerzeichen sichtbar"),
						m("input"+b`ml:10px;`, {
							type: "checkbox",
							id: "showSteps",
							checked: access("showSteps"),
							oninput: (e) => {
								store({
									...store(),
									showSteps: e.target.checked
								});
							}
						}),
						m("label"+b`ml 5px;`, {
							for: "showSteps"
						}, "Zickzack-Muster zeigen"),
					]),
					m("div", m("textarea" + b `mt 5px; mb 5px; w 95%`, {
						style: `min-height: 15ex; font-family: monospace;`,
						oninput: function(e) {
							store({
								...store(),
								plaintext: e.target.value
							});
						}
					}, access("plaintext"))),
					( access("showSteps")?
					m("div"+b`w 95%; overflow: scroll`, m("pre", ciphertext.steps)):null),
					m("div", m("textarea" + b `mt 5px; mb 5px; w 95%`, {
						style: `min-height: 15ex; font-family: monospace;`,
						disabled: true
					}, ciphertext.txt))
				]);
		}
	};
};

app.presets = true;
app.persistent = true;
app.icon = "🔑";
app.options = [{
		a: 'n',
		t: 'int',
		r: true,
		d: "3",
		c: "key"
	},
	{
		a: 'plaintext',
		t: 'string',
		r: false,
		d: "Geheime Botschaft",
		c: "plain text"
	},
	{
		a: 'showSpaces',
		t: 'boolean',
		r: false,
		d: true,
		c: "indicate spaces with ⎵"
	}, 
	{
		a: 'showSteps',
		t: 'boolean',
		r: false,
		d: false,
		c: "show zig zag pattern"
	}, 
	{
		a: 'direction',
		t: 'string',
		r: false,
		d: "crypt",
		c: "crypt or decrypt"
	}
];

export default app;