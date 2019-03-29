// pages/user/mine.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    mineInfo:[
      {name:'我的订单',action:'order',path:'/pages/user/order/order'},
      {name:'充值中心',action:'fee',path:'/pages/user/fee/fee'}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    wx.getSetting({
      success(res){
        if(res.authSetting['scope.userInfo']){
          wx.getUserInfo({
            success(res){
              that.setData({userInfo:res.userInfo});
              console.log(res);
            }
          })
        }
        wx.getLocation({
          success: function (res) {
            console.log(res);
            let latitude = res.latitude;
            let longitude = res.longitude;
            let obj = {};
            Object.assign(obj, { latitude, longitude });
            app.apiQuery(obj, 'location').then(res => {
              console.log(res);
            })
          },
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //用户列表栏单击

  switchTap(e){
    let item=e.currentTarget.dataset.item;
    switch(item.action){
      case 'order':
      wx.navigateTo({
        url:"/pages/user/order/order"
      });
      break;

      default:
        wx.navigateTo({
          url:"/pages/user/mine/mine"
        });
        break;
    }
  }
})