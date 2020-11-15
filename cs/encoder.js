import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import box from "/component/box.js";



const cp = (input, base) => { 
  const enc = input.map(v => [...v].map(c=> c.codePointAt(0).toString(base)).join(' '))
  const valid = enc.map(v => { 
      if (v.length==0) return true;
      const invalidChars = {
        2: /[^ 01]/,
        10: /[^ 0-9]/,
        16: /[^ 0-9a-f]/i
      }; let _;
      if (_ = v.match(invalidChars[base])) return "Invalid char at position "+_.index;
      v = v.split(' ').map(g => parseInt(g, base));
      if (v.some(Number.isNaN)) return "Not all parts are valid numbers in base "+base
      // code back
      try {
        v = v.map(v=>String.fromCodePoint(v)).join('');
      } catch (e) { return e.message }
      v!=input() && input(v)
      return true;
  })
  const action = ({target}) => enc(target.value);
  return { view: () => 
    m('div', [
      m('textarea'+b`background-color: #${valid()===true?'dfd':'fdd'}`, {oninput: action, value: enc()}),
      m('div', valid()!==true && valid())
    ])}
};

const utf8 = (input, base=2) => { 
  const enc = input.map(v => [...v].map(c=>{
    let _ = encodeURI(c).split('%');
    if (_.length==1) return c.codePointAt(0).toString(base).padStart(base==2?8:2,'0');
    _.shift()
    return _.map(v=>(parseInt(v,16).toString(base).padStart(base==2?8:2,'0'))).join(' ')
  }).join(' '))
  const valid = enc.map(v => { 
      if (v.length==0) return true;
      const invalidChars = { 2: /[^ 01]/, 16: /[^ 0-9a-f]/i }; let _;
      if (_ = v.match(invalidChars[base])) return "Invalid char at position "+_.index;
      v = v.split(' ')
      if (v.some(x=>x.length!=(base==2?8:2))) return "Blocklength should be "+ (base==2?8:2);
      v = v.map(g => parseInt(g, base));
      if (v.some(Number.isNaN)) return "Not all parts are valid numbers in base "+base
      try {
        v = decodeURIComponent('%'+v.map(c=>c.toString(16).padStart(2,'0')).join('%'))
      } catch (e) { return "Malformed UTF-8 encoding"}
      v!=input() && input(v)
      return true;
  })
  const action = ({target}) => enc(target.value);
  return { view: () => 
    m('div', [
      m('textarea'+b`background-color: #${valid()===true?'dfd':'fdd'}`, {oninput: action, value: enc()}),
      m('div', valid()!==true && valid())
    ])}
};

const json = (input) => { 
  const enc = input.map(v => JSON.stringify(v))
  const valid = enc.map(v => { let _;
   try { _ = JSON.parse(v) } catch (e) { return e.message}
    input()!=_ && input(_)
    return true; 
  })
  const action = ({target}) => enc(target.value);
  return { view: () => 
    m('div', [
      m('textarea'+b`background-color: #${valid()===true?'dfd':'fdd'}`, { oninput: action, value: enc()}),
      m('div', valid()!==true && valid())
    ])}
};

const encURI = (input) => { 
  const enc = input.map(v => encodeURI(v))
  const valid = enc.map(v => { let _;
    if (_ = v.match(/[^A-Za-z0-9;,/?:@&=+$_.!~*'()#%-]/)) return 'Invalid Char at posistion '+_.index
    try { _ = decodeURI(v) } catch (e) { return e.message}
    input()!=_ && input(_)
    return true; 
  })
  const action = ({target}) => enc(target.value);
  return { view: () => 
    m('div', [
      m('textarea'+b`background-color: #${valid()===true?'dfd':'fdd'}`, { oninput: action, value: enc()}),
      m('div', valid()!==true && valid())
    ])}
};

const encURIComponent = (input) => { 
  const enc = input.map(v => encodeURIComponent(v))
  const valid = enc.map(v => { let _;
    if (_ = v.match(/[^A-Za-z0-9_.%!~*'()-]/)) return 'Invalid Char at posistion '+_.index
    try { _ = decodeURIComponent(v) } catch (e) { return e.message}
    input()!=_ && input(_)
    return true; 
  })
  const action = ({target}) => enc(target.value);
  return { view: () => 
    m('div', [
      m('textarea'+b`overflow-x: auto; background-color: #${valid()===true?'dfd':'fdd'}`, { oninput: action, value: enc()}),
      m('div', valid()!==true && valid())
    ])}
};

const app = ({query, store, info}) => {



  // input
  const input = m.stream(query().text || '');
  
  //store.map(v => v!=input() ? input(v) : m.stream.SKIP)
  //input.map(v => v!=store() ? store(v) : m.stream.SKIP )
  
  
  const action = ({target}) => input(target.value);
  
  
  //input.map(v=> [...document.querySelectorAll('textarea')].forEach(e => {
	//e.style.height = 'auto';
	//e.style.height = (e.scrollHeight) + 'px';
	//e.style.maxHeight = '80vh';
	//})) 

  query = query.map(q => {
	  let legal = 'cp,cp0b,cp0x,utf0b,utf0x,uri,uric,json'.split(',');
	  let show = (q.show && q.show.split(',')) || legal;
	  show = show.filter(x => legal.includes(x));
	  let hide = (q.hide && q.hide.split(',')) || [];
	  show = show.filter(x => !hide.includes(x));
	  return {show, preset: q.preset || ''}
  })
  
  const encoders = [
    { q: 'cp', n: 'codepoints', c: cp(input,10) },
    { q: 'cp0b', n: 'codepoints [0b]', c: cp(input,2) },
    { q: 'cp0x', n: 'codepoints [0x]', c: cp(input,16) },
    { q: 'utf0b', n: 'UTF-8 [0b]', c: utf8(input) },
    { q: 'utf0x', n: 'UTF-8 [0x]', c: utf8(input,16) },
    { q: 'uri', n: 'encodeURI', c: encURI(input) },
    { q: 'uric', n: 'encodeURIComponent', c: encURIComponent(input) },
    { q: 'json', n: 'json', c: json(input) },
  ]
  
  const tools = () => [
		m(`button`, {
			//disabled: !enabled(),
			onclick: () => { store(undefined); info(undefined) }
		},'reset')
	];
	
  return { view: () => m(box, {
	  //run: console.log('encoder, repaint'),
	  icon: '🍭 Text Encoder', //tools: tools()
	},m('dl'+b``
		.$nest('dt', b`padding-top: 1ex;`)
		.$nest('textarea', b`width:98%;font-family: monospace`),[
    m('dt', 'input'),
    m('dd', m('textarea', {
      value: input(),
      oninput: action
    })),      
	encoders 
		.filter(e=>query().show.includes(e.q))
		.map(e => [ m('dt', e.n), m('dd', m(e.c))])
  ]))}
}
app.presets = true;

app.options = [
	{a: 'show', t: 'text', r: false, d: 'cp,cp0b,cp0x,utf0b,utf0x,uri,uric,json', c: 'Encoders to show' },
	{a: 'hide', t: 'text', r: false, d: '', c: 'Encoders to hide' },
];
	
export default app;