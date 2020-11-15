import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import box from "/component/box.js";
import {col} from "/core/utils.js";


const anyToBinDidgits = (x, pad=0, filler=0) => {
     x = +x || 0
     console.log(x)
	 x = (x<0 || Math.floor(x) != x) ? 0 : x
	 return [...x.toString(2).padStart(pad, filler)]
}

const app = ({query, store, info}) => {
	
	/*store.map(s => info({
	    icn: app.icon,
	    sub: s != undefined && s.text && s.text.length
	}));*/
	
	let s1, s2, c, s, n
	
	query.map(q => {
	    s1 = anyToBinDidgits(q.a )
	    s2 = anyToBinDidgits(q.b)
	    n = Math.max(s1.length, s2.length)
	    c = Array(n+1).fill('*')
	    s = Array(n+1).fill('*')
	})
	
	let digit = b`border-radius: .5ex; border: 1px solid silver; p 0.1ex`
	return {
		view: () => m(box, {
		    icon: app.icon ,
		    sub: info() !=  undefined && info().sub || ''
		}, 
	    
	    m('div'+b`d grid;jc start;ai center`,
	        s1.map((s, i) => m('div'+b`p .5ex;bc #eee; m 0.25ex; grid-column: ${n-s1.length+i+3};grid-row: 1`, s)),
	        m('div'+b`grid-column: 1;grid-row: 2`, '+'),
	        s2.map((s, i) => m('div'+b`p .5ex;bc #eee; m 0.25ex; ;grid-column: ${n-s2.length+i+3};grid-row: 2`, s)),
            c.map((s, i) => m('div'+b`p .5ex;bc #eee; m 0.25ex; grid-column: ${n-c.length+i+3};grid-row: 3`, s)),
            m('div'+b`grid-row: 4; grid-column: 1/13;border-top: 1px solid black`,  ),
            m('div'+b`grid-column: 1;grid-row: 5`, '='),
	        s.map((s, i) => m('div'+b`p .5ex;bc #eee; m 0.25ex; grid-column: ${n-c.length+i+3};grid-row: 5`, s)),
	    )
	)};
};

app.presets = true;
app.persistent = true;
app.icon = "🧱";
app.options = [
	{a: 'text', t: 'string', r: false, d: "", c: 'Text Preset' },
];
	
export default app;