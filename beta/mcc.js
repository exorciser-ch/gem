import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";

const app = ({ attrs: { conf, store } }) => {
	/* Wir haben hier eine dynamisch konfigurierbare app. Userdaten werden im store abgelegt. Der store kann persistent sein. store und config sind beide streams und damit grundsätzlich auch observierbar
		kleiner mangel: patchen von store values ist nicht möglich, es muss immer der ganze wert geschrieben werden.
		 
		nächste Schritte?
		*/
	const debug = m.stream();
	// actions
	const actions = {
		select: (item) => ({target}) => store({selection: item}),
		reset: () => conf().selectionPreset == undefined ? store(undefined) : store({
			selection: conf().selectionPreset
		}),
		preset: () => {
			if (conf().selectionPreset == undefined) return;
			if (store() == undefined) store({
				selection: conf().selectionPreset
			})
		},
		valid: () => {
			if (!conf().stem) return !debug('stem missing');
			if (!conf().answers) return !debug('answers missing');
			if (!Array.isArray(conf().answers)) return !debug('answers is not an array');
			return true;
		}
	};

	return {
		view: () => m('div' + b `color: black; border: 1px solid black; padding 1ex`, {
			run: actions.preset()
		}, actions.valid() ? [
			conf().showReset && m('button' + b `float: right`, {onclick: actions.reset}, 'reset'),
			conf().title && m('div' + b `border-bottom: 1px solid silver; font-weight: bold`, conf().title),
			m('div' + b ``, conf().stem),
			m('ul', conf().answers.map((a, i) => m('li' + b ``.$hover `background-color: #ddf`, {
				onclick: actions.select(i)
			}, a, ' ', store() != undefined && (store().selection == i ? '✅' : '❌')))),
            m('button' + b`align: `, {onclick: actions.reset}, 'prüfen'),
		] : m('pre' + b `border: darkred; padding: .5ex; border-radius: .5ex;background-color: #fdd`, '🐛 ', debug()))
	}
};
app.template = '{"title":"The Matrix","stem":"Das ist deine letzte Chance. Danach gibt es kein zurück. Nimm die blaue Pille ... Rot oder Blau?","answers":["blau","rot"],"showReset":true,"selectionPreset":1}';

export default app;