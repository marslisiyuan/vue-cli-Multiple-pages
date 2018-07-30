import baseApi from "../baseApi"
export default {

  getJsApiSignature:function(url){
    return baseApi({
      url: '/WxService/GetJsapiSignature',
      method: 'post',
      data:{
        url:url
      }
    })
  },
  getUserInfo:function(authCode){
    return baseApi({
      url: '/WxService/GetUserInfo',
      method: 'post',
      data:{
        authCode:authCode
      },
    })
  }
}
