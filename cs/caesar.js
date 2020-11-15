import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import box from "/component/box.js";
import {col} from "/core/utils.js";

function caesar (text, shift = 3) {
  return text.toUpperCase().replace(/[A-Z]/g, c => String.fromCharCode(( 65 + (c.charCodeAt(0) - 65 + shift) % 26)))
}
let shifts = Array(25).fill(1).map((x,i)=>i+1)
const app = ({query, store, info}) => {
	
	
	store.map(v=> {
		
		/*let i = { icn: app.icon, col: col.unset }
		if ( v && v.text && v.text.length>0) {
			i.col = col.green
		}
		info(i)*/
	})
	
	let t;
	const tools = () => [
		m(`span`+b`p 0 0.5ex; m 0 1.2ex; bc goldenrod; c white; br 0.5ex; cursor: pointer`, {
			// disabled: value()!=query().text,
			onclick: () => { store(undefined); info(undefined) }
		},'reset')
	]
	return {
		view: () => m(box, {
			icon: app.icon,
			tools: tools()
		},
		m('div'+b`d flex;fd column`, 
			m('textarea'+b`margin-bottom: .5ex`, {
				maxlength: 500,
				value: t=store()?.text ?? query()?.text ?? '',
				oninput: (e) => store({text: e.target.value})
			}),
			m('div'+b`height: 10em;overflow: auto`, 
			shifts.map(s => m('div'+b`d flex`, 
				m('div'+b`w 1.2em; ta right; bc #ddd; m .2ex; p .1ex; border-radius: .5ex`, s),
				m('pre'+b`m 0;fg 1;p 0.1ex`, caesar(t, s))
			)))
		))
	}
}
app.presets = true;
app.persistent = true;
app.icon = "🔄";
app.options = [
	{a: 'text', t: 'string', r: false, d: "", c: 'Text Preset' },
]
	
export default app;