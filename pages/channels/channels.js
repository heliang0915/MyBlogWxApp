//index.js
//获取应用实例
const app = getApp()
let fetch = require("../../utils/fetch.js");
Page({
  data: {
     channels:[],
     h: wx.getSystemInfoSync().windowHeight ,
     colors: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#F56C6C','#909399']
  },
  onPullDownRefresh: function () {
    this.getChannels();
    wx.stopPullDownRefresh()
  },
  onLoad: function (option) {
    this.getChannels();
    wx.setNavigationBarTitle({
      title:"栏目"
    })
  },
  gotoBlogList(e){
    let { uuid, title,desc,color} = e.currentTarget.dataset;
    console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: `/pages/blogs/blogs?title=${title}&uuid=${uuid}&desc=${desc}&color=${color}`,
      success: function () {
        console.log("跳转成功");
      },
      fail: function (e) {
        console.log("调用失败...." + JSON.stringify(e));
      }
    })
  },
  getColor:function(){
      let { colors}=this.data;
      let index = Math.round(Math.random() * (colors.length-1));
      return index;
      // console.log(index);
  },
  getChannels: function(callback) {
    fetch.post("channel/list", {
      page: 1,
      pageSize:100,
      sort:{order:1},
      params: {
        // channelId:
      }
    }, true).then((data) => {
        data.forEach((channel)=>{
            let index = this.getColor();
            channel.color = this.data.colors[index];
        })
        this.setData({
          channels: data
        })
    });
  }
})
