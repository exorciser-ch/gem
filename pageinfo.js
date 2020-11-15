import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import box from "/component/box.js";
import badge from "/component/badge.js";
import {col} from "/core/utils.js";

export default ({context:{ gems, storage}}) => {

	const icon = m('span'+b`padding-right: 1ex`, { onclick: () => window['x-gem-msg'](`gem ids: ${gems().filter(g=>g.target.id).map(g=>g.target.id).join()}`) }, 'ℹ️ PageInfo');
	
	return { view: () => m(box, {
		icon,
		tools: gems()
		.filter(g=>g.target.id)
		.map(g=> {
			let s = storage(g.target.id+"-i")() || {};
			return badge({
					//print: console.log(s.col, col),
					icn: s.icn || s.icon || (g.app && g.app.icon),
					sub: s.sub || '',
					col: s.col  || col.unset ,
					href: `#${g.target.id}`
				});
		}), 
			//sub: '👤' +storage.user(),
			meta: true}, )
	}

};