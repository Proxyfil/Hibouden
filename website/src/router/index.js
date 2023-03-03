import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import CardsPage from '../pages/CardsPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/cards',
    name: 'cards',
    component: CardsPage
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
