//app.js
const api = require('./utils/api');
const regeneratorRuntime = require('./utils/runtime')
App({
  cfg: {
    API: 'http://60.190.249.111:8899',
    IMAGEBASE: 'http://res.zmxzu.com',
    CMD: 'ALI', //指令
    PAY_FORHEAD_ALIPAY_ZM: 'ZM',
    istest: false,
    testuser: 1742
  },
  errMsg: [{
      name: '',
      code: '100'
    },
    {
      name: '',
      code: ''
    },
    {
      name: '',
      code: ''
    }
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
  globalData: {},
  onLaunch: function () {
    // 登录

  },
  checkLogin() {
    //先从内存,没有再本地存储判断
    if (this.localUser) {
      return true;
    }
    let user = this.Storage.get(this.conf.LOCAL_USER);
    if (user && user.openid) {
      return true;
    }
    return false;
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
  // 初始化
  async init() {
    await api.showLoading(); // 显示loading
    await this.getList(); // 请求数据
    await api.hideLoading(); // 等待请求数据成功后，隐藏loading
  },

  // 获取列表
  getList() {
    let that = this;
    return new Promise((resolve, reject) => {
      api.getData('https://elm.cangdu.org/v1/cities', {
          type: 'guess'
        }).then((res) => {
          console.log(res)
          resolve()
        })
        .catch((err) => {
          //console.error(err)
          reject(err)
        })
    })
  },

})