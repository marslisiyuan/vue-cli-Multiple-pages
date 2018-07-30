<template>
	<div class="container">
		<div class="content-top">
			<img src="~assets/images/content_top.png" alt=""/>
			<p class="username">{{username}}</p>
		</div>
		<div class="content-middle">
			<div class="content-case">
				<ul class="result-conent">
					<li class="result-item" v-for="(item,index) in dataList">
						<p class="result-title">{{index+1+'.'}}{{item.title}}</p>
						<p class="result-text" v-html="replaceMethod(item.content)"></p>
					</li>
				</ul>
				<p class="extra">如有任何问题请联系客服</p>
				<p class="extra">工作时间:10:00~18:00</p>
				<p class="extra">QQ：2035311162</p>
			</div>
		</div>
		<div class="content-bottom">
			<img src="~assets/images/content_bottom.png" alt=""/>
		</div>
	</div>
</template>
<script>

	import Lib from 'assets/js/Lib';
	import {Measure} from "assets/js/api/index"

	export default {
		data() {
			return {
				dataList: [],
				username: '',
				appId: '',
				sign: '',
				timeStamp: '',
			}
		},
		computed: {
			orderId() {
				return Lib.M.getFullUrlQuery("orderId");
			}
		},
		methods: {
			replaceMethod(str) {
				return str.replace(/\r\n/g, "<br>")
			},
			payError() {
				alert("读取信息异常!");
				window.localStorage.removeItem(Lib.M.getCurrentHashKey());
				this.$router.replace("result");
			},
			showContent(content) {
				let contentArray = JSON.parse(content)
				for (let i = 0; i < contentArray.length; i++) {
					if (i == 2) {
						contentArray[i].content = contentArray[i].content
					} else {
						contentArray[i].content = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + contentArray[i].content
					}
				}
				this.dataList = contentArray
			},
			queryMeasureInfo() {

				Measure.queryMeasureInfo(this.orderId).then((success) => {
					let isPay = success['isPay'];

					if (isPay) {
						this.showContent(success['content']);
					} else {
						this.payError();
					}
				}).catch(() => {
					this.payError();
				});

			}
		},
		mounted() {
			this.queryMeasureInfo();
		},
		created() {
			Lib.M.removeInfo('isPrompt')
			Lib.M.removeInfo('err')
			this.username = Lib.M.getInfo('referUserMsg').username

		}
	}
</script>
<style lang="less" scoped="">
	@import 'buy_result.less';
</style>
