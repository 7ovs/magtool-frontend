import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Login from '@/components/Login'
import Control from '@/components/Control'
import Links from '@/components/Links'

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
      beforeEnter: checkAuth,
      children: [
        {
          path: '/',
          name: 'control',
          component: Control
        },
        {
          path: '/links',
          name: 'links',
          component: Links
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
