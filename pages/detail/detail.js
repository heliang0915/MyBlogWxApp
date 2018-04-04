//index.js
//获取应用实例
const app = getApp()
let fetch = require("../../utils/fetch.js");
Page({
  data: {
    uuid:'',
    publishTxt:'',
    blog:{},
    ary:[{
      userName:"张三",
      day:'1天前',
      comment:'这个熊掌号是干啥的',
      reply:'因为采集站更新快内容也相对有热点性,长期下来整站都是采集内容'
    }, {
      userName: "李四",
      day: '1天前',
      comment: '这个熊掌号是干啥的~',
      reply: '因为采集站更新快内容也相对有热点性,长期下来整站都是采集内容'
      }, {
        userName: "鸟叔",
        day: '1天前',
        comment: '这个熊掌号是干啥的？',
        reply: '因为采集站更新快内容也相对有热点性,长期下来整站都是采集内容'
    }, {
      userName: "明月登楼",
      day: '1天前',
      comment: '这个熊掌号是干啥的!',
      reply: '因为采集站更新快内容也相对有热点性,长期下来整站都是采集内容'
    }]
  },
  //输入文字
  inputPublish: function(e) {
    this.setData({
      publishTxt: e.detail.value
    })
  },
  //发送评论
  send:function(){
    let { publishTxt}=this.data;
    // this.
    // console.log(this.data.publishTxt);
    wx.showToast({
      title: publishTxt,
      icon:'none'
    })
  },
  getBlogContent:function(){
    let { uuid } = this.data;
    fetch.get(`article/single/${uuid}`).then((data) => {
        this.setData({
          blog: data.module
        })
      })
  },
  onLoad: function (option) {
    // console.log(option)
    let {title,uuid}=option;
    console.log(uuid);
    this.setData({
       uuid
    });
    wx.setNavigationBarTitle({
      title: option.title
    })
    this.getBlogContent();
  }
})
