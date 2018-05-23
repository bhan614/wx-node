const express = require('express');
const service = require('../service/index');
const util = require('../helper/utils');
const redisUtil = require('../helper/redis-util');

const APP_CONFIG = require('../config/index').APP_CONFIG;

const expires = 2 * 60 * 50; //微信过期是7200s，这里提前10分钟

/**
 * 获取签名第一步：基础access_token
 * @returns {Promise}
 */
const getBaseAccessToken = (req, appid, secret, source) => {
  return new Promise((resolve, reject) => {
    redisUtil.get(`${source}_BASE_ACCESS_TOKEN`, function (reply) {
      if (reply) {
        console.log(`从redis中读取${source}_BASE_ACCESS_TOKEN`);
        resolve(reply);
      } else {
        service.getBaseAccessToken(req, {
          grant_type: 'client_credential', appid, secret,
        }).then(body => {
          body = JSON.parse(body);
          if (body && body.access_token) {
            console.log('从接口中获取BASE_ACCESS_TOKEN');
            redisUtil.set(`${source}_BASE_ACCESS_TOKEN`, body.access_token, expires);
            resolve(body.access_token);
          } else {
            reject(body);
          }
        }).catch(err => {
          reject(err);
        })
      }
    })
  })
}

/**
 * 获取签名第二步：通过基础access_token获取jsapi_ticket
 * @param access_token
 * @returns {Promise}
 */
const getTicket = (req, access_token, source) => {
  return new Promise((resolve, reject) => {
    redisUtil.get(`${source}_JSAPI_TICKET`, function (reply) {
      if (reply) {
        console.log(`从redis中读取${source}_JSAPI_TICKET`);
        resolve(reply);
      } else {
        service.getTicket(req, {
          access_token,
          type: 'jsapi',
        }).then((body) => {
          body = JSON.parse(body);
          if (body.errcode === 0 || body.ticket) {
            console.log('从接口中获取JSAPI_TICKET');
            redisUtil.set(`${source}_JSAPI_TICKET`, body.ticket, expires);
            resolve(body.ticket);
          } else {
            reject(body);
          }
        }).catch(err => {
          reject(err);
        })
      }
    })
  });
}

module.exports = {
  getTicket,
  getBaseAccessToken
}