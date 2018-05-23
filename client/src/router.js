import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import UserCrud from './views/UserCrud.vue'
import Question from './views/Question.vue'
import Login from './views/Login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/user',
      name: 'user',
      component: UserCrud
    },
    {
      path: '/question/:user',
      name: 'question',
      component: Question
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
