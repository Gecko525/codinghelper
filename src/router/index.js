import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/project'
  },
  {
    path: '/project',
    name: 'Project',
    component: () => import(/* webpackChunkName: "about" */ '../views/Project.vue')
  },
  {
    path: '/note',
    name: 'Note',
    component: () => import(/* webpackChunkName: "about" */ '../views/Note.vue')
  },
  {
    path: '/createProject',
    name: 'CreateProject',
    component: () => import(/* webpackChunkName: "about" */ '../views/CreateProject.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
