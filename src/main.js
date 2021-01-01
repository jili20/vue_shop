import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css' // 导入全局样式表
import './plugins/element'
import './assets/fonts/iconfont.css' // 导入字体图标
import axios from 'axios' // 导入 axios
import TreeTable from 'vue-table-with-tree-grid' // 导入树形分类组件

Vue.prototype.$http = axios // 全局挂载
// 配置请求的根路径
// axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// axios.defaults.baseURL = 'http://119.23.53.78:8888/api/private/v1/'
axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
// 配置 axios 请求拦截器
// config 请求对象
axios.interceptors.request.use(config => {
  console.log(config)
  // 为请求头对象，添加 Token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable) // 注册树形分类组件

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
