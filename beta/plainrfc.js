import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
//import box from "/component/box.js";
import {col} from "/core/utils.js";

const limit = 100;


const box = { view: (n) => m('div'+b`
		border: 1px solid ${n.attrs.meta ? '#7D3C98' : '#D4AC0D'};
		padding: 0.5ex;
		margin: .5ex 0 .5ex 0;
		//border-radius: .5ex;
		background-color: ${n.attrs.meta ? '#F4ECF7' : '#FEF9E7'};
	`//.$animate('0.4s ease-in', {
	//	from: b`transform: translateX(100%); opacity: 0`,//b.o(0).style,
	//	to: b`transform: translateX(0); opacity: 1`,//b.o(1).style
	//})
	.$nest('pre', b`
		flex-shrink: 1;
		box-shadow: none;
		background-color: #FDFEFE;
		border-radius: 0.5ex;
	`).$nest('button', b`
		margin-left: 1ex;
		border-radius: 0.25ex
	`), 
		(n.attrs.icon || n.attrs.tools || n.attrs.sub) && m('div'+b`
			display: flex;
			ai center;  
			${n.children.length>0? `border-bottom: 1px solid ${n.attrs.meta ? '#7D3C98' : '#D4AC0D'}
			margin-bottom: 0.5ex;
			padding-bottom: .5ex;`:''}
			
		`, [
			n.attrs.icon && m('div', n.attrs.icon),
			m('div'+b`flex-grow: 1;`, n.attrs.tools),
			n.attrs.sub
		]),
			n.children.length>0 && m('div', {
			style: n.attrs.style
		}, n.children)
	)}




const plainrfc = ({query, store, info, context}) => {
    
   
	
	// is reset enabled?
	const enabled = () => store() && query() && store().text != query().text;
	// is it reviewd?
	const reviewd = () => {return false};
	const saved = () => {return value().length==0}
	
	const tools = () => [
		m(`span`+b`p 0 0.5ex; m 0.2ex; bc goldenrod; c white; br 0.5ex; cursor: pointer`, {
			disabled: !enabled(),
			onclick: () => { store(undefined); info(undefined) }
		},'reset')
	];

	// Request for Help
	const reqHelp = () => [m(`button`, {
			disabled: !enabled(),
			onclick: () => {  }
		},"I need help!")
	];

    // Request for Comment
	const reqComment = () => [m(`button`, {
			disabled: !enabled(),
			onclick: () => {  }
		},"Ready for Review")
	];
	
    // Ready to Publish
	const readyPublish = () => [m(`button`, {
			disabled: !enabled(),
			onclick: () => {  }
		},"Publish")
	];


	const value = m.stream.merge([store, query]).map(([s,q])=> {
	    let text = s && s.text;
	    if (text==undefined) text = q.text || '';
	    text = typeof text == "string" ? text : ''
		return text.substr(0, q.limit || limit)
	});
	
	const icon = store.map(v => {
		let _; 
		if (!v) 
			_ = { icn: plainrfc.icon, col: col.unset };
		else if (v.text && v.text.length>0) 
			_ = { icn: '📝', sub: v.text.length, col: col.green};
		else 
			v = { icn: plainrfc.icon, sub: 'ε', col: col.red};
		v && info(_);
		return _;
	});


	const reviewStatus = () => {
	    let _;
	    if (reviewd()) { _ =  '🗨️'}
	    else           { _ =  [m(`span`+b` opacity: 0.3; cursor: pointer`,'👁   ')]}
	    return _;
	};
	
    const status = () => {
        let _;
        if (saved()){
          _ = [m(`span`+b` opacity: 0.3`,' Autosaving ...')] ;
        } else {
         _ = [m(`span`+b` opacity: 0.3`,' Last update: a few seconds ag')];
        }
        return _;
    }
	
	return { view: () => m(box, {
			style: b.display('flex').flexDirection('column').style,
		//	icon: icon() && icon().icn ||  plainrfc.icon,
			tools: [reqHelp(), reqComment(), readyPublish(), status() ],
			sub:  [reviewStatus()," ",(value().length+'/'+ (query()&&query().limit || limit))] 
		}, 
		m('textarea'+b`font-family: monospace; flex-grow: 1; resize: vertical; border: none; bgcolor: blue`, {
			value: value(),
			//onupdate: ({dom}) => fitToContent(dom),
			oncreate: ({dom}) => {
			    var offset = dom.offsetHeight - dom.clientHeight + 3;
			    dom.style['box-sizing'] = 'border-box';
			    dom.style.height = 'auto';
                dom.style.height = dom.scrollHeight + offset + 'px';
                dom.addEventListener('input', ({target}) => {
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + offset + 'px';
                });
			},
			oninput: ({target: t}) =>  {
				store({text: t.value.substr(0, query().limit || limit)});
				//fitToContent(t)
			}
		})
	)};
};
plainrfc.meta = {
	share: true,
	adjust: true,
}
plainrfc.presets = true;
plainrfc.persistent = true;
plainrfc.icon = "📄";
plainrfc.options = [
	{a: 'text', t: 'string', r: false, d: '', c: 'Text Preset' },
	{a: 'limit', t: 'number', r: false, d: limit, c: 'Number of chars allowed' },
	{a: 'reviewby', t: 'string', r: false, d: 'admin', c: 'Who shuld review? Students or Lecturer' }, 
];
	
export default plainrfc;