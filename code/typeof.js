import ace from "https://miruku.li/vendor/ace.js"

import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import box from "/component/box.js";
import {col} from "/core/utils.js";

 
console.clear();

let spinningInlineBlock = b`fs 80%;d inline-block`.$animate('1s ease infinite', {
      from: b.transform('rotate(0deg)').style,
      to: b.transform('rotate(360deg)').style
    })
let SANDGLAS = '⌛';

const app = ({query, store}) => {
	
	const value = () => {
	    if (store() && store()?.text!=undefined) return store()?.text
	};
	
	let type, error, globi, timeout
	var createWorker = ( ) => {
	    let e = new Worker('data:text/javascript;charset=utf-8,' + encodeURIComponent(`
const start = Object.keys(self)
self.onmessage = (msg) => {
    try {
        
       
        let type = 'undefined', value
        if (!!msg.data?.trim()) {
            value = eval( '('+msg.data.trim()+')')
            type = typeof value
        }
        console.log(value)
        if (type == 'object' && value!==null) {
            type += ' <' + value.constructor.name+'>'
        }
        if (typeof value == 'number' ||
            typeof value == 'boolean' ||
            typeof value == 'bigint' ) {
            type += ' '+value        
        } else if ( typeof value == 'function') {
            type += ' '+(value+'').replace(/^(async)?( )?function/, '$1$2ƒ ')
        } else if (typeof value == 'string') {
            type += ' '+JSON.stringify(value)
        } else if (typeof value == 'object') { try {
            type += ' '+JSON.stringify(value)
        } catch (ex) {
            type += ' ' +value + ' ⚡  '
+ ex.message        }}
        
        let globi = Object.keys(self).filter(k=>!start.includes(k))
            .map(k=> [k, typeof self[k], String(self[k])])
            
        self.postMessage({type, globi})
    } catch (ex) {
        self.postMessage({error: ex.message})
    }
}`));
        e.onmessage = (msg) => {
            clearTimeout(timeout);
            type = msg?.data?.type
            error = msg?.data?.error
            globi = msg?.data?.globi
            m.redraw()
        }
	    return e
	}
    
    let env = createWorker()
	
	const run = (value) => {
	    store({text: value}); 
	    type = error = undefined
	    clearTimeout(timeout)
	    timeout = setTimeout( () =>{
	      env.terminate()
	      env = createWorker()
	      error = 'timeout'
	      m.redraw()
	    }, 1000)
	    env.postMessage(value)
	}; run(value())
	
	
	 
	return {
		view: () => m(box, {
		    icon: app.icon ,
		    tools: [
		        m('span'+b`p 1ex`, ' '),
		        m('button'+b`margin-right: 2em`, { onclick: () => {
		            clearTimeout(timeout);
		            env.terminate()
	                env = createWorker()
	                run('')
		        }}, 'reset'),
		        
		        !error && !type && m('span'+spinningInlineBlock, SANDGLAS)
		    ],
		   // sub: info() !=  undefined && info().sub || ''
		}, m('div'+b`d flex; fd column `,
		    m('input'+b`fs 120%;p .5ex;fg 1;border: none; h 1.2em; font-family: monospace`, {
    			maxlength: 500,
    			value: value(),
    			placeholder: 'Write some code ...',
    			oninput: ({target}) => run(target.value)
    		}),
    	    type  && m('div'+b`d flex`,
    	        m('tt'+b`fg 1;border-top: 1px solid silver; p 1ex 0 0 0`, 
    	        m('span'+b`c silver`, '> '), type),
    	        globi && globi.map(([n,t,v])=>m(
    	        'button', { onclick: ()=> {
    	            run(n)
    	            }}, n
    	        ))
    	    ),
    	    error  && m('tt'+b`border-top: 1px solid silver; p 1ex 0 0 0`, 
    	        m('span'+b`c red`, error)) ,
    	    
    	    !error && !type && '...',
    	    
    	))
	};
};

app.presets = true;
app.persistent = false;
app.icon = "🕵 JavaScript Code Inspector";
app.options = [
	{a: 'text', t: 'string', r: false, d: "", c: 'Text Preset' },
];
	
export default app;