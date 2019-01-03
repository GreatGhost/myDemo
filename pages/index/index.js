//index.js
//获取应用实例
const util=require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    start:'',
    end:'',
    switch:false,
    footer:{
      msg:'1',
      arr:[1,2,3],
      
    }
  },
  map(){
    wx.navigateTo({
      url:'/pages/map/map'
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getPhp(){
    wx.connectSocket({
      url: '../test.php'
    })
  },
  switch1Change(e){
    var value=e.detail.value;
    console.log(value);
  },
  setCanvas(){
    const context = wx.createCanvasContext('firstCanvas')

    context.setStrokeStyle('#00ff00')
    context.setLineWidth(5)
    context.rect(0, 0, 200, 200)
    context.stroke()
    context.setStrokeStyle('#ff0000')
    context.setLineWidth(2)
    context.moveTo(160, 100)
    context.arc(100, 100, 60, 0, 2 * Math.PI, true)
    context.moveTo(140, 100)
    context.arc(100, 100, 40, 0, Math.PI, false)
    context.moveTo(85, 80)
    context.arc(80, 80, 5, 0, 2 * Math.PI, true)
    context.moveTo(125, 80)
    context.arc(120, 80, 5, 0, 2 * Math.PI, true)
    context.stroke()
    context.draw()
  },
  setTime(){
    var date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let start = year + '-' + month + '-' + day;
    let end = (year + 3) + "-" + 12 + '-' + 30;
    this.setData({start,end});
    console.log(start+end);
  },
  onLoad: function () {
    this.getPhp();
    this.setTime();
    this.setCanvas();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.getLocation();
  },
  onShow(){
    console.log(this.route)
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  tapName(event){
    console.log(event);
    let arr=event.currentTarget.dataset.value;
    console.log(typeof arr);
  },
  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  getSail(){
    wx.navigateTo({
      url:"/pages/sailing/sailing"
    })
  },
  getFriend(){
    wx.navigateTo({
      url:"/pages/addFriend/addFriend"
    })
  },
  getFriendDetail(){
    wx.navigateTo({
      url:'/pages/sailDetail/sailDetail',
    })
  },
  tap: util.throttle(function (e) {
    console.log(this);
    wx.navigateTo({
      url: '/pages/sailDetail/sailDetail',
    })
  }),
  tap2(){
    wx.navigateTo({
      url: '/pages/sailDetail/sailDetail',
    })
  },
  getLocation(){
    let that=this;
    wx.getLocation({
      success: function(res) {
        let latitude = res.latitude; // 纬度
        let longitude = res.longitude; // 经度
        let obj={};
        Object.assign(obj, { latitude, longitude});

        app.apiQuery(obj,'location').then(res=>{
          let result=res.result;
          let province = result.address_component.province;
          let city = result.address_component.city;
          let district = result.address_component.district;
          let address = province + city + district;
          that.setData({
            address: address
          })
        })
      },
    })
  }
})
