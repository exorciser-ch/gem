import m from "/vendor/mithril.js";
import b from "/vendor/bss.js"; 
import box from "/component/box.js"; 
import {jwt_parse} from "/core/utils.js"; 

export default (g) => {
    
	// thx https://medium.com/javascript-inside/safely-accessing-deeply-nested-values-in-javascript-99bf72a0855a
	const get = (p, o) =>
		p.split('.').reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o)
		
	const attribs = [
		'target.id',
		'context.iss',
		'context.sub',
		'context.auth',
		'context.grps',
		'context.usrs',
	]
	return { view: () => m(box, {icon: '🧐 Inspector', meta: true}, [
		m('dl'+b``.$nest('dt',b`padding-top:1ex`),
			attribs.map(a => [
				m('dt', a),
				m('dd', m('pre', JSON.stringify( get(a, g))))
			])
		)
	])}
    
};