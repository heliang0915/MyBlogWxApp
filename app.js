//app.js
App({
  onLaunch: function () {
    var self=this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(res.code)   
          wx.getUserInfo({
            success: function (res) {
              self.globalData.userInfo = res.userInfo
            }
          });
      }
    })
  },
  globalData: {
    userInfo: null
  }
})