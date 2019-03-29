// components/randomNumber/randomCode.js
import {
  getcaptchas
} from '../../utils/service';

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    captchaCodeImg: ''
  },
  onLoad() {
    this.getcaptchas();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getCaptchaCode() {
      let that = this;
      getcaptchas().then(res => {
        that.setData({
          captchaCodeImg: res.data.code
        });
        
      })
    }
  }
})