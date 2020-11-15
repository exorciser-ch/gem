import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";

import box from "/component/box.js";
import {
	col as color
} from "/core/utils.js";
import environement from "/core/environement.js";

const {
	stringify
} = JSON
const deepEqual = (a, b) => stringify(a) == stringify(b)

const cell = 'td' + b `ff monospace;fs 120%;ta center; bc white; border 1px solid silver`

let spinningInlineBlock = b `fs 80%;d inline-block`.$animate('1s ease infinite', {
	from: b.transform('rotate(0deg)').style,
	to: b.transform('rotate(360deg)').style
})
let SANDGLAS = '⌛';

export const app = ({
	store,
	query,
	info
}) => {

	let js, time, runtime = environement(),
		checking = false, sub, col = color.unset,
		sum, results,ref, parameters, tests, error;

	query.map(q => {
		ref = q.ref || 'add'
		parameters = q.parameters || ['a', 'b']
		tests = q.tests || [
			[
				[1, 1], 2
			],
		]
	})


	store.map(s => {
		time = s?.time;
		sum = s?.sum;
		js = s?.js;
		col = s?.col
		sub = s?.sub
		results = s?.results
		if (!js) {
			info({ icn: '🧫', col: color.unset})
		} else {
		    info({ icn: '🧫', col, sub})
		}
        m.redraw()
	})

	function check() {
		checking = true;
		error = undefined;
		js = document.querySelector(`[ex-id=${ref}]`)?.getAttribute('ex-js');
		js = decodeURI(js);
	//	js = 'function add(a,b) {return a+b}'
		let code = String(js) + "\n;\n" +
			JSON.stringify(tests)
		time = new Date().toLocaleString()
		code += `.map(([args, target], res)=> ${ref}(...args))`
		runtime.exec(code).then(r => {
			results = r.value || []
			sum = 0
			results.forEach((r, i) => {
				sum += +deepEqual(r, tests[i][1])
			})
			checking = false;
			sub = '🏆'
			col = color.green
			if (sum < tests.length) {
				sub = `${sum}️/${tests.length-sum}`
				col = color.red
			}
			store({js, time, results, sub, col, sum})
			m.redraw()
		}).catch(r => {
			error = r.error || 'timeout';
			checking = false
			store({
			    info: 'catch',
			    error,
				js,
				time, col: color.red, sub: '⚡'
			})
			m.redraw()
		})
	}

	return {
		view: () => m(box, {
				icon: '🧫 Unit Tests',
				tools: [
					m('button', {
						disabled: checking,
						onclick: check
					}, '✔️ Check'),
					checking && m('button', {
						onclick: () => runtime.reset()
					}, '⏹ Stop'),
					m('span' + b `w 3em`, ' '),
					checking ? m('span' + spinningInlineBlock, SANDGLAS) :
					m('tt', 'function ' + ref + '(' + parameters + ')')
				],
				sub: info()?.sub
			},

			error && m('pre' + b `bc #fee; c red; fw bold`, error),
			js && m('div' + b `d flex; fd column`, m('span', 'Code: Zuletzt geprüft am ' + time), js ? m('textarea' + b `ff monospace;height: 3em`, {
				value: js,
				disabled: true
			}) : '...'),
			results && [m('div' + b `m 1ex 0 0 0`, 'Tests'), m('table' + b `m 0`,
				m('tr',
					m('th'),
					parameters.map(p => m('th' + b `ta center`, p)),
					['soll', 'ist'].map(p => m('th', p)),
				),
				tests.map((t, i) => m('tr',
					m('td' + b `ta right`, (i + 1) + '.'),
					t[0].map(p => m(cell, JSON.stringify(p))),
					m(cell + b `bc #eef`, stringify(t[1])),
					results ? m(cell + b `bc ${deepEqual(results[i], t[1])?'#dfd':'#faa'}`, results[i]==undefined?'undefined':stringify(results[i])) : m(cell, '?'),
				))
			)]
		)
	}

}

app.persistent = true;
app.options = [{
		a: 'ref',
		t: 'string',
		r: true,
		d: "add",
		c: 'ref to programming app and function to be tested'
	},

	{
		a: 'parameters',
		t: 'array',
		r: true,
		d: ['a', 'b'],
		c: 'parameter'
	},
	{
		a: 'tests',
		t: 'array',
		r: true,
		d: [
			[
				[1, 1], 2
			]
		],
		c: 'testcases'
	},
];
export default app;