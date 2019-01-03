// pages/sailing/sailing.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      list:[
        {contact_person:"吴节操",tag:'企业认证',type:1,name:'杭州新船帮科技有限公司',addr:"浙江杭州市拱墅区祥园路88号K座",select:true},
        {contact_person:"王大治",tag:'个人认证',type:2,addr:"浙江杭州市拱墅区祥园路88号K座",select:false},
        {contact_person:"李速递",tag:'个体户认证',type:2,addr:"浙江杭州市拱墅区祥园路88号K座",select:false},
        {contact_person:"朱吉明",tag:'未认证',type:2,addr:"浙江杭州市拱墅区祥园路88号K座",select:false},
      ],
      selected:[],
      choose:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})