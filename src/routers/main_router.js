import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/main/Hello'
import Detail from '@/components/main/Detail'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Hello',
            component: Hello
        },
        {
            path: '/detail',
            name: 'Detail',
            component: Detail
        }
    ]
})
