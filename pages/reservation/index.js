// pages/reservation/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleData: {
      "bg_color": "#fff",
      "color": "#000",
      "flag": 1,
      "name": "预约定制"
    },
    hasEmptyGrid: false,
    cur_year: '',
    cur_month: '',
    hiddenmodalput: true,
    yuyue_phone: null,
    yuyue_date: null
  },
  //取消按钮
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  userTellInput: function (e) {
    //设置电话
    this.setData({
      yuyue_phone: e.detail.value
    })
  },
  //确认
  confirm: function (e) {
    var that = this
    console.log()
    this.setData({
      hiddenmodalput: true,
    })
    console.log(that.data.yuyue_phone)
    wx.request({
      url: 'http://192.168.1.109:80/wx/wxReserve',
      method: "POST",
      data: {
        phone: app.globalData.myPhone,
        reservePhone:that.data.yuyue_phone,
        reserveTime: "2020-6-23",
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
          that.setData({
            hiddenmodalput: true
          });
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setNowDate();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  dateSelectAction: function (e) {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
    var cur_day = e.currentTarget.dataset.idx;
    console.log(e)
    this.setData({
      todayIndex: cur_day,
      yuyue_date: `${this.data.cur_year}-${this.data.cur_month}-${cur_day + 1}`,
    })
    console.log(`点击的日期:${this.data.cur_year}年${this.data.cur_month}月${cur_day + 1}日`);
    console.log(this.data.todayIndex)
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
      weeks_ch,
      todayIndex,
    })
    console.log(this.data)
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
  }
})