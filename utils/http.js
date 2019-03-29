const config = require('./config');
const env = require('./env');
import regeneratorRuntime from './runtime.js'
const app = getApp();
/* 
封装同意接口，方便调取
*/

function httpRequest(url, method, param) {
    url = config.baseUrl + url;
    console.log(url);
    let rdata = requestData();
    if (param) {
        Object.keys(param).reduce((map, key) => {
            if (typeof param[key] != 'undefined') {
                map[key] = param[key];
            }
        }, {})
    }
    //Object.assign(rdata, param);

    return new Promise(function (resolve, reject) {
        wx.request({
            method: method,
            url:url,
            data: param,
            success(res) {
                resolve(res);
            },
            fail(err) {
                reject(err);
            }
        })
    });
}

function httpGet(url,param) {
     return httpRequest(url, 'Get', param);
}

function httpPost(url,param) {
    return httpRequest(url, 'POST', param);
}

const wxRequest = async (url, data = {}, method, hideLoading) => {
    //默认带上openid
    Object.assign(data, {
        openid: app.globalData.openid
      });
      let header = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      //默认使用POST方式
      method = method || 'POST';
      // hideLoading可以控制是否显示加载状态
      if (!hideLoading) {
        wx.showLoading({
          title: '加载中...',
        })
      };
      let res = await new Promise((resolve, reject) => {
        wx.request({
          url: url,
          method: method,
          data: data,
          header: header,
          success: (res) => {
            if (res && res.data && res.data.status == 200) {
              resolve(res.data);
            } else {
              reject(res);
            }
          },
          fail: (err) => {
            reject(err);
          },
          complete: () => {
            wx.hideLoading();
          }
        });
      }).catch((e)=>{return e.data});
      return res;
  }
/* 默认传参 */
function requestData() {
    try {
        let user = config.getUserInfo();
        let userId = (user && user.userId) ? user.userId : '';
        let data = {
            userId,
            version: env.env.version
        };
        return data;
    } catch (err) {
        console.err(err);
    }
}
module.exports = {
    httpGet,
    httpPost
}