import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import box from "/component/box.js";
import {col} from "/core/utils.js";
const app = ({
    query,
    store,
    info,
    target,
    context
}) => {

    let elements = [], inputs = {},
        status, min = Math.min,
        max = Math.max,
        u = 30;

	function entry(label, layer, din, dout) { return {
		t: label,
		l: layer,
		in: din.trim().split(/\s+/).map(x => +x),
		out: dout.trim().split(/\s+/).map(x => +x)
		}
	}

    function sevensegment(n, x, y, s, on = 'red', off = 'silver', stroke = 'none') {
        let u = s / 10,
            col = (s) => s.includes(n) ? on : off;
        return m('g',
            m('path', {
                d: `M${x+u} ${y+u}l${u} ${-u}l${5*u} 0l${u} ${u}l${-u} ${u}l${-5*u} 0Z`,
                fill: col([0, 2, 3, 5, 6, 7, 8, 9, 10, 12, 14, 15]),
                stroke
            }),
            m('path', {
                d: `M${x+u} ${y+8*u}l${u} ${-u}l${5*u} 0l${u} ${u}l${-u} ${u}l${-5*u} 0Z`,
                fill: col([2, 3, 4, 5, 6, 8, 9, 10, 11, 13, 14, 15]),
                stroke
            }),
            m('path', {
                d: `M${x+u} ${y+15*u}l${u} ${-u}l${5*u} 0l${u} ${u}l${-u} ${u}l${-5*u} 0Z`,
                fill: col([0, 2, 3, 5, 6, 8, 9, 11, 12, 13, 14]),
                stroke
            }),
            m('path', {
                d: `M${x+u} ${y+u}l${u} ${u}l0 ${5*u}l${-u} ${u}l${-u} ${-u}l0 ${-5*u}Z`,
                fill: col([0, 4, 5, 6, 8, 9, 10, 11, 12, 14, 15]),
                stroke
            }),
            m('path', {
                d: `M${x+8*u} ${y+u}l${u} ${u}l0 ${5*u}l${-u} ${u}l${-u} ${-u}l0 ${-5*u}Z`,
                fill: col([0, 1, 2, 3, 4, 7, 8, 9, 10, 13]),
                stroke
            }),
            m('path', {
                d: `M${x+u} ${y+8*u}l${u} ${u}l0 ${5*u}l${-u} ${u}l${-u} ${-u}l0 ${-5*u}Z`,
                fill: col([0, 2, 6, 8, 10, 11, 12, 13, 14, 15]),
                stroke
            }),
            m('path', {
                d: `M${x+8*u} ${y+8*u}l${u} ${u}l0 ${5*u}l${-u} ${u}l${-u} ${-u}l0 ${-5*u}Z`,
                fill: col([0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13]),
                stroke
            }),
        )
    }

    function updateStatus() {
        status = []
        let maxL = elements.reduce((a, c) => max(a, c.l), 0), z;
        elements.sort((a, b) => a.l - b.l)
        elements.forEach(e => {
            status[e.l] = status[e.l] || []
            if (e.t == 'digit') {
                let a = e.in.reduce((a, c) => +status[e.l - 1][c] + a, '')
                e.val = parseInt(a, 2)
            }
            e.out.forEach((f,i) => {
                if (e.t == 'switch') {
                    status[e.l][f] = e.on
					if ((z=store()) && z[e.label] != undefined) {
						e.on = status[e.l][f] = z[e.label]
					}
                } else if (e.t == 'id' || e.t == 'or' || e.t == 'bulb') {
                    status[e.l][f] = e.in.some(x => status[e.l - 1][x])
                } else if (e.t == 'not') {
                    status[e.l][f] = !e.in.every(x => status[e.l - 1][x])
                } else if (e.t == 'and') {
                    status[e.l][f] = e.in.every(x => status[e.l - 1][x])
                } else if (e.t == 'xor') {
                    status[e.l][f] = e.in.reduce((a, c) => a + +status[e.l - 1][c], 0) == 1
                } else if (e.t == 'adc') {
					let l = e.out.length, a;
						a = e.val;
						a = a/100*(2**l-1);
						a = Math.floor(a)
						a = ('000000000000'+a.toString(2)).substr(-l)
						a = [...a].reverse().join('');
						status[e.l][f] = +a[i]
				} else if (e.t == 'ha') {
					let a = e.in.reduce((a, c) => +status[e.l - 1][c] + a, 0)
					a = [...'0'+a.toString(2)].reverse().join('');
					status[e.l][f] = +a[i]
                } else if (e.t == 'fa') {
					let a = e.in.reduce((a, c) => +status[e.l - 1][c] + a, 0)
					a = [...'0'+a.toString(2)].reverse().join('');
					status[e.l][f] = +a[i]
                }
            })
        })
    }


    let parse = (d) => { try {
		let temp = []
        d.split(/>|\n/).forEach((desc, i) => {
            desc.split(/(?=[SNBIAOXDHFC].*)/).forEach(cmd => {
                if (cmd[0] == 'S') {
                    let [_, r, o = '', t = ''] = cmd.match(/S\s*(\d*)(\s+1)?(\s*.*)?/)
					if (store() && t) {
						o = store()[t]
					}
                    temp.push({
                        t: 'switch',
                        label: t.trim(),
                        l: i + 1,
                        in: [],
                        out: [+r],
                        on: +(""+o).trim() == 1,
                    })
                } else if (cmd[0] == 'N') {
                    let [_, r] = cmd.match(/N\s*(\d*)/)
                    temp.push({
                        t: 'not',
                        l: i + 1,
                        in: [+r],
                        out: [+r],
                    })
                } else if (cmd[0] == 'B') {
                    let [_, r, t = ''] = cmd.match(/B\s*(\d*)(\s*\w*)?/)
                    temp.push({
                        t: 'bulb',
                        label: t,
                        l: i + 1,
                        in: [+r],
                        out: [],
                    })
                } else if (cmd[0] == 'I') {
					if (cmd.match(/:/)) {
						let [_, a, b] = cmd.match(/I(.*):(.*)/);
						a = a.trim();
						b = b.trim();
						temp.push({
							t: 'id',
							l: i + 1,
							in: a.split(/\s+/).map(x => +x),
							out: b.split(/\s+/).map(x => +x)
						})
					} else {
						let [_, a, t] = cmd.match(/I\s*(\d*)\s*(.*)/);
						a = a.trim();
						temp.push({
							t: 'id',
							label: t,
							l: i + 1,
							in: [+a],
							out: [+a] 
						})
					}
                } else if (cmd[0] == 'H') {
                    let [_, a, b] = cmd.match(/H(.*):(.*)/);
                    temp.push(entry('ha', i+1, a, b))
                } else if (cmd[0] == 'F') {
                    let [_, a, b] = cmd.match(/F(.*):(.*)/);
                    temp.push(entry('fa', i+1, a, b))
                } else if (cmd[0] == 'A') {
                    let [_, a, b] = cmd.match(/A(.*):(.*)/);
                    temp.push(entry('and', i+1, a, b))
                } else if (cmd[0] == 'C') {
                    let [_, b] = cmd.match(/C(.*)/);
                    temp.push({
							t: 'adc',
							l: i + 1,
							val: 0,
							in: [],
							out: b.split(/\s+/).map(x=>+x) 
						})
				} else if (cmd[0] == 'O') {
                    let [_, a, b] = cmd.match(/O(.*):(.*)/);
                    temp.push(entry('or', i+1, a, b))
                } else if (cmd[0] == 'X') {
                    let [_, a, b] = cmd.match(/X(.*):(.*)/);
					temp.push(entry('xor', i+1, a, b))
                } else if (cmd[0] == 'D') {
                    let [_, a, b] = cmd.match(/D(.*)/);
                    a = a.trim();
                    temp.push({
                        t: 'digit',
                        val: 5,
                        l: i + 1,
                        in: a.split(/\s+/).map(x => +x),
                        out: []
                    })
                }
            })

        })
		elements = temp } catch (e) { console.warn(e)}
    }

	query.map(q => {
		let l = q.logic || 'C1 2 3 4>D1 2 3 4' //   S1>B1
		parse(l)
		m.redraw();
		
	})


    const tools = () => [
        m(`span` + b `p 0 0.5ex; m 0 1ex; bc goldenrod; c white; br 0.5ex; cursor: pointer`, {
            //disabled: !enabled(),
            onclick: () => { store(undefined);  parse(query().logic)}
        }, 'reset')
    ]; 


	const i = store.map(v => {
		updateStatus()
        let _ 
		if (v && query().target) {
			let plus = status[status.length-1];
			if (plus.length==0) {
				plus = status[status.length-2];
			} plus = plus.map(Number).join('')
			_ = {
				icn: '🕵',
				sub: query().target == plus ? (v.count<=query().trophy ? '🏆 ':'✅' ): '❌',
				col: query().target == plus ? col.green : col.red,
			}
		} else {
			_ = { icn: '🕵', col: col.unset }
		}
		v && info(_)
		return _
	})


    return {
        view: () => {
            let w = (elements.reduce((a, c) => max(a, c.l), 0) + 1) * u
            let h = (elements.reduce((a, c) => max(a, ...c.in, ...c.out), 0) + 1) * u
			updateStatus()
			return m(box, {
                icon: '🕵💻',
				sub: ((i() && i().sub)||'') + ( store() && store().count>0 ? ' ('+store().count+')':''),
                tools: tools()
            }, m('svg', {
                    width: w,
                    height: h,
                   // viewBox: `${-u/2} ${0} ${w+u/2} ${h}`
                },
                //grid(600,200),
                ...elements.map(e => {
                    let mi = min(...e.in, ...e.out),
                        ma = max(...e.in, ...e.out);
                    let top = []
                    if (e.t == 'id') {

                    } else if (e.t == 'switch') {
                        top.push(m('rect', {
                            onclick: () => {
								e.on = !e.on;
								let s = {...store()}
								if (e.label) {
									s = {...s, [e.label]: e.on }
								} s.count = (s.count||0)+1
								store(s)
								//console.log(store())
								// count
                            },
                            cursor: 'pointer',
                            x: u * (e.l-1/3),
                            y: u * ((mi + ma)/2-1/3),
                            //r: u * 1 / 3,
                            width: u * 2 / 3,
                            height: u * 2/ 3,
							fill: e.on ? 'red' : 'white',
                            stroke: 'blue'
                        }));
						top.push(m('text', {
                            x: u * (e.l - 2 / 3),
                            y: u * (mi + (ma - mi) / 2),
                            "text-anchor": "middle",
                            "alignment-baseline": "central",
                            fill: 'black'
                        }, e.label))
                    } else if (e.t == 'bulb') {
                        top.push(m('circle', {
                            cx: u * e.l,
                            cy: u * (mi + ma) / 2,
                            r: u * 1 / 3,
                            fill: e.in.some(a => status[e.l - 1][a]) ? 'red' : 'white',
                            stroke: 'black'
                        }))
						top.push(m('text', {
                            x: u * (e.l + 2 / 3),
                            y: u * (mi + (ma - mi) / 2),
                            "text-anchor": "middle",
                            "alignment-baseline": "central",
                            fill: 'black'
                        }, e.label))
                    } else if (e.t == 'adc') {
						top.push(m('rect', {
                            x: u * (e.l - 1 / 3),
                            y: u * (mi - 1 / 3),
                            width: u * 2 / 3,
                            height: u * (ma - mi + 2 / 3),
                            fill: 'white',
                            stroke: 'black'
                        }))
						top.push(m('rect', {
                            x: u * (e.l - 1/12),
                            y: u * (mi - 1 / 6),
                            width: u * 1 / 6,
                            height: u * (ma - mi + 1 / 3),
                            fill: 'white',
                            stroke: 'black'
                        }));
						top.push(m('circle', {
                            cx: u * e.l,
                            cy: u * (mi-1/24  + e.val*(ma-mi+1/24)/100 ),
                            r: u * 1 / 4,
                            fill: '#ddf',
                            stroke: 'black',							
                        }));
						/*top.push(m('text', {
                            x: u * (e.l - 3 / 8),
                            y: u * (mi-1/24  + e.val*(ma-mi+1/24)/100 ),
							"font-size": "80%",
                            "text-anchor": "end",
                            "alignment-baseline": "central",
                            fill: 'black'
                        }, e.val))*/
						let q = 101;
						for (let i = 0; i<q; i++) {
							top.push(m('rect', {
								x: u * (e.l - 1 / 3),
								y: u * (mi - 1 / 3 + i*(ma - mi+2/3)/q ) ,
								width: u * 2 / 3,
								height: u * (ma - mi + 2 / 3)/q,
								fill: 'none',
								stroke: 'rgba(255,255,0,0)',	
								onmousemove: () => {e.val = i;},
								onmouseclick: () => {e.val = i},
								onmouseenter: () => {e.val = i},
							}));
						}
					} else if (e.t == 'digit') {
                        top.push(m('rect', {
                                x: u * (e.l - 1 / 3),
                                y: u * (mi - 1 / 3),
                                width: u * 3.9 / 3,
                                height: u * (ma - mi + 2 / 3),
                                fill: 'white',
                                stroke: 'black',
								
                            })),
                            (ma - mi) > 0 && top.push(m('text', {
								style: { fontSize: "80%"},
                                x: u * (e.l-0.15),
                                y: u * (mi),
                                "text-anchor": "middle",
								"alignment-baseline": "central",
								fill: 'black',
                                stroke: 'none',
                            }, '1')),
                            (ma - mi) > 0 && top.push(m('text', {
                                style: { fontSize: "80%"},
                                x: u * (e.l-0.15),
                                y: u * (ma),
                                "text-anchor": "middle",
								"alignment-baseline": "central",
								fill: 'black',
                                stroke: 'none'
                            }, '1248'[e.in.length-1])),
                            top.push(sevensegment(e.val, u * (e.l + 0.05), u * ((mi + ma) / 2 - .52), u * 0.65, 'red', '#eee'))
                    } else {
                        let q = {
                            not: '!',
                            and: '&',
                            or: '≥1',
                            xor: '=1',
							fa: 'FA',
							ha: 'HA'
                        }
                        top.push(m('rect', {
                            x: u * (e.l - 1 / 3),
                            y: u * (mi - 1 / 3),
                            width: u * 2 / 3,
                            height: u * (ma - mi + 2 / 3),
                            fill: 'white',
                            stroke: 'black'
                        }))
                        top.push(m('text', {
                            x: u * (e.l),
                            y: u * (mi + (ma - mi) / 2),
                            "text-anchor": "middle",
                            "alignment-baseline": "central",
                            width: u * 1 / 2,
                            height: u * (ma - mi + 1 / 2),
                            fill: 'black'
                        }, q[e.t] || '@'))
                    }

                    return [
						e.t=='id' && e.label && top.push(m('text', {
                            x: u * (e.l),
                            y: u * ((mi + (ma - mi) / 2)-.3),
                            "text-anchor": "middle",
                            "alignment-baseline": "central",
                            width: u * 1 / 2,
                            height: u * (ma - mi + 1 / 2),
                            fill: 'black'
                        }, e.label || '@')),
                        ...e.in.map(y => m('line', {
                            x1: u * (e.l - 1 / 2),
                            y1: u * y,
                            x2: u * e.l,
                            y2: u * y,
                            'stroke-width': 9,
                            stroke: 'white'
                        })),

                        ...e.in.map(y => m('line', {
                            x1: u * (e.l - 1 / 2),
                            y1: u * y,
                            x2: u * e.l,
                            y2: u * y,
                            'stroke-width': 2,
                            stroke: status[e.l - 1][y] ? 'red' : 'black'
                        })),

                        ...e.out.map(y => m('line', {
                            x1: u * e.l,
                            y1: u * y,
                            x2: u * (e.l + 1 / 2),
                            y2: u * y,
                            'stroke-width': 9,
                            stroke: 'white'
                        })),

                        ...e.out.map(y => m('line', {
                            x1: u * e.l,
                            y1: u * y,
                            x2: u * (e.l + 1 / 2),
                            y2: u * y,
                            'stroke-width': 2,
                            stroke: status[e.l][y] ? 'red' : 'black'
                        })),

                        m('line', {
                            x1: u * e.l,
                            y1: u * mi,
                            x2: u * e.l,
                            y2: u * ma,
                            'stroke-width': 2,
                            stroke: e.in.some(x => status[e.l - 1][x]) ? 'red' : 'black'
                        }),

                        ...top,
                    ]
                })
            ))
        }
    }

}

app.persistent = true;
app.options = [{
    a: 'logic',
    t: 'text',
    r: true,
    d: 'S1e>B1o',
    c: 'Circuit Map'
}, {
    a: 'target',
    t: 'text',
    r: false,
    d: '',
    c: 'Ziel im Spielmodus, z.B. "11"'
}, {
    a: 'trophy',
    t: 'number',
    r: true,
    d: 1,
    c: 'Maxmiale Anzahl Züge für eine Trophähe'
}, ];

export default app;