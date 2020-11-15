import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import box from "/component/box.js";
import {col} from "/core/utils.js";

function permutation (text, perm) {
  text = [...text]  
  perm = [...(perm||'0')].map(Number)
  let s = [...new Set(perm)].sort()
  if (s.length != perm.length || s.some((s,i)=>s!=i)) throw 'invalid permutation'
  let i = 0, j, out =[];
  while(i*perm.length<text.length) {
    j = 0;
    while(j<perm.length) {
      out[i*perm.length + perm[j]] = text[i*perm.length + j] ?? ' '
      j++;
    }
    i++;
  }
  return out.join('')
}

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
		m('dl'+b`margin-bottom 0;`,
			m('dt', 'Klartext'),
			m('dd'+b`d flex; fd column`, 
				m('textarea'+b`margin-bottom: .5ex`, {
					maxlength: 500,
					value: t=store()?.text ?? query()?.text ?? '',
					oninput: (e) => store({ ...store(), text: e.target.value})
				})),
			m('dt', 'Schlüssel'),
			m('dd'+b`d flex; fd column`, m('input', {
				maxlength: 20,
				value: t=store()?.perm ?? query()?.perm ?? '',
				oninput: (e) => store({ ...store(), perm: e.target.value})

			})),
			m('dt', 'Chiffre'),
			m('dd'+b`d flex; fd column`, (()=>{ try {
					return m('pre'+b`m 0`, permutation(store()?.text ?? query()?.text ?? '',
						store()?.perm ?? query()?.perm ?? '0'
					))
				} catch (e) {
					return m('span'+b`c red`, '⚠️ '+e)
				}})()
			),
		))
	}
}
app.presets = true;
app.persistent = true;
app.icon = "🔃";
app.options = [
	{a: 'text', t: 'string', r: false, d: "", c: 'Text Preset' },
]
	
export default app;