<template>
	<div class="container">

		<!--图片第一部分-->
		<div class="bg-top">
			<img src="~assets/images/index1.png" alt="" @click="imgClick"/>
		</div>
		<!--图片第二部分-->
		<div class="bg-middle">
			<img src="~assets/images/index3.png" alt="" @click="imgClick"/>
		</div>
		<!--测试者的信息-->
		<div class="msg">
			<ul class="msg-list">
				<li class="msg-item" :class="{'msg-item0':!showNameError,'msg-item1':showNameError}" >
					<span>您的姓名：</span>
					<input type="text" v-model="dataObj.username" maxlength="6"/>
					<img src="~assets/images/mandatory.png" alt="" class="mandatory"/>
				</li>
				<li class="msg-item" :class="{'msg-item0':!showSexError,'msg-item1':showSexError}">
					<span>您的性别：</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<img v-if="dataObj.gen === 1" src="~assets/images/select.png" alt="" class="sex" @click="changeSex(1)"/>
					<img v-else src="~assets/images/noSelect.png" alt="" class="sex" @click="changeSex(1)"/>
					<span class="sexFont">男</span>&nbsp;&nbsp;
					<img v-if="dataObj.gen === 0" src="~assets/images/select.png" alt="" class="sex" @click="changeSex(0)"/>
					<img v-else src="~assets/images/noSelect.png" alt="" class="sex" @click="changeSex(0)"/>
					<span class="sexFont">女</span>
					<img src="~assets/images/mandatory.png" alt="" class="mandatory"/>
				</li>
				<li class="msg-item" :class="{'msg-item0':!showDateError,'msg-item1':showDateError}">
					<span>出生日期：</span>
					<input @click="openPicker('picker1')" class="item-start" v-model="dataObj.dt" onfocus="this.blur();"
						   type="text">
					<datetime-picker @touchmove.native.prevent ref="picker1" id="dateWrap" class="dd"
									 v-model="pickerValue" :startDate="startDate" :endDate="endDate" type="date"
									 year-format="{value} 年" month-format="{value} 月" date-format="{value} 日"
									 @confirm="handleConfirm">
					</datetime-picker>
					<img src="~assets/images/mandatory.png" alt="" class="mandatory"/>
				</li>
				<li class="msg-item" :class="{'msg-item0':!showLocationError,'msg-item1':showLocationError}">
					<span>出生地点：</span>
					<input type="text" v-model="dataObj.place" onfocus="this.blur();" @click="choosePlace"/>
					<div class="shadow" v-show="shadow" @click="shadowShow" @touchmove.prevent>
						<div class="shadow-content">
							<div class="selectShadow">
							</div>
							<ul class="title">
								<li @click="close">取消</li>
								<li><img src="~assets/images/logo.png" alt=""/></li>
								<li @click="ensure">确定</li>
							</ul>
							<picker value-key="name" :slots="pickerSlots" @change="onValuesChange" class="bb"></picker>
						</div>
					</div>
					<img src="~assets/images/mandatory.png" alt="" class="mandatory"/>
				</li>
			</ul>
			<div @click="doAnalysis" class="analysis-box">
				<img src="~assets/images/button.png" id="btn_jx" alt="" class="analysis"/>
			</div>
		</div>
		<div class="bg-bottom">
			<img src="~assets/images/index2.png" alt="" @click="imgClick"/>
		</div>
	</div>
</template>

<script>
	import {DatetimePicker, Picker} from 'mint-ui'
	import Lib from 'assets/js/Lib';
	import {address} from 'assets/js/address.js'
	import {WxService} from "assets/js/api/index"
	export default {
		name: 'app',
		components: {
			DatetimePicker, Picker
		},
		data() {
			return {
                showDateError:false,
                showSexError:false,
                showNameError:false,
                showLocationError:false,
				dataObj: this.getDataObject(),
				pickerValue: new Date('1990'),
				startDate: new Date('1918'),
				endDate: new Date(),
				value: null,
				sheetVisible: false,
				shadow: false,
				provinces: address(),
				pickerSlots: [{
					flex: 1,
					values: [],
					className: 'slot1',
					textAlign: 'center'
				}, {
					divider: true,
					content: '|',
					className: 'slot2'
				}, {
					flex: 1,
					values: [],
					className: 'slot3',
					textAlign: 'center'
				}],
				val: '',
				province: '',
				city: '',
			}
		},
		watch: {
			dataObj: {
				handler(newValue, oldValue) {
					Lib.M.setInfo('referUserMsg', newValue)
				},
				deep: true
			}
		},
		computed: {},
		methods: {
			imgClick(e) {
				return false
			},
			changeSex(val) {
				this.dataObj.gen = val;
			},
			getDataObject() {
				let cash = Lib.M.getInfo('referUserMsg')
				return Lib.M.isEmpty(cash) ? {username: "", gen: 1, dt: "", place: ""} : cash;
			},
			openPicker(picker) {
				//判断是否是安卓4.3版本
				if (navigator.userAgent.indexOf('534.30') > 0) {
//					document.getElementById('dateWrap').style.left = '0';
					document.getElementById('dateWrap').style.zIndex = '99999'
				}
//				document.getElementsByClassName('msg-item')[2].style.background = 'url(../../../../assets/images/case.png)'
				document.getElementsByClassName('msg-item')[2].style.backgroundSize = '100%'
				console.log(this.pickerValue)
				this.$refs[picker].open()
				var i = 0;
				if (picker == 'picker1') {
					i = 0;
				} else {
					i = 1;
				}
				let div = document.getElementsByClassName('picker-toolbar')[i];
				console.log(div.childNodes.length);
				if (div.childNodes.length > 3) {

				} else {
					let newSpan = document.createElement('img');

					if (document.documentElement.clientWidth >= 640) {
						newSpan.setAttribute('style', 'padding:0 12%;width:24.5%;display:inline-block;text-align:center;line-height:40px;' );
					} else {
						newSpan.setAttribute('style', 'padding:.2rem 5%;width:38.5%;display:inline-block;text-align:center;line-height:40px;');
					}
//					newSpan.src='~assets/images/logo.png)';

					div.insertBefore(newSpan, div.childNodes[1]);
				}
				//处理出生日期下拉框两个 "|"问题
				let boundary = document.createElement('span')
				boundary.setAttribute('style', 'color:#fff;position:fixed;bottom:44%;left:35%;color:#0d6f9b;font-weight:bold;');
				boundary.innerHTML = '|'
				let boundary2 = document.createElement('span')
				boundary2.setAttribute('style', 'color:#fff;position:fixed;bottom:44%;right:35%;color:#0d6f9b;font-weight:bold;');
				boundary2.innerHTML = '|'
				document.getElementsByClassName('mint-popup')[0].appendChild(boundary)
				document.getElementsByClassName('mint-popup')[0].appendChild(boundary2)
			},
			//选择出生日期的提交
			handleConfirm(value) {
				let d = new Date(value.toString());
				let year = d.getFullYear();
				let month = (d.getMonth() + 1) > 9 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1);
				let day = d.getDate() > 9 ? d.getDate() : '0' + d.getDate();
				let youWant = year + '-' + month + '-' + day;
				this.dataObj.dt = youWant;
				console.log(youWant)
			},
			//选择出生地
			choosePlace() {
				this.shadow = true
				//判断是否是安卓4.3版本
				if (navigator.userAgent.indexOf('534.30') > 0) {
					document.getElementsByClassName('title')[0].style.display = 'inline-block'
				}
			},
			close() {
				this.shadow = false
			},
			ensure() {
				this.shadow = false
				this.dataObj.place = this.province + this.city
			},
			shadowShow() {
//				this.shadow = false
			},
			//选择出生地址的提交
			onValuesChange(picker, values) {
				picker.setSlotValues(1, this.provinces[values[0].id].citys);
				this.province = values[0].name;
				this.city = values[1];
				// this.id = values[0].id
				//input获取焦点时 弹框颜色恢复
				let pickerDom = document.getElementsByClassName('msg-item')[3];
				if (pickerDom != null) {

					pickerDom.style.background = `url(${caseImage}) no-repeat`
					pickerDom.style.backgroundSize = '100%'
				}
			},
			doAnalysis() {
				if (this.sexBoy == '~assets/images/select.png') {
					this.sex = 1
				} else {
					this.sex = 0
				}
				//添加友盟统计数据
				window._czc.push(["_trackEvent", "好财运", "性别", this.sex ? '男' : '女', '1']);
				window._czc.push(["_trackEvent", "好财运", "出生日期", this.birthday, '1']);
				window._czc.push(["_trackEvent", "好财运", "出生地点", this.dataObj.place, '1']);
				window._czc.push(["_trackEvent", "好财运", "立即解析点击", "立即解析点击", '1']);
				//判断信息为空的情况
				if (this.dataObj.username == '') {
                    this.showNameError = true;
					return false
				} else if (this.dataObj.dt == '') {
                    this.showDateError = true;
					return false
				} else if (this.dataObj.place == '') {
                    this.showLocationError= true;
                    return false
				} else {

					let orderId = Lib.M.getCashOrderId();

					if (Lib.M.isEmpty(orderId)) {
						this.$router.push('wait');
						return;
					}

					Lib.M.goToByResult(orderId, () => {
						this.$router.push({path: 'buyResult', query: {orderId: orderId}});
					}, () => {
						this.$router.push('wait')
					})

				}
			},

			_initLinkage() {
				//处理二级联动数据遍历问题
				let provincesArr = []
				let citysArr = []
				let index = [];
				for (var i = 0; i < this.provinces.length; i++) {
					var tempInfo = {
						'id': i,
						name: this.provinces[i].name
					};
					provincesArr.push(tempInfo)
				}
				for (var j = 0; j < this.provinces[0].citys.length; j++) {
					citysArr.push(this.provinces[0].citys[j]);
				}
				this.pickerSlots[0].values = provincesArr
				this.pickerSlots[2].values = citysArr
			},

		},
		mounted() {

		},
		created() {
			this._initLinkage();

		}
	}
</script>
<style>
	@import "edit.css";
</style>
<style lang="less" scoped="">
	@import "index.less";
</style>
