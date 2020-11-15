import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import box from "/component/box.js";

export default ({target, query, context}) => {

	const domain = 'milestones'; // Siehe Attribute Plugin
	const exmodul = "marked";
	const gemapp = "flag";
	const gemattr = "captured";
	
	// IDS ----------------------------------------------------------------
	//const exids = m.stream([...document.querySelectorAll(`[ex-module=${exmodul}]`)]
	//	.map(e => e.getAttribute('ex-page')+'#'+e.getAttribute('ex-id')));
	const exids = m.stream([...document.querySelectorAll(`[milestone]`)]
		.map(e => e.getAttribute('mskey')))
	//console.log(document.querySelectorAll('))
	exids.onchange = (e) => {
		exid(e.target.selectedOptions[0].value);
		const i = e.target.selectedIndex;
		console.log('selection', i);
		gemid(gemids()[i]);
	};
	const exid = exids.map( v=> v[0])
	
	const gemids = m.stream([...document.querySelectorAll(`[x-gem=${gemapp}]`)]
		.map(e => e.id));
	gemids.onchange = (e) => {
		gemid(e.target.selectedOptions[0].value);
		const i = e.target.selectedIndex;
		console.log('selection', i);
		exid(exids()[i]);
	}
	const gemid = gemids.map( v=> v[0])
	
	// DATA ----------------------------------------------------------------
	const data = m.stream();
	if (JSINFO.user == 'vincent.tscherter') {
		fetch('https://exorciser.ch/migration.php')
		.then(r => r.json())
		.then(r => {
			data(r); m.redraw();
		})
	}
	const users = m.stream.merge([exid, data]).map(([exid, data]) => 
		exid && data && data[exid] && Object.keys(data[exid][domain]||{}) 
	)
	
	const transfer = () => {
		users().forEach(u => {
			const val = {};
			val[gemattr] = data()[exid()][domain][u];
			console.log(u+"."+gemid()+"="+JSON.stringify(val));
			context.storage.backend.set(u,gemid(),val);
		}); document.getElementById('firstsel').focus();
	} 
	
	return { view: () => JSINFO.user == 'vincent.tscherter' ?
	m (box, {meta: true, icon: "🥜 Legacy Data Migration"}, m('dl', [
		m('dt', 'from ➔ to'),
		m('dd', `exorciser/${exmodul} ➔ gem/${gemapp} [${gemattr}]`),
		m('dt', 'Ids', exid()),
		m('dd', [
			m('select', { id: 'firstsel', onchange: exids.onchange}, exids().map(id => m('option', {value: id, selected: exid()== id}, id))),
			' ➔ ',
			m('select', {onchange: gemids.onchange}, gemids().map(id => m('option', {value: id, selected: gemid()==id}, id))),
			exids().length != gemids().length && '⚡ mismatch ',
			m('button', {onclick: transfer}, 'transfer'),
		]),
		
		m('dt', 'data'),
		m('dd'+b`max-height: 20vh; overflow-y: auto`, m('table', users() && users().map(u => m('tr', [
			m('td', u), m('td', m('pre', data()[exid()][domain][u]))
		]))))
		
	])) : m('span', '') }

}
