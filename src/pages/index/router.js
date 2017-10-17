import Vue from 'vue'
import Router from 'vue-router'
import App from './components/App'

Vue.use(Router)

export default new Router({
    mode: 'history',
    scrollBehavior (to, from, savedPosition) {
      return { x: 0, y: 0 }
    },
    routes: [{
        path: '/',
        name: 'index',
        component: App
    }]
})
