// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginInput:[
      {name:'账号',id:'username',value:''},
      {name:'密码',id:'password',value:'',pwdIsShow:false},
      {name:'验证码',id:'code',value:''}
    ],
    title:'密码登录'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.code = this.selectComponent("#code");//通过给组件所起的id调用组件
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.code.getCaptchaCode();
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

  }
})