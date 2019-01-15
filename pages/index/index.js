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
    },
    item:{title:'录入卸货重量',mask:true},
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
    //this.setTime();
    //this.sendCode();
    //this.getLocation();
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
  },
  onShareAppMessage(res){
    if(res.from==='button'){
      return {
        title:'一起学习',
        path:'pages/index/index',
        imageUrl:'../../resource/image/location.png'
      }
    }
  },
   sendCode: function (e) {
    var that = this;
    var times = 24*60*60*1000;
    var i = setInterval(function () {
      times-=1000;
      if (times <= 0) {
        that.setData({
          color: "#ff6f10",
          disabled: false,
          getCode: "获取验证码",
        })
        clearInterval(i)
      } else {
        let hour=Math.floor(times/1000/60/60%24);
        let minute=Math.floor(times/1000/60%60);
        let second=Math.floor(times/1000%60);
        that.setData({
          getCode: "重新获取" + times + "s",
          lastTime:hour+'小时'+minute+'分钟'+second+'秒',
          color: "#999",
          disabled: true
        })
      }
    }, 1000)
  },
  cancel(){
    console.log('取消');
    this.setData({item:{mask:false}})
  },
  confirm(){
    console.log('确认');
    this.setData({item:{mask:false}})
  },
  change(e){
    let value=e.detail.value;
    this.setData({value})
  }
})
