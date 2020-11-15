import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import {col} from "/core/utils.js";

const limit = 1000;

const box = { view: (n) => m('div'+b`
		border: 1px solid #D4AC0D;
		padding: 0.5ex;
		margin: .5ex 0 .5ex 0;
		background-color: #FEF9E7;
	`
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
			${n.children.length>0? `border-bottom: 1px solid #D4AC0D
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
	)};

const app = ({query, store, info, context: {gems, grps, usrs, sub, storage}}) => {
    


  	const userEntry = usrs && usrs.filter(u => u.i == m.stream(sub)())[0];
  	const isAdmin = () => (userEntry && userEntry.g.filter(g=>g ==='admin')!=='');
    console.log("isAdmin:"+isAdmin());
    
    // default values
    /*
	query = query.map(q => Object.assign({
		text: q.text || '',
		limit: q.limit || 1000,
		reqHelpOn: q.reqHelpOn || false,
	}, q))
    */
    
    let statusText = "ready for input";
    const status = () =>  [m(`span`+b` opacity: 0.3`, ' '+statusText)] ;

	const enabled = () => store() && query() && store().text != query().text;
	const saved = () => {return value().length==0};


    
	// Request Help Functionality
	const reqHelpOn = () => {return true};
	const reqHelpNext = () => {
	    if (store() && store().notification==="help"){  return "" } else { return "help" }

	};
	
	const reqHelpElems = () => {
	    let _;
	    let circle  = "⚪";// for copy-paste "🔵🟢⚫";
	    if (store() && store().notification==="help"){  circle = '🔴';} 
	    _ = [m(`button`, {
			disabled: !enabled(),
			onclick: () => { store({...store(), notification: reqHelpNext() }); statusText ="dadü-dada"; }
		    }, circle + " I need help!")
	    ];
	    return _;
	};

    // Request for Review
    const reviewd = () => {return false};
	const reqRevOn = () => {return true};
	const reqRevElems = () => {
	    let _;
	    let circle  = "⚪";   // for copy-paste "🔵🟢⚫";
	    if (store() && store().notification==="review"){  circle = '🔴';} 

	    if (reqRevOn){
	         _ = [m(`button`, {
    		    	disabled: !enabled(),
    			    onclick: () => { store({...store(), notification:"review" })  }
    		      }, circle + " Ready for Review")
    	        ];
	    }
	    return _;
	};


    // Publish Functionality
	const published = () => store() && store().published != undefined;
    const reqPubOn = () =>  true;
	const reqPubElems = () => {
	    let _;
	    if (reqPubOn()){
            _ = [   m(`button`, {
	    	            disabled: !enabled(),
			            onclick: () => { store({...store(),published: store().text}); statusText="published"}
		            },"Publish"),
    				m("span", " " ),
    				m("button" + b `ml 0px; b 0px`, {
    				    disabled: !published(),
    					onclick: () => {
              							
    					}
    				}, "<"),
    				m("span", " Marc" ),
    				m("button", {
    				    disabled: !published(),
    					onclick: () => {
            							
    					}
    				}, ">")
    			];
	    }
		return _;
	};
	

	const value = m.stream.merge([store, query]).map(([s,q])=> {
	    let text = s && s.text;
	    if (text==undefined) text = q.text || '';
	    text = typeof text == "string" ? text : '';
		return text.substr(0, q.limit || limit);
	});
	
	const response = m.stream.merge([store, query]).map(([s,q])=> {
	    let response = s && s.response;
	    if (response==undefined) response = q.response || '';
	    response = typeof response == "string" ? response : '';
		return response.substr(0, q.limit || limit);
	});
	
	
	const icon = store.map(v => {
		let _; 
		if (!v) 
			_ = { icn: app.icon, col: col.unset };
		else if (v.text && v.text.length>0) 
			_ = { icn: '📝', sub: v.text.length, col: col.green};
		else 
			v = { icn: app.icon, sub: 'ε', col: col.red};
		v && info(_);
		return _;
	});


	const reviewStatus = () => {
	    let _;
	    if (reviewd()) { _ =  '🗨️'}
	    else           { _ =  [m(`span`+b` opacity: 0.3; cursor: pointer`,'👁   ')]}
	    return _;
	};
	

	
	return { view: () => m(box, {
			style: b.display('flex').flexDirection('column').style,
		//	icon: icon() && icon().icn ||  app.icon,
			tools: [reqHelpElems(), reqRevElems(), reqPubElems(), status() ],
			sub:  [reviewStatus()," ",(value().length+'/'+ (query()&&query().limit || limit))] 
		}, 
		m('textarea'+b`font-family: monospace; flex-grow: 1; resize: vertical; border: none; bgcolor: blue`, {
			value: value(),
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
				store({...store(),text: t.value.substr(0, query().limit || limit)});
				//fitToContent(t)
				statusText ="Autosaved";
			}
		}),
		m('div','Comment'),
		m('textarea'+b`font-family: monospace; flex-grow: 1; resize: vertical; border: none; bgcolor: blue`, {
			response: response(),
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
				store({...store(),response: t.value});
			}
		})		
	)};
};

app.meta = {
	share: true,
	adjust: true,
};
app.presets = true;
app.persistent = true;
app.icon = "📄";
app.options = [
	{a: 'text', t: 'string', r: false, d: '', c: 'Text Preset' },
	{a: 'limit', t: 'number', r: false, d: limit, c: 'Number of chars allowed' },
	{a: 'reqHelpOn', t: 'boolean', r: false, d: true, c: 'de/activate help functionality ' }, 
	{a: 'reqReviewOn', t: 'boolean', r: false, d: true, c: 'de/activate review functionality' }, 
	{a: 'reqPublicationOn', t: 'boolean', r: false, d: true, c: 'de/activate publish functionality' }, 
];


	
export default app;