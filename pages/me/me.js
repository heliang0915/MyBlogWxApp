//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo:{},
    userId:null,
  },
  
  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo,
      userId: app.globalData.userId
    })
    wx.setNavigationBarTitle({
      title:"我的"
    })
    console.log(app.globalData.userInfo);
  }
})
