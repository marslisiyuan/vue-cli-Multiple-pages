// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import FastClick from 'fastclick'
import conf from 'assets/js/conf'
import Lib from 'assets/js/Lib';
require('assets/css/reset.css');
require('assets/css/animate.css');
require('assets/js/flexble.js');
FastClick.attach(document.body);

Vue.config.productionTip = false
Lib.M.checkEnv();
if (Lib.M.isWeiXin()){
	Lib.M.initJsApiSignature();
	Lib.M.onMenuShareAppMessage();
}

var _czc = _czc || [];
//绑定siteid，请用您的siteid替换下方"XXXXXXXX"部分
_czc.push(["_setAccount", conf.cnzzKey]);

import index from './views/index/index'
import wait from './views/wait/wait'
import result from './views/result/result'
import buyResult from './views/buyResult/buy-result'
Vue.use(VueRouter);
const routes = [
	{ path: '/', redirect: '/index' },

	{
		path: '/index',
		component: index,
		meta:{
			keepAlive: true // 需要被缓存
		}
	},

	{
		path: '/wait',
		component: wait,
		meta:{
			keepAlive: false // 需要被缓存
		}
	},

	{
		path: '/result',
		component: result,
		meta: {
			keepAlive: false // 需要被缓存
		}
	},
	{
		path: '/buyResult',
		component: buyResult,
		meta: {
			keepAlive: false // 需要被缓存
		}
	},
];


/* eslint-disable no-new */
new Vue({
	router: new VueRouter({
		routes:routes
	})
}).$mount('#app');

import 'mint-ui/lib/style.css'
