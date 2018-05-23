const express = require('express');
const service = require('../service/index');
const router = express.Router();

const signControl = require('./sign-control');
const cookieUtil = require('../helper/cookie-util');
const signRet = require('../helper/sign');
const config = require('../config/index');
const Global = require('../global');

const APP_CONFIG = config.APP_CONFIG;

const defaultCallbackUrl = '';

router.get('/demo', (req, res, next) => {
  res.render('demo', {
    title: '微信SDK测试Demo',
  });
})

/**
 * 入口地址：http://wx.test.com:8888/auth?source=test&callbackUrl=http://wx.test.com:8989/testwx&apiUrl=
 * 1、参数callbackUrl： 授权完成后跳转的业务系统后台入口地址
 * 2、参数source：公众号来源
 */
router.get('/auth', (req, res, next) => {
  const {callbackUrl = defaultCallbackUrl, needJs = '', source = ''} = req.query;

  let REDIRECT_URI = encodeURIComponent(`${config.openIdUrl}?source=${source}&callbackUrl=${callbackUrl}`);
  if (needJs) {
    const jsApiUrl = req.query.jsApiUrl || callbackUrl || '';
    REDIRECT_URI = encodeURIComponent(`${config.openIdUrl}?source=${source}&needJs=${needJs}&jsApiUrl=${jsApiUrl}&callbackUrl=${callbackUrl}`);
  }

  if (!APP_CONFIG[source] || !APP_CONFIG[source].appid) {
    return res.render('error')
  }

  const STATE = new Date().getTime();
  const appid = APP_CONFIG[source].appid;

  res.redirect(`${Global.apis.authorize}?appid=${appid}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=snsapi_base&state=${STATE}#wechat_redirect`)
});

/**
 * 通过授权之后URL上的code获得openid和access_token，这里的access_token和base_access_token不一样
 * @param req
 * @param res
 * @param next
 */
const getOpenIdFunc = (req, res, next) => {
  const {code, needJs, callbackUrl, source = ''} = req.query;
  if (!code) {
    res.json({code: 0, msg: '参数code非法'});
  }
  const appid = APP_CONFIG[source].appid;
  const secret = APP_CONFIG[source].appsecret;

  service.getAccessToken(req, {appid, secret, code, grant_type: 'authorization_code'}).then((body) => {
    body = JSON.parse(body);
    if (body && body.openid) {
      const {openid} = body;
      console.log(`设置响应cookie openid：${openid}`);
      cookieUtil.clearAccountCookie(['nonceStr', 'timestamp', 'signature', 'appid', 'openid'], res);
      cookieUtil.setAccountCookie({openid}, res);
      /**
       * 不需要同步得到JS API调用时，直接跳转到callbackUrl, 并将openid拼接在 callbackUrl后面
       */
      if (!needJs) {
        const redirectUrl = `${callbackUrl}${callbackUrl.indexOf('?') > -1 ? '&' : '?'}openid=${openid}`;
        res.redirect(redirectUrl);
      } else {
        next();
      }
    } else {
      next(new Error('微信接口出错'));
    }
  }).catch((err) => {
    next(err);
  })
};


/**
 * 同步得到签名
 */
router.get('/getOpenId', getOpenIdFunc, (req, res, next) => {
  const {callbackUrl, jsApiUrl, source = ''} = req.query;
  console.log(`需要同步获取jsapi的URL：${jsApiUrl}`);

  const appid = APP_CONFIG[source].appid;
  const secret = APP_CONFIG[source].appsecret;

  signControl.getBaseAccessToken(req, appid, secret, source).then(baseAccessToken => {
    return signControl.getTicket(req, baseAccessToken, source);
  }).then(ticket => {
    const raw = signRet.signature(ticket, jsApiUrl);
    const {nonceStr, timestamp, signature} = raw;

    console.log(`设置响应cookie signature相关参数：${JSON.stringify(raw)}`);
    cookieUtil.setAccountCookie({nonceStr, timestamp, signature, appid}, res);
    res.redirect(callbackUrl);
  }, (err) => {
    console.log(`获取签名错误，设置响应header Error：${JSON.stringify(err)}`);
    res.redirect(callbackUrl);
  })
});

/**
 * 原来的接口 获取签名
 */
router.get('/getSignature', (req, res, next) => {
  const {returnUrl, noncestr, timestamp, jsonp, source = ''} = req.query; //returnUrl： 不需要encode 为获取签名的页面URL
  if (!returnUrl || !APP_CONFIG[source] || !APP_CONFIG[source].appid) {
    return res.json({code: 0, msg: '参数非法'});
  }

  const appid = APP_CONFIG[source].appid;
  const secret = APP_CONFIG[source].appsecret;

  signControl.getBaseAccessToken(req, appid, secret, source).then(baseAccessToken => {
    return signControl.getTicket(req, baseAccessToken, source);
  }).then(ticket => {
    const {signature} = signRet.signature(ticket, returnUrl, String(noncestr), timestamp);
    console.log(`生成签名signature：${signature}`);

    if (String(jsonp) === '1') {
      res.jsonp({signature});
    } else {
      res.json({signature})
    }
  }, (err) => {
    console.log(`获取签名错误：${JSON.stringify(err)}`);
    res.json({code: 0, msg: '签名错误'});
  })
});

module.exports = router;
