const assert = require("assert");
const variablesPlugin = require("../dist/hacss-plugin-variables.umd.js");

const spec = {
  "sans-serif": "'Inter', sans-serif",
  "red-500": "#f00",
  "red-600": "#e60000",

  "font-size": {
    small: "12px",
  },

  "border-radius": {
    small: "4px",
  },

  spacing1: "4px",

  darken: x => (spec["red-500"] ? spec["red-600"] : x),
  "url-encode": encodeURIComponent,
};

const execVars = variablesPlugin(spec);

const test = (actual, expected) => {
  console.log(`${JSON.stringify(actual)} === ${JSON.stringify(expected)}`);
  assert.deepEqual(actual, expected);
};

test(
  execVars({
    "font-family": "$(sans-serif)",
    foo: "$(sans-serif)",
  }),
  {
    "font-family": spec["sans-serif"],
    foo: spec["sans-serif"],
  },
);

test(
  execVars({
    "font-size": "$(small)",
    "border-radius": "$(small)",
  }),
  {
    "font-size": spec["font-size"]["small"],
    "border-radius": spec["border-radius"]["small"],
  },
);

test(
  execVars({
    "background-image":
      "url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%279px%27%20height=%275px%27%20viewBox=%270%200%209%205%27%3E%3Cpolygon%20points=%270,5%205,0%209,5%27%20fill=%27$(red-500|darken|url-encode)%27%20/%3E%3C/svg%3E')",
  }),
  {
    "background-image": `url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%279px%27%20height=%275px%27%20viewBox=%270%200%209%205%27%3E%3Cpolygon%20points=%270,5%205,0%209,5%27%20fill=%27${encodeURIComponent(
      spec["red-600"],
    )}%27%20/%3E%3C/svg%3E')`,
  },
);

test(
  execVars({
    "background-image": "linear-gradient($red-500,$red-600)",
  }),
  {
    "background-image": `linear-gradient(${spec["red-500"]},${spec["red-600"]})`,
  },
);

test(
  execVars({
    foo: "$red-500|darken",
  }),
  {
    foo: `${spec["red-500"]}|darken`,
  },
);

test(
  execVars({
    foo: `$('${spec["red-500"]}'|darken)`,
    bar: `$("${spec["red-500"]}"|darken)`,
  }),
  {
    foo: spec["red-600"],
    bar: spec["red-600"],
  },
);

console.log("All tests passed.");
