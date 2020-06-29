// // pages/index/home.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    is_longin: true,
    swiperCurrent: 0,
    interval: 300,
    duration: 500,
    circular: false,
    vertical: true,
    imgUrls: '/images/img_shjiantou_fds.png',
    clientHeight: '',
    guide: app.globalData.guide,
    titleData: {
      "bg_color": "#A1BA50",
      "color": "#fff",
      "flag": 0,
      "name": "预约到访"
    },
    hasEmptyGrid: false,
    cur_year: '',
    cur_month: '',
    to_month: '',
    hiddenmodalput: true,
    yuyue_date: null,
    longitude: 108.9483207500,
    latitude: 34.3491318800,
    covers: [{
      latitude: 34.3491318800,
      longitude: 108.9483207500,
      iconPath: '/images/location.png'
    }],
    keyuyue:8,//实际预约时间为6天
    weikaifang:14,//实际未开放时间为6天
    ke_wei_jiange:6,//预约时间和未开放时间间隔为6天
  },
  //导航
  daohang: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: that.data.latitude, //要去的纬度-地址
          longitude: that.data.longitude, //要去的经度-地址
          name: "经开万科中心",
          address: '未央区未央路301号'
        })
      }
    })
  },
  // Appointment_customization_func:function(){
  //   var that = this
  //   wx.navigateTo({
  //     url:'/pages/reservation/index',
  //   })
  // },
  // about_us_func:function(){
  //   var that = this
  //   that.setData({
  //     swiperCurrent: 5
  //   })
  // },
  // 登录+授权获取手机号
  getPhoneNumber(e) {
    var that = this
    console.log(e)
    console.log("e.detail:" + e.detail)
    console.log("errMsg:" + e.detail.errMsg)
    console.log("iv:" + e.detail.iv)
    console.log("encryptedData:" + e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log("code:" + res.code)
          console.log("医生:"+that.data.guide)
          wx.request({
            url: app.globalData.serverUrl + '/wx/wxGetPhoneForGongzhonghao',
            method: "POST",
            data: {
              doctorId: that.data.guide,
              js_code: res.code,
              encrypted: e.detail.encryptedData,
              iv: e.detail.iv,
            },
            header: {
              "Content-Type": "application/json"
            },
            success: function (res) {
              console.log(res)
              if (res.data.returnCode != 0) {
                wx.showToast({
                  title: "请重新授权！",
                  icon: 'warning',
                  duration: 2000
                })
              } else {
                console.log(res)
                wx.showToast({
                  title: '授权成功！',
                  icon: 'success',
                  duration: 2000
                })
                that.setData({
                  is_longin: true
                })
                let Myphone = res.data.data.phoneNumber
                app.globalData.myPhone = Myphone
              }
            },
            fail: function (err) {
              console.log(err)
            }
          })
        },
        fail: err => {
          console.log(err)
        }
      })
    } else {
      this.setData({
        is_longin: false
      })
    }
  },
  //轮播图的切换事件 
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //点击指示点切换 
  chuangEvent: function (e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },
  //点击图片触发事件  
  swipclick: function (e) {
    console.log(this.data.swiperCurrent);
    wx.switchTab({
      url: this.data.links[this.data.swiperCurrent]
    })
  },
  /***当前日期*/
  // FormatDate(strTime) {
  //   var date = new Date(strTime);
  //   return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    })
    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
        that.setData({
          is_longin: true
        })
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        // wx.login() //重新登录
        // var today = new Date();
        // var today_time = that.FormatDate(today);
        // console.log(today_time)
        // if (today_time >= '2020-4-22') {console.log('活动已结束');}else{}
        var thetime = '2020-04-23 12:00:00';
        var d = new Date(Date.parse(thetime.replace(/-/g, "/")));
        var curDate = new Date();
        if (d <= curDate) {
          that.setData({
            is_longin: false
          })
        } else {
          that.setData({
            is_longin: true
          })
        }
      }
    }),
      // console.log("app传输过来" + this.data.guide)
      this.setNowDate();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this
    return {
      title: '让每个孩子更健康的发育',
      path: '/pages/test/index?id=' + that.data.guide,
      imageUrl: '/images/IMG_20200616_155844.jpg' //这个是分享的图片
    }
  },
  dateSelectAction: function (e) {
    var that = this
    var cur_day = e.currentTarget.dataset.idx;
    console.log(e)
    that.setData({
      // todayIndex: cur_day,
      yuyue_date: `${that.data.cur_year}-${that.data.cur_month}-${cur_day + 1}`,
    })
    console.log(`点击的日期:${that.data.cur_year}年${that.data.cur_month}月${cur_day + 1}日`);

    


    // console.log(this.data.todayIndex)
    console.log(app.globalData.myPhone)
    console.log(that.data.yuyue_date)
    wx.request({
      url: app.globalData.serverUrl + '/wx/wxReserve',
      method: "POST",
      data: {
        phone: app.globalData.myPhone,
        reservePhone: app.globalData.myPhone,
        reserveTime: that.data.yuyue_date,
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res)
        if (res.data.returnCode != 0) {
          wx.showToast({
            title: "预约失败！",
            icon: 'warning',
            duration: 2000
          })
        } else {
          console.log(res)
          wx.showToast({
            title: '预约成功！',
            icon: 'success',
            duration: 2000
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  setNowDate: function () {
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const todayIndex = date.getDate() - 1;
    console.log(`日期：${todayIndex}`)
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    this.setData({
      cur_year: cur_year,
      cur_month: cur_month,
      to_month: cur_month,
      weeks_ch,
      todayIndex,
    })
    console.log(this.data)
    console.log(this.data.todayIndex+1)
    console.log(this.data.days.length)
    // console.log(this.data.days.length - (this.data.todayIndex-1 + this.data.keyuyue) < this.data.ke_wei_jiange)
    // if(this.data.days.length - (this.data.todayIndex-1) < this.data.ke_wei_jiange){
    //   this.data.days.length - (this.data.todayIndex-1 + this.data.keyuyue)
    //   console.log(this.data.days.length - (this.data.todayIndex-1 + this.data.keyuyue))
    // }
    if(this.data.days.length - (this.data.todayIndex+1) < this.data.ke_wei_jiange){
      console.log(this.data.ke_wei_jiange - (this.data.days.length - (this.data.todayIndex+1)))
      let sheyu=this.data.ke_wei_jiange - (this.data.days.length - (this.data.todayIndex+1))
      this.setData({
        sheyuyuyueshijian: sheyu,
      })

    }

  },

  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays(year, month) {
    let days = [];
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      days.push(i);
    }
    this.setData({
      days
    });
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    }
    console.log( this.data.to_month)//当前月份
    console.log( this.data.cur_month)//改变的月份
  }
})
// Page({
//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {

//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {

//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {

//   },
// })