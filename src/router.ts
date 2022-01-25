import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import ColumnDetail from '@/views/ColumnDetail.vue'
import CreatePost from '@/views/CreatePost.vue'

const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { redirectAlreadyLogin: true }
    },
    // {
    //   path: '/signup',
    //   name: 'signup',
    //   component: Signup,
    //   meta: { redirectAlreadyLogin: true }
    // },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      meta: { requiredLogin: true }
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    }
    // {
    //   path: '/posts/:id',
    //   name: 'post',
    //   component: PostDetail
    // }
  ]
})
router.beforeEach((to, from, next) => {
  next()
})

export default router
