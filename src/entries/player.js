// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import jsonp from '@/js/jsonp.js'

import MyApp from '@/components/player/Player'
// import router from '@/js/routers/player_router.js'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$http.jsonp = jsonp

/* eslint-disable no-new */
new Vue({
    el: '#app',
    // router,
    template: '<MyApp/>',
    components: { MyApp }
})
