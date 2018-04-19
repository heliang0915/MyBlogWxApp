//app.js
let fetch = require("/utils/fetch.js");
App({
  onLaunch: function () {
    // alert("onLaunch");


   let getWindowInfo=()=>{
     var w=wx.getSystemInfoSync().windowWidth;
     var h = wx.getSystemInfoSync().windowHeight;
     this.globalData.w = w;
     this.globalData.h= h;
   } 

    // 登录系统更新登录时间等信息
    let updateUserInfo = (openid) => {
      fetch.get(`wx/updateInfo/${openid}`,false).then((response) => {
          console.log(response);
      });
    }
    var self=this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res.code)  
        let {code} = res;
        if (code){
          fetch.get(`wx/login/${code}`,false).then((resp)=>{
             wx.getUserInfo({
               success: function (res) {
                 console.log(res);
                 let userInfo=res.userInfo;
                 let { openid } = resp;
                 self.globalData.userInfo = userInfo;
                 self.globalData.openid = openid;
                 //调用后台接口看是否需要注册用户
                 fetch.get(`wx/exist/${openid}`,false).then((exist) => {
                   //返回true代表已经创建
                   if (!exist) {
                     //创建用户信息
                     let user = {
                       nickName: userInfo.nickName,
                       tid: openid,
                       loginType:1,
                       roleId:'3e709f4c5ed34dd284de3c7a7e4a7ea3',
                       pic: userInfo.avatarUrl
                     }
                      // 注册用户
                     fetch.post(`wx/wxRegister`, user).then((result) => {
                        console.log(result);
                        //登录系统更新登录时间等信息
                        updateUserInfo(openid);
                     })
                   }else{
                      //登录系统更新登录时间等信息
                     updateUserInfo(openid);
                   }
                 })
               }
             });
           })
         }
         
      }
    })
  },
  globalData: {
    userInfo: null,
    openid:null,
    w:null,
    h:null
  }
})