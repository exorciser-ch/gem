import m from '/vendor/mithril.js'
import f from './hashstore.js'

const {log} = console,
  {stringify} = JSON,
  deepEqual = (a,b) => stringify(a)==stringify(b),
  runtime = {}

// --------------------------------------------

let store = m.stream({}), query = m.stream({}), info = m.stream({})

store.map(s => {
  if (runtime.app) {
    log('stream updated')
    f.put({s})
    m.redraw()
  }
})

const index = {
  view: () => m('div',
    m('div', {
        oncreate: ({dom}) => runtime.dom = dom
    }, 'host' ),
    m('pre', stringify(f.get(), null, '  '))
  )
}

m.mount(document.body, index)

// ---------------------------------
const init = async () => {
  log('init', runtime, f.get())
  if (!runtime.app || !f.get() || runtime.app != f.get().a ) {
    log('init app updated or undefined')
    runtime.app = f.get()?.a
    if (!runtime.app) {
      runtime.app = self.location.hash.substr(1)
      f.post({a: runtime.app})
    }
    const factory = (await import(`/app/${runtime.app}.js`)).default;
    m.mount(runtime.dom, factory({store, query, info}))
    m.redraw()
  } else {
    store(f.get()?.s)
  }
}

self.onload = init
self.onhashchange = init
