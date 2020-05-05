const path = require("path");

module.exports = [
  ["hacss-plugin-variables.umd.js", "development"],
  ["hacss-plugin-variables.umd.min.js", "production"],
].map(([filename, mode]) => ({
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename,
    library: ["hacssPlugins", "variables"],
    libraryTarget: "umd",
    globalObject: "this",
    libraryExport: "default",
  },
  resolve: {
    alias: {
      "core-js": "core-js-pure",
    },
  },
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, use: "babel-loader" }],
  },
  mode,
  devtool: "source-map",
}));
