import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import box from "/component/box.js";
import {col} from "/core/utils.js";



let letters = text => [...new Set([...text])].sort()

const weights = text => [...text].sort().reduce((a,c)=>(a[c]=(a[c]||0)+1,a), {});
const tree = (text, codes = [...'01'], steps = 1/0) => {
  const sort = (x,y) => y.weight-x.weight || x.c>y.c //(x.c  && y.c  && x.c.localeCompare(y.c))
  const encode = (n, prefix = '') => {
    n.code = prefix
    n.children && n.children.forEach( (c,i) => encode(c, prefix+codes[i], codes))
  }
  let e = Object.entries(weights(text)).map(([char, weight])=>({char,weight}))
  // add blanks The height of a complete m-ary tree with n nodes is ceiling(log_m n). 
  e.sort(sort)
  while (e.length>1 && steps-->0) {
    let children = e.splice(-2) 
    let node = { weight: children.reduce((a,c)=>a+c.weight, 0), children }
    encode(node)
    e.push(node)
    e.sort(sort)
  }
  return e
}

const codetable = (text, codes = [...'01']) => {
  let traverse = (r, code = '', d = {}) => (r.char
    ? d[r.char] = code
    : r.children.forEach( (c,i) => traverse(c, code+codes[i], d)),
  d); return traverse( tree(text, codes)[0] )
}

let R = 12, M = 3.2

function draw(n, x, y) {
  n.x = x, n.y = y, n.width = 0, n.height = 2*M*R, n.rendering = [];
  (n.children||[]).forEach(c => {
    draw(c, x + n.width, y + M*R)
    n.width += c.width
    n.height = Math.max(c.height+M*R, n.height)
    n.rendering.push( c.rendering )
  }); //if (n.children) n.height += M*R
  n.width = n.width || M*R
  n.rendering = ([
     (n.children||[]).map((c, i)=> [
        m('line', {x1: x+n.width/2, y1: y+M*R/2, x2: c.x+c.width/2, y2: c.y+M*R/2, stroke: 'black'}),
        m('circle', { fill: '#efe', stroke: '#afa',
          cx: (x+n.width/2 + c.x+c.width/2)/2,
          cy: (y+M*R/2+c.y+M*R/2)/2,
          r: R/3
        }),
        m('text[dominant-baseline=central][text-anchor=middle]'+b`ff monospace; fs 80%`, {
          x: (x+n.width/2 + c.x+c.width/2)/2,
          y: (y+M*R/2+c.y+M*R/2)/2}, c.code.slice(-1)),
      ]),
     ...n.rendering,
     m('circle', { cx: x+n.width/2, cy: y+M*R/2, r: R, fill: '#fee', stroke: '#aaa'}),
     m('text[dominant-baseline=central][text-anchor=middle]'+b`ff monospace`, {
       x:x+n.width/2, y:y+M*R/2}, n.weight),
     !n.children && [
        m('rect', {x:x+0.05*M*R, y:y+0.9*M*R, width: 0.9*M*R, height: 0.7*M*R,  fill: '#eef', stroke: '#ddf'}), 
        m('text[dominant-baseline=central][text-anchor=middle]'+b`ff monospace; fw bold`, {
          x:x+n.width/2, y: y+1.1*M*R}, n.char),
        m('text[dominant-baseline=central][text-anchor=middle]'+b`ff monospace; fs 80%;`, { fill: '#aaf',
          x:x+n.width/2, y: y+1.4*M*R}, 'U+'+n.char.codePointAt(0).toString(16)),
        n.code && [
          m('rect', {x:x+0.05*M*R, y:y+1.65*M*R, width: 0.9*M*R, height: 0.35*M*R,  fill: '#dfd', stroke:'#afa'}), 
        ],
        m('text[dominant-baseline=central][text-anchor=middle]'+b`ff monospace; fs 80%`, {
          x:x+n.width/2, y: y+1.8*M*R}, n.code )
      ]
  ])
}

function drawset(cmps) {
  let width = 0, height = 0;
	let parts = cmps.map(c => {
    draw(c, width, 0)
    width += c.width
    height = Math.max(height, c.height)
   return c.rendering
  })
	return m('svg'+b`vertical-align: text-top`, {  width, height}, parts)
}


const codes = [...'01']
const encode = (text, c=codes) => {
	let ct = codetable(text)
	return [...text].map(c => ct[c]).join(' ')
}

/*function utf8bin (txt) {
	 return !txt.length ? '' :[...txt]
		.map(encodeURI)
		.map(x => x.length == 1 ?
			x.codePointAt(0).toString(2).padStart(8, 0) :
			x.match(/%../g).map(y => parseInt(y.slice(1), 16).toString(2).padStart(8, 0)).join(''))
		.join(' ')
}*/

const app = ({query, store, info}) => {
	
	store.map(m.redraw)
	
	const value = () => {
		return store()?.text ?? query()?.text ?? ''
	}
	
	store.map(v=> {
		let i = { icn: app.icon, col: col.unset }
		if ( v && v.text && v.text.length>0) {
			i.col = col.green
		}
		info(i)
	})
	
	const tools = () => [
		m('span'+b`p 1ex`, ' '),
		m(`span`+b`p 0 0.5ex; m: 0.2ex;bc goldenrod; c white; br 0.5ex; cursor: pointer`, {
			// disabled: value()!=query().text,
			onclick: () => { store(undefined); info(undefined) }
		},'reset')
	]
	
	let algor = false, x, y;
	return {
		view: () => m(box, {
			icon: app.icon,
			tools: tools()
		},
		m('div',
			m('div'+b`d flex`,
				m('span', 'Text: '),
				m('input'+b`border: none; fg: 1`, {
					maxlength: 500,
					value: value(),
					oninput: (e) => store({text: e.target.value})
				})
			),
			letters(value()).length<2 ? m('span'+b`c red`, '⚠️ Die Eingabe muss mindestens zwei unterschiedliche Zeichen enthalten') : [
				m('div'+b`margin-top: 1ex;overflow: auto`, 'Häufigkeiten: ', drawset(tree(value(), codes, 0)) ),
				m('div'+b`margin-top: 1ex;overflow: auto`, 'Zwischenschritte: ', 
					m('span'+b`margin-left: 1ex; cursor: pointer `, {
						onclick: () => algor = !algor
					}, algor ? 'verbergen ⏶ ' : 'anzeigen ⏷ '),
					algor && m('table'+b`margin-left: 12ex`, 
						Array(letters(value()).length-2).fill(1).map((_,i)=> m('tr', m('td', i+1),
							m('td', drawset(tree(value(), codes,i+1))))))
				),
				m('div'+b`margin-top: 1ex;overflow: auto`, 'Codierbaum: ', drawset(tree(value(), codes)) ),
				m('div'+b`d flex;margin-top: 1ex`, 
					m('span'+b`padding-right: 1ex`,
						'Huffman Codeierung (',
						x=encode(value()).replace(/\s/g,'').length,
						' bit, ',
						(x/[...value()].length).toFixed(2),
						' bit/char)'
						),
					m('span'+b`bc white; padding: 0 0.5ex; br 0.5ex;border: 1px solid silver; margin: 0`, encode(value())) ),
			//	m('div'+b`d flex;margin-top: 1ex`, 
			//		m('span'+b`padding-right: 1ex`, 'UTF-8 Codierung (',  utf8bin(value()).replace(/\s/g,'').length, ' bit) '),
				//	m('span'+b`bc white; padding: 0 0.5ex; br 0.5ex;border: 1px solid silver; margin: 0`, utf8bin(value())) ),
			]
		))
	}
}
app.presets = true;
app.persistent = true;
app.icon = "🗜️ Huffmann Algorithmus ";
app.options = [
	{a: 'text', t: 'string', r: false, d: "", c: 'Text Preset' },
]
	
export default app;