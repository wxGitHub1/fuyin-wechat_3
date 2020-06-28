//app.js
App({
  globalData: {
    serverUrl: "https://fuyinkangfu.com:8055",
    guide: 1,
    navHeight:null,
    navTop:null,
    windowHeight:null,
    myPhone:null,
  },
  onLaunch: function (q) {
    console.log(q.query.id != undefined)
    console.log("加载页面所带的参数↓")
    console.log(q)
    // console.log(scene)
    var id = q.query.id
    if (q.query.id != undefined) {
      this.globalData.guide = id
    }
    // if (q.scene) {
    //   const scene = decodeURIComponent(q.scene)
    //   // wx.setStorageSync('doctorId', scene)
    //   wx.setStorageSync('doctorId', id)
    // } else {
    //   wx.setStorageSync('doctorId', id)
    // }
    // 1. 整个导航栏的高度；
    // 2. 胶囊按钮与顶部的距离；
    // 3. 胶囊按钮与右侧的距离。
    // 小程序可以通过 wx.getMenuButtonBoundingClientRect() 获取胶囊按钮的信息 和 wx.getSystemInfo() 获取设备信息。
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top, //胶囊按钮与顶部的距离
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2; //导航高度
        this.globalData.navHeight = navHeight;
        this.globalData.navTop = navTop;
        this.globalData.windowHeight = res.windowHeight;
      },
      fail(err) {
        console.log(err);
      }
    })
  },
})