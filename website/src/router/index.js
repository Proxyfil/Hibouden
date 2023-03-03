import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import CardsPage from '../pages/CardsPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: {
      title: 'Accueil',
      icon: '../assets/logo.png'
    }
  },
  {
    path: '/cards',
    name: 'cards',
    component: CardsPage,
    meta: {
      title: 'Cartes',
      icon: '../assets/logo.png'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
