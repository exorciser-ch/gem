import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import box from "/component/box.js";
import {col} from "/core/utils.js";

function encode(txt) {
	let conv = {
		'0': '\u200c',
		'1': '\u200d',
	};
	return ! txt.length ? '' : [...txt]
		.map(encodeURI)
		.map(x => x.length == 1 ?
			x.codePointAt(0).toString(2).padStart(8, 0) :
			x.match(/%../g).map(y => parseInt(y.slice(1), 16).toString(2).padStart(8, 0)).join(''))
		.join('')
		.match(/./g)
		.map(x => conv[x]).join('');
}


function utf8bin (txt) {
	 return !txt.length ? '' :[...txt]
		.map(encodeURI)
		.map(x => x.length == 1 ?
			x.codePointAt(0).toString(2).padStart(8, 0) :
			x.match(/%../g).map(y => parseInt(y.slice(1), 16).toString(2).padStart(8, 0)).join(''))
		.join('')
}
function decode(txt) {
	try {
		let conv = {
		'\u200c': '0',
		'\u200d': '1',
	};
	txt = txt.replace(/[^\u200c\u200d]/g,'')
	txt = txt.replace(/\u200c/g,'0')
	txt = txt.replace(/\u200d/g,'1')
	
	txt = txt.match(/.{8}/g).map(x=>parseInt(x,2).toString(16))
	txt = decodeURI('%'+txt.join('%'))
	} catch (ex) {
		throw 'Malformed invisible ink message'
	
	}
	return txt
}


const app = ({query, store, info}) => {
		
	store.map(m.redraw)

	const value = () => {
		
		if (store()) return store().text || '';
		if (query().text) return query().text || '';
		else return '';
	}
	
	store.map(v=> {
		error = ''
		let i = { icn: app.icon, col: col.unset }
		if ( v && v.text && v.text.length>0) {
			i.col = col.green
			i.sub = v.text.length
		}
		info(i)
	})
	
	const tools = () => [
		
		// '🔥 heat up'),
		
		m(`span`+b`p 0 0.5ex; m 0.2ex; bc goldenrod; c white; br 0.5ex; cursor: pointer`, {
			onclick: () => { store(undefined); info(undefined) }
		},'reset')
	]
	var error, encoded, showbin = true, showzwc = true, showzwcbin = false;
	return { 
		view: () => m(box, {
			icon: app.icon,
			tools: tools(),
			sub:  value().length+ '/500'
		},
			m('div',
				m('div'+b`d flex; margin-top: 1ex`,
				'👀',
					
				m('div'+b`margin-left: 0.5ex;fg 1;d flex;fd column`,
				m('textarea'+b``, {
					maxlength: 500,
					placeholder: 'Botschaft in Klartext …', 
					value: value(),
					onupdate: ({dom}) => {
						dom.style.height = 'auto';
						dom.style.height = (1+dom.scrollHeight) + 'px';
					},
					oninput: ({target}) => {
						store({text: target.value});
						target.style.height = 'auto';
						target.style.height = (1+target.scrollHeight) + 'px';				
					} 
				}),
				m('div'+b`fs 80%;d flex; ; flex-wrap: wrap`,
					m('span'+b`cursor: pointer`, { onclick: () => showbin=!showbin}, (showbin ? '⏶':'⏷') +'Binär Codierung (' + utf8bin(value()).length+' Bit): '),
					
					showbin ?
					(utf8bin(value()).match(/.{8}/g)||[]).map(x=> m('tt'+b`border-radius: 0.5ex;bc #eef; m 2px`, x)):m('span'+b`padding-left: 0.5ex`, ' …')
				),
				)),
				
				m('div'+b`d flex; margin-top: 1ex; padding-top: 2ex; border-top: 1px solid silver`,
					'🍋',
					m('div'+b`margin-left: 0.5ex;fg 1;d flex;fd column`,
						m('div'+b`d flex`,
							m('input'+b`fg 1`, {
								placeholder: 'Digitale Geheimtinte …',
								oncreate: ({dom}) => encoded = dom,
								oninput: ({target}) => { try {
									let text = decode(target.value)
									console.log('decoded', text)
									store({text})
									} catch (ex) {
										console.warn(ex)
										error = ex
									}
								},
								value: encode(value())
							}),
							m('button', { 
								onclick: () => {
									encoded.select();
									document.execCommand('copy')
								}
							},'copy (' + encode(value()).length + ')')
						),
						
				

					m('div'+b`fs 80%;d flex; flex-wrap: wrap`,
						m('span'+b`cursor: pointer`, { onclick: () => showzwc=!showzwc}, (showzwc ? '⏶':'⏷') + 'ZWCs: '  ),
						
						showzwc ? [...encode(value())].map(x=> 
							m('tt'+b`border-radius: 0.5ex;bc #${x!='\u200c'?'afa':'faa'}; m 2px`,  x=='\u200c'?'ZWNJ':'ZWJ')) : m('span'+b`padding-left: 0.5ex`, ' …')
					),
					m('div'+b` fs 80%; d flex;flex-wrap: wrap`,
						m('span'+b`cursor: pointer`, { onclick: () => showzwcbin=!showzwcbin}, (showzwcbin ? '⏶':'⏷') + 'Binärcodierung ZWCs ('+utf8bin(encode(value())).length+' Bit): ' ),
						showzwcbin ? (utf8bin(encode(value())).match(/.{8}/g)||[]).map(x=> m('tt'+b`border-radius: 0.5ex;bc #eef; m 2px`, x)):m('span'+b`padding-left: 0.5ex`, ' …')
					)
					),
				),
			),

		)
	}
}
app.presets = true;
app.persistent = true;
app.icon = "🔏";
app.options = [
	{a: 'text', t: 'string', r: false, d: "", c: 'Text Preset' },
]
	
export default app;