import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '@/views/index.vue'
import gamesCon from '@/views/gamesCon.vue'
import mingxipage from '@/components/mingxipage.vue'
import aa from '@/views/aa.vue'
import gamesRecord from '@/views/gamesRecord.vue'
Vue.use(VueRouter)

var router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      name: 'index',
      path: '/index',
      component: index
    },
    {
      name: 'mingxipage',
      path: '/mingxipage',
      component: mingxipage
    },
    {
      name: 'gamesCon',
      path: '/gamesCon',
      component: gamesCon
    },
    {
      name: 'aa',
      path: '/aa',
      component: aa
    },
    {
      name: 'gamesRecord',
      path: '/gamesRecord',
      component: gamesRecord
    }
  ]
})
export default router
