import {GLOBAL} from './global.js'

// 显示日期为前天、昨天或具体时间
export function specialTime(str) {
    return GLOBAL.Util.getSpecialTimeStr(str)
}

// 显示计数为x百万、x万或具体数
export function specialCountStr(numStr) {
    let num = Number(numStr)
    if (num !== 0) {
        return GLOBAL.Util.getSpecialCountStr(num)
    }
    return 0
}

export function specialUrl(url) {
    let newUrl = url.replace('//mini.eastday.com/mobile', '//mmz.mop.com/a')
    // return newUrl.replace('https', 'http')
    return newUrl
}

export function prefixImgUrl(name, size) {
    let _name = name || 'default.png'
    let _size = size || '100x100'
    return '//s.moemoe.la/'+ _name +'?imageMogr2/thumbnail/!'+ _size +'r/gravity/center/crop/' + _size
}

export function prefixDocUrl(name) {
    let _name = name || ''
    return '//www.moemoe.la/detail/' + _name
}

export function decodeSchema(schema) {
    if (!schema) {
        return '//www.moemoe.la/detail/'
    }
    let _index = schema.indexOf('?')
    let _id = ''
    if (_index !== -1) {
        _id = schema.slice(_index + 1)
    }
    return '//www.moemoe.la/detail/' + _id
}

export function specialTime2(str) {
    let d = new Date(str)
    if (!d) {
        return false
    }
    
    var targetTime = d.getTime()
    var minuteTime = 60 * 1000, // 1分钟
        hourTime = 60 * minuteTime, // 1小时
        dayTime = 24 * hourTime, // 1天
        currentTime = new Date().getTime(),
        tdoa = Number(currentTime - targetTime),
        yesterday = new Date(currentTime - dayTime).getDate(),
        beforeYesterday = new Date(currentTime - 2*dayTime).getDate(),
        targetDay = new Date(targetTime).getDate()

    if (tdoa >= dayTime) { // 超过24小时的评论（距今秒数大于1天的秒数）
        if (tdoa / dayTime > 3) { // 超过72小时显示精确日期
            return str
        } else if (targetDay === beforeYesterday) {
            return '前天'
        } else if (targetDay === yesterday) {
            return '昨天'
        } else { // 大前天显示精确日期
            return str
        }
    } else if (tdoa >= hourTime) { // 超过1小时的评论
        return Math.floor(tdoa / hourTime) + '小时前'
    } else if (tdoa >= minuteTime) { // 超过1分钟的评论
        return Math.floor(tdoa / minuteTime) + '分钟前'
    } else {
        return '最新'
        // return Math.floor(tdoa / 1000) + '秒前'
    }
}