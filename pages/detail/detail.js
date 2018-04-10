//index.js
//获取应用实例
const app = getApp()
let fetch = require("../../utils/fetch.js");
Page({
  data: {
    uuid:'',
    publishTxt:'',
    playholder:'输入评论...',
    pid:'',//回复上级ID
    type:1,//默认是评论
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
  replay:function(e){
    console.log(e.currentTarget.dataset);
    let { name,uuid} = e.currentTarget.dataset;

      this.setData({
        playholder: `回复${name}`,
        type: 2,
        pid: uuid
      })
  },

  //设置当前为评论状态
  setComment(e){
    this.setData({
      playholder: `输入评论...`,
      type:1
    })
  },

  //发送评论
  send:function(){
    let { publishTxt, blog, type,pid}=this.data;
    let { userInfo}=app.globalData;
    // this.
    // console.log(this.data.publishTxt);
    
     let comment={};
     comment.content = publishTxt;
     comment.blogId=blog.uuid;
     comment.type = type;
     comment.userId =app.globalData.openid;
     comment.userName = app.globalData.userInfo.nickName;
     comment.source=1;//微信用户
     comment.pid = pid;
     console.log(comment);
    
     fetch.post("comment/save", comment, true).then((data) => {
        console.log(data);
        let title = type == 1 ? "评论成功" : "回复成功";
        if (data!="ok"){
          title=data;
        }
        this.setData({
          publishTxt: ''
        })
        wx.showToast({
          title,
          // icon:'none',
          duration: 2000
        })
        setTimeout(()=>{
          this.getComments()
        },2000)
    });

  },
  getBlogContent:function(){
    let { uuid } = this.data;
    fetch.get(`article/single/${uuid}`).then((data) => {
        this.setData({
          blog: data.module
        })
        this.getComments();
      })
  },
  // 获取评论列表
 getComments(){
   let { blog } = this.data;
  //  console.log(blog);
    // let {}=this.data;
      
   fetch.get(`comment/getComments/${blog.uuid}`).then((data) => {
    //  console.log(data);
      this.setData({
        ary: data
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
