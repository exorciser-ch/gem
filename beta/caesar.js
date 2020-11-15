import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import box from "/component/box.js";

var ciphertext = "";

const Caesar = {
	codeA: "A".charCodeAt(),
	codeZ: "Z".charCodeAt(),
	codea: "a".charCodeAt(),
	codez: "z".charCodeAt(),
	k: 3,
	caesar: function(str) {
		let res = "";

		for (let i = 0; i < str.length; i++) {
			let code = str[i].charCodeAt();

			let newcode = code;
			if (code >= this.codeA && code <= this.codeZ) {
				newcode = (code - this.codeA + this.k) % 26 + this.codeA
			} else if (code >= this.codea && code <= this.codez) {
				newcode = (code - this.codea + this.k) % 26 + this.codea
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
			k: 3,
		}
		if (store() && typeof(store()[attr]) !== "undefined") return store()[attr];
		if (query() && typeof(query()[attr]) !== "undefined") return query()[attr];
		return defaults[attr] || "";
	}

	return {
		view: () => {

            Caesar.k = access("k");
			ciphertext = Caesar.caesar(access("plaintext"));

			let letterDivs = [];
			for (let i = 0; i < 26; i++) {
				letterDivs.push(
					m("div" + b `bc rgb(${255-2*i},${255},${255});mb 0px; w 1.1em; ta center; br 3px; ff sans-serif; fs 14px`, {
						style: `border: 1px solid black;`
					}, String.fromCharCode(Caesar.codeA + i))
				);
			}

			let letterDivsLower = [];
			for (let i = access("k"); i < 26 + parseInt(access("k")); i++) {
				letterDivsLower.push(
					m("div" + b `bc rgb(${255},${255-2*(i%26)},${255});mb 0px; w 1.1em; ta center; br 3px; ff sans-serif; fs 14px`, {
						style: `border: 1px solid black;`
					}, String.fromCharCode(Caesar.codeA + i % 26))
				);
			}

			return m(box, {
					icon: app.icon,
				},
				[
					m("div" + b `d flex; fd row`, letterDivs),
					m("div" + b `d flex; fd row`, letterDivsLower),
					m("div" + b `mt 5px; mb 5px; d flex; fd: row`, [
						m("button" + b `ml 0px; b 0px`, {
							onclick: () => {
                                store({...store(),
								    k: (parseInt(access("k")) + 1) % 26
							    });								
							}
						}, "<"),
						m("button", {
							onclick: () => {
                                store({...store(),
								    k: 0
							    });								
							}
						}, "o"),
						m("button", {
							onclick: () => {
                                store({...store(),
								    k: (parseInt(access("k")) + 25) % 26
							    });								
							}
						}, ">")
					]),
					m("div", m("textarea" + b `mt 5px; mb 5px; w 95%`, {
						style: `min-height: 15ex; font-family: monospace;`,
						oninput: function(e) {
							store({...store(),
								plaintext: e.target.value
							});
						}
					}, access("plaintext"))),
					m("div", m("textarea" + b `mt 5px; mb 5px; w 95%`, {
						style: `min-height: 15ex; font-family: monospace;`,
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
		a: 'k',
		t: 'int',
		r: false,
		d: "3",
		c: "key"
	},
	{
		a: 'plaintext',
		t: 'string',
		r: false,
		d: "Beim Jupiter!",
		c: "plain text"
	}
];

export default app;