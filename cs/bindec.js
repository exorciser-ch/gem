import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import box from "/component/box.js";


const app = ({
  query,
  store,
  info
}) => {

  store.map(s => info({
    icn: app.icon,
  }));

  let good = false
  let checked = false

  const access = (attr) => {
    let defaults = {
      correct: 0
    }
    if (store() && typeof(store()[attr]) !== "undefined") return store()[attr];
    if (query() && typeof(query()[attr]) !== "undefined") return query()[attr];
    return defaults[attr] || "";
  }

  const newProblem = () => {
    let bin = "";
    for (let i = 0; i <= Math.min(8, 4 + Math.floor((access("correct") - 1) / 5)); i++) {
      bin += "01" [+(Math.random() < .5)];
    }
    store({
      ...store(),
      bin: bin,
      dec: ""
    })
    good = false;
    checked = false;
  }

  const check = () => {
    checked = (access("dec") !== "")

    if (access("dec") != parseInt(access("bin"), 2))
      return false;

    store({
      ...store(),
      correct: +access("correct") + 1
    });
    good = true;
    setTimeout(newProblem, 1500);
  }

  return {
    view: () => {
      if (access("bin") == "") newProblem();

      return m(box, {
          icon: app.icon,
        },
        [
          (access("correct") > 0 ? m("div" + b`mt: 20px; mb: 30px; ta: center;`, `korrekt gelöste Aufgaben: ${access("correct")}`) : null),
          m("div" + b`display: flex; align-items: center; justify-content: center; width: 100%; mb: 20px;`,
          m("div" + b `d flex; fd: row;`,
            m("div" + b `font-size: 30px;`, access("bin")),
            m("div" + b `mt: 22px; font-size: 15px;`, "2"),
            m("div" + b `font-size: 30px; ml: 10px; mr: 10px;`, "="),
            m("input" + b `font-size: 30px; bc: ${access("dec")&&!good?"#ffaaaa":"white"};`, {
              type: "text",
              value: access("dec"),
              oninput: function(e) {
                store({
                  ...store(),
                  dec: e.target.value.replace(/[^0-9]+/, ""),
                });
                check();
              }
            }),
            m("div" + b `width: 30px; font-size: 25px; mt: 2px; ml: 10px;`, (good ? "✅" : (checked?"❌":"")))
          ))
        ]);
    }
  };
};

app.presets = true;
app.persistent = true;
app.icon = "💻";
app.options = [];

export default app;
