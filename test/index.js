const { expect } = require("chai");
const mkPlugin = require("../index.js");

describe("variables plugin", () => {
  const config = {
    "sans-serif": "'Inter', sans-serif",
    "red-500": "#f00",
    "red-600": "#e60000",

    "font-size": {
      "small": "12px",
    },

    "border-radius": {
      "small": "4px",
    },

    "spacing1": "4px",

    "darken": x => "#f00" ? "#e60000" : x,
    "url-encode": encodeURIComponent,
  };

  const plugin = mkPlugin(config);

  it("resolves global variables", () => {
    const expected = {
      "font-family": config["sans-serif"],
      "foo": config["sans-serif"],
    };

    const actual = plugin({
      "font-family": "$(sans-serif)",
      "foo": "$(sans-serif)",
    });

    expect(actual).to.deep.equal(expected);
  });

  it("resolves variables indexed by property", () => {
    const expected = {
      "font-size": config["font-size"]["small"],
      "border-radius": config["border-radius"]["small"],
    };

    const actual = plugin({
      "font-size": "$(small)",
      "border-radius": "$(small)",
    });

    expect(actual).to.deep.equal(expected);
  });

  it("runs variable values through specified pipes", () => {
    const expected = {
      "background-image": `url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%279px%27%20height=%275px%27%20viewBox=%270%200%209%205%27%3E%3Cpolygon%20points=%270,5%205,0%209,5%27%20fill=%27${encodeURIComponent(config["red-600"])}%27%20/%3E%3C/svg%3E')`,
    };

    const actual = plugin({
      "background-image": "url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%279px%27%20height=%275px%27%20viewBox=%270%200%209%205%27%3E%3Cpolygon%20points=%270,5%205,0%209,5%27%20fill=%27$(red-500|darken|url-encode)%27%20/%3E%3C/svg%3E')",
    });

    expect(actual).to.deep.equal(expected);
  });

  it("replaces all occurrences of variable matches", () => {
    const expected = {
      "background-image": `linear-gradient(${config["red-500"]},${config["red-600"]})`,
    };;;;

    const actual = plugin({
      "background-image": "linear-gradient($red-500,$red-600)",
    });

    expect(actual).to.deep.equal(expected);
  });

  it("requires parens for pipes", () => {
    const expected = {
      foo: `${config["red-500"]}|darken`,
    };

    const actual = plugin({
      foo: "$red-500|darken",
    });

    expect(actual).to.deep.equal(expected);
  });
});
