import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import box from "/component/box.js";
import {col} from "/core/utils.js";
import md5 from "/vendor/md5.js";
import sha from "/vendor/sha.js";

const copyDom = (dom) => {
    let dis = dom.disabled;
    dom.disabled = false;
    dom.select();
    document.execCommand('copy')
    dom.disabled = dis
}

const app = ({query, store, info}) => {

	
	let data = query()?.data || '',
	    method = query()?.method || 'MD5',
	    outputdom;
	
	
	function hash() {
	    if (method == 'MD5') return md5(data)
	    let shaObj = new sha(method, "TEXT", { encoding: 'UTF8'});
        shaObj.update(data);
        return shaObj.getHash("HEX");
	} 
	
	return { 
		view: () => m(box, { 
		    icon: app.icon ,
		    tools:[
		        m('span'+b`padding-left: 1ex`,  "Algorithm: "),
    		    m('select', { onchange: ({target}) =>  method = target.value },
    		        ['MD5', 'SHA-256','SHA-384', 'SHA-512'].map(b => m('option', { selected: b==method}, b))),
    		    m('button', { 
    		        onclick: () => {
    		            data = query()?.data || '',
	                    method = query()?.method || 'MD5'
    		        }
    		    },'Reset')
		    ],
		},
    	m('dl'+b`m 0`, 
    	    m('dt', 'Data'),
    	    m('dd'+b`d flex; fd column`, m('textarea'+b`ff monospace`, { 
    	        oninput: ({target}) => { data = target.value, hash() }
    	    }, data)),
    	    m('dt',
    	        'Hash',
    	         m('button', { onclick: ({target})=> copyDom(outputdom) },'Copy')
    	    ),
    	    m('dd'+b`d flex; fd column`,
    	        m('textarea'+b`white-space: pre-wrap; ff monospace`, {
    	            oncreate: ({dom}) => outputdom = dom,
    	            disabled: true,
    	            value:hash()
    	        }))
    	))
    }
}

app.icon = "#️⃣";

export default app;