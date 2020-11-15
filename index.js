import m from '/vendor/mithril.js'
import b from '/vendor/bss.js'
import hs from './hashstore.js?verbose'
import w from './wrapper.js'

const {log} = console,
  { stringify} = JSON


let wrapper, runtime = {}, hash

//https://unpkg.com/ace-custom-element

hs.on = () => {
  if (!hs.get()) {
    log('a')
    hs.put({a: self.location.hash.slice(1)})
  } log('b')
  wrapper.store = hs.get()?.s
}

const index = {
  oninit: () => {
    if (!hs.get()) {
      hs.put({a: self.location.hash.slice(1)})
    }
  },
  view: () => m('div',
    'menu',
    m('gem-wrapper', {
      oncreate({dom}) {
        wrapper = dom
        wrapper.store = hs.get()?.s
      },
      ['oninner-change']: ({target}) => hs.put({s: target.store}),
      app: hs.get()?.a
    }),
    m('pre',
      stringify(hs.get(),null, '  ')
    )
  )
}

m.mount(document.body, index)

//setTimeout(()=>document.body.innerHTML = '1', 100)
