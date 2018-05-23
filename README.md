## 微信授权、SDK后台
### 1、服务
  `npm install `   
  `npm run start`
### 2、sdk demo 访问
   `https://wx.test.com/index`
## 接口说明

### 1、授权，并获得openid（可设置needJs=1来同步获取分享签名）
    https://wx.test.com/auth?source=test&callbackUrl=https://wx.test.com/demo
* source: 公众号来源
* callbackUrl: 授权完成后跳转的业务地址
* needJs: 是否需要同步得到可以分享的签名，若需要，不传空值即可。如不需要，不传。该入口只用于授权
* apiUrl: 需要设置分享的前端地址，在needJs有值时默认获取callbackUrl，此地址用于生成签名   

**不建议通过同步方式获取设置分享需要的参数。因为，生成签名时需要当前页面的URL，URL可能是动态的，并且分享后微信会在URL后面加上一些参数，而设置分享时，微信SDK会校验签名和当前页面的URL。**

授权完成后，会向cookie中设置openid，如果needJs不为空，cookie中还会有wx.config中需要的参数。此时，req.cookies中有如下信息：
```
{   
    openid: 'o9ieFxAoGdoyrfCXk2Orivc1X70A',
    nonceStr: 'ge7ry968jmg7z34',
    timestamp: '1510383359',
    signature: '28ed6473b2bbb67d09f555120cefde4ab30bc43f',
    appid: 'wx9db0a88cecd76494'
}
```
若不传needJs，cookie中只有openid

### 2、异步获取签名 signature
    https://wx.test.com/signature?source=test&returnUrl=&jsonp=
 * source 来源
 * returnUrl: wx.config的页面地址 `window.location.href`
 * jsonp: 是否跨域 1表示跨域  默认不跨域，不传   

正确返回：
```
{
    nonceStr: 'ge7ry968jmg7z34',
    timestamp: '1510383359',
    signature: '28ed6473b2bbb67d09f555120cefde4ab30bc43f',
    appid: 'wx9db0a88cecd76494'
}
```
错误返回：
```
{
    code: 0,
    msg: '参数非法 || 签名错误'
}
```

### 注意

以上接口中 source 参数请确认是正确的来源，接口中会根据这个字段 匹配对应公众号的 `appid` 和 `appsecret`，这两个值和用户信息密切相关。

### 接入使用

1、向`server/config/production`中APP_CONFIG 加入对应的公众号配置对象，配置的key和source值一致。  

2、在 public 路径下面添加公众号的微信识别txt文档
