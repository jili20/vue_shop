import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入全局样式表
import './assets/css/global.css'
import './plugins/element'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入 axios
import axios from 'axios'

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

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
