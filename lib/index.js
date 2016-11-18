var App = require('@recipher/app')[require('@recipher/utility').getApp(process.argv)]
  , pkg = require('../package.json');

module.exports = new App(pkg.name, __dirname);