const config = require('./config.js');

/* time format ---------------------------------------- */

/* 
// 比如需要这样的格式 yyyy-MM-dd hh:mm:ss
var date = new Date(1398250549490);
Y = date.getFullYear() + '-';
M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
D = date.getDate() + ' ';
h = date.getHours() + ':';
m = date.getMinutes() + ':';
s = date.getSeconds(); 
console.log(Y+M+D+h+m+s); //呀麻碟
// 输出结果：2014-04-23 18:55:49

new Date("September 16,2016 14:15:05");
new Date("September 16,2016");
new Date("2016/09/16 14:15:05");
new Date("2016/09/16");
new Date(2016,8,16,14,15,5); // 月份从0～11
new Date(2016,8,16);
new Date(1474006780);


*/
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function getMonthDate(year,month){
  year=parseInt(year,10);
  month=parseInt(month,10)+1;
  let time=new Date(year,month,0);
  return time.getDate();
}
//获取验证码
function getCode(){
  let count=60;
  let timeId=setInterval(function(){
    if(count<0){
      clearInterval(timeId)
    }else{
      let str=count+'s后重新获取验证码';
      let dom=docuement.querySelector('.code');
      dom.innerHTML=str;
      count--;
    }
  },1000)
}

//节日倒计时 time:格式 '2019/09/07 00:00:00'

function getCountDown(date){
  let start=new Date();
  let end=new Date(date);
  let time =end.getTime()-start.getTime();
  let timeId=setInterval(function(){
    if(time<0){
      clearInterval(timeId);
    }else{   
      let day=Math.floor(time/1000/60/60/24);
      let h=Math.floor(time/1000/60/60%24);
      let m=Math.floor(time/1000/60%60);
      let s=Math.floor(time/1000%60);
      let lastTime= day + '天' + hour + '小时' + minute + '分钟' + second + '秒';
      /* 此处添加DOM操作 */
      time--;
    }
  },1000)


}

/* 鼠标单击事件优化------------------------------------------------ */

function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }

  let _lastTime = null

  // 返回新的函数
  return function () {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments) //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}

function onShareAppMessage(title, path, callback, imageUrl) {
  //设置一个默认分享背景图片
  let defaultImageUrl = '../../images/share.jpg';
  return {
    title: title,
    path: path,
    imageUrl: imageUrl || defaultImageUrl,
    success(res) {
      console.log("转发成功！");
      if (!res.shareTickets) {
        //分享到个人
        api.shareFriend().then(() => {
          console.warn("shareFriendSuccess!");
          //执行转发成功以后的回调函数
          callback && callback();
        });
      } else {
        //分享到群
        let st = res.shareTickets[0];
        wx.getShareInfo({
          shareTicket: st,
          success(res) {
            let iv = res.iv
            let encryptedData = res.encryptedData;
            api.groupShare(encryptedData, iv).then(() => {
              console.warn("groupShareSuccess!");
              //执行转发成功以后的回调函数
              callback && callback();
            });
          }
        });
      }
    },
    fail: function (res) {
      console.log("转发失败！");
    }
  };
}

/* 全局控制注释-厉害 */
function logger() {
  if (config.env.logger) {
    return console;
  }
  return {
    log: () => {},
    err: () => {}
  };
}

/* ---------------------- array-operation */
/* 创建如[2016,2017,2018,2019] [1,2,3,4,5]等数组 ，用于三级联动等操作*/
function rangeArray(from, to) {
  let arr = [];
  for (let i = from; i < to; i++) {
    arr.push(i);
  }
  return arr;
}


/* 数组去重 indexOf includes  */
function unique1(array) {

  var n = []; //一个新的临时数组

  //遍历当前数组

  for (var i = 0; i < array.length; i++) {

    //如果当前数组的第i已经保存进了临时数组，那么跳过，

    //否则把当前项push到临时数组里面

    if (n.indexOf(array[i]) == -1) n.push(array[i]);

  }

  return n;

}


// 返回 开始到结束 2018 2019 2020
function rangeYear(start, end) {
  var arr = [];
  for (let i = start; i < end; i++) {
    arr.push(i);
  }
  return arr;
}



/* 异步的处理方案 异步同步转化 async await  小程序好像不支持。。。*/
//调用方式 timeout().then((res)=>{console.log(res)})
/* async function timeout(){
  return 'hello world'
}
//timeout2(false).then((res)=>{console.log(res)}).catch(err=>{console.log(err)});
async function timeout2(flag){
  if(flag){
    return 'hello world'
  }else{
    throw 'this is an error'
  }
}
//引入await await 等待之意
async function timeout3() {
  let result = await doubleAfter2seconds(30);
  console.log(result);
  let first = await doubleAfter2seconds(30);
  let second = await doubleAfter2seconds(50);
  let third = await doubleAfter2seconds(30);
  console.log(first + second + third);
}
 */



// 2s 之后返回双倍的值
function doubleAfter2seconds(num) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(2 * num)
        }, 2000);
    } )
}


/*手撸一个Promise */
function MyPromise(executor){
  let self = this
  self.value = undefined
  self.reason = undefined
  // 默认promise状态是pending
  self.status = 'pending'
  // 用来保存then 方法中，第一个参数
  self.onResolvedCallbacks = []
  // 用来保存then 方法中，第二个参数
  self.onRejectedCallbacks = []
  function resolve(value){
    if(self.status === 'pending'){ //保证状态一旦变更，不能再次修改
      self.value = value
      self.status = 'resolved' // 成功状态
      self.onResolvedCallbacks.forEach(fn => {
        fn()
      })
    }
  }
  function reject(reason){
    if(self.status === 'pending'){
      self.reason = reason
      self.status = 'rejected' //失败状态
      self.onRejectedCallbacks.forEach(fn => {
        fn()
      })
    }
  }
  executor(resolve, reject) // 因为会立即执行这个执行器函数
}

MyPromise.prototype.then = function(onFulfilled, onRejected){
  let self = this
  if(self.status === 'resolved'){
    onFulfilled(self.value)
  }
  if(self.status === 'rejected'){
    onRejected(self.reason)
  }
  if(self.status === 'pending'){
  // 订阅
    self.onResolvedCallbacks.push(function(){
      onFulfilled(self.value)
    })
    self.onRejectedCallbacks.push(function(){
      onRejected(self.reason)
    })
  }
}




module.exports = {
  formatTime: formatTime,
  throttle: throttle,
  onShareAppMessage: onShareAppMessage,
  logger: logger,
  rangeArray: rangeArray,
  rangeYear:rangeYear,
  unique1:unique1

}


//用户授权


module.exports = {
  HttpRequst: HttpRequst
}
// const baseUrl = "https://hi.xxx.com/cxyTicket/";//测试环境
const baseUrl = "https://xxx.com/hospital/"; //正式环境

//sessionChoose 1是GET方法  2是Post方法
//ask是是否要进行询问授权，true为要，false为不要
//sessionChoose为1,2,所以paramSession下标为0的则为空
function HttpRequst(loading, url, sessionChoose, params, method, ask, callBack) {
  params = Object.assign({}, { "thirdSession":wx.getStorageSync("sessionId")}, params);//由于这次的方法是sessionId当参数传入，所以不像第一次写的一样放于请求头
  if (loading == true) {
      wx.showToast({
          title: '数据加载中',
          icon: 'loading'
      })
  }
  let paramSession = [{},{'content-type': 'application/json' },{ 'content-type': 'application/x-www-form-urlencoded'}]
  wx.request({
      url: baseUrl + url,
      data: params,
      dataType: "json",
      header: paramSession[sessionChoose],
      method: method,
      success: function (res) {
          if (loading == true) {
              wx.hideToast(); //隐藏提示框
          }
          if (res.data.object.LoginOutTimeState) {//判断过期的话重新获取
              console.log(res.data.object.LoginOutTimeState);
              console.log("32243已经超时了进来了");
              wxLogin(loading, url, sessionChoose, params, method, ask, callBack);
          }
          if (wx.getStorageSync("sessionId")){
              if (res.data.object.InfoState ==0){
                  getUserInfo(loading, url, sessionChoose, params, method, ask, callBack);//判断用户是否授权
              }
          }
          callBack(res.data);
      },
      fail:function(res){
          console.log(res);
          wx.showModal({
              title: '提示',
              content: '请求失败！由于网络请求时间过长或网络无法连接的原因，请确认网络畅通，点击"重新请求"进行再次请求！',
              confirmText: "重新请求",
              success: function (res) {
                  if (res.confirm) {
                      HttpRequst(loading, url, sessionChoose, params, method, ask, callBack);//再次进行请求
                  } else if (res.cancel) {
                      console.log('用户点击取消');
                  }
              }
          })
      },
      complete: function () {
          if (loading == true) {
              wx.hideToast(); //隐藏提示框
          }
      }
  })
}

function wxLogin(loading, url, sessionChoose, params, method, ask, callBack) {
  wx.login({
      success: function (res) {
          var code = res.code; //得到code
          HttpRequst(true, "wx/SP/wxlogin.do", 2, {
              "code": code
          }, "GET", true, function (res) {
              // console.log(res);
              if (res.code == 0) {
                  wx.setStorageSync('sessionId', res.object.thirdSession);
                  console.log(res.object.thirdSession);
                  params.thirdSession = res.object.thirdSession;
                  if (res.object.InfoState == 0) {
                      console.log("这里没有用户信息");
                      console.log(res.encryptedData);
                      console.log(res.iv);
                      getUserInfo(loading, url, sessionChoose, params, method, ask, callBack);//判断用户是否授权
                  } else {
                      HttpRequst(loading, url, sessionChoose, params, method, ask, callBack);
                  }
              }
          })
      }
  })
}

// 判断用户是否授权
function getUserInfo(loading, url, sessionChoose, params, method, ask, callBack){
  wx.getUserInfo({
      success: function (res) {
          HttpRequst(true, "wx/SP/saveInfo.do", 2, {
              "encryptedData": res.encryptedData,
              "iv": res.iv,
              "thirdSession": wx.getStorageSync("sessionId")
          }, "POST", false, function (res) {
              console.log("请求成功");
              wx.setStorageSync('avatarUrl', res.object.avatarUrl);
              wx.setStorageSync('nickName', res.object.nickName);
              HttpRequst(loading, url, sessionChoose, params, method, ask, callBack);
          })
      },
      fail: function (res) {
          console.log("我还没有授权");
          wx.navigateTo({
              url: '../allow_detail/allow_detail'
          })
      }
  })
}

/*订单在多久之前发布 */
/* new Date(参数的传入) */

/* 
　　new Date("Jun 2,2017 12:00:00"); //Fri Jun 02 2017 12:00:00 GMT+0800 (中国标准时间)

　　new Date("Jun 2,2017"); //Fri Jun 02 2017 00:00:00 GMT+0800 (中国标准时间)

　　new Date(2017,5,2,12,0,0); //Fri Jun 02 2017 12:00:00 GMT+0800 (中国标准时间)

　　new Date(2017,5,2); //Fri Jun 02 2017 00:00:00 GMT+0800 (中国标准时间)

　　new Date(1496376000000); //Fri Jun 02 2017 12:00:00 GMT+0800 (中国标准时间)
    以上输出的都是2017年6月2号的时间
*/

function getDateDiff(dateTimeStamp) {
  var result = '';
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();
  var diffValue = now - dateTimeStamp;
  if (diffValue < 0) {
    return '错误信息';
  }
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  if (monthC >= 1) {
    result = "" + parseInt(monthC) + "月前";
  } else if (weekC >= 1) {
    result = "" + parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else
    result = "刚刚";
  return result;
}

function yyyyMMddhhmmssToDate(timestr) {
  if (timestr.length >= 8) {
    try {
      let year = timestr.substr(0, 4)
      let month = timestr.substr(4, 2)
      month = Number(month) - 1
      let date = timestr.substr(6, 2)
      let hour = 0
      let min = 0
      let sec = 0
      if (timestr.length >= 10) {
        hour = timestr.substr(8, 2)
      }
      if (timestr.length >= 12) {
        min = timestr.substr(10, 2)
      }
      if (timestr.length >= 14) {
        sec = timestr.substr(12, 2)
      }

      return new Date(year, month, date, hour, min, sec)
    } catch (err) {
      require('./utility').logger.error(err)
    }
  }
  return undefined
}

function getRequestFormatedDateString(date, fmt) {
  if (!date || !fmt) {
    return ''
  }
  Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));

    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }

  return date.Format(fmt)
}

function yearMonthDay() {
  let time = new Date();
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  let day = time.getDate();
  let timeStr = '';
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;
  timeStr = year + '-' + month + '-' + day;
  return timeStr;
}

function drawImage(ctx, url) {
  wx.downloadFile({
    url: url,
    success(res) {
      ctx.drawImage(res.temFilePath, 0, 0, 100, 100);
      ctx.draw();
    }
  })
}


/* 本地存储 */


module.exports = {
  getDateDiff: getDateDiff,
  yyyyMMddhhmmssToDate: yyyyMMddhhmmssToDate,
  getRequestFormatedDateString: getRequestFormatedDateString,
  yearMonthDay: yearMonthDay,
  drawImage: drawImage
}