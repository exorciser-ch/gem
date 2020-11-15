import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";

import g from "/vendor/gibberishaes.js";
import box from "/component/box.js";
import {col} from "/core/utils.js";
 
const copyDom = (dom) => {
    let dis = dom.disabled;
    dom.disabled = false;
    dom.select();
    document.execCommand('copy')
    dom.disabled = dis
}

const app = ({query}) => {


	let encrypt, msg , key, plain, cipher, resdom;

    function update() { 
        encrypt = encrypt ?? (query()?.mode != 'decrypt');
        key = key ?? query()?.key ?? ''
        plain = plain ?? query()?.plain ?? ''
        cipher = cipher ?? query()?.cipher ?? ''
		msg = undefined
		try {
		    if (encrypt) {
		        cipher = g.enc(plain, key)
		    } else {
		        plain = g.dec(cipher, key)
		    }
		} catch(e) { msg = '⚠️ '+e }
	}
	
    update()
    
    query.map( () => {
        update()
        m.redraw()
    })
    

	return { 
		view: () => m(box, {
			icon: app.icon,
			tools: m('button', {
    			onclick: () => {
    			    encrypt = plain = cipher = key = msg = undefined
    			    update()
    			}
		    }  ,'reset')
		},  m('dl'+b`m 0`,
			m('dt', 'Mode'),
			m('dd'+b`d flex;`,
				m('button'+b`bc ${encrypt ? col.std: 'white'}`, {
				    disabled: encrypt,
					onclick: () => { encrypt = true; update() }
				}, 'Encrypt'),
				m('button'+b`bc ${encrypt?'white': col.std}`, {
				    disabled: !encrypt,
					onclick: () => { encrypt = false; update() }
				},'Decrypt')
			),
            m('dt', encrypt? 'Plain Text':'Cipher Text'), 
			m('dd'+b`d flex; fd column`, m('textarea'+b`h 7em;ff monospace`, {
				value: encrypt?plain:cipher,
				
				oninput: ({target}) => {
				    if (encrypt) {
				       plain = target.value
				       cipher = undefined
				   } else {
				        cipher = target.value
				        plain = undefined
				   } update();
				}
			})),
			m('dt', 'Key'),
			m('dd'+b`d flex; fd column`, m('input'+b`ff monospace`, {
				maxlength: 100,
				value: key,
				oninput: ({target}) => { key = target.value ;  update()	}
			})),
			m('dt', encrypt ? 'Cipher Text' : 'Plain Text',
			    m('button', { onclick: () => copyDom(resdom) }, 'copy')
			),
			m('dd'+b`d flex;fd column`,
			    m('textarea'+b`ff monospace;white-space: wrap; height: 4em; m 0`, {
				    oncreate: ({dom}) => resdom = dom,
				    value: encrypt?cipher:plain, disabled: true
			    })
			),
		),
		msg && m('span'+b`c red; fw bold`, msg)
	)}
}
app.presets = true;
app.icon = "🔐 AES ";
app.options = [
	{a: 'key', t: 'string', r: false, d: "", c: 'Key' },
	{a: 'plain', t: 'string', r: false, d: "", c: 'Plain Text' },
	{a: 'cipher', t: 'string', r: false, d: "", c: 'Cipher Text' },
	{a: 'mode', t: 'string', r: false, d: "", c: 'encrypt|decrypt' },
]

export default app;