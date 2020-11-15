import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";

import box from "/component/box.js";
import {col} from "/core/utils.js";


const subs = ['', '✅', '❌'];
const cols = ['#ddd', '#0f0', '#f00' ];

function fitToContent(a,b){var c=a.clientHeight;(!b||b>c)&&(c=Math.max(a.scrollHeight,c),b&&(c=Math.min(b,c)),c>a.clientHeight&&(a.style.height=c+"px"))}
function resize(e) {
    e.style.boxSizing = 'border-box';
    const offset = e.offsetHeight - e.clientHeight;
    e.style.height = 'auto';
    e.style.height = e.scrollHeight + offset + 'px';
}
export const match = ({query, store, info}) => {
	
	
	// helpers
	//const adjustHeight = (e) => {
	//	e.style.height = 'auto';
	//	e.style.height = (1+e.scrollHeight) + 'px';
	//	//e.style.maxHeight = '80vh';
	//}
	
	const regexp = query.map(v => {
		let r = /(?:)/;
		try {
				
			r = new RegExp(v.regexp, v.flags);
			//console.log(r)
		} catch (e) {
			
		} m.redraw(); return r;
	})

	// is reset enabled?
	const enabled = () => store() && query() && store().text != query().text;
	
	const tools = () => [
		m(`span`+b`p 0 0.5ex; m 0.2ex; bc goldenrod; c white; br 0.5ex; cursor: pointer`, {
			disabled: !enabled(),
			onclick: () => { store(undefined); info(undefined) }
		},'reset')
	]

	const value = () => {
		if (!store()) {
			if (query().text) return query().text;
			else return '';
		} return store().text;
	}
	
	const i = m.stream.merge([store, query]).map( ([v,q]) => {
		let _, s = /(:)/;
		try { s = new RegExp(q.strip, 'g')
			
		} catch (e) {
			console.warn(e)
		}
		
		if (!v)
			_ = {
				icn: match.icon,
				sub: (q.subs && q.subs[0]) || subs[0],
				col: (q.cols && q.cols[0]) || cols[0],
			};
		else if (v.text && v.text.length > 0 && v.text.replace(s,'').match(regexp()))
			_ = {
				icn: match.icon,
				sub: (q.subs && q.subs[1]) || subs[1],
				col: (q.cols && q.cols[1]) || cols[1],
			};
		else
			_ = {
				icn: match.icon,
				sub: (q.subs && q.subs[2]) || subs[2],
				col: (q.cols && q.cols[2]) || cols[2],
			};
		v && info(_);
		return _;
	});
	
	
	
	return { view: () => m(box, {
			icon: match.icon,
			sub: (i() && i().sub) || (query().subs && query().subs[0]) || subs[0],
			tools: tools()
		}, [
		m('div'+b`d flex; fd column`,
		m('textarea'+b`font-family: monospace; border: none`, {
			style: {
				backgroundColor: col.pastel( (i() && i().col)
					|| (query().cols && query().cols[0])
					|| cols[0],
				.15)
			},
			value: value(),
			onupdate: ({dom}) => fitToContent(dom),
			oninput: ({target: t}) =>  {
				store({text: t.value});
				fitToContent(t)
			}
		}))
	])}
	
}
match.meta = {
	//share: true,
	adjust: true,
}
match.icon = "🕵";
match.presets = true;
match.persistent = true;
match.options = [
	{a: 'text', t: 'string', r: false, d: "", c: 'Text Preset' },
	{a: 'regexp', t: 'string', r: false, d: "", c: 'Regular Expression' },
	{a: 'flags', t: 'string', r: false, d: "", c: 'RegExp Flags [igm]+' },
	{a: 'strip', t: 'string', r: false, d: "", c: 'remove stuff befor checking' },
	{a: 'subs', t: 'list', r: false, d: subs, c: 'Sub Markers' },
	{a: 'cols', t: 'list', r: false, d: cols, c: 'Color Set' }
]

export default match;