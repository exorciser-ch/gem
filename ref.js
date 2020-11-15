import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import badge from "/component/badge.js";
import {col} from "/core/utils.js";

export default ({target, query, context: {storage}}) => ( {view: () => {

	query = query.map(v => ({
		ids : '',
		...v
	}))
	return m ('span'+b`font-size: 65%`, query() && query().ids.split(',').map(id => {
		let d = storage.backend.get(storage.user(), id+'-i') || {};
		return badge({
			icn: d.icn || '❔', 
			sub: d.sub,
			col: d.col || col.unset,
			href: '/'+query().page+'#'+id
		})	
	}))
}})
