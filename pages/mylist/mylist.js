//mylist.js
//获取应用实例
const app = getApp();
let fetch = require("../../utils/fetch.js");
Page({
    data: {
      blogs: [],
      page: 1,
      pageSize: 0,
      total: 0,
      isMore: true,
      isShow: true
    },
    getBlogList: function (page, callback, type) {
      fetch.post("wx/blogList", {
        page: page == null ? 1 : page,
        params: {}
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
        let { title } = option;
        title="aaa";
        wx.setNavigationBarTitle({
          title
        })
        this.getBlogList(1);
    }
})
