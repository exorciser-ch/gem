import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import g from "/gem.js";

const noChoise = { icon: '🙋', score: 0}; 

const component = {
	
	view: ({attrs: {key, query, target}}) => {
		const s = g.store(key);
		
		let choices = ['✔️', '❌', '🤔'];
		if (query.c) {
			choices = query.c.split(',');
		}
		
		if (!s.ready) return m('span', g.wait);

		if (s()==undefined) s(noChoise);
		
		return m(g.std.div+b`display: flex; vertical-align: middle`, {
		
		}, [
			m('span', '🙋', m('sub', g.f(target.id)), ' '),
			m('span'+b`
				flex-grow:1;
				margin: 0 1ex 0 1ex;
				padding: 0 1ex 0 1ex;
				border-left: 1px solid black;
				border-right: 1px solid black;
			`, query.q && query.q),
			choices.map( c => m('span'+b`
				min-width: 1.4em;
				text-align: center;
				background-color: ${s().icon==c?'#ffa':''};
				opacity: ${s().icon==c?'1':'.2'} !important;
				border: ${s().icon==c?'1px solid goldenrod':'none'};
				padding: .2ex;
				border-radius: 50%;
				cursor: pointer;
				user-select: none; 
				align-self: flex-start;
			`.$hover`
				opacity: 1;
			`, {
				onclick: ({target}) => {
					if (s().icon!=target.innerText) s({icon: target.innerText, score: 1});
					else s(noChoise);
				}
			}, c))
		])
	}
}

export default component;
