import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";

import box from "/component/box.js";
import {col} from "/core/utils.js";

const limit = 5000;

export const plain = ({query, store, info}) => {

	console.log('chk auto deploy 3')
	// is reset enabled?
	const enabled = () => store() && query() && store().text != query().text;

	const tools = () => [
		m(`span`+b`p 0 0.5ex; m 0.2ex; bc goldenrod; c white; br 0.5ex; cursor: pointer`, {
			disabled: !enabled(),
			onclick: () => { store(undefined); info(undefined) }
		},'reset')
	]

	const value = m.stream.merge([store, query]).map(([s,q])=> {
	    let text = s && s.text
	    if (text==undefined) text = q.text || '';
	    text = typeof text == "string" ? text : ''
		return text.substr(0, q.limit || limit)
	})

	const i = store.map(v => {
		let _
		if (!v)
			_ = { icn: plain.icon, col: col.unset };
		else if (v.text && v.text.length>0)
			_ = { icn: '📝', sub: v.text.length, col: col.green};
		else
			v = { icn: plain.icon, sub: 'ε', col: col.red};
		v && info(_);
		return _;
	});

	return { view: () => m(box, {
			style: b.display('flex').flexDirection('column').style,
			icon: i() && i().icn ||  plain.icon,
			sub: (value() && (value().length+'/'+ (query()&&query().limit || limit))) || '🚫',
			tools: tools()
		},
		m('textarea'+b`font-family: monospace; flex-grow: 1; border: none`, {
			value: value(),
			//onupdate: ({dom}) => fitToContent(dom),
			oncreate: ({dom}) => {
			    var offset = dom.offsetHeight - dom.clientHeight + 3;
			    dom.style['box-sizing'] = 'border-box';
			    dom.style.height = 'auto';
                dom.style.height = dom.scrollHeight + offset + 'px';
                dom.addEventListener('input', ({target}) => {
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + offset + 'px';
                });
			},
			oninput: ({target: t}) =>  {
				store({text: t.value.substr(0, query().limit || limit)});
				//fitToContent(t)
			}
		})
	)}

}
plain.meta = {
	share: true,
	adjust: true,
}
plain.icon = "📄";
plain.presets = true;
plain.persistent = true;
plain.options = [
	{a: 'text', t: 'string', r: false, d: "", c: 'Text Preset' },
	{a: 'limit', t: 'number', r: false, d: limit, c: 'Number of chars allowed' },
]

export default plain;
