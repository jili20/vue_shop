import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '@/components/Login'
// import Home from '@/components/Home'
// import Welcome from '@/components/Welcome'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Login')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Home')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Welcome')

// import Users from '@/components/user/Users'
// import Rights from '@/components/power/Rights'
// import Roles from '@/components/power/Roles'
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '@/components/user/Users')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '@/components/power/Rights')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '@/components/power/Roles')

// import Cate from '@/components/goods/Cate'
// import Params from '@/components/goods/Params'
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '@/components/goods/Cate')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '@/components/goods/Params')

// import List from '@/components/goods/List'
// import Add from '@/components/goods/Add'
const List = () => import(/* webpackChunkName: "List_Add" */ '@/components/goods/List')
const Add = () => import(/* webpackChunkName: "List_Add" */ '@/components/goods/Add')

// import Order from '@/components/order/Order'
// import Report from '@/components/report/Report'
const Order = () => import(/* webpackChunkName: "Order_Report" */ '@/components/order/Order')
const Report = () => import(/* webpackChunkName: "Order_Report" */ '@/components/report/Report')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next() 放行，next('/login') 强制跳转
  if (to.path === '/login') return next() // 如果访问登录页直接放行
  // 获取 token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login') // token 不存在跳转到登录页
  // http://localhost:8081/#/login
  // http://localhost:8081/#/home
  next() // 否则直接放行
})

export default router
