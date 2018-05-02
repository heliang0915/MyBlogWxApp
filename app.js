//app.js
let fetch = require("/utils/fetch.js");
App({
  onLaunch: function () {


  // var worker = wx.createWorker('workers/request/index.js')
  // worker.postMessage({
  //     msg: 'hello worker'
  // })

   let getWindowInfo=()=>{
     var w=wx.getSystemInfoSync().windowWidth;
     var h = wx.getSystemInfoSync().windowHeight;
     this.globalData.w = w;
     this.globalData.h= h;
   } 

    // 登录系统更新登录时间等信息
    let updateUserInfo = (openid) => {
      fetch.get(`wx/updateInfo/${openid}`,false).then((response) => {
          // console.log(response);
      });
    }
    var self=this;




    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(res.code)  
        let {code} = res;
        if (code){
            console.log("登录");
          fetch.get(`wx/login/${code}`,false).then((resp)=>{
             wx.getUserInfo({
               success: function (res) {
                //  console.log(res);
                 let userInfo=res.userInfo;
                 let { openid,token } = resp;
                 self.globalData.userInfo = userInfo;
                 self.globalData.openid = openid;
                 //调用后台接口看是否需要注册用户
                 fetch.get(`wx/exist/${openid}`, false).then((token) => {
                   //返回true代表已经创建
                   if (!token) {
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
                       self.globalData.token = result;
                        //登录系统更新登录时间等信息
                        updateUserInfo(openid);
                     })
                   }else{
                     self.globalData.token = token;
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
    token:null,
    w:null,
    h:null
  }
})