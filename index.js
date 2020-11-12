import f from 'https://miruku.li/core/fragment.js'
import m from '/vendor/mithril.js'

import app from './plain.js'

//import {queryParam} from 'https://miruku.li/core/utils.js'

const {stringify} = JSON,
  {log} = console,
  deepEqual = (a,b) => stringify(a)==stringify(b)

let store = m.stream(), query = m.stream(), info = m.stream()

store.map(s => {
  log('store.map')
  f.put({s})
  m.redraw()
})

f.on = () => {
  log('f.on')
  store(f.get()?.s)
  m.redraw()
}


const index = {
  oninit: () => {
    const a = self.location.hash.slice(1)
    if (a.match(/^[a-z]/)) {
        log('init f with',  {a})
        f.update(()=>({ a }))
    }
  },
  view: () => m('div',
    m('div', {
        oncreate: ({dom}) => {
          m.mount(dom, app({store,query, info}))
        }
    }, 'host' ),
    m('pre', stringify(f.get(), null, '  '))
  )
}

m.mount(document.body, index)
