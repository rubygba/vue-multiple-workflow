// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import fastclick from 'fastclick'
import cookies from 'js-cookie'
// import cache from 'web-storage-cache'
// import VueTouchRipple from 'vue-touch-ripple'

import App from './vue/App.vue'
import * as filters from '@/common/js/filters.js'
import router from './router.js'
// import store from './vuex'

Vue.config.productionTip = false

// fastclick
fastclick.attach(document.body, {})

Vue.prototype.$cookies = cookies
// Vue.prototype.$cache = new cache
// Vue.use(VueTouchRipple)

// 全局注册过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    // store,
    template: '<App/>',
    components: { App }
})
