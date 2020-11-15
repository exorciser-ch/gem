import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import box from "/component/box.js";
import {col} from "/core/utils.js";


let spinningInlineBlock = b`d inline-block`.$animate('1s ease infinite', {
      from: b.transform('rotate(0deg)').style,
      to: b.transform('rotate(360deg)').style
    })
let SANDGLAS = '⌛';
const copyDom = (dom) => {
    let dis = dom.disabled;
    dom.disabled = false;
    dom.select();
    document.execCommand('copy')
    dom.disabled = dis
}
//const sep = m('span'+b`w 1em`, ' ')
const app = ({query, store, info}) => {
	
    const defaultBits = 512 
	const setBits = bits => store({...store(), bits})
	let working, privateDom, publicDom;
	
	const generate = async () => {
	    working = true; m.redraw()
	    let r = await m.request({ method: "GET",
	        url: "https://gem.exorciser.ch/lib/crypto.php",
            params: {bits: store()?.bits || defaultBits}
        })
        store({ ...store(), ...r})
        working = false
        m.redraw()
	}
	// working ? m('span'+spinningInlineBlock, SANDGLAS)
	return { 
		view: () => m(box, { 
		    icon: app.icon ,
		    tools: working ? [ 'Generating keys ...', m('span'+spinningInlineBlock, SANDGLAS)] : [
		        m('button', { 
		            disabled: working,
		            onclick: generate
		        }, 'Generate'  ),
		        //sep, 
		        ' Bits: ', 
		        m('select', {
		            onchange: ({target}) => store({bits: +target.value}) 
		        }, [512,1024,2048,4096].map(b => m('option', { selected: b==(store()?.bits||defaultBits)}, b))),
		        m('button', { onclick: ()=>store({}) }, 'Reset')
		        ],
		    sub: info() !=  undefined && info().sub || ''
		},
    	m('dl'+b`m 0`,
    	m('dt', 'Private Key',
    	    m('button', {
    	        disabled: working || !store()?.private,
    	        onclick: () => copyDom(privateDom)
    	    },'copy')
    	),
    	m('dd'+b`d flex;fd column`, 
    	    m('textarea'+b`ff monospace;m 0;height: 8em;white-space: pre`, {
    	        disabled: true,
    	        oncreate: ({dom}) => privateDom = dom,
    	        value: store()?.private || ''
    	    })),
    	m('dt', 'Public Key',
    	    m('button', {
    	        disabled: working || !store()?.public,
    	        onclick: () => copyDom(publicDom)
    	    },'copy')
    	),
    	m('dd'+b`d flex;fd column`,  
    	    m('textarea'+b`ff monospace;m 0;height: 4em;white-space: pre`, {
    	        disabled: true,
    	        oncreate: ({dom}) => publicDom = dom,
    	        value: store()?.public || ''
    	    })),
    	))
	};
};

app.presets = true;
app.persistent = true;
app.icon = "🔑";

export default app;