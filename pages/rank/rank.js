//index.js
//获取应用实例
const app = getApp()
let fetch = require("../../utils/fetch.js");
Page({
  data: {
     isMore: true,
     isShow: true,
     index:0,
     page: 1,
     pageSize: 0,
     total: 0,
     blogs: [],
     contentHeight: wx.getSystemInfoSync().windowHeight  - 50
  },
  onPullDownRefresh: function () {
    this.setData({
      isMore: true,
      isShow: true,
      page: 1
    })
    this.getBlogList(1, () => {
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 'refrsh');
  },
  changeIndex(e){
    let { index } = e.currentTarget.dataset;
    console.log(index);
    this.setData({
       index
    })
    this.getBlogList(1, () => {}, 'refrsh');
  },
  loadMore:function () {
    var { pageSize, total, page } = this.data;
    let maxPage = Math.ceil(total / pageSize);
    if (page < maxPage) {
      this.setData({
        page: ++this.data.page
      })
      var page = this.data.page;
      this.getBlogList(page);
      console.log("loadMore...." + page);
      this.setData({
        isMore: true
      })
    } else {
      var self = this;
      setTimeout(() => {
        self.setData({
          isShow: false
        })
      }, 100)
      self.setData({
        isMore: false
      })
    }
  },
  //事件处理函数
  gotoDetail: function (event) {
    // console.log("bindtap");
    let dataset = event.currentTarget.dataset;
    let { title, uuid } = dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?title=${title}&uuid=${uuid}`,
      success: function () {
        // console.log("跳转成功");
      },
      fail: function (e) {
        console.log("调用失败...." + JSON.stringify(e));
      }
    })
  },
  onLoad: function () {
    this.getBlogList(1);
  },
  getBlogList: function (page, callback,type){
    let {index}=this.data;
    let params={}
    if (index==0){
      params.search_field="pv";
    } else if (index == 1){
      params.search_field = "cv";
    } else if (index == 2){
      params.search_field = "pv";
    }
    fetch.post("wx/blogList", {
      page: page==null?1:page,
      params
    },true).then((data) => {
      let blogs = data.models;
      let pageSize=data.pageSize;
      let total=data.total;
      blogs.forEach((item) => {
        // console.log(item);
        item.date=item.date.split(' ')[0];
        if (item.pic == null){
          item.pic = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522064329150&di=2721521f8b17e71ffea9625563f9a2ce&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F014fa5582d5ae2a84a0e282b39f87e.jpg";
        }
        // item.msg = '200';
        // item.time = '20180-01-23';
        // item.eye = '100000';
      })
      var bls = this.data.blogs.concat(data.models);
      // bls= type == "refrsh" ? data.models:bls;
      if (type == "refrsh"){
        this.setData({
          blogs:[],
          page:1
        });
        bls = data.models;
      }

      this.setData({
        blogs: bls,
        pageSize,
        total
      })
      callback == null ? function(){}:callback();
    }).catch((err) => {
      console.log(err);
      callback == null ? function () { } : callback();
    })
  }
})
