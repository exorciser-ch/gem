import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import ace from "https://miruku.li/vendor/ace.js"
  
import Split from "/vendor/split.js";
import { col,debounce} from "/core/utils.js";

const bstyle = b`p 0 0.5ex; m 0.2ex 0.5ex; bc goldenrod; c white; br 0.5ex`
const lines = 1
const parser = new DOMParser();

export const code = ({target, query, store, info}) => {
	
	
	
	let focus = 'javascript',
		runnerWindow,
		messages = [],
		left = m.stream(),
		iframe = m.stream(),
		editors = {},
		files = ['html', 'css', 'javascript'],
		updateTimer,
		saveTimer,
		source,
		url,
		_;
	
	if ((_=query()) && (_=_.files) && (_ = _.trim().split(',').filter(x=>files.includes(x))).length) {
		files = files.filter(x=>_.includes(x))
		if(!files.includes(focus)) focus = files[0]
	}
	console.log(files)
	
	m.stream.merge([left, iframe]).map(([a,b])=>
		Split([a,b], {
			sizes: [50, 50],
			minSize: 15,
			gutterSize: 5
		}))
	
	
	
	function update () {
		if (files.reduce((a,c) => a && editor[c], true)) {
			return
		}
		
		let htmlDoc, c = {}
		messages = []
		htmlDoc = parser.parseFromString(c.html = (editors.html && editors.html.getValue())||'', 'text/html');
		
		let style = htmlDoc.createElement('style')
		style.innerHTML = c.css = ((editors.css && editors.css.getValue())||'')
		htmlDoc.head.appendChild(style)
		
		let script = htmlDoc.createElement('script')
		script.innerHTML = `
function __logentry (value, max = 1000){  
const root = { type: typeof value, value, path: '$' }, queue = [root], seen = new Map()
while(queue.length) {
  let c = queue.shift() 
  if (c.type == 'object' && c.value!==null) {
	c.type = c.value.constructor.name || c.type
	if (typeof c.value != typeof c.value.valueOf()) {
	  c.primitive = c.value.valueOf()
	}
	if (c.type == 'RegExp') {
		c.desc = String(c.value)    
	} else if (seen.has(c.value)) {
	  c.type = '※'
	  c.desc = seen.get(c.value)
	} else {
	  seen.set(c.value, c.path)
	  c.children = []
	  for (const key in c.value) {
		if (max-->0) {
		  try {
			let child =  {
				key,
				type: typeof c.value[key],
				value: c.value[key],
				path: c.path+'.'+key
			  }
			c.children.push(child)
			queue.push(child)
		  } catch(ex) {
			console.warn(ex.message)
		  }
		} else {
		  c.hasMore = true
		}
	  }
	  if (Array.isArray(c.value)) {
		c.head = '['
		c.tail = ']'
		c.type += '('+c.value.length+')'
	  } else {
		c.head = '{'
		c.tail = '}'            
	  } 
	  c.desc = c.children.length || c.hasMore ? '…' : ''
	  if (c.value instanceof Element) {
			  c.head = ('<'+c.value.tagName+'>').toLowerCase()
		c.tail = ('</'+c.value.tagName+'>').toLowerCase()
		//c.desc = ('<'+c.value.tagName+'>…</'+c.value.tagName+'>').toLowerCase()
	  }
	}
  } else {
	c.desc = String(c.value)
	if (c.type=='function') {
	  c.desc = c.desc.replace(/^function\s*/, 'ƒ')
	  c.desc = c.desc.replace(/\{ \[native code\] \}$/, '{𝄋}')
	}
  }
  delete c.value
  delete c.path
}
return root
}
addEventListener("error", (error) => { parent.postMessage( {  type: "runtime", message: error.message, lineno: error.lineno, filename: error.filename}, "*")});
Object.keys(console).filter(k=>typeof console[k]=='function').forEach(k =>
console[k] = new Proxy(console[k], { apply(target, thisArg, argumentsList) {
	parent.postMessage( { type: k, args: argumentsList.map(v=>__logentry(v)) }, '*')
	return target(...argumentsList)
}}));
`
		htmlDoc.body.appendChild(script)
		
		script = htmlDoc.createElement('script')
		script.innerHTML = c.javascript = (editors.javascript && editors.javascript.getValue())||''
		htmlDoc.body.appendChild(script)
		
		if (iframe()) {
			let i = iframe();
			URL.revokeObjectURL(iframe().src)
			iframe().src = URL.createObjectURL(new Blob([`<!doctype html><html><head>${htmlDoc.head.innerHTML}</head><body>${htmlDoc.body.innerHTML}</body></html>`], {type : 'text/html'}))
		}
		m.redraw();
	}

	store.map(v => {
		let l = 0;
		files.forEach(e=>{
			let _ = v || query()
			l += (_[e]||'').length
			if(editors[e] && editors[e].getValue()!=_[e]) {
				editors[e].setValue(_[e]||'')	
			}
		})
		if (!v) return info({
			icn: '💻',
			sub: 'n/a',
			col: col.unset
		})
		info({
			icn: '💻',
			sub: l,
			col: col.green
		})
	})
	
	
	function isDraft(s = store()) {
		return s == undefined
			|| files.reduce((a,c) => a || (editors[c] && editors[c].getValue()!=s[c]), false)
	}
	
	function editor(type) {
		return m('div', {
			style: {
				display: focus==type ? 'block' : 'none'
			},
			oncreate: ({dom}) => ace(dom, {
				mode: "ace/mode/"+type,
				minLines: 1,
				maxLines: Infinity,
				tabSize: 2,
				useSoftTabs: true 
			}).then(e => {
				dom.style.border = 'none'
				editors[type] = e
				window.ace.config.loadModule("ace/ext/language_tools", ()=> {
				  e.setOptions({
					enableBasicAutocompletion: true,
					enableSnippets: true,
					enableLiveAutocompletion: false 
				  })
				})
				let q = query() || {}, s = store() || {}
				if (s[type]) {
					e.setValue(s[type])
				} else if (q[type]) {
					e.setValue(q[type])
				} 
				e.on('change', debounce(update))
				update()
				console.log('updated')
			})
		})
	}   
	//update()
	return { view: () => m('div'+b`
		border: 1px solid #D4AC0D;
		padding-top: 0.25ex;
		border-radius: 0.5ex 0.5ex 0 0;
		background-color: #FEF9E7`, {
		}, 
		m('div'+b`d flex; border-bottom: 1px solid goldenrod`, [
			m('span'+b`p 0 0.5ex`, '💻') ,
			
			files.map(file => 
				m('div'+b`bc: ${focus==file?'goldenrod': 'palegoldenrod'}; m 0 1ex 0 0; p 0 1ex; border: 1px solid goldenrod; br: 0.5ex 0.5ex 0 0; cursor: pointer;  border-bottom: none`, {
				onclick: () => focus = file
				}, file)),
			isDraft() && [ '️',
				m('button'+bstyle, {
					onclick: () => store(files.reduce((a,c)=> ({...a, [c]: editors[c].getValue()}), {}))
				}, '💾 Save')
			], m('span'+b.fg(1)),
			m('button'+bstyle, {
				onclick: ()=>store(false)
			}, '🧹 Reset'), ' ',
			files.join()
			
		]),
		m('div'+b`d flex; bc white`, // split pane 
			m('div'+b``, { oncreate: ({dom}) => left(dom)},
				files.map(editor)
				//editor('html'),
				//editor('css'),
				//editor('javascript'),	
			), 
			m('iframe'+b`bc white`, {
				sandbox: 'allow-modals allow-forms allow-same-origin allow-scripts allow-popups',
				allow: 'geolocation; microphone; camera; midi; encrypted-media',
				allowfullscreen: true,
				oncreate: ({dom})=> {
					iframe(dom)
					window.addEventListener('message', function (event) {
						if (event.source == dom.contentWindow) {
							messages.push( event.data)
							while(messages.length>100) messages.shift()
							m.redraw();
						}
					})
				}
			})
		),
		//m('pre'+b`m 0; font-size: 50%`, JSON.stringify(messages, null, '  '))
		m('div',
			'console',
			messages.map(a =>	{
				if (a.type.match(/log|warn|info|error/))
					return m('div'+b`bc ${msgs[a.type].bc};d flex;align-content: stretch;border-bottom: 1px solid #eee; overflow:auto`,
						msgs[a.type].i,
						a.args.map(x=>m('div'+b.p('0.5ex').br('0.5ex').border('1px solid #eee'), Log(x)))
					)
				return a.type
			})
		)
	)}
	 
}
const msgs ={
	log: { i: '📄', bc: 'white' },
	info: { i: '📜', bc: 'AliceBlue' },
	warn: { i: '⚠️', bc: 'lemonchiffon' },
	error: { i: '⚡', bc: 'LightPink' },
}


const Log = (entry) => {
  let {open, primitive, type, key, children, hasMore, head, desc, tail} = entry, entries;
  let more = !!(children && children.length)
  return m('div'+b
   // .border('1px solid silver')
    .m(`0 0 0 1.5em`)
    .ff('monospace').textIndent('-1.5em'),
    m('span'+b.cursor(more&&'pointer'),//.bc('yellow'),
      more && {onclick: ()=>entry.open = !open },
      more && m('span'+b.p('0 0.5ex  0 0 '), '▴▾'[+!open]) , // ⯅⯆
      key && m('span'+b.c('silver'), key, ': '),
      m('span'+b.c(type[0].match(/[A-Z]/)?'green':'tan'), type),
      !!(children && children.length) && open
        ? [ m('span'+b.c('green'), head),
          m('span'+b.c(Log.colors[type.toLowerCase()]||'green'), primitive),
		  
        ] : [
          m('span'+b.p('0 0.25ex').c('green'), head),
          m('span'+b.p('').c(Log.colors[type.toLowerCase()]||'green'), primitive),
		  primitive && desc && ', ',
          type!='undefined' && desc &&  m('span'+b.whiteSpace('pre-wrap').c(Log.colors[type.toLowerCase()]||'green'),
             desc
          ),
          m('span'+b.p('0 0 0 0.25ex').c('green'), tail)
        ],
    ),
    open && [
      children.map(Log ), hasMore && desc, 
      m('div'+b.c('green'), tail)
    ]
  )
}
Log.colors = {
  'undefined': 'silver',
  'object': 'silver',
  'boolean': 'magenta',
  bigint: 'darkblue',
  string: 'brown',
  symbol: 'teal',
  function: 'fuchsia',
  number: 'blue'
};
 


export default code;