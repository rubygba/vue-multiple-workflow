import Vue from 'vue'
import Vuex from 'vuex'
import {state} from './state'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'
// import createLogger from '../../../src/plugins/logger'

// localStorage初始化Vuex
function initLocalStore(state) {
    if (localStorage.STORAGE_VUEX_MZD) {
        let data = JSON.parse(localStorage.STORAGE_VUEX_MZD)
        for (let key in data) {
            state[key] = data[key]
        }
    }
    console.log('Load localStorage to Vuex')
}
initLocalStore(state)

// localStorage存储插件。每次Vuex mutation后存储相关数据
const storagePlugin = (store) => {
    // 选择性存储
    // store.subscribe((mutation, {newsListJson, newsPosJson}) => {
    //     localStorage.STORAGE_VUEX_MZD = JSON.stringify({newsListJson, newsPosJson})
    // })
    // 存储全部
    store.subscribe((mutation, state) => {
        console.log('muta:', mutation)
        if (mutation.type !== 'posSet') { // TODO:
            console.log('vuex localstorage')
            localStorage.STORAGE_VUEX_MZD = JSON.stringify(state)
        }
    })
}

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    plugins: [storagePlugin]
    // strict: debug,
    // plugins: debug ? [createLogger()] : []
})
