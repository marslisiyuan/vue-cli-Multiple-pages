<template>
	<div class="container" :style="styleObject">
		<div class="specialFont">
			<img src="~assets/images/font2.png" alt=""/>
		</div>
		<div class="effect-wrap">
			<img src="~assets/images/ball2.png" alt="" class="ball"/>
			<img src="~assets/images/effect2.png" alt="" class="effect"/>
			<img src="~assets/images/light2.png" alt="" class="light animated zoomIn infinite"/>
		</div>
		<div class="progress-wrap" v-show="i1">
			<!--<img :src="bg" alt="" class="progress"/>-->
			<img src="~assets/images/zero.png" alt="" class="percent"/>
		</div>
		<div class="progress-wrap" v-show="i2">
			<img src="~assets/images/2-25.png" alt="" class="progress"/>
			<img src="~assets/images/quarter.png" alt="" class="percent"/>
		</div>
		<div class="progress-wrap" v-show="i3">
			<img src="~assets/images/2-50.png" alt="" class="progress"/>
			<img src="~assets/images/half.png" alt="" class="percent"/>
		</div>
		<div class="progress-wrap" v-show="i4">
			<img src="~assets/images/2-75.png" alt="" class="progress"/>
			<img src="~assets/images/half_quarter.png" alt="" class="percent"/>
		</div>
		<div class="progress-wrap" v-show="i5">
			<img src="~assets/images/2-100.png" alt="" class="progress" style="width: 90%"/>
			<img src="~assets/images/all.png" alt="" class="percent"/>
		</div>
	</div>
</template>

<script>
	import Lib from 'assets/js/Lib';
	export default {
		data() {
			return {
				styleObject: {
					height: '100%'
				},
				percent: '~assets/images/zero.png',
				bg: "",
				dataObj: '',
				i1:true,
                i2:false,
                i3:false,
                i4:false,
                i5:false,
			}
		},
		methods: {},
		mounted() {
		},
		created() {
			Lib.M.removeInfo('isPrompt')
			Lib.M.removeInfo('err')
			//获取屏幕的高度
			var height = '';
			height = document.documentElement.clientHeight;
			this.styleObject.height = height + 'px';
			window.onresize = () => {
				console.log(document.documentElement.clientHeight)
				if (document.documentElement.clientHeight > document.body.clientHeight) {
					height = document.documentElement.clientHeight;
				} else {
					height = document.body.clientHeight;
				}
				this.styleObject.height = height + 'px';
			}
			let i = 0;
			//百分比定时计划
			let timer = setInterval(() => {
				i++;
				if (i == 1) {
                    	this.i1=false;
                        this.i2=true;
                        this.i3=false;
                        this.i4=false;
                        this.i5=false;
				} else if (i == 2) {
                    this.i1=false;
                    this.i2=false;
                    this.i3=true;
                    this.i4=false;
                    this.i5=false;
				} else if (i == 3) {
                    this.i1=false;
                    this.i2=false;
                    this.i3=false;
                    this.i4=true;
                    this.i5=false;
				} else if (i == 4) {

                    this.i1=false;
                    this.i2=false;
                    this.i3=false;
                    this.i4=false;
                    this.i5=true;
				} else {
//					//@todo 进度条到100%之后
					this.$router.replace('result')
					clearInterval(timer)
					return false

				}

			}, 600)
		}
	}
</script>

<style lang="less" scoped="">
	@import 'wait.less';
</style>
