import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";

import box from "/component/box.js";

let data = 'data:image/png;base64,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';

export const img = () => {
	
	return { 
	oninit: ({state}) => {
		state.img = new Image();
		state.img.onload = m.redraw;
		state.img.src = data;
		window.addEventListener("paste", e => {
			delete state.blob;
			if (event.clipboardData == false) return;
			let items = event.clipboardData.items;
			if (items == undefined) return
			for (let i of items) {
				if (i.type.includes('image')) state.blob = i.getAsFile()
			} if (state.blob) {
				//state.img = new Image()
				//state.img.onload = m.redraw;
				let URLObj = window.URL || window.webkitURL;
				state.img.src = URLObj.createObjectURL(state.blob);
			}
		})
    },
	view: ({state}) => m(box, {
		
		tools: m.trust('&nbsp; Füge mit <b>ctrl-v</b> ein eigenes Bild ein.'),
		icon: '🎨',
	}, 
	m('table',
		m('tr', 
			m('td', 'Pos'), 
			state.x && m('td'+b`min-width: 8em; ta center`,  'x='+state.x + ' / y=' + state.y,),
			!state.x && m('td', 'Bewege die Maus über dem Bild.'),
			m('td', {rowspan: 6}, m('canvas'+b`border: 1px solid silver; `, {
		print: console.log(state.img.width, state.img.height),
		onupdate: ({dom}) => {
            let ctx = dom.getContext('2d')
			if (state.img) {
				dom.width = state.img.width;
				dom.height = state.img.height;
				ctx.drawImage(state.img, 0, 0);
			} else {
				ctx.fillRect(1,1,10,10)
			}
		}, onmousemove: function (e) {
			let pos = findPos(this);
			state.x = e.pageX - pos.x;
			state.y = e.pageY - pos.y;
			let c = this.getContext('2d');
			let p = c.getImageData(state.x, state.y, 1, 1).data; 
			state.r = p[0];
			state.g = p[1];
			state.b = p[2];
			state.hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
			
		}
	}))),
		m('tr', 
			m('td', 'R'), 
			state.hex && m('td'+b`color: white; background-color: #${state.hex.substr(1,2)}0000`, state.r ),
			
		),
		m('tr', 
			m('td', 'G'), 
			state.hex && m('td'+b`color: white; background-color: #00${state.hex.substr(3,2)}00`, state.g ),
			
		),
		m('tr', 
			m('td', 'B'), 
			state.hex && m('td'+b`color: white; background-color: #0000${state.hex.substr(5,2)}`, state.b ),
			
		),
		m('tr', 
			m('td', 'Hex'), 
			m('td', m('tt', state.hex), m('span'+b`margin-left: 1ex; padding: 0em 1ex;border: 1px solid silver; background-color: ${state.hex}`, ' '))
		),
		m('tr'+b`height: 100%`, 
			m('td', ''), 
			m('td', '')
		),
	))
	}
	
}

export default img;

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}
function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}