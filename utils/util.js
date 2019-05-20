//节日倒计时 time:格式 '2019/09/07 00:00:00'

function getCountDown(date) {
  let start = new Date();
  let end = new Date(date);
  let time = end.getTime() - start.getTime();
  let timeId = setInterval(function () {
    if (time < 0) {
      clearInterval(timeId);
    } else {
      let day = Math.floor(time / 1000 / 60 / 60 / 24);
      let h = Math.floor(time / 1000 / 60 / 60 % 24);
      let m = Math.floor(time / 1000 / 60 % 60);
      let s = Math.floor(time / 1000 % 60);
      let lastTime = day + '天' + hour + '小时' + minute + '分钟' + second + '秒';
      /* 此处添加DOM操作 */
      time--;
    }
  }, 1000)


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

function getDateDiff2(dateTimeStamp) {
  let current = new Date();
  let oldDate = new Date(dateTimeStamp);
  let diffValue = current.getTime() - dateTimeStamp;
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let result = '';
  if (diffValue < 0) {
    return false;
  }
  if (diffValue < minute) {
    result = '刚刚';
  } else if (diffValue < hour) {
    result = Math.floor(diffValue / minute) + '分钟前';
  } else if (diffValue < day) {
    result = Math.floor(diffValue / hour) + '小时前';
  } else {
    result = oldDate.getFullYear() + '-' + (oldDate.getMonth() + 1) + '-' + oldDate.getDate();
  }
  return result;
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



/* 本地存储 */


module.exports = {
  getDateDiff: getDateDiff,
  getDateDiff2: getDateDiff2,
  yearMonthDay: yearMonthDay,
  getCountDown:getCountDown,
  throttle:throttle
}