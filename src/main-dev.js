import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css' // 导入全局样式表
import './plugins/element'
import './assets/fonts/iconfont.css' // 导入字体图标
import axios from 'axios' // 导入 axios
import TreeTable from 'vue-table-with-tree-grid' // 导入树形分类组件
import VueQuillEditor from 'vue-quill-editor' // 导入富文本编辑器

// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 导入 请求进度条效果 NProgress 包对应的JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.prototype.$http = axios // 全局挂载

// 配置请求的根路径
// axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// axios.defaults.baseURL = 'http://119.23.53.78:8888/api/private/v1/'
axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'

// 配置 axios 请求拦截器
// config 请求对象
axios.interceptors.request.use(config => {
  NProgress.start() // 在 request 拦截器中，展示进度条 NProgress.start();
  // console.log(config)
  // 为请求头对象，添加 Token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})

// 在 response 拦截器中，隐藏进度条 NProgress.start();
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.config.productionTip = false
Vue.component('tree-table', TreeTable) // 注册树形分类组件
Vue.use(VueQuillEditor) // 将富文本编辑器，注册为全局可用的组件

// 自定义格式化时间的全局过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0') // 不足两位用 0 补充
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
