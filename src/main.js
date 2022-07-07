// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import Home from './components/HelloFromVux'
import Swap from './components/Swap'
import MenuList from './components/MenuList'
import Ido from './components/Ido'
import IdoItem from './components/IdoItem'
import Announcement from './components/Announcement'
import Announitem from './components/Annouitem'
import { AjaxPlugin, LoadingPlugin,ToastPlugin} from 'vux'

Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)


// 默认参数
Vue.use(ToastPlugin, {position: 'top'})
Vue.use(AjaxPlugin)
Vue.use(VueRouter)


const routes = [{
  path: '/',
  component: MenuList
},
{
  path:'/swap',
  component : Swap
},
{
  path:'/Ido',
  component : Ido
},{
  path:'/IdoItem',
  component : IdoItem
},{
  path : '/Announcement',
  component : Announcement
},
{
  path : '/Announitem',
  component : Announitem
}]

const router = new VueRouter({
  routes
})

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
