//获取应用实例
const app = getApp()
let fetch = require("../../utils/fetch.js");
let WxParse = require('../../lib/wxParse/wxParse.js');
Page({
  data: {
    uuid:'',
    publishTxt:'',
    playholder:'输入评论...',
    pid:'',//回复上级ID
    type:1,//默认是评论
    blog:{},
    focus:false,
    ary:[],
    token: null,
    isZan:false
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
      focus:true,
      playholder: `回复${name}`,
      type: 2,
      pid: uuid
    })
  },

  //设置当前为评论状态
  setComment(e){
    this.setData({
      focus: false,
      playholder: `输入评论...`,
      type:1
    })

  },

  //发送评论
  send:function(){
    let { publishTxt, blog, type,pid}=this.data;
    let { userInfo}=app.globalData;
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
        // setTimeout(() => {
          this.getComments(false)
        // }, 1000)
        wx.showToast({
          title,
          duration: 1000
        })
    });

  },
  getBlogContent:function(){
    let { uuid } = this.data;
    var that = this;
    fetch.get(`wx/blogSingle/${uuid}`).then((data) => {
      // console.log(data.module);
        this.setData({
          blog: data.module
        })

        WxParse.wxParse('content', 'html', data.module.content, that,5);
        this.getComments();
      })
  },
  // 获取评论列表
 getComments(isShow){
   let { blog } = this.data;
   isShow=isShow==null?true:false;
   fetch.get(`comment/getComments/${blog.uuid}`, isShow).then((data) => {
      this.setData({
        ary: data
      })
    })
 },

//获取点赞状态
getZanState(){
  let { uuid, token } = this.data;
  fetch.post(`wx/getZan`, {
    token,
    blogId: uuid
  }).then((isZan) => {
    console.log(isZan);
    this.setData({
        isZan    
    })
  });
},
 addZan(){
   let { uuid, token ,isZan} = this.data;
  //  let isZan=this.data.;
  //  isZan = !isZan;
   var that = this;
   fetch.post(`wx/blogZan`,{
     token,
     isZan: !isZan,
     blogId: uuid
   },false).then((data) => {
    //  console.log(data);
     wx.showToast({
       title: `${!isZan == true ?'点赞':'取消'}${data=='ok'?'成功':'失败'}`,
       icon:'none',
       duration: 2000
     })

     this.setData({
       isZan: !isZan
     })

   })
 },
  onLoad: function (option) {
    let {title,uuid}=option;
    // console.log(uuid);
    this.setData({
       uuid,
       token: app.globalData.token
    },()=>{
      // console.log(">>>>" + app.globalData.token);
      this.getBlogContent();
      this.getZanState();
      // this.addZan();
    });
    wx.setNavigationBarTitle({
      title: option.title
    })
    
  }
})