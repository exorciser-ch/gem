import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";

import box from "/component/box.js";
import {col} from "/core/utils.js";

export const app = ({query}) => {
	
	let msg = '', linktext = (query() && query().link) || 'Link'; 
	
	window.addEventListener('message', (e) => {
		try {
			const id = query().ref;
			const refsrc = [...document.querySelectorAll("[ex-id]")].filter(e => e.getAttribute('ex-id')==id)[0].iframe.contentWindow;
			if (refsrc!=e.source) return;
			let js = e.data.javascript;
			if (!js) return;
			msg = "javascript:(function(){"+encodeURIComponent(js)+"})();";
			m.redraw();
		} catch (e) { console.warn(e)}
	});
	
	let tools = [m('span'+b`padding-left: 1em`, 'Linktext: '), m('input', {value: linktext, oninput: ({target})=> { console.log(target.value); linktext=target.value; m.redraw();} })];
	
	return { view: () => m(box, {
			icon: '🔖 Bookmarklet',
			tools
		}, [ 
		m('a'+b`display: block; margin: 1ex 0; text-align: center; color: white; font-weight: bold; padding: .5ex; background-color:  ${col.std}; border-radius: 1ex;`, {href: msg}, linktext),
		m('pre', msg)
	])}
	
}


export default app;