import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router'

router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'shortcut icon';
    link.src = './assets/logo.png';
    document.getElementsByTagName('head')[0].appendChild(link);

    next()
})

createApp(App).use(router).mount('#app')
