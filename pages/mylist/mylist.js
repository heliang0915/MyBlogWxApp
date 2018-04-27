//mylist.js
//获取应用实例
const app = getApp()
Page({
    data: {
      
    },
    onLoad: function (option) {
        let { title } = option;
        wx.setNavigationBarTitle({
          title
        })
    }
})
