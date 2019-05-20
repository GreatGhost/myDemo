//index.js
//获取应用实例
const util = require('../../utils/util.js')
const app = getApp();
const service =require("../../utils/service")

var WxParse = require('../../wxParse/wxParse.js');

let goodsList = [
  {actEndTime: '2019/05/01 10:00:43'},
  {actEndTime: '2019/04/01 11:00:00'},
  {actEndTime: '2018/06/01 12:45:56'},
  {actEndTime: '2018/07/01 15:00:23'},
  {actEndTime: '2018/05/23 17:00:22'},
  {actEndTime: '2018/05/14 19:00:44'},
  {actEndTime: '2018/05/21 21:00:34'},
  {actEndTime: '2018/06/17 09:00:37'},
  {actEndTime: '2018/03/21 05:00:59'},
  {actEndTime: '2018/04/19 07:00:48'},
  {actEndTime: '2018/04/28 03:00:11'}
];


Page({
  data: {
    swiperImages: [{
        url: '../../resource/image/swiper1.jpg'
      },
      {
        url: '../../resource/image/swiper2.jpg'
      },
      {
        url: '../../resource/image/swiper3.jpg'
      },
    ],
    accountName: "李宗盛",
    account: [
        { "name": "李小冉" },
        { "name": "李冰" },
        { "name": "李浩然" },
        { "name": "李宗盛" },
    ],
    countDownList: [],
    actEndTimeList: [],
    img : [
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531825645104&di=0cfede1dd354581e22385b1862375a6a&imgtype=0&src=http%3A%2F%2Fpic.qiantucdn.com%2F58pic%2F13%2F71%2F35%2F24k58PICSiB_1024.jpg',
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531825645032&di=826b8cfa4f7c5a8765d5c2156913dcbb&imgtype=0&src=http%3A%2F%2Fimg382.ph.126.net%2Fp4dMCiiHoUGxf2N0VLspkg%3D%3D%2F37436171903673954.jpg',
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531825645104&di=2c9e1223e705806967640495e4bac26b&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0147a458783b1ba801219c77f9ec2e.jpg%402o.jpg',
      'http://t1.hxzdhn.com/uploads/tu/bj/slt/yezpvg0x23b.jpg',
      'http://t1.hxzdhn.com/uploads/tu/201807/9999/95ed87388b.jpg',
      'http://t1.hxzdhn.com/uploads/tu/201807/9999/99495c4cf4.jpg',
      'http://t1.hxzdhn.com/uploads/tu/201807/9999/f867c97e25.jpg',
      'http://t1.hxzdhn.com/uploads/tu/201807/9999/2cc7ab0bc5.jpg',
      'http://t1.hxzdhn.com/uploads/tu/201807/9999/2f4435caaf.jpg',
      'http://t1.hxzdhn.com/uploads/tu/201807/9999/ce76898540.jpg',
      'http://t1.hxzdhn.com/uploads/tu/201807/9999/a2ccc41e47.jpg',
      'http://t2.hddhhn.com/uploads/tu/201707/521/83.jpg',
      'http://t2.hddhhn.com/uploads/tu/20150700/2hndrjt0jxe.jpg',
      'http://t2.hddhhn.com/uploads/tu/20150700/2hndrjt0jxe.jpg',
    ],
  },


  /**
   * 页面加载事件
   * @method onLoad
   * @param options
   * 
   */
  onLoad: function (options) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              // console.log(res.userInfo)
              that.setData({
                nickName: res.userInfo.nickName, //昵称
                avatarUrl: res.userInfo.avatarUrl //头像
              })
            }
          })
        } else {

        }
      }
    })
    this.showTxtImg();
    service.cityGuess().then(res=>{
      console.log(res);
    });
    
    let endTimeList = [];
    // 将活动的结束时间参数提成一个单独的数组，方便操作
    goodsList.forEach(o => {endTimeList.push(o.actEndTime)})
    this.setData({ actEndTimeList: endTimeList});
    // 执行倒计时函数
    this.countDown();
  },
  onShow(){
    let useRichText=wx.canIUse('rich-text')
    console.log(useRichText);
    this.setData({
      useRichText
    })
  },
  timeFormat(param){//小于10的格式化函数
    return param < 10 ? '0' + param : param; 
  },
  countDown(){//倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endTimeList = this.data.actEndTimeList;
    let countDownArr = [];

    // 对结束时间进行处理渲染到页面
    endTimeList.forEach(o => {
      let endTime = new Date(o).getTime();
      let obj = null;
      // 如果活动未结束，对时间进行处理
      if (endTime - newTime > 0){
        let time = (endTime - newTime) / 1000;
        // 获取天、时、分、秒
        let day = parseInt(time / (60 * 60 * 24));
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        obj = {
          day: this.timeFormat(day),
          hou: this.timeFormat(hou),
          min: this.timeFormat(min),
          sec: this.timeFormat(sec)
        }
      }else{//活动已结束，全部设置为'00'
        obj = {
          day: '00',
          hou: '00',
          min: '00',
          sec: '00'
        }
      }
      countDownArr.push(obj);
    })
    console.log(countDownArr);
    // 渲染，然后每隔一秒执行一次倒计时函数
    this.setData({ countDownList: countDownArr})
    setTimeout(this.countDown,1000);
  },

  redclick(){
    console.log('red')
  },
  yellowclick(){
    console.log('yellow')
  },
  blueclick(){
    console.log('blue')
  },
  onGotUserInfo(e) {
    console.log(e.detail.errMsg);
    console.log(e.detail.userInfo);
    console.log(e.detail.rawData);
  },
onReady: function (e) {
    this.dialog = this.selectComponent("#dialog");//通过给组件所起的id调用组件
},
toggle: function (e) {
    this.dialog.toggle()
},    //给头部添加的调出下拉框的事件
switchAccount: function (options) {
    this.setData({
        accountName: options.detail
   })
}, //组件内部

showTxtImg(){
  let productExtTxt='<img src="http://img.baidu.com/hi/jx2/j_0003.gif"/>';
  let productExtTxt2='<p><br/></p><p><img src="http://img.baidu.com/hi/jx2/j_0081.gif"/><img src="http://img.baidu.com/hi/jx2/j_0076.gif"/></p><p>测<span style="background-color: rgb(255, 0, 0);">试富文本编辑器转微信小程序功能</span></p><p><span style="border: 1px solid rgb(0, 0, 0);">测试富文本编辑器转微信小程序功能1</span></p><p><span style="color: rgb(0, 176, 240);">测试富文本编辑器转微信小程序功能2</span></p><p><span style="text-decoration: underline;">测试富文本编辑器转微信小程序功能3</span></p><p>测试富文本编辑器转微信小程序功能4</p><p><strong>测试富文本编辑器转微信小程序功能5</strong><br/></p>'
  let rich_productExtTxt_txt = app.replaceSrc(productExtTxt);
  let that=this;
/*** WxParse.wxParse(bindName , type, data, target,imagePadding)
* 1.bindName绑定的数据名(必填)
* 2.type可以为html或者md(必填)
* 3.data为传入的具体数据(必填)
* 4.target为Page对象,一般为this(必填)
* 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)*/ 
var temp = WxParse.wxParse('article', 'html',productExtTxt2, that, 5);
  that.setData({nodes:productExtTxt2});
  },
  getLogin(){
    wx.reLaunch({
      url: '/pages/login/login',
    })
  }
})