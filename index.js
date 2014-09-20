var CP = require('./lib/cache-provider.js');
var keys = Object.keys;
var stores = {};

var DS = function (opt) {
  if (!(opt instanceof Object)) {
    console.log('The arguments of new store should be Object!');
    return;
  }
  if (!opt.name && typeof opt.name !== 'string') {
    console.log('new store name should be offer and be string!');
    return;
  }
  if (stores[opt.name]) {
    console.log('new store name has existed!');
  }
  //定义store
  stores[opt.name] = {};
  //扩展store方法
  keys(opt).forEach(function (method) {
    if (opt[method] instanceof Function && method !== 'cache') {
      stores[opt.name][method] = opt[method];
    }
  });
  //定义对应cache
  if(opt.cache && opt.cache instanceof Object) {
    stores[opt.name].cache = CP({
      id: opt.cache.id,
      methods: opt.cache.methods
    });
  }

  return stores[opt.name];
};

module.exports = DS;