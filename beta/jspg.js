import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import box from "/component/box.js";
import {col} from "/core/utils.js";

console.clear()
  
const app = ({query, store, info}) => {
	
	//store(false)
	
	let iframe = m.stream(), 
	    ready = m.stream(),
	    current = m.stream({}),
	    template = m.stream(),
	    save = false, load = false

    m.stream.merge([ready, query]).map(([r,q]) => {
      r.postMessage( {
          cmd: 'template', ...q} , '*')
    })
     
    m.stream.merge([ready, store, current, query]).map(([r,s, c,q])=> {
        s = JSON.stringify( {html:'', css:'', javascript:'', ...s})
        c = JSON.stringify( {html:'', css:'', javascript:'', ...c})
        q = JSON.stringify( {html:'', css:'', javascript:'', ...q})
        
        save = c!=s
        console.log(c,s)
        m.redraw()
    })
    
    
    window.onmessage = ({source, data: {status, html, css, javascript}={}}) => {
        if (source!=iframe().contentWindow) return
        if (status == 'ready' ) {
            ready(source)
        } else if (status=='updated') {
            current({html, css, javascript}) 
        }
    }
    

	
	return {
		view: () => m(box, {
		    icon: app.icon ,
		    sub: info() !=  undefined && info().sub || '',
		    tools: [
		        m('button', { disabled: !save, onclick: () => {
		            store(current()||{})
		        }}, 'save'),
		        m('button', { disabled: !load, onclick: () => {
		            //sourceWindow.postMessage({ cmd: 'template', ...store() }, '*');   
		        }}, 'load'),
		    ]
		},
		    m('div'+b`d flex;fd column`, 
    	    m('iframe'+b`border 0; h 20em`, {
    	        src: 'https://app.exorciser.ch/jspg',
    	        oncreate: ({dom}) => iframe(dom)        
    	    })
    	)
	    )
	};
};

app.presets = true;
app.persistent = true;
app.icon = "🧱";
app.options = [
	{a: 'text', t: 'string', r: false, d: "", c: 'Text Preset' },
];
	
export default app;