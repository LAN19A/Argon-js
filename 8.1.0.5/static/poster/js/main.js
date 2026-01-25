var oldPoster = (function () {
    var animateClassName = '';
    function render(data) {
        var modelData = data.modelData;
        var cHtml;
        cHtml = format('<div class=" {0} {1} " style="background:{2}" id="{4}">{3}</div>',
            data.direction == 1 ? 'poster-1920' : 'poster-1080', '',
            (data.bgColor || 'none'), (getHTML(modelData) || ''), 'poster_show_' + data.id);
        document.getElementById('page_wrap').innerHTML = cHtml;
        setZoom(document.getElementById('poster_show_' + data.id));
    }

    function getHTML(data) {
        var resHtml = '';
        for (var i = 0, len = data.length; i < len; i++) {
            var d = data[i];
            switch (d.type) {
                case 'wrap':
                    resHtml += getWrapHTML(d);
                    break;
                case 'image':
                    resHtml += getImageHTML(d);
                    break;
                case 'text':
                    resHtml += getTextHTML(d);
                    break;
                default:
                    break;
            }
        }
        return resHtml;
    }

    function getWrapHTML(data) {
        return format('<div class="{0}" style="{1}">{2}</div>',
            data.name, getCss(data), data.children && data.children.length > 0 ? (getHTML(data.children) || '') : '');
    }

    function getImageHTML(data) {
        return format('<div class="{0} " data-src="{2}" style="{1}"><img class="type-img" data-src="{3}" style="width:100%;height:100%;"/></div>',
            data.name, getCss(data), data.src, data.src)
    }

    function getTextHTML(data) {
        return format('<div class="{0}" style="{1}">{2}</div>',
            data.name, getCss(data), data.text || '')
    }

    function getCss(data) {
        var res = '', cssData, name;
        if (typeof data.css == 'string') {
            data.css += ';background-image:none;'
            return data.css;
        }
        cssData = data.css;
        for (name in cssData) {
            if (name != 'background-image') {
                res += format('{0}:{1};', name, (cssData[name] + '').replace(/\"/g, "'"));
            }
        }
        if (data.type == 'image' && data.src) {
            res += 'background-image:none;';
        }
        return res;
    }

    function setAnimateCss(data) {
        var style = document.createElement("style");
        style.type = "text/css";
        if (data.animationCss) {
            style.innerHTML = data.animationCss;
        } else {
            style.innerHTML = genAnimateCss(data);
        }
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(style);
    }

    function genAnimateCss(data) {
        var modelData = data.modelData;
        var _animateClassName = '.' + data.animationClass;
        var css = '';
        var _am;
        var setCss = function (mData) {
            if (mData.animate) {
                _am = mData.animate;
                css += _animateClassName + ' .' + mData.name + '{' +
                    'animation-name: transform_' + mData.name + ';' +
                    '-webkit-animation-name: transform_' + mData.name + ';' +
                    '-moz-animation-name: transform_' + mData.name + ';' +
                    'animation-delay: ' + (_am.delay + '').replace('s', '') + 's;' +
                    '-webkit-animation-delay: ' + (_am.delay + '').replace('s', '') + 's;' +
                    '-moz-animation-delay: ' + (_am.delay + '').replace('s', '') + 's;' +
                    'animation-duration: ' + (_am.duration + '').replace('s', '') + 's;' +
                    '-webkit-animation-duration: ' + (_am.duration + '').replace('s', '') + 's;' +
                    '-moz-animation-duration: ' + (_am.duration + '').replace('s', '') + 's;' +
                    'animation-iteration-count: ' + (_am.count || 1) + ';' +
                    'animation-fill-mode: ' + (_am.mode || 'both') + ';' +
                    '-webkit-animation-fill-mode: ' + (_am.mode || 'both') + ';' +
                    '-moz-animation-fill-mode: ' + (_am.mode || 'both') + ';' +
                    getCss(_am) + '}';
                css += '@keyframes transform_' + mData.name + ' {' +
                    (function (keyframes) {
                        var res = '';
                        keyframes.forEach(function (d) {
                            res += d.name + ' {' +
                                d.value + ' } ';
                        });
                        return res;
                    })(_am.keyframes) + '}';
            }
        };
        var eachModelData = function (data) {
            data.forEach(function (d, i) {
                setCss(d);
                if (d.children) {
                    eachModelData(d.children);
                }
            });
        };
        eachModelData(modelData);
        return css;
    }

    function setZoom(el) {
        var windowHeight = el.offsetHeight;
        var windowWidth = el.offsetWidth;
        var width = el.parentNode.offsetWidth;
        var height = el.parentNode.offsetHeight;
        (function () {
            if (windowWidth > windowHeight) {
                el.style.zoom = width / 1920;
            } else {
                if (width >= 1080) {
                    if (height < 1920) {
                        el.style.zoom = height / 1920;
                        el.style.margin = '0 auto';
                    } else {
                        el.style.zoom = 1;
                    }
                } else {
                    el.style.zoom = width / 1080;
                }
            }
        })();
    }

    function imgLoadEnd(callbackFn) {
        var $els = document.getElementsByTagName('img');
        var i = 0, len;
        var $images = [], imgNum = 0;
        for (i = 0, len = $els.length; i < len; i++) {
            var $div = $els[i];
            if ($div.getAttribute('class').indexOf('type-img') > -1) {
                $images.push($div);
            }
        }
        imgNum = $images.length;
        len = 0;
        var $img;
        var loaded = function ($img) {
            var url = $img.getAttribute('data-src');
            var _img = new Image();
            _img.src = url;
            _img.onload = function () {
                len++;
                $img.setAttribute('src', url);
                if (len == imgNum - 1) {
                    callbackFn();
                }
            };
            _img.onerror = function () {
                len++;
                $img.style.display = 'none';
                if (len == imgNum - 1) {
                    callbackFn();
                }
            }
        };
        for (i = 0; i < imgNum; i++) {
            loaded($images[i]);
        }
    }

    var runAnimate = function () {
        if (!!document.getElementById('poster_show_' + data.id)) { // 资源下载完毕
            var $posterShow = document.getElementById('poster_show_' + data.id);
            var className = $posterShow.getAttribute('class');
            setTimeout(function () {
                document.getElementById('_page_body_').style.backgroundColor = '#fff';
                $posterShow.setAttribute('class', className + ' ' + data.animationClass);
            }, 30);
            return false;
        } else {
            setTimeout(runAnimate, 30);
        }
    };
    return {
        runAnimate: runAnimate,
        init: function (data) {
            animateClassName = data.animationClass;
            setAnimateCss(data);
            render(data);
            setTimeout(function () {
                imgLoadEnd(function () {
                    if (typeof longjing != 'undefined') {
                        longjing.loaded();
                    } else {
                        console.log('load end --  by success')
                    }
                });
            }, 20);
        }
    }
})();

var newPoster = (function () {
    function render(data) {
        var modelData = data;
        var cHtml;
        if (!data.componentList || data.componentList.length == 0) return false;
        cHtml = format('<div  style="position:absolute;top:0;left:0;background:{0};height:{1}px;width:{2}px;" id="preview-body">{3}</div>',
            (data.bgColor || 'none'), data.virtualHeight, data.virtualWidth, (getHTML(modelData.componentList) || ''));
        document.getElementById('page_wrap').innerHTML = cHtml;
        setZoom(document.getElementById('preview-body'), data);
    }

    function getHTML(data) {
        var resHtml = '';
        for (var i = 0, len = data.length; i < len; i++) {
            var d = data[i];
            switch (d.type) {
                case 'image':
                    resHtml += getImageHTML(d);
                    break;
                case 'text':
                    resHtml += getTextHTML(d);
                    break;
                case 'animate':
                    resHtml += getAnimateHTML(d);
                    break;
                default:
                    break;
            }
        }
        return resHtml;
    }

    function getImageHTML(data) {
        return format('<div class="{0} " data-src="{1}" style="{2}"><img class="type-img" data-src="{1}" style="display: block; width: 100%; height: 100%; object-fit: contain;"/></div>',
            getClassName(data), data.data, getCss(data))
    }

    function getTextHTML(data) {
        return format('<div class="{0}" style="{1}">{2}</div>',
            getClassName(data), getCss(data), data.data || '')
    }

    function getAnimateHTML(data) {
        var animateHtml = '';
        switch (data.animation.type) {
            case '1':
            case 1:
                animateHtml = '<div class="itemYanWuImg1"></div><div class="itemYanWuImg2"></div>';
                break;
            default:
                break;
        }
        return format('<div class="{0} " data-src="{1}" style="{2}">{3}</div>',
            getClassName(data), data.data, getCss(data), animateHtml);
    }

    function getCss(data) {
        var res = 'position:absolute;', cssData = data.cssOptions, name, cssValue;
        res += format('top:{0}px;left:{1}px;width:{2}px;height:{3}px;z-index:{4};background:{5};-webkit-transform: rotate({6}deg);transform: rotate({6}deg);',
            data.y, data.x, data.w, data.h, data.zIndex, data.bgColor, data.angle);
        for (name in cssData) {
            if (name != 'background-image') {
                if (cssData[name]) {
                    cssValue = cssData[name];
                    if (name == 'font-size') {
                        cssValue += 'px';
                    } else if (name == 'letter-spacing') {
                        cssValue += 'px';
                    } else if (name == 'opacity') {
                        cssValue = cssValue / 100;
                    }
                    res += format('{0}:{1};', name, (cssValue + '').replace(/\"/g, "'"));
                }
            }
        }
        if (data.animation.type) {
            res += format('animation-duration: {0}s;animation-delay: {1}s;animation-iteration-count: {2};',
                data.animation.duration || 0, data.animation.delay || 0, data.animation.count == 0 ? 'infinite' : (data.animation.count || 0));
        }
        return res;
    }

    function getClassName(data) {
        switch (data.type) {
            case 'text':
            case 'image':
                return format(' {0} animated  ', data.animation.type);
                break;
            case 'animate':
                if (data.animation.type == 1) {
                    return '';
                }
                break;
            default:
                break;
        }
        return '';
    }
    function setZoom(el, data) {
        var windowHeight = el.parentNode.offsetHeight;
        var windowWidth = el.parentNode.offsetWidth;
        var width = data.virtualWidth;
        var height = data.virtualHeight;
        if (width / windowWidth > height / windowHeight) {
            el.style.zoom = windowWidth / width;
        } else {
            el.style.zoom = windowHeight / height;
        }
    }
    return {
        init: function (data) {
            render(data);
            var $imgs = $('img');
            var imgNum = $imgs.length;
            var len = 0;
            var loaded = function ($img) {
                var url = $img.getAttribute('data-src');
                var _img = new Image();
                _img.src = url;
                _img.onload = function () {
                    len++;
                    $img.setAttribute('src', url);
                    if (len == imgNum - 1) {
                        if (typeof longjing != 'undefined') {
                            longjing.loaded();
                        } else {
                            console.log('load end --  by success')
                        }
                    }
                };
                _img.onerror = function () {
                    len++;
                    $img.style.display = 'none';
                    if (len == imgNum - 1) {
                        if (typeof longjing != 'undefined') {
                            longjing.loaded();
                        } else {
                            console.log('load end--- by error')
                        }
                    }
                }
            };
            $imgs.each(function (i, $img) {
                loaded($($img).get(0))
            });
        }
    }
})();

function format() {
    ///	<summary>
    ///	字符串格式化。第一个参数是格式，第二个参数是格式化的第一个参数，第三个参数是格式化的第二个参数...
    /// var fmt = "Hello {0}!";Swao.utils.String.format(fmt, "Andrew");
    ///	</summary>
    ///	<param name="str" type="String">输入字符串</param>
    ///	<returns type="int">字符串长度(中文2个字符)</returns>

    if (arguments.length == 0)
        return null;
    var str = arguments[0];
    var re = '', i = 0;

    function isArray(value) {
        if (typeof Array.isArray === "function") {
            return Array.isArray(value);
        } else {
            return Object.prototype.toString.call(value) === "[object Array]";
        }
    }

    // 如果第二个参数是数组
    if (isArray(arguments[1])) {
        var array = arguments[1];
        for (; i < array.length; i++) {
            re = new RegExp('\\{' + i + '\\}', 'gm');
            str = (str + '').replace(re, array[i]);
        }
    } else {
        for (i = 1; i < arguments.length; i++) {
            re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
            str = (str + '').replace(re, arguments[i]);
        }
    }
    return str;
}

