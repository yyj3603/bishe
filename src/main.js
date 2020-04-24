// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import {sum,minus} from './util' /*可删除 */
import VueLazyLoad from 'vue-lazyload'/*图片懒加载*/
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'
import ElementUI from 'element-ui';/*elementUI*/
import 'element-ui/lib/theme-chalk/index.css';/*elementUI*/
import BaiduMap from 'vue-baidu-map' /*百度地图*/
import VCharts from 'v-charts' /*图表插件*/
Vue.config.productionTip = false
Vue.use(Vuex);
Vue.use(ElementUI);
Vue.use(VCharts);
Vue.use(VueLazyLoad,{
  loading:"/static/loading-svg/loading-bars.svg"
})
/*无限滚动*/
Vue.use(infiniteScroll)
/*全局过滤器之currency货币格式化*/
Vue.filter("currency",currency)
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: '8FcAX26l27MP7rk3mFXcBvIx580OH8nO'
})
console.log(`sum:${sum(2,4)}`)
console.log(`minus:${minus(10,8)}`)

/*一个简单完整的Vuex的对于状态管理的操作*/
const store = new Vuex.Store({
  state:{
    nickName:'',/*用户名*/
    cartCount:0,/*购物车数量*/
  },
  mutations:{
    updateUserInfo(state,nickName){
      state.nickName = nickName;
    },
    updateCartCount(state,cartCount){
      state.cartCount+=cartCount;
    },
    //初始化赋值
    initCartCount(state,cartCount){
      state.cartCount=cartCount;
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render:h=>h(App)
}).$mount("#app")
