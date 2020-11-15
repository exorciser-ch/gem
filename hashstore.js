import LZString from '/vendor/lzstring.js'
import merge from '/vendor/mergerino.js'

const encode = a=> LZString.compressToEncodedURIComponent(JSON.stringify(a)),
  decode = a => { try { return JSON.parse(LZString.decompressFromEncodedURIComponent(a)) } catch(ex) {	} };

const queryParam = (url, param, defaultValue) => {
  url = new URL(url)
  let searchParams = new URLSearchParams(url.search)
  if (searchParams.has(param)) {
    return searchParams.get(param) !== '' ? searchParams.get(param) : true
  }
  return defaultValue
}

const verbose = !!queryParam(import.meta.url, 'verbose', false)
const log = (x) => verbose && console.log(`%cHS ${x}`, "color:blue");
const str = JSON.stringify

const observers = [], defaultDebounce = 666

let data, hash, timeout

self.onhashchange = load

load()

// -- api -------------------------------------------------------------------

export default {

  get () { // add xpath query ?
    log(`get > ${str(data)}`)
    return data
  },

  post (payload, debounce) {
    log(`post(${str(payload)})`)
    data = payload
    save(debounce)
  },

  clear(debounce) {
    log(`clear()`)
    data = undefined
    save(debounce)
  },

  put(payload, debounce) {
    log(`put(${str(payload)})`)
    const type = typeof payload
    data = ( (type=='object' && payload!=null ) || type!='function' )
      ? merge(data, payload)
      : payload
    log('data>', data)
    save(debounce)
  },

  set on (callback) {
    if (typeof callback != 'function') return
    observers.push(callback)
  }

}

// -- helpers ------------------------------------------------------------------

function save (debounce = defaultDebounce) {
  clearTimeout(timeout)
  hash = '#0='+encode(data);
  if (self.location.hash == hash) { return }
  timeout = setTimeout( () => { self.location.hash = hash }, debounce)
}

function load () {
  clearTimeout(timeout)
  if (self.location.hash != hash) {
      hash = self.location.hash
      data = decode(hash.slice(3)) // #0=[lz-encoded data]
      observers.forEach(o => o())
  }
}
