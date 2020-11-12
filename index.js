import m from '/vendor/mithril.js'
import f from 'https://miruku.li/core/fragment.js'
import {queryParam} from 'https://miruku.li/core/utils.js'

const {stringify} = JSON,
  {log} = console,
  deepEqual = (a,b) => stringify(a)==stringify(b)


let app = '-1', store = m.stream(), query = m.stream(), info = m.stream()

store.map(s=> {
  if (!deepEqual(s, f.value?.s)) {
    log('store update', s)
    f.update({s})
    m.redraw()
  }
})
f.on = () => {
  log('navevent...', f.value.s)
  store(f.value?.s)
  m.redraw()
}
const cinit = async ({dom}) =>{
  log('cinit', f.value.a)
  if (app!=f.value?.a) {
    app=f.value.a;
    const fact = (await import(`./${app}.js`)).default
    m.mount(dom, fact({
      store, query, info }));
  }
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
        oncreate: cinit,
      //  onupdate: cinit,
    }, 'host' ),
    m('pre', stringify(f.value, null, '  '))
  )
}

m.mount(document.body, index)
