import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import { col } from "/core/utils.js";
import box from "/component/box.js";

export const flag = ({
	target,
	query,
	store,
	info
}) => {

	// default values
	query = query.map(q => Object.assign({
		label: q.label || 'Capture the Flag',
		icon: q.icon || '🏁',
		subs: q.subs || ['❌', '✅', ''],
		col: q.col || [col.red, col.green, col.unset]
	}, q))

	// actions
	const onclick = () => store({
		captured: (status() + 3 - 1) % 3
	})


	// helper
	const status = () => {
		let s = store();
		if (s == undefined || s.captured == undefined) return 2;
		return (+s.captured) % 3
	}

	// summary
	const i = store.map(v => {
		let _ = {
			icn: query().icon,
			sub: query().subs[status()],
			col: query().col[status()],
		};
		if (v === undefined) return _;
		info && info(_);
		return _;
	});

	const c = () => query().col[status()];
	const cp = () => col.pastel(c(), 0.10);

	return {
		view: () => m('div' + b `
    		display: flex;
    		margin: .5ex 0 .5ex 0;
    		border: 1px solid ${c()} !important;
    		border-radius: .5ex;
    		padding: 0.5ex;
    		cursor: pointer;
    		background-color: ${cp()} !important;`,
    	    { onclick },
			query().icon,
			m('div' + b `flex-grow:1;p: 0 0.5ex`, ` ${query().label} `),
			query().subs[status()]
		)
	};
};

flag.presets = false;
flag.persistent = true;
flag.options = [{
		a: 'icon',
		t: 'string',
		r: false,
		d: '🏁',
		c: 'Icon'
	},
	{
		a: 'label',
		t: 'string',
		r: false,
		d: 'Capture the Flag',
		c: 'Label'
	},
	{
		a: 'subs',
		t: 'list',
		r: false,
		d: ['❌', '✅', ''],
		c: 'Sub Markers'
	},
	{
		a: 'col',
		t: 'list',
		r: false,
		d: ['#f00', '#0f0', '#ddd'],
		c: 'Color Set'
	}
]

export default flag;