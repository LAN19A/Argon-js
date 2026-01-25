$(function () {
    var clock = $('#clock'),
        alarm = clock.find('.alarm');

    var alarm_counter = -1;

    var digit_to_name = 'zero one two three four five six seven eight nine'.split(' ');

    var digits = {};

    var positions = [
        'h1', 'h2', ':', 'm1', 'm2', ':', 's1', 's2'
    ];

    var digit_holder = clock.find('.digits');

    $.each(positions, function () {

        if (this == ':') {
            digit_holder.append('<div class="dots">');
        } else {

            var pos = $('<div>');

            for (var i = 1; i < 8; i++) {
                pos.append('<span class="d' + i + '">');
            }
            digits[this] = pos;
            digit_holder.append(pos);
        }

    });
    var endDate = parseParams('end');

    function getNOW() {
        if (!endDate) return moment().format("hhmmssdA");
        var time = moment(endDate,'YYYYMMDDHHmmss').diff(moment(), 'seconds');
        if(time<0)return '000000';
        var hour = (time / 60 / 60) | 0;
        var minute = ((time - hour * 60 * 60) / 60) | 0;
        var seconds = time - hour * 60 * 60 - minute * 60;
        hour = (hour < 10 ? '0' + hour : hour) + '';
        minute = (minute < 10 ? '0' + minute : minute) + '';
        seconds = (seconds < 10 ? '0' + seconds : seconds) + '';
        return hour + minute + seconds;
    }
    getNOW();
    (function update_time() {
        var now = getNOW();
        digits.h1.attr('class', digit_to_name[now[0]]);
        digits.h2.attr('class', digit_to_name[now[1]]);
        digits.m1.attr('class', digit_to_name[now[2]]);
        digits.m2.attr('class', digit_to_name[now[3]]);
        digits.s1.attr('class', digit_to_name[now[4]]);
        digits.s2.attr('class', digit_to_name[now[5]]);
        if(now =='000000'){
            return false;
        }
        if (alarm_counter > 0) {
            alarm_counter--;
            alarm.addClass('active');
        } else if (alarm_counter == 0) {
            try {
                $('#alarm-ring')[0].play();
            } catch (e) {
            }

            alarm_counter--;
            alarm.removeClass('active');
        } else {
            alarm.removeClass('active');
        }
        setTimeout(update_time, 1000);
    })();

    var fontColor = parseParams('color')|| '#ffffff';
    if(fontColor == 0){
        fontColor = '#000000';
    }else if(fontColor == 1){
        fontColor = '#FFFFFF';
    }else if(fontColor == 2){
        fontColor = '#e50013';
    }else{
        fontColor = fontColor ? (fontColor.indexOf('#')>-1 ? fontColor :'#'+fontColor):'#000000';
    }

    $('head').append(format(`<style>
		#clock.light .digits div span{
		background-color:{0};
		border-color:{0};
		}

		#clock.light .digits div.dots:before,
		#clock.light .digits div.dots:after{
		background-color:{0};
		}
	</style>`,fontColor));
    var scale = parseParams('scale')||1;

    var $cOuter = $('#clockOuter');
    var $clock = $('#clock');
    var zoomX = ($cOuter.width()/$clock.width()).toFixed(4);
    var zoomY = ($cOuter.height()/$clock.height()).toFixed(4);
    $clock.css({
        transform:'scaleX('+zoomX+') scaleY('+zoomY+')',
        'transform-origin':'left top'
    });
    // 定义一个全局变量存储上次窗口大小信息
    var lastWindowSize = { width: window.innerWidth, height: window.innerHeight };

    // 添加窗口大小变化事件监听器
    window.addEventListener('resize', function() {
        // 获取当前窗口大小信息
        var currentWindowSize = { width: window.innerWidth, height: window.innerHeight };
        // 判断窗口大小是否有变化
        if (currentWindowSize.width !== lastWindowSize.width || currentWindowSize.height !== lastWindowSize.height) {
            console.warn("窗口大小已经发生了变化！");
            // 更新lastWindowSize为最新值
            lastWindowSize = currentWindowSize;
            var $cOuter = $('#clockOuter');
            var $clock = $('#clock');
            var zoomX = ($cOuter.width()/$clock.width()).toFixed(4);
            var zoomY = ($cOuter.height()/$clock.height()).toFixed(4);
            $clock.css({
                transform:'scaleX('+zoomX+') scaleY('+zoomY+')',
                'transform-origin':'left top'
            });
        } else {
            console.warn("窗口大小没有发生变化。");
        }
    });

    window.addEventListener('hashchange', function() {
        // URL发生改变时触发该函数
        var fontColor = parseParams('color')|| '#ffffff';
        if(fontColor == 0){
            fontColor = '#000000';
        }else if(fontColor == 1){
            fontColor = '#FFFFFF';
        }else if(fontColor == 2){
            fontColor = '#e50013';
        }else{
            fontColor = fontColor ? (fontColor.indexOf('#')>-1 ? fontColor :'#'+fontColor):'#000000';
        }

        $('head').append(format(`<style>
            #clock.light .digits div span{
                background-color:{0};
                border-color:{0};
            }
            #clock.light .digits div.dots:before,
            #clock.light .digits div.dots:after{
                background-color:{0};
            }
	    </style>`,fontColor));
    });


	function format() {
		if (arguments.length == 0)
			return null;
		var str = arguments[0];
		var re = '', i = 0;
		for (i = 1; i < arguments.length; i++) {
			re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
			str = str.replace(re, arguments[i]);
		}
		return str;
	}

    function parseParams(key) {
        var paramStr = window.location.href.split('?')[1] || '';
        if (paramStr.indexOf('#/') > -1) paramStr = paramStr.split('#/')[0]
        var result = null;
        var params, paramArr;
        if (paramStr.length > 0) {
            params = paramStr.split("&");
            if (typeof key == 'undefined') {
                result = {};
                for (var i = 0; i < params.length; i++) {
                    paramArr = params[i].split("=");
                    result[paramArr[0]] = decodeURIComponent(paramArr[1]);
                }
                if (jQuery.isEmptyObject(result)) {
                    result = null;
                }
            } else {
                for (var j = 0; j < params.length; j++) {
                    paramArr = params[j].split("=");
                    var indexKey = paramArr[0];
                    if (key == indexKey) {
                        result = decodeURIComponent(paramArr[1]);
                    }
                }
            }
        }
        return result;
    }
});
