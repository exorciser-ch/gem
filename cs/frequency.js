import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import box from "/component/box.js";
import {col} from "/core/utils.js";


const app = ({query, store, info}) => {

	store.map(m.redraw)


	store.map(v=> {
		let i = { icn: app.icon, col: col.unset }
		if ( v && v.text && v.text.length>0) {
			i.col = col.green
			i.sub = v.text.length
		}
		info(i)
	})

	let sort = (a,b) => {
		let c = count(); return c[b]-c[a]
	}
	let value = m.stream.merge([store, query]).map(([store, query])=> {
		if (store) return store.text || '';
		if (query.text) return query.text || '';
		else return '';
	})
	let stripwhitespace = m.stream(false)
	let lowercase = m.stream(false)

	let value2 = m.stream.merge([value, stripwhitespace, lowercase]).map( ([v,sw,l]) => {
		if (sw) {
			v = v.replace(/\s/g, '')
		}if (l) {
			v = v.toLowerCase()
		}
		return v
	})
	let length = value2.map( t=> [...t].length )
	let count = value2.map(t => [...t].reduce((a,c)=>(a[c]=(a[c]||0)+1,a), {}))
	let max = count.map(c => Math.max(0,...Object.values(c)))
	let count2 = count.map(c => Object.keys(c).length);

	const H = 210, D = 30
	let W

	const tools = () => [
		m('div'+b`d flex`,
		m('span'+b`p 0 0.5ex;`, ' ' ),
		m('label', m('input[type=checkbox]', {
			checked : stripwhitespace(),
			oninput : () => stripwhitespace(!stripwhitespace())
			}), ' w/o whitespace ', ),
		m('span'+b`p 0 .5ex;`, ' ' ),
		m('label', m('input[type=checkbox]', {
			checked : lowercase(),
			oninput : () => lowercase(!lowercase())
			}), ' lowercase ', ),

		m('span'+b`p 0 .5ex;`, ' ' ),
		m(`span`+b`p 0 0.5ex; bc goldenrod; c white; br 0.5ex; cursor: pointer`, {
			onclick: () => {
				store(undefined);
				info(undefined)
				stripwhitespace(false)
			}
		},'reset'), )

	]

	return {
		view: () => m(box, {
			icon: app.icon + 'Häufigkeitsverteilung',
			tools: tools(),
			sub:  (value()||'').length+ ''
		}, m('div'+b`d flex; fd column`,

			m('input'+b``, {
				maxlength: 5000,
				placeholder: 'Text …',
				value: value(),
				oninput: ({target}) => {
					store({text: target.value});
				}
			}),

			!!(value()||'').length && m('div'+b` overflow-x: auto`,
				m('svg'+b`ff sans-serif;`, { width: W = (count2()+1)*D+1, height: H },
					Array(max()+1).fill(1).map((_,i)=>i).filter(v=>v%(Math.ceil(max()/6))==0).map(v => [
						m('line', {x1: 0.8*D, y1: H-D-v*(5*D/max()), x2: W, y2: H-D-v*(5*D/max()), stroke: col.std}),
						m('text[dominant-baseline=middle][text-anchor=middle][fill=blue]'+b`fs 65%;`,{x: 0.5*D, y: H-D-v*(5*D/max())}, v)
					]),
					Object.keys(count()).sort(sort).map( (k, i, _) => [
						!i && m('line', {x1: D+i*D, y1: 0.3*D, x2: D+i*D, y2: H, stroke: col.std}),
						m('line', {x1: 2*D+i*D, y1: 0.3*D, x2: 2*D+i*D, y2: H, stroke: col.std}),
						(_ = count()[k]/max()) && false,
							m('rect[stroke=blue][fill=lightblue]', {x: 1.15*D+i*D, y: H-D-_*(H-2*D), width:0.7*D, height: _*(H-2*D)}),
							m('text[text-anchor=middle]'+b`fs 50%;`, {x: 1.5*D+i*D, y:  H-D-_*(H-2*D)-D/4, fill: 'blue'},
							count()[k]/length() < 0.001 ? '<1‰' : (100*count()[k]/length()).toFixed(1)+'%'

						),

						m('text[text-anchor=middle]', {x: 1.5*D+i*D, y: H-0.45*D}, k),
						m('text[text-anchor=middle]'+b`ff monospace; c purple; fs 50% `, {x: 1.5*D+i*D, y: H-0.1*D}, 'U+'+k.codePointAt(0).toString(16)),
					])
				)
			),


		))
	}
}

app.presets = true;
app.persistent = true;
app.icon = "📉";
app.options = [
	{a: 'text', t: 'string', r: false, d: "", c: 'Text Preset' },
]

export default app;
