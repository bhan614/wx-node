const utils = require('../helper/utils');
const Global  = require('../global');

exports.getAccessToken = (req, data) => {
  return utils.remoteGetJSON({
    url: Global.apis.accessToken,
    isquery: true,
    data,
    req
  });
};

exports.getBaseAccessToken = (req, data) => {
  return utils.remoteGetJSON({
    url: Global.apis.baseAccessToken,
    isquery: true,
    data,
    req
  });
}

exports.getTicket  = (req, data) => {
  return utils.remoteGetJSON({
    isquery: true,
    url: Global.apis.getTicket,
    data,
    req
  })
}

exports.getAccessTokenByRefresh = (req, data) => {
  return utils.remoteGetJSON({
    url: Global.apis.accessTokenByRefresh,
    isquery: true,
    data,
    req
  })
}

exports.getUserInfoByOpenId = (req, data) => {
  return utils.remotePostJSON({
    url: Global.apis.userInfoByOpenId,
    data,
    req,
  })
}