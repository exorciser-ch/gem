import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import box from "/component/box.js";
import {col} from "/core/utils.js";

const app = ({query, store, info}) => {
	
	store.map(s => info({
	    icn: app.icon,
	    sub: s != undefined && s.text && s.text.length
	}));
	
	const value = () => {
	    if (store() && store().text!=undefined) return store().text;
	    if (query() && query().text!=undefined) return query().text;
	    return '';
	};
	
	return {
		view: () => m(box, {
		    icon: app.icon ,
		    sub: info() !=  undefined && info().sub || ''
		},
    		m('input'+b`border: none`, {
    			maxlength: 500,
    			value: value(),
    			oninput: (e) => store({text: e.target.value})
    		})
	    )
	};
};

app.presets = true;
app.persistent = true;
app.icon = "🧱";
app.options = [
	{a: 'text', t: 'string', r: false, d: "", c: 'Text Preset' },
];
	
export default app;