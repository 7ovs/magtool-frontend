import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Login from '@/components/Login'

Vue.use(Router)

var checkAuth = (to, from, next) => {
  if (Vue.session.isValid) next()
  else next('/login')
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      beforeEnter: checkAuth
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
