const express = require('express');
const router = express.Router();

const signControl = require('./sign-control');
const service = require('../service/index');
const signRet = require('../helper/sign');
const APP_CONFIG = require('../config/index').APP_CONFIG;

/**
 * 异步接口获取签名
 */
router.get('/', (req, res, next) => {
  const {returnUrl, jsonp, source = ''} = req.query; //returnUrl： 不需要encode 为获取签名的页面URL
  if (!returnUrl || !APP_CONFIG[source] || !APP_CONFIG[source].appid) {
    return res.json({code: 0, msg: '参数非法'});
  }

  const appid = APP_CONFIG[source].appid;
  const secret = APP_CONFIG[source].appsecret;

  signControl.getBaseAccessToken(req, appid, secret, source).then(baseAccessToken => {
    return signControl.getTicket(req, baseAccessToken, source);
  }).then(ticket => {
    const raw = signRet.signature(ticket, returnUrl);
    const {nonceStr, timestamp, signature} = raw;
    const data = {nonceStr, timestamp, signature, appid};
    console.log(`获取签名结果：${JSON.stringify(data)}`);
    if (String(jsonp) === '1') {
      res.jsonp(data);
    } else {
      res.json(data);
    }
  }, (err) => {
    console.log(`获取签名错误：${JSON.stringify(err)}`);
    res.json({code: 0, msg: '签名错误'});
  })
});

module.exports = router;
