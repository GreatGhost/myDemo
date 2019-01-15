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


function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }

  let _lastTime = null

  // 返回新的函数
  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)   //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}

// 返回 开始到结束 2018 2019 2020
function rangeYear(start,end){
  var arr=[];
  for(let i=start;i<end;i++){
    arr.push(i);
  }
  return arr;
}

//解决重复单击 添加延迟

function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }

  let _lastTime = null

  // 返回新的函数
  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)   //将this和参数传给原函数
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


module.exports = {
  formatTime: formatTime,
  throttle: throttle,
  onShareAppMessage:onShareAppMessage
}
