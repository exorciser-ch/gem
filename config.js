import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import lz from "/vendor/lzstring.js";
import box from "/component/box.js";
import {queryObject} from "/core/utils.js";
//import {} from "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.2/ace.js";
import ace from "https://miruku.li/vendor/ace.js"


const debug = (...msg) => true && console.log('⚙️', ...msg);
debug('script start ...');

const options = (opts, action) => Array.isArray(opts) ?  m('table', m('tr', [
	m('th', ''),
	m('th', 'Attribute'),
	m('th', 'Type'),
	m('th', 'Required'),
	m('th', 'Default'),
	m('th', 'Description'),
]),opts.map(opt => m('tr', [
	m('td', {onclick: () => action(opt)},'📑'),
	m('td', m('tt', opt.a)),
	m('td', m('tt', opt.t)),
	m('td', opt.r ? 'Yes' : 'No'),
	m('td', m('tt', JSON.stringify(opt.d))),
	m('td', opt.c),
]))) : m('div', '⚡ invalid ops description!');

export default ({query, store, context}) => {
	debug('create app');

	let conf = query;

    let app = m.stream();
    
	conf.map( v =>  {
		let url = `./${v.app}.js`
		import(url).then(a=> {
			app(a.default);
			input(JSON.stringify( conf().remoteConfig || {}, null, '  ' ))
			m.redraw();
    })});
    // helper
    const button = (action, label) => m('button', typeof action == 'function' ? {onclick: action} : action, label);


	const input = m.stream('{}');
    const validInput = input.map(v => { try {
        JSON.parse(v); m.redraw(); return true;
    } catch (e) {
        return false;
    }})

	let editor;

	// app attrs
	const remoteConf = input.map(v => validInput() ? JSON.parse(v) : m.stream.SKIP);
	const remoteStore = m.stream(false);
	const remoteInfo = m.stream();

	const addId = m.stream(true);

	const enc = remoteConf.map(v => {
		v = lz.compressToEncodedURIComponent(JSON.stringify(v));
		store({0:v})
		return v;
	});
	const enc2 = remoteConf.map(v => m.buildQueryString(v));
	
	const enc3 = () => lz.compressToEncodedURIComponent(JSON.stringify({q: remoteConf(),s: remoteStore()}));

	// actions
	const actions = {
		input: ({target}) => input(target.value),
		resetInput: () => {
			input('{}')
			editor && editor.setValue(input());
		},
		format: () => {
			input(JSON.stringify(remoteConf(), null, '  '));
			editor && editor.setValue(input());
		},
		resetStore: () => remoteStore(undefined),
		copyStoreToInput: () => {
			input(JSON.stringify(Object.assign({}, remoteConf(),remoteStore()), null,'  '))
			editor && editor.setValue(input())
		},patchOption: (opts) => {
			let o = {};
			o[opts.a] = opts.d;
			input(JSON.stringify(Object.assign({},remoteConf(), o), null,'  '))
			editor && editor.setValue(input())
		},
	};


	let x = app.map(a => {
		let out  = a({
					app:a,
					query: remoteConf,
					store: remoteStore,
					info: remoteInfo,
				});
		return out;
	});

	// --- ID Button--------------------------------------------------------------------
	const id = m.stream();
	id.fetch = () => {
		fetch(`${context.pod}?gen=${context.iss}`)
		.then(res => res.text())
		.then(t=> {id(t); m.redraw()});
	}; id.map(debug);
	context && context.pod && context.iss && id.fetch();

	//b.css("dt:first-child", b`padding-top: 0 !important; border: none !important`);
	return { view: () => m(box, {
			icon: '⚙️ App Configurator',
			sub: context ? m('span'+b`cursor:pointer`, { onclick: () =>
				window.location = `https://gem.exorciser.ch/#!/share/${conf().app}?0=${enc3()}`
				}, '🔖')
				: m('span'+b`cursor:pointer`, { onclick: () => m.route.set('/share/:app', {app: conf().app}) },'🔖') ,
			meta: true
		},
	  	(conf().heading===false) && m('h1', '💎 app/'+conf().app),
			m('dl'+b``
				//.$nest('dt', b`font-weight: bold; border-top: 1px solid silver; padding-top: 2ex`)
				.$nest('dd', b`padding-top: 1ex`), [
			m('dt', 'Preview'),
            m('dd'+b`padding: 1ex 0 2ex 0`, app()? m(
				x()
			) : m('div', 'app?'),),
            m('dt', 'Options ',
				button(actions.resetInput, 'reset'),
                button({ disabled: !validInput(), onclick: actions.format}, 'format')
            ),
			m('dd'+b`padding-bottom: 1ex`, m('div', {
				//value: input(),
				oncreate: ({dom}) => {
				
					dom.style.height ='1em'
					ace(dom, {
						mode: "ace/mode/json",
						theme: "ace/theme/clouds",
						minLines: 2,
						maxLines: Infinity,
						tabSize: 2,
						useSoftTabs: true 
					}).then(e => {
						dom.style.border = 'none'
						editor = e
						e.setValue(input())
						e.on('change', () => input(editor.getValue()))
					})
				},
				//oninput: actions.input
			})),
			m('dd'+b`padding-bottom: 1ex`, app() ? options((app().options), actions.patchOption) : ''),
			app() && app().persistent && [
				m('dt', 'Store ', 
					(app() && app().presets) && button(actions.copyStoreToInput, '📑'),
					button(actions.resetStore, 'reset'),
				),
				m('dd', m('pre', JSON.stringify(remoteStore)))
			],
			m('dt', 'Embed', app() && app().persistent && id() && m('button', {onclick: id.fetch},'refresh id')),
            m('dd', '@dokuwiki-gem-plugin/lz-encoding ', enc().length,
				m('button'+b`font-size: 75%`, { onclick: () => {
					let e = document.getElementById('lzembedcode');
					e && (e.select(), document.execCommand("copy"));}
				},'📋 copy to clipboard'),
				m('input'+b`display: block;	width: 100%; font-family: monospace;
				`, { oninput: e => {
						try {
							e = e.target.value.match(/\?0=([^{#]*)/)
							e = lz.decompressFromEncodedURIComponent(e[1])
							input(e)
							editor.setValue(input())
						} catch (e) {
							console.warn(e)
						}
					},id: 'lzembedcode',
					value: `{{gem/${conf().app}?0=${enc()}${app() && app().persistent && id()?'#'+id():''}}}`,
				})),
            m('dd', '@dokuwiki-gem-plugin/url-encoding ', enc2().length,
				m('button'+b`font-size: 75%`, { onclick: () => {
					let e = document.getElementById('urlembedcode');
					e && (e.select(), document.execCommand("copy"));}
				},'📋 copy to clipboard'),
				m('input'+b`display: block;	width: 100%; font-family: monospace;
				`, { oninput: e => {
						try {
							e = e.target.value.match(/\{\{[^?]*(\?.*?)#?\w*?\}\}/)
							e = m.parseQueryString(e[1])
							input(JSON.stringify(e, null, '  '))
							editor.setValue(input())
						} catch (e) {
							console.warn(e)
						}
					},
					id: 'urlembedcode',
					value: `{{gem/${conf().app}?${enc2()}${app()&&app().persistent &&id()?'#'+id():''}}}`,
				})),
	]))
        }
}