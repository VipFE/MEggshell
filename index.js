/**
 * Created by hoosin on 2016/10/21.
 */
;(function(root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.eggshell = factory();
    }
})(this, function() {

    var eggshell = {};

    // 默认4个手指按住屏幕，强制刷新
    var finger = (function() {
        var fingerDebugIsOpen = true;
        var fingersDefaultNumber = 4;

        function fn(ev) {
            if (fingerDebugIsOpen === false) {
                return;
            }

            if (ev.touches.length === fingersDefaultNumber) {
                window.location.reload(true);
            }
        }

        return {
            open: function(fingers) {
                fingerDebugIsOpen = true;

                if (typeof fingers === "number" && fingers > 0) {
                    fingersDefaultNumber = fingers;
                }

                // 如果已经绑定过就不再绑定了，但可以修改手指的数量
                document.removeEventListener('touchstart', fn);
                document.addEventListener('touchstart', fn, false);
            },

            close: function() {
                fingerDebugIsOpen = false;
                document.removeEventListener('touchstart', fn);
            }
        }
    })();

    var errorSign = '__js_error__';

    // 打印日志管理
    var log = (function() {

        // 调试模式是否开启
        var openKey = false;

        // 是否重写系统 console 方法
        var rewriteConsoleKey = false;

        var consoleData = [];
        var oldConsole = console;

        var popStyleId = '__xl_js_debug_console_pop_style';
        var popId = '__xl_js_debug_console_pop';
        var popClassName = '__xl_debug_console_pop';
        var popUlId = '__xl_js_debug_console_pop_ul';
        var popCloseClassName = '__xl_debug_console_pop_close';
        var popCloseId = '__xl_js_debug_console_pop_close';

        // 如何显示debug数据
        // 10秒内，双指按10次。
        var maxTime = 10 * 1000;
        var beiginTime = 0;
        var endTime = 0;

        // 双指头，10次
        var jishu = 0;
        var maxJishu = 20;
        var fingers = 2

        // 在chrome上的测试时需要的参数
        // 线上需要注释掉的
        //        var maxJishu = 5;
        //        var fingers = 1;

        var STATUS = {
            hide: 0,
            show: 1
        };

        var curStatus = STATUS.hide;

        var cacheName = '_xl_eggshell_rewriteConsole_key';

        function copyConsole(objName, callback) {
            window[objName] = {};

            for (var i in oldConsole) {
                if (typeof oldConsole[i] == 'function') {
                    window[objName][i] = (function(cfn) {
                        return function() {
                            var data = Array.prototype.slice.call(arguments);
                            if (typeof callback == 'function') {
                                callback(data);
                            }
                            //consoleData.push(data);

                            cfn.apply(oldConsole, arguments);
                        }
                    })(oldConsole[i]);
                } else {
                    window[objName][i] = oldConsole[i];
                }
            }
        }

        // 重写系统console
        function rewriteConsole() {
            copyConsole('console', function(data) {
                consoleData.push(data);
            });
        }

        function xlconsole() {
            copyConsole('xlconsole', function(data) {
                consoleData.push(data);
            });
        }

        // 里面的fn只做一次
        function doOnce(fn) {
            if (fn.__done === true) {
                return;
            }

            fn.__done = true;
            fn();
        }

        return {

            // 默认 只开启 xlconsole 功能
            // 因为console重写会导致正常的调试的代码位置全部定向eggshell.js的console，这就不方便了。
            init: function() {
                var that = this;

                that.open();

                if (rewriteConsoleKey) {
                    rewriteConsole();
                }

                doOnce(function() {
                    // 默认开启 xlconsole
                    xlconsole();

                    document.querySelector('html').addEventListener('touchstart', function(ev) {
                        if (that.isClose()) {
                            return;
                        }

                        // 如果已显示，3个手指点1次，关闭log窗口
                        if (curStatus === STATUS.show) {
                            if (ev.touches.length === 3) {
                                that.hide();
                            }

                            return;
                        };

                        if (ev.touches.length === fingers) {
                            if (beiginTime === 0) {
                                beiginTime = +new Date();
                            }

                            jishu++;
                            // console.log(jishu);
                        }

                        if (jishu >= maxJishu) {
                            endTime = +new Date();
                            // 在maxTime触发了彩蛋，显示log
                            // console.log(endTime - beiginTime, maxTime);
                            if (endTime - beiginTime <= maxTime) {
                                that.show();
                            }

                            beiginTime = 0;
                            jishu = 0;
                        }
                    }, false);
                });
            },

            // 返回收集的log数据
            get: function() {
                return consoleData;
            },

            // 插入样式
            insertStyle: function() {
                doOnce(function() {
                    var styleStr =
                        'body .__xl_debug_console_pop, body .__xl_debug_console_pop *{' +
                        'margin: 0;' +
                        'font-family: "menlo", "monospace", "Consolas", "Helvetica Neue", Helvetica, STHeiTi, sans-serif;' +
                        'padding: 0;' +
                        'font-size:12px !important;' +
                        'word-break:break-all !important;' +
                        'word-wrap:break-word !important;' +
                        '-webkit-user-select: all !important;' +
                        'user-select: all !important' +
                        'list-style: none !important;' +
                        '}' +
                        'body .__xl_debug_console_pop{' +
                        'position: fixed;' +
                        'z-index: 999999;' +
                        'width: 100%;' +
                        'height: 100%;' +
                        'left: 0;' +
                        'top: 0;' +
                        'right: 0;' +
                        'bottom: 0;' +
                        'background-color: #000;' +
                        'color: #fff; overflow-y:scroll;' +
                        'font-size: 0.8em;' +
                        '}' +
                        'body .__xl_debug_console_pop ul{' +
                        'padding: 0 0 40px;' +
                        '}' +
                        'body .__xl_debug_console_pop ul li{' +
                        '    padding: 6px;' +
                        '}' +
                        'body .__xl_debug_console_pop ul li b{' +
                        '    padding:0 4px 0 0;' +
                        '}' +
                        'body .__xl_debug_console_pop ul li.error{' +
                        '   background-color: #E60808; ' +
                        '}' +
                        'body .__xl_debug_console_pop ul li:nth-child(2n) {' +
                        '    background-color: #3E3636;' +
                        '}' +
                        'body .__xl_debug_console_pop ul li.error:nth-child(2n) {' +
                        '    background-color: #BB2727;' +
                        '}' +
                        'body .__xl_debug_console_pop ul li span{' +
                        '    padding: 2px 4px !important;' +
                        '    background-color: #fff;' +
                        '    color: #000;' +
                        '    display: inline-block;' +
                        '    margin: 2px;' +
                        '    border-radius: 2px;' +
                        '}' +
                        'body .__xl_debug_console_pop_close{' +
                        '    position: fixed;' +
                        '    right: 0;' +
                        '    bottom: 0;' +
                        '    background-color: #b28772;' +
                        '    width: 40px;' +
                        '    height: 40px;' +
                        '    line-height: 40px;' +
                        '    color: #fff; display:none;' +
                        '    text-align: center;' +
                        '}';

                    var head = document.head || document.body;
                    var style = document.createElement('style');
                    style.id = popStyleId;

                    style.appendChild(document.createTextNode(styleStr));
                    head.appendChild(style);
                });
            },

            // 显示log数据
            show: function() {
                var that = this;

                if (curStatus === STATUS.show) return;
                curStatus = STATUS.show;

                that.insertStyle();

                var htmlStr =
                    '<p style="padding: 10px 0 0 0; font-size: 16px !important;">【提示：3个手指点1次关闭调试】</p>' +
                    '<span class="' + popCloseClassName + '" id="' + popCloseId + '">close</span>' +
                    '<ul id="' + popUlId + '"></ul>';

                var pop = document.createElement('div');
                pop.id = popId;
                pop.className = popClassName;
                document.body.appendChild(pop);

                document.querySelector("#" + popId).innerHTML = htmlStr;

                // 插入数据
                var liStr = '';

                for (var i = 0, len = consoleData.length; i < len; i++) {
                    var d = consoleData[i];
                    var spanStr = '';

                    // 错误信息
                    if (d[0] === errorSign) {

                        spanStr = '<span><b>[error-message]</b>' + d[1] + '</span>';
                        spanStr += '<span><b>[error-source]</b>' + d[2] + '</span>';
                        spanStr += '<span><b>[error-line]</b>' + d[3] + '</span>';

                        liStr += '<li class="error">' + spanStr + '</li>';

                    } else { // 正常信息

                        for (var j = 0; j < d.length; j++) {
                            var s = '';
                            var t = d[j];

                            if (typeof t == 'string') {
                                s = t;
                            } else if (typeof t == 'function') {
                                s = t.toString();
                            } else {
                                s = JSON.stringify(t);
                            }

                            spanStr += '<span><b>[' + Object.prototype.toString.call(t).split(" ")[1] + '</b>' + s + '</span>';
                        }

                        liStr += '<li>' + spanStr + '</li>';
                    }
                }

                document.querySelector("#" + popUlId).innerHTML = liStr;

                // 绑定关闭按钮
                var popCloseBtn = document.querySelector("#" + popCloseId);

                function bindPopClose() {
                    that.hide();
                }

                popCloseBtn.removeEventListener('click', bindPopClose);
                popCloseBtn.addEventListener('click', bindPopClose, false);
            },

            // 隐藏log数据
            hide: function() {
                var pop = document.getElementById(popId);

                if (pop) {
                    curStatus = STATUS.hide;
                    pop.parentNode.removeChild(pop);

                    document.querySelector('html').style.overflow = "static";
                }
            },

            // 关闭log模式
            close: function() {
                openKey = false;
            },

            // 开启log模式
            open: function() {
                openKey = true;
            },

            isOpen: function() {
                return openKey;
            },

            isClose: function() {
                return !openKey;
            },

            // 开启系统 console, xlconsole 的内容也会显示
            // 注意，开启过程中，就无法关闭了
            openSysConsole: function() {
                rewriteConsoleKey = true;
                this.init();
            }
        }
    })();

    // 默认开启4指调试
    finger.open();

    // 默认开启 xlconsole 调试
    log.init();

    eggshell.finger = finger;
    eggshell.log = log;

    window.onerror = function(message, source, lineno, colno, error) {
        xlconsole.log(errorSign, message, source, lineno);
        return false;
    };

    return eggshell;
});