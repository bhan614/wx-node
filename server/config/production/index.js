/**
 * 环境配置 生产环境
 */
module.exports.port = process.env.PORT = 8888;
module.exports.NODE_ENV = process.env.NODE_ENV = 'production';

/**
 * 公众接口号配置
 * @type {{wx: {appid: string, appsecret: string}, bkgj: {appid: string, appsecret: string}, yqzxw: {appid: string, appsecret: string}}}
 */
module.exports.APP_CONFIG = process.env.APP_CONFIG = {

  'wx': {
    appid: '',
    appsecret: '',
  }
}

//redis sentinel
module.exports.REDIS_SENTINEL_END_POINTS = process.env.REDIS_SENTINEL_END_POINTS = [];
module.exports.REDIS_SENTINEL_MASTER_NAME = process.env.REDIS_SENTINEL_MASTER_NAME = '';
module.exports.REDIS_SENTINEL_DB = process.env.REDIS_SENTINEL_DB = 7;

module.exports.openIdUrl = process.env.openIdUrl = '';
