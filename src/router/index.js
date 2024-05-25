import Vue from 'vue'
import VueRouter from 'vue-router'
import SearchView from '@/views/SearchView.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: SearchView,
  },
  {
    path: '/car/:vin',
    component: function () {
      return import('@/views/CarView.vue')
    },
    props: true,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
