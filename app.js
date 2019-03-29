//app.js
App({
  cfg: {
    API: 'http://60.190.249.111:8899',
    IMAGEBASE: 'http://res.zmxzu.com',
    CMD: 'ALI', //指令
    PAY_FORHEAD_ALIPAY_ZM: 'ZM',
    istest: false,
    testuser: 1742
  },
  errMsg:[
    {name:'',code:'100'},
    {name:'',code:''},
    {name:'',code:''}
  ],
  //静态变量
  conf: {
    /**本地保存的登录用户信息user{user,member/admin/} */
    LOCAL_USER: 'local-user',
    /**本地保存的订单*/
    LOCAL_ORDERR: "LOCAL_ORDERR",

    MAX_NUMBER: 1
  },
  clientInfo: {
    ver: 1,
    /**客户端类型0/NULL为H5,1安卓,2苹果,3微信公众号,4支付宝生活号,5钉钉,6PC版,7芝麻信用小程序*/
    cli: 7,
    token: null,
    /*生活号 */
    openid: null,
    session_key: null
  },
  userInfo: null,
  localUser: null,
  globalData: {
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    if (!this.checkLogin()) {
      wx.reLaunch({
        url:'/pages/login/login'
      })
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })


  },
  //获取用户信息网页版
  getUserInfoFull() {
    let that=this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          let APPID = 'wx0d76a67ef4e1cae4';
          let SECRET = 'ee013b72c258acd3c99ba8b6cd5a179b';

          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            data: {
              appid: APPID,
              secret: SECRET,
              js_code: res.code,
              grant_type: 'authorization_code'
            },
            success(res) {
              if (res.statusCode===200) {
                let login_info = {};
                Object.assign(login_info, {
                  openid: res.data.openid,
                });
                this.localUser=login_info;
                wx.setStorageSync(that.conf.LOCAL_USER,login_info);               
              }

            }
          })
        }
      }
    })
  },
  checkLogin() {
    //先从内存,没有再本地存储判断
    if (this.localUser) {
      return true;
    }
    let user = this.Storage.get(this.conf.LOCAL_USER);
    if (user&& user.openid) {
      return true;
    }
    return false;
  },
  apiQuery(obj, Clazz) {
    if (Clazz === 'location') {
      return new Promise((resolve, reject) => {
        let latitude = obj.latitude;
        let longitude = obj.longitude;
        let location = latitude + ',' + longitude;
        var url = 'https://apis.map.qq.com/ws/geocoder/v1/';
        wx.request({
          url: url,
          data: {
            location: location,
            key: 'RTPBZ-P3AWO-7YBWD-SE34B-JQMH5-UYBJP'
          },
          success(res) {
            if (res && res.data) {
              resolve(res.data);
            }
          }
        })
      })
    }
  },
  
  showModal(title, content, callback) {
    wx.showModal({
      title: title,
      content: content,
      success: function (res) {
        if (res.confirm) {
          callback()
        }
      }
    })
  },
  Storage: {
    /**
     * 保存对象
     * ex.this.Storage.set(this.conf.LOCAL_USER,data.data);
     * @param key
     * @param data
     * @returns {*}
     */
    set: function (key, data) {
      wx.setStorageSync({
        key: key,
        data: data
      });
    },
    /**
     * 取出对象
     * ex. let user=this.Storage.get(this.conf.LOCAL_USER);
     * @param key
     * @returns {*}
     */
    get: function (key) {
      return wx.getStorageSync(key);
    },
    /**
     * 删除对象
     * @param key
     * @returns {*}
     */
    remove: function (key) {
      wx.removeStorageSync(key);
    },
    /**
     * 取出对象后删除
     * ex. let user=this.Storage.getAndRemove(this.conf.LOCAL_USER);
     * @param key
     * @returns {*}
     */
    getAndRemove: function (key) {
      var data = this.get(key);
      this.remove(key);
      return data;
    },
    /**
     * 清空
     */
    clean: function () {
      wx.clearStorageSync();
    }
  },
  wxApi(url,data,header,metho){
    let that=this;
    return new Promise((resolve,reject)=>{
      wx.request({
        url:that.cfg.API+url,
        data:data,
        success(res){
          if(res.data.code==200){
            resolve(res.data);
          }else{

          }
        }
      });
    });

  },
  wxLogin(){
    let that=this;
    wx.login({
      success(res){}
    })
  },
  
  //替换富文本中的img图片增加图床
  replaceSrc(str) {
    if (!str)
      return null;
    let imagebase = this.cfg.IMGBASE;
    let reg = /(src=['"])([^'"]*)(['"])/g;
    let ret = str.replace(reg, function (src) {
      if (src.indexOf('http') === -1 || src.indexOf('https') === -1) {
        return src.replace(reg, '$1' + imagebase + '$2$3');
      } else {
        return src;
      }
    });
    return ret;
  },
})