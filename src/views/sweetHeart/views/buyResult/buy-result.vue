<template>
	<div class="container">
		<div class="content-top">
			<img src="~assets/images/content_top2.png" alt="" />
			<p class="username">{{username}}</p>
		</div>
		<img src="~assets/images/zhe.png" alt="" class="zhe">
		<div class="content-middle" ref="printMe">
			<img src="~assets/images/356.png" class="button">

			<li class="result-item" v-for="(item,index) in dataList">
				<p class="result-title">{{index+1+'.'}}{{item.title}}</p>
				<p class="result-text" v-html="replaceMethod(item.content)"></p>
			</li>

			<p class="saomiao">扫 描 二 维 码 找</p>
			<p class="saomiao1">到 你 的 命 中 人</p>
			<img src="~assets/images/erweima.jpg" alt="这是二维码" class="erweima">

			<p class="extra">如有任何问题请联系客服</p>
			<p class="extra">电话：024-52874820</p>
			<p class="extra">工作时间:10:00~18:00</p>
			<p class="extra">QQ：2035311162</p>
		</div>
		<img :src="output" class="cover-img">
		<div class="content-bottom">
			<img src="~assets/images/content_bottom2.png" alt="" />
		</div>
	</div>
</template>

	<script>

	import Lib from 'assets/js/Lib';
	import {Measure} from "assets/js/api/index"
	require("babel-polyfill");
    import VueHtml2Canvas from 'vue-html2canvas'
    import Vue from 'vue'
    Vue.use(VueHtml2Canvas);
	export default {
		data() {
			return {
				dataList: [],
				username: '',
				appId: '',
				sign: '',
				timeStamp: '',
				output:null,
			}
		},
		computed: {
			orderId() {
				return Lib.M.getFullUrlQuery("orderId");
			}
		},
		methods: {
            async print() {
                const el = this.$refs.printMe;
                this.output = await this.$html2canvas(el, {
                    type: 'dataURL'
                });
            },
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
				console.log()
                for(let i = 0; i < contentArray.length; i++) {
                    if(contentArray[0].content=='') {
                        contentArray[0].content ='近期看起来并不是期待命中人的最佳时段哦，稍安勿躁，静待时机吧.'
                    } else if(contentArray[1].content==''){
                        contentArray[1].content = '近期看起来并不是期待命中人的最佳时段哦，稍安勿躁，静待时机吧。'
                    } else if(contentArray[2].content==''){
                        contentArray[2].content = '近期看起来并不是期待命中人的最佳时段哦，稍安勿躁，静待时机吧。'
                    } else if(contentArray[3].content==''){
                        contentArray[3].content = '近期看起来并不是期待命中人的最佳时段哦，稍安勿躁，静待时机吧。'
                    }else {
                        contentArray[i].content=contentArray[i].content
                    }
                }
				this.dataList = contentArray
                this.$nextTick(()=>{
                    this.print()
                })
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
