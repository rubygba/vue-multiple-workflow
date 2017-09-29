const defaultOptions = {
    timeout: 5000,
    jsonpCallback: 'callback',
    jsonpCallbackFunction: null, // default: random callback function name
    params: {}
}

/**
 * Generate random string.
 * @method generateCallbackFunction
 * @return { String }
 */
function generateCallbackFunction() {
    return `jsonp_${Date.now()}_${Math.ceil(Math.random() * 100000)}`
}

/**
 * Format params into querying string.
 * @param { Object }
 * @return { String }
 */
function formatParams(param) {
    var arr = []
    Object.keys(param).forEach(function (name) {
        arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(param[name]))
    })
    return arr.join('&')
}

// Known issue: Will throw 'Uncaught ReferenceError: callback_*** is not defined' error if request timeout
function clearFunction(functionName) {
    // IE8 throws an exception when you try to delete a property on window
    // http://stackoverflow.com/a/1824228/751089
    try {
        delete window[functionName]
    } catch (e) {
        window[functionName] = undefined
    }
}

function removeScript(scriptId) {
    const script = document.getElementById(scriptId)
    document.getElementsByTagName('head')[0].removeChild(script)
}

function fetchJsonp(_url, options = {}) {
    // to avoid param reassign
    let url = _url
    const timeout = options.timeout || defaultOptions.timeout
    const jsonpCallback = options.jsonpCallback || defaultOptions.jsonpCallback
    const params = options.params || defaultOptions.params
    let queryStr = formatParams(params)

    let timeoutId

    return new Promise((resolve, reject) => {
        const callbackFunction = options.jsonpCallbackFunction || generateCallbackFunction()
        const scriptId = `${jsonpCallback}_${callbackFunction}`

        window[callbackFunction] = (response) => {
            // resolve({
            //     ok: true,
            //     // keep consistent with fetch API
            //     json: () => Promise.resolve(response),
            // })
            resolve(response)

            if (timeoutId) {
                clearTimeout(timeoutId)
            }

            removeScript(scriptId)
            clearFunction(callbackFunction)
        }

        // Check if the user set their own params, and if not add a ? to start a list of params
        url = url + (/\?/.test(url) ? '&' : '?')
        // url += (url.indexOf('?') === -1) ? '?' : '&'

        if (queryStr) {
            url += (queryStr + '&')
        }

        const jsonpScript = document.createElement('script')
        jsonpScript.setAttribute('src', `${url}${jsonpCallback}=${callbackFunction}`)
        jsonpScript.id = scriptId
        document.getElementsByTagName('head')[0].appendChild(jsonpScript)

        timeoutId = setTimeout(() => {
            reject(new Error(`JSONP request to ${_url} timed out`))

            clearFunction(callbackFunction)
            removeScript(scriptId)
        }, timeout)
    })
}

export default fetchJsonp
