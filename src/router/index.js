import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Swap from '../components/Swap.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MenuList',
      component: MenuList
    },
    {
      path: '/swap',
      name: 'Swap',
      component: Swap
    }
  ]
})
