// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<div>Hello Module! jumping to main.vue...</div>'
})

setTimeout(() => {window.location.href = './main.html'}, 1000)
