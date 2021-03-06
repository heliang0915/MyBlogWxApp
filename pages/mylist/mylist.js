//mylist.js
//获取应用实例
const app = getApp();
let fetch = require("../../utils/fetch.js");
Page({
    data: {
      blogs: [],
      listType:1,
      page: 1,
      pageSize: 0,
      total: 0,
      isMore: true,
      isShow: true,
      contentHeight: wx.getSystemInfoSync().windowHeight+60
    },
    loadMore: function () {
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
          console.log("跳转成功");
        },
        fail: function (e) {
          console.log("调用失败...." + JSON.stringify(e));
        }
      })
    },
    getBlogList: function (page, callback, type) {
      let { listType}=this.data;
      fetch.post("wx/myList", {
        token: app.globalData.token,
        listType,
        page,
      }, true).then((data) => {
        let blogs = data.models;
        let pageSize = data.pageSize;
        let total = data.total;
        blogs.forEach((item) => {
          // console.log(item);
          item.date = item.date.split(' ')[0];
          if (item.pic == null) {
            item.pic = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522064329150&di=2721521f8b17e71ffea9625563f9a2ce&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F014fa5582d5ae2a84a0e282b39f87e.jpg";
          }
          // item.msg = '200';
          // item.time = '20180-01-23';
          // item.eye = '100000';
        })
        var bls = this.data.blogs.concat(data.models);
        // bls= type == "refrsh" ? data.models:bls;
        if (type == "refrsh") {
          this.setData({
            blogs: []
          });
          bls = data.models;
        }

        this.setData({
          blogs: bls,
          pageSize,
          total
        })
        callback == null ? function () { } : callback();
      }).catch((err) => {
        console.log(err);
        callback == null ? function () { } : callback();
      })
    },
    onLoad: function (option) {
        let { title ,type} = option;
        wx.setNavigationBarTitle({
          title
        })
        this.setData({
          listType: type
        })
        this.getBlogList(1);
    }
})
