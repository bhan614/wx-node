const crypto = require('crypto');

const createNonceStr = function () {
  return Math.random().toString(36).substr(2, 15);
};

const createTimestamp = function () {
  return parseInt(new Date().getTime() / 1000) + '';
};

const raw = function (args) {
  let keys = Object.keys(args);
  keys = keys.sort()
  const newArgs = {};
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key];
  });

  let string = '';
  for (const k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
};

const genSignatureSha1 = (str) => {
  if (!str) {
    return '';
  }
  const sha1 = crypto.createHash('sha1');
  sha1.update(str);
  return sha1.digest('hex');
}

/**
 * @synopsis 签名算法
 *
 * @param jsapi_ticket 用于签名的 jsapi_ticket
 * @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
 *
 * @returns
 */
module.exports.signature = (jsapi_ticket, url, nonceStr, timestamp) => {
  const ret = {
    jsapi_ticket: jsapi_ticket,
    nonceStr: nonceStr || createNonceStr(),
    timestamp: timestamp || createTimestamp(),
    url: url
  };
  const string = raw(ret);
  console.log(string);
  ret.signature = genSignatureSha1(string);
  return ret;
}