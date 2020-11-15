import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import box from "/component/box.js";
import {col} from "/core/utils.js";
import jsencrypt from "/vendor/jsencrypt.js"
import aes from "/vendor/gibberishaes.js";

const randomKey = (l=24,r,v) => '.'.repeat(l).replace(/./g, (c) => 
    (r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8), v.toString(16)))

const encode = (text, publicKey) => {
  let key = randomKey(), rsa = new jsencrypt()
  text = aes.enc(text, key)
  rsa.setKey(publicKey)
  key = rsa.encrypt(key)
  return (key+'.'+text ).replace(/\s/g, '').match(/.{0,64}/g).join('\n');
}

const decode = (cipher, privateKey) => {
  let [a, b] = cipher.replace(/\n/g, '').split('.'), rsa = new jsencrypt()
  rsa.setKey(privateKey)
  a = rsa.decrypt(a)
  b = b.match(/.{0,64}/g).join('\n')
  return aes.dec(b, a)
}

const copyDom = (dom) => {
    let dis = dom.disabled;
    dom.disabled = false;
    dom.select();
    document.execCommand('copy')
    dom.disabled = dis
}
const app = ({query}) => {
	
	
	
	let data, key, output, outdom
	
	query.map(q => {
	    data =  query()?.data ?? ''
	    key =  query()?.key ?? ''
	    m.redraw()
	    
	}) 
	
	const update = () => { try {
	    output =  "Chiffrieren/Dechiffrieren fehlgeschlen."
	    if (!key) {
	        output = "Error: private or public key expected"
	    }
	    
	    if (key.match('PUBLIC')) {
	        output = encode(data, key)
	    } else if (key.match('PRIVATE')) {
	        output = decode(data, key)
	    }  
	} catch(e) { output = e }}
	update()
	return { 
		view: () => m(box, { 
		    icon: app.icon ,
		    tools: [
		        m('button', {
		            onclick: () => {
		                data = query()?.message || ''
	                    key =query()?.key || ''
		                update()
		            }
		        }, 'reset')] ,
		},
        m('dl'+b`m 0`,
        m('dt', 'Data'),
        m('dd'+b`d flex; fd column`, m('textarea'+b`ff monospace;height 8em`, {
            oninput: ({target}) => {data = target.value, update()},
            value: data
        })),
        m('dt', 'Key'),
        m('dd'+b`d flex; fd column`, m('textarea'+b`ff monospace;white-space: pre;height 4em`, {
            placeholder : 'Add a private or public key ...',
            oninput: ({target}) => {key = target.value, update()},
            value: key
        })),
        m('dt', 'Output ',
            key.match('PUBLIC') ? '🔒 sealed envelope ✉️ ' :
            key.match('PRIVATE') ? '📄️ message unlocked 🔓' : '',
            m('button', { onclick : () => copyDom(outdom) }, 'Copy')
        ),
        m('dd'+b`d flex; fd column`, m('textarea'+b`ff monospace;white-space: pre;height 8em`, { 
            oncreate: ({dom}) => outdom = dom,
            disabled: true,
            value: output
        })),
        ))
	};
};

app.presets = true;
app.icon = "🔐 RSA/AES – Envelope Encription";
app.options = [
	{a: 'key', t: 'string', r: false, d: "", c: 'Key' },
	{a: 'data', t: 'string', r: false, d: "", c: 'Plain Text' },
]
export default app;