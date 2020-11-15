import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import box from "/component/box.js";
import {col, levenshtein} from "/core/utils.js";



const OK = '✅'
const FAIL = '❌'
const app = ({query, store, info}) => {
	
	let answer = '',
	    limit = app.limit,
	    disabled = false,
	    debug = false,
	    stripped = '',
	    valid = false,
	    steps = 0,
	    mood = OK,
	    warning;

	m.stream.merge([store, query]).map(([s,q]) => { try {
	   warning = undefined
	    debug = !!(q?.debug)
	    answer = s?.text ?? q?.text ?? ''
	    limit = q?.limit ?? app.limit
	    disabled = (answer||'') == (q?.text ?? '')
        stripped = answer.replace(RegExp(q?.strip??'', q?.stripflags??'g'), 
        (...g) => {
            let i = 1, rep = '';
            while ( !Number.isInteger(g[i]) && i<5000) rep += g[i++]||''
              return rep
            })
        valid = !!stripped.match(RegExp(q?.regexp??'', q?.flags??''))
        steps = (!valid && q?.target) ? levenshtein(stripped, q.target) : 0
        mood = [..."🤨😯😕😬😓😰😵😨😲😱🤯"][Math.ceil(steps/2)]||'🤬'
        
        s && info({
            icn: app.icon, 
            col: disabled?'#ddd':valid?'#0f0':'#f00',
            sub: disabled?'':valid
                 ? OK : q.target ? mood : FAIL
        })
    } catch (e) {
        warning = e.message
	}}) 
	   

	return { view: () =>  m(box, {
	    icon: app.icon,
	    tools: [
	        m('button', {
	            disabled,
	            onclick: () => store({})
	        }, 'reset')     
	    ],
	    sub: disabled ? '' :
	        valid ? OK:
	        query()?.target ? (mood + ' '+ steps + ` edit${steps>1?'s':''} to 🏁` ):FAIL
	},
	m('div'+b`d flex; fd column`, 
		m('textarea'+b`box-sizing: border-box;border: none;font-family: monospace;
		bc ${disabled?'white':valid?'#dfd':'#fdd'}
		`, {
			maxlength: limit,
			value: answer,
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
			oninput: ({target}) => {
			    store({text: target.value})
			    target.dataset.value = target.value
			   // console.log(target)
			}
		}),
		warning && m('pre'+b`m 0;c red;bc #fdd`, '⚠️ ',warning),
		debug && m('pre'+b`m 0;border-top: 1px solid black;bc silver`,
		   'answer: '+ answer,
		   '\nlimit: '+ limit,
		   '\nstripped: '+ stripped,
		   '\nvalid: '+ valid,
		   '\nsteps: '+ steps,
		)
	))};
};

Object.assign(app, {
    presets: true,
    persistent: true,
    icon: "✍",
    limit: 5000, 
    options: [
	    {a: 'text', t: 'string', r: false, d: "", c: 'Text Preset' },
		{a: 'limit', t: 'number', r: false, d: 5000, c: 'maximum text size' },
	    {a: 'regexp', t: 'string', r: false, d: "", c: 'Regular Expression' },
	    {a: 'flags', t: 'string', r: false, d: "", c: 'RegExp Flags [igm]+' },
	    {a: 'strip', t: 'string', r: false, d: "", c: 'remove stuff befor checking' },
    	{a: 'stripflags', t: 'string', r: false, d: "g", c: 'strip regexp flag' },
    	{a: 'target', t: 'string', r: false, d: "", c: 'the better answer' },
    	{a: 'debug', t: 'boolean', r: false, d: false, c: 'debug mode' },
    	
    	
	]
})
	
export default app;