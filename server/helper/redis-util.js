const config = require('../config/index');
const Redis = require('ioredis'),
      client = new Redis({
        sentinels: config.REDIS_SENTINEL_END_POINTS,
        name: config.REDIS_SENTINEL_MASTER_NAME,
        db: config.REDIS_SENTINEL_DB,
      });

client.on('connect', function() {
  console.log('Connected to Redis');
});

client.on('error', function (err) {
  console.log("Error " + err);
});

// const stream = client.scanStream();
//
// stream.on('data', function (resultKeys) {
//   console.log(resultKeys);
// });
// client.keys("*", keysOptions).then(res => {
//   console.log(res);
// })


/**
 * 设置redis值
 * @param key
 * @param value
 * @param expires 以秒为单位
 */
module.exports.set = function (key, value, expires) {
  client.set(key, value, 'EX', expires);
};

/**
 * 获取key值
 * @param key
 * @param callback
 */
module.exports.get = function (key, callback) {
  client.get(key, function (err, reply) {
    if (err) {
      callback(null, err);
    } else {
      callback(reply)
    }
  });
};

/**
 * 删除key
 * @param key
 * @param callback
 */
module.exports.del = function (key) {
  client.del(key);
}


