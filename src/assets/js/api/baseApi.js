import axios from 'axios';
import conf from '../conf'
import Lib from 'assets/js/Lib';
import qs from 'qs'
import objectAssign from "object-assign";
const service = axios.create({
  baseURL: conf.logicServerUrl, // api的base_url
  responseType: 'json',
  timeout: 60*1000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  // if (store.getters.token) {
  //   // config.params['appToken'] = document.getElementById("appId").value;
  // }
  const signData = {
    appId:document.getElementById('appId').value,
    appSign:document.getElementById('sign').value,
    appTime:document.getElementById('timeStamp').value,
    sceneEnum:Lib.M.isWeiXin() ? "JSAPI":"HTML"
  }

  config.data = qs.stringify(objectAssign(signData,config.data))
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

service.interceptors.response.use(response => {
  const res = response['data']
  if (res.statusCode !== 200) {
    return Promise.reject(res)
  } else {
    return res['data']
  }
}, error => {
  console.log('err' + error)// for debug
  return Promise.reject(error)
})

export default service

