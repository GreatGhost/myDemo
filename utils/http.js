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
            return map;
        }, {})
    }
    //Object.assign(rdata, param);
    param={...param};
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
        //console.err(err);
    }
}
module.exports = {
    httpGet,
    httpPost
}