const time = require('../../utils/time.js')
const array = require('../../utils/array.js')
const localStorage = require('../../utils/LocalStorage')
const goodsOwner = require('../../utils/goodsOwner')
const addr = require('../../utils/addr')
const person = require('../../utils/person')
const http = require('../../utils/httpRequest')
const config = require('../../utils/config')
const urlUtil = require('../../utils/url')
const goodsPicConfigFile = urlUtil.host + 'ftphome/config/goodsPicConfig.json';
const newApi = require('../../utils/newApi')
const util = require('../../utils/utility');


Page({
  data: {
    start: [],//起始地
    end: [],//目的地
    imgList: [],//默认图片池
    infos: [{
        name: '装货日期',
        id: 'time',
        placeholder: '请选择装日期',
        must: true,
        type: 'upload_start_date'
      },
      {
        name: '货物名字',
        id: 'name',
        placeholder: '请输入货物名称',
        must: true,
        type: 'goods_name'
      },
      {
        name: '发货量',
        id: 'count',
        placeholder: '请输入货物重量',
        inputType: 'number',
        must: true,
        type: 'delivery_mount'
      },
      {
        name: '联系人',
        id: 'contact_person',
        placeholder: '请输入联系人',
        inputType: 'text',
        maxLength: 11,
        value: '',
        must: true,
        type: 'contact_person'
      },
      {
        name: '联系方式',
        id: 'contact',
        placeholder: '请输入联系方式',
        inputType: 'number',
        maxLength: 11,
        value: '',
        must: true,
        type: 'contact_phone'
      },
      {
        name: '船只吨位(吨)',
        id: 'shipWeight',
        type: 'cargo_req'
      },
      {
        name: '运费结算',
        id: 'fee',
        placeholder: '选填',
        showDetail: true,
        type: 'freight_show'
      },
      {
        name: '备注',
        id: 'memo',
        placeholder: '对船主我还有一些话要说',
        maxLength: 100,
        type: 'order_remark'
      }
    ],
    acceptList: [{
        name: '所有人',
        info: '公开展示货盘',
        select: false
      },
      {
        name: '航运圈好友',
        info: '指定航运圈好友',
        select: false
      }
    ],
    carrier: [], //承运人
    images: [],
    timePickerIndex: [],
    timePickerValue: [],
    actionButtonDisabled: false,
    //detail:{},//编辑货单存储
    orderId: '', //订单id
    status: true,
    
  },

  isActionEnabled: function () {
    let weightInfo = this.data.infos.find(tmp => tmp.id === 'shipWeight')
    if (Number(weightInfo.max) < Number(weightInfo.min)) {
      return false
    }

    return this.data.start.length > 0 &&
      this.data.end.length > 0 &&
      this.data.date &&
      this.data.infos.find(tmp => tmp.id === 'name').info &&
      this.data.infos.find(tmp => tmp.id === 'count').value
  },

  tapItem: function (e) {
    if (!e.currentTarget.id) {
      return
    }
    switch (e.currentTarget.id) {
      case 'name':
        this.getGoodsName()
        break;
      case 'fee':
        this.finishFeeInfo()
        break;
      case 'memo':
        this.getMemo();
        break;
      case 'history':
        this.getHistoryGoods();
        break;

      default:
        break;
    }
  },
  checkCommit: function () {
    if (!this.data.detail && this.data.start.length <= 0) {
      wx.showToast({
        title: '起始地不能为空',
        icon: 'none'
      })
      return false;
    }
    if (!this.data.detail && this.data.end.length <= 0) {
      wx.showToast({
        title: '目的地不能为空',
        icon: 'none'
      })
      return false;
    }
    for (var i = 0; i < this.data.infos.length; i++) {
      let item = this.data.infos[i]
      if (item.must && !item.value) {
        if (item.id === 'shipWeight' && item.min && item.max && item.min.length > 0 && item.max.length > 0) {
          continue;
        }
        wx.showToast({
          title: item.name + '不能为空',
          icon: 'none'
        });
        return false;
      }
    }
    if (this.data.infos.find(tmp => tmp.id === 'contact').value.length != 11) {
      wx.showToast({
        title: '联系电话要11位',
        icon: 'none'
      })
      return false
    }
    if (this.data.infos.find(tmp => tmp.id === 'contact_person').value.length <= 0) {
      wx.showToast({
        title: '联系人信息不能为空',
        icon: 'none'
      })
      return false
    }
    let weightInfo = this.data.infos.find(tmp => tmp.id === 'shipWeight')
    if (Number(weightInfo.max) < Number(weightInfo.min)) {
      wx.showToast({
        title: '最大吨位要大于最小吨位',
        icon: 'none'
      })
      return false
    }
    if (this.data.acceptList.filter(tmp => tmp.select === true).length <= 0) {
      wx.showToast({
        title: "请选择承运人",
        icon: 'none'
      })
      return false;
    }
    if (this.data.acceptList.find(tmp => tmp.select === true).name === '航运圈好友') {
      if (this.data.carrier.length <= 0) {
        wx.showToast({
          title: '请指定航运圈好友',
          icon: 'none'
        });
        return false;
      }
    }
    return true
  },
  /* 发布货盘 */
  addGoods: function (e) {
    newApi.saveFormId(e.detail.formId)
    /* 添加默认图片 */
    if (!this.checkCommit()) {
      return
    }
    let obj = this;
    let images = this.data.images;
    let toUpload = images.filter(item => item.url === '');
    if (toUpload.length > 0) {
      let obj = this;
      http.uploadFile(toUpload[0].path).then(url => {
        toUpload[0].url = url;
        obj.addGoods();
      })
      return
    }
    /* 默认图片添加池 */

    let imgList = this.data.imgList.concat();


    var defaultImg = '';
    var goodName = this.data.infos.find(tmp => tmp.id === 'name').info.name;
    var list = imgList.filter(function (item) {
      return item.name === goodName;
    });
    if (images.length === 0 && list.length != 0) {
      let ftphome = 'ftphome/config';
      let img = '';
      var materialName = this.data.infos.find(tmp => tmp.id === 'name').info.name;
      img = imgList.find(tmp => tmp.name === materialName).png;
      defaultImg = urlUtil.host + ftphome + '/' + img;
    }
    if (this.data.orderId) {
      let time1 = obj.data.infos[0].value.split('+');
      var uploadTime = time1[0].replace(/[\-\s]+/g, '');
      var uploadOffset = time1[1] ? time1[1] : 0;
    }

    let parameter = {
      start_dock_pro_code: this.data.start[0].code,
      start_dock_pro_name: this.data.start[0].name,
      start_dock_city_code: this.data.start[1].code,
      start_dock_city_name: this.data.start[1].name,
      start_dock_area_code: this.data.start[2].code,
      start_dock_area_name: this.data.start[2].name === '全部' ? '' : this.data.start[2].name,
      start_dock_id: this.data.start[3].id,
      start_dock_name: this.data.start[3].name

        ,
      end_dock_pro_code: this.data.end[0].code,
      end_dock_pro_name: this.data.end[0].name,
      end_dock_city_code: this.data.end[1].code,
      end_dock_city_name: this.data.end[1].name,
      end_dock_area_code: this.data.end[2].code,
      end_dock_area_name: this.data.end[2].name === '全部' ? '' : this.data.end[2].name,
      end_dock_id: this.data.end[3].id,
      end_dock_name: this.data.end[3].name

        ,
      upload_start_date: this.data.orderId ? uploadTime : time.getRequestFormatedDateString(this.data.date, 'yyyyMMdd'),
      upload_handle_cycle: this.data.orderId ? uploadOffset : this.data.offset //发货延迟？//confirmed

        ,
      goods_name: this.data.infos.find(tmp => tmp.id === 'name').info.name ? this.data.infos.find(tmp => tmp.id === 'name').info.name : '',
      delivery_mount: this.data.infos.find(tmp => tmp.id === 'count').value ? this.data.infos.find(tmp => tmp.id === 'count').value : '',
      contact_person: this.data.infos.find(tmp => tmp.id === 'contact_person').value ? this.data.infos.find(tmp => tmp.id === 'contact_person').value : '',
      contact_phone: this.data.infos.find(tmp => tmp.id === 'contact').value ? this.data.infos.find(tmp => tmp.id === 'contact').value : '',
      cargo_req_min: this.data.infos.find(tmp => tmp.id === 'shipWeight').min ? this.data.infos.find(tmp => tmp.id === 'shipWeight').min : '',
      cargo_req_max: this.data.infos.find(tmp => tmp.id === 'shipWeight').max ? this.data.infos.find(tmp => tmp.id === 'shipWeight').max : '',
      order_remark: this.data.infos.find(tmp => tmp.id === 'memo').value ? this.data.infos.find(tmp => tmp.id === 'memo').value : ''

        ,
      goods_pic_one: this.data.images[0] ? this.data.images[0].url : defaultImg,
      goods_pic_two: this.data.images[1] ? this.data.images[1].url : '',
      goods_pic_three: this.data.images[2] ? this.data.images[2].url : '',
      freight_type: 0
    }

    let feeDetail = this.data.infos.find(tmp => tmp.id === 'fee').info

    //util.logger.log(feeDetail);
    if (feeDetail) {
      let value = feeDetail.find(tmp => tmp.id === 'fee').value
      if (value) {
        parameter.freight = value;
        parameter.freight_type = 1
      }
      value = feeDetail.find(tmp => tmp.id === 'startFee').value
      if (value) parameter.sail_freight = value

      value = feeDetail.find(tmp => tmp.id === 'delayFee').value
      if (value) parameter.stag_freight = value

      value = feeDetail.find(tmp => tmp.id === 'loadDuration').value
      if (value) parameter.handle_cycle = value

      value = feeDetail.find(tmp => tmp.id === 'needInvoice').value
      if (value) parameter.flag_invoice = Number(value)

      value = feeDetail.find(tmp => tmp.id === 'settalTime').value
      if (value) parameter.settle_type = value

      value = feeDetail.find(tmp => tmp.id === 'settalType').value
      if (value) parameter.pay_type = value
    }

    //指定承运人
    let acceptList = this.data.acceptList;
    let take_user_type = acceptList.findIndex(tmp => tmp.select === true) + 1;
    let transport_id = '';
    let carrier = this.data.carrier;
    if (take_user_type === 2) {
      carrier.forEach(tmp => {
        transport_id += tmp.id + ',';
      })
      transport_id = transport_id.replace(/\,$/ig, '');
    }
    parameter.transport_id = transport_id;
    parameter.take_user_type = take_user_type;


    /* 根据type选择类型 */

    let tapAction = e.currentTarget.dataset.action;
    if (tapAction === 'update') {
      wx.showModal({
        title: '提示',
        content: '是否更新货盘？',
        success: function (res) {
          if (res.confirm) {
            Object.assign(parameter, {
              order_id: obj.data.orderId
            })
            wx.showLoading({
              title: '更新中'
            });
            newApi.updateOrder(parameter).then(res => {
              wx.hideLoading();
              wx.showToast({
                title: '更新成功',
                icon: 'none'
              })
              setTimeout(function () {
                if (obj.data.orderId) {
                  wx.navigateBack({
                    delta: 2
                  });
                } else {
                  wx.redirectTo({
                    url: '/pages/orderList/orderList'
                  })
                }
              }, 500);
            })
          }
        }
      })

    } else {
      wx.showModal({
        title: '提示',
        content: '是否发布货盘？',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              mask: true,
              title: '正在发布'
            });
            newApi.addGoods(parameter).then(() => {
              wx.hideLoading()
              wx.showToast({
                title: '发布成功',
                icon: 'none'
              })
              setTimeout(function () {
                if (obj.data.orderId) {
                  wx.navigateBack({
                    delta: 2
                  });
                } else {
                  wx.redirectTo({
                    url: '/pages/orderList/orderList'
                  })
                }

              }, 500);
            })
          }
        }
      })

    }

  },

  /**
   * input change
   */
  inputContentChange: function (e) {
    let id = e.currentTarget.dataset.id
    let infos = this.data.infos
    infos.find(tmp => tmp.id === id).value = e.detail.value
    this.setData({
      infos
    })
    //this.updateButton()
    util.logger.log(e)
  },

  weightStartChange: function (e) {
    let infos = this.data.infos
    infos.find(tmp => tmp.id === 'shipWeight').min = e.detail.value
    this.setData({
      infos
    })
  },

  weightEndChange: function (e) {
    let infos = this.data.infos
    infos.find(tmp => tmp.id === 'shipWeight').max = e.detail.value
    this.setData({
      infos
    })
  },

  /**
   * 
   * Jump page
   */
  choseStart: function () {
    this.data.addrSelectingStart = true
    this.data.addrSelectingEnd = false
    wx.navigateTo({
      url: '/pages/addrSelector/addrSelector?type=docklist'
    })
  },
  choseEnd: function () {
    this.data.addrSelectingStart = false
    this.data.addrSelectingEnd = true
    wx.navigateTo({
      url: '/pages/addrSelector/addrSelector?type=docklist'
    })
  },
  addrExchange: function () {

    var end = this.data.start;
    var start = this.data.end;
    this.setData({
      start,
      end
    });
    this.updateStartAndEndDes();
  },

  finishFeeInfo: function () {
    this.data.editingFeeDetail = true
    let feeInfo = this.data.infos.find(tmp => tmp.id === 'fee')
    if (feeInfo.info) {
      wx.setStorage({
        key: localStorage.FeeDetailIntputKey,
        data: feeInfo.info,
        success: () => {
          wx.navigateTo({
            url: '../feeDetail/feeDetail'
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '../feeDetail/feeDetail'
      })
    }



  },

  getGoodsName: function () {
    this.data.isChoosingGoods = true
    let infos = this.data.infos;

    let info = JSON.stringify(infos.filter(tmp => tmp.id === 'name')[0]);
    let images = JSON.stringify(this.data.images);
    wx.navigateTo({
      url: '../goodsTypeSelector/goodsTypeSelector?info=' + info + '&images=' + images
    });
  },
  getMemo: function () {
    this.data.editMemo = true;
    let memo = this.data.infos.filter(tmp => tmp.id === 'memo')[0];
    if (memo.value && memo.value.length > 0) {
      memo = JSON.stringify(memo);
      wx.navigateTo({
        url: "/pages/memoDetail/memoDetail?memo=" + memo
      })
    } else {
      wx.navigateTo({
        url: "/pages/memoDetail/memoDetail"
      })
    }


  },
  getHistoryGoods: function () {
    wx.navigateTo({
      url: "/pages/historyGoods/historyGoods"
    })
  },
  getSailCircle: function () {
    let carrier = this.data.carrier;
    if (carrier.length > 0) {
      carrier = JSON.stringify(carrier);
      wx.navigateTo({
        url: "/pages/sailCircle/sailCircle?type=addGoods&" + 'carrier=' + carrier
      })
    } else {
      wx.navigateTo({
        url: "/pages/sailCircle/sailCircle?type=addGoods"
      })
    }

  },
  /**
   * 
   * time picker 
   * 1. 在创建的这个view创建的时候就应该构建本月的数据，以备显示
   * 2. 滚动的时候，动态更新后续内容
   * 3. 要求不早于当天，
   * 
   */

  generateTimePickerData: function (year, month) {
    /**
     * 获取当前时间，获取年份和月份，获取对应月份的天数
     * 判断是否指定当前年份，如果是，只能显示当月往后的月份
     * 判断月份是否是当前月份，如果是，只能显示当天往后的天
     */
    let date = new Date()
    let days = time.getDaysInMonth(year, month)

    let currentYear = date.getFullYear()
    let currentMonth = date.getMonth()

    var range = []
    range.push(array.rangeArray(currentYear, currentYear + 3))

    if (currentYear === year) {
      range.push(array.rangeArray(currentMonth + 1, 13))
    } else {
      range.push(array.rangeArray(1, 13))
    }

    if (currentMonth === month && currentYear === year) {
      let currentDay = date.getDate()
      range.push(array.rangeArray(currentDay, days + 1))
    } else {
      range.push(array.rangeArray(1, days + 1))
    }
    let offset = array.rangeArray(0, 10).map(v => "+" + v.toString())
    range.push(offset)
    return range
  },
  timeChange: function (e) {
    let list = this.getCurrentPickerDateValue()
    let infos = this.data.infos
    let date = new Date(list[0], list[1] - 1, list[2])
    let offset = list[3]
    let dateStr = time.getRequestFormatedDateString(date, 'yyyy-MM-dd')
    if (offset && Number(offset) > 0) {
      dateStr = dateStr + ' +' + offset
    }
    infos[0].value = dateStr
    this.setData({
      infos,
      date,
      offset
    })
    //this.updateButton()
  },
  getCurrentPickerDateValue: function () {
    return [this.data.timePickerValue[0][this.data.timePickerIndex[0]],
      this.data.timePickerValue[1][this.data.timePickerIndex[1]],
      this.data.timePickerValue[2][this.data.timePickerIndex[2]],
      this.data.timePickerIndex[3]
    ]
  },
  bindTimePickerColumnChange: function (e) {
    if (e.detail && e.detail.column >= 0 && e.detail.value >= 0) {
      var timePickerIndex = this.data.timePickerIndex
      var timePickerValue = this.data.timePickerValue

      /**
       * 日期和偏差的滚动不影响月份和年
       */
      timePickerIndex[e.detail.column] = e.detail.value
      if (e.detail.column === 1 || e.detail.column == 0) {
        let values = this.getCurrentPickerDateValue()
        timePickerValue = this.generateTimePickerData(values[0], values[1] - 1)
        timePickerIndex[2] = 0
        timePickerIndex[3] = 0
        if (e.detail.column == 0) {
          timePickerIndex[1] = 0
        }
        timePickerValue = this.generateTimePickerData(values[0], timePickerValue[1][timePickerIndex[1]] - 1)
      }
      this.setData({
        timePickerIndex,
        timePickerValue
      })
    }
  },


  /**
   * 
   * Image actions 
   */
  addPic: function () {
    let images = this.data.images
    let obj = this
    wx.chooseImage({
      count: 3 - this.data.images.length,
      success: res => {
        util.logger.log(res)
        let list = res.tempFilePaths.map(tmp => {
          let item = {
            path: tmp,
            url: ''
          }
          http.uploadFile(tmp).then(url => {
            item.url = url
          })
          return item
        })
        images = list.concat(images);
        //util.logger.log(images);
        obj.setData({
          images
        });
      },
      fail: reason => {
        util.logger.log(reason)
      }
    });

  },
  delImage: function (e) {
    let index = e.currentTarget.dataset.index
    let images = this.data.images
    if (index >= 0 && index < images.length) {
      images.splice(index, 1);
      this.setData({
        images
      })
    }
  },
  previewImage: function (e) {
    let index = e.currentTarget.dataset.index
    let images = this.data.images;
    //util.logger.log(images);
    /* 此处是无奈之举. */
    let list = [];
    list.push(images[index].path);
    wx.previewImage({
      current: images[index],
      urls: list
    });


  },
  updateStartAndEndDes: function () {
    let currentAddrDesc = {}
    if (this.data.start.length) {
      let shortItems = addr.shortItemsOfAddrWithoutDock(this.data.start)
      currentAddrDesc.firstStart = shortItems.firstShort
      currentAddrDesc.secondStart = shortItems.secondShort
    }
    if (this.data.end.length) {
      let shortItems = addr.shortItemsOfAddrWithoutDock(this.data.end)
      currentAddrDesc.firstEnd = shortItems.firstShort
      currentAddrDesc.secondEnd = shortItems.secondShort
    }
    this.setData({
      currentAddrDesc
    })
  },
  /* 12.8关闭货单 */
  close: function () {
    let id = this.data.orderId;
    let obj = this;
    wx.showModal({
      title: '提示',
      content: '确定关闭订单?',
      confirmText: '确定',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            mask: true,
            title: '正在关闭订单'
          })
          newApi.cancelOrder(obj.data.orderId).then(res => {
            wx.showToast({
              title: '操作成功'
            });
            wx.setStorage({
              key: localStorage.OrderDetail_ShouldReload_OnShow,
              data: id,
              success: () => {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1500);
              }
            })

          })
        }
      }
    })

  },

  /* 页面路径中的参数存在id */
  initGoodsInfo(id) {

    if (id) {
      let obj = this;
      wx.showLoading({
        mask: true,
        title: '正在加载'
      });
      let param = {
        order_id: id
      }
      newApi.findOrderDetail(param).then(res => {
        //util.logger.log(res);
        wx.hideLoading();
        let detail = res;
        /*暂时发现无意义.... */
        detail = Object.keys(detail).reduce((map, key) => {
          if (detail[key]) {
            map[key] = detail[key]
          }
          return map
        }, {});


        /* 存储货单详情轮播图片 */
        let images = [];
        if (detail.goods_pic_one) images.push(Object.assign({}, {
          'path': detail.goods_pic_one,
          'url': detail.goods_pic_one
        }));
        if (detail.goods_pic_two) images.push(Object.assign({}, {
          'path': detail.goods_pic_two,
          'url': detail.goods_pic_two
        }));
        if (detail.goods_pic_three) images.push(Object.assign({}, {
          'path': detail.goods_pic_three,
          'url': detail.goods_pic_three
        }));

        /* 地址 此处代码有待优化*/
        let start = [{}, {}, {}, {}];
        let end = [{}, {}, {}, {}];
        start[0].name = detail.start_dock_pro_name;
        start[0].code = detail.start_dock_pro_code;
        start[1].name = detail.start_dock_city_name;
        start[1].code = detail.start_dock_city_code;
        start[2].name = detail.start_dock_area_name;
        start[2].code = detail.start_dock_area_code;
        start[3].name = detail.start_dock_name;
        start[3].id = detail.start_dock_id;

        end[0].name = detail.end_dock_pro_name;
        end[0].code = detail.end_dock_pro_code;
        end[1].name = detail.end_dock_city_name;
        end[1].code = detail.end_dock_city_code;
        end[2].name = detail.end_dock_area_name;
        end[2].code = detail.end_dock_area_code;
        end[3].name = detail.end_dock_name;
        end[3].id = detail.end_dock_id;

        obj.setData({
          start,
          end
        });
        obj.updateStartAndEndDes();

        /* 船只信息值动态更新  */
        this.data.infos.forEach(item => {
          if (item.type !== 'freight_show') {
            item.value = detail[item.id] ? detail[item.id] : ''
          }
        });


        let tags = [];
        if (detail.flag_invoice.toString() === '1') tags.push({
          name: '需要发票'
        });
        if (Number(detail.handle_cycle) > 0) tags.push({
          name: '装卸' + detail.handle_cycle.toString() + '天'
        });
        if (detail.settle_type && detail.settle_type.length > 0) tags.push({
          name: detail.settle_type
        });
        if (detail.pay_type && detail.pay_type.length > 0) tags.push({
          name: detail.pay_type
        });

        /* 装货时间 */
        let timneStr = '';
        let date = '';
        let offset = '';
        if (detail.upload_start_date) {
          timneStr = this.yearMonthDay();
          date = detail.upload_start_date;
        }
        //util.logger.log(date);


        if (detail.upload_handle_cycle && Number(detail.upload_handle_cycle) > 0) {
          timneStr = timneStr + ' +' + detail.upload_handle_cycle;
          offset = detail.upload_handle_cycle;
        }
        //util.logger.log(timneStr);
        detail['upload_start_date'] = timneStr;

        /* infos数组的处理 */
        let infos = obj.data.infos.concat();

        let keys = Object.keys(detail);
        for (let i = 0; i < infos.length; i++) {
          if (keys.includes(infos[i].type)) {
            let type = infos[i].type;
            if (type === 'upload_start_date') {
              infos[i].value = timneStr;
            } else {
              if (type !== 'freight_show') {
                infos[i].value = detail[type];
              }

            }
            if (type === 'goods_name') {
              infos[i].info = {
                name: detail[type]
              };
            }
            if (type === 'freight_show') {
              let feeInfos = [{
                  leading: '运费',
                  type: 'input',
                  id: 'fee',
                  unit: '元/吨',
                  placeholder: '不填，默认价格电议',
                  name: 'freight_show'
                },
                {
                  leading: '开航费',
                  type: 'input',
                  id: 'startFee',
                  unit: '元',
                  placeholder: '请输入开航费',
                  name: 'sail_freight'
                },
                {
                  leading: '滞期费',
                  type: 'input',
                  id: 'delayFee',
                  unit: '元/吨/天',
                  placeholder: '请输入滞期费',
                  name: 'stag_freight'
                },
                {
                  leading: '两港装卸时间',
                  type: 'picker',
                  id: 'loadDuration',
                  unit: '天',
                  range: array.rangeArray(1, 21),
                  rangeIndex: 0,
                  value: '',
                  showIndicator: true,
                  name: 'handle_cycle'
                },
                {
                  leading: '结算方式',
                  type: 'radio',
                  id: 'settalTime',
                  range: ['卸前结清', '卸后结清'],
                  rangeIndex: 0,
                  value: '',
                  name: 'settle_type'
                },
                {
                  leading: '付款方式',
                  type: 'radio',
                  id: 'settalType',
                  range: ['现金', '汇款'],
                  rangeIndex: 0,
                  value: '',
                  name: 'pay_type'
                },
                {
                  leading: '是否开票',
                  type: 'check',
                  id: 'needInvoice',
                  value: false,
                  name: 'flag_invoice'
                },
              ];

              for (let prop = 0; prop < feeInfos.length; prop++) {
                let pick = ['loadDuration', 'settalTime', 'settalType'];
                let input = ['fee', 'startFee', 'delayFee'];
                let check = ['check'];
                if (pick.includes(feeInfos[prop]['id'])) {
                  //util.logger.log(feeInfos[prop].name);
                  let index = feeInfos[prop].range.indexOf(detail[feeInfos[prop].name]);
                  feeInfos[prop].value = detail[feeInfos[prop].name];
                  feeInfos[prop].rangeIndex = index == -1 ? 0 : index;
                  //util.logger.log(index+'feiyong');
                } else if (input.includes(feeInfos[prop]['id'])) {
                  let name = feeInfos[prop].name;
                  if (detail[name] === '价格电议') {
                    detail[name] = '';
                  }
                  if (detail[name] && detail[name].indexOf('元/吨') > -1) {
                    let end = detail[name].indexOf('.');
                    console.log(detail[name]);
                    detail[name] = detail[name].substring(0, end);
                  }
                  feeInfos[prop]['value'] = detail[name];

                } else {
                  let name = feeInfos[prop].name;
                  feeInfos[prop]['value'] = detail[name] == 1 ? true : false;
                }

              }
              util.logger.log(feeInfos);
              wx.setStorage({
                key: localStorage.FeeDetailIntputKey,
                data: feeInfos,
              })
              infos.find(tmp => tmp.id === 'fee').info = feeInfos;
            }
            if (type === 'order_remark') {
              infos[i].value = detail[type];
            }
          }
        }
        //util.logger.log(infos);
        /* 吨位判断 */
        let cargo_req = {};
        if (detail['cargo_req'].indexOf('以下') != -1) {
          cargo_req.max = detail['cargo_req'].replace('以下', '');
        } else if (detail['cargo_req'].indexOf('以上') != -1) {
          cargo_req.min = detail['cargo_req'].replace('以上', '');
        } else if (detail['cargo_req'].indexOf('-') != -1) {
          //util.logger.log('处理');
          /*  detail['cargo_req']=detail['cargo_req'].replace('-',','); */
          detail['cargo_req'] = detail['cargo_req'].split('-');
          cargo_req.min = detail['cargo_req'][0];
          cargo_req.max = detail['cargo_req'][1].replace('吨', '');

          /* 此处infos 来自Infos处理处的infos find也是es6新方法*/
          infos.find(tmp => tmp.id === 'shipWeight').min = detail['cargo_req'][0];
          infos.find(tmp => tmp.id === 'shipWeight').max = detail['cargo_req'][1].replace('吨', '');
          //util.logger.log(infos);
        } else {
          cargo_req = null;
        }
        /* 指定人回填 */
        let acceptList = this.data.acceptList;
        let take_user_type = detail.take_user_type;
        let carrier = this.data.carrier;
        acceptList.forEach((item, index) => {
          if (index === Number(take_user_type) - 1) {
            item.select = true;
          } else {
            item.select = false;
          }
        })
        let param = {};
        Object.assign(param, {
          order_id: detail.order_id
        });
        newApi.appointList(param).then(res => {
          carrier = [].concat(res.appointList);
          carrier.forEach(item => {
            Object.assign(item, {
              id: item.recuser_taker_id
            })
          })
          obj.setData({
            carrier
          });
        })

        /* 此处应用es6 对象解构赋值 */
        obj.setData({
          detail,
          images,
          cargo_req,
          date,
          offset,
          orderId: id,
          infos: infos,
          status: res.status && (Number(res.status) !== 0 && Number(res.status) !== 5),
          acceptList,
        });
        util.logger.log(obj.data);
      })
    }
  },
  /**
   * 
   * page lefecyle
   */
  onLoad: function (options) {
    //console.log(this.data.imgList);
    //util.logger.log(query);
    this.initGoodsInfo(options.id);

    if (options.inEdit) {
      this.setData({
        inEdit: options.inEdit
      })
    }
    if (options.addType) {
      this.setData({
        addType: 'history'
      });
    }
    let infos = this.data.infos
    infos.find(tmp => tmp.id === 'contact').value = person.getMobile();
    infos.find(tmp => tmp.id === 'contact_person').value = person.getContactPerson();
    let date = new Date()
    let year = date.getFullYear();
    let month = date.getMonth();
    let timePickerValue = this.generateTimePickerData(year, month)
    let timePickerIndex = array.repeatArray(0, 4)
    this.setData({
      timePickerIndex,
      timePickerValue,
      infos
    });
    util.logger.log(this.data.infos);

    wx.request({
      url: goodsPicConfigFile,
      success: res => {
        if (res.data && res.data.length > 0) {
          this.data.imgList = res.data;
        }
      }
    })
  },

  onShow: function () {
    let obj = this;
    //console.log(obj.data.infos);
    if (this.data.addrSelectingEnd || this.data.addrSelectingStart) {
      let isStart = this.data.addrSelectingStart
      util.logger.log('getStorage')
      wx.getStorage({
        key: localStorage.AddrOutputKey,
        success: function (res) {
          util.logger.log(res)
          if ((isStart && obj.data.end.length && res.data[res.data.length - 1].id === obj.data.end[obj.data.end.length - 1].id) ||
            (obj.data.start.length && res.data[res.data.length - 1].id === obj.data.start[obj.data.start.length - 1].id)) {
            return
          }

          if (isStart) {
            obj.setData({
              start: res.data
            })
          } else {
            obj.setData({
              end: res.data
            })
          }
          obj.updateStartAndEndDes()
        }
      })
      this.data.addrSelectingEnd = false
      this.data.addrSelectingStart = false
    } else if (this.data.isChoosingGoods) {
      this.data.isChoosingGoods = false
      let infos = this.data.infos
      let index = infos.findIndex(tmp => tmp.id === 'name')
      util.logger.log('getStorage')
      wx.getStorage({
        key: localStorage.GoodsTypeSelectorOutputKey,
        success: res => {
          //console.log(res);
          if (res.data.img) {
            var images = res.data.img;
            obj.setData({
              images
            })
          }
          infos[index].value = res.data.name
          infos[index].info = res.data
          obj.setData({
            infos
          })
        }
      })
    } else if (this.data.editingFeeDetail) {
      this.data.editingFeeDetail = false
      let infos = this.data.infos
      let index = infos.findIndex(tmp => tmp.id === 'fee')
      util.logger.log('getStorage')

      wx.getStorage({
        key: localStorage.FeeDetailOutputKey,
        success: res => {
          infos[index].info = res.data
          obj.setData({
            infos
          });
        }
      })
    } else if (this.data.editMemo) {
      this.data.editMemo = false;
      let infos = this.data.infos
      let index = infos.findIndex(tmp => tmp.id === 'memo')
      wx.getStorage({
        key: localStorage.MemoDetailOutputKey,
        success: res => {
          infos[index].value = res.data
          obj.setData({
            infos
          });
          wx.removeStorage({
            key: localStorage.MemoDetailOutputKey
          });
        }
      })
    } else if (this.data.getCarrier) {
      this.data.getCarrier = false;
      let carrier = this.data.carrier;
      wx.getStorage({
        key: localStorage.SailCircleOutputKey,
        success: res => {
          carrier = res.data
          obj.setData({
            carrier
          });
          wx.removeStorage({
            key: localStorage.SailCircleOutputKey
          });
        }
      })
    }

    //历史货盘回填

    wx.getStorage({
      key: localStorage.addGoodFromHistory,
      success: function (res) {
        obj.initGoodsInfo(res.data.order_id);
        obj.setData({
          addType: 'history'
        });
        wx.removeStorage({
          key: localStorage.addGoodFromHistory
        })
      }
    });
    //this.updateButton()
  },
  acceptTap(e) {
    var data = e.currentTarget.dataset.data;
    var acceptList = this.data.acceptList;
    acceptList.forEach(tmp => {
      if (data.name === tmp.name) {
        tmp.select = true;
      } else {
        tmp.select = false;
      }

    })

    this.setData({
      acceptList
    });
    if (data.name === '航运圈好友') {
      this.setData({
        getCarrier: true
      })
      this.getSailCircle();
    }
    if (data.name === '所有人') {

    }

    if (data.name === '微信好友') {

    }
  },
  yearMonthDay() {
    let time = new Date();
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let day = time.getDate();
    day = day < 10 ? '0' + day : day;
    let timeStr = year + '-' + month + '-' + day;
    return timeStr;
  }
})