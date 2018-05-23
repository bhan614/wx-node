/**
 * 用来动态管理 cookie 数据
 */
const cookieUtil = {

  /**
   * 设置账户 cookie 信息
   * @param merchantId
   * @param loginName
   * @param auth
   * @param res
   */
  setAccountCookie (keys, res) {
    /**
     * 不能设置 secure 为 true
     *  Set-Cookie 的 secure 属性就是处理这方面的情况用的，
     *  它表示创建的 cookie 只能在 HTTPS 连接中被浏览器传递到服务器端进行会话验证，
     *  如果是 HTTP 连接则不会传递该信息，所以绝对不会被窃听到
     * @type {{maxAge: number}}
     * maxAge 单位是毫秒
     */
    // ie 低版本需要设置 P3P
    res.set('P3P', 'CP=CAO PSA OUR');
    const options = {domain: '.test.com', path: '/', maxAge: 30 * 24 * 60 * 60 * 1000};
    for (const i of Object.keys(keys)) {
      res.cookie(i, keys[i], options);
    }
  },

  getAccountCookie(keys, req) {
    const cookies = req.cookies;
    const rs = {};
    for (const i of keys) {
      rs[i] = cookies[i];
    }
    return rs;
  },

  /**
   * 清空cookie
   * @param keys array
   * @param res
   */
  clearAccountCookie (keys, res) {
    const options = {domain: '.test.com', path: '/'};
    for (const i of keys) {
      res.clearCookie(i, options);
    }
  }
};

module.exports = cookieUtil;
