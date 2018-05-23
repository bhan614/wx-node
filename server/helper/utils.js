/**
 * 基础的工具方法
 * @type {request}
 */
const request = require('request'); //enable cookie

const formatRequestError = function (options) {
  const err = new Error(`获取服务端接口异常，url：${options.url}`);
  return err;
};

const logTimeUse = function (start, url) {
  const end = process.hrtime();
  console.log(`【${url}】耗时${((end[0] - start[0]) * 1e3 + (end[1] - start[1]) * 1e-6).toFixed(3)}ms`);
};

module.exports.remotePostJSON = (options) => {
  const {req = {}} = options;
  const {headers} = req;
  const {clientIP, cookie} = headers;

  console.log(`POST请求地址:${options.url};请求参数:${JSON.stringify(options.data)}, 携带cookies:${cookie}`);
  const setting = {
    url: options.url,
    headers: {
      clientIP,
      cookie,
      'X-Requested-With': 'XMLHttpRequest',
    },
  }

  if ( options.isForm ) {
    setting.form = options.data || {}
  } else {
    setting.json = options.data || {}
  }

  return new Promise((resolve, reject) => {
    const start = process.hrtime();
    request.post(
      setting,
      (err, response, body) => {
        logTimeUse(start, options.url);//记录接口耗时

        if (!err && response.statusCode === 200) {
          console.log(`${options.url} =======返回数据========== \n ${JSON.stringify(body, 2)}`);
          resolve(body);
        } else {
          if (err) {
            console.log(`${options.url} =======错误==========  \n ${err.stack}`);
          }
          console.log(`post:${options.url} error!${response && response.statusCode}`);
          console.log(`error repsonse body is:${body}`);
          reject(formatRequestError(options));
        }
      }
    );
  });
};

/**
 * get获取json数据
 * @param options
 */
/**
 * get获取json数据
 * @param options
 */
module.exports.remoteGetJSON = (options) => {
  let url;
  if (typeof options === 'string') {
    url = options;
    options = {};
  } else if (typeof options === 'object') {
    url = options.url;
  }

  const {data = {}} = options;
  const {req = {}} = options;
  const {headers} = req;
  const {clientIP, cookie} = headers;

  console.log(`GET请求地址:${options.url};请求参数:${JSON.stringify(data)},携带cookies:${cookie}`);
  const setting = {
    url,
    headers: {
      clientIP,
      cookie,
      'X-Requested-With': 'XMLHttpRequest',
    },
  }

  if ( options.isquery ) {
    setting.qs = options.data || {}
  } else {
    setting.json = options.data || {}
  }


  return new Promise((resolve, reject) => {
    const start = process.hrtime();
    request.get(
      setting,
      (err, response, body) => {
        logTimeUse(start, options.url);//记录接口耗时

        if (!err && response.statusCode === 200) {
          console.log(`${options.url} =======返回数据========== \n ${JSON.stringify(body, 2)}`);
          resolve(body);
        } else {
          if (err) {
            console.log(`${options.url} =======错误==========  \n ${err.stack}`);
          }
          console.log(`post:${options.url} error!${response && response.statusCode}`);
          console.log(`error repsonse body is:${body}`);
          reject(formatRequestError(options));
        }
      }
    );
  });
};

// 首字母大写
module.exports.upperFirstLetter = (str) => {
  if (!str) {
    return '';
  }
  return str[0].toUpperCase() + str.substring(1);
}
