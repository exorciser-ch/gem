import m from '/vendor/mithril.js'
import b from '/vendor/bss.js'
import hs, {encode} from './hashstore.js'
import w from './wrapper.js'
import AceEditor from 'https://unpkg.com/ace-custom-element'

const {log, warn} = console,
  { stringify, parse} = JSON


let wrapper, runtime = {}

document.title = 'apps@'+self.location.host

hs.on = () => {
  if (!hs.get()) {
    hs.put({a: self.location.hash.slice(1)})
  }
  wrapper.store = hs.get()?.s
  try {
    wrapper.query = parse(hs.get()?.q)
  } catch (ex) {
    warn(ex.message)
  }
}

let info

const index = {
  oninit: () => {
    if (!hs.get()) {
      hs.put({a: self.location.hash.slice(1)})
    }
  },
  view: () => m('div', {
    run: document.title = hs.get()?.a+ '@'+ self.location.host
  },
    m('div'+b`d flex; margin: 1em 0 1ex 0`,
    m('span'+b`fw bold; fg 1`, 'App'),
    (info = wrapper?.info) && [
      m('span'+b`border-radius: 0.25ex;border: 1px solid ${info.col}; `, info.icn,
        m('sub', info.sub)
      )
    ]
  ),
    m('gem-wrapper', {
      oncreate({dom}) {
        wrapper = dom
        wrapper.store = hs.get()?.s
        try {
          wrapper.query = parse(hs.get()?.q)
        } catch (ex) {
          warn(ex.message)
        }
      },
      onchange: ({target}) => {
        if (target.tagName!='GEM-WRAPPER') return
        hs.put({s: target.store})
      },
      app: hs.get()?.a
    }),
    m('div'+b`d flex; margin: 1em 0 1ex 0`,
      m('span'+b`fw bold; fg 1`, 'Config'),
      m('button', {
        onclick: () => {try {
          let q = hs.get().q
          q = stringify(parse(q), null, '  ')
          hs.put({q})
          runtime.config.value = q
        } catch (ex) {
          warn(ex.message)
        } }
      },'format'),
      m('span'+b`w 1em`, ' '),
      m('button', {
        onclick: () => hs.put({q: ''})
      },'reset')
    ),
    m('ace-editor', {
      oncreate: ({dom}) => runtime.config = dom,
      mode: 'ace/mode/json',
      value: hs.get()?.q, // runtime?.query ?? stringify(hs.get()?.q, null, '  '),
      onchange: ({target}) => {
        try {
          runtime.jsonerror = undefined
          if (target.tagName!='ACE-EDITOR') return
          hs.put({q: target.value})
          wrapper.query = parse(target.value)
        } catch(ex) {
          runtime.jsonerror = ex.message
        }
      },
    }),
    runtime.jsonerror ? m('pre'+b`c red; bc #fdd`, runtime.jsonerror) : [
      m('h5', 'dokuwiki embed code [query only]'),
      m('pre', `{{gem/${hs.get()?.a}?0=${encode(wrapper?.query)}}}`),
      m('h5', 'json'),
      m('pre'+b`overflow: auto`,
        stringify(hs.get(),null, '  ')
      )
    ]
  )
}

m.mount(document.body, index)

//setTimeout(()=>document.body.innerHTML = '1', 100)
