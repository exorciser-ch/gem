import {m, b, box, col} from "/bundle.js";
import md from "/vendor/snarkdown.js";


const preprocess = (string) => {
   if (string.match(/^#md!/)) {
      return m.trust(md(string.replace(/^#md!/, '')))
    } return string;
}

const mcq = ({store, query, info}) => {
	

	const icon = '🎓';
	
  // sanitize query 
  query = query.map(q => {
	  let sanitized = {
		  title: preprocess(q.title || ''),
		  debug: q.debug,
		  live: q.live,
		  stem: preprocess(q.stem || ''),
		  answers: (Array.isArray(q.answers) ? q.answers : []).map((a,i) => { 
			if (typeof a == "string" ) return {
				content: preprocess(a),
				reward: '❌',
				color : a.color || col.red,
				index: i}
			if (typeof a == "object" ) return {
				content: preprocess(a.content||''),
				reward : typeof a.reward == 'string' ? a.reward : '❌',
				color: a.color || (a.reward && '#0ff') || col.red,
				index: i
			}
		})
	  };
	return sanitized;
  })

  // state
  const choise = store.map(v => (v||{}).choise );
  const grade = m.stream.merge([store, query]).map(([s,q])=> (s||{}).grade || q.live);
  
  
  m.stream.merge([store, query]).map(([s,q])=> {
    const v = { icn : icon};
	
	if (choise()!=undefined) {
		v.sub = '✍';
	}
    if (grade() && choise()!=undefined) {
		v.sub = q.answers[choise()].reward,
		v.col = q.answers[choise()].color
	}
	info(v)
  });
                        
  return {
    view: () => m(box, {
      icon: [ icon, m('strong', query().title)],
      sub: grade() && info() && info().sub,
      tools: [
        m('button', {
          disabled: choise()==undefined,
          onclick: ()=> store(undefined)}, 'reset'),
        !query().live && m('button', {
          disabled:  choise()==undefined || grade(),
          onclick: ()=> (store( {choise: choise(), grade: true}))}, 'check')
      ]
    }, [
      m(''+b`padding: .5em .25em`, query().stem),
      m('table'+b`border: none; border-collapse: collapse`
        .$nest('td', b`padding: .75ex; border: none; border-top: 1px solid #ddd;vertical-align: top`),
		query().answers.map((a, i) =>
        m('tr'+b``.$hover(b`background-color: whitesmoke`), {
          answer: i,
          onclick: ({target}) => {store({choise: i})}
        }, 
          m('td', m('input[type=radio]',  {checked: choise() == a.index})),
          m('td', a.content),
          grade() && m('td'+b`
            border-left: 1px solid #ddd
          `, choise() == a.index ? (a.reward):('')),
          query().debug && m('td', '💁', m('sup', a.reward))
        )
      )),
       //query().debug && m('pre', JSON.stringify(info(), null, '  ')),
    ])
  }
}
mcq.meta = {
	share: true,
	adjust: true,
}
export default mcq;