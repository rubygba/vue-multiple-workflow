/**
 * video对象
 */
function Video() {
    this.qid = GLOBAL.Util.getQueryString('qid') || Cookies.get('qid') || 'null'; // 渠道ID
    this.userId = Cookies.get('user_id');
    this.osType = GLOBAL.Util.getOsType();
    this.browserType = GLOBAL.Util.getBrowserType();
    this.init();
}

/**
 * 初始化
 * @return {[type]} [description]
 */
Video.prototype.init = function() {
    var scope = this;

    // 设置视频容器宽高（暂时强制视频以16:9形式展现，不判断视频的实际尺寸）
    // if(videoWidth && videoHeight){
    //     $video.parents('.video-wrap').css('paddingBottom', '0').height(winWidth * videoHeight / videoWidth);
    // }

    /* 获取、存储qid */
    if (scope.qid) {
        Cookies.set('qid', scope.qid, {
            expires: 3,
            path: '/',
            domain: 'eastday.com'
        });
    }
    /* 获取、存储uid */
    // scope.userId = scope._getUid();
    /* 获取、存储uid */
    if (!scope.userId) {
        scope.userId = (+new Date()) + Math.random().toString(10).substring(2, 6);
        Cookies.set('user_id', scope.userId, {
            expires: 365,
            path: '/',
            domain: 'eastday.com'
        });
    }

    /* 视频事件监听 */
    try {
        scope.addVideoListener();
    } catch (e) {
        console.error('_addOnlineLog has error!', e);
    }

    /* 获取视频信息流 */
    try {
        if (scope.qid !== '2345app') {
            scope.getVideoList();
        } else {
            $related.remove();
            $commend.remove();
        }
    } catch (e) {
        console.error('_addOnlineLog has error!', e);
    }

    /* 日志信息 */
    try {
        // 发送日志信息
        scope._addLog();
        // 在线日志
        scope._addOnlineLog();
        setInterval(function() {
            scope._addOnlineLog();
        }, onlineHz * 1000);
    } catch (e) {
        console.error('_addOnlineLog has error!', e);
    }

    $related.on('click', 'a', function() {
        $video[0].pause();
        scope.removeLoading();
    });

    // 自动缓冲页面
    $video.attr('preload', true);
    $video.attr('autobuffer', true);
    $video.attr('x-webkit-airplay', 'allow');
    // scope.play();

    var mygg = GLOBAL.Et.gg,
        bd = mygg.baidu,
        ggPaster = bd && bd.paster,
        ggThreeup = bd && bd.threeup,
        ggThreedown = bd && bd.threedown,
        ggThree = bd && bd.three,
        t1 = null,
        t2 = null;
    // 视频暂停时展示的广告
    try {
        if (ggPaster) {
            /* 生成广告DOM */
            generateGgDom();
            loadGg(ggPaster);
            /* 关闭广告 */
            $ggCloseVideo.on('click', function() {
                scope.hideGg();
            });
        }
    } catch (e) {
        console.error('generateGgDom has error!', e);
    }

    // 视频信息流中的广告
    try {
        if (ggThreeup) {
            t1 = setInterval(function() {
                if (hasListNews) {
                    scope.loadListGg(ggThreeup, 3);
                    clearInterval(t1);
                }
            }, 200);
        }
        if (ggThreedown) {
            t2 = setInterval(function() {
                if (hasListNews) {
                    scope.loadListGg(ggThreedown, 8);
                    clearInterval(t2);
                }
            }, 200);
        }
    } catch (e) {
        console.error('loadListGg has error!', e);
    }

    // wnwifi广告
    if (scope.qid === 'wnwifishipin') {
        $('body').prepend('<div id="wkssp-container1"></div>');
        $commend.after('<div id="wkssp-container2"></div><div id="wkssp-container3"></div><div id="wkssp-container4"></div><div id="wkssp-container5"></div><scr' + 'ipt type="text/javascript"> window._wksspid = "www.eastday.com"; var url = "http://static.51y5.net/znews/static/ad/external_detail_ad.js?t=" + parseInt(new Date().getTime() / 3600000); var scr = document.createElement("script"); scr.src = url; document.querySelector("head").appendChild(scr); </scr' + 'ipt>');
    } else if (scope.qid === '2345app') {
        scope.loadThree(ggThree);
    } else if (scope.qid === 'xiaozhishipin') {
        scope.getDsp(ggThree);
    }
};

Video.prototype.getVideoList = function(callback) {
    var scope = this;
    $.ajax({
        url: videoUrl,
        data: {
            type: $('#J_video').attr('data-type'),
            num: '10',
            qid: scope.qid,
            recgid: scope.userId,
            url: GLOBAL.Util.getUrlNoParams()
        },
        dataType: 'jsonp',
        jsonp: "jsonpcallback",
        timeout: 8000,
        beforeSend: function() {
            $related.append($moreVideoLoading);
        },
        success: function(data) {
            scope.generateVideoList(data);
        },
        error: function(e) {
            console.error(e);
        },
        complete: function(jqXHR, textStatus) {
            callback && callback(); // jshint ignore: line
            if ('timeout' === textStatus) {
                $related.append('<p style="padding: 0.1rem 0 0.2rem; font-size: 0.24rem; color: #999; text-align: center; margin-top: 0.2rem;">请求超时，请检查网络连接状态或<a href="javascript:location.reload();">刷新页面</a>重试。</p>');
            }
            $moreVideoLoading && $moreVideoLoading.remove(); // jshint ignore: line
        }
    });
};

/**
 * 生成列表
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
Video.prototype.generateVideoList = function(data) {
    var scope = this,
        d = data.data ? data.data : null,
        len = d ? d.length : 0;
    if (len > 0) {
        if (scope.qid !== 'xiaozhishipin') {
            $related.append('<div id="related-tit" class="related-tit"><h2>相关视频</h2></div>');
        }
        for (var i = 0; i < len; i++) {
            var item = d[i],
                itemImg43 = item.miniimg_01, // 4:3
                itemImg = itemImg43[0],
                idx = i + 1,
                fr = GLOBAL.Util.getUrlNoParams(),
                type = item.type,
                topic = item.topic,
                source = item.source,
                recommendtype = item.recommendtype ? item.recommendtype : '-1',
                hot = Number(item.hotnews), // 热门
                rec = Number(item.isrecom), // 推荐
                imgSrc = itemImg.src,
                imgWidth = itemImg.imgwidth,
                imgHeight = itemImg.imgheight,
                duration = GLOBAL.Util.msToTimestr(item.videoalltime),
                href = item.url + '?qid=' + scope.qid + '&idx=' + idx + '&fr=' + fr + '&ishot=' + hot + '&recommendtype=' + recommendtype,
                tagStr = '';

            if (hot) {
                tagStr = '<i class="hot">热门</i>';
            } else if (rec) {
                tagStr = '<i class="rec">推荐</i>';
            }

            $listWrap.append('<section class="news-item news-item-video"><a data-type="' + type + '" data-subtype="" href="' + href + '"><div class="news-wrap clearfix"><div class="txt-wrap fl"><h3>' + topic + '</h3> <p><em class="fl">' + source + '</em><em class="fr">' + tagStr + '</em></p></div><div class="img-wrap fr"><img class="lazy" src="' + imgSrc + '" alt="" data-width="' + imgWidth + '" data-height="' + imgHeight + '"><span class="duration">' + duration + '</span></div></div></a></section>');
        }
    }
    $listWrap.appendTo($related);
    hasListNews = true;
};

/**
 * 发送视频操作日志
 * @param  {String} param 必需 - 参数(qid,uid,osType,browserType,url,duration,playingTime,currentTime,action)
 */
Video.prototype.sendVideoLog = function(param) {
    if (!param) {
        return;
    }
    $.ajax({
        url: videoLogUrl,
        data: {
            param: encodeURIComponent(param)
        },
        dataType: 'jsonp',
        jsonp: 'jsonpcallback',
        success: function() {},
        error: function() {}
    });
};

Video.prototype.showLoading = function() {
    // $loading = $('<div id="J_video_loading" class="video-loading"><div class="video-loading-wrap"><img src="img/loading2.gif" alt=""></div></div>');
    // $loading = $('<div class="vjs-waiting-wrap"><div class="vjs-waiting"><div class="vjs-loading-spinner vjs-waiting"></div></div></div>');
    $loading = $('<div class="video-loading"><div class="img"></div><div class="ball-beat"><div></div> <div></div> <div></div></div></div>');
    $loading.appendTo($video.parents('.video-wrap'));
};

Video.prototype.removeLoading = function() {
    $loading && $loading.remove(); // jshint ignore: line
};

Video.prototype.play = function() {
    var scope = this,
        end = scope.getEnd(),
        video = $video[0];
    if (bufferedNum >= 3 && end <= 0.01) {
        video.play();
        bufferedNum = 0;
        scope.removeLoading();
    } else if (end <= 5) {
        if (!$loading) {
            scope.showLoading();
        }
        setTimeout(function() {
            scope.play();
            bufferedNum++;
        }, 1000);
    } else {
        scope.removeLoading();
        video.play();
    }
};

Video.prototype.getEnd = function() {
    var video = $video[0];
    var end = 0;
    try {
        end = video.buffered.end(0) || 0;
        end = parseInt(end * 1000 + 1, 10) / 1000;
    } catch (e) {}
    return end;
};

/**
 * video事件监听
 * @return {[type]}        [description]
 */
Video.prototype.addVideoListener = function() {
    var scope = this;
    $video.one('play', function() {
        scope.showLoading();
        var timer = setInterval(function() {
            var video = $video[0];
            // 当播放了100ms之后再移除loading动画，否则显示loading动画
            if (Math.floor(video.currentTime * 1000) < 100) {
                return;
            }
            scope.removeLoading();
            clearInterval(timer);
        }, 200);
    });

    // $video.one('canplaythrough', function(event){
    //     scope.removeLoading();
    // });

    // 播放事件
    $video.on('playing', function(event) {
        try {
            var $vd = $(event.target),
                video = $vd[0],
                src = video.currentSrc,
                duration = video.duration ? Math.floor(video.duration * 1000) : $vd.attr('data-duration'),
                idx = $vd.attr('data-idx'),
                videoType = $vd.attr('data-type'),
                playingTime = $vd.attr('data-playingTime') ? $vd.attr('data-playingTime') : 'null',
                currentTime = Math.floor(video.currentTime * 1000), // 当前播放时间位置
                param = scope.qid + '\t' + scope.userId + '\t' + 'news' + '\t' + 'eastday_wapnews' + '\t' + 'null' + '\t' + (videoType || 'null') + '\t' + scope.osType + '\t' + (idx || 'null') + '\t' + scope.browserType + '\t' + src + '\t' + duration + '\t' + playingTime + '\t' + currentTime + '\t' + 'play';
            /*if(currentTime < 500){
                scope.showLoading();
                var timer = setInterval(function() {
                    if(Math.floor(video.currentTime * 1000) < 500){
                        return;
                    }
                    scope.removeLoading();
                    clearInterval(timer);
                }, 200);
            }*/
            // 用于记录实际播放时长（很重要）利用了先触发start再触发timeupdate的这个规则来更新开始计时时间.
            $vd.attr('data-updateTime', +new Date());
            scope.sendVideoLog(param);
        } catch (e) {
            console.error('Event playing has error!!!', e);
        }
        $ggCloseVideo && $ggCloseVideo.trigger('click'); // jshint ignore: line
    });
    // 暂停事件
    $video.on('pause', function(event) {
        try {
            var $vd = $(event.target),
                video = $vd[0],
                src = video.currentSrc,
                duration = video.duration ? Math.floor(video.duration * 1000) : $vd.attr('data-duration'),
                idx = $vd.attr('data-idx'),
                videoType = $vd.attr('data-type'),
                playingTime = $vd.attr('data-playingTime') ? $vd.attr('data-playingTime') : 'null',
                currentTime = Math.floor(video.currentTime * 1000), // 当前播放时间位置
                param = scope.qid + '\t' + scope.userId + '\t' + 'news' + '\t' + 'eastday_wapnews' + '\t' + 'null' + '\t' + videoType + '\t' + scope.osType + '\t' + (idx || 'null') + '\t' + scope.browserType + '\t' + src + '\t' + duration + '\t' + playingTime + '\t' + currentTime + '\t' + 'pause';
            // 用于记录实际播放时长
            scope.sendVideoLog(param);
            // 兼容处理（在小米浏览器上碰到过一次，点击播放就会触发暂停，导致出现广告）
            if (Math.floor($video[0].currentTime * 1000) > 1000 && $video[0].paused) {
                scope.showGg();
            }
        } catch (e) {
            console.error('Event pause has error!!!', e);
        }
    });
    // 播放时间更新事件（记录实际播放时间）
    $video.on('timeupdate', function(event) {
        try {
            var $vd = $(event.target),
                // video = $vd[0],
                // duration = video.duration,
                // currentTime = video.currentTime,
                updateTime = parseInt($vd.attr('data-updateTime'), 10) || (+new Date()),
                playingTime = parseInt($vd.attr('data-playingTime'), 10) || 0,
                now = +new Date();
            // 播放时间
            playingTime = playingTime + now - updateTime;
            $vd.attr('data-playingTime', playingTime);
            $vd.attr('data-updateTime', now);
        } catch (e) {
            console.error('Event timeupdate has error!!!', e);
        }
    });

};

/**
 * 显示广告
 * @return {[type]} [description]
 */
Video.prototype.showGg = function() {
    // $ggVideo.css('z-index', '2');
    if ($ggVideo) {
        $ggVideo.show();
        $video.css({
            width: 1,
            height: 1
        });
    }
};

/**
 * 隐藏广告
 * @return {[type]} [description]
 */
Video.prototype.hideGg = function() {
    // $ggVideo.css('z-index', '-1');
    if ($ggVideo) {
        $ggVideo.hide();
        $video.css({
            width: '100%',
            height: '100%'
        });
    }
};

/**
 * 添加日志
 */
Video.prototype._addLog = function() {
    var scope = this;
    // 发送操作信息
    $.ajax({
        url: logUrl,
        data: {
            'qid': scope.qid || 'null', // 渠道号
            'uid': scope.userId || 'null', // 从服务器端获取的uid
            'softtype': 'news', // 软件type（当前默认news）
            'softname': 'eastday_wapnews', // 软件名（当前默认eastday_wapnews）
            'newstype': $('#J_video').attr('data-type') || 'null', // 当前新闻类别
            'from': GLOBAL.Util.getQueryString('fr') || 'null', // url上追加的fr字段
            'to': GLOBAL.Util.getUrlNoParams() || 'null', // 当前页面
            'os_type': scope.osType || 'null', // 客户端操作系统
            'browser_type': scope.browserType || 'null', // 客户端浏览器类别
            'pixel': window.screen.width + '*' + window.screen.height, // 客户端分辨率
            'fr_url': GLOBAL.Util.getReferrer() || 'null', // 浏览器的refer属性
            'loginid': GLOBAL.Util.getQueryString('ttaccid') || 'null', // App端分享新闻时url上追加的ttaccid
            'ime': GLOBAL.Util.getQueryString('ime') || 'null', // App端用户imei号
            'idx': GLOBAL.Util.getQueryString('idx') || 'null', // 当前新闻的idx属性
            'ishot': GLOBAL.Util.getQueryString('ishot') || 'null', // 当前新闻是不是热点新闻
            'ver': GLOBAL.Util.getQueryString('ver') || 'null', // App版本（1.2.9）url上追加的ver
            'appqid': GLOBAL.Util.getQueryString('appqid') || 'null', // App渠道号url上追加的appqid
            'ttloginid': GLOBAL.Util.getQueryString('ttloginid') || 'null', // App端分享新闻时url上追加的ttloginid
            'apptypeid': GLOBAL.Util.getQueryString('apptypeid') || 'null', // App端的软件类别url上追加的apptypeid
            'appver': GLOBAL.Util.getQueryString('appver') || 'null', // App版本（010209）url上追加的appver
            'recommendtype': GLOBAL.Util.getQueryString('recommendtype') || 'null', // 推荐新闻类别url上追加的recommendtype
            'ispush': GLOBAL.Util.getQueryString('ispush') || 'null', // 是不是推送新闻url上追加的ispush
            'deviceid': GLOBAL.Util.getQueryString('deviceid') || 'null',
            'pgnum': GLOBAL.Util.getQueryString('pgnum') || 'null'
        },
        dataType: 'jsonp',
        jsonp: 'jsonpcallback',
        success: function() {},
        error: function() {
            console.error(arguments);
        }
    });
};

/**
 * 收集在线日志
 */
Video.prototype._addOnlineLog = function() {
    var scope = this,
        infostr = GLOBAL.Util.getUrlNoParams() + '\t' + scope.userId + '\t' + scope.qid + '\tnull\tnull\tnull\t' + ($('#J_video').attr('data-type') || 'null') + '\t' + onlineHz + '\tnull\tnull\t' + scope.osType + '\tnull';
    $.ajax({
        url: onlineUrl,
        data: {
            param: encodeURI(infostr)
        },
        dataType: 'jsonp',
        jsonp: 'jsonpcallback'
    });
};

/**
 * 视频信息流中添加广告
 * @param  {[type]} ggid 广告ID
 * @param  {[type]} pos  插入位置
 */
Video.prototype.loadListGg = function(ggid, pos) {
    if (!ggid) {
        return;
    }
    // 分析是5.0广告还是5.0之前的广告
    var reg = new RegExp(/^u[0-9]{7}/),
        isV5 = !reg.test(ggid),
        $newsItems = $listWrap.children(),
        len = $newsItems.length;
    if (pos >= len) {
        pos = len - 1;
    } else if (pos < 0) {
        pos = 0;
    } else {
        pos = pos - 1;
    }
    if (isV5) {
        $newsItems.eq(pos).after('<section class="gg-item news-gg-img3"><div id="' + ggid + '"></div><div class="line"></div></section>');
        GLOBAL.Util.getScript('https://jiaoben.eastday.com/' + ggid + '.js', function() {}, $('#' + ggid)[0]);
    } else {
        var ggConfig = '(window.cpro_mobile_slot = window.cpro_mobile_slot || []).push({id : "' + ggid + '",at:"3", pat:"21", ptLH:"30", tn:"template_inlay_all_mobile_lu_native", rss1:"#F8F8F8", titFF:"%E5%BE%AE%E8%BD%AF%E9%9B%85%E9%BB%91", titFS:"12", rss2:"#000000", ptFS:"17", ptFC:"#000000", ptFF:"%E5%BE%AE%E8%BD%AF%E9%9B%85%E9%BB%91", ptFW:"0", conpl:"15", conpr:"15", conpt:"8", conpb:"15", cpro_h:"140", ptn:"1", ptp:"0", itecpl:"10", piw:"0", pih:"0", ptDesc:"2", ptLogo:"0", ptLogoFS:"10", ptLogoBg:"#F8F8F8", ptLogoC:"#999999", ptLogoH:"0", ptLogoW:"0"})';
        // var ggConfig = '(window.cpro_mobile_slot=window.cpro_mobile_slot||[]).push({id:"' + ggid + '"});';
        $newsItems.eq(pos).after('<section class="gg-item news-gg-img3"><div id="cpro_' + ggid + '"></div><div class="line"></div></section>');
        createScript(ggConfig, function() {
            getScript('https://jiaoben.eastday.com/cpro/ui/cm.js', function() {}, $('#cpro_' + ggid)[0]);
            // getScript('https://cpro.baidustatic.com/cpro/ui/cm.js', function() {}, $('#cpro_' + ggid)[0]);
        }, $('#cpro_' + ggid)[0]);
    }

};

Video.prototype.loadThree = function(ggId) {
    var scope = this;
    // 分析是5.0广告还是5.0之前的广告
    var reg = new RegExp(/^u[0-9]{7}/),
        isV5 = !reg.test(ggId),
        $content = $('article.content').eq(0);
    if (isV5) {
        $content.after('<section class="gg-item news-gg-img3"><div id="' + ggId + '"></div><div class="line"></div></section>');
        GLOBAL.Util.getScript('https://jiaoben.eastday.com/' + ggId + '.js', function() {}, $('#' + ggId)[0]);
    } else {
        var ggConfig = '(window.cpro_mobile_slot = window.cpro_mobile_slot || []).push({id : "' + ggId + '",at:"3", pat:"21", ptLH:"30", tn:"template_inlay_all_mobile_lu_native", rss1:"#FFFFFF", titFF:"%E5%BE%AE%E8%BD%AF%E9%9B%85%E9%BB%91", titFS:"12", rss2:"#000000", ptFS:"17", ptFC:"#000000", ptFF:"%E5%BE%AE%E8%BD%AF%E9%9B%85%E9%BB%91", ptFW:"0", conpl:"15", conpr:"15", conpt:"8", conpb:"15", cpro_h:"140", ptn:"1", ptp:"0", itecpl:"10", piw:"0", pih:"0", ptDesc:"2", ptLogo:"0", ptLogoFS:"10", ptLogoBg:"#FFFFFF", ptLogoC:"#999999", ptLogoH:"0", ptLogoW:"0"})';
        $content.after('<section class="gg-item news-gg-img3"><div id="cpro_' + ggId + '"></div><div class="line"></div></section>');
        GLOBAL.Util.createScript(ggConfig, function() {
            GLOBAL.Util.getScript('https://jiaoben.eastday.com/cpro/ui/cm.js', function() {}, $('#cpro_' + ggId)[0]);
        }, $('#cpro_' + ggId)[0]);
    }
    if (scope.qid !== 'xiaozhishipin') {
        $content.after('<div class="partner"><div class="split-line"><p>赞助商提供信息</p></div></div>');
    }
};

// 渲染三图广告
Video.prototype.loadSanGg = function(data) {
    $('#extra').html('<a href="' + data.url + '" class="gg_link" data-platform="' + data.platform + '" data-advId="' + data.adv_id + '" data-clickback="' + data.clickbackurl + '">' +
        '<div class="news-wrap clearfix">' +
        '<h3 class="news-title">' + data.topic + '</h3>' +
        '<div class="imgs-wrap clearfix">' +
        '<div class="img fl"><img src="' + data.miniimg[0].src + '" class="lazy" /></div>' +
        '<div class="img fl"><img src="' + data.miniimg[1].src + '" class="lazy" /></div>' +
        '<div class="img fl"><img src="' + data.miniimg[2].src + '" class="lazy" /></div>' +
        '</div>' +
        '<p class="tags clearfix">' +
        '<em class="tag tag-time fl">' +
        '<i class="tag tag-gg">广告</i>' +
        '</em>' +
        '<em class="tag tag-src fr">' + data.source + '</em>' +
        '</p>' +
        '</div>' +
        '</a>');
}

// 渲染单图广告
Video.prototype.loadDanGg = function(data) {
    $('#extra').html('<a href="' + data.url + '" class="gg_link" data-platform="' + data.platform + '" data-advId="' + data.adv_id + '" data-clickback="' + data.clickbackurl + '">' +
        '<div class="new-wrap clearfix">' +
        '<div class="txt-wrap fl">' +
        '<h3 class="txt-title">' + data.topic + '</h3>' +
        '<p class="tags clearfix">' +
        '<em class="tag tag-time">' +
        '<i class="tag tag-gg">广告</i>' +
        '</em>' +
        '<em class="tag tag-src">' + data.source + '</em>' +
        '</p>' +
        '</div>' +
        '<div class="img-wrap fr">' +
        '<img src="' + data.miniimg[0].src + '" class="lazy">' +
        '</div>' +
        '</div>' +
        '</a>')
}

//渲染dsp广告
Video.prototype.loadDsp = function(data, ggId) {
    var scope = this,
        $content = $('article.content').eq(0);
    $content.after('<div id="extra"></div>')
    var fData = data.data,
        data = data.data[0];
    if (fData.length >= 1) {
        if (data.miniimg_size == 3) {
            scope.loadSanGg(data);
        } else {
            scope.loadDanGg(data);
        }
    } else {
        scope.loadThree(ggId);
    }

    var o = $('#extra').find('.gg_link');
    //获取参数
    var option = {
        platform: o.attr('data-platform'),
        adv: o.attr('data-advId'),
        to: o.attr('href'),
        softname: 'toutiao_' + scope.qid + '_h5',
        clickbackurl: o.attr('data-clickback')
    };
    scope.sendAdShowLog(option);
    $('#extra').on('click', '.gg_link', function(e) {
        e.preventDefault();
        scope.ggClickLog(option, function() {
            window.location.href = data.url;
        });
    });
}

//获取dsp广告
Video.prototype.getDsp = function(ggId) {
    var scope = this;
    $.ajax({
        url: dspUrl,
        dataType: 'jsonp',
        jsonp: 'jsonpcallback',
        timeout: 3000,
        data: {
            type: $('#J_video').attr('data-type') || 'toutiao',
            qid: scope.qid,
            uid: scope.userId,
            os: GLOBAL.Util.getOsType(),
            thisurl: GLOBAL.Util.getUrlNoParams(),
            pgnum: 1,
            adnum: 1,
        },
        success: function(data) {
            scope.loadDsp(data, ggId);
        },
        error: function() {
            scope.loadThree(ggId);
        }
    })
}

/**
 * dsp广告点击日志记录
 * @param  {[type]}   option
 * {
 *     platform: '',
 *     clickbackurl: '',
 *     to: '',   // 广告链接
 *     adv: ''  // 广告ID
 * }
 * @param  {Function} callback 回调方法
 */
Video.prototype.ggClickLog = function(option, callback) {
    var scope = this;
    $.ajax({
        url: clickLogUrl,
        dataType: 'jsonp',
        data: {
            'qid': scope.qid,
            'uid': scope.userId,
            'loginid': 'null',
            'softtype': 'news',
            'softname': option.softname,
            'newstype': 'ad',
            'pgtype': 'video', // 区分dsp广告是位于哪个页面
            'accurateurl': 'null',
            'adpgnum': 'null', // 页码
            'adposition': 'null', // 位置
            'platform': option.platform || 'null', // 平台
            //'clickbackurl': 'null',
            'from': 'null',
            'to': option.to || 'null', // 广告链接
            'os_type': GLOBAL.Util.getOsType(), // 操作系统
            'browser_type': GLOBAL.Util.getBrowserType(), // 浏览器类型
            'pixel': window.screen.width + '*' + window.screen.height, // 客户端分辨率
            'ime': 'null',
            'fr_url': location.href.split('?')[0],
            'adv': option.adv || 'null' // 广告id
        },
        jsonp: 'jsonpcallback',
        timeout: 2000,
        success: function() {},
        complete: function() {
            callback && callback();
        }
    });
}

/**
 * 发送DSP广告（show）的统计信息
 * @param  {[type]} advId  广告ID
 * @param  {[type]} advUrl 广告URL
 * @return {[type]}        [description]
 */
Video.prototype.sendAdShowLog = function(option) {
    var scope = this,
        pixel = GLOBAL.Util.getPixel();
    $.ajax({
        url: showAdLogUrl,
        dataType: 'jsonp',
        data: {
            "qid": scope.qid || 'null',
            "uid": scope.userId || 'null',
            "loginid": 'null',
            "softtype": 'news',
            "softname": option.softname,
            "newstype": 'ad',
            "from": 'null',
            "advurl": option.to || 'null',
            "os_type": scope.osType || 'null',
            "browser_type": scope.browserType || 'null',
            "fr_url": "null",
            "pixel": pixel.w + '*' + pixel.h,
            "ime": "null",
            "adv": option.adv || 'null'
        },
        jsonp: 'jsonpcallback',
        success: function() {}
    });
}
