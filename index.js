module.exports = config => {
  const globalVariables = Object.keys(config).filter(key => typeof config[key] !== "object");

  const mkPattern = property => {
    const variables = Object.keys(config[property] || {}).concat(globalVariables);
    return new RegExp(`\\$(\\((${variables.join("|")})((\\|(${variables.join("|")}))*)\\)|(${variables.join("|")}))`, "g");
  };

  const lookup = property => (a, b) => {
    const val = (config[property] || {})[b] || config[b];
    if (typeof val === "function") {
      return val(a);
    }
    return val;
  };

  const evaluate = property => x =>
    (x[1] === "(" ? x.substring(2, x.length - 1) : x.substring(1))
    .split("|")
    .reduce(lookup(property), null);

  return declarations => {
    return Object
      .keys(declarations)
      .map(key => [key, declarations[key]])
      .map(([property, value]) => [
        property,
        value.replace(mkPattern(property), evaluate(property)),
      ])
      .reduce(
        (decls, [ property, value ]) =>
          Object.assign({}, decls, { [property]: value }),
        {}
      );
  };
};
