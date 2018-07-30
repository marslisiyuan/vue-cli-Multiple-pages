<template>
	<div class="container">
		<img src="~assets/images/result_logo.png" alt="" class="result-logo"/>
		<div class="result-content">
			<p class="username" @click="clearUserInfo">{{dataObj.username}}</p>
			<img src="~assets/images/paybuttonupdate.png" alt="" class="top-button" @click="analysis_result_top"/>
			<div class="notice-wrap">
				<img src="~assets/images/mandatory.png" alt="" class="mandatory"/>
				<img src="~assets/images/result_notice.png" alt="" class="result-notice"/>
			</div>
			<ul class="resutl-content">
				<li class="result-item">
					<img src="~assets/images/bird_one.png" alt="" class="bird-one"/>
					<img src="~assets/images/result_title1.png" alt="" class="result-title"/>
					<p class="result-text">
						<img src="~assets/images/font_shadow.png" alt="" class="font-shadow"/><span>个月后你会迎来本年度的第一波财运高峰，彼时你清晰的思维和周密的计划将为你赢得赚大钱的机会，或许是一笔奖金...</span>
					</p>
					<img src="~assets/images/verse_one.png" alt="" class="verse"/>
				</li>
				<li class="dervice">
					<img src="~assets/images/dervice.png" alt=""/>
				</li>
				<li class="result-item">
					<img src="~assets/images/bird_two.png" alt="" class="bird-two"/>
					<img src="~assets/images/result_title2.png" alt="" class="result-title"/>
					<img src="~assets/images/verse_two.png" alt="" class="verse"/>
				</li>
				<li class="dervice">
					<img src="~assets/images/dervice.png" alt=""/>
				</li>
				<li class="result-item">
					<img src="~assets/images/bird_three.png" alt="" class="bird-three"/>
					<img src="~assets/images/result_title3.png" alt="" class="result-title"/>
					<img src="~assets/images/verse_three.png" alt="" class="verse"/>
				</li>
				<li class="dervice">
					<img src="~assets/images/dervice.png" alt=""/>
				</li>
				<li class="result-item">
					<img src="~assets/images/result_title4.png" alt="" class="result-title"/>
					<img src="~assets/images/verse_four.png" alt="" class="verse"/>
				</li>
			</ul>
			<div class="button-wrap">
				<img src="~assets/images/paybuttonupdate.png" alt="" class="bottom-button" @click="analysis_result_bottom"/>
				<img src="~assets/images/bird_four.png" alt="" class="bird-four"/>
			</div>

			<div class="prompt" v-show="isPrompt">
				<img src="~assets/images/prompt_notice.png" alt="" class="prompt-notice"/>
				<ul class="prompt-list">
					<li class="prompt-item" @click="ensurePay" :class="{'prompt-item0':!showPayError,'prompt-item1':showPayError}">
						<img src="~assets/images/prompt_pay.png" alt="" v-show="payed"/>
						<img src="~assets/images/prompt_retry.png" alt="" v-show="reset"/>
					</li>
					<li class="prompt-item prompt-item0" @click="cancelPay">
						<img src="~assets/images/prompt_cancel.png" alt=""/>
					</li>
				</ul>
			</div>
			<div class="server" v-if="isService" @click="serviceClick">
				<img src="~assets/images/service_prompt.png" alt=""/>
			</div>
		</div>
	</div>
</template>
<script>
	import Lib from 'assets/js/Lib';
	import conf from "assets/js/conf"
	import {Measure} from "assets/js/api/index"

	export default {
		data() {
			return {
                showPayError:false,
				isPrompt: false,
				clearNumber: 0,
				orderId: "",
				buttonLock: false,
//				ensureUrl: 'static/images/prompt_pay.png',
//				changeResultUrl: 'static/images/result_button.png',
//				changeResultUrl_bottom: 'static/images/result_button.png',
				flag: true,
				ensureFlag: true,
				isService: false,
				payed:true,
				reset:false
			}
		},
		computed: {
			dataObj() {
				return Lib.M.getInfo('referUserMsg');
			},
			userInfo() {
				return Lib.M.getLocalJson("userInfo");
			},
			channelNo() {
				return Lib.M.getFullUrlQuery("channelNo")
			},
			isMWebPay: {
				cache: false,
				get() {
					let isMWebPay = window.localStorage.getItem("isMWebPay");
					return isMWebPay == null ? false : isMWebPay === "true" ? true : false;
				},
				set(val) {
					window.localStorage.setItem("isMWebPay", val)
				}
			}
		},

		methods: {
			clearUserInfo() {
				this.clearNumber = this.clearNumber + 1;
				if (this.clearNumber > 5) {
					window.localStorage.removeItem("userInfo");
					alert("恭喜恭喜,这是隐藏功能!")
				}
			},
			serviceClick() {
				this.isService = false
			},
			getBrandWCPayRequest(payParam, paySuccess) {
				WeixinJSBridge.invoke('getBrandWCPayRequest', payParam, paySuccess)
			},
			beforeAddMeasure() {
				let orderId = Lib.M.getCashOrderId();
				if (Lib.M.isEmpty(orderId)) {
					this.addMeasure();
					return;
				}
				this.buttonLock = false;
				Lib.M.goToByResult(orderId, () => {
					this.$router.replace({path: 'buyResult', query: {orderId: orderId}});
				}, error => {
					if (error != null && error['payData'] != null) {
						this.wxPay(error['payData'])
					}
				}, true);
			},
			addMeasure() {

				let measureData = {
					projectId: process.env.LUCK_MONEY_PROJECT_ID,
					channelNo: this.channelNo,
					lg: '0.0',
					la: '0.0',
					dt: this.dataObj.dt,
					gen: this.dataObj.gen,
				};

				if (Lib.M.isWeiXin()) {
					measureData['openId'] = this.userInfo['openId'];
					if (measureData['openId'] == null || measureData['openId'] == "") {
						alert("登录状态异常!");
						Lib.M.goToAuthView();
						return;
					}
				}

				Measure.addNewMeasure(measureData).then((success) => {
					this.addMeasureSuccess(success);
				}).catch(() => {
					this.buttonLock = false;
				});
			},
			wxPay(payData) {
				//准备支付信息
				let payParam = {
					'appId': payData['appId'],
					'timeStamp': payData['timeStamp'],
					'nonceStr': payData['nonceStr'],
					'package': payData['packageValue'],
					'signType': payData['signType'],
					'paySign': payData['paySign']
				};

				//如果是微信内部环境调用jssdk支付
				if (Lib.M.isWeiXin()) {
					this.getBrandWCPayRequest(payParam, (result) => {
						this.buttonLock = false;
						if (result['err_msg'] == 'get_brand_wcpay_request:ok') {
							window._czc.push(["_trackEvent", "好财运", "支付完成数", "支付完成数", '1']);
							Lib.M.goToByResult(this.orderId, () => {
								this.$router.replace({path: 'buyResult', query: {orderId: this.orderId}});
							})
						}
					});
					//如果是浏览器调用mweb支付
				} else {
					this.isMWebPay = true;
					this.isPrompt = true;
					this.buttonLock = false;
					window.location.href = payData['mwebUrl'];
				}
			},
			addMeasureSuccess(successData) {

				this.orderId = successData['orderId'];

				window.localStorage.setItem(Lib.M.getCurrentHashKey(), this.orderId)

				this.wxPay(successData['payData']);

			},
			analysis_result_top() {
				if (!this.buttonLock) {
					this.buttonLock = true;
					window._czc.push(["_trackEvent", "好财运", "解锁全部(上)点击", "解锁全部(上)点击", '1']);
					this.beforeAddMeasure();
				}
			},
			analysis_result_bottom() {
				if (!this.buttonLock) {
					this.buttonLock = true;
					window._czc.push(["_trackEvent", "好财运", "解锁全部(下)点击", "解锁全部(下)点击", '1']);
					this.beforeAddMeasure();
				}
			},
			/**
			 * 确认支付按钮，检查支付状态 如果已经支付跳转到结果页
			 */
			ensurePay() {
				//统计点击我已支付的点击个数
				window._czc.push(["_trackEvent", "好财运", "弹窗“我已付款”点击", "弹窗“我已付款”点击", '1']);
				//点击我已支付 框变颜色
//				document.getElementsByClassName('prompt-item')[0].style.background = "url(static/images/changePrompt_case.png) no-repeat"
//				document.getElementsByClassName('prompt-item')[0].style.backgroundSize = '100% 95%'
				this.showPayError = true;
				Lib.M.goToByResult(Lib.M.getCashOrderId(), () => {
					this.isMWebPay = false;
					this.isPrompt = false;
					this.$router.replace({path: 'buyResult', query: {orderId: Lib.M.getCashOrderId()}});
				}, () => {
					this.mWebPayError();
				});

			},
//			图片获取不到
			mWebPayError() {
//				document.getElementsByClassName('prompt-item')[0].style.background = "url(static/images/prompt_case.png) no-repeat"
//				document.getElementsByClassName('prompt-item')[0].style.backgroundSize = '100% 95%'
				this.showPayError=true;
//				this.ensureUrl = '~assets/images/prompt_retry.png'
				this.reset=true;
				this.payed=false;
			},
			cancelPay() {
				//统计点击取消的点击个数
				window._czc.push(["_trackEvent", "好财运", "弹窗“取消”点击", "弹窗“取消”点击", '1']);
				this.isMWebPay = false;
				this.isPrompt = false;
			},
			checkUserFrom() {
				if (this.dataObj == null) {
					this.$router.replace("index");
				}
			},
			lookAnswer() {
				this.changeResultUrl = 'static/images/look_answer.png'
				this.changeResultUrl_bottom = 'static/images/look_answer.png'
			}
		},
		destroyed() {
			this.isMWebPay = false;
			this.isPrompt = false;
		},
		mounted() {
			let orderId = Lib.M.getCashOrderId();
			if (!Lib.M.isEmpty(orderId)) {
				Lib.M.goToByResult(orderId, () => {
					this.$router.replace({path: 'buyResult', query: {orderId: orderId}});
				})
			}
			//针对QQ自带浏览器支付后页面跳转问题
			// if(getInfo('isPrompt')&&!getInfo('err')) {
			//   this.isPrompt = true
			// } else {
			//   this.isPrompt = false
			// }
			// if (this.isMWebPay === "true") {
			//   this.isPrompt = true;
			// }
			this.isPrompt = this.isMWebPay;
			this.checkUserFrom();
		},
	}
</script>
<style lang="less" scoped="">
	@import "result.less";
</style>
