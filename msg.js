import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
//import {colors} from "/core/utils.js";

export default () => ( {view: () => 
	m('div'+b`
		position: fixed;
		zIndex: 99;
		bottom: 2em;
		align-items: flex-start;
		right: 2em;
		left: 2em
		padding: 0.5ex;
		border-radius: .5ex;
	`, { style: {display:  window['x-gem-msg'].msgs.length ? 'flex' : 'none' }}, [
		m('div'+b`flex-grow: 1; max-height: 20vh;
		overflow-y: auto;`, 
			window['x-gem-msg'].msgs.map(_=>m('div'+b`border-bottom: 1px solid silver; font-family: monospace`, _))),
		m('button'+b``, { onclick: () => window['x-gem-msg'].clear() }, '✖')
])})
