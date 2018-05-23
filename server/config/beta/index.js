/**
 * 测试环境
 */
module.exports.port = process.env.PORT = 8888;
module.exports.NODE_ENV = process.env.NODE_ENV = 'beta';

module.exports.APP_CONFIG = process.env.APP_CONFIG = {

  'wxgzh': {
    appid: '',
    appsecret: ''
  }
}

//sentinel
module.exports.REDIS_SENTINEL_END_POINTS = process.env.REDIS_SENTINEL_END_POINTS = [];
module.exports.REDIS_SENTINEL_MASTER_NAME = process.env.REDIS_SENTINEL_MASTER_NAME = '';
module.exports.REDIS_SENTINEL_DB = process.env.REDIS_SENTINEL_DB = 7;

module.exports.openIdUrl = process.env.openIdUrl = '';
