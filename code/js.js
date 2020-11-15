import ace from "https://miruku.li/vendor/ace.js"

import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";

import environement from "/core/environement.js";
import {col, debounce} from "/core/utils.js";
import box from "/component/box.js";


console.clear();

let spinningInlineBlock = b`fs 80%;d inline-block`.$animate('1s ease infinite', {
      from: b.transform('rotate(0deg)').style,
      to: b.transform('rotate(360deg)').style
    })
let SANDGLAS = '⌛';

const app = ({query, store}) => {
	
	let type = 'undefied', error, globi, timeout
	
	let runtime = environement({maxExecutionTime: 5000})
    let editor = m.stream();
	
	m.stream.merge([editor, store]).map(([e,s])=> {
	   if (typeof s?.value != 'string') return
	   if (e.getValue() == s.value) return
	   e.setValue(s.value)
	})
	
	const run = async () => {
        let value = editor().getValue()
        store({value})
        type = error = undefined
        runtime.exec(value).then(r=> {
            type = r.type + '/'+r.value
            globi = r.globals
            m.redraw()
        }).catch(r=> {
            error = r.error
            m.redraw()
        })

	}; 
	
	
	 
	return {
		view: () => m(box, {
		    icon: app.icon ,
		    tools: [
		        m('span'+b`p 1ex`, ' '),
		        m('button'+b`margin-right: 2em`, { onclick: () => {
		            runtime.reset()
		            type = 'undefined'
		            globi = error = undefined
		            store(undefined)
		        }}, 'reset'),
		        
		        !error && !type && m('span'+spinningInlineBlock, SANDGLAS)
		    ],
		   // sub: info() !=  undefined && info().sub || ''
		}, m('div'+b`d flex; fd column `,
		   
    		m('div', {
    		    oncreate: async ({dom}) => { //--------------------------------------------        
ace(dom, {
	mode: "ace/mode/javascript",
	minLines: 1,
	maxLines: Infinity,
	tabSize: 2,
	useSoftTabs: true  
}).then(e => {
    
	window.ace.config.loadModule("ace/ext/language_tools", ()=> {
	  e.setOptions({
		enableBasicAutocompletion: true,
		enableSnippets: true,
		enableLiveAutocompletion: false 
	  })
	})
    e.on('change', debounce(run))
    editor(e)
})
} // ----------------------------------------------  
    		}),
    	    type  && m('div'+b`d flex`,
    	        m('tt'+b`fg 1;border-top: 1px solid silver; p 1ex 0 0 0`, 
    	        m('span'+b`c silver`, '> '), type),
    	        globi && globi.map(([n,t,v])=>m(
    	        'button', { onclick: ()=> {
    	            store({value: n})
    	     
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
app.icon = "🕵 JavaScript";
app.options = [
	{a: 'text', t: 'string', r: false, d: "", c: 'Text Preset' },
];
	
export default app;