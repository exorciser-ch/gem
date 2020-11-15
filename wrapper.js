import m from '/vendor/mithril.js'
import b from '/vendor/bss.js'

const
  {log} = console,
  {stringify} = JSON,
  deepEqual = (a,b) => stringify(a)==stringify(b),

  dispatch = (target, type, message) => message == undefined
    ? target.dispatchEvent( new Event(type))
    : target.dispatchEvent( new CustomEvent(type, { detail : { message }})),

  msg = (target, msg, c, bc) => m.render(target,
    m('div'+b`ta center; p 0.4ex; ai center;  ff monospace;
    border: 1px solid ${c}; bc ${bc}; c ${c}; border-radius: 0.5ex`,
    msg)),

  streams = new WeakMap(),
  values = new WeakMap(),

  mount = async (elem) => {
    if (!elem.app) return msg(elem, `<gem-wrapper> app-attribute required`, '#f0f', '#fef')
    try {
      msg(elem, `Loading '${elem.app}'-app ...`, '#00f', '#eef')
      const fac = (await import(`./${elem.app}.js`)).default
      m.mount(elem, fac(streams.get(elem)))
    } catch (ex) {
      msg(elem, `Sorry '${elem.app}' isn't available. ${ex.message}`, 'red', '#fee')
    }
  }

export default class GemWrapper extends HTMLElement {

  constructor () {
    super()
    const store = m.stream({})
    const query = m.stream({})
    const info = m.stream({})

    streams.set(this, { store, query, info })
    values.set(this, { store: store(), query: query(), info: info()})

    // listen to changes. FIXME query and info?
    store.map(s => {
      const v = values.get(this)
      if (!deepEqual(v.store,s)) {
        v.store = s
        dispatch(this, 'change')
        /*
        The INPUT event fires when some value has been changed BY THE USER.

        FIXME The CHANGE event should be fired  when an alteration is COMMITED
        by the USER. Unlike the input event, the change event is not necessarily
        fired for each alteration. The use of ENTER oder loosing FOCUS are
        commitments.

        No event will be fired when properties is changed by the HOST*/
      }
    })

   }

   connectedCallback () {
     mount(this)
   }
   disconnectedCallback() { m.mount(this, null) }

   // attributes

  static get observedAttributes() { return ['app'] }

  attributeChangedCallback(name, from, to) {
    if (name != 'app' || from == to) return
    mount(this)
  }
  set app (value) { this.setAttribute('app', value) }
  get app() { return this.getAttribute('app') }

  // non refelcted properties

  set query (value) {
    console.log('set new query', value)
    streams.get(this).query(value)
    m.redraw()
  }
  get query () {
    return streams.get(this).query()
  }
  set store (value) {
    values.get(this).store = value
    streams.get(this).store(value)
    m.redraw()
  }
  get store () {
    return streams.get(this).store()
  }

}

customElements.define('gem-wrapper', GemWrapper)
