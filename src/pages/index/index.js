// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// import VueTouchRipple from 'vue-touch-ripple'
// import cache from 'web-storage-cache'
import cookies from 'js-cookie'
// import touch from 'vue-touch-easyhi'
import fastclick from 'fastclick'

import App from './components/App.vue'
import * as filters from '@/common/js/filters.js'

// import store from './vuex'
import router from './router.js'

Vue.config.productionTip = false

// Vue.use(VueTouchRipple)
// Vue.prototype.$cache = new cache
Vue.prototype.$cookies = cookies

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

fastclick.attach(document.body, {})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    // store,
    template: '<App/>',
    components: { App }
})
