
import conf from './conf';
import {WxService} from "./api/index"
import crypto from 'crypto'
import {Measure} from "./api/index"
var oproto = Object.prototype;
var serialize = oproto.toString;
var Rxports = {

//判断当前打开的浏览器是否是微信浏览器
	isWeiXin:function() {
		var ua = window.navigator.userAgent.toLowerCase();
		return ua.match(/MicroMessenger/i) == 'micromessenger' ? true:false;
	},
	goToAuthView(){
		let appId = conf.wxAppId;
		let selfUrl = escape(window.location.href);
		let targetUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${selfUrl}&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect`;
		window.location.href = targetUrl
	},
	getLocalJson:function (name) {
		var data = window.localStorage.getItem(name);
		if (data == null || data == ""){
			return "";
		}
		try {
			return JSON.parse(data);
		}catch (e) {
			return "";
		}
	},
	setLocalJson(name,data){
		let jsonString = JSON.stringify(data);
		window.localStorage.setItem(name,jsonString);
	},
	getFullUrlQuery:function (name) {
		let variable = this.getUrlQuery(name);
		if (variable == null || variable == ""){
			variable = this.getUrlQuery(name,location.hash);
		}
		return variable;
	},
	/**
	 * 获取url传过来的参数
	 * @param name 	获取的参数
	 * @param Url 		自定义获取参数的链接
	 * @param return
	 */
	getUrlQuery:function (name,Url){
		//URL GET 获取值
		var reg = new RegExp("(^|\\?|&)"+ name +"=([^&]*)(\\s|&|$|#)", "i"),url = Url || location.search;
		if (reg.test(url)){
			return decodeURI(RegExp.$2.replace(/\+/g, " "));
		}
		return "";
	},
	getCurrentHashKey(){
		let user = this.getLocalJson("referUserMsg");
		let path = window.location.pathname;
		let key = `${user["username"]}${user["gen"]}${user["dt"]}${path}`;
		console.log(key);
		var md5 = crypto.createHash("md5");
		md5.update(key);
		return md5.digest('hex');
	},
	getCashOrderId(){
		console.log("当前信息指纹",this.getCurrentHashKey());
		return window.localStorage.getItem(this.getCurrentHashKey());
	},
	checkEnv(){
		if (this.isWeiXin()){
			let userInfo = this.getLocalJson("userInfo");
			if (userInfo != null && userInfo != ""){
				return;
			}
			this.checkCode();
		}
	},
	goToByResult(orderId,successCallBack,error,isNeedPay){
		if (this.isEmpty(orderId)) {
			if(error) error();
			return;
		}
		Measure.queryMeasureInfo(orderId,isNeedPay).then((success) => {
			if(success['isPay'] != null && success['isPay']) {
				if (successCallBack) successCallBack(success);
			}else{
				if(error) error(success);
			}
		}).catch(() => {
			if(error) error()
		})
	},
	checkCode(){
		let authCode = this.getFullUrlQuery("code");
		if(authCode == null || authCode == "") {
			this.goToAuthView();
		} else {
			WxService.getUserInfo(authCode).then((success) => {
				this.setLocalJson("userInfo",success);
			}).catch(()=>{
				alert("登录异常!");
				window.location.href = this.getCurrentViewBaseUrl();
			});
		}
	},
	isEmpty(string){
		if (string == null || string == ""){
			return true;
		}
		return false;
	},
	getCurrentViewBaseUrl:function (){
		let protocol = window.location.protocol
		let host = window.location.host;
		let chanelNo = this.getFullUrlQuery("channelNo");
		let search = "";
		if (chanelNo != null && chanelNo != ""){
			search = `?channelNo=${chanelNo}`
		}
		return `${protocol}//${host}/${search}`
	},
	initJsApiSignature:function(){
		let url = window.location.href;
		WxService.getJsApiSignature(url).then((success) => {
			wx.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: success['appId'], // 必填，公众号的唯一标识
				timestamp: success['timestamp'], // 必填，生成签名的时间戳
				nonceStr: success['nonceStr'], // 必填，生成签名的随机串
				signature: success['signature'],// 必填，签名，见附录1
				jsApiList: ['chooseWXPay','onMenuShareTimeline','onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
		});

	},
	onMenuShareAppMessage:function(){
		wx.onMenuShareAppMessage({
			title: '测试分析', // 分享标题
			desc: '测试描述', // 分享描述
			link: this.getCurrentViewBaseUrl(), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: '', // 分享图标
			type: 'link', // 分享类型,music、video或link，不填默认为link
			success: function () {
				// 用户确认分享后执行的回调函数
			},
			cancel: function () {
				// 用户取消分享后执行的回调函数
			}
		});
	},

	setInfo: function (k, v) {
		window.localStorage.setItem(k, JSON.stringify(v));
	},

	//读取永久数据
	getInfo: function (k) {
		var data = window.localStorage.getItem(k);
		if (data == null || data == ""){
			return "";
		}
		try {
			return JSON.parse(data);
		}catch (e) {
			return "";
		}
	},

	//删除永久数据
	removeInfo: function (k) {
		window.localStorage.removeItem(k);
	},

    //获取当前页面的url
    getCurrentViewBaseUrl:function () {
        let protocol = window.location.protocol
        let host = window.location.host;
        return protocol+"//"+host
    }

};


export default Rxports;


































