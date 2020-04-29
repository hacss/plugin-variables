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

  it("always requires parens for interpolation", () => {
    const expected = {
      "background-image": "blahblah$red-500.asdf",
    };

    const actual = plugin({
      "background-image": "blahblah$red-500.asdf",
    });

    expect(actual).to.deep.equal(expected);
  });

  it("always requires parens for pipes", () => {
    const expected = {
      foo: "$red-500|darken",
    };

    const actual = plugin({
      foo: "$red-500|darken",
    });

    expect(actual).to.deep.equal(expected);
  });

  it("doesn't require parens when entire value is a variable reference", () => {
    const expected = {
      foo: config["red-500"],
    };

    const actual = plugin({
      foo: "$red-500",
    });

    expect(actual).to.deep.equal(expected);
  });

  it("doesn't require parens when entire word is a variable reference", () => {
    const expected = {
      padding: `${config["spacing1"]} ${config["spacing1"]}`,
    };

    const actual = plugin({
      padding: "$spacing1 $spacing1",
    });

    expect(actual).to.deep.equal(expected);
  });
});
