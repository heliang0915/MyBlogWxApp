//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo:{},
    userId:null,
  },
  goMyZan(e){
      let { keyWord } = this.data;
      wx.navigateTo({
        url: `/pages/mylist/mylist?title=我的点赞`,
        success: function () {
          console.log("跳转成功");
        },
        fail: function (e) {
          console.log("调用失败...." + JSON.stringify(e));
        }
      })
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
