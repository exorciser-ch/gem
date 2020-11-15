import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import {col} from "/core/utils.js";
import badge from "/component/badge.js";

export default ({query, context: {gems, grps, usrs, storage}}) => {

	let heatmapids = [...gems()]
	.filter( g => g.query().ids)
	.map( g => g.query().ids)
	.join()
	.split(',');
	if (heatmapids.length==1 && heatmapids[0]=='') heatmapids =[];

	
	const lsg = (a) => localStorage.getItem('xga-user-'+a);
	const lss = (a,v) => localStorage.setItem('xga-user-'+a,v);

	// state
	const open = m.stream(lsg('open')==1 || false);
	open.map(o => lss('open', +!!o));
	
	const group = m.stream(lsg('group') || grps && grps[0]);
	group.map(g => lss('group', g));
	
	m.stream.merge([open, group]).map(([o,g]) => {
		if (!o) return storage.user(JSINFO.user);
		const lastUser = lsg('user');
		const userEntry = usrs.filter(u => u.i == lastUser)[0];
		if (!userEntry || !userEntry.g.includes(g)) return storage.user(JSINFO.user);
		storage.user(lastUser);
	}); storage.user.map(u => u!=JSINFO.user && lss('user', u));
	
	return { view: () => !grps ? m('') :  m('div'+b`
		position: fixed;
		display: inline-block;
		zIndex: 99;
		top: 0;
		right: 0;
		padding: 0.5ex;
		//opacity: .9;
		border: 1px solid ${col.meta};
		border-radius: .5em 0 0 .5em;
		background-color: ${col.pastel(col.meta, 0.1)}
	`, !open() ? m('span', {
			onclick:()=> open(!open())
	}, ' ❰ 👥') : m(manager, {
		open, group, grps, usrs, gems,
		user: storage.user,
		backend: storage.backend,
		heatmapids
	})) // m(manager,attrs)
	}
}

const manager = { view: ({attrs: {open, group, grps, user, usrs, backend, gems, heatmapids}}) => {
	let ids = gems().filter(g=>g.target.id).map(g=>g.target.id);
	return [
		m('div'+b`display: flex`, [
			m('span'+b`padding: .5ex; flex-grow: 0`,' 👥 '),
			grps && m('select'+b`flex-grow:1`, { oninput: ({target}) => {
				user(JSINFO.user); // FIXME
				group(target.options[target.selectedIndex].value);
			}},
				grps.map(g => m('option', {selected: group()==g, value: g}, g))
			),
			m('button'+b`flex-grow: 0`, { onclick: ()=> {
				backend.refresh();
			}},'🔄'),
			m('button'+b`flex-grow: 0`, { onclick: ()=> {
				//user(JSINFO.user); // FIXME
				open(false);
			}},'✖️')
		]), 
		user()!=JSINFO.user && m('div'+b`text-align: center; color: white; margin: 0.75ex; background-color: ${col.meta};  padding: 0.25ex; border-radius: 0.5ex`, `⚠ remote @${user()} ⚠`)
		,m('table'+b`display: block;border: none;margin: 1ex;margin-right: 0;font-size: 80%;max-height: 25vh;overflowY: auto;`, {

		}, usrs.filter(u => u.g.includes(group()))
			.sort((a,b)=>a.n.localeCompare(b.n))
			.map((u,i) => m('tr'+b`
				background-color: ${user()==u.i?'goldenrod !important':''}
			`.$hover`background-color: silver`.$nest('td', b`
				border: none; padding: 0.1ex;
			`), {
				tabIndex: 0, ui: u.i, uindex: i,
				onclick: ({target}) => user(u.i),
				onkeydown: (e) => {
					if (e.keyCode==13) {
						console.log(13);
						user(e.target.getAttribute('ui'));
					} else if (e.keyCode==38) {
						e.preventDefault();
						let _ = +e.target.getAttribute('uindex');
						if (_ = document.querySelector(`[uindex='${_-1}']`)) {
							_.focus();
							user(_.getAttribute('ui'));
						};
					} else if (e.keyCode==40) {
						e.preventDefault();
						let _ = +e.target.getAttribute('uindex');
						if (_ = document.querySelector(`[uindex='${_+1}']`)) {
							_.focus();
							user(_.getAttribute('ui'));
						};
					}
				},
			}, [
				//m('td', u.i),
				m('td', u.n), ids.length>0 &&  //m('td'+b`font-size: 80%`,
					ids.map(id=> {
						let s = backend.get(u.i, id+'-i') || {};
						return m('td'+b`text-align: center`, badge({
							icn: s.icn || '❔',
							sub: s.sub,
							col: s.col || col.unset,
							href: `#${id}`
						}));
					}),
				//)
				, heatmapids.length>0 &&  m('td'+b`max-width: 200px;line-height:1.4ex`, heatmapids.map(i => {
					let d = backend.get(u.i, i+'-i') || {} ;
					
					return m('div'+b`
							display:inline-block;
							width: 1.4ex;
							height: 1.4ex;
							background-color: ${d.col || '#fff'};
						`,'');

				}))
			])))
	]

}}
