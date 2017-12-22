import Vue from 'vue'
import Router from 'vue-router'
import Index from './vue/App'

Vue.use(Router)

var router = new Router({
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        return {x: 0, y: 0}
    },
    routes: [{
        path: '*', // warning!
        name: 'unnamed',
        component: Index
    }, {
        path: '/', // warning!
        name: 'home',
        component: Index
    }, {
        path: '#update',
        name: 'update',
        component: Update
    }, {
        path: '#book',
        name: 'book',
        component: Book
    }, {
        path: '#read',
        name: 'read',
        component: Read
    }, {
        path: '#userIndex',
        name: 'userIndex',
        component: UserIndex
    }, {
        path: '#userFavorite',
        name: 'userFavorite',
        component: UserFavorite
    }, {
        path: '#myBalance',
        name: 'myBalance',
        component: MyBalance
    }, {
        path: '#usersBooks',
        name: 'userBooks',
        component: UsersBooks
    },{
        path: '#chapterList',
        name: 'chapterList',
        component: ChapterList
    }]
})

// 自制，history-hash路由跳转配置
// 暂不支持嵌套路由、动态路由
router.beforeEach((to, from, next) => {
    console.log(to)
    // 包含hash时，根据hash重定向到指定组件
    if (to.hash) {
        const i = to.hash.indexOf('?')
        let params = {}
        if (i > -1) {
            // 包含query时，解析hash中query
            let query = to.hash.substr(i + 1)
            let strs = query.split('&')
            for (let j = 0; j < strs.length; j++) {
                params[strs[j].split('=')[0]] = unescape(strs[j].split('=')[1])
            }
            router.replace({name: to.hash.substring(1, i), query: params})
        } else {
            router.replace({name: to.hash.substring(1)})
        }
    } else if (to.name && to.matched.length === 0) {
        router.replace({name: 'unnamed'})
    } else {
        next()
    }
})

export default router
