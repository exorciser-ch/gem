import m from '/vendor/mithril.js'
import b from '/vendor/bss.js'
import hs, {encode} from './hashstore.js'
import w from './wrapper.js'
import AceEditor from 'https://unpkg.com/ace-custom-element'

const {log, warn} = console,
  { stringify, parse} = JSON


let wrapper, runtime = {}

hs.on = () => {
  if (!hs.get()) {
    hs.put({a: self.location.hash.slice(1)})
  }
  wrapper.store = hs.get()?.s
  wrapper.query = hs.get()?.q
  runtime.query = stringify(hs.get()?.q, null, '  ')
}

const index = {
  oninit: () => {
    if (!hs.get()) {
      hs.put({a: self.location.hash.slice(1)})
    }
  },
  view: () => m('div',
    m('h5', 'App'),
    m('gem-wrapper', {
      oncreate({dom}) {
        wrapper = dom
        wrapper.store = hs.get()?.s
      },
      onchange: ({target}) => {
        if (target.tagName!='GEM-WRAPPER') return
        hs.put({s: target.store})
      },
      app: hs.get()?.a
    }),
    m('h5', 'Config'),
    m('ace-editor', {
      mode: 'ace/mode/json',
      value: runtime?.query ?? stringify(hs.get()?.q, null, '  '),
      onchange: ({target}) => {
        try {
          if (target.tagName!='ACE-EDITOR') return
          runtime.query = target.value
          wrapper.query = parse(target.value)
          hs.put({q: wrapper.query})
        } catch(ex) {
          //warn(ex.message)
        }
      },
    }),
    m('h5', 'share link [app&query&store]'),
    m('a',  {
      href: self.location.href
    }, self.location.href.slice(0, 60), '...'),
    m('h5', 'dokuwiki embed code [query only]'),
    m('pre', `{{gem/${hs.get()?.a}?0=${encode(hs.get()?.q)}}}`),
    m('h5', 'json'),
    m('pre',
      stringify(hs.get(),null, '  ')
    )
  )
}

m.mount(document.body, index)

//setTimeout(()=>document.body.innerHTML = '1', 100)
