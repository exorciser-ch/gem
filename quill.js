import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import Quill from "/vendor/quill.js";

const {stringify} = JSON, 
	cmp = (a,b) => stringify(a) === stringify(b)
// own
import box from "/component/box.js";
import {col} from "/core/utils.js";

const app = ({query, store, info}) => {

	const value = () => {
	    if (typeof store() == 'object') return store();
	};


	let last = 0,  quill

	store.map(state => {
		if (state?.timestamp) {
			delete state.timestamp
		}
		if (!cmp(state, quill?.getContents())) {
		   quill?.setContents(state, 'silent')
	    } else {
		    state && info({
		       icn: app.icon,
		       sub: quill.getLength()-1,
		       col: col.unset
		    })
	    }
	})
	let limit =10000;
	let init = ({dom}) => {
	    quill = new Quill(dom, {
          modules: {
           //   syntax: true,
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ['bold', 'italic', 'underline'],
               [{ 'script': 'sub'}, { 'script': 'super' }],
               [{ 'list': 'ordered'}, { 'list': 'bullet' }],
               [{ 'indent': '-1'}, { 'indent': '+1' }],
               [{ 'color': [] }, { 'background': [] }],
              [ 'code-block'],
              ['clean']

            ]
          },
          placeholder: 'Notizen ...',
          theme: 'snow'  // or 'bubble'
        });
        quill.setContents(value())
        quill.on('text-change', function(delta, oldDelta, source) {
            if (quill.getLength() > limit+1) {
                quill.deleteText(limit, quill.getLength(), 'slient');
            }
          source!='silent' && store( {
              ...quill.getContents(),
             // timestamp: last = Date.now()
          })
          m.redraw()
        })

	}


	return {
		view: () => m(box,
    		m('div'+b`float right; fs 70%;`,
    		quill?.getLength()-1+'/10K'),
    		m('div'+b`bc white`, {
    			oncreate: init
    		}),

	    )
	};
};

app.presets = true;
app.persistent = true;
app.icon = "🖋️";
app.options = [
	{a: 'text', t: 'string', r: false, d: "", c: 'Text Preset' },
];

export default app;
