import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import box from "/component/box.js";
import {col} from "/core/utils.js";
import dic from '/lib/dic/index.js'
import md5 from "/vendor/md5.js";

const app = ({query, store, info}) => {

let hexagrams, alphabet, substitute, text, encode, chiffre, words, chiffreLetters, frequencyLetters, 
	highlightletter, highlightword, candidate, configletter, map, map2, matches;
	
	//query.map(q => !q.text && query({...q, text: 'löffelte'}))
	

//######################################################################


query.map(q => {
	hexagrams = '䷀䷁䷂䷃䷄䷅䷆䷇䷈䷉䷊䷋䷌䷍䷎䷏䷐䷑䷒䷓䷔䷕䷖䷗䷘䷙䷚䷛䷜䷝䷞䷟䷠䷡䷢䷣䷤䷥䷦䷧䷨䷩䷪䷫䷬䷭䷮䷯䷰䷱䷲䷳䷴䷵䷶䷷䷸䷹䷺䷻䷼䷽䷾䷿'
	alphabet = [...'ENISRATDHULCGMOBWFKZPVÜÄÖẞJYXQ'] //
	substitute = [...hexagrams.slice(0, alphabet.length)];
	text = q.text || 'löffelte'
	shuffle(substitute, text) 
	encode = substitute.reduce((a,c,i)=>(a[alphabet[i]]=c, a), {})
	chiffre = text.toUpperCase().replace(/./ug, a => encode[a]||a)
	words = chiffre.match(/[䷀䷁䷂䷃䷄䷅䷆䷇䷈䷉䷊䷋䷌䷍䷎䷏䷐䷑䷒䷓䷔䷕䷖䷗䷘䷙䷚䷛䷜䷝䷞䷟䷠䷡䷢䷣䷤䷥䷦䷧䷨䷩䷪䷫䷬䷭䷮䷯䷰䷱䷲䷳䷴䷵䷶䷷䷸䷹䷺䷻䷼䷽䷾䷿]+|[^䷀䷁䷂䷃䷄䷅䷆䷇䷈䷉䷊䷋䷌䷍䷎䷏䷐䷑䷒䷓䷔䷕䷖䷗䷘䷙䷚䷛䷜䷝䷞䷟䷠䷡䷢䷣䷤䷥䷦䷧䷨䷩䷪䷫䷬䷭䷮䷯䷰䷱䷲䷳䷴䷵䷶䷷䷸䷹䷺䷻䷼䷽䷾䷿]+/gu)
	chiffreLetters = letters(chiffre.replace(/./g, l=>substitute.includes(l)?l:''))
	frequencyLetters = frequency(chiffre.replace(/./g, l=>substitute.includes(l)?l:''))
	highlightletter = '' 
	highlightword = ''
	candidate = ''
	configletter = Object.entries(frequencyLetters).sort((a,b)=>b[1]-a[1])[0][0]
	map = {...q.map} || {}
	map2 = {}
	matches = {}
	//console.log('query updated', map)
})

store.map(m.redraw)

store.map((_) => {	
	let empty = !_ || !_.map
	map = _ ? _.map || query().map || {} : query().map || {}
	let complete = chiffreLetters.every(l => encode[map[l]]==l)
	let i = { 
		icn: app.icon,
		col: empty ? col.unset: complete ? col.green : col.red,
		sub: empty ? '': complete ? '✅' : '❌'
	} 
	_ && info(i)
})
	
const letterview = {
  view: ({attrs:{letter, clear, word, wordindex}}) => m('div'+b`
      d inline-block; ta center;
      h 1.2em; vertical-align: middle
      cursor: pointer; w 1em; 
      bc: ${ letter == configletter && candidate ? ( '#aaf'
        ) : letter == highlightletter ? '#ffa' : 'none'};
      
 `, {
     onmouseover : () => !clear && (highlightletter = letter, highlightword = word), 
     onclick: () => !clear && (configletter = letter),
     onmouseleave: ()  => (highlightletter = '', highlightword = '')
    },
    letter==configletter && candidate ? candidate : 
      m('span'+b`c ${alphabet.includes(s(letter||clear)) ? 'none': clear? 'black':'silver'}`, s(letter||clear))
  )
};
const table = {
  view: () => m('div'+b``, 
  {
    //onmouseleave: () => configletter = ''
  },
    m('div'+b`bc silver;d flex; overflow: auto`, Object.entries(frequencyLetters).
    sort((a,b)=>b[1]-a[1]).map(([k,v]) => m('div'+b`
      w 1.2em;ta center;d flex; fd column; p 0.5ex;
      cursor: pointer;
      bc: ${k==configletter?'LightGoldenRodYellow':k==highlightletter?'#eea':'silver'};
       
    `, {
     // first: ( configletter = configletter || k ),  
      onclick: () => configletter = k,
      onmouseover : () => highlightletter = k,
      onmouseleave: ()  => highlightletter = ''
    },
    m('span', s(k)),  
    m('span'+b`fs 70%`, v),
  ))),
  configletter && m('div'+b`d flex; flex-wrap: wrap; m  0 `, 
  alphabet.filter(c=>unused(c)||map[configletter]==c).map(
    c => m('div'+b`white-space: nobr; p 0.3ex; br .5ex; ta center;
      w 1em; overflow visible;
      m .2ex; position: relative; 
      border: 1px solid silver; cursor pointer;
      //h: 2.6em
      //bc ${map[configletter]==c?'#afa':'none'}
    `.$hover(`bc #ddf`), {
      onmouseover: () => candidate = c,
      onmouseleave: () => candidate = undefined,
      onclick: () => { 
        matches = {}
        if ( map[configletter] ) {
          if ( map[configletter] == candidate) {
            map[configletter] = undefined
          } else {
            map[configletter] = c
          }
        } else {
          map[configletter] = c
        } store({map, time: Date.now()}) 
		
      }
    }, c,  map[configletter]==c && m('span'+b`z-index: 99; left: 0.8em;top: -1ex; position absolute; `, '📌'))  
  ))     
  )
}
const index = {
  view: () => m('div'+b``, 
     m(table),
     m('div'+b`d flex; align-items: flex-start;flex-wrap: wrap; margin-top: 1ex; padding-top: 1ex;border-top: 1px solid #D4AC0D; `,
      words.map((word, wordindex) => !word.match(`[${hexagrams}]`) ?  
         m('div'+b`br 1ex; m .5ex 0ex; p .2ex;`,
            m(letterview, {clear: word})) :
        m('div'+b`br 1ex; m .5ex 0ex; bc ${highlightword==word?'pink':'white'};p 0 0 .4ex 0;  border: 1px solid tan`,
          m('div',
            [...word].map(letter => m(letterview, {letter, word, wordindex})),
            query().dictionary && !matches[word] && !komplett(word) && m('span'+b`fs 70%`,  {
              onclick: async () => {
                matches = { [word] : ['🤖 loading ...'] }
                let length = [...word].length;
                let filter = searchpattern(word)
                matches[word] = await dic(length, filter) 
                m.redraw()
              }
            }, '🔎'),
          ),
          m('div'+b`ff monospace; ta center;c red`,
              matches[word] &&  (
                matches[word].length==0 ? 'no match' :
                matches[word].length>20 ? 'more than 20 matches':
              matches[word].map(r => m('div'+b`c black`.$hover('bc #aaf'), {
                onmouseenter: () => {
				  if (r.match(/🤖/)) return
                  map2 = {};
                  [...word].forEach((l,i) => map2[l] = [...r.toUpperCase()][i])
                 
                },
                onclick: () => {
                  if (r.match(/🤖/)) return
                  [...word].forEach((l,i) => map[l] = [...r.toUpperCase()][i])
                  matches = {}
				  store({map, time: Date.now()}) 
                },
                onmouseleave: () => { map2 = {}}
              },
              r))),

          ), 
         ),
      )
    ), //m('pre', JSON.stringify(map))
    )
}


function frequency (text) {
  return [...text].reduce((a,c)=>(a[c]=(a[c]||0)+1, a), {})
}
function letters(text)  {
  return [...new Set([...text])].sort()
}
function unused(l) {
  return !Object.values(map).includes(l)
}
function s(l) {
  return map[l] || map2[l] || l
}
function searchpattern (word) {
  word = [...word].map( (c, i, a) => ({ c, i, r: a.indexOf(c) }))
  word.forEach((e,i,a) => { if(e.i!=e.r) { a[e.r].g = true }})
  let i = 1
  word.forEach((e,_,a) => {
      if(e.g) { e.g = i++; delete e.r; delete e.i}
      else if(e.i!=e.r) { e.r = a[e.r].g; delete e.i}
      else { delete e.r; delete e.i }
  })
  
  let pinned = Object.values(map)
  let not = '['+alphabet.filter(x=>!pinned.includes(x)).join('')+']'
  let regexp = RegExp('^'+[...word].map(x => {
    return x.r ? '\\'+x.r : (
      (x.g ? '(' : '' ) 
      + (map[x.c] || not )
      + (x.g ? ')' : '' )
    )
  }
  ).join('')+'$', 'i')
  return regexp
}
function shuffle(a, word) {
	let keys = md5(word).match(/../g).map(c => parseInt(c, 16))
	let n = a.length, t, x = 0, y = 0, k= 0, l = 0;
    for (let i = 0; i<5*n; i++) {		
		k = (k + (x+=7) + keys[(k+x)%keys.length])%n
		l = (l + (y+=13) + keys[(l+y)%keys.length])%n
		t = a[k]; a[k] = a[l]; a[l] = t
    } return a
}
function komplett (wort) {
  return [...wort].every(l=>map[l])
}


//######################################################################
	
	const tools = () => [
		m(`span`+b`p 0 0.5ex; m 0.2ex; bc goldenrod; c white; br 0.5ex; cursor: pointer`, {
			// disabled: value()!=query().text,
			onclick: () => {
				store(undefined);
				info(undefined)
				matches = {}
				map = query().map ? {...query().map} : {}
			}
		},'reset')
	]
	
	
	return {
		view: () => m(box, {
			icon: app.icon,
			tools: tools(),
			sub: info() && info().sub
		},
			//m('span', 'klartext2: ', query().text ),
			m(index)
		)
	}
}
app.presets = true;
app.persistent = true;
app.icon = "👘";
app.options = [
	{a: 'text', t: 'string', r: false, d: "hallo", c: 'Text Preset' },
	{a: 'dictionary', t: 'boolean', r: false, d: false, c: 'false|true' },
	{a: 'map', t: 'object', r: false, d: {}, c: '{"from":"to"}' },
]
	
export default app;