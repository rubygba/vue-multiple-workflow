import axios from 'axios'

export const USER_INFO = (options, path) => {
    return axios.get('//2333.moemoe.la/api/user/' + path + '/infoV2')
}

export const TAG_DOCS = (options) => {
    return axios.get('//2333.moemoe.la/api/doc/tagDocs', options)
}

// 获取用户的帖子
export const USER_DOCS = (options) => {
    return axios.get('//2333.moemoe.la/api/user/getDocsV2', options)
}

// 获取登录用户的收藏
export const USER_FAVOR = (options, path) => {
    return axios({
        method: 'get',
        url: '//2333.moemoe.la/api/doc/' + path + '/favoritesV2',
        headers: options.headers,
        params: options.params,
        responseType: 'json',
        timeout: 5000
    })
}

// 获取用户的书包
export const USER_BAG = (options, path) => {
    return axios({
        method: 'get',
        url: '//2333.moemoe.la/api/bag/' + path + '/folder/list',
        headers: options.headers,
        // withCredentials: true,
        params: options.params,
        responseType: 'json',
        timeout: 5000
    })
}

export const USER_FOLLOW = (options, path) => {
    return axios({
        method: 'post',
        url: '//2333.moemoe.la/api/user/follow/' + path,
        headers: options.headers,
        responseType: 'json',
        timeout: 5000
    })
}

// 首页接口
export const INDEX_BANNER = (options) => {
    // return axios.get('//2333.moemoe.la/api/index/banner', options)
    return axios.get('//2333.moemoe.la/api/classroom/banner', options)
}

export const INDEX_TOPDOC = () => {
    return axios.get('//2333.moemoe.la/api/index/topDoc')
}

export const BLACK_BOARD = (options) => {
    return axios.get('//2333.moemoe.la/api/cal/blackboard/list', options)
}

export const INDEX_TOPUSER = () => {
    return axios.get('//2333.moemoe.la/api/index/topUser')
}

export const DOC_TAGDOCS = (options) => {
    return axios.get('//2333.moemoe.la/api/doc/tagDocs', options)
}

export const CAL_DOCS = (options) => {
    return axios.get('//2333.moemoe.la/api/cal/docs', options)
}

export const INDEX_TOPCAL = (options, path1) => {
    return axios.get('//2333.moemoe.la/api/index/topCalDoc/' + path1 + '/list')
}
