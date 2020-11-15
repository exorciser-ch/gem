import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import box from "/component/box.js";

var ciphertext = "";

const Affin = {
	aList: [3, 5, 7, 9, 11, 15, 17, 19, 21, 23],
	aInvList: [9, 21, 15, 3, 19, 7, 23, 11, 5, 17],
	a: 3,
	b: 0,
	codeA: "A".charCodeAt(),
	codeZ: "Z".charCodeAt(),
	codea: "a".charCodeAt(),
	codez: "z".charCodeAt(),
	affinEncrypt: function(str) {
		let res = "";

		for (let i = 0; i < str.length; i++) {
			let code = str[i].charCodeAt();
			let newcode = code;
			if (code >= this.codeA && code <= this.codeZ) {
				newcode = ((code - this.codeA) * this.a + this.b) % 26 + this.codeA
			} else if (code >= this.codea && code <= this.codez) {
				newcode = ((code - this.codea) * this.a + this.b) % 26 + this.codea
			}
			res = res + String.fromCharCode(newcode);
		}
		return res;
	},
	affinDecrypt: function(str) {
		let res = "";
		for (let i = 0; i < str.length; i++) {
			let code = str[i].charCodeAt();
			let newcode = code;
			if (code >= this.codeA && code <= this.codeZ) {
				newcode = ((code - this.codeA + 26 - this.b) * this.aInvList[this.aList.indexOf(this.a)]) % 26 + this.codeA
			} else if (code >= this.codea && code <= this.codez) {
				newcode = ((code - this.codea + 26 - this.b) * this.aInvList[this.aList.indexOf(this.a)]) % 26 + this.codea
			}
			res = res + String.fromCharCode(newcode);
		}
		return res;
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
			direction: "crypt",
			a: 3,
			b: 5
		}
		if (store() && typeof(store()[attr]) !== "undefined") return store()[attr];
		if (query() && typeof(query()[attr]) !== "undefined") return query()[attr];
		return defaults[attr] || "";
	}

	return {
		view: () => {

			Affin.a = access("a");
			Affin.b = access("b");
			let aDivs = [];
			for (let i = 0; i < Affin.aList.length; i++) {
				aDivs.push(
					m("div" + b `br 3px; w: 2em; border: 1px solid black; ta center; fs 14px; ${(Affin.a==Affin.aList[i])?"bc yellow":""}`, {
						onclick: function(e) {
							store({
								...store(),
								a: parseInt(e.target.innerText)
							});
						}
					}, Affin.aList[i])
				);
			}

			ciphertext = (access("direction") == "crypt" ?
				Affin.affinEncrypt(access("plaintext")) :
				Affin.affinDecrypt(access("plaintext")));

			return m(box, {
					icon: app.icon,
				},
				[
					m("div" + b `d flex; fd row; ff: sans-serif`,
						[m("div" + b `mr 5px; d flex; fd row; fs 14px;`, "a = "), ...aDivs]),
					m("div" + b `mt 10px; d flex; fd row`, [
						m("input", {
							type: "range",
							min: 0,
							max: 25,
							value: Affin.b,
							oninput: function(e) {
								store({
									...store(),
									b: parseInt(e.target.value)
								});
							}
						}),
						m("div" + b `ml 5px; ta: left; fs: 14px`, "b = " + Affin.b)
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
						}, "verschlüsseln")
					]),

					m("div", m("textarea" + b `mt 5px; mb 5px; w 95%; ff: monospace; min-height: 15ex;`, {
						oninput: function(e) {
							store({
								...store(),
								plaintext: e.target.value
							});
						}
					}, access("plaintext"))),
					m("div", m("textarea" + b `mt 5px; mb 5px; w 95%; ff: monospace; min-height: 15ex;`, {
						disabled: true
					}, ciphertext))
				]);

		}
	};
};

app.presets = true;
app.persistent = true;
app.icon = "🔑";
app.options = [{
		a: 'a',
		t: 'int',
		r: false,
		d: 3,
		c: "multiplication key"
	}, {
		a: 'b',
		t: 'int',
		r: false,
		d: 5,
		c: "addition key"
	}, {
		a: 'direction',
		t: 'string',
		r: false,
		d: "crypt",
		c: "direction (crypt/decrypt)"
	},
	{
		a: 'plaintext',
		t: 'string',
		r: false,
		d: "Streng geheime Botschaft",
		c: "plain text"
	}
];

export default app;