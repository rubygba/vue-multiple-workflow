export const newsReset = ({commit}, {type, arr, skey, nkey}) => {
    commit('newsSet', {type, arr, skey, nkey})
    
    let timestamp = new Date().getTime() + (1000*60*40) // 标记，新闻缓存40分钟后过期
    commit('expireSet', {type, expire: timestamp})
}

export const newsAdd = ({commit, state}, {type, arr, skey, nkey}) => {
    if (state.newsListJson[type]) {
        commit('newsAdd', {type, arr, skey, nkey})
    } else {
        commit('newsSet', {type, arr, skey, nkey})
        
        let timestamp = new Date().getTime() + (1000*60*40) // 标记，新闻缓存40分钟后过期
        commit('expireSet', {type, expire: timestamp})
    }
}

export const posSet = ({commit}, {type, pos}) => {
    commit('posSet', {type, pos})
}

export const keySet = ({commit}, {type, key}) => {
    commit('keySet', {type, key})
}

export const channelsSet = ({commit}, {arr}) => {
    commit('channelsSet', {arr})
}

export const historyPush = ({commit}, {type, str}) => {
    commit('historyPush', {type, str})
}

// export const expireSet = ({commit}, {type}) => {
//     let timestamp = new Date().getTime() + (1000*60*40) // 40分钟后过期
//     commit('expireSet', {type, expire: timestamp})
// }