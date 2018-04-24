
  let globalConfig=require("../config.js");
// console.log(globalConfig.api);
  let fetch=config=>{
      let {url,method,data,isShow}=config;
      url = globalConfig.api+url;
      // url+=(url.indexOf("?") > -1?'&':'?')+"temp="+Math.random();
      // console.log(`url>>>${url}`);
      console.log(`%c URL Fetch:${url}`, `color:#409EFF`);
      method=method == null ? "GET":method;
      data=data==null?{}:data;

      if (isShow==null){
        isShow=true;
      }
      
      isShow?wx.showLoading({
        title: '加载中'
      }):null;
      wx.showNavigationBarLoading();
      return new Promise((resolve,reject)=>{
          wx.request({
          url: url, //仅为示例，并非真实的接口地址
          data: data,
          method,
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            // console.log(res.data)
            resolve(res.data);
            wx.hideNavigationBarLoading() //完成停止加载
            isShow ?wx.hideLoading():null;
          },
          fail:function(error){
            reject(error);
            wx.hideNavigationBarLoading() //完成停止加载
            isShow ?wx.hideLoading():null;
          }
          })
      })
}

let post = (url, data, isShow)=>{
  return fetch({ url, method: 'POST', data, isShow})
}
let get = (url,isShow) => {
  return fetch({ url, isShow})
}
module.exports={
  post: post,
  get: get
}