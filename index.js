var extend = require('extend');
//数据一致性
var database = {};
//页面缓存一致性
var caches = {};

/**
 * 缓存类
 * @param option
 * @keys _id, _dbName, db
 * @constructor
 */
var Cache = function(option) {
  this._id = option.id;
  //数据缓存指向
  this._dbName = option['DB:' + option.id];

  //检测数据缓存是否存在，没有则建立一个对应的新缓存
  if(!(this._dbName in database)) {
    database[this._dbName] = {};
    this.db = database[this._dbName];
  }
};

/**
 * 缓存工厂类
 * @param option
 * @returns {*}
 */
var cacheFactory = function(option) {
  if(!(option.id in caches)) {
    var _cache = new Cache(option);

    caches[_cache._id] = extend(true, {}, _cache, option.methods);
  }

  return caches[option.id];
};

function cacheProvider(option) {
  return cacheFactory(option);
}

cacheProvider.get = function(id) {
  return caches[id];
};

cacheProvider.reset = function(id) {
  if(caches[id]) {
    var dbName = caches[id]._dbName;
    delete database[dbName];
    delete caches[id];
  }
};

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
  //定义store
  stores[opt.name] = {};
  //扩展store方法
  keys(opt).forEach(function (method) {
    if (opt[method] instanceof Function && method !== 'cache') {
      stores[opt.name][method] = opt[method];
    }
  });
  //定义对应cache
  if(opt.cache instanceof Object) {
    stores[opt.name].cache = cacheProvider({
      id: opt.cache.id,
      methods: opt.cache.methods
    });
  }

  return stores[opt.name];
};

module.exports = function (opt) {
  if (!stores[opt.name]) {
    new DS(opt);
  }
  return stores[opt.name]
};