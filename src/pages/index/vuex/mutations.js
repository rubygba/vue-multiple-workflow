export const newsSet = (state, {type, arr, skey, nkey}) => {
    state.newsListJson[type] = arr
    // 初始化新闻列表对应参数
    state.newsListParamsJson[type] = {}
    state.newsListParamsJson[type].startkey = skey
    state.newsListParamsJson[type].newkey = nkey
    state.newsListParamsJson[type].pgnum = 1
    // 初始化新闻列表对应阅读历史
    state.readHistory[type] = []
    // 初始化新闻列表对应存储位移
    state.newsPosJson[type] = 0
}

export const newsAdd = (state, {type, arr, skey, nkey}) => {
    state.newsListJson[type] = state.newsListJson[type].concat(arr)
    state.newsListParamsJson[type].startkey = skey
    state.newsListParamsJson[type].newkey = nkey
    state.newsListParamsJson[type].pgnum++
}


export const posSet = (state, {type, pos}) => {
    state.newsPosJson[type] = pos
}

export const channelsSet = (state, {arr}) => {
    state.channelsList = arr
}

export const expireSet = (state, {type, expire}) => {
    state.newsExpireJson[type] = expire
}

export const historyPush = (state, {type, str}) => {
    if (state.readHistory[type]) {
        let i = state.readHistory[type].indexOf(str)
        // 删除重复记录
        if (i === -1) {
            state.readHistory[type].unshift(str)
        } else {
            // 重新进入队列
            state.readHistory[type].splice(i, 1)
            state.readHistory[type].unshift(str)
        }
    } else {
        state.readHistory[type] = []
        state.readHistory[type].unshift(str)
    }
}