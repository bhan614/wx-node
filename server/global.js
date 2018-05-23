const global = {};

global.apis = {
  authorize: 'https://open.weixin.qq.com/connect/oauth2/authorize', //授权
  accessToken: 'https://api.weixin.qq.com/sns/oauth2/access_token',  //获取登录授权的access_token 以及openid
  accessTokenByRefresh: 'https://api.weixin.qq.com/sns/oauth2/refresh_token', // 授权后通过第一次得到的refresh_token 继续获得access_token 暂时没用这个
  baseAccessToken: 'https://api.weixin.qq.com/cgi-bin/token', // 通过appid appsecret 获取基础access_token
  getTicket: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket', // 通过基础access_token获得jsapi_ticket
  userInfoByOpenId: '', //C端根据openId获取用户信息
};

module.exports = global;
