/* eslint-disable */
// 工具方法扩展
const Util = {
  /**
     * 获取随机数
     * @param  {number} min 随机数下限
     * @param  {number} max 随机数上限
     * @return {number}     大于等于min且小于max的数
     */
  getRandom: function (min, max) {
    return Math.floor(Math.random() * (max - min) + min)
  },
  /**
      * 动态加载js文件
      * @param  {string}   url      js文件的url地址
      * @param  {Function} callback 加载完成后的回调函数
      */
  getScript: function (url, callback, element) {
    let head = document.getElementsByTagName('head')[0],
      js = document.createElement('script')

    js.setAttribute('type', 'text/javascript')
    js.setAttribute('src', url)
    if (element) {
      element.appendChild(js)
    } else {
      head.appendChild(js)
    }
    // 执行回调
    let callbackFn = function () {
      if (typeof callback === 'function') {
        callback()
      }
    }

    if (document.all) { // IE
      js.onreadystatechange = function () {
        if (js.readyState === 'loaded' || js.readyState === 'complete') {
          callbackFn()
        }
      }
    } else {
      js.onload = function () {
        callbackFn()
      }
    }
  },
  /**
     * 动态创建脚本代码
     * @param  {string}   scriptCode     脚本代码
     * @param  {Function} callback   回调
     * @param  {DOM}   element  脚本代码父级标签
     * @return {undefined}
     */
  createScript: function (scriptCode, callback, element) {
    if (scriptCode) {
      let head = document.getElementsByTagName('head')[0],
        js = document.createElement('script')
      js.setAttribute('type', 'text/javascript')
      js.innerHTML = scriptCode
      if (element) {
        element.appendChild(js)
      } else {
        head.appendChild(js)
      }
      // 执行回调
      callback()
    }
  },
  /**
     * 过滤html标签
     * @param  {String} str 源字符串
     * @return {String}     过滤之后的字符串
     */
  filterHtmlTags: function (str) {
    if (!str || typeof str !== 'string') {
      return
    }
    return str.replace(/<\/?[^>]*>/g, '')
  },
  /**
     * 获取url中参数的值
     * @param  {[type]} name 参数名
     * @return {[type]}      参数值
     */
  getQueryString: function (name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    let r = window.location.search.substr(1).match(reg)
    if (r != null) return decodeURI(r[2])
    return null
  },

  /**
     * 打乱数组
     * @param  {[type]} arr 目标数组
     * @return {[type]}     [description]
     */
  dislocateArr: function (arr) {
    return arr.sort(function () {
      return 0.5 - Math.random()
    })
  },

  /**
     * 对数量进行处理，过万的数据显示“xxx万”（xxx：向上取整, 如：10.2万以及10.9万 都会转化成 11万）
     * @param  {String|Number} num 数量
     * @return {String}    处理后的数据
     */
  getSpecialCountStr: function (num) {
    if (typeof num !== 'string' && typeof num !== 'number') {
      return num
    }
    num = parseInt(num, 10)
    if (num > 9999) {
      return Math.ceil(num / 10000) + '万'
    }
    return '' + num
  },

  /**
     * 计算指定时间与当前时间的时间差 并转换成相应格式字符串
     * 如：xx分钟前，xx小时前，昨天 xx:xx，前天 xx:xx，xx-xx xx:xx
     * @param  {[type]} str 时间字符串（格式：2016-02-26 09:12）
     * @return {[type]}     [description]
     */
  getSpecialTimeStr: function (str) {
    let targetTime = this.strToTime(str)
    if (!targetTime) {
      return false
    }
    let currentTime = new Date().getTime()
    let tdoa = Number(currentTime - targetTime),
      dayTime = 24 * 60 * 60 * 1000, // 1天
      hourTime = 60 * 60 * 1000, // 1小时
      minuteTime = 60 * 1000 // 1分钟

    if (tdoa >= dayTime) { // 天
      let h = tdoa / dayTime
      if (h > 2) {
        return this.timeToString(targetTime)
      } else if (h > 1) {
        return '前天'
      } else {
        return '昨天'
      }
    } else if (tdoa >= hourTime) { // 小时
      return Math.floor(tdoa / hourTime) + '小时前'
    } else if (tdoa >= minuteTime) {
      return Math.floor(tdoa / minuteTime) + '分钟前'
    } else {
      return '最新'
    // return Math.floor(tdoa / 1000) + '秒前'
    }
  },

  /**
     * 计算指定时间与当前时间的时间差 并转换成相应格式字符串
     * 如：
        当天开始的比赛显示具体时间：  9:00开始
        第二天开始的比赛显示：        明天9:00
        第三天开始的比赛显示：        后天9:00
        其它显示日期：               9月9日
     * @param  {String} str 时间字符串（格式：2016-02-26 09:12）
     * @param  {String} curServerTime 时间戳（格式：1500014061037）
     * @return {[type]}     [description]
     */
  getSpecialTimeStrForLive: function (str, curServerTime) {
    let targetTime = this.strToTime(str)
    if (!targetTime) {
      return false
    }
    let curDateTime = this.getCurrentDateTime(curServerTime)
    let curDate = curDateTime.split(' ')[0]
    let curDateTimeEnd = this.strToTime(curDate + ' 23:59')
    let tomorrowDateTimeEnd = curDateTimeEnd + (24 * 60 * 60 * 1000)
    let tatDateTimeEnd = curDateTimeEnd + (2 * 24 * 60 * 60 * 1000)
    if (targetTime > tatDateTimeEnd) {
      return '9月9日'
    } else if (targetTime > tomorrowDateTimeEnd) {
      return '后天9:00'
    } else if (targetTime > curDateTimeEnd) {
      return '明天9:00'
    } else {
      return '9:00开始'
    }
  },

  /**
     * 时间戳转时间
     * @param {Number} curServerTime 可选 时间戳
     * @return {String} 时间字符串
     */
  getCurrentDateTime: function (curServerTime) {
    curServerTime = curServerTime || (+new Date())
    return this.dateToStringWithYear(new Date(parseInt(curServerTime)))
  },

  /**
     * 字符串转换成时间（毫秒）
     * @param  {[type]} str 时间字符串（格式：2016-02-26 09:12）
     * 注意：iphone不支持（格式：2016-02-26 09:12）需要转换成：（格式：2016/02/26 09:12）
     * @return {[type]}     [description]
     */
  strToTime: function (str) {
    try {
      return Date.parse(str.replace(/-/g, '/'))
    } catch (e) {
      console.error(e)
      return false
    }
  },

  /**
     * 时间戳转换为字符串
     * @param  {[type]} t 时间戳
     * @param  {[type]} splitStr 分隔符
     * @return {[type]}   [description]
     */
  timeToString: function (t, splitStr) {
    return this.dateToString(this.timeToDate(t), splitStr)
  },

  /**
     * 毫秒级时间转日期时间
     * @param  {[type]} t 毫秒时间戳
     * @return {[type]}   日期时间
     */
  timeToDate: function (t) {
    return new Date(t)
  },

  /**
     * 日期转字符串
     * @param  {[type]} d           日期时间
     * @param  {[type]} splitStr 分隔符
     * @return {[type]}             默认返回 MM-dd HH:mm
     */
  dateToString: function (d, splitStr) {
    let month = (d.getMonth() + 1).toString(),
      day = d.getDate().toString(),
      h = d.getHours().toString(),
      m = d.getMinutes().toString()
    month = month.length > 1 ? month : ('0' + month)
    day = day.length > 1 ? day : ('0' + day)
    h = h.length > 1 ? h : ('0' + h)
    m = m.length > 1 ? m : ('0' + m)
    let str = month + '-' + day + ' ' + h + ':' + m // MM-dd HH:mm
    if (splitStr) {
      str = str.replace(/-/g, splitStr)
    }
    return str
  },

  /**
     * 日期转字符串
     * @param  {[type]} d           日期时间
     * @param  {[type]} splitStr 分隔符
     * @return {[type]}             默认返回 yyyy-MM-dd HH:mm
     */
  dateToStringWithYear: function (d, splitStr) {
    let year = d.getFullYear().toString(),
      month = (d.getMonth() + 1).toString(),
      day = d.getDate().toString(),
      h = d.getHours().toString(),
      m = d.getMinutes().toString()
    month = month.length > 1 ? month : ('0' + month)
    day = day.length > 1 ? day : ('0' + day)
    h = h.length > 1 ? h : ('0' + h)
    m = m.length > 1 ? m : ('0' + m)
    let str = year + '-' + month + '-' + day + ' ' + h + ':' + m // yyyy-MM-dd HH:mm
    if (splitStr) {
      str = str.replace(/-/g, splitStr)
    }
    return str
  },

  /**
     * 毫秒转成时间字符串
     * @param  {Number}  seconds 毫秒[必需]
     * @param  {Boolean} hasHour 是否需要区分小时[可选]
     * @return {String}          hasHour[true]: hh:mm:ss；否则[默认]：mm:ss。
     */
  msToTimestr: function (ts, hasHour) {
    let seconds = (ts ? Number(ts) / 1000 : 0)
    return this.secondsToTimestr(seconds, hasHour)
  },

  /**
     * 秒转成时间字符串
     * @param  {Number}  seconds 秒[必需]
     * @param  {Boolean} hasHour 是否需要区分小时[可选]
     * @return {String}          hasHour[true]: hh:mm:ss；否则[默认]：mm:ss。
     */
  secondsToTimestr: function (seconds, hasHour) {
    let hh, mm, ss
    // 传入的时间为空或小于0
    if (seconds == null || seconds < 0) {
      return
    }
    seconds = Math.ceil(seconds)
    // 得到小时
    hh = seconds / 3600 | 0
    seconds = parseInt(seconds) - hh * 3600
    if (parseInt(hh) < 10) {
      hh = '0' + hh
    }
    // 得到分
    mm = seconds / 60 | 0
    if (parseInt(mm) < 10) {
      mm = '0' + mm
    }
    // 得到秒
    ss = parseInt(seconds) - mm * 60
    if (ss < 10) {
      ss = '0' + ss
    }
    if (hasHour) {
      return hh + ':' + mm + ':' + ss
    }
    return mm + ':' + ss
  },

  /**
     * 获取滚动高度
     * @return {[type]} [description]
     */
  getScrollTop: function () {
    // if (document.documentElement && document.documentElement.scrollTop) {
    //     return document.documentElement.scrollTop
    // } else if (document.body) {
    //     return document.body.scrollTop
    // }
    let scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0
    try {
      if (document.body) {
        bodyScrollTop = document.body.scrollTop
      }
      if (document.documentElement) {
        documentScrollTop = document.documentElement.scrollTop
      }
    } catch (e) {}
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop
    return scrollTop
  },

  getScrollHeight: function () {
    let scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0
    try {
      if (document.body) {
        bodyScrollHeight = document.body.scrollHeight
      }
      if (document.documentElement) {
        documentScrollHeight = document.documentElement.scrollHeight
      }
    } catch (e) {}
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight
    return scrollHeight
  },

  /**
     * 获取文档高度
     * @return {[type]} [description]
     */
  getClientHeight: function () {
    if (document.body.clientHeight && document.documentElement.clientHeight) {
      return (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
    } else {
      return (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
    }
  },

  // 浏览器视口的高度
  getWindowHeight: function () {
    let windowHeight = 0
    if (document.compatMode === 'CSS1Compat') {
      windowHeight = document.documentElement.clientHeight
    } else {
      windowHeight = document.body.clientHeight
    }
    return windowHeight
  },

  /**
     * browser的判断
     * @return {[type]} [description]
     */
  getBrowserType: function () {
    let agent = navigator.userAgent.toLowerCase()
    let browserType = ''
    if (agent.indexOf('msie') > 0) {
      browserType = 'IE'
    }
    if (agent.indexOf('firefox') > 0) {
      browserType = 'firefox'
    }
    if (agent.indexOf('chrome') > 0 && agent.indexOf('mb2345browser') < 0 && agent.indexOf('360 aphone browser') < 0) {
      browserType = 'chrome'
    }
    if (agent.indexOf('360 aphone browser') > 0 || agent.indexOf('qhbrowser') > 0) {
      browserType = '360'
    }
    if (agent.indexOf('ucbrowser') > 0) {
      browserType = 'UC'
    }
    if (agent.indexOf('micromessenger') > 0) {
      browserType = 'WeChat'
    }
    if ((agent.indexOf('mqqbrowser') > 0 || agent.indexOf('qq') > 0) && agent.indexOf('micromessenger') < 0) {
      browserType = 'QQ'
    }
    if (agent.indexOf('miuibrowser') > 0) {
      browserType = 'MIUI'
    }
    if (agent.indexOf('mb2345browser') > 0) {
      browserType = '2345'
    }
    if (agent.indexOf('sogoumobilebrowser') > 0) {
      browserType = 'sogou'
    }
    if (agent.indexOf('liebaofast') > 0) {
      browserType = 'liebao'
    }
    if (agent.indexOf('weibo') > 0) {
      browserType = 'weibo'
    }
    if (agent.indexOf('safari') > 0 && agent.indexOf('chrome') < 0 && agent.indexOf('ucbrowser') < 0 && agent.indexOf('micromessenger') < 0 && agent.indexOf('mqqbrowser') < 0 && agent.indexOf('miuibrowser') < 0 && agent.indexOf('mb2345browser') < 0 && agent.indexOf('sogoumobilebrowser') < 0 && agent.indexOf('liebaofast') < 0 && agent.indexOf('qhbrowser') < 0 && agent.indexOf('weibo') < 0) {
      browserType = 'safari'
    }
    return browserType
  },

  /**
     * OS的判断
     * @return {[type]} [description]
     */
  getOsType: function () {
    let agent = navigator.userAgent.toLowerCase(),
      osType = '',
      index = '',
      version = ''
    if (/android/i.test(navigator.userAgent)) {
      index = agent.indexOf('android')
      version = agent.substr(index + 8, 3)
      osType = 'Android ' + version
    }
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      index = agent.indexOf('os')
      version = agent.substr(index + 3, 3)
      osType = 'iOS ' + version
    }
    if (/Linux/i.test(navigator.userAgent) && !/android/i.test(navigator.userAgent) && !/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      osType = 'Linux'
    }
    if (/windows|win32/i.test(navigator.userAgent)) {
      osType = 'windows32'
    }
    if (/windows|win64/i.test(navigator.userAgent)) {
      osType = 'windows64'
    }
    return osType
  },

  /**
     * 获取当前手机屏幕分辨率的高宽
     * @return {json} {w: xxx, h: xxx}
     */
  getPixel: function () {
    let width = window.screen.width
    let height = window.screen.height
    return {w: width, h: height}
  },

  /**
     * 获取字符串字节数
     * @param  {[type]} str [description]
     * @return {[type]}     [description]
     */
  getBytes: function (str) {
    let byteLen = 0, len = str.length
    if (str) {
      for (let i = 0; i < len; i++) {
        if (str.charCodeAt(i) > 255) {
          byteLen += 2
        } else {
          byteLen++
        }
      }
      return byteLen
    } else {
      return 0
    }
  },

  /**
     * Javascript获取页面来源(referer)
     * @from http://www.au92.com/archives/javascript-get-referer.html
     * @return {[type]} [description]
     */
  getReferrer: function () {
    let referrer = ''
    try {
      referrer = window.top.document.referrer
    } catch (e) {
      if (window.parent) {
        try {
          referrer = window.parent.document.referrer
        } catch (e2) {
          referrer = ''
        }
      }
    }
    if (referrer === '') {
      referrer = document.referrer
    }
    return referrer
  },

  /**
     * 获取url（排除url中参数）
     * @return {[type]} [description]
     */
  getUrlNoParams: function () {
    let locaUrl = window.location.href,
      endIndex = 0
    if (locaUrl.indexOf('?') >= 0) {
      endIndex = locaUrl.indexOf('?')
      return locaUrl.substring(0, endIndex)
    }
    if (locaUrl.indexOf('#') >= 0) {
      endIndex = locaUrl.indexOf('#')
      return locaUrl.substring(0, endIndex)
    }
    return locaUrl
  },

  /**
     * 获取url
     * @return {[type]} [description]
     */
  getUrl: function () {
    let locaUrl = window.location.href,
      endIndex = 0
    if (locaUrl.indexOf('?') >= 0) {
      endIndex = locaUrl.indexOf('?')
      return locaUrl.substring(0, endIndex)
    }
    if (locaUrl.indexOf('#') >= 0) {
      endIndex = locaUrl.indexOf('#')
      return locaUrl.substring(0, endIndex)
    }
    return locaUrl
  },

  createStyle: function (style, callback, element) {
    if (style) {
      let head = document.getElementsByTagName('head')[0],
        css = document.createElement('style')
      css.innerHTML = style
      if (element) {
        element.appendChild(css)
      } else {
        head.appendChild(css)
      }
      // 执行回调
      callback && callback()
    }
  },

  /**
     * pageVisibility.js by zhangxinxu 2012-11-29
     *  let pageVisibility = {
     *      hidden: Boolean
     *      visibilityState: String
     *      visibilitychange: Function
     *  }
     * @return {Object} {
     *    hidden: Boolean
     *    visibilityState: String
     *    visibilitychange: Function
     * }
     */
  pageVisibility: function () {
    let pageVisibility = (function () {
      let prefixSupport, keyWithPrefix = function (prefix, key) {
          if (prefix !== '') {
            // 首字母大写
            return prefix + key.slice(0, 1).toUpperCase() + key.slice(1)
          }
          return key
        }
      let isPageVisibilitySupport = (function () {
        let support = false
        if (typeof window.screenX === 'number') {
          ['webkit', 'moz', 'ms', 'o', ''].forEach(function (prefix) {
            if (support === false && document[keyWithPrefix(prefix, 'hidden')] !== undefined) {
              prefixSupport = prefix
              support = true
            }
          })
        }
        return support
      })()

      let isHidden = function () {
        if (isPageVisibilitySupport) {
          return document[keyWithPrefix(prefixSupport, 'hidden')]
        }
        return undefined
      }

      let visibilityState = function () {
        if (isPageVisibilitySupport) {
          return document[keyWithPrefix(prefixSupport, 'visibilityState')]
        }
        return undefined
      }

      return {
        hidden: isHidden(),
        visibilityState: visibilityState(),
        visibilitychange: function (fn, usecapture) {
          usecapture = undefined || false
          if (isPageVisibilitySupport && typeof fn === 'function') {
            return document.addEventListener(prefixSupport + 'visibilitychange', function (evt) {
              this.hidden = isHidden()
              this.visibilityState = visibilityState()
              fn.call(this, evt)
            }.bind(this), usecapture)
          }
          return undefined
        }
      }
    })(undefined)
    return pageVisibility
  }

}

/* 原声JavaScript扩展 */
const Js = {
  /**
   * 去空白
   * @param ostr 需处理的值
   * @returns {string|void|XML|*} 处理后的值
   */
  trim: function (ostr) {
    return ostr.replace(/^\s+|\s+$/g, '')
  },
  isNumber: function (s) {
    return !isNaN(s)
  },
  isString: function (s) {
    return typeof s === 'string'
  },
  isBoolean: function (s) {
    return typeof s === 'boolean'
  },
  isFunction: function (s) {
    return typeof s === 'function'
  },
  isNull: function (s) {
    return s === null
  },
  isUndefined: function (s) {
    return typeof s === 'undefined'
  },
  isEmpty: function (s) {
    return /^\s*$/.test(s)
  },
  isArray: function (s) {
    return s instanceof Array
  }
}

// cookie处理扩展
const Cookie = {
  /**
     * 设置cookie
     * @param name 名称
     * @param value 值
     * @param expires 有效时间（单位：小时）（可选） 默认：24h
     */
  set: function (name, value, expires, domain) {
    let expTimes = expires ? (Number(expires) * 60 * 60 * 1000) : (24 * 60 * 60 * 1000) // 毫秒
    let expDate = new Date()
    expDate.setTime(expDate.getTime() + expTimes)
    let expString = expires ? '; expires=' + expDate.toUTCString() : ''
    let pathString = '; path=/'
    let dm = '; domain=' + domain
    document.cookie = name + '=' + encodeURI(value) + expString + pathString + dm
  },
  /**
     * 读cookie
     * @param name
     */
  get: function (name) {
    let cookieStr = '; ' + document.cookie + '; '
    let index = cookieStr.indexOf('; ' + name + '=')
    if (index !== -1) {
      let s = cookieStr.substring(index + name.length + 3, cookieStr.length)
      return decodeURI(s.substring(0, s.indexOf('; ')))
    } else {
      return null
    }
  },
  /**
     * 删除cookie
     * @param name
     */
  del: function (name, domain) {
    let exp = new Date(new Date().getTime() - 1)
    let s = this.get(name)
    if (s !== null) {
      document.cookie = name + '=' + s + '; expires=' + exp.toUTCString() + '; path=/; domain=' + domain
    }
  }
}

// 数组处理扩展
const Arr = {
  /**
     * 获取数组1中排除数组2中的值之后的数组
     * @param  {[type]} arr1 仅包含基本数据类型值的数组1
     * @param  {[type]} arr2 仅包含基本数据类型值的数组2
     * @return {[type]}      [description]
     */
  difference: function (arr1, arr2) {
    try {
      let arr = [],
        i = 0,
        len1 = arr1.length
      for (i = 0; i < len1; i++) {
        if (!arr2.contains(arr1[i])) {
          arr.push(arr1[i])
        }
      }
      return arr
    } catch (e) {
      console.error(e)
      return arr1
    }
  }
}

// 系统判断
const Os = (function () {
  let u = navigator.userAgent,
    Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'],
    mobile = false
  for (let v = 0; v < Agents.length; v++) {
    if (u.indexOf(Agents[v]) > -1) {
      mobile = true
      break
    }
  }
  return {
    // 移动终端浏览器版本信息
    mobile: mobile, // 是否为移动终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或uc浏览器
    iphone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
    ipad: u.indexOf('iPad') > -1, // 是否iPad
    webapp: u.indexOf('Safari') === -1 // 是否web应该程序，没有头部与底部
  }
}())

// 浏览器判断
const Browser = (function () {
  let ua = navigator.userAgent, // 获取判断用的对象
    mobile = Os.mobile

  if (mobile) { // mobile
    // 移动终端浏览器版本信息
    return {
      wechat: ua.indexOf('MicroMessenger') > -1, // 在微信中打开
      weibo: ua.toLowerCase().indexOf('weibo') > -1, // 在新浪微博客户端打开
      qq: ua.indexOf('QQ/') > -1, // 在QQ、QQ空间中打开
      qqbrowser: ua.indexOf('MQQBrowser') > -1 // 在QQ空间打开
    }
  }
  return {}
}())

export default {Util, Js, Cookie, Arr, Os, Browser}
