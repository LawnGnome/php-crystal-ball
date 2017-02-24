/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/php-crystal-ball/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

///#source 1 1 /src/1.0.0/core.js
/*! head.core - v1.0.2 */
/*
 * HeadJS     The only script in your <HEAD>
 * Author     Tero Piirainen  (tipiirai)
 * Maintainer Robert Hoffmann (itechnology)
 * License    MIT / http://bit.ly/mit-license
 * WebSite    http://headjs.com
 */
(function(win, undefined) {
    "use strict";

    // gt, gte, lt, lte, eq breakpoints would have been more simple to write as ['gt','gte','lt','lte','eq']
    // but then we would have had to loop over the collection on each resize() event,
    // a simple object with a direct access to true/false is therefore much more efficient
    var doc   = win.document,
        nav   = win.navigator,
        loc   = win.location,
        html  = doc.documentElement,
        klass = [],
        conf  = {
            screens   : [240, 320, 480, 640, 768, 800, 1024, 1280, 1440, 1680, 1920],
            screensCss: { "gt": true, "gte": false, "lt": true, "lte": false, "eq": false },
            browsers  : [
                            { ie: { min: 6, max: 11 } }
                           //,{ chrome : { min: 8, max: 33 } }
                           //,{ ff     : { min: 3, max: 26 } }
                           //,{ ios    : { min: 3, max:  7 } }
                           //,{ android: { min: 2, max:  4 } }
                           //,{ webkit : { min: 9, max: 12 } }
                           //,{ opera  : { min: 9, max: 12 } }
            ],
            browserCss: { "gt": true, "gte": false, "lt": true, "lte": false, "eq": true },
            html5     : true,
            page      : "-page",
            section   : "-section",
            head      : "head"
        };

    if (win.head_conf) {
        for (var item in win.head_conf) {
            if (win.head_conf[item] !== undefined) {
                conf[item] = win.head_conf[item];
            }
        }
    }

    function pushClass(name) {
        klass[klass.length] = name;
    }

    function removeClass(name) {
        // need to test for both space and no space
        // https://github.com/headjs/headjs/issues/270
        // https://github.com/headjs/headjs/issues/226
        var re = new RegExp(" ?\\b" + name + "\\b");
        html.className = html.className.replace(re, "");
    }

    function each(arr, fn) {
        for (var i = 0, l = arr.length; i < l; i++) {
            fn.call(arr, arr[i], i);
        }
    }

    // API
    var api = win[conf.head] = function() {
        api.ready.apply(null, arguments);
    };

    api.feature = function(key, enabled, queue) {

        // internal: apply all classes
        if (!key) {
            html.className += " " + klass.join(" ");
            klass = [];

            return api;
        }

        if (Object.prototype.toString.call(enabled) === "[object Function]") {
            enabled = enabled.call();
        }

        pushClass((enabled ? "" : "no-") + key);
        api[key] = !!enabled;

        // apply class to HTML element
        if (!queue) {
            removeClass("no-" + key);
            removeClass(key);
            api.feature();
        }

        return api;
    };

    // no queue here, so we can remove any eventual pre-existing no-js class
    api.feature("js", true);

    // browser type & version
    var ua     = nav.userAgent.toLowerCase(),
        mobile = /mobile|android|kindle|silk|midp|phone|(windows .+arm|touch)/.test(ua);

    // useful for enabling/disabling feature (we can consider a desktop navigator to have more cpu/gpu power)
    api.feature("mobile" , mobile , true);
    api.feature("desktop", !mobile, true);

    // http://www.zytrax.com/tech/web/browser_ids.htm
    // http://www.zytrax.com/tech/web/mobile_ids.html
    ua = /(chrome|firefox)[ \/]([\w.]+)/.exec(ua) || // Chrome & Firefox
        /(iphone|ipad|ipod)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || // Mobile IOS
        /(android)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || // Mobile Webkit
        /(webkit|opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || // Safari & Opera
        /(msie) ([\w.]+)/.exec(ua) ||
        /(trident).+rv:(\w.)+/.exec(ua) || [];

    var browser = ua[1],
        version = parseFloat(ua[2]);

    switch (browser) {
    case "msie":
    case "trident":
        browser = "ie";
        version = doc.documentMode || version;
        break;
        
    case "firefox":
        browser = "ff";
        break;
        
    case "ipod":
    case "ipad":
    case "iphone":
        browser = "ios";
        break;
        
    case "webkit":
        browser = "safari";
        break;
    }

    // Browser vendor and version
    api.browser = {
        name: browser,
        version: version
    };
    api.browser[browser] = true;

    for (var i = 0, l = conf.browsers.length; i < l; i++) {
        for (var key in conf.browsers[i]) {
            if (browser === key) {
                pushClass(key);

                var min = conf.browsers[i][key].min;
                var max = conf.browsers[i][key].max;

                for (var v = min; v <= max; v++) {
                    if (version > v) {
                        if (conf.browserCss.gt) {
                            pushClass("gt-" + key + v);
                        }

                        if (conf.browserCss.gte) {
                            pushClass("gte-" + key + v);
                        }
                    } else if (version < v) {
                        if (conf.browserCss.lt) {
                            pushClass("lt-" + key + v);
                        }

                        if (conf.browserCss.lte) {
                            pushClass("lte-" + key + v);
                        }
                    } else if (version === v) {
                        if (conf.browserCss.lte) {
                            pushClass("lte-" + key + v);
                        }

                        if (conf.browserCss.eq) {
                            pushClass("eq-" + key + v);
                        }

                        if (conf.browserCss.gte) {
                            pushClass("gte-" + key + v);
                        }
                    }
                }
            } else {
                pushClass("no-" + key);
            }
        }
    }

    pushClass(browser);
    pushClass(browser + parseInt(version, 10));

    // IE lt9 specific
    if (conf.html5 && browser === "ie" && version < 9) {
        // HTML5 support : you still need to add html5 css initialization styles to your site
        // See: assets/html5.css
        each("abbr|article|aside|audio|canvas|details|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|progress|section|summary|time|video".split("|"), function(el) {
            doc.createElement(el);
        });
    }

    // CSS "router"
    each(loc.pathname.split("/"), function(el, i) {
        if (this.length > 2 && this[i + 1] !== undefined) {
            if (i) {
                pushClass(this.slice(i, i + 1).join("-").toLowerCase() + conf.section);
            }
        } else {
            // pageId
            var id = el || "index", index = id.indexOf(".");
            if (index > 0) {
                id = id.substring(0, index);
            }

            html.id = id.toLowerCase() + conf.page;

            // on root?
            if (!i) {
                pushClass("root" + conf.section);
            }
        }
    });

    // basic screen info
    api.screen = {
        height: win.screen.height,
        width : win.screen.width
    };

    // viewport resolutions: w-100, lt-480, lt-1024 ...
    function screenSize() {
        // remove earlier sizes
        html.className = html.className.replace(/ (w-|eq-|gt-|gte-|lt-|lte-|portrait|no-portrait|landscape|no-landscape)\d+/g, "");

        // Viewport width
        var iw = win.innerWidth || html.clientWidth,
            ow = win.outerWidth || win.screen.width;

        api.screen.innerWidth = iw;
        api.screen.outerWidth = ow;

        // for debugging purposes, not really useful for anything else
        pushClass("w-" + iw);

        each(conf.screens, function(width) {
            if (iw > width) {
                if (conf.screensCss.gt) {
                    pushClass("gt-" + width);
                }

                if (conf.screensCss.gte) {
                    pushClass("gte-" + width);
                }
            } else if (iw < width) {
                if (conf.screensCss.lt) {
                    pushClass("lt-" + width);
                }

                if (conf.screensCss.lte) {
                    pushClass("lte-" + width);
                }
            } else if (iw === width) {
                if (conf.screensCss.lte) {
                    pushClass("lte-" + width);
                }

                if (conf.screensCss.eq) {
                    pushClass("e-q" + width);
                }

                if (conf.screensCss.gte) {
                    pushClass("gte-" + width);
                }
            }
        });

        // Viewport height
        var ih = win.innerHeight || html.clientHeight,
            oh = win.outerHeight || win.screen.height;

        api.screen.innerHeight = ih;
        api.screen.outerHeight = oh;

        // no need for onChange event to detect this
        api.feature("portrait" , (ih > iw));
        api.feature("landscape", (ih < iw));
    }

    screenSize();

    // Throttle navigators from triggering too many resize events
    var resizeId = 0;

    function onResize() {
        win.clearTimeout(resizeId);
        resizeId = win.setTimeout(screenSize, 50);
    }

    // Manually attach, as to not overwrite existing handler
    if (win.addEventListener) {
        win.addEventListener("resize", onResize, false);

    } else {
        // IE8 and less
        win.attachEvent("onresize", onResize);
    }
}(window));
///#source 1 1 /src/1.0.0/css3.js
/*! head.css3 - v1.0.0 */
/*
 * HeadJS     The only script in your <HEAD>
 * Author     Tero Piirainen  (tipiirai)
 * Maintainer Robert Hoffmann (itechnology)
 * License    MIT / http://bit.ly/mit-license
 * WebSite    http://headjs.com
 */
(function (win, undefined) {
    "use strict";

    var doc = win.document,
        /*
            To add a new test:

            head.feature("video", function() {
                var tag = document.createElement('video');
                return !!tag.canPlayType;
            });

            Good place to grab more tests

            https://github.com/Modernizr/Modernizr/blob/master/modernizr.js
        */

        /* CSS modernizer */
        el       = doc.createElement("i"),
        style    = el.style,
        prefs    = " -o- -moz- -ms- -webkit- -khtml- ".split(" "),
        domPrefs = "Webkit Moz O ms Khtml".split(" "),
        headVar  = win.head_conf && win.head_conf.head || "head",
        api      = win[headVar];

    // Thanks Paul Irish!

    function testProps(props) {
        for (var i in props) {
            if (style[props[i]] !== undefined) {
                return true;
            }
        }

        return false;
    }


    function testAll(prop) {
        var camel = prop.charAt(0).toUpperCase() + prop.substr(1),
            props = (prop + " " + domPrefs.join(camel + " ") + camel).split(" ");

        return !!testProps(props);
    }

    var tests = {
        // should we seperate linear/radial ? 
        // seems like some browsers need a test for prefix http://caniuse.com/#feat=css-gradients
        gradient: function () {
            var s1 = "background-image:",
                s2 = "gradient(linear,left top,right bottom,from(#9f9),to(#fff));",
                s3 = "linear-gradient(left top,#eee,#fff);";

            style.cssText = (s1 + prefs.join(s2 + s1) + prefs.join(s3 + s1)).slice(0, -s1.length);
            return !!style.backgroundImage;
        },

        rgba: function () {
            style.cssText = "background-color:rgba(0,0,0,0.5)";
            return !!style.backgroundColor;
        },

        opacity: function () {
            return el.style.opacity === "";
        },

        textshadow: function () {
            return style.textShadow === "";
        },

        multiplebgs: function () {
            style.cssText = "background:url(https://),url(https://),red url(https://)";

            // If the UA supports multiple backgrounds, there should be three occurrences
            // of the string "url(" in the return value for elemStyle.background
            var result = (style.background || "").match(/url/g);

            return Object.prototype.toString.call(result) === "[object Array]" && result.length === 3;
        },

        boxshadow: function () {
            return testAll("boxShadow");
        },

        borderimage: function () {
            return testAll("borderImage");
        },

        borderradius: function () {
            return testAll("borderRadius");
        },

        cssreflections: function () {
            return testAll("boxReflect");
        },

        csstransforms: function () {
            return testAll("transform");
        },

        csstransitions: function () {
            return testAll("transition");
        },
        touch: function () {
            return "ontouchstart" in win;
        },
        retina: function () {
            return (win.devicePixelRatio > 1);
        },

        /*
            font-face support. Uses browser sniffing but is synchronous.
            http://paulirish.com/2009/font-face-feature-detection/
        */
        fontface: function () {
            var browser = api.browser.name, version = api.browser.version;

            switch (browser) {
                case "ie":
                    return version >= 9;
                    
                case "chrome":
                    return version >= 13;
                    
                case "ff":
                    return version >= 6;
                    
                case "ios":
                    return version >= 5;

                case "android":
                    return false;

                case "webkit":
                    return version >= 5.1;
                    
                case "opera":
                    return version >= 10;
                    
                default:
                    return false;
            }
        }
    };

    // queue features
    for (var key in tests) {
        if (tests[key]) {
            api.feature(key, tests[key].call(), true);
        }
    }

    // enable features at once
    api.feature();

}(window));
///#source 1 1 /src/1.0.0/load.js
/*! head.load - v1.0.3 */
/*
 * HeadJS     The only script in your <HEAD>
 * Author     Tero Piirainen  (tipiirai)
 * Maintainer Robert Hoffmann (itechnology)
 * License    MIT / http://bit.ly/mit-license
 * WebSite    http://headjs.com
 */
(function (win, undefined) {
    "use strict";

    //#region variables
    var doc        = win.document,
        domWaiters = [],
        handlers   = {}, // user functions waiting for events
        assets     = {}, // loadable items in various states
        isAsync    = "async" in doc.createElement("script") || "MozAppearance" in doc.documentElement.style || win.opera,
        isDomReady,

        /*** public API ***/
        headVar = win.head_conf && win.head_conf.head || "head",
        api     = win[headVar] = (win[headVar] || function () { api.ready.apply(null, arguments); }),

        // states
        PRELOADING = 1,
        PRELOADED  = 2,
        LOADING    = 3,
        LOADED     = 4;
    //#endregion

    //#region PRIVATE functions

    //#region Helper functions
    function noop() {
        // does nothing
    }

    function each(arr, callback) {
        if (!arr) {
            return;
        }

        // arguments special type
        if (typeof arr === "object") {
            arr = [].slice.call(arr);
        }

        // do the job
        for (var i = 0, l = arr.length; i < l; i++) {
            callback.call(arr, arr[i], i);
        }
    }

    /* A must read: http://bonsaiden.github.com/JavaScript-Garden
     ************************************************************/
    function is(type, obj) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    }

    function isFunction(item) {
        return is("Function", item);
    }

    function isArray(item) {
        return is("Array", item);
    }

    function toLabel(url) {
        ///<summary>Converts a url to a file label</summary>
        var items = url.split("/"),
             name = items[items.length - 1],
             i    = name.indexOf("?");

        return i !== -1 ? name.substring(0, i) : name;
    }

    // INFO: this look like a "im triggering callbacks all over the place, but only wanna run it one time function" ..should try to make everything work without it if possible
    // INFO: Even better. Look into promises/defered's like jQuery is doing
    function one(callback) {
        ///<summary>Execute a callback only once</summary>
        callback = callback || noop;

        if (callback._done) {
            return;
        }

        callback();
        callback._done = 1;
    }
    //#endregion

    function conditional(test, success, failure, callback) {
        ///<summary>
        /// INFO: use cases:
        ///    head.test(condition, null       , "file.NOk" , callback);
        ///    head.test(condition, "fileOk.js", null       , callback);
        ///    head.test(condition, "fileOk.js", "file.NOk" , callback);
        ///    head.test(condition, "fileOk.js", ["file.NOk", "file.NOk"], callback);
        ///    head.test({
        ///               test    : condition,
        ///               success : [{ label1: "file1Ok.js"  }, { label2: "file2Ok.js" }],
        ///               failure : [{ label1: "file1NOk.js" }, { label2: "file2NOk.js" }],
        ///               callback: callback
        ///    );
        ///    head.test({
        ///               test    : condition,
        ///               success : ["file1Ok.js" , "file2Ok.js"],
        ///               failure : ["file1NOk.js", "file2NOk.js"],
        ///               callback: callback
        ///    );
        ///</summary>
        var obj = (typeof test === "object") ? test : {
            test: test,
            success: !!success ? isArray(success) ? success : [success] : false,
            failure: !!failure ? isArray(failure) ? failure : [failure] : false,
            callback: callback || noop
        };

        // Test Passed ?
        var passed = !!obj.test;

        // Do we have a success case
        if (passed && !!obj.success) {
            obj.success.push(obj.callback);
            api.load.apply(null, obj.success);
        }
        // Do we have a fail case
        else if (!passed && !!obj.failure) {
            obj.failure.push(obj.callback);
            api.load.apply(null, obj.failure);
        }
        else {
            callback();
        }

        return api;
    }

    function getAsset(item) {
        ///<summary>
        /// Assets are in the form of
        /// {
        ///     name : label,
        ///     url  : url,
        ///     state: state
        /// }
        ///</summary>
        var asset = {};

        if (typeof item === "object") {
            for (var label in item) {
                if (!!item[label]) {
                    asset = {
                        name: label,
                        url : item[label]
                    };
                }
            }
        }
        else {
            asset = {
                name: toLabel(item),
                url : item
            };
        }

        // is the item already existant
        var existing = assets[asset.name];
        if (existing && existing.url === asset.url) {
            return existing;
        }

        assets[asset.name] = asset;
        return asset;
    }

    function allLoaded(items) {
        items = items || assets;

        for (var name in items) {
            if (items.hasOwnProperty(name) && items[name].state !== LOADED) {
                return false;
            }
        }

        return true;
    }

    function onPreload(asset) {
        asset.state = PRELOADED;

        each(asset.onpreload, function (afterPreload) {
            afterPreload.call();
        });
    }

    function preLoad(asset, callback) {
        if (asset.state === undefined) {

            asset.state     = PRELOADING;
            asset.onpreload = [];

            loadAsset({ url: asset.url, type: "cache" }, function () {
                onPreload(asset);
            });
        }
    }

    function apiLoadHack() {
        /// <summary>preload with text/cache hack
        ///
        /// head.load("http://domain.com/file.js","http://domain.com/file.js", callBack)
        /// head.load(["http://domain.com/file.js","http://domain.com/file.js"], callBack)
        /// head.load({ label1: "http://domain.com/file.js" }, { label2: "http://domain.com/file.js" }, callBack)
        /// head.load([{ label1: "http://domain.com/file.js" }, { label2: "http://domain.com/file.js" }], callBack)
        /// </summary>
        var args     = arguments,
            callback = args[args.length - 1],
            rest     = [].slice.call(args, 1),
            next     = rest[0];

        if (!isFunction(callback)) {
            callback = null;
        }

        // if array, repush as args
        if (isArray(args[0])) {
            args[0].push(callback);
            api.load.apply(null, args[0]);

            return api;
        }

        // multiple arguments
        if (!!next) {
            /* Preload with text/cache hack (not good!)
             * http://blog.getify.com/on-script-loaders/
             * http://www.nczonline.net/blog/2010/12/21/thoughts-on-script-loaders/
             * If caching is not configured correctly on the server, then items could load twice !
             *************************************************************************************/
            each(rest, function (item) {
                // item is not a callback or empty string
                if (!isFunction(item) && !!item) {
                    preLoad(getAsset(item));
                }
            });

            // execute
            load(getAsset(args[0]), isFunction(next) ? next : function () {
                api.load.apply(null, rest);
            });
        }
        else {
            // single item
            load(getAsset(args[0]));
        }

        return api;
    }

    function apiLoadAsync() {
        ///<summary>
        /// simply load and let browser take care of ordering
        ///
        /// head.load("http://domain.com/file.js","http://domain.com/file.js", callBack)
        /// head.load(["http://domain.com/file.js","http://domain.com/file.js"], callBack)
        /// head.load({ label1: "http://domain.com/file.js" }, { label2: "http://domain.com/file.js" }, callBack)
        /// head.load([{ label1: "http://domain.com/file.js" }, { label2: "http://domain.com/file.js" }], callBack)
        ///</summary>
        var args     = arguments,
            callback = args[args.length - 1],
            items    = {};

        if (!isFunction(callback)) {
            callback = null;
        }

        // if array, repush as args
        if (isArray(args[0])) {
            args[0].push(callback);
            api.load.apply(null, args[0]);

            return api;
        }

        // JRH 262#issuecomment-26288601
        // First populate the items array.
        // When allLoaded is called, all items will be populated.
        // Issue when lazy loaded, the callback can execute early.
        each(args, function (item, i) {
            if (item !== callback) {
                item             = getAsset(item);
                items[item.name] = item;
            }
        });

        each(args, function (item, i) {
            if (item !== callback) {
                item = getAsset(item);

                load(item, function () {
                    if (allLoaded(items)) {
                        one(callback);
                    }
                });
            }
        });

        return api;
    }

    function load(asset, callback) {
        ///<summary>Used with normal loading logic</summary>
        callback = callback || noop;

        if (asset.state === LOADED) {
            callback();
            return;
        }

        // INFO: why would we trigger a ready event when its not really loaded yet ?
        if (asset.state === LOADING) {
            api.ready(asset.name, callback);
            return;
        }

        if (asset.state === PRELOADING) {
            asset.onpreload.push(function () {
                load(asset, callback);
            });
            return;
        }

        asset.state = LOADING;

        loadAsset(asset, function () {
            asset.state = LOADED;

            callback();

            // handlers for this asset
            each(handlers[asset.name], function (fn) {
                one(fn);
            });

            // dom is ready & no assets are queued for loading
            // INFO: shouldn't we be doing the same test above ?
            if (isDomReady && allLoaded()) {
                each(handlers.ALL, function (fn) {
                    one(fn);
                });
            }
        });
    }

    function getExtension(url) {
        url = url || "";

        var items = url.split("?")[0].split(".");
        return items[items.length-1].toLowerCase();
    }

    /* Parts inspired from: https://github.com/cujojs/curl
    ******************************************************/
    function loadAsset(asset, callback) {
        callback = callback || noop;

        function error(event) {
            event = event || win.event;

            // release event listeners
            ele.onload = ele.onreadystatechange = ele.onerror = null;

            // do callback
            callback();

            // need some more detailed error handling here
        }

        function process(event) {
            event = event || win.event;

            // IE 7/8 (2 events on 1st load)
            // 1) event.type = readystatechange, s.readyState = loading
            // 2) event.type = readystatechange, s.readyState = loaded

            // IE 7/8 (1 event on reload)
            // 1) event.type = readystatechange, s.readyState = complete

            // event.type === 'readystatechange' && /loaded|complete/.test(s.readyState)

            // IE 9 (3 events on 1st load)
            // 1) event.type = readystatechange, s.readyState = loading
            // 2) event.type = readystatechange, s.readyState = loaded
            // 3) event.type = load            , s.readyState = loaded

            // IE 9 (2 events on reload)
            // 1) event.type = readystatechange, s.readyState = complete
            // 2) event.type = load            , s.readyState = complete

            // event.type === 'load'             && /loaded|complete/.test(s.readyState)
            // event.type === 'readystatechange' && /loaded|complete/.test(s.readyState)

            // IE 10 (3 events on 1st load)
            // 1) event.type = readystatechange, s.readyState = loading
            // 2) event.type = load            , s.readyState = complete
            // 3) event.type = readystatechange, s.readyState = loaded

            // IE 10 (3 events on reload)
            // 1) event.type = readystatechange, s.readyState = loaded
            // 2) event.type = load            , s.readyState = complete
            // 3) event.type = readystatechange, s.readyState = complete

            // event.type === 'load'             && /loaded|complete/.test(s.readyState)
            // event.type === 'readystatechange' && /complete/.test(s.readyState)

            // Other Browsers (1 event on 1st load)
            // 1) event.type = load, s.readyState = undefined

            // Other Browsers (1 event on reload)
            // 1) event.type = load, s.readyState = undefined

            // event.type == 'load' && s.readyState = undefined

            // !doc.documentMode is for IE6/7, IE8+ have documentMode
            if (event.type === "load" || (/loaded|complete/.test(ele.readyState) && (!doc.documentMode || doc.documentMode < 9))) {
                // remove timeouts
                win.clearTimeout(asset.errorTimeout);
                win.clearTimeout(asset.cssTimeout);

                // release event listeners
                ele.onload = ele.onreadystatechange = ele.onerror = null;

                // do callback   
                callback();
            }
        }

        function isCssLoaded() {
            // should we test again ? 20 retries = 5secs ..after that, the callback will be triggered by the error handler at 7secs
            if (asset.state !== LOADED && asset.cssRetries <= 20) {

                // loop through stylesheets
                for (var i = 0, l = doc.styleSheets.length; i < l; i++) {
                    // do we have a match ?
                    // we need to tests agains ele.href and not asset.url, because a local file will be assigned the full http path on a link element
                    if (doc.styleSheets[i].href === ele.href) {
                        process({ "type": "load" });
                        return;
                    }
                }

                // increment & try again
                asset.cssRetries++;
                asset.cssTimeout = win.setTimeout(isCssLoaded, 250);
            }
        }

        var ele;
        var ext = getExtension(asset.url);

        if (ext === "css") {
            ele      = doc.createElement("link");
            ele.type = "text/" + (asset.type || "css");
            ele.rel  = "stylesheet";
            ele.href = asset.url;

            /* onload supported for CSS on unsupported browsers
             * Safari windows 5.1.7, FF < 10
             */

            // Set counter to zero
            asset.cssRetries = 0;
            asset.cssTimeout = win.setTimeout(isCssLoaded, 500);         
        }
        else {
            ele      = doc.createElement("script");
            ele.type = "text/" + (asset.type || "javascript");
            ele.src = asset.url;
        }

        ele.onload  = ele.onreadystatechange = process;
        ele.onerror = error;

        /* Good read, but doesn't give much hope !
         * http://blog.getify.com/on-script-loaders/
         * http://www.nczonline.net/blog/2010/12/21/thoughts-on-script-loaders/
         * https://hacks.mozilla.org/2009/06/defer/
         */

        // ASYNC: load in parallel and execute as soon as possible
        ele.async = false;
        // DEFER: load in parallel but maintain execution order
        ele.defer = false;

        // timout for asset loading
        asset.errorTimeout = win.setTimeout(function () {
            error({ type: "timeout" });
        }, 7e3);

        // use insertBefore to keep IE from throwing Operation Aborted (thx Bryan Forbes!)
        var head = doc.head || doc.getElementsByTagName("head")[0];

        // but insert at end of head, because otherwise if it is a stylesheet, it will not override values      
        head.insertBefore(ele, head.lastChild);
    }

    /* Parts inspired from: https://github.com/jrburke/requirejs
    ************************************************************/
    function init() {
        var items = doc.getElementsByTagName("script");

        // look for a script with a data-head-init attribute
        for (var i = 0, l = items.length; i < l; i++) {
            var dataMain = items[i].getAttribute("data-headjs-load");
            if (!!dataMain) {
                api.load(dataMain);
                return;
            }
        }
    }

    function ready(key, callback) {
        ///<summary>
        /// INFO: use cases:
        ///    head.ready(callBack);
        ///    head.ready(document , callBack);
        ///    head.ready("file.js", callBack);
        ///    head.ready("label"  , callBack);
        ///    head.ready(["label1", "label2"], callback);
        ///</summary>

        // DOM ready check: head.ready(document, function() { });
        if (key === doc) {
            if (isDomReady) {
                one(callback);
            }
            else {
                domWaiters.push(callback);
            }

            return api;
        }

        // shift arguments
        if (isFunction(key)) {
            callback = key;
            key      = "ALL"; // holds all callbacks that where added without labels: ready(callBack)
        }

        // queue all items from key and return. The callback will be executed if all items from key are already loaded.
        if (isArray(key)) {
            var items = {};

            each(key, function (item) {
                items[item] = assets[item];

                api.ready(item, function() {
                    if (allLoaded(items)) {
                        one(callback);
                    }
                });
            });

            return api;
        }

        // make sure arguments are sane
        if (typeof key !== "string" || !isFunction(callback)) {
            return api;
        }

        // this can also be called when we trigger events based on filenames & labels
        var asset = assets[key];

        // item already loaded --> execute and return
        if (asset && asset.state === LOADED || key === "ALL" && allLoaded() && isDomReady) {
            one(callback);
            return api;
        }

        var arr = handlers[key];
        if (!arr) {
            arr = handlers[key] = [callback];
        }
        else {
            arr.push(callback);
        }

        return api;
    }

    /* Mix of stuff from jQuery & IEContentLoaded
     * http://dev.w3.org/html5/spec/the-end.html#the-end
     ***************************************************/
    function domReady() {
        // Make sure body exists, at least, in case IE gets a little overzealous (jQuery ticket #5443).
        if (!doc.body) {
            // let's not get nasty by setting a timeout too small.. (loop mania guaranteed if assets are queued)
            win.clearTimeout(api.readyTimeout);
            api.readyTimeout = win.setTimeout(domReady, 50);
            return;
        }

        if (!isDomReady) {
            isDomReady = true;

            init();
            each(domWaiters, function (fn) {
                one(fn);
            });
        }
    }

    function domContentLoaded() {
        // W3C
        if (doc.addEventListener) {
            doc.removeEventListener("DOMContentLoaded", domContentLoaded, false);
            domReady();
        }

        // IE
        else if (doc.readyState === "complete") {
            // we're here because readyState === "complete" in oldIE
            // which is good enough for us to call the dom ready!
            doc.detachEvent("onreadystatechange", domContentLoaded);
            domReady();
        }
    }

    // Catch cases where ready() is called after the browser event has already occurred.
    // we once tried to use readyState "interactive" here, but it caused issues like the one
    // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
    if (doc.readyState === "complete") {
        domReady();
    }

    // W3C
    else if (doc.addEventListener) {
        doc.addEventListener("DOMContentLoaded", domContentLoaded, false);

        // A fallback to window.onload, that will always work
        win.addEventListener("load", domReady, false);
    }

    // IE
    else {
        // Ensure firing before onload, maybe late but safe also for iframes
        doc.attachEvent("onreadystatechange", domContentLoaded);

        // A fallback to window.onload, that will always work
        win.attachEvent("onload", domReady);

        // If IE and not a frame
        // continually check to see if the document is ready
        var top = false;

        try {
            top = !win.frameElement && doc.documentElement;
        } catch (e) { }

        if (top && top.doScroll) {
            (function doScrollCheck() {
                if (!isDomReady) {
                    try {
                        // Use the trick by Diego Perini
                        // http://javascript.nwbox.com/IEContentLoaded/
                        top.doScroll("left");
                    } catch (error) {
                        // let's not get nasty by setting a timeout too small.. (loop mania guaranteed if assets are queued)
                        win.clearTimeout(api.readyTimeout);
                        api.readyTimeout = win.setTimeout(doScrollCheck, 50);
                        return;
                    }

                    // and execute any waiting functions
                    domReady();
                }
            }());
        }
    }
    //#endregion

    //#region Public Exports
    // INFO: determine which method to use for loading
    api.load  = api.js = isAsync ? apiLoadAsync : apiLoadHack;
    api.test  = conditional;
    api.ready = ready;
    //#endregion

    //#region INIT
    // perform this when DOM is ready
    api.ready(doc, function () {
        if (allLoaded()) {
            each(handlers.ALL, function (callback) {
                one(callback);
            });
        }

        if (api.feature) {
            api.feature("domloaded", true);
        }
    });
    //#endregion
}(window));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<!DOCTYPE HTML>\n<html lang=\"en\">\n\n\t<head>\n\t\t<meta charset=\"utf-8\">\n\n\t\t<title>PHP through a crystal ball</title>\n\n\t\t<meta name=\"apple-mobile-web-app-capable\" content=\"yes\" />\n\t\t<meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black-translucent\" />\n\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui\">\n\t</head>\n\n\t<body>\n\t\t<div class=\"reveal\">\n\t\t\t<div class=\"slides\">\n\t\t\t\t<section>\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<div class=\"stage\">\n\t\t\t\t\t\t\t<figure class=\"php\"></figure>\n\t\t\t\t\t\t\t<figure class=\"ball bubble\"></figure>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<h3>Adam Harvey</h3>\n\t\t\t\t\t\t<p>New Relic</p>\n\t\t\t\t\t\t<h3><a href=\"https://twitter.com/lgnome\">@LGnome</a></h3>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tHi, I'm Adam. Intro. Normally I do talks about what has already\n\t\t\t\t\t\t\tshipped in PHP, but this time around I'm going to gaze into my\n\t\t\t\t\t\t\tcrystal ball and see what is and might be coming down the pipe.\n\t\t\t\t\t\t\tWe're going to look at what's coming in increasing order of\n\t\t\t\t\t\t\tfuzziness: I'm going to start with what's already in PHP 7.2\n\t\t\t\t\t\t\t(coming in December, hopefully!), and then what's being talked\n\t\t\t\t\t\t\tabout both for 7.2 and beyond.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\t\t\t\t</section>\n\n\t\t\t\t<section>\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<h2>What's in PHP 7.2</h2>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tSo, as I said, let's start with what's already merged to PHP 7.2.\n\t\t\t\t\t\t\tThis isn't an exhaustive list of what's coming in PHP 7.2, but\n\t\t\t\t\t\t\tit's my attempt to cover the interesting things that have landed\n\t\t\t\t\t\t\tso far. Right now a lot of this is more deprecations and cleanups\n\t\t\t\t\t\t\tthan new features: the features tend to come just before feature\n\t\t\t\t\t\t\tfreeze as people panic.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<h2><code>object</code> ↔ <code>array</code></h2>\n\t\t\t\t\t\t<pre><code class=\"php\" data-trim>\n$arr = [1, 2, 3];\n$obj = (object) $arr;\nvar_dump($obj);\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<pre><code class=\"nohighlight hljs\" data-trim>\nobject(stdClass)#1 (3) {\n  [0]=&gt;\n  int(1)\n  [1]=&gt;\n  int(2)\n  [2]=&gt;\n  int(3)\n}\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tPHP has had a bug since at least PHP 4 (probably 3) where array to\n\t\t\t\t\t\t\tobject conversion is interesting. Take this example: you end up\n\t\t\t\t\t\t\twith an object that has numeric keys. How do we get to property 0?\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<h2><code>object</code> ↔ <code>array</code></h2>\n\t\t\t\t\t\t<pre><code class=\"php\" data-trim>\n$arr = [1, 2, 3];\n$obj = (object) $arr;\nvar_dump($obj->0);\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<pre><code class=\"nohighlight hljs\" data-trim>\nParse error: syntax error, unexpected '0' (T_LNUMBER),\nexpecting identifier (T_STRING) or variable (T_VARIABLE) or\n'{' or '$' in - on line 5\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tThe naive approach fails, obviously.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<h2><code>object</code> ↔ <code>array</code></h2>\n\t\t\t\t\t\t<pre><code class=\"php\" data-trim>\n$arr = [1, 2, 3];\n$obj = (object) $arr;\nvar_dump($obj->{0});\nvar_dump($obj->{'0'});\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<pre><code class=\"nohighlight hljs\" data-trim>\nNULL\nNULL\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tAt this point, the more knowledgeable PHP developer pulls out the\n\t\t\t\t\t\t\tbig guns: PHP's indirect property access syntax. Except, in PHP\n\t\t\t\t\t\t\t7.1...\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<h2><code>object</code> ↔ <code>array</code></h2>\n\t\t\t\t\t\t<pre><code class=\"php\" data-trim>\n$arr = [1, 2, 3];\n$obj = (object) $arr;\nvar_dump($obj->{0});\nvar_dump($obj->{'0'});\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<pre><code class=\"nohighlight hljs\" data-trim>\n1\n1\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tIn PHP 7.2, though: life is good. You can access it either way,\n\t\t\t\t\t\t\tand PHP is smart enough to handle either an integer or a string as\n\t\t\t\t\t\t\tthe property name.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<h2><code>object</code> ↔ <code>array</code></h2>\n\t\t\t\t\t\t<pre><code class=\"php\" data-trim>\n$obj = new stdClass;\n$obj->{'0'} = 'foo';\n$arr = (array) $obj;\nvar_dump($arr);\nvar_dump($arr[0]);\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<pre><code class=\"nohighlight hljs\" data-trim>\narray(1) {\n  [\"0\"]=>\n  string(3) \"foo\"\n}\nNULL\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tThe same was also true in reverse: object to array conversion\n\t\t\t\t\t\t\tcould result in array keys that were numeric strings, which you\n\t\t\t\t\t\t\tthen couldn't access. (This tended to happen a lot when dealing\n\t\t\t\t\t\t\twith JSON and SOAP.)\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<h2><code>object</code> ↔ <code>array</code></h2>\n\t\t\t\t\t\t<pre><code class=\"php\" data-trim>\n$obj = new stdClass;\n$obj->{'0'} = 'foo';\n$arr = (array) $obj;\nvar_dump($arr);\nvar_dump($arr[0]);\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<pre><code class=\"nohighlight hljs\" data-trim>\narray(1) {\n  [0]=>\n  string(3) \"foo\"\n}\nstring(3) \"foo\"\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tThis is also fixed in PHP 7.2: the numeric string is converted to\n\t\t\t\t\t\t\ta true number key.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<pre><code class=\"php\" data-trim>\nclass C {\n  function f() {\n    printf(\"i am %s\\n\", get_class());\n    printf(\"stdClass is %s\\n\", get_class(new stdClass));\n    printf(\"null is %s\\n\", get_class(null));\n  }\n}\n(new C)->f();\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<pre><code class=\"nohighlight hljs\" data-trim>\ni am C\nstdClass is stdClass\nnull is C\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tAnother change is to get_class(). It can be invoked in three ways.\n\t\t\t\t\t\t\tThat NULL behaviour is nasty: if you have a variable you think is\n\t\t\t\t\t\t\tan object and it's actually NULL, you get garbage if get_class()\n\t\t\t\t\t\t\tis invoked within another object method.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<pre><code class=\"php\" data-trim>\nclass C {\n  function f() {\n    printf(\"i am %s\\n\", get_class());\n    printf(\"null is %s\\n\", get_class(null));\n  }\n}\n(new C)->f();\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<pre><code class=\"nohighlight hljs\" data-trim>\ni am C\n\nWarning: get_class() expects parameter 1 to be object, null\ngiven in /tmp/test.php on line 11\nnull is \n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tIn PHP 7.2, you won't get garbage any more. The implicit behaviour\n\t\t\t\t\t\t\tstill works, but you have to not pass a parameter at all, rather\n\t\t\t\t\t\t\tthan passing NULL.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<h2>Argon2i</h2>\n\t\t\t\t\t\t<pre><code class=\"php\" data-trim>\necho password_hash($password, PASSWORD_ARGON2I);\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<pre><code class=\"nohighlight hljs\" data-trim>\n$argon2i$v=19$m=65536,t=2,p=4$c29tZXNhbHQ$RdescudvJCsgt3ub+b\n+dWRWJTmaaJObG\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tAn interesting addition is the first password hashing algorithm\n\t\t\t\t\t\t\tother than bcrypt that the password hashing API supports. Argon2\n\t\t\t\t\t\t\twon the Password Hashing Competition in 2015, and the password\n\t\t\t\t\t\t\tderivation form will be optionally supported in PHP 7.2 if\n\t\t\t\t\t\t\tlibargon2 is available. (Discuss the default discussion that\n\t\t\t\t\t\t\tultimately didn't succeed for 7.4 and the compile time\n\t\t\t\t\t\t\tdependency.)\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\t\t\t\t</section>\n\n\t\t\t\t<section>\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<h2>What's deprecated in PHP 7.2</h2>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tNow let's talk about some deprecations that will be occurring in\n\t\t\t\t\t\t\tPHP 7.2. These will <em>not</em> be removed until PHP 8 in the\n\t\t\t\t\t\t\tfuture, but we're starting to think about what's going to come\n\t\t\t\t\t\t\tout. Again, these aren't all of them, but these are the big ones\n\t\t\t\t\t\t\tif you have an older codebase.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<h2><code>create_function()</code></h2>\n\t\t\t\t\t\t<p>Use anonymous functions instead</p>\n\t\t\t\t\t\t<p>(or <code>eval()</code>, but I didn't say that)</p>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tcreate_function() is an old wart that wrapped eval() to create\n\t\t\t\t\t\t\tsomething that sort of looked like a closure if you turned your\n\t\t\t\t\t\t\thead and squinted really hard. It was obsolete the moment PHP 5.3\n\t\t\t\t\t\t\tlanded, and is usually a sign that something's gone wrong.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<h2><code>assert()</code></h2>\n\t\t\t\t\t\t<pre><code class=\"php\" data-trim>\n// PHP 3-5\nassert(\"\\$foo == \\$bar\");\n\n// PHP 7\nassert($foo == $bar);\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tDon't panic: we're not getting rid of assert(). In PHP 5, it was\n\t\t\t\t\t\t\teffectively a wrapper for eval(). In PHP 7, you can just provide\n\t\t\t\t\t\t\tcode to assert(), and the eval() form that takes a string is going\n\t\t\t\t\t\t\tto be deprecated.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<h2><code>__autoload()</code></h2>\n\t\t\t\t\t\t<p>Use <code>spl_autoload_register()</code></p>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tThe first one is the original, PHP 5.0 era __autoload() function.\n\t\t\t\t\t\t\tSince it's a singleton, libraries couldn't add their own\n\t\t\t\t\t\t\t__autoload() implementations, and that sucked. In PHP 5.1 we added\n\t\t\t\t\t\t\tspl_autoload_register(), and almost everyone uses it (that's what\n\t\t\t\t\t\t\tyou use with Composer), but we need to get rid of the wart, since\n\t\t\t\t\t\t\tthey don't play nicely together.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<h2><code>each()</code></h2>\n\t\t\t\t\t\t<pre><code class=\"php\" data-trim>\n// PHP 3\nfor (reset($arr); list($key, $val) = each($arr); ) {\n  // ...\n}\n\n// PHP 4 onwards\nforeach ($arr as $key => $val) {\n  // ...\n}\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tHere's a good one: in PHP 3, there were functions called reset(),\n\t\t\t\t\t\t\teach(), and the like that you used to traverse an array. In PHP 4,\n\t\t\t\t\t\t\tthe foreach loop was added, and everyone forgot about those\n\t\t\t\t\t\t\tfunctions. Well, we're going to kill each(): it's getting in the\n\t\t\t\t\t\t\tway of language features, and it's inferior in every possible way\n\t\t\t\t\t\t\tto foreach.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\t\t\t\t</section>\n\n\t\t\t\t<section>\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<h2>What's approved, but not (yet) in PHP 7.2</h2>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tOK, that's all well and good, Adam, but you want to see more\n\t\t\t\t\t\t\tinteresting stuff than this, right? Here are some of the language\n\t\t\t\t\t\t\tchanges that have been approved, but haven't yet landed in Git.\n\t\t\t\t\t\t\tMost of these will likely be in PHP 7.2, but until the code\n\t\t\t\t\t\t\tactually lands, there are no guarantees.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<img src=\"" + __webpack_require__(13) + "\" alt=\"libsodium\">\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tlibsodium is a fork of NaCl (salt), which is a modern cryptography\n\t\t\t\t\t\t\tlibrary. Right now in PHP, your choices for encrypting data are\n\t\t\t\t\t\t\tmcrypt (abandoned for about a decade, deprecated) or OpenSSL\n\t\t\t\t\t\t\t(which has the worst API of probably any extension in PHP, mostly\n\t\t\t\t\t\t\tbecause the C library has an awful API). libsodium provides modern\n\t\t\t\t\t\t\tcryptography with an API that is easier to use, but more\n\t\t\t\t\t\t\timportantly, harder to misuse. It'll land in PHP 7.2 just as soon\n\t\t\t\t\t\t\tas we figure out what's happening with the namespacing of the API.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<h2><code>??=</code></h2>\n\t\t\t\t\t\t<pre><code class=\"php\" data-trim>\n$foo = $foo ? $foo : 'default value';\n$foo = $foo ?? 'default value';\n$foo ??= 'default_value';\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tThis is my favourite kind of syntactic sugar: something that\n\t\t\t\t\t\t\tshould have just been part of a feature to begin with. The\n\t\t\t\t\t\t\t(awesome) null coalesce operator is getting a shorthand version.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<pre><code class=\"php\" data-trim>\n$a = 42;\nvar_dump($a[0][1][2]);\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<pre><code class=\"nohighlight hljs\" data-trim>\nNULL\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tHere's another safety one. If you try to deference a variable that\n\t\t\t\t\t\t\tdoesn't support array dereferencing, right now you get NULL.\n\t\t\t\t\t\t\tSilently.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<pre><code class=\"php\" data-trim>\n$a = 42;\nvar_dump($a[0][1][2]);\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<pre><code class=\"nohighlight hljs\" data-trim>\nWarning: Variable of type integer does not accept array\noffsets\nNULL\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tOnce this lands, you will get a warning when this occurs. One nice\n\t\t\t\t\t\t\tthing is that you only get one warning, no matter how many\n\t\t\t\t\t\t\tdereferences there are. This is a lot like the invalid array to\n\t\t\t\t\t\t\tstring conversion warning that landed in PHP 7.1: it's a small\n\t\t\t\t\t\t\twin, but it just makes it easier to write PHP.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<pre><code class=\"php\" data-trim>\nclass Parent {\n  function doStuff(SomeObject $a) { /* ... */ }\n}\n\nclass Child extends Parent {\n  function doStuff($a) { /* ... */ }\n}\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tHere's another change: in PHP 7.1, you can't remove a type\n\t\t\t\t\t\t\tdeclaration in a subclass. This makes it hard for library authors\n\t\t\t\t\t\t\tto implement type declarations (now we have scalars, in\n\t\t\t\t\t\t\tparticular), because code that inherits from the library classes\n\t\t\t\t\t\t\thas to be upgraded all at once. In a future version, this will\n\t\t\t\t\t\t\twork: it's valid in terms of contravariance, so there's no break\n\t\t\t\t\t\t\tto PHP's object or type model.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\t\t\t\t</section>\n\n\t\t\t\t<section>\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<h2>Topics of discussion</h2>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tOK, so that's all stuff that I'm pretty sure you'll be getting in\n\t\t\t\t\t\t\tPHP 7.2. (Or, at worst, PHP 7.3.) Here's some stuff I don't think\n\t\t\t\t\t\t\tyou'll be getting in PHP 7.2, but which is under serious\n\t\t\t\t\t\t\tdiscussion right now. None of this will probably happen in the\n\t\t\t\t\t\t\texact form I'm going to show you, but just to give a taste of\n\t\t\t\t\t\t\twhat's being talked about on Internals...\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<h2>Arrow functions</h2>\n\t\t\t\t\t\t<pre><code class=\"php\" data-trim>\n// Old\nfunction array_values_from_keys(array $arr, array $keys): array {\n  return array_map(function ($key) use ($arr) {\n    return $arr[$key];\n  }, $keys);\n}\n\n// New?\nfunction array_values_from_keys(array $arr, array $keys): array {\n  return array_map(fn($key) => $arr[$key], $keys);\n}\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tIf I was going to bet on a bolter making it into PHP 7.2, it's\n\t\t\t\t\t\t\tprobably this one. A lot of languages have some concept of a\n\t\t\t\t\t\t\tshorthand closure: ECMAScript has arrow functions that look a lot\n\t\t\t\t\t\t\tlike this, Python has lambdas, Ruby has lambda literals. The idea\n\t\t\t\t\t\t\there is for a single statement closure that implicitly captures\n\t\t\t\t\t\t\tvariables. The main impediments right now are syntax (fn? |$key|?\n\t\t\t\t\t\t\thit next) and the implicit capture.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<h2>Arrow functions</h2>\n\t\t\t\t\t\t<pre><code class=\"php\" data-trim>\n// Old\nfunction array_values_from_keys(array $arr, array $keys): array {\n  return array_map(function ($key) use ($arr) {\n    return $arr[$key];\n  }, $keys);\n}\n\n// New?\nfunction array_values_from_keys(array $arr, array $keys): array {\n  return array_map(|$key| => $arr[$key], $keys);\n}\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tIf I was going to bet on a bolter making it into PHP 7.2, it's\n\t\t\t\t\t\t\tprobably this one. A lot of languages have some concept of a\n\t\t\t\t\t\t\tshorthand closure: ECMAScript has arrow functions that look a lot\n\t\t\t\t\t\t\tlike this, Python has lambdas, Ruby has lambda literals. The idea\n\t\t\t\t\t\t\there is for a single statement closure that implicitly captures\n\t\t\t\t\t\t\tvariables. The main impediments right now are syntax (fn? |$key|?\n\t\t\t\t\t\t\thit next) and the implicit capture.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<h2>Pipe operator</h2>\n\t\t\t\t\t\t<pre><code class=\"php\" data-trim>\n$r = array_merge(\n       $ret,\n       getFileArg(\n         array_map(\n           function ($x) use ($arg) { return $arg . '/' . $x; },\n           array_filter(\n             scandir($arg),\n             function ($x) { return $x !== '.' && $x !== '..'); }\n           )\n         )\n       )\n     );\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tAnother thing on the table is a pipe operator, where the return\n\t\t\t\t\t\t\tvalue of one function can be chained into another function without\n\t\t\t\t\t\t\tnecessarily using a fluent interface. To read this, you have to\n\t\t\t\t\t\t\tstart at the most nested function (scandir()) and work out: it\n\t\t\t\t\t\t\tgets filtered, then mapped, then this getFileArg() function is\n\t\t\t\t\t\t\tcalled, and finally it's all merged.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<h2>Pipe operator</h2>\n\t\t\t\t\t\t<pre><code class=\"php\" data-trim>\n$r = scandir($arg)\n       |> array_filter($$, function($x) { return $x !== '.'\n                                              && $x != '..'; })\n       |> array_map(function ($x) use ($arg) { return \"$arg/$x\"; },\n                    $$)\n       |> getFileArg($$)\n       |> array_merge($ret, $$);\n\t\t\t\t\t\t</code></pre>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tThe idea here is that you can chain calls together: instead, the\n\t\t\t\t\t\t\tfirst thing you see is the first call, and then the return value\n\t\t\t\t\t\t\tof that function is piped into the next call using $$. I\n\t\t\t\t\t\t\tpersonally have deeply mixed feelings on this one: this example\n\t\t\t\t\t\t\tshows it off well, but it's also possible to really hide how\n\t\t\t\t\t\t\tvariables are getting passed around from function to function.\n\t\t\t\t\t\t\tIt's an interesting idea, though, and apparently Facebook found it\n\t\t\t\t\t\t\tuseful in Hack.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<img src=\"" + __webpack_require__(15) + "\">\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tFor those of you who've seen the news today, a research team at\n\t\t\t\t\t\t\tGoogle announced a collision in SHA-1. Most browsers either have\n\t\t\t\t\t\t\tor are in the process of deprecating SSL certificates that use\n\t\t\t\t\t\t\tSHA-1, and it's likely that PHP will follow suit in the not too\n\t\t\t\t\t\t\tdistant future.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\t\t\t\t</section>\n\n\t\t\t\t<section>\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<h2>Blatant, wild guesswork</h2>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tFinally, the far distant future.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<p>Generics?</p>\n\t\t\t\t\t\t<p>Object properties?</p>\n\t\t\t\t\t\t<p>Annotations?</p>\n\t\t\t\t\t\t<p>Enums?</p>\n\t\t\t\t\t\t<p><code>async</code>/<code>await</code></p>\n\t\t\t\t\t\t<p>JIT?</p>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tThese are all features that have undergone some level of\n\t\t\t\t\t\t\tdevelopment, but are some distance from being voteable RFCs. I\n\t\t\t\t\t\t\tdon't expect to see any of these in PHP 7.2 or 7.3, but some of\n\t\t\t\t\t\t\tthese are quite likely for 8.0. Some will probably never happen.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\n\t\t\t\t\t<section>\n\t\t\t\t\t\t<p>Your idea here?</p>\n\t\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t\t\tIf you like language design, C, and arguing with people, you too\n\t\t\t\t\t\t\tcan get involved. Language features for PHP can start with nothing\n\t\t\t\t\t\t\tmore than a wiki page, an e-mail to internals, and maybe a PR. I\n\t\t\t\t\t\t\twon't pretend it's an easy crowd, but we are open to features,\n\t\t\t\t\t\t\tespecially when they don't break BC and come with some sort of\n\t\t\t\t\t\t\tproof of concept.\n\t\t\t\t\t\t</aside>\n\t\t\t\t\t</section>\n\t\t\t\t</section>\n\n\t\t\t\t<section>\n\t\t\t\t\t<h1>Thank you</h1>\n\t\t\t\t\t<h2>Questions?</h2>\n\t\t\t\t\t<h3><a href=\"https://twitter.com/lgnome\">@LGnome</a></h3>\n\t\t\t\t\t<aside class=\"notes\">\n\t\t\t\t\t</aside>\n\t\t\t\t</section>\n\t\t\t</div>\n\t\t</div>\n\t</body>\n</html>\n<!-- vim: set nocin ai noet ts=2 sw=2: -->\n";

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * reveal.js
 * http://lab.hakim.se/reveal-js
 * MIT licensed
 *
 * Copyright (C) 2016 Hakim El Hattab, http://hakim.se
 */
(function( root, factory ) {
	if( true ) {
		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
			root.Reveal = factory();
			return root.Reveal;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if( typeof exports === 'object' ) {
		// Node. Does not work with strict CommonJS.
		module.exports = factory();
	} else {
		// Browser globals.
		root.Reveal = factory();
	}
}( this, function() {

	'use strict';

	var Reveal;

	// The reveal.js version
	var VERSION = '3.4.1';

	var SLIDES_SELECTOR = '.slides section',
		HORIZONTAL_SLIDES_SELECTOR = '.slides>section',
		VERTICAL_SLIDES_SELECTOR = '.slides>section.present>section',
		HOME_SLIDE_SELECTOR = '.slides>section:first-of-type',
		UA = navigator.userAgent,

		// Configuration defaults, can be overridden at initialization time
		config = {

			// The "normal" size of the presentation, aspect ratio will be preserved
			// when the presentation is scaled to fit different resolutions
			width: 960,
			height: 700,

			// Factor of the display size that should remain empty around the content
			margin: 0.04,

			// Bounds for smallest/largest possible scale to apply to content
			minScale: 0.2,
			maxScale: 2.0,

			// Display controls in the bottom right corner
			controls: true,

			// Display a presentation progress bar
			progress: true,

			// Display the page number of the current slide
			slideNumber: false,

			// Push each slide change to the browser history
			history: false,

			// Enable keyboard shortcuts for navigation
			keyboard: true,

			// Optional function that blocks keyboard events when retuning false
			keyboardCondition: null,

			// Enable the slide overview mode
			overview: true,

			// Vertical centering of slides
			center: true,

			// Enables touch navigation on devices with touch input
			touch: true,

			// Loop the presentation
			loop: false,

			// Change the presentation direction to be RTL
			rtl: false,

			// Randomizes the order of slides each time the presentation loads
			shuffle: false,

			// Turns fragments on and off globally
			fragments: true,

			// Flags if the presentation is running in an embedded mode,
			// i.e. contained within a limited portion of the screen
			embedded: false,

			// Flags if we should show a help overlay when the question-mark
			// key is pressed
			help: true,

			// Flags if it should be possible to pause the presentation (blackout)
			pause: true,

			// Flags if speaker notes should be visible to all viewers
			showNotes: false,

			// Number of milliseconds between automatically proceeding to the
			// next slide, disabled when set to 0, this value can be overwritten
			// by using a data-autoslide attribute on your slides
			autoSlide: 0,

			// Stop auto-sliding after user input
			autoSlideStoppable: true,

			// Use this method for navigation when auto-sliding (defaults to navigateNext)
			autoSlideMethod: null,

			// Enable slide navigation via mouse wheel
			mouseWheel: false,

			// Apply a 3D roll to links on hover
			rollingLinks: false,

			// Hides the address bar on mobile devices
			hideAddressBar: true,

			// Opens links in an iframe preview overlay
			previewLinks: false,

			// Exposes the reveal.js API through window.postMessage
			postMessage: true,

			// Dispatches all reveal.js events to the parent window through postMessage
			postMessageEvents: false,

			// Focuses body when page changes visibility to ensure keyboard shortcuts work
			focusBodyOnPageVisibilityChange: true,

			// Transition style
			transition: 'slide', // none/fade/slide/convex/concave/zoom

			// Transition speed
			transitionSpeed: 'default', // default/fast/slow

			// Transition style for full page slide backgrounds
			backgroundTransition: 'fade', // none/fade/slide/convex/concave/zoom

			// Parallax background image
			parallaxBackgroundImage: '', // CSS syntax, e.g. "a.jpg"

			// Parallax background size
			parallaxBackgroundSize: '', // CSS syntax, e.g. "3000px 2000px"

			// Amount of pixels to move the parallax background per slide step
			parallaxBackgroundHorizontal: null,
			parallaxBackgroundVertical: null,

			// The maximum number of pages a single slide can expand onto when printing
			// to PDF, unlimited by default
			pdfMaxPagesPerSlide: Number.POSITIVE_INFINITY,

			// Number of slides away from the current that are visible
			viewDistance: 3,

			// Script dependencies to load
			dependencies: []

		},

		// Flags if Reveal.initialize() has been called
		initialized = false,

		// Flags if reveal.js is loaded (has dispatched the 'ready' event)
		loaded = false,

		// Flags if the overview mode is currently active
		overview = false,

		// Holds the dimensions of our overview slides, including margins
		overviewSlideWidth = null,
		overviewSlideHeight = null,

		// The horizontal and vertical index of the currently active slide
		indexh,
		indexv,

		// The previous and current slide HTML elements
		previousSlide,
		currentSlide,

		previousBackground,

		// Slides may hold a data-state attribute which we pick up and apply
		// as a class to the body. This list contains the combined state of
		// all current slides.
		state = [],

		// The current scale of the presentation (see width/height config)
		scale = 1,

		// CSS transform that is currently applied to the slides container,
		// split into two groups
		slidesTransform = { layout: '', overview: '' },

		// Cached references to DOM elements
		dom = {},

		// Features supported by the browser, see #checkCapabilities()
		features = {},

		// Client is a mobile device, see #checkCapabilities()
		isMobileDevice,

		// Client is a desktop Chrome, see #checkCapabilities()
		isChrome,

		// Throttles mouse wheel navigation
		lastMouseWheelStep = 0,

		// Delays updates to the URL due to a Chrome thumbnailer bug
		writeURLTimeout = 0,

		// Flags if the interaction event listeners are bound
		eventsAreBound = false,

		// The current auto-slide duration
		autoSlide = 0,

		// Auto slide properties
		autoSlidePlayer,
		autoSlideTimeout = 0,
		autoSlideStartTime = -1,
		autoSlidePaused = false,

		// Holds information about the currently ongoing touch input
		touch = {
			startX: 0,
			startY: 0,
			startSpan: 0,
			startCount: 0,
			captured: false,
			threshold: 40
		},

		// Holds information about the keyboard shortcuts
		keyboardShortcuts = {
			'N  ,  SPACE':			'Next slide',
			'P':					'Previous slide',
			'&#8592;  ,  H':		'Navigate left',
			'&#8594;  ,  L':		'Navigate right',
			'&#8593;  ,  K':		'Navigate up',
			'&#8595;  ,  J':		'Navigate down',
			'Home':					'First slide',
			'End':					'Last slide',
			'B  ,  .':				'Pause',
			'F':					'Fullscreen',
			'ESC, O':				'Slide overview'
		};

	/**
	 * Starts up the presentation if the client is capable.
	 */
	function initialize( options ) {

		// Make sure we only initialize once
		if( initialized === true ) return;

		initialized = true;

		checkCapabilities();

		if( !features.transforms2d && !features.transforms3d ) {
			document.body.setAttribute( 'class', 'no-transforms' );

			// Since JS won't be running any further, we load all lazy
			// loading elements upfront
			var images = toArray( document.getElementsByTagName( 'img' ) ),
				iframes = toArray( document.getElementsByTagName( 'iframe' ) );

			var lazyLoadable = images.concat( iframes );

			for( var i = 0, len = lazyLoadable.length; i < len; i++ ) {
				var element = lazyLoadable[i];
				if( element.getAttribute( 'data-src' ) ) {
					element.setAttribute( 'src', element.getAttribute( 'data-src' ) );
					element.removeAttribute( 'data-src' );
				}
			}

			// If the browser doesn't support core features we won't be
			// using JavaScript to control the presentation
			return;
		}

		// Cache references to key DOM elements
		dom.wrapper = document.querySelector( '.reveal' );
		dom.slides = document.querySelector( '.reveal .slides' );

		// Force a layout when the whole page, incl fonts, has loaded
		window.addEventListener( 'load', layout, false );

		var query = Reveal.getQueryHash();

		// Do not accept new dependencies via query config to avoid
		// the potential of malicious script injection
		if( typeof query['dependencies'] !== 'undefined' ) delete query['dependencies'];

		// Copy options over to our config object
		extend( config, options );
		extend( config, query );

		// Hide the address bar in mobile browsers
		hideAddressBar();

		// Loads the dependencies and continues to #start() once done
		load();

	}

	/**
	 * Inspect the client to see what it's capable of, this
	 * should only happens once per runtime.
	 */
	function checkCapabilities() {

		isMobileDevice = /(iphone|ipod|ipad|android)/gi.test( UA );
		isChrome = /chrome/i.test( UA ) && !/edge/i.test( UA );

		var testElement = document.createElement( 'div' );

		features.transforms3d = 'WebkitPerspective' in testElement.style ||
								'MozPerspective' in testElement.style ||
								'msPerspective' in testElement.style ||
								'OPerspective' in testElement.style ||
								'perspective' in testElement.style;

		features.transforms2d = 'WebkitTransform' in testElement.style ||
								'MozTransform' in testElement.style ||
								'msTransform' in testElement.style ||
								'OTransform' in testElement.style ||
								'transform' in testElement.style;

		features.requestAnimationFrameMethod = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
		features.requestAnimationFrame = typeof features.requestAnimationFrameMethod === 'function';

		features.canvas = !!document.createElement( 'canvas' ).getContext;

		// Transitions in the overview are disabled in desktop and
		// Safari due to lag
		features.overviewTransitions = !/Version\/[\d\.]+.*Safari/.test( UA );

		// Flags if we should use zoom instead of transform to scale
		// up slides. Zoom produces crisper results but has a lot of
		// xbrowser quirks so we only use it in whitelsited browsers.
		features.zoom = 'zoom' in testElement.style && !isMobileDevice &&
						( isChrome || /Version\/[\d\.]+.*Safari/.test( UA ) );

	}

    /**
     * Loads the dependencies of reveal.js. Dependencies are
     * defined via the configuration option 'dependencies'
     * and will be loaded prior to starting/binding reveal.js.
     * Some dependencies may have an 'async' flag, if so they
     * will load after reveal.js has been started up.
     */
	function load() {

		var scripts = [],
			scriptsAsync = [],
			scriptsToPreload = 0;

		// Called once synchronous scripts finish loading
		function proceed() {
			if( scriptsAsync.length ) {
				// Load asynchronous scripts
				head.js.apply( null, scriptsAsync );
			}

			start();
		}

		function loadScript( s ) {
			head.ready( s.src.match( /([\w\d_\-]*)\.?js$|[^\\\/]*$/i )[0], function() {
				// Extension may contain callback functions
				if( typeof s.callback === 'function' ) {
					s.callback.apply( this );
				}

				if( --scriptsToPreload === 0 ) {
					proceed();
				}
			});
		}

		for( var i = 0, len = config.dependencies.length; i < len; i++ ) {
			var s = config.dependencies[i];

			// Load if there's no condition or the condition is truthy
			if( !s.condition || s.condition() ) {
				if( s.async ) {
					scriptsAsync.push( s.src );
				}
				else {
					scripts.push( s.src );
				}

				loadScript( s );
			}
		}

		if( scripts.length ) {
			scriptsToPreload = scripts.length;

			// Load synchronous scripts
			head.js.apply( null, scripts );
		}
		else {
			proceed();
		}

	}

	/**
	 * Starts up reveal.js by binding input events and navigating
	 * to the current URL deeplink if there is one.
	 */
	function start() {

		// Make sure we've got all the DOM elements we need
		setupDOM();

		// Listen to messages posted to this window
		setupPostMessage();

		// Prevent the slides from being scrolled out of view
		setupScrollPrevention();

		// Resets all vertical slides so that only the first is visible
		resetVerticalSlides();

		// Updates the presentation to match the current configuration values
		configure();

		// Read the initial hash
		readURL();

		// Update all backgrounds
		updateBackground( true );

		// Notify listeners that the presentation is ready but use a 1ms
		// timeout to ensure it's not fired synchronously after #initialize()
		setTimeout( function() {
			// Enable transitions now that we're loaded
			dom.slides.classList.remove( 'no-transition' );

			loaded = true;

			dom.wrapper.classList.add( 'ready' );

			dispatchEvent( 'ready', {
				'indexh': indexh,
				'indexv': indexv,
				'currentSlide': currentSlide
			} );
		}, 1 );

		// Special setup and config is required when printing to PDF
		if( isPrintingPDF() ) {
			removeEventListeners();

			// The document needs to have loaded for the PDF layout
			// measurements to be accurate
			if( document.readyState === 'complete' ) {
				setupPDF();
			}
			else {
				window.addEventListener( 'load', setupPDF );
			}
		}

	}

	/**
	 * Finds and stores references to DOM elements which are
	 * required by the presentation. If a required element is
	 * not found, it is created.
	 */
	function setupDOM() {

		// Prevent transitions while we're loading
		dom.slides.classList.add( 'no-transition' );

		// Background element
		dom.background = createSingletonNode( dom.wrapper, 'div', 'backgrounds', null );

		// Progress bar
		dom.progress = createSingletonNode( dom.wrapper, 'div', 'progress', '<span></span>' );
		dom.progressbar = dom.progress.querySelector( 'span' );

		// Arrow controls
		createSingletonNode( dom.wrapper, 'aside', 'controls',
			'<button class="navigate-left" aria-label="previous slide"></button>' +
			'<button class="navigate-right" aria-label="next slide"></button>' +
			'<button class="navigate-up" aria-label="above slide"></button>' +
			'<button class="navigate-down" aria-label="below slide"></button>' );

		// Slide number
		dom.slideNumber = createSingletonNode( dom.wrapper, 'div', 'slide-number', '' );

		// Element containing notes that are visible to the audience
		dom.speakerNotes = createSingletonNode( dom.wrapper, 'div', 'speaker-notes', null );
		dom.speakerNotes.setAttribute( 'data-prevent-swipe', '' );
		dom.speakerNotes.setAttribute( 'tabindex', '0' );

		// Overlay graphic which is displayed during the paused mode
		createSingletonNode( dom.wrapper, 'div', 'pause-overlay', null );

		// Cache references to elements
		dom.controls = document.querySelector( '.reveal .controls' );

		dom.wrapper.setAttribute( 'role', 'application' );

		// There can be multiple instances of controls throughout the page
		dom.controlsLeft = toArray( document.querySelectorAll( '.navigate-left' ) );
		dom.controlsRight = toArray( document.querySelectorAll( '.navigate-right' ) );
		dom.controlsUp = toArray( document.querySelectorAll( '.navigate-up' ) );
		dom.controlsDown = toArray( document.querySelectorAll( '.navigate-down' ) );
		dom.controlsPrev = toArray( document.querySelectorAll( '.navigate-prev' ) );
		dom.controlsNext = toArray( document.querySelectorAll( '.navigate-next' ) );

		dom.statusDiv = createStatusDiv();
	}

	/**
	 * Creates a hidden div with role aria-live to announce the
	 * current slide content. Hide the div off-screen to make it
	 * available only to Assistive Technologies.
	 *
	 * @return {HTMLElement}
	 */
	function createStatusDiv() {

		var statusDiv = document.getElementById( 'aria-status-div' );
		if( !statusDiv ) {
			statusDiv = document.createElement( 'div' );
			statusDiv.style.position = 'absolute';
			statusDiv.style.height = '1px';
			statusDiv.style.width = '1px';
			statusDiv.style.overflow = 'hidden';
			statusDiv.style.clip = 'rect( 1px, 1px, 1px, 1px )';
			statusDiv.setAttribute( 'id', 'aria-status-div' );
			statusDiv.setAttribute( 'aria-live', 'polite' );
			statusDiv.setAttribute( 'aria-atomic','true' );
			dom.wrapper.appendChild( statusDiv );
		}
		return statusDiv;

	}

	/**
	 * Converts the given HTML element into a string of text
	 * that can be announced to a screen reader. Hidden
	 * elements are excluded.
	 */
	function getStatusText( node ) {

		var text = '';

		// Text node
		if( node.nodeType === 3 ) {
			text += node.textContent;
		}
		// Element node
		else if( node.nodeType === 1 ) {

			var isAriaHidden = node.getAttribute( 'aria-hidden' );
			var isDisplayHidden = window.getComputedStyle( node )['display'] === 'none';
			if( isAriaHidden !== 'true' && !isDisplayHidden ) {

				toArray( node.childNodes ).forEach( function( child ) {
					text += getStatusText( child );
				} );

			}

		}

		return text;

	}

	/**
	 * Configures the presentation for printing to a static
	 * PDF.
	 */
	function setupPDF() {

		var slideSize = getComputedSlideSize( window.innerWidth, window.innerHeight );

		// Dimensions of the PDF pages
		var pageWidth = Math.floor( slideSize.width * ( 1 + config.margin ) ),
			pageHeight = Math.floor( slideSize.height * ( 1 + config.margin ) );

		// Dimensions of slides within the pages
		var slideWidth = slideSize.width,
			slideHeight = slideSize.height;

		// Let the browser know what page size we want to print
		injectStyleSheet( '@page{size:'+ pageWidth +'px '+ pageHeight +'px; margin: 0 0 -1px 0;}' );

		// Limit the size of certain elements to the dimensions of the slide
		injectStyleSheet( '.reveal section>img, .reveal section>video, .reveal section>iframe{max-width: '+ slideWidth +'px; max-height:'+ slideHeight +'px}' );

		document.body.classList.add( 'print-pdf' );
		document.body.style.width = pageWidth + 'px';
		document.body.style.height = pageHeight + 'px';

		// Add each slide's index as attributes on itself, we need these
		// indices to generate slide numbers below
		toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) ).forEach( function( hslide, h ) {
			hslide.setAttribute( 'data-index-h', h );

			if( hslide.classList.contains( 'stack' ) ) {
				toArray( hslide.querySelectorAll( 'section' ) ).forEach( function( vslide, v ) {
					vslide.setAttribute( 'data-index-h', h );
					vslide.setAttribute( 'data-index-v', v );
				} );
			}
		} );

		// Slide and slide background layout
		toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR ) ).forEach( function( slide ) {

			// Vertical stacks are not centred since their section
			// children will be
			if( slide.classList.contains( 'stack' ) === false ) {
				// Center the slide inside of the page, giving the slide some margin
				var left = ( pageWidth - slideWidth ) / 2,
					top = ( pageHeight - slideHeight ) / 2;

				var contentHeight = slide.scrollHeight;
				var numberOfPages = Math.max( Math.ceil( contentHeight / pageHeight ), 1 );

				// Adhere to configured pages per slide limit
				numberOfPages = Math.min( numberOfPages, config.pdfMaxPagesPerSlide );

				// Center slides vertically
				if( numberOfPages === 1 && config.center || slide.classList.contains( 'center' ) ) {
					top = Math.max( ( pageHeight - contentHeight ) / 2, 0 );
				}

				// Wrap the slide in a page element and hide its overflow
				// so that no page ever flows onto another
				var page = document.createElement( 'div' );
				page.className = 'pdf-page';
				page.style.height = ( pageHeight * numberOfPages ) + 'px';
				slide.parentNode.insertBefore( page, slide );
				page.appendChild( slide );

				// Position the slide inside of the page
				slide.style.left = left + 'px';
				slide.style.top = top + 'px';
				slide.style.width = slideWidth + 'px';

				if( slide.slideBackgroundElement ) {
					page.insertBefore( slide.slideBackgroundElement, slide );
				}

				// Inject notes if `showNotes` is enabled
				if( config.showNotes ) {

					// Are there notes for this slide?
					var notes = getSlideNotes( slide );
					if( notes ) {

						var notesSpacing = 8;
						var notesLayout = typeof config.showNotes === 'string' ? config.showNotes : 'inline';
						var notesElement = document.createElement( 'div' );
						notesElement.classList.add( 'speaker-notes' );
						notesElement.classList.add( 'speaker-notes-pdf' );
						notesElement.setAttribute( 'data-layout', notesLayout );
						notesElement.innerHTML = notes;

						if( notesLayout === 'separate-page' ) {
							page.parentNode.insertBefore( notesElement, page.nextSibling );
						}
						else {
							notesElement.style.left = notesSpacing + 'px';
							notesElement.style.bottom = notesSpacing + 'px';
							notesElement.style.width = ( pageWidth - notesSpacing*2 ) + 'px';
							page.appendChild( notesElement );
						}

					}

				}

				// Inject slide numbers if `slideNumbers` are enabled
				if( config.slideNumber ) {
					var slideNumberH = parseInt( slide.getAttribute( 'data-index-h' ), 10 ) + 1,
						slideNumberV = parseInt( slide.getAttribute( 'data-index-v' ), 10 ) + 1;

					var numberElement = document.createElement( 'div' );
					numberElement.classList.add( 'slide-number' );
					numberElement.classList.add( 'slide-number-pdf' );
					numberElement.innerHTML = formatSlideNumber( slideNumberH, '.', slideNumberV );
					page.appendChild( numberElement );
				}
			}

		} );

		// Show all fragments
		toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR + ' .fragment' ) ).forEach( function( fragment ) {
			fragment.classList.add( 'visible' );
		} );

		// Notify subscribers that the PDF layout is good to go
		dispatchEvent( 'pdf-ready' );

	}

	/**
	 * This is an unfortunate necessity. Some actions – such as
	 * an input field being focused in an iframe or using the
	 * keyboard to expand text selection beyond the bounds of
	 * a slide – can trigger our content to be pushed out of view.
	 * This scrolling can not be prevented by hiding overflow in
	 * CSS (we already do) so we have to resort to repeatedly
	 * checking if the slides have been offset :(
	 */
	function setupScrollPrevention() {

		setInterval( function() {
			if( dom.wrapper.scrollTop !== 0 || dom.wrapper.scrollLeft !== 0 ) {
				dom.wrapper.scrollTop = 0;
				dom.wrapper.scrollLeft = 0;
			}
		}, 1000 );

	}

	/**
	 * Creates an HTML element and returns a reference to it.
	 * If the element already exists the existing instance will
	 * be returned.
	 *
	 * @param {HTMLElement} container
	 * @param {string} tagname
	 * @param {string} classname
	 * @param {string} innerHTML
	 *
	 * @return {HTMLElement}
	 */
	function createSingletonNode( container, tagname, classname, innerHTML ) {

		// Find all nodes matching the description
		var nodes = container.querySelectorAll( '.' + classname );

		// Check all matches to find one which is a direct child of
		// the specified container
		for( var i = 0; i < nodes.length; i++ ) {
			var testNode = nodes[i];
			if( testNode.parentNode === container ) {
				return testNode;
			}
		}

		// If no node was found, create it now
		var node = document.createElement( tagname );
		node.classList.add( classname );
		if( typeof innerHTML === 'string' ) {
			node.innerHTML = innerHTML;
		}
		container.appendChild( node );

		return node;

	}

	/**
	 * Creates the slide background elements and appends them
	 * to the background container. One element is created per
	 * slide no matter if the given slide has visible background.
	 */
	function createBackgrounds() {

		var printMode = isPrintingPDF();

		// Clear prior backgrounds
		dom.background.innerHTML = '';
		dom.background.classList.add( 'no-transition' );

		// Iterate over all horizontal slides
		toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) ).forEach( function( slideh ) {

			var backgroundStack = createBackground( slideh, dom.background );

			// Iterate over all vertical slides
			toArray( slideh.querySelectorAll( 'section' ) ).forEach( function( slidev ) {

				createBackground( slidev, backgroundStack );

				backgroundStack.classList.add( 'stack' );

			} );

		} );

		// Add parallax background if specified
		if( config.parallaxBackgroundImage ) {

			dom.background.style.backgroundImage = 'url("' + config.parallaxBackgroundImage + '")';
			dom.background.style.backgroundSize = config.parallaxBackgroundSize;

			// Make sure the below properties are set on the element - these properties are
			// needed for proper transitions to be set on the element via CSS. To remove
			// annoying background slide-in effect when the presentation starts, apply
			// these properties after short time delay
			setTimeout( function() {
				dom.wrapper.classList.add( 'has-parallax-background' );
			}, 1 );

		}
		else {

			dom.background.style.backgroundImage = '';
			dom.wrapper.classList.remove( 'has-parallax-background' );

		}

	}

	/**
	 * Creates a background for the given slide.
	 *
	 * @param {HTMLElement} slide
	 * @param {HTMLElement} container The element that the background
	 * should be appended to
	 * @return {HTMLElement} New background div
	 */
	function createBackground( slide, container ) {

		var data = {
			background: slide.getAttribute( 'data-background' ),
			backgroundSize: slide.getAttribute( 'data-background-size' ),
			backgroundImage: slide.getAttribute( 'data-background-image' ),
			backgroundVideo: slide.getAttribute( 'data-background-video' ),
			backgroundIframe: slide.getAttribute( 'data-background-iframe' ),
			backgroundColor: slide.getAttribute( 'data-background-color' ),
			backgroundRepeat: slide.getAttribute( 'data-background-repeat' ),
			backgroundPosition: slide.getAttribute( 'data-background-position' ),
			backgroundTransition: slide.getAttribute( 'data-background-transition' )
		};

		var element = document.createElement( 'div' );

		// Carry over custom classes from the slide to the background
		element.className = 'slide-background ' + slide.className.replace( /present|past|future/, '' );

		if( data.background ) {
			// Auto-wrap image urls in url(...)
			if( /^(http|file|\/\/)/gi.test( data.background ) || /\.(svg|png|jpg|jpeg|gif|bmp)$/gi.test( data.background ) ) {
				slide.setAttribute( 'data-background-image', data.background );
			}
			else {
				element.style.background = data.background;
			}
		}

		// Create a hash for this combination of background settings.
		// This is used to determine when two slide backgrounds are
		// the same.
		if( data.background || data.backgroundColor || data.backgroundImage || data.backgroundVideo || data.backgroundIframe ) {
			element.setAttribute( 'data-background-hash', data.background +
															data.backgroundSize +
															data.backgroundImage +
															data.backgroundVideo +
															data.backgroundIframe +
															data.backgroundColor +
															data.backgroundRepeat +
															data.backgroundPosition +
															data.backgroundTransition );
		}

		// Additional and optional background properties
		if( data.backgroundSize ) element.style.backgroundSize = data.backgroundSize;
		if( data.backgroundColor ) element.style.backgroundColor = data.backgroundColor;
		if( data.backgroundRepeat ) element.style.backgroundRepeat = data.backgroundRepeat;
		if( data.backgroundPosition ) element.style.backgroundPosition = data.backgroundPosition;
		if( data.backgroundTransition ) element.setAttribute( 'data-background-transition', data.backgroundTransition );

		container.appendChild( element );

		// If backgrounds are being recreated, clear old classes
		slide.classList.remove( 'has-dark-background' );
		slide.classList.remove( 'has-light-background' );

		slide.slideBackgroundElement = element;

		// If this slide has a background color, add a class that
		// signals if it is light or dark. If the slide has no background
		// color, no class will be set
		var computedBackgroundStyle = window.getComputedStyle( element );
		if( computedBackgroundStyle && computedBackgroundStyle.backgroundColor ) {
			var rgb = colorToRgb( computedBackgroundStyle.backgroundColor );

			// Ignore fully transparent backgrounds. Some browsers return
			// rgba(0,0,0,0) when reading the computed background color of
			// an element with no background
			if( rgb && rgb.a !== 0 ) {
				if( colorBrightness( computedBackgroundStyle.backgroundColor ) < 128 ) {
					slide.classList.add( 'has-dark-background' );
				}
				else {
					slide.classList.add( 'has-light-background' );
				}
			}
		}

		return element;

	}

	/**
	 * Registers a listener to postMessage events, this makes it
	 * possible to call all reveal.js API methods from another
	 * window. For example:
	 *
	 * revealWindow.postMessage( JSON.stringify({
	 *   method: 'slide',
	 *   args: [ 2 ]
	 * }), '*' );
	 */
	function setupPostMessage() {

		if( config.postMessage ) {
			window.addEventListener( 'message', function ( event ) {
				var data = event.data;

				// Make sure we're dealing with JSON
				if( typeof data === 'string' && data.charAt( 0 ) === '{' && data.charAt( data.length - 1 ) === '}' ) {
					data = JSON.parse( data );

					// Check if the requested method can be found
					if( data.method && typeof Reveal[data.method] === 'function' ) {
						Reveal[data.method].apply( Reveal, data.args );
					}
				}
			}, false );
		}

	}

	/**
	 * Applies the configuration settings from the config
	 * object. May be called multiple times.
	 *
	 * @param {object} options
	 */
	function configure( options ) {

		var numberOfSlides = dom.wrapper.querySelectorAll( SLIDES_SELECTOR ).length;

		dom.wrapper.classList.remove( config.transition );

		// New config options may be passed when this method
		// is invoked through the API after initialization
		if( typeof options === 'object' ) extend( config, options );

		// Force linear transition based on browser capabilities
		if( features.transforms3d === false ) config.transition = 'linear';

		dom.wrapper.classList.add( config.transition );

		dom.wrapper.setAttribute( 'data-transition-speed', config.transitionSpeed );
		dom.wrapper.setAttribute( 'data-background-transition', config.backgroundTransition );

		dom.controls.style.display = config.controls ? 'block' : 'none';
		dom.progress.style.display = config.progress ? 'block' : 'none';
		dom.slideNumber.style.display = config.slideNumber && !isPrintingPDF() ? 'block' : 'none';

		if( config.shuffle ) {
			shuffle();
		}

		if( config.rtl ) {
			dom.wrapper.classList.add( 'rtl' );
		}
		else {
			dom.wrapper.classList.remove( 'rtl' );
		}

		if( config.center ) {
			dom.wrapper.classList.add( 'center' );
		}
		else {
			dom.wrapper.classList.remove( 'center' );
		}

		// Exit the paused mode if it was configured off
		if( config.pause === false ) {
			resume();
		}

		if( config.showNotes ) {
			dom.speakerNotes.classList.add( 'visible' );
			dom.speakerNotes.setAttribute( 'data-layout', typeof config.showNotes === 'string' ? config.showNotes : 'inline' );
		}
		else {
			dom.speakerNotes.classList.remove( 'visible' );
		}

		if( config.mouseWheel ) {
			document.addEventListener( 'DOMMouseScroll', onDocumentMouseScroll, false ); // FF
			document.addEventListener( 'mousewheel', onDocumentMouseScroll, false );
		}
		else {
			document.removeEventListener( 'DOMMouseScroll', onDocumentMouseScroll, false ); // FF
			document.removeEventListener( 'mousewheel', onDocumentMouseScroll, false );
		}

		// Rolling 3D links
		if( config.rollingLinks ) {
			enableRollingLinks();
		}
		else {
			disableRollingLinks();
		}

		// Iframe link previews
		if( config.previewLinks ) {
			enablePreviewLinks();
		}
		else {
			disablePreviewLinks();
			enablePreviewLinks( '[data-preview-link]' );
		}

		// Remove existing auto-slide controls
		if( autoSlidePlayer ) {
			autoSlidePlayer.destroy();
			autoSlidePlayer = null;
		}

		// Generate auto-slide controls if needed
		if( numberOfSlides > 1 && config.autoSlide && config.autoSlideStoppable && features.canvas && features.requestAnimationFrame ) {
			autoSlidePlayer = new Playback( dom.wrapper, function() {
				return Math.min( Math.max( ( Date.now() - autoSlideStartTime ) / autoSlide, 0 ), 1 );
			} );

			autoSlidePlayer.on( 'click', onAutoSlidePlayerClick );
			autoSlidePaused = false;
		}

		// When fragments are turned off they should be visible
		if( config.fragments === false ) {
			toArray( dom.slides.querySelectorAll( '.fragment' ) ).forEach( function( element ) {
				element.classList.add( 'visible' );
				element.classList.remove( 'current-fragment' );
			} );
		}

		sync();

	}

	/**
	 * Binds all event listeners.
	 */
	function addEventListeners() {

		eventsAreBound = true;

		window.addEventListener( 'hashchange', onWindowHashChange, false );
		window.addEventListener( 'resize', onWindowResize, false );

		if( config.touch ) {
			dom.wrapper.addEventListener( 'touchstart', onTouchStart, false );
			dom.wrapper.addEventListener( 'touchmove', onTouchMove, false );
			dom.wrapper.addEventListener( 'touchend', onTouchEnd, false );

			// Support pointer-style touch interaction as well
			if( window.navigator.pointerEnabled ) {
				// IE 11 uses un-prefixed version of pointer events
				dom.wrapper.addEventListener( 'pointerdown', onPointerDown, false );
				dom.wrapper.addEventListener( 'pointermove', onPointerMove, false );
				dom.wrapper.addEventListener( 'pointerup', onPointerUp, false );
			}
			else if( window.navigator.msPointerEnabled ) {
				// IE 10 uses prefixed version of pointer events
				dom.wrapper.addEventListener( 'MSPointerDown', onPointerDown, false );
				dom.wrapper.addEventListener( 'MSPointerMove', onPointerMove, false );
				dom.wrapper.addEventListener( 'MSPointerUp', onPointerUp, false );
			}
		}

		if( config.keyboard ) {
			document.addEventListener( 'keydown', onDocumentKeyDown, false );
			document.addEventListener( 'keypress', onDocumentKeyPress, false );
		}

		if( config.progress && dom.progress ) {
			dom.progress.addEventListener( 'click', onProgressClicked, false );
		}

		if( config.focusBodyOnPageVisibilityChange ) {
			var visibilityChange;

			if( 'hidden' in document ) {
				visibilityChange = 'visibilitychange';
			}
			else if( 'msHidden' in document ) {
				visibilityChange = 'msvisibilitychange';
			}
			else if( 'webkitHidden' in document ) {
				visibilityChange = 'webkitvisibilitychange';
			}

			if( visibilityChange ) {
				document.addEventListener( visibilityChange, onPageVisibilityChange, false );
			}
		}

		// Listen to both touch and click events, in case the device
		// supports both
		var pointerEvents = [ 'touchstart', 'click' ];

		// Only support touch for Android, fixes double navigations in
		// stock browser
		if( UA.match( /android/gi ) ) {
			pointerEvents = [ 'touchstart' ];
		}

		pointerEvents.forEach( function( eventName ) {
			dom.controlsLeft.forEach( function( el ) { el.addEventListener( eventName, onNavigateLeftClicked, false ); } );
			dom.controlsRight.forEach( function( el ) { el.addEventListener( eventName, onNavigateRightClicked, false ); } );
			dom.controlsUp.forEach( function( el ) { el.addEventListener( eventName, onNavigateUpClicked, false ); } );
			dom.controlsDown.forEach( function( el ) { el.addEventListener( eventName, onNavigateDownClicked, false ); } );
			dom.controlsPrev.forEach( function( el ) { el.addEventListener( eventName, onNavigatePrevClicked, false ); } );
			dom.controlsNext.forEach( function( el ) { el.addEventListener( eventName, onNavigateNextClicked, false ); } );
		} );

	}

	/**
	 * Unbinds all event listeners.
	 */
	function removeEventListeners() {

		eventsAreBound = false;

		document.removeEventListener( 'keydown', onDocumentKeyDown, false );
		document.removeEventListener( 'keypress', onDocumentKeyPress, false );
		window.removeEventListener( 'hashchange', onWindowHashChange, false );
		window.removeEventListener( 'resize', onWindowResize, false );

		dom.wrapper.removeEventListener( 'touchstart', onTouchStart, false );
		dom.wrapper.removeEventListener( 'touchmove', onTouchMove, false );
		dom.wrapper.removeEventListener( 'touchend', onTouchEnd, false );

		// IE11
		if( window.navigator.pointerEnabled ) {
			dom.wrapper.removeEventListener( 'pointerdown', onPointerDown, false );
			dom.wrapper.removeEventListener( 'pointermove', onPointerMove, false );
			dom.wrapper.removeEventListener( 'pointerup', onPointerUp, false );
		}
		// IE10
		else if( window.navigator.msPointerEnabled ) {
			dom.wrapper.removeEventListener( 'MSPointerDown', onPointerDown, false );
			dom.wrapper.removeEventListener( 'MSPointerMove', onPointerMove, false );
			dom.wrapper.removeEventListener( 'MSPointerUp', onPointerUp, false );
		}

		if ( config.progress && dom.progress ) {
			dom.progress.removeEventListener( 'click', onProgressClicked, false );
		}

		[ 'touchstart', 'click' ].forEach( function( eventName ) {
			dom.controlsLeft.forEach( function( el ) { el.removeEventListener( eventName, onNavigateLeftClicked, false ); } );
			dom.controlsRight.forEach( function( el ) { el.removeEventListener( eventName, onNavigateRightClicked, false ); } );
			dom.controlsUp.forEach( function( el ) { el.removeEventListener( eventName, onNavigateUpClicked, false ); } );
			dom.controlsDown.forEach( function( el ) { el.removeEventListener( eventName, onNavigateDownClicked, false ); } );
			dom.controlsPrev.forEach( function( el ) { el.removeEventListener( eventName, onNavigatePrevClicked, false ); } );
			dom.controlsNext.forEach( function( el ) { el.removeEventListener( eventName, onNavigateNextClicked, false ); } );
		} );

	}

	/**
	 * Extend object a with the properties of object b.
	 * If there's a conflict, object b takes precedence.
	 *
	 * @param {object} a
	 * @param {object} b
	 */
	function extend( a, b ) {

		for( var i in b ) {
			a[ i ] = b[ i ];
		}

	}

	/**
	 * Converts the target object to an array.
	 *
	 * @param {object} o
	 * @return {object[]}
	 */
	function toArray( o ) {

		return Array.prototype.slice.call( o );

	}

	/**
	 * Utility for deserializing a value.
	 *
	 * @param {*} value
	 * @return {*}
	 */
	function deserialize( value ) {

		if( typeof value === 'string' ) {
			if( value === 'null' ) return null;
			else if( value === 'true' ) return true;
			else if( value === 'false' ) return false;
			else if( value.match( /^\d+$/ ) ) return parseFloat( value );
		}

		return value;

	}

	/**
	 * Measures the distance in pixels between point a
	 * and point b.
	 *
	 * @param {object} a point with x/y properties
	 * @param {object} b point with x/y properties
	 *
	 * @return {number}
	 */
	function distanceBetween( a, b ) {

		var dx = a.x - b.x,
			dy = a.y - b.y;

		return Math.sqrt( dx*dx + dy*dy );

	}

	/**
	 * Applies a CSS transform to the target element.
	 *
	 * @param {HTMLElement} element
	 * @param {string} transform
	 */
	function transformElement( element, transform ) {

		element.style.WebkitTransform = transform;
		element.style.MozTransform = transform;
		element.style.msTransform = transform;
		element.style.transform = transform;

	}

	/**
	 * Applies CSS transforms to the slides container. The container
	 * is transformed from two separate sources: layout and the overview
	 * mode.
	 *
	 * @param {object} transforms
	 */
	function transformSlides( transforms ) {

		// Pick up new transforms from arguments
		if( typeof transforms.layout === 'string' ) slidesTransform.layout = transforms.layout;
		if( typeof transforms.overview === 'string' ) slidesTransform.overview = transforms.overview;

		// Apply the transforms to the slides container
		if( slidesTransform.layout ) {
			transformElement( dom.slides, slidesTransform.layout + ' ' + slidesTransform.overview );
		}
		else {
			transformElement( dom.slides, slidesTransform.overview );
		}

	}

	/**
	 * Injects the given CSS styles into the DOM.
	 *
	 * @param {string} value
	 */
	function injectStyleSheet( value ) {

		var tag = document.createElement( 'style' );
		tag.type = 'text/css';
		if( tag.styleSheet ) {
			tag.styleSheet.cssText = value;
		}
		else {
			tag.appendChild( document.createTextNode( value ) );
		}
		document.getElementsByTagName( 'head' )[0].appendChild( tag );

	}

	/**
	 * Find the closest parent that matches the given
	 * selector.
	 *
	 * @param {HTMLElement} target The child element
	 * @param {String} selector The CSS selector to match
	 * the parents against
	 *
	 * @return {HTMLElement} The matched parent or null
	 * if no matching parent was found
	 */
	function closestParent( target, selector ) {

		var parent = target.parentNode;

		while( parent ) {

			// There's some overhead doing this each time, we don't
			// want to rewrite the element prototype but should still
			// be enough to feature detect once at startup...
			var matchesMethod = parent.matches || parent.matchesSelector || parent.msMatchesSelector;

			// If we find a match, we're all set
			if( matchesMethod && matchesMethod.call( parent, selector ) ) {
				return parent;
			}

			// Keep searching
			parent = parent.parentNode;

		}

		return null;

	}

	/**
	 * Converts various color input formats to an {r:0,g:0,b:0} object.
	 *
	 * @param {string} color The string representation of a color
	 * @example
	 * colorToRgb('#000');
	 * @example
	 * colorToRgb('#000000');
	 * @example
	 * colorToRgb('rgb(0,0,0)');
	 * @example
	 * colorToRgb('rgba(0,0,0)');
	 *
	 * @return {{r: number, g: number, b: number, [a]: number}|null}
	 */
	function colorToRgb( color ) {

		var hex3 = color.match( /^#([0-9a-f]{3})$/i );
		if( hex3 && hex3[1] ) {
			hex3 = hex3[1];
			return {
				r: parseInt( hex3.charAt( 0 ), 16 ) * 0x11,
				g: parseInt( hex3.charAt( 1 ), 16 ) * 0x11,
				b: parseInt( hex3.charAt( 2 ), 16 ) * 0x11
			};
		}

		var hex6 = color.match( /^#([0-9a-f]{6})$/i );
		if( hex6 && hex6[1] ) {
			hex6 = hex6[1];
			return {
				r: parseInt( hex6.substr( 0, 2 ), 16 ),
				g: parseInt( hex6.substr( 2, 2 ), 16 ),
				b: parseInt( hex6.substr( 4, 2 ), 16 )
			};
		}

		var rgb = color.match( /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i );
		if( rgb ) {
			return {
				r: parseInt( rgb[1], 10 ),
				g: parseInt( rgb[2], 10 ),
				b: parseInt( rgb[3], 10 )
			};
		}

		var rgba = color.match( /^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\,\s*([\d]+|[\d]*.[\d]+)\s*\)$/i );
		if( rgba ) {
			return {
				r: parseInt( rgba[1], 10 ),
				g: parseInt( rgba[2], 10 ),
				b: parseInt( rgba[3], 10 ),
				a: parseFloat( rgba[4] )
			};
		}

		return null;

	}

	/**
	 * Calculates brightness on a scale of 0-255.
	 *
	 * @param {string} color See colorToRgb for supported formats.
	 * @see {@link colorToRgb}
	 */
	function colorBrightness( color ) {

		if( typeof color === 'string' ) color = colorToRgb( color );

		if( color ) {
			return ( color.r * 299 + color.g * 587 + color.b * 114 ) / 1000;
		}

		return null;

	}

	/**
	 * Returns the remaining height within the parent of the
	 * target element.
	 *
	 * remaining height = [ configured parent height ] - [ current parent height ]
	 * 
	 * @param {HTMLElement} element
	 * @param {number} [height]
	 */
	function getRemainingHeight( element, height ) {

		height = height || 0;

		if( element ) {
			var newHeight, oldHeight = element.style.height;

			// Change the .stretch element height to 0 in order find the height of all
			// the other elements
			element.style.height = '0px';
			newHeight = height - element.parentNode.offsetHeight;

			// Restore the old height, just in case
			element.style.height = oldHeight + 'px';

			return newHeight;
		}

		return height;

	}

	/**
	 * Checks if this instance is being used to print a PDF.
	 */
	function isPrintingPDF() {

		return ( /print-pdf/gi ).test( window.location.search );

	}

	/**
	 * Hides the address bar if we're on a mobile device.
	 */
	function hideAddressBar() {

		if( config.hideAddressBar && isMobileDevice ) {
			// Events that should trigger the address bar to hide
			window.addEventListener( 'load', removeAddressBar, false );
			window.addEventListener( 'orientationchange', removeAddressBar, false );
		}

	}

	/**
	 * Causes the address bar to hide on mobile devices,
	 * more vertical space ftw.
	 */
	function removeAddressBar() {

		setTimeout( function() {
			window.scrollTo( 0, 1 );
		}, 10 );

	}

	/**
	 * Dispatches an event of the specified type from the
	 * reveal DOM element.
	 */
	function dispatchEvent( type, args ) {

		var event = document.createEvent( 'HTMLEvents', 1, 2 );
		event.initEvent( type, true, true );
		extend( event, args );
		dom.wrapper.dispatchEvent( event );

		// If we're in an iframe, post each reveal.js event to the
		// parent window. Used by the notes plugin
		if( config.postMessageEvents && window.parent !== window.self ) {
			window.parent.postMessage( JSON.stringify({ namespace: 'reveal', eventName: type, state: getState() }), '*' );
		}

	}

	/**
	 * Wrap all links in 3D goodness.
	 */
	function enableRollingLinks() {

		if( features.transforms3d && !( 'msPerspective' in document.body.style ) ) {
			var anchors = dom.wrapper.querySelectorAll( SLIDES_SELECTOR + ' a' );

			for( var i = 0, len = anchors.length; i < len; i++ ) {
				var anchor = anchors[i];

				if( anchor.textContent && !anchor.querySelector( '*' ) && ( !anchor.className || !anchor.classList.contains( anchor, 'roll' ) ) ) {
					var span = document.createElement('span');
					span.setAttribute('data-title', anchor.text);
					span.innerHTML = anchor.innerHTML;

					anchor.classList.add( 'roll' );
					anchor.innerHTML = '';
					anchor.appendChild(span);
				}
			}
		}

	}

	/**
	 * Unwrap all 3D links.
	 */
	function disableRollingLinks() {

		var anchors = dom.wrapper.querySelectorAll( SLIDES_SELECTOR + ' a.roll' );

		for( var i = 0, len = anchors.length; i < len; i++ ) {
			var anchor = anchors[i];
			var span = anchor.querySelector( 'span' );

			if( span ) {
				anchor.classList.remove( 'roll' );
				anchor.innerHTML = span.innerHTML;
			}
		}

	}

	/**
	 * Bind preview frame links.
	 *
	 * @param {string} [selector=a] - selector for anchors
	 */
	function enablePreviewLinks( selector ) {

		var anchors = toArray( document.querySelectorAll( selector ? selector : 'a' ) );

		anchors.forEach( function( element ) {
			if( /^(http|www)/gi.test( element.getAttribute( 'href' ) ) ) {
				element.addEventListener( 'click', onPreviewLinkClicked, false );
			}
		} );

	}

	/**
	 * Unbind preview frame links.
	 */
	function disablePreviewLinks() {

		var anchors = toArray( document.querySelectorAll( 'a' ) );

		anchors.forEach( function( element ) {
			if( /^(http|www)/gi.test( element.getAttribute( 'href' ) ) ) {
				element.removeEventListener( 'click', onPreviewLinkClicked, false );
			}
		} );

	}

	/**
	 * Opens a preview window for the target URL.
	 *
	 * @param {string} url - url for preview iframe src
	 */
	function showPreview( url ) {

		closeOverlay();

		dom.overlay = document.createElement( 'div' );
		dom.overlay.classList.add( 'overlay' );
		dom.overlay.classList.add( 'overlay-preview' );
		dom.wrapper.appendChild( dom.overlay );

		dom.overlay.innerHTML = [
			'<header>',
				'<a class="close" href="#"><span class="icon"></span></a>',
				'<a class="external" href="'+ url +'" target="_blank"><span class="icon"></span></a>',
			'</header>',
			'<div class="spinner"></div>',
			'<div class="viewport">',
				'<iframe src="'+ url +'"></iframe>',
				'<small class="viewport-inner">',
					'<span class="x-frame-error">Unable to load iframe. This is likely due to the site\'s policy (x-frame-options).</span>',
				'</small>',
			'</div>'
		].join('');

		dom.overlay.querySelector( 'iframe' ).addEventListener( 'load', function( event ) {
			dom.overlay.classList.add( 'loaded' );
		}, false );

		dom.overlay.querySelector( '.close' ).addEventListener( 'click', function( event ) {
			closeOverlay();
			event.preventDefault();
		}, false );

		dom.overlay.querySelector( '.external' ).addEventListener( 'click', function( event ) {
			closeOverlay();
		}, false );

		setTimeout( function() {
			dom.overlay.classList.add( 'visible' );
		}, 1 );

	}

	/**
	 * Opens an overlay window with help material.
	 */
	function showHelp() {

		if( config.help ) {

			closeOverlay();

			dom.overlay = document.createElement( 'div' );
			dom.overlay.classList.add( 'overlay' );
			dom.overlay.classList.add( 'overlay-help' );
			dom.wrapper.appendChild( dom.overlay );

			var html = '<p class="title">Keyboard Shortcuts</p><br/>';

			html += '<table><th>KEY</th><th>ACTION</th>';
			for( var key in keyboardShortcuts ) {
				html += '<tr><td>' + key + '</td><td>' + keyboardShortcuts[ key ] + '</td></tr>';
			}

			html += '</table>';

			dom.overlay.innerHTML = [
				'<header>',
					'<a class="close" href="#"><span class="icon"></span></a>',
				'</header>',
				'<div class="viewport">',
					'<div class="viewport-inner">'+ html +'</div>',
				'</div>'
			].join('');

			dom.overlay.querySelector( '.close' ).addEventListener( 'click', function( event ) {
				closeOverlay();
				event.preventDefault();
			}, false );

			setTimeout( function() {
				dom.overlay.classList.add( 'visible' );
			}, 1 );

		}

	}

	/**
	 * Closes any currently open overlay.
	 */
	function closeOverlay() {

		if( dom.overlay ) {
			dom.overlay.parentNode.removeChild( dom.overlay );
			dom.overlay = null;
		}

	}

	/**
	 * Applies JavaScript-controlled layout rules to the
	 * presentation.
	 */
	function layout() {

		if( dom.wrapper && !isPrintingPDF() ) {

			var size = getComputedSlideSize();

			// Layout the contents of the slides
			layoutSlideContents( config.width, config.height );

			dom.slides.style.width = size.width + 'px';
			dom.slides.style.height = size.height + 'px';

			// Determine scale of content to fit within available space
			scale = Math.min( size.presentationWidth / size.width, size.presentationHeight / size.height );

			// Respect max/min scale settings
			scale = Math.max( scale, config.minScale );
			scale = Math.min( scale, config.maxScale );

			// Don't apply any scaling styles if scale is 1
			if( scale === 1 ) {
				dom.slides.style.zoom = '';
				dom.slides.style.left = '';
				dom.slides.style.top = '';
				dom.slides.style.bottom = '';
				dom.slides.style.right = '';
				transformSlides( { layout: '' } );
			}
			else {
				// Prefer zoom for scaling up so that content remains crisp.
				// Don't use zoom to scale down since that can lead to shifts
				// in text layout/line breaks.
				if( scale > 1 && features.zoom ) {
					dom.slides.style.zoom = scale;
					dom.slides.style.left = '';
					dom.slides.style.top = '';
					dom.slides.style.bottom = '';
					dom.slides.style.right = '';
					transformSlides( { layout: '' } );
				}
				// Apply scale transform as a fallback
				else {
					dom.slides.style.zoom = '';
					dom.slides.style.left = '50%';
					dom.slides.style.top = '50%';
					dom.slides.style.bottom = 'auto';
					dom.slides.style.right = 'auto';
					transformSlides( { layout: 'translate(-50%, -50%) scale('+ scale +')' } );
				}
			}

			// Select all slides, vertical and horizontal
			var slides = toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR ) );

			for( var i = 0, len = slides.length; i < len; i++ ) {
				var slide = slides[ i ];

				// Don't bother updating invisible slides
				if( slide.style.display === 'none' ) {
					continue;
				}

				if( config.center || slide.classList.contains( 'center' ) ) {
					// Vertical stacks are not centred since their section
					// children will be
					if( slide.classList.contains( 'stack' ) ) {
						slide.style.top = 0;
					}
					else {
						slide.style.top = Math.max( ( size.height - slide.scrollHeight ) / 2, 0 ) + 'px';
					}
				}
				else {
					slide.style.top = '';
				}

			}

			updateProgress();
			updateParallax();

		}

	}

	/**
	 * Applies layout logic to the contents of all slides in
	 * the presentation.
	 *
	 * @param {string|number} width
	 * @param {string|number} height
	 */
	function layoutSlideContents( width, height ) {

		// Handle sizing of elements with the 'stretch' class
		toArray( dom.slides.querySelectorAll( 'section > .stretch' ) ).forEach( function( element ) {

			// Determine how much vertical space we can use
			var remainingHeight = getRemainingHeight( element, height );

			// Consider the aspect ratio of media elements
			if( /(img|video)/gi.test( element.nodeName ) ) {
				var nw = element.naturalWidth || element.videoWidth,
					nh = element.naturalHeight || element.videoHeight;

				var es = Math.min( width / nw, remainingHeight / nh );

				element.style.width = ( nw * es ) + 'px';
				element.style.height = ( nh * es ) + 'px';

			}
			else {
				element.style.width = width + 'px';
				element.style.height = remainingHeight + 'px';
			}

		} );

	}

	/**
	 * Calculates the computed pixel size of our slides. These
	 * values are based on the width and height configuration
	 * options.
	 *
	 * @param {number} [presentationWidth=dom.wrapper.offsetWidth]
	 * @param {number} [presentationHeight=dom.wrapper.offsetHeight]
	 */
	function getComputedSlideSize( presentationWidth, presentationHeight ) {

		var size = {
			// Slide size
			width: config.width,
			height: config.height,

			// Presentation size
			presentationWidth: presentationWidth || dom.wrapper.offsetWidth,
			presentationHeight: presentationHeight || dom.wrapper.offsetHeight
		};

		// Reduce available space by margin
		size.presentationWidth -= ( size.presentationWidth * config.margin );
		size.presentationHeight -= ( size.presentationHeight * config.margin );

		// Slide width may be a percentage of available width
		if( typeof size.width === 'string' && /%$/.test( size.width ) ) {
			size.width = parseInt( size.width, 10 ) / 100 * size.presentationWidth;
		}

		// Slide height may be a percentage of available height
		if( typeof size.height === 'string' && /%$/.test( size.height ) ) {
			size.height = parseInt( size.height, 10 ) / 100 * size.presentationHeight;
		}

		return size;

	}

	/**
	 * Stores the vertical index of a stack so that the same
	 * vertical slide can be selected when navigating to and
	 * from the stack.
	 *
	 * @param {HTMLElement} stack The vertical stack element
	 * @param {string|number} [v=0] Index to memorize
	 */
	function setPreviousVerticalIndex( stack, v ) {

		if( typeof stack === 'object' && typeof stack.setAttribute === 'function' ) {
			stack.setAttribute( 'data-previous-indexv', v || 0 );
		}

	}

	/**
	 * Retrieves the vertical index which was stored using
	 * #setPreviousVerticalIndex() or 0 if no previous index
	 * exists.
	 *
	 * @param {HTMLElement} stack The vertical stack element
	 */
	function getPreviousVerticalIndex( stack ) {

		if( typeof stack === 'object' && typeof stack.setAttribute === 'function' && stack.classList.contains( 'stack' ) ) {
			// Prefer manually defined start-indexv
			var attributeName = stack.hasAttribute( 'data-start-indexv' ) ? 'data-start-indexv' : 'data-previous-indexv';

			return parseInt( stack.getAttribute( attributeName ) || 0, 10 );
		}

		return 0;

	}

	/**
	 * Displays the overview of slides (quick nav) by scaling
	 * down and arranging all slide elements.
	 */
	function activateOverview() {

		// Only proceed if enabled in config
		if( config.overview && !isOverview() ) {

			overview = true;

			dom.wrapper.classList.add( 'overview' );
			dom.wrapper.classList.remove( 'overview-deactivating' );

			if( features.overviewTransitions ) {
				setTimeout( function() {
					dom.wrapper.classList.add( 'overview-animated' );
				}, 1 );
			}

			// Don't auto-slide while in overview mode
			cancelAutoSlide();

			// Move the backgrounds element into the slide container to
			// that the same scaling is applied
			dom.slides.appendChild( dom.background );

			// Clicking on an overview slide navigates to it
			toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR ) ).forEach( function( slide ) {
				if( !slide.classList.contains( 'stack' ) ) {
					slide.addEventListener( 'click', onOverviewSlideClicked, true );
				}
			} );

			// Calculate slide sizes
			var margin = 70;
			var slideSize = getComputedSlideSize();
			overviewSlideWidth = slideSize.width + margin;
			overviewSlideHeight = slideSize.height + margin;

			// Reverse in RTL mode
			if( config.rtl ) {
				overviewSlideWidth = -overviewSlideWidth;
			}

			updateSlidesVisibility();
			layoutOverview();
			updateOverview();

			layout();

			// Notify observers of the overview showing
			dispatchEvent( 'overviewshown', {
				'indexh': indexh,
				'indexv': indexv,
				'currentSlide': currentSlide
			} );

		}

	}

	/**
	 * Uses CSS transforms to position all slides in a grid for
	 * display inside of the overview mode.
	 */
	function layoutOverview() {

		// Layout slides
		toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) ).forEach( function( hslide, h ) {
			hslide.setAttribute( 'data-index-h', h );
			transformElement( hslide, 'translate3d(' + ( h * overviewSlideWidth ) + 'px, 0, 0)' );

			if( hslide.classList.contains( 'stack' ) ) {

				toArray( hslide.querySelectorAll( 'section' ) ).forEach( function( vslide, v ) {
					vslide.setAttribute( 'data-index-h', h );
					vslide.setAttribute( 'data-index-v', v );

					transformElement( vslide, 'translate3d(0, ' + ( v * overviewSlideHeight ) + 'px, 0)' );
				} );

			}
		} );

		// Layout slide backgrounds
		toArray( dom.background.childNodes ).forEach( function( hbackground, h ) {
			transformElement( hbackground, 'translate3d(' + ( h * overviewSlideWidth ) + 'px, 0, 0)' );

			toArray( hbackground.querySelectorAll( '.slide-background' ) ).forEach( function( vbackground, v ) {
				transformElement( vbackground, 'translate3d(0, ' + ( v * overviewSlideHeight ) + 'px, 0)' );
			} );
		} );

	}

	/**
	 * Moves the overview viewport to the current slides.
	 * Called each time the current slide changes.
	 */
	function updateOverview() {

		transformSlides( {
			overview: [
				'translateX('+ ( -indexh * overviewSlideWidth ) +'px)',
				'translateY('+ ( -indexv * overviewSlideHeight ) +'px)',
				'translateZ('+ ( window.innerWidth < 400 ? -1000 : -2500 ) +'px)'
			].join( ' ' )
		} );

	}

	/**
	 * Exits the slide overview and enters the currently
	 * active slide.
	 */
	function deactivateOverview() {

		// Only proceed if enabled in config
		if( config.overview ) {

			overview = false;

			dom.wrapper.classList.remove( 'overview' );
			dom.wrapper.classList.remove( 'overview-animated' );

			// Temporarily add a class so that transitions can do different things
			// depending on whether they are exiting/entering overview, or just
			// moving from slide to slide
			dom.wrapper.classList.add( 'overview-deactivating' );

			setTimeout( function () {
				dom.wrapper.classList.remove( 'overview-deactivating' );
			}, 1 );

			// Move the background element back out
			dom.wrapper.appendChild( dom.background );

			// Clean up changes made to slides
			toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR ) ).forEach( function( slide ) {
				transformElement( slide, '' );

				slide.removeEventListener( 'click', onOverviewSlideClicked, true );
			} );

			// Clean up changes made to backgrounds
			toArray( dom.background.querySelectorAll( '.slide-background' ) ).forEach( function( background ) {
				transformElement( background, '' );
			} );

			transformSlides( { overview: '' } );

			slide( indexh, indexv );

			layout();

			cueAutoSlide();

			// Notify observers of the overview hiding
			dispatchEvent( 'overviewhidden', {
				'indexh': indexh,
				'indexv': indexv,
				'currentSlide': currentSlide
			} );

		}
	}

	/**
	 * Toggles the slide overview mode on and off.
	 *
	 * @param {Boolean} [override] Flag which overrides the
	 * toggle logic and forcibly sets the desired state. True means
	 * overview is open, false means it's closed.
	 */
	function toggleOverview( override ) {

		if( typeof override === 'boolean' ) {
			override ? activateOverview() : deactivateOverview();
		}
		else {
			isOverview() ? deactivateOverview() : activateOverview();
		}

	}

	/**
	 * Checks if the overview is currently active.
	 *
	 * @return {Boolean} true if the overview is active,
	 * false otherwise
	 */
	function isOverview() {

		return overview;

	}

	/**
	 * Checks if the current or specified slide is vertical
	 * (nested within another slide).
	 *
	 * @param {HTMLElement} [slide=currentSlide] The slide to check
	 * orientation of
	 * @return {Boolean}
	 */
	function isVerticalSlide( slide ) {

		// Prefer slide argument, otherwise use current slide
		slide = slide ? slide : currentSlide;

		return slide && slide.parentNode && !!slide.parentNode.nodeName.match( /section/i );

	}

	/**
	 * Handling the fullscreen functionality via the fullscreen API
	 *
	 * @see http://fullscreen.spec.whatwg.org/
	 * @see https://developer.mozilla.org/en-US/docs/DOM/Using_fullscreen_mode
	 */
	function enterFullscreen() {

		var element = document.documentElement;

		// Check which implementation is available
		var requestMethod = element.requestFullscreen ||
							element.webkitRequestFullscreen ||
							element.webkitRequestFullScreen ||
							element.mozRequestFullScreen ||
							element.msRequestFullscreen;

		if( requestMethod ) {
			requestMethod.apply( element );
		}

	}

	/**
	 * Enters the paused mode which fades everything on screen to
	 * black.
	 */
	function pause() {

		if( config.pause ) {
			var wasPaused = dom.wrapper.classList.contains( 'paused' );

			cancelAutoSlide();
			dom.wrapper.classList.add( 'paused' );

			if( wasPaused === false ) {
				dispatchEvent( 'paused' );
			}
		}

	}

	/**
	 * Exits from the paused mode.
	 */
	function resume() {

		var wasPaused = dom.wrapper.classList.contains( 'paused' );
		dom.wrapper.classList.remove( 'paused' );

		cueAutoSlide();

		if( wasPaused ) {
			dispatchEvent( 'resumed' );
		}

	}

	/**
	 * Toggles the paused mode on and off.
	 */
	function togglePause( override ) {

		if( typeof override === 'boolean' ) {
			override ? pause() : resume();
		}
		else {
			isPaused() ? resume() : pause();
		}

	}

	/**
	 * Checks if we are currently in the paused mode.
	 *
	 * @return {Boolean}
	 */
	function isPaused() {

		return dom.wrapper.classList.contains( 'paused' );

	}

	/**
	 * Toggles the auto slide mode on and off.
	 *
	 * @param {Boolean} [override] Flag which sets the desired state.
	 * True means autoplay starts, false means it stops.
	 */

	function toggleAutoSlide( override ) {

		if( typeof override === 'boolean' ) {
			override ? resumeAutoSlide() : pauseAutoSlide();
		}

		else {
			autoSlidePaused ? resumeAutoSlide() : pauseAutoSlide();
		}

	}

	/**
	 * Checks if the auto slide mode is currently on.
	 *
	 * @return {Boolean}
	 */
	function isAutoSliding() {

		return !!( autoSlide && !autoSlidePaused );

	}

	/**
	 * Steps from the current point in the presentation to the
	 * slide which matches the specified horizontal and vertical
	 * indices.
	 *
	 * @param {number} [h=indexh] Horizontal index of the target slide
	 * @param {number} [v=indexv] Vertical index of the target slide
	 * @param {number} [f] Index of a fragment within the
	 * target slide to activate
	 * @param {number} [o] Origin for use in multimaster environments
	 */
	function slide( h, v, f, o ) {

		// Remember where we were at before
		previousSlide = currentSlide;

		// Query all horizontal slides in the deck
		var horizontalSlides = dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR );

		// Abort if there are no slides
		if( horizontalSlides.length === 0 ) return;

		// If no vertical index is specified and the upcoming slide is a
		// stack, resume at its previous vertical index
		if( v === undefined && !isOverview() ) {
			v = getPreviousVerticalIndex( horizontalSlides[ h ] );
		}

		// If we were on a vertical stack, remember what vertical index
		// it was on so we can resume at the same position when returning
		if( previousSlide && previousSlide.parentNode && previousSlide.parentNode.classList.contains( 'stack' ) ) {
			setPreviousVerticalIndex( previousSlide.parentNode, indexv );
		}

		// Remember the state before this slide
		var stateBefore = state.concat();

		// Reset the state array
		state.length = 0;

		var indexhBefore = indexh || 0,
			indexvBefore = indexv || 0;

		// Activate and transition to the new slide
		indexh = updateSlides( HORIZONTAL_SLIDES_SELECTOR, h === undefined ? indexh : h );
		indexv = updateSlides( VERTICAL_SLIDES_SELECTOR, v === undefined ? indexv : v );

		// Update the visibility of slides now that the indices have changed
		updateSlidesVisibility();

		layout();

		// Apply the new state
		stateLoop: for( var i = 0, len = state.length; i < len; i++ ) {
			// Check if this state existed on the previous slide. If it
			// did, we will avoid adding it repeatedly
			for( var j = 0; j < stateBefore.length; j++ ) {
				if( stateBefore[j] === state[i] ) {
					stateBefore.splice( j, 1 );
					continue stateLoop;
				}
			}

			document.documentElement.classList.add( state[i] );

			// Dispatch custom event matching the state's name
			dispatchEvent( state[i] );
		}

		// Clean up the remains of the previous state
		while( stateBefore.length ) {
			document.documentElement.classList.remove( stateBefore.pop() );
		}

		// Update the overview if it's currently active
		if( isOverview() ) {
			updateOverview();
		}

		// Find the current horizontal slide and any possible vertical slides
		// within it
		var currentHorizontalSlide = horizontalSlides[ indexh ],
			currentVerticalSlides = currentHorizontalSlide.querySelectorAll( 'section' );

		// Store references to the previous and current slides
		currentSlide = currentVerticalSlides[ indexv ] || currentHorizontalSlide;

		// Show fragment, if specified
		if( typeof f !== 'undefined' ) {
			navigateFragment( f );
		}

		// Dispatch an event if the slide changed
		var slideChanged = ( indexh !== indexhBefore || indexv !== indexvBefore );
		if( slideChanged ) {
			dispatchEvent( 'slidechanged', {
				'indexh': indexh,
				'indexv': indexv,
				'previousSlide': previousSlide,
				'currentSlide': currentSlide,
				'origin': o
			} );
		}
		else {
			// Ensure that the previous slide is never the same as the current
			previousSlide = null;
		}

		// Solves an edge case where the previous slide maintains the
		// 'present' class when navigating between adjacent vertical
		// stacks
		if( previousSlide ) {
			previousSlide.classList.remove( 'present' );
			previousSlide.setAttribute( 'aria-hidden', 'true' );

			// Reset all slides upon navigate to home
			// Issue: #285
			if ( dom.wrapper.querySelector( HOME_SLIDE_SELECTOR ).classList.contains( 'present' ) ) {
				// Launch async task
				setTimeout( function () {
					var slides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR + '.stack') ), i;
					for( i in slides ) {
						if( slides[i] ) {
							// Reset stack
							setPreviousVerticalIndex( slides[i], 0 );
						}
					}
				}, 0 );
			}
		}

		// Handle embedded content
		if( slideChanged || !previousSlide ) {
			stopEmbeddedContent( previousSlide );
			startEmbeddedContent( currentSlide );
		}

		// Announce the current slide contents, for screen readers
		dom.statusDiv.textContent = getStatusText( currentSlide );

		updateControls();
		updateProgress();
		updateBackground();
		updateParallax();
		updateSlideNumber();
		updateNotes();

		// Update the URL hash
		writeURL();

		cueAutoSlide();

	}

	/**
	 * Syncs the presentation with the current DOM. Useful
	 * when new slides or control elements are added or when
	 * the configuration has changed.
	 */
	function sync() {

		// Subscribe to input
		removeEventListeners();
		addEventListeners();

		// Force a layout to make sure the current config is accounted for
		layout();

		// Reflect the current autoSlide value
		autoSlide = config.autoSlide;

		// Start auto-sliding if it's enabled
		cueAutoSlide();

		// Re-create the slide backgrounds
		createBackgrounds();

		// Write the current hash to the URL
		writeURL();

		sortAllFragments();

		updateControls();
		updateProgress();
		updateBackground( true );
		updateSlideNumber();
		updateSlidesVisibility();
		updateNotes();

		formatEmbeddedContent();
		startEmbeddedContent( currentSlide );

		if( isOverview() ) {
			layoutOverview();
		}

	}

	/**
	 * Resets all vertical slides so that only the first
	 * is visible.
	 */
	function resetVerticalSlides() {

		var horizontalSlides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );
		horizontalSlides.forEach( function( horizontalSlide ) {

			var verticalSlides = toArray( horizontalSlide.querySelectorAll( 'section' ) );
			verticalSlides.forEach( function( verticalSlide, y ) {

				if( y > 0 ) {
					verticalSlide.classList.remove( 'present' );
					verticalSlide.classList.remove( 'past' );
					verticalSlide.classList.add( 'future' );
					verticalSlide.setAttribute( 'aria-hidden', 'true' );
				}

			} );

		} );

	}

	/**
	 * Sorts and formats all of fragments in the
	 * presentation.
	 */
	function sortAllFragments() {

		var horizontalSlides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );
		horizontalSlides.forEach( function( horizontalSlide ) {

			var verticalSlides = toArray( horizontalSlide.querySelectorAll( 'section' ) );
			verticalSlides.forEach( function( verticalSlide, y ) {

				sortFragments( verticalSlide.querySelectorAll( '.fragment' ) );

			} );

			if( verticalSlides.length === 0 ) sortFragments( horizontalSlide.querySelectorAll( '.fragment' ) );

		} );

	}

	/**
	 * Randomly shuffles all slides in the deck.
	 */
	function shuffle() {

		var slides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );

		slides.forEach( function( slide ) {

			// Insert this slide next to another random slide. This may
			// cause the slide to insert before itself but that's fine.
			dom.slides.insertBefore( slide, slides[ Math.floor( Math.random() * slides.length ) ] );

		} );

	}

	/**
	 * Updates one dimension of slides by showing the slide
	 * with the specified index.
	 *
	 * @param {string} selector A CSS selector that will fetch
	 * the group of slides we are working with
	 * @param {number} index The index of the slide that should be
	 * shown
	 *
	 * @return {number} The index of the slide that is now shown,
	 * might differ from the passed in index if it was out of
	 * bounds.
	 */
	function updateSlides( selector, index ) {

		// Select all slides and convert the NodeList result to
		// an array
		var slides = toArray( dom.wrapper.querySelectorAll( selector ) ),
			slidesLength = slides.length;

		var printMode = isPrintingPDF();

		if( slidesLength ) {

			// Should the index loop?
			if( config.loop ) {
				index %= slidesLength;

				if( index < 0 ) {
					index = slidesLength + index;
				}
			}

			// Enforce max and minimum index bounds
			index = Math.max( Math.min( index, slidesLength - 1 ), 0 );

			for( var i = 0; i < slidesLength; i++ ) {
				var element = slides[i];

				var reverse = config.rtl && !isVerticalSlide( element );

				element.classList.remove( 'past' );
				element.classList.remove( 'present' );
				element.classList.remove( 'future' );

				// http://www.w3.org/html/wg/drafts/html/master/editing.html#the-hidden-attribute
				element.setAttribute( 'hidden', '' );
				element.setAttribute( 'aria-hidden', 'true' );

				// If this element contains vertical slides
				if( element.querySelector( 'section' ) ) {
					element.classList.add( 'stack' );
				}

				// If we're printing static slides, all slides are "present"
				if( printMode ) {
					element.classList.add( 'present' );
					continue;
				}

				if( i < index ) {
					// Any element previous to index is given the 'past' class
					element.classList.add( reverse ? 'future' : 'past' );

					if( config.fragments ) {
						var pastFragments = toArray( element.querySelectorAll( '.fragment' ) );

						// Show all fragments on prior slides
						while( pastFragments.length ) {
							var pastFragment = pastFragments.pop();
							pastFragment.classList.add( 'visible' );
							pastFragment.classList.remove( 'current-fragment' );
						}
					}
				}
				else if( i > index ) {
					// Any element subsequent to index is given the 'future' class
					element.classList.add( reverse ? 'past' : 'future' );

					if( config.fragments ) {
						var futureFragments = toArray( element.querySelectorAll( '.fragment.visible' ) );

						// No fragments in future slides should be visible ahead of time
						while( futureFragments.length ) {
							var futureFragment = futureFragments.pop();
							futureFragment.classList.remove( 'visible' );
							futureFragment.classList.remove( 'current-fragment' );
						}
					}
				}
			}

			// Mark the current slide as present
			slides[index].classList.add( 'present' );
			slides[index].removeAttribute( 'hidden' );
			slides[index].removeAttribute( 'aria-hidden' );

			// If this slide has a state associated with it, add it
			// onto the current state of the deck
			var slideState = slides[index].getAttribute( 'data-state' );
			if( slideState ) {
				state = state.concat( slideState.split( ' ' ) );
			}

		}
		else {
			// Since there are no slides we can't be anywhere beyond the
			// zeroth index
			index = 0;
		}

		return index;

	}

	/**
	 * Optimization method; hide all slides that are far away
	 * from the present slide.
	 */
	function updateSlidesVisibility() {

		// Select all slides and convert the NodeList result to
		// an array
		var horizontalSlides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) ),
			horizontalSlidesLength = horizontalSlides.length,
			distanceX,
			distanceY;

		if( horizontalSlidesLength && typeof indexh !== 'undefined' ) {

			// The number of steps away from the present slide that will
			// be visible
			var viewDistance = isOverview() ? 10 : config.viewDistance;

			// Limit view distance on weaker devices
			if( isMobileDevice ) {
				viewDistance = isOverview() ? 6 : 2;
			}

			// All slides need to be visible when exporting to PDF
			if( isPrintingPDF() ) {
				viewDistance = Number.MAX_VALUE;
			}

			for( var x = 0; x < horizontalSlidesLength; x++ ) {
				var horizontalSlide = horizontalSlides[x];

				var verticalSlides = toArray( horizontalSlide.querySelectorAll( 'section' ) ),
					verticalSlidesLength = verticalSlides.length;

				// Determine how far away this slide is from the present
				distanceX = Math.abs( ( indexh || 0 ) - x ) || 0;

				// If the presentation is looped, distance should measure
				// 1 between the first and last slides
				if( config.loop ) {
					distanceX = Math.abs( ( ( indexh || 0 ) - x ) % ( horizontalSlidesLength - viewDistance ) ) || 0;
				}

				// Show the horizontal slide if it's within the view distance
				if( distanceX < viewDistance ) {
					showSlide( horizontalSlide );
				}
				else {
					hideSlide( horizontalSlide );
				}

				if( verticalSlidesLength ) {

					var oy = getPreviousVerticalIndex( horizontalSlide );

					for( var y = 0; y < verticalSlidesLength; y++ ) {
						var verticalSlide = verticalSlides[y];

						distanceY = x === ( indexh || 0 ) ? Math.abs( ( indexv || 0 ) - y ) : Math.abs( y - oy );

						if( distanceX + distanceY < viewDistance ) {
							showSlide( verticalSlide );
						}
						else {
							hideSlide( verticalSlide );
						}
					}

				}
			}

		}

	}

	/**
	 * Pick up notes from the current slide and display them
	 * to the viewer.
	 *
	 * @see {@link config.showNotes}
	 */
	function updateNotes() {

		if( config.showNotes && dom.speakerNotes && currentSlide && !isPrintingPDF() ) {

			dom.speakerNotes.innerHTML = getSlideNotes() || '';

		}

	}

	/**
	 * Updates the progress bar to reflect the current slide.
	 */
	function updateProgress() {

		// Update progress if enabled
		if( config.progress && dom.progressbar ) {

			dom.progressbar.style.width = getProgress() * dom.wrapper.offsetWidth + 'px';

		}

	}

	/**
	 * Updates the slide number div to reflect the current slide.
	 *
	 * The following slide number formats are available:
	 *  "h.v":	horizontal . vertical slide number (default)
	 *  "h/v":	horizontal / vertical slide number
	 *    "c":	flattened slide number
	 *  "c/t":	flattened slide number / total slides
	 */
	function updateSlideNumber() {

		// Update slide number if enabled
		if( config.slideNumber && dom.slideNumber ) {

			var value = [];
			var format = 'h.v';

			// Check if a custom number format is available
			if( typeof config.slideNumber === 'string' ) {
				format = config.slideNumber;
			}

			switch( format ) {
				case 'c':
					value.push( getSlidePastCount() + 1 );
					break;
				case 'c/t':
					value.push( getSlidePastCount() + 1, '/', getTotalSlides() );
					break;
				case 'h/v':
					value.push( indexh + 1 );
					if( isVerticalSlide() ) value.push( '/', indexv + 1 );
					break;
				default:
					value.push( indexh + 1 );
					if( isVerticalSlide() ) value.push( '.', indexv + 1 );
			}

			dom.slideNumber.innerHTML = formatSlideNumber( value[0], value[1], value[2] );
		}

	}

	/**
	 * Applies HTML formatting to a slide number before it's
	 * written to the DOM.
	 *
	 * @param {number} a Current slide
	 * @param {string} delimiter Character to separate slide numbers
	 * @param {(number|*)} b Total slides
	 * @return {string} HTML string fragment
	 */
	function formatSlideNumber( a, delimiter, b ) {

		if( typeof b === 'number' && !isNaN( b ) ) {
			return  '<span class="slide-number-a">'+ a +'</span>' +
					'<span class="slide-number-delimiter">'+ delimiter +'</span>' +
					'<span class="slide-number-b">'+ b +'</span>';
		}
		else {
			return '<span class="slide-number-a">'+ a +'</span>';
		}

	}

	/**
	 * Updates the state of all control/navigation arrows.
	 */
	function updateControls() {

		var routes = availableRoutes();
		var fragments = availableFragments();

		// Remove the 'enabled' class from all directions
		dom.controlsLeft.concat( dom.controlsRight )
						.concat( dom.controlsUp )
						.concat( dom.controlsDown )
						.concat( dom.controlsPrev )
						.concat( dom.controlsNext ).forEach( function( node ) {
			node.classList.remove( 'enabled' );
			node.classList.remove( 'fragmented' );

			// Set 'disabled' attribute on all directions
			node.setAttribute( 'disabled', 'disabled' );
		} );

		// Add the 'enabled' class to the available routes; remove 'disabled' attribute to enable buttons
		if( routes.left ) dom.controlsLeft.forEach( function( el ) { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );
		if( routes.right ) dom.controlsRight.forEach( function( el ) { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );
		if( routes.up ) dom.controlsUp.forEach( function( el ) { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );
		if( routes.down ) dom.controlsDown.forEach( function( el ) { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );

		// Prev/next buttons
		if( routes.left || routes.up ) dom.controlsPrev.forEach( function( el ) { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );
		if( routes.right || routes.down ) dom.controlsNext.forEach( function( el ) { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );

		// Highlight fragment directions
		if( currentSlide ) {

			// Always apply fragment decorator to prev/next buttons
			if( fragments.prev ) dom.controlsPrev.forEach( function( el ) { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
			if( fragments.next ) dom.controlsNext.forEach( function( el ) { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );

			// Apply fragment decorators to directional buttons based on
			// what slide axis they are in
			if( isVerticalSlide( currentSlide ) ) {
				if( fragments.prev ) dom.controlsUp.forEach( function( el ) { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
				if( fragments.next ) dom.controlsDown.forEach( function( el ) { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
			}
			else {
				if( fragments.prev ) dom.controlsLeft.forEach( function( el ) { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
				if( fragments.next ) dom.controlsRight.forEach( function( el ) { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
			}

		}

	}

	/**
	 * Updates the background elements to reflect the current
	 * slide.
	 *
	 * @param {boolean} includeAll If true, the backgrounds of
	 * all vertical slides (not just the present) will be updated.
	 */
	function updateBackground( includeAll ) {

		var currentBackground = null;

		// Reverse past/future classes when in RTL mode
		var horizontalPast = config.rtl ? 'future' : 'past',
			horizontalFuture = config.rtl ? 'past' : 'future';

		// Update the classes of all backgrounds to match the
		// states of their slides (past/present/future)
		toArray( dom.background.childNodes ).forEach( function( backgroundh, h ) {

			backgroundh.classList.remove( 'past' );
			backgroundh.classList.remove( 'present' );
			backgroundh.classList.remove( 'future' );

			if( h < indexh ) {
				backgroundh.classList.add( horizontalPast );
			}
			else if ( h > indexh ) {
				backgroundh.classList.add( horizontalFuture );
			}
			else {
				backgroundh.classList.add( 'present' );

				// Store a reference to the current background element
				currentBackground = backgroundh;
			}

			if( includeAll || h === indexh ) {
				toArray( backgroundh.querySelectorAll( '.slide-background' ) ).forEach( function( backgroundv, v ) {

					backgroundv.classList.remove( 'past' );
					backgroundv.classList.remove( 'present' );
					backgroundv.classList.remove( 'future' );

					if( v < indexv ) {
						backgroundv.classList.add( 'past' );
					}
					else if ( v > indexv ) {
						backgroundv.classList.add( 'future' );
					}
					else {
						backgroundv.classList.add( 'present' );

						// Only if this is the present horizontal and vertical slide
						if( h === indexh ) currentBackground = backgroundv;
					}

				} );
			}

		} );

		// Stop any currently playing video background
		if( previousBackground ) {

			var previousVideo = previousBackground.querySelector( 'video' );
			if( previousVideo ) previousVideo.pause();

		}

		if( currentBackground ) {

			// Start video playback
			var currentVideo = currentBackground.querySelector( 'video' );
			if( currentVideo ) {

				var startVideo = function() {
					currentVideo.currentTime = 0;
					currentVideo.play();
					currentVideo.removeEventListener( 'loadeddata', startVideo );
				};

				if( currentVideo.readyState > 1 ) {
					startVideo();
				}
				else {
					currentVideo.addEventListener( 'loadeddata', startVideo );
				}

			}

			var backgroundImageURL = currentBackground.style.backgroundImage || '';

			// Restart GIFs (doesn't work in Firefox)
			if( /\.gif/i.test( backgroundImageURL ) ) {
				currentBackground.style.backgroundImage = '';
				window.getComputedStyle( currentBackground ).opacity;
				currentBackground.style.backgroundImage = backgroundImageURL;
			}

			// Don't transition between identical backgrounds. This
			// prevents unwanted flicker.
			var previousBackgroundHash = previousBackground ? previousBackground.getAttribute( 'data-background-hash' ) : null;
			var currentBackgroundHash = currentBackground.getAttribute( 'data-background-hash' );
			if( currentBackgroundHash && currentBackgroundHash === previousBackgroundHash && currentBackground !== previousBackground ) {
				dom.background.classList.add( 'no-transition' );
			}

			previousBackground = currentBackground;

		}

		// If there's a background brightness flag for this slide,
		// bubble it to the .reveal container
		if( currentSlide ) {
			[ 'has-light-background', 'has-dark-background' ].forEach( function( classToBubble ) {
				if( currentSlide.classList.contains( classToBubble ) ) {
					dom.wrapper.classList.add( classToBubble );
				}
				else {
					dom.wrapper.classList.remove( classToBubble );
				}
			} );
		}

		// Allow the first background to apply without transition
		setTimeout( function() {
			dom.background.classList.remove( 'no-transition' );
		}, 1 );

	}

	/**
	 * Updates the position of the parallax background based
	 * on the current slide index.
	 */
	function updateParallax() {

		if( config.parallaxBackgroundImage ) {

			var horizontalSlides = dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ),
				verticalSlides = dom.wrapper.querySelectorAll( VERTICAL_SLIDES_SELECTOR );

			var backgroundSize = dom.background.style.backgroundSize.split( ' ' ),
				backgroundWidth, backgroundHeight;

			if( backgroundSize.length === 1 ) {
				backgroundWidth = backgroundHeight = parseInt( backgroundSize[0], 10 );
			}
			else {
				backgroundWidth = parseInt( backgroundSize[0], 10 );
				backgroundHeight = parseInt( backgroundSize[1], 10 );
			}

			var slideWidth = dom.background.offsetWidth,
				horizontalSlideCount = horizontalSlides.length,
				horizontalOffsetMultiplier,
				horizontalOffset;

			if( typeof config.parallaxBackgroundHorizontal === 'number' ) {
				horizontalOffsetMultiplier = config.parallaxBackgroundHorizontal;
			}
			else {
				horizontalOffsetMultiplier = horizontalSlideCount > 1 ? ( backgroundWidth - slideWidth ) / ( horizontalSlideCount-1 ) : 0;
			}

			horizontalOffset = horizontalOffsetMultiplier * indexh * -1;

			var slideHeight = dom.background.offsetHeight,
				verticalSlideCount = verticalSlides.length,
				verticalOffsetMultiplier,
				verticalOffset;

			if( typeof config.parallaxBackgroundVertical === 'number' ) {
				verticalOffsetMultiplier = config.parallaxBackgroundVertical;
			}
			else {
				verticalOffsetMultiplier = ( backgroundHeight - slideHeight ) / ( verticalSlideCount-1 );
			}

			verticalOffset = verticalSlideCount > 0 ?  verticalOffsetMultiplier * indexv : 0;

			dom.background.style.backgroundPosition = horizontalOffset + 'px ' + -verticalOffset + 'px';

		}

	}

	/**
	 * Called when the given slide is within the configured view
	 * distance. Shows the slide element and loads any content
	 * that is set to load lazily (data-src).
	 *
	 * @param {HTMLElement} slide Slide to show
	 */
	function showSlide( slide ) {

		// Show the slide element
		slide.style.display = 'block';

		// Media elements with data-src attributes
		toArray( slide.querySelectorAll( 'img[data-src], video[data-src], audio[data-src]' ) ).forEach( function( element ) {
			element.setAttribute( 'src', element.getAttribute( 'data-src' ) );
			element.removeAttribute( 'data-src' );
		} );

		// Media elements with <source> children
		toArray( slide.querySelectorAll( 'video, audio' ) ).forEach( function( media ) {
			var sources = 0;

			toArray( media.querySelectorAll( 'source[data-src]' ) ).forEach( function( source ) {
				source.setAttribute( 'src', source.getAttribute( 'data-src' ) );
				source.removeAttribute( 'data-src' );
				sources += 1;
			} );

			// If we rewrote sources for this video/audio element, we need
			// to manually tell it to load from its new origin
			if( sources > 0 ) {
				media.load();
			}
		} );


		// Show the corresponding background element
		var indices = getIndices( slide );
		var background = getSlideBackground( indices.h, indices.v );
		if( background ) {
			background.style.display = 'block';

			// If the background contains media, load it
			if( background.hasAttribute( 'data-loaded' ) === false ) {
				background.setAttribute( 'data-loaded', 'true' );

				var backgroundImage = slide.getAttribute( 'data-background-image' ),
					backgroundVideo = slide.getAttribute( 'data-background-video' ),
					backgroundVideoLoop = slide.hasAttribute( 'data-background-video-loop' ),
					backgroundVideoMuted = slide.hasAttribute( 'data-background-video-muted' ),
					backgroundIframe = slide.getAttribute( 'data-background-iframe' );

				// Images
				if( backgroundImage ) {
					background.style.backgroundImage = 'url('+ backgroundImage +')';
				}
				// Videos
				else if ( backgroundVideo && !isSpeakerNotes() ) {
					var video = document.createElement( 'video' );

					if( backgroundVideoLoop ) {
						video.setAttribute( 'loop', '' );
					}

					if( backgroundVideoMuted ) {
						video.muted = true;
					}

					// Support comma separated lists of video sources
					backgroundVideo.split( ',' ).forEach( function( source ) {
						video.innerHTML += '<source src="'+ source +'">';
					} );

					background.appendChild( video );
				}
				// Iframes
				else if( backgroundIframe ) {
					var iframe = document.createElement( 'iframe' );
						iframe.setAttribute( 'src', backgroundIframe );
						iframe.style.width  = '100%';
						iframe.style.height = '100%';
						iframe.style.maxHeight = '100%';
						iframe.style.maxWidth = '100%';

					background.appendChild( iframe );
				}
			}
		}

	}

	/**
	 * Called when the given slide is moved outside of the
	 * configured view distance.
	 *
	 * @param {HTMLElement} slide
	 */
	function hideSlide( slide ) {

		// Hide the slide element
		slide.style.display = 'none';

		// Hide the corresponding background element
		var indices = getIndices( slide );
		var background = getSlideBackground( indices.h, indices.v );
		if( background ) {
			background.style.display = 'none';
		}

	}

	/**
	 * Determine what available routes there are for navigation.
	 *
	 * @return {{left: boolean, right: boolean, up: boolean, down: boolean}}
	 */
	function availableRoutes() {

		var horizontalSlides = dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ),
			verticalSlides = dom.wrapper.querySelectorAll( VERTICAL_SLIDES_SELECTOR );

		var routes = {
			left: indexh > 0 || config.loop,
			right: indexh < horizontalSlides.length - 1 || config.loop,
			up: indexv > 0,
			down: indexv < verticalSlides.length - 1
		};

		// reverse horizontal controls for rtl
		if( config.rtl ) {
			var left = routes.left;
			routes.left = routes.right;
			routes.right = left;
		}

		return routes;

	}

	/**
	 * Returns an object describing the available fragment
	 * directions.
	 *
	 * @return {{prev: boolean, next: boolean}}
	 */
	function availableFragments() {

		if( currentSlide && config.fragments ) {
			var fragments = currentSlide.querySelectorAll( '.fragment' );
			var hiddenFragments = currentSlide.querySelectorAll( '.fragment:not(.visible)' );

			return {
				prev: fragments.length - hiddenFragments.length > 0,
				next: !!hiddenFragments.length
			};
		}
		else {
			return { prev: false, next: false };
		}

	}

	/**
	 * Enforces origin-specific format rules for embedded media.
	 */
	function formatEmbeddedContent() {

		var _appendParamToIframeSource = function( sourceAttribute, sourceURL, param ) {
			toArray( dom.slides.querySelectorAll( 'iframe['+ sourceAttribute +'*="'+ sourceURL +'"]' ) ).forEach( function( el ) {
				var src = el.getAttribute( sourceAttribute );
				if( src && src.indexOf( param ) === -1 ) {
					el.setAttribute( sourceAttribute, src + ( !/\?/.test( src ) ? '?' : '&' ) + param );
				}
			});
		};

		// YouTube frames must include "?enablejsapi=1"
		_appendParamToIframeSource( 'src', 'youtube.com/embed/', 'enablejsapi=1' );
		_appendParamToIframeSource( 'data-src', 'youtube.com/embed/', 'enablejsapi=1' );

		// Vimeo frames must include "?api=1"
		_appendParamToIframeSource( 'src', 'player.vimeo.com/', 'api=1' );
		_appendParamToIframeSource( 'data-src', 'player.vimeo.com/', 'api=1' );

	}

	/**
	 * Start playback of any embedded content inside of
	 * the given element.
	 *
	 * @param {HTMLElement} slide
	 */
	function startEmbeddedContent( element ) {

		if( element && !isSpeakerNotes() ) {
			// Restart GIFs
			toArray( element.querySelectorAll( 'img[src$=".gif"]' ) ).forEach( function( el ) {
				// Setting the same unchanged source like this was confirmed
				// to work in Chrome, FF & Safari
				el.setAttribute( 'src', el.getAttribute( 'src' ) );
			} );

			// HTML5 media elements
			toArray( element.querySelectorAll( 'video, audio' ) ).forEach( function( el ) {
				if( closestParent( el, '.fragment' ) && !closestParent( el, '.fragment.visible' ) ) {
					return;
				}

				if( el.hasAttribute( 'data-autoplay' ) && typeof el.play === 'function' ) {
					el.play();
				}
			} );

			// Normal iframes
			toArray( element.querySelectorAll( 'iframe[src]' ) ).forEach( function( el ) {
				if( closestParent( el, '.fragment' ) && !closestParent( el, '.fragment.visible' ) ) {
					return;
				}

				startEmbeddedIframe( { target: el } );
			} );

			// Lazy loading iframes
			toArray( element.querySelectorAll( 'iframe[data-src]' ) ).forEach( function( el ) {
				if( closestParent( el, '.fragment' ) && !closestParent( el, '.fragment.visible' ) ) {
					return;
				}

				if( el.getAttribute( 'src' ) !== el.getAttribute( 'data-src' ) ) {
					el.removeEventListener( 'load', startEmbeddedIframe ); // remove first to avoid dupes
					el.addEventListener( 'load', startEmbeddedIframe );
					el.setAttribute( 'src', el.getAttribute( 'data-src' ) );
				}
			} );
		}

	}

	/**
	 * "Starts" the content of an embedded iframe using the
	 * postMessage API.
	 *
	 * @param {object} event - postMessage API event
	 */
	function startEmbeddedIframe( event ) {

		var iframe = event.target;

		if( iframe && iframe.contentWindow ) {

			// YouTube postMessage API
			if( /youtube\.com\/embed\//.test( iframe.getAttribute( 'src' ) ) && iframe.hasAttribute( 'data-autoplay' ) ) {
				iframe.contentWindow.postMessage( '{"event":"command","func":"playVideo","args":""}', '*' );
			}
			// Vimeo postMessage API
			else if( /player\.vimeo\.com\//.test( iframe.getAttribute( 'src' ) ) && iframe.hasAttribute( 'data-autoplay' ) ) {
				iframe.contentWindow.postMessage( '{"method":"play"}', '*' );
			}
			// Generic postMessage API
			else {
				iframe.contentWindow.postMessage( 'slide:start', '*' );
			}

		}

	}

	/**
	 * Stop playback of any embedded content inside of
	 * the targeted slide.
	 *
	 * @param {HTMLElement} slide
	 */
	function stopEmbeddedContent( slide ) {

		if( slide && slide.parentNode ) {
			// HTML5 media elements
			toArray( slide.querySelectorAll( 'video, audio' ) ).forEach( function( el ) {
				if( !el.hasAttribute( 'data-ignore' ) && typeof el.pause === 'function' ) {
					el.pause();
				}
			} );

			// Generic postMessage API for non-lazy loaded iframes
			toArray( slide.querySelectorAll( 'iframe' ) ).forEach( function( el ) {
				el.contentWindow.postMessage( 'slide:stop', '*' );
				el.removeEventListener( 'load', startEmbeddedIframe );
			});

			// YouTube postMessage API
			toArray( slide.querySelectorAll( 'iframe[src*="youtube.com/embed/"]' ) ).forEach( function( el ) {
				if( !el.hasAttribute( 'data-ignore' ) && typeof el.contentWindow.postMessage === 'function' ) {
					el.contentWindow.postMessage( '{"event":"command","func":"pauseVideo","args":""}', '*' );
				}
			});

			// Vimeo postMessage API
			toArray( slide.querySelectorAll( 'iframe[src*="player.vimeo.com/"]' ) ).forEach( function( el ) {
				if( !el.hasAttribute( 'data-ignore' ) && typeof el.contentWindow.postMessage === 'function' ) {
					el.contentWindow.postMessage( '{"method":"pause"}', '*' );
				}
			});

			// Lazy loading iframes
			toArray( slide.querySelectorAll( 'iframe[data-src]' ) ).forEach( function( el ) {
				// Only removing the src doesn't actually unload the frame
				// in all browsers (Firefox) so we set it to blank first
				el.setAttribute( 'src', 'about:blank' );
				el.removeAttribute( 'src' );
			} );
		}

	}

	/**
	 * Returns the number of past slides. This can be used as a global
	 * flattened index for slides.
	 *
	 * @return {number} Past slide count
	 */
	function getSlidePastCount() {

		var horizontalSlides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );

		// The number of past slides
		var pastCount = 0;

		// Step through all slides and count the past ones
		mainLoop: for( var i = 0; i < horizontalSlides.length; i++ ) {

			var horizontalSlide = horizontalSlides[i];
			var verticalSlides = toArray( horizontalSlide.querySelectorAll( 'section' ) );

			for( var j = 0; j < verticalSlides.length; j++ ) {

				// Stop as soon as we arrive at the present
				if( verticalSlides[j].classList.contains( 'present' ) ) {
					break mainLoop;
				}

				pastCount++;

			}

			// Stop as soon as we arrive at the present
			if( horizontalSlide.classList.contains( 'present' ) ) {
				break;
			}

			// Don't count the wrapping section for vertical slides
			if( horizontalSlide.classList.contains( 'stack' ) === false ) {
				pastCount++;
			}

		}

		return pastCount;

	}

	/**
	 * Returns a value ranging from 0-1 that represents
	 * how far into the presentation we have navigated.
	 *
	 * @return {number}
	 */
	function getProgress() {

		// The number of past and total slides
		var totalCount = getTotalSlides();
		var pastCount = getSlidePastCount();

		if( currentSlide ) {

			var allFragments = currentSlide.querySelectorAll( '.fragment' );

			// If there are fragments in the current slide those should be
			// accounted for in the progress.
			if( allFragments.length > 0 ) {
				var visibleFragments = currentSlide.querySelectorAll( '.fragment.visible' );

				// This value represents how big a portion of the slide progress
				// that is made up by its fragments (0-1)
				var fragmentWeight = 0.9;

				// Add fragment progress to the past slide count
				pastCount += ( visibleFragments.length / allFragments.length ) * fragmentWeight;
			}

		}

		return pastCount / ( totalCount - 1 );

	}

	/**
	 * Checks if this presentation is running inside of the
	 * speaker notes window.
	 *
	 * @return {boolean}
	 */
	function isSpeakerNotes() {

		return !!window.location.search.match( /receiver/gi );

	}

	/**
	 * Reads the current URL (hash) and navigates accordingly.
	 */
	function readURL() {

		var hash = window.location.hash;

		// Attempt to parse the hash as either an index or name
		var bits = hash.slice( 2 ).split( '/' ),
			name = hash.replace( /#|\//gi, '' );

		// If the first bit is invalid and there is a name we can
		// assume that this is a named link
		if( isNaN( parseInt( bits[0], 10 ) ) && name.length ) {
			var element;

			// Ensure the named link is a valid HTML ID attribute
			if( /^[a-zA-Z][\w:.-]*$/.test( name ) ) {
				// Find the slide with the specified ID
				element = document.getElementById( name );
			}

			if( element ) {
				// Find the position of the named slide and navigate to it
				var indices = Reveal.getIndices( element );
				slide( indices.h, indices.v );
			}
			// If the slide doesn't exist, navigate to the current slide
			else {
				slide( indexh || 0, indexv || 0 );
			}
		}
		else {
			// Read the index components of the hash
			var h = parseInt( bits[0], 10 ) || 0,
				v = parseInt( bits[1], 10 ) || 0;

			if( h !== indexh || v !== indexv ) {
				slide( h, v );
			}
		}

	}

	/**
	 * Updates the page URL (hash) to reflect the current
	 * state.
	 *
	 * @param {number} delay The time in ms to wait before
	 * writing the hash
	 */
	function writeURL( delay ) {

		if( config.history ) {

			// Make sure there's never more than one timeout running
			clearTimeout( writeURLTimeout );

			// If a delay is specified, timeout this call
			if( typeof delay === 'number' ) {
				writeURLTimeout = setTimeout( writeURL, delay );
			}
			else if( currentSlide ) {
				var url = '/';

				// Attempt to create a named link based on the slide's ID
				var id = currentSlide.getAttribute( 'id' );
				if( id ) {
					id = id.replace( /[^a-zA-Z0-9\-\_\:\.]/g, '' );
				}

				// If the current slide has an ID, use that as a named link
				if( typeof id === 'string' && id.length ) {
					url = '/' + id;
				}
				// Otherwise use the /h/v index
				else {
					if( indexh > 0 || indexv > 0 ) url += indexh;
					if( indexv > 0 ) url += '/' + indexv;
				}

				window.location.hash = url;
			}
		}

	}
	/**
	 * Retrieves the h/v location and fragment of the current,
	 * or specified, slide.
	 *
	 * @param {HTMLElement} [slide] If specified, the returned
	 * index will be for this slide rather than the currently
	 * active one
	 *
	 * @return {{h: number, v: number, f: number}}
	 */
	function getIndices( slide ) {

		// By default, return the current indices
		var h = indexh,
			v = indexv,
			f;

		// If a slide is specified, return the indices of that slide
		if( slide ) {
			var isVertical = isVerticalSlide( slide );
			var slideh = isVertical ? slide.parentNode : slide;

			// Select all horizontal slides
			var horizontalSlides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );

			// Now that we know which the horizontal slide is, get its index
			h = Math.max( horizontalSlides.indexOf( slideh ), 0 );

			// Assume we're not vertical
			v = undefined;

			// If this is a vertical slide, grab the vertical index
			if( isVertical ) {
				v = Math.max( toArray( slide.parentNode.querySelectorAll( 'section' ) ).indexOf( slide ), 0 );
			}
		}

		if( !slide && currentSlide ) {
			var hasFragments = currentSlide.querySelectorAll( '.fragment' ).length > 0;
			if( hasFragments ) {
				var currentFragment = currentSlide.querySelector( '.current-fragment' );
				if( currentFragment && currentFragment.hasAttribute( 'data-fragment-index' ) ) {
					f = parseInt( currentFragment.getAttribute( 'data-fragment-index' ), 10 );
				}
				else {
					f = currentSlide.querySelectorAll( '.fragment.visible' ).length - 1;
				}
			}
		}

		return { h: h, v: v, f: f };

	}

	/**
	 * Retrieves the total number of slides in this presentation.
	 *
	 * @return {number}
	 */
	function getTotalSlides() {

		return dom.wrapper.querySelectorAll( SLIDES_SELECTOR + ':not(.stack)' ).length;

	}

	/**
	 * Returns the slide element matching the specified index.
	 *
	 * @return {HTMLElement}
	 */
	function getSlide( x, y ) {

		var horizontalSlide = dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR )[ x ];
		var verticalSlides = horizontalSlide && horizontalSlide.querySelectorAll( 'section' );

		if( verticalSlides && verticalSlides.length && typeof y === 'number' ) {
			return verticalSlides ? verticalSlides[ y ] : undefined;
		}

		return horizontalSlide;

	}

	/**
	 * Returns the background element for the given slide.
	 * All slides, even the ones with no background properties
	 * defined, have a background element so as long as the
	 * index is valid an element will be returned.
	 *
	 * @param {number} x Horizontal background index
	 * @param {number} y Vertical background index
	 * @return {(HTMLElement[]|*)}
	 */
	function getSlideBackground( x, y ) {

		// When printing to PDF the slide backgrounds are nested
		// inside of the slides
		if( isPrintingPDF() ) {
			var slide = getSlide( x, y );
			if( slide ) {
				return slide.slideBackgroundElement;
			}

			return undefined;
		}

		var horizontalBackground = dom.wrapper.querySelectorAll( '.backgrounds>.slide-background' )[ x ];
		var verticalBackgrounds = horizontalBackground && horizontalBackground.querySelectorAll( '.slide-background' );

		if( verticalBackgrounds && verticalBackgrounds.length && typeof y === 'number' ) {
			return verticalBackgrounds ? verticalBackgrounds[ y ] : undefined;
		}

		return horizontalBackground;

	}

	/**
	 * Retrieves the speaker notes from a slide. Notes can be
	 * defined in two ways:
	 * 1. As a data-notes attribute on the slide <section>
	 * 2. As an <aside class="notes"> inside of the slide
	 *
	 * @param {HTMLElement} [slide=currentSlide]
	 * @return {(string|null)}
	 */
	function getSlideNotes( slide ) {

		// Default to the current slide
		slide = slide || currentSlide;

		// Notes can be specified via the data-notes attribute...
		if( slide.hasAttribute( 'data-notes' ) ) {
			return slide.getAttribute( 'data-notes' );
		}

		// ... or using an <aside class="notes"> element
		var notesElement = slide.querySelector( 'aside.notes' );
		if( notesElement ) {
			return notesElement.innerHTML;
		}

		return null;

	}

	/**
	 * Retrieves the current state of the presentation as
	 * an object. This state can then be restored at any
	 * time.
	 *
	 * @return {{indexh: number, indexv: number, indexf: number, paused: boolean, overview: boolean}}
	 */
	function getState() {

		var indices = getIndices();

		return {
			indexh: indices.h,
			indexv: indices.v,
			indexf: indices.f,
			paused: isPaused(),
			overview: isOverview()
		};

	}

	/**
	 * Restores the presentation to the given state.
	 *
	 * @param {object} state As generated by getState()
	 * @see {@link getState} generates the parameter `state`
	 */
	function setState( state ) {

		if( typeof state === 'object' ) {
			slide( deserialize( state.indexh ), deserialize( state.indexv ), deserialize( state.indexf ) );

			var pausedFlag = deserialize( state.paused ),
				overviewFlag = deserialize( state.overview );

			if( typeof pausedFlag === 'boolean' && pausedFlag !== isPaused() ) {
				togglePause( pausedFlag );
			}

			if( typeof overviewFlag === 'boolean' && overviewFlag !== isOverview() ) {
				toggleOverview( overviewFlag );
			}
		}

	}

	/**
	 * Return a sorted fragments list, ordered by an increasing
	 * "data-fragment-index" attribute.
	 *
	 * Fragments will be revealed in the order that they are returned by
	 * this function, so you can use the index attributes to control the
	 * order of fragment appearance.
	 *
	 * To maintain a sensible default fragment order, fragments are presumed
	 * to be passed in document order. This function adds a "fragment-index"
	 * attribute to each node if such an attribute is not already present,
	 * and sets that attribute to an integer value which is the position of
	 * the fragment within the fragments list.
	 *
	 * @param {object[]|*} fragments
	 * @return {object[]} sorted Sorted array of fragments
	 */
	function sortFragments( fragments ) {

		fragments = toArray( fragments );

		var ordered = [],
			unordered = [],
			sorted = [];

		// Group ordered and unordered elements
		fragments.forEach( function( fragment, i ) {
			if( fragment.hasAttribute( 'data-fragment-index' ) ) {
				var index = parseInt( fragment.getAttribute( 'data-fragment-index' ), 10 );

				if( !ordered[index] ) {
					ordered[index] = [];
				}

				ordered[index].push( fragment );
			}
			else {
				unordered.push( [ fragment ] );
			}
		} );

		// Append fragments without explicit indices in their
		// DOM order
		ordered = ordered.concat( unordered );

		// Manually count the index up per group to ensure there
		// are no gaps
		var index = 0;

		// Push all fragments in their sorted order to an array,
		// this flattens the groups
		ordered.forEach( function( group ) {
			group.forEach( function( fragment ) {
				sorted.push( fragment );
				fragment.setAttribute( 'data-fragment-index', index );
			} );

			index ++;
		} );

		return sorted;

	}

	/**
	 * Navigate to the specified slide fragment.
	 *
	 * @param {?number} index The index of the fragment that
	 * should be shown, -1 means all are invisible
	 * @param {number} offset Integer offset to apply to the
	 * fragment index
	 *
	 * @return {boolean} true if a change was made in any
	 * fragments visibility as part of this call
	 */
	function navigateFragment( index, offset ) {

		if( currentSlide && config.fragments ) {

			var fragments = sortFragments( currentSlide.querySelectorAll( '.fragment' ) );
			if( fragments.length ) {

				// If no index is specified, find the current
				if( typeof index !== 'number' ) {
					var lastVisibleFragment = sortFragments( currentSlide.querySelectorAll( '.fragment.visible' ) ).pop();

					if( lastVisibleFragment ) {
						index = parseInt( lastVisibleFragment.getAttribute( 'data-fragment-index' ) || 0, 10 );
					}
					else {
						index = -1;
					}
				}

				// If an offset is specified, apply it to the index
				if( typeof offset === 'number' ) {
					index += offset;
				}

				var fragmentsShown = [],
					fragmentsHidden = [];

				toArray( fragments ).forEach( function( element, i ) {

					if( element.hasAttribute( 'data-fragment-index' ) ) {
						i = parseInt( element.getAttribute( 'data-fragment-index' ), 10 );
					}

					// Visible fragments
					if( i <= index ) {
						if( !element.classList.contains( 'visible' ) ) fragmentsShown.push( element );
						element.classList.add( 'visible' );
						element.classList.remove( 'current-fragment' );

						// Announce the fragments one by one to the Screen Reader
						dom.statusDiv.textContent = getStatusText( element );

						if( i === index ) {
							element.classList.add( 'current-fragment' );
							startEmbeddedContent( element );
						}
					}
					// Hidden fragments
					else {
						if( element.classList.contains( 'visible' ) ) fragmentsHidden.push( element );
						element.classList.remove( 'visible' );
						element.classList.remove( 'current-fragment' );
					}

				} );

				if( fragmentsHidden.length ) {
					dispatchEvent( 'fragmenthidden', { fragment: fragmentsHidden[0], fragments: fragmentsHidden } );
				}

				if( fragmentsShown.length ) {
					dispatchEvent( 'fragmentshown', { fragment: fragmentsShown[0], fragments: fragmentsShown } );
				}

				updateControls();
				updateProgress();

				return !!( fragmentsShown.length || fragmentsHidden.length );

			}

		}

		return false;

	}

	/**
	 * Navigate to the next slide fragment.
	 *
	 * @return {boolean} true if there was a next fragment,
	 * false otherwise
	 */
	function nextFragment() {

		return navigateFragment( null, 1 );

	}

	/**
	 * Navigate to the previous slide fragment.
	 *
	 * @return {boolean} true if there was a previous fragment,
	 * false otherwise
	 */
	function previousFragment() {

		return navigateFragment( null, -1 );

	}

	/**
	 * Cues a new automated slide if enabled in the config.
	 */
	function cueAutoSlide() {

		cancelAutoSlide();

		if( currentSlide ) {

			var fragment = currentSlide.querySelector( '.current-fragment' );

			// When the slide first appears there is no "current" fragment so
			// we look for a data-autoslide timing on the first fragment
			if( !fragment ) fragment = currentSlide.querySelector( '.fragment' );

			var fragmentAutoSlide = fragment ? fragment.getAttribute( 'data-autoslide' ) : null;
			var parentAutoSlide = currentSlide.parentNode ? currentSlide.parentNode.getAttribute( 'data-autoslide' ) : null;
			var slideAutoSlide = currentSlide.getAttribute( 'data-autoslide' );

			// Pick value in the following priority order:
			// 1. Current fragment's data-autoslide
			// 2. Current slide's data-autoslide
			// 3. Parent slide's data-autoslide
			// 4. Global autoSlide setting
			if( fragmentAutoSlide ) {
				autoSlide = parseInt( fragmentAutoSlide, 10 );
			}
			else if( slideAutoSlide ) {
				autoSlide = parseInt( slideAutoSlide, 10 );
			}
			else if( parentAutoSlide ) {
				autoSlide = parseInt( parentAutoSlide, 10 );
			}
			else {
				autoSlide = config.autoSlide;
			}

			// If there are media elements with data-autoplay,
			// automatically set the autoSlide duration to the
			// length of that media. Not applicable if the slide
			// is divided up into fragments. 
			// playbackRate is accounted for in the duration.
			if( currentSlide.querySelectorAll( '.fragment' ).length === 0 ) {
				toArray( currentSlide.querySelectorAll( 'video, audio' ) ).forEach( function( el ) {
					if( el.hasAttribute( 'data-autoplay' ) ) {
						if( autoSlide && (el.duration * 1000 / el.playbackRate ) > autoSlide ) {
							autoSlide = ( el.duration * 1000 / el.playbackRate ) + 1000;
						}
					}
				} );
			}

			// Cue the next auto-slide if:
			// - There is an autoSlide value
			// - Auto-sliding isn't paused by the user
			// - The presentation isn't paused
			// - The overview isn't active
			// - The presentation isn't over
			if( autoSlide && !autoSlidePaused && !isPaused() && !isOverview() && ( !Reveal.isLastSlide() || availableFragments().next || config.loop === true ) ) {
				autoSlideTimeout = setTimeout( function() {
					typeof config.autoSlideMethod === 'function' ? config.autoSlideMethod() : navigateNext();
					cueAutoSlide();
				}, autoSlide );
				autoSlideStartTime = Date.now();
			}

			if( autoSlidePlayer ) {
				autoSlidePlayer.setPlaying( autoSlideTimeout !== -1 );
			}

		}

	}

	/**
	 * Cancels any ongoing request to auto-slide.
	 */
	function cancelAutoSlide() {

		clearTimeout( autoSlideTimeout );
		autoSlideTimeout = -1;

	}

	function pauseAutoSlide() {

		if( autoSlide && !autoSlidePaused ) {
			autoSlidePaused = true;
			dispatchEvent( 'autoslidepaused' );
			clearTimeout( autoSlideTimeout );

			if( autoSlidePlayer ) {
				autoSlidePlayer.setPlaying( false );
			}
		}

	}

	function resumeAutoSlide() {

		if( autoSlide && autoSlidePaused ) {
			autoSlidePaused = false;
			dispatchEvent( 'autoslideresumed' );
			cueAutoSlide();
		}

	}

	function navigateLeft() {

		// Reverse for RTL
		if( config.rtl ) {
			if( ( isOverview() || nextFragment() === false ) && availableRoutes().left ) {
				slide( indexh + 1 );
			}
		}
		// Normal navigation
		else if( ( isOverview() || previousFragment() === false ) && availableRoutes().left ) {
			slide( indexh - 1 );
		}

	}

	function navigateRight() {

		// Reverse for RTL
		if( config.rtl ) {
			if( ( isOverview() || previousFragment() === false ) && availableRoutes().right ) {
				slide( indexh - 1 );
			}
		}
		// Normal navigation
		else if( ( isOverview() || nextFragment() === false ) && availableRoutes().right ) {
			slide( indexh + 1 );
		}

	}

	function navigateUp() {

		// Prioritize hiding fragments
		if( ( isOverview() || previousFragment() === false ) && availableRoutes().up ) {
			slide( indexh, indexv - 1 );
		}

	}

	function navigateDown() {

		// Prioritize revealing fragments
		if( ( isOverview() || nextFragment() === false ) && availableRoutes().down ) {
			slide( indexh, indexv + 1 );
		}

	}

	/**
	 * Navigates backwards, prioritized in the following order:
	 * 1) Previous fragment
	 * 2) Previous vertical slide
	 * 3) Previous horizontal slide
	 */
	function navigatePrev() {

		// Prioritize revealing fragments
		if( previousFragment() === false ) {
			if( availableRoutes().up ) {
				navigateUp();
			}
			else {
				// Fetch the previous horizontal slide, if there is one
				var previousSlide;

				if( config.rtl ) {
					previousSlide = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR + '.future' ) ).pop();
				}
				else {
					previousSlide = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR + '.past' ) ).pop();
				}

				if( previousSlide ) {
					var v = ( previousSlide.querySelectorAll( 'section' ).length - 1 ) || undefined;
					var h = indexh - 1;
					slide( h, v );
				}
			}
		}

	}

	/**
	 * The reverse of #navigatePrev().
	 */
	function navigateNext() {

		// Prioritize revealing fragments
		if( nextFragment() === false ) {
			if( availableRoutes().down ) {
				navigateDown();
			}
			else if( config.rtl ) {
				navigateLeft();
			}
			else {
				navigateRight();
			}
		}

	}

	/**
	 * Checks if the target element prevents the triggering of
	 * swipe navigation.
	 */
	function isSwipePrevented( target ) {

		while( target && typeof target.hasAttribute === 'function' ) {
			if( target.hasAttribute( 'data-prevent-swipe' ) ) return true;
			target = target.parentNode;
		}

		return false;

	}


	// --------------------------------------------------------------------//
	// ----------------------------- EVENTS -------------------------------//
	// --------------------------------------------------------------------//

	/**
	 * Called by all event handlers that are based on user
	 * input.
	 *
	 * @param {object} [event]
	 */
	function onUserInput( event ) {

		if( config.autoSlideStoppable ) {
			pauseAutoSlide();
		}

	}

	/**
	 * Handler for the document level 'keypress' event.
	 *
	 * @param {object} event
	 */
	function onDocumentKeyPress( event ) {

		// Check if the pressed key is question mark
		if( event.shiftKey && event.charCode === 63 ) {
			if( dom.overlay ) {
				closeOverlay();
			}
			else {
				showHelp( true );
			}
		}

	}

	/**
	 * Handler for the document level 'keydown' event.
	 *
	 * @param {object} event
	 */
	function onDocumentKeyDown( event ) {

		// If there's a condition specified and it returns false,
		// ignore this event
		if( typeof config.keyboardCondition === 'function' && config.keyboardCondition() === false ) {
			return true;
		}

		// Remember if auto-sliding was paused so we can toggle it
		var autoSlideWasPaused = autoSlidePaused;

		onUserInput( event );

		// Check if there's a focused element that could be using
		// the keyboard
		var activeElementIsCE = document.activeElement && document.activeElement.contentEditable !== 'inherit';
		var activeElementIsInput = document.activeElement && document.activeElement.tagName && /input|textarea/i.test( document.activeElement.tagName );
		var activeElementIsNotes = document.activeElement && document.activeElement.className && /speaker-notes/i.test( document.activeElement.className);

		// Disregard the event if there's a focused element or a
		// keyboard modifier key is present
		if( activeElementIsCE || activeElementIsInput || activeElementIsNotes || (event.shiftKey && event.keyCode !== 32) || event.altKey || event.ctrlKey || event.metaKey ) return;

		// While paused only allow resume keyboard events; 'b', 'v', '.'
		var resumeKeyCodes = [66,86,190,191];
		var key;

		// Custom key bindings for togglePause should be able to resume
		if( typeof config.keyboard === 'object' ) {
			for( key in config.keyboard ) {
				if( config.keyboard[key] === 'togglePause' ) {
					resumeKeyCodes.push( parseInt( key, 10 ) );
				}
			}
		}

		if( isPaused() && resumeKeyCodes.indexOf( event.keyCode ) === -1 ) {
			return false;
		}

		var triggered = false;

		// 1. User defined key bindings
		if( typeof config.keyboard === 'object' ) {

			for( key in config.keyboard ) {

				// Check if this binding matches the pressed key
				if( parseInt( key, 10 ) === event.keyCode ) {

					var value = config.keyboard[ key ];

					// Callback function
					if( typeof value === 'function' ) {
						value.apply( null, [ event ] );
					}
					// String shortcuts to reveal.js API
					else if( typeof value === 'string' && typeof Reveal[ value ] === 'function' ) {
						Reveal[ value ].call();
					}

					triggered = true;

				}

			}

		}

		// 2. System defined key bindings
		if( triggered === false ) {

			// Assume true and try to prove false
			triggered = true;

			switch( event.keyCode ) {
				// p, page up
				case 80: case 33: navigatePrev(); break;
				// n, page down
				case 78: case 34: navigateNext(); break;
				// h, left
				case 72: case 37: navigateLeft(); break;
				// l, right
				case 76: case 39: navigateRight(); break;
				// k, up
				case 75: case 38: navigateUp(); break;
				// j, down
				case 74: case 40: navigateDown(); break;
				// home
				case 36: slide( 0 ); break;
				// end
				case 35: slide( Number.MAX_VALUE ); break;
				// space
				case 32: isOverview() ? deactivateOverview() : event.shiftKey ? navigatePrev() : navigateNext(); break;
				// return
				case 13: isOverview() ? deactivateOverview() : triggered = false; break;
				// two-spot, semicolon, b, v, period, Logitech presenter tools "black screen" button
				case 58: case 59: case 66: case 86: case 190: case 191: togglePause(); break;
				// f
				case 70: enterFullscreen(); break;
				// a
				case 65: if ( config.autoSlideStoppable ) toggleAutoSlide( autoSlideWasPaused ); break;
				default:
					triggered = false;
			}

		}

		// If the input resulted in a triggered action we should prevent
		// the browsers default behavior
		if( triggered ) {
			event.preventDefault && event.preventDefault();
		}
		// ESC or O key
		else if ( ( event.keyCode === 27 || event.keyCode === 79 ) && features.transforms3d ) {
			if( dom.overlay ) {
				closeOverlay();
			}
			else {
				toggleOverview();
			}

			event.preventDefault && event.preventDefault();
		}

		// If auto-sliding is enabled we need to cue up
		// another timeout
		cueAutoSlide();

	}

	/**
	 * Handler for the 'touchstart' event, enables support for
	 * swipe and pinch gestures.
	 *
	 * @param {object} event
	 */
	function onTouchStart( event ) {

		if( isSwipePrevented( event.target ) ) return true;

		touch.startX = event.touches[0].clientX;
		touch.startY = event.touches[0].clientY;
		touch.startCount = event.touches.length;

		// If there's two touches we need to memorize the distance
		// between those two points to detect pinching
		if( event.touches.length === 2 && config.overview ) {
			touch.startSpan = distanceBetween( {
				x: event.touches[1].clientX,
				y: event.touches[1].clientY
			}, {
				x: touch.startX,
				y: touch.startY
			} );
		}

	}

	/**
	 * Handler for the 'touchmove' event.
	 *
	 * @param {object} event
	 */
	function onTouchMove( event ) {

		if( isSwipePrevented( event.target ) ) return true;

		// Each touch should only trigger one action
		if( !touch.captured ) {
			onUserInput( event );

			var currentX = event.touches[0].clientX;
			var currentY = event.touches[0].clientY;

			// If the touch started with two points and still has
			// two active touches; test for the pinch gesture
			if( event.touches.length === 2 && touch.startCount === 2 && config.overview ) {

				// The current distance in pixels between the two touch points
				var currentSpan = distanceBetween( {
					x: event.touches[1].clientX,
					y: event.touches[1].clientY
				}, {
					x: touch.startX,
					y: touch.startY
				} );

				// If the span is larger than the desire amount we've got
				// ourselves a pinch
				if( Math.abs( touch.startSpan - currentSpan ) > touch.threshold ) {
					touch.captured = true;

					if( currentSpan < touch.startSpan ) {
						activateOverview();
					}
					else {
						deactivateOverview();
					}
				}

				event.preventDefault();

			}
			// There was only one touch point, look for a swipe
			else if( event.touches.length === 1 && touch.startCount !== 2 ) {

				var deltaX = currentX - touch.startX,
					deltaY = currentY - touch.startY;

				if( deltaX > touch.threshold && Math.abs( deltaX ) > Math.abs( deltaY ) ) {
					touch.captured = true;
					navigateLeft();
				}
				else if( deltaX < -touch.threshold && Math.abs( deltaX ) > Math.abs( deltaY ) ) {
					touch.captured = true;
					navigateRight();
				}
				else if( deltaY > touch.threshold ) {
					touch.captured = true;
					navigateUp();
				}
				else if( deltaY < -touch.threshold ) {
					touch.captured = true;
					navigateDown();
				}

				// If we're embedded, only block touch events if they have
				// triggered an action
				if( config.embedded ) {
					if( touch.captured || isVerticalSlide( currentSlide ) ) {
						event.preventDefault();
					}
				}
				// Not embedded? Block them all to avoid needless tossing
				// around of the viewport in iOS
				else {
					event.preventDefault();
				}

			}
		}
		// There's a bug with swiping on some Android devices unless
		// the default action is always prevented
		else if( UA.match( /android/gi ) ) {
			event.preventDefault();
		}

	}

	/**
	 * Handler for the 'touchend' event.
	 *
	 * @param {object} event
	 */
	function onTouchEnd( event ) {

		touch.captured = false;

	}

	/**
	 * Convert pointer down to touch start.
	 *
	 * @param {object} event
	 */
	function onPointerDown( event ) {

		if( event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch" ) {
			event.touches = [{ clientX: event.clientX, clientY: event.clientY }];
			onTouchStart( event );
		}

	}

	/**
	 * Convert pointer move to touch move.
	 *
	 * @param {object} event
	 */
	function onPointerMove( event ) {

		if( event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch" )  {
			event.touches = [{ clientX: event.clientX, clientY: event.clientY }];
			onTouchMove( event );
		}

	}

	/**
	 * Convert pointer up to touch end.
	 *
	 * @param {object} event
	 */
	function onPointerUp( event ) {

		if( event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch" )  {
			event.touches = [{ clientX: event.clientX, clientY: event.clientY }];
			onTouchEnd( event );
		}

	}

	/**
	 * Handles mouse wheel scrolling, throttled to avoid skipping
	 * multiple slides.
	 *
	 * @param {object} event
	 */
	function onDocumentMouseScroll( event ) {

		if( Date.now() - lastMouseWheelStep > 600 ) {

			lastMouseWheelStep = Date.now();

			var delta = event.detail || -event.wheelDelta;
			if( delta > 0 ) {
				navigateNext();
			}
			else if( delta < 0 ) {
				navigatePrev();
			}

		}

	}

	/**
	 * Clicking on the progress bar results in a navigation to the
	 * closest approximate horizontal slide using this equation:
	 *
	 * ( clickX / presentationWidth ) * numberOfSlides
	 *
	 * @param {object} event
	 */
	function onProgressClicked( event ) {

		onUserInput( event );

		event.preventDefault();

		var slidesTotal = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) ).length;
		var slideIndex = Math.floor( ( event.clientX / dom.wrapper.offsetWidth ) * slidesTotal );

		if( config.rtl ) {
			slideIndex = slidesTotal - slideIndex;
		}

		slide( slideIndex );

	}

	/**
	 * Event handler for navigation control buttons.
	 */
	function onNavigateLeftClicked( event ) { event.preventDefault(); onUserInput(); navigateLeft(); }
	function onNavigateRightClicked( event ) { event.preventDefault(); onUserInput(); navigateRight(); }
	function onNavigateUpClicked( event ) { event.preventDefault(); onUserInput(); navigateUp(); }
	function onNavigateDownClicked( event ) { event.preventDefault(); onUserInput(); navigateDown(); }
	function onNavigatePrevClicked( event ) { event.preventDefault(); onUserInput(); navigatePrev(); }
	function onNavigateNextClicked( event ) { event.preventDefault(); onUserInput(); navigateNext(); }

	/**
	 * Handler for the window level 'hashchange' event.
	 *
	 * @param {object} [event]
	 */
	function onWindowHashChange( event ) {

		readURL();

	}

	/**
	 * Handler for the window level 'resize' event.
	 *
	 * @param {object} [event]
	 */
	function onWindowResize( event ) {

		layout();

	}

	/**
	 * Handle for the window level 'visibilitychange' event.
	 *
	 * @param {object} [event]
	 */
	function onPageVisibilityChange( event ) {

		var isHidden =  document.webkitHidden ||
						document.msHidden ||
						document.hidden;

		// If, after clicking a link or similar and we're coming back,
		// focus the document.body to ensure we can use keyboard shortcuts
		if( isHidden === false && document.activeElement !== document.body ) {
			// Not all elements support .blur() - SVGs among them.
			if( typeof document.activeElement.blur === 'function' ) {
				document.activeElement.blur();
			}
			document.body.focus();
		}

	}

	/**
	 * Invoked when a slide is and we're in the overview.
	 *
	 * @param {object} event
	 */
	function onOverviewSlideClicked( event ) {

		// TODO There's a bug here where the event listeners are not
		// removed after deactivating the overview.
		if( eventsAreBound && isOverview() ) {
			event.preventDefault();

			var element = event.target;

			while( element && !element.nodeName.match( /section/gi ) ) {
				element = element.parentNode;
			}

			if( element && !element.classList.contains( 'disabled' ) ) {

				deactivateOverview();

				if( element.nodeName.match( /section/gi ) ) {
					var h = parseInt( element.getAttribute( 'data-index-h' ), 10 ),
						v = parseInt( element.getAttribute( 'data-index-v' ), 10 );

					slide( h, v );
				}

			}
		}

	}

	/**
	 * Handles clicks on links that are set to preview in the
	 * iframe overlay.
	 *
	 * @param {object} event
	 */
	function onPreviewLinkClicked( event ) {

		if( event.currentTarget && event.currentTarget.hasAttribute( 'href' ) ) {
			var url = event.currentTarget.getAttribute( 'href' );
			if( url ) {
				showPreview( url );
				event.preventDefault();
			}
		}

	}

	/**
	 * Handles click on the auto-sliding controls element.
	 *
	 * @param {object} [event]
	 */
	function onAutoSlidePlayerClick( event ) {

		// Replay
		if( Reveal.isLastSlide() && config.loop === false ) {
			slide( 0, 0 );
			resumeAutoSlide();
		}
		// Resume
		else if( autoSlidePaused ) {
			resumeAutoSlide();
		}
		// Pause
		else {
			pauseAutoSlide();
		}

	}


	// --------------------------------------------------------------------//
	// ------------------------ PLAYBACK COMPONENT ------------------------//
	// --------------------------------------------------------------------//


	/**
	 * Constructor for the playback component, which displays
	 * play/pause/progress controls.
	 *
	 * @param {HTMLElement} container The component will append
	 * itself to this
	 * @param {function} progressCheck A method which will be
	 * called frequently to get the current progress on a range
	 * of 0-1
	 */
	function Playback( container, progressCheck ) {

		// Cosmetics
		this.diameter = 100;
		this.diameter2 = this.diameter/2;
		this.thickness = 6;

		// Flags if we are currently playing
		this.playing = false;

		// Current progress on a 0-1 range
		this.progress = 0;

		// Used to loop the animation smoothly
		this.progressOffset = 1;

		this.container = container;
		this.progressCheck = progressCheck;

		this.canvas = document.createElement( 'canvas' );
		this.canvas.className = 'playback';
		this.canvas.width = this.diameter;
		this.canvas.height = this.diameter;
		this.canvas.style.width = this.diameter2 + 'px';
		this.canvas.style.height = this.diameter2 + 'px';
		this.context = this.canvas.getContext( '2d' );

		this.container.appendChild( this.canvas );

		this.render();

	}

	/**
	 * @param value
	 */
	Playback.prototype.setPlaying = function( value ) {

		var wasPlaying = this.playing;

		this.playing = value;

		// Start repainting if we weren't already
		if( !wasPlaying && this.playing ) {
			this.animate();
		}
		else {
			this.render();
		}

	};

	Playback.prototype.animate = function() {

		var progressBefore = this.progress;

		this.progress = this.progressCheck();

		// When we loop, offset the progress so that it eases
		// smoothly rather than immediately resetting
		if( progressBefore > 0.8 && this.progress < 0.2 ) {
			this.progressOffset = this.progress;
		}

		this.render();

		if( this.playing ) {
			features.requestAnimationFrameMethod.call( window, this.animate.bind( this ) );
		}

	};

	/**
	 * Renders the current progress and playback state.
	 */
	Playback.prototype.render = function() {

		var progress = this.playing ? this.progress : 0,
			radius = ( this.diameter2 ) - this.thickness,
			x = this.diameter2,
			y = this.diameter2,
			iconSize = 28;

		// Ease towards 1
		this.progressOffset += ( 1 - this.progressOffset ) * 0.1;

		var endAngle = ( - Math.PI / 2 ) + ( progress * ( Math.PI * 2 ) );
		var startAngle = ( - Math.PI / 2 ) + ( this.progressOffset * ( Math.PI * 2 ) );

		this.context.save();
		this.context.clearRect( 0, 0, this.diameter, this.diameter );

		// Solid background color
		this.context.beginPath();
		this.context.arc( x, y, radius + 4, 0, Math.PI * 2, false );
		this.context.fillStyle = 'rgba( 0, 0, 0, 0.4 )';
		this.context.fill();

		// Draw progress track
		this.context.beginPath();
		this.context.arc( x, y, radius, 0, Math.PI * 2, false );
		this.context.lineWidth = this.thickness;
		this.context.strokeStyle = '#666';
		this.context.stroke();

		if( this.playing ) {
			// Draw progress on top of track
			this.context.beginPath();
			this.context.arc( x, y, radius, startAngle, endAngle, false );
			this.context.lineWidth = this.thickness;
			this.context.strokeStyle = '#fff';
			this.context.stroke();
		}

		this.context.translate( x - ( iconSize / 2 ), y - ( iconSize / 2 ) );

		// Draw play/pause icons
		if( this.playing ) {
			this.context.fillStyle = '#fff';
			this.context.fillRect( 0, 0, iconSize / 2 - 4, iconSize );
			this.context.fillRect( iconSize / 2 + 4, 0, iconSize / 2 - 4, iconSize );
		}
		else {
			this.context.beginPath();
			this.context.translate( 4, 0 );
			this.context.moveTo( 0, 0 );
			this.context.lineTo( iconSize - 4, iconSize / 2 );
			this.context.lineTo( 0, iconSize );
			this.context.fillStyle = '#fff';
			this.context.fill();
		}

		this.context.restore();

	};

	Playback.prototype.on = function( type, listener ) {
		this.canvas.addEventListener( type, listener, false );
	};

	Playback.prototype.off = function( type, listener ) {
		this.canvas.removeEventListener( type, listener, false );
	};

	Playback.prototype.destroy = function() {

		this.playing = false;

		if( this.canvas.parentNode ) {
			this.container.removeChild( this.canvas );
		}

	};


	// --------------------------------------------------------------------//
	// ------------------------------- API --------------------------------//
	// --------------------------------------------------------------------//


	Reveal = {
		VERSION: VERSION,

		initialize: initialize,
		configure: configure,
		sync: sync,

		// Navigation methods
		slide: slide,
		left: navigateLeft,
		right: navigateRight,
		up: navigateUp,
		down: navigateDown,
		prev: navigatePrev,
		next: navigateNext,

		// Fragment methods
		navigateFragment: navigateFragment,
		prevFragment: previousFragment,
		nextFragment: nextFragment,

		// Deprecated aliases
		navigateTo: slide,
		navigateLeft: navigateLeft,
		navigateRight: navigateRight,
		navigateUp: navigateUp,
		navigateDown: navigateDown,
		navigatePrev: navigatePrev,
		navigateNext: navigateNext,

		// Shows a help overlay with keyboard shortcuts
		showHelp: showHelp,

		// Forces an update in slide layout
		layout: layout,

		// Randomizes the order of slides
		shuffle: shuffle,

		// Returns an object with the available routes as booleans (left/right/top/bottom)
		availableRoutes: availableRoutes,

		// Returns an object with the available fragments as booleans (prev/next)
		availableFragments: availableFragments,

		// Toggles the overview mode on/off
		toggleOverview: toggleOverview,

		// Toggles the "black screen" mode on/off
		togglePause: togglePause,

		// Toggles the auto slide mode on/off
		toggleAutoSlide: toggleAutoSlide,

		// State checks
		isOverview: isOverview,
		isPaused: isPaused,
		isAutoSliding: isAutoSliding,

		// Adds or removes all internal event listeners (such as keyboard)
		addEventListeners: addEventListeners,
		removeEventListeners: removeEventListeners,

		// Facility for persisting and restoring the presentation state
		getState: getState,
		setState: setState,

		// Presentation progress on range of 0-1
		getProgress: getProgress,

		// Returns the indices of the current, or specified, slide
		getIndices: getIndices,

		getTotalSlides: getTotalSlides,

		// Returns the slide element at the specified index
		getSlide: getSlide,

		// Returns the slide background element at the specified index
		getSlideBackground: getSlideBackground,

		// Returns the speaker notes string for a slide, or null
		getSlideNotes: getSlideNotes,

		// Returns the previous slide element, may be null
		getPreviousSlide: function() {
			return previousSlide;
		},

		// Returns the current slide element
		getCurrentSlide: function() {
			return currentSlide;
		},

		// Returns the current scale of the presentation content
		getScale: function() {
			return scale;
		},

		// Returns the current configuration object
		getConfig: function() {
			return config;
		},

		// Helper method, retrieves query string as a key/value hash
		getQueryHash: function() {
			var query = {};

			location.search.replace( /[A-Z0-9]+?=([\w\.%-]*)/gi, function(a) {
				query[ a.split( '=' ).shift() ] = a.split( '=' ).pop();
			} );

			// Basic deserialization
			for( var i in query ) {
				var value = query[ i ];

				query[ i ] = deserialize( unescape( value ) );
			}

			return query;
		},

		// Returns true if we're currently on the first slide
		isFirstSlide: function() {
			return ( indexh === 0 && indexv === 0 );
		},

		// Returns true if we're currently on the last slide
		isLastSlide: function() {
			if( currentSlide ) {
				// Does this slide has next a sibling?
				if( currentSlide.nextElementSibling ) return false;

				// If it's vertical, does its parent have a next sibling?
				if( isVerticalSlide( currentSlide ) && currentSlide.parentNode.nextElementSibling ) return false;

				return true;
			}

			return false;
		},

		// Checks if reveal.js has been loaded and is ready for use
		isReady: function() {
			return loaded;
		},

		// Forward event binding to the reveal DOM element
		addEventListener: function( type, listener, useCapture ) {
			if( 'addEventListener' in window ) {
				( dom.wrapper || document.querySelector( '.reveal' ) ).addEventListener( type, listener, useCapture );
			}
		},
		removeEventListener: function( type, listener, useCapture ) {
			if( 'addEventListener' in window ) {
				( dom.wrapper || document.querySelector( '.reveal' ) ).removeEventListener( type, listener, useCapture );
			}
		},

		// Programatically triggers a keyboard event
		triggerKey: function( keyCode ) {
			onDocumentKeyDown( { keyCode: keyCode } );
		},

		// Registers a new shortcut to include in the help overlay
		registerKeyboardShortcut: function( key, value ) {
			keyboardShortcuts[key] = value;
		}
	};

	return Reveal;

}));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./pres.less", function() {
			var newContent = require("!!./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./pres.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(10);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../css-loader/index.js!./reveal.css", function() {
			var newContent = require("!!../../css-loader/index.js!./reveal.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../css-loader/index.js!./sky.css", function() {
			var newContent = require("!!../../../css-loader/index.js!./sky.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(12);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../css-loader/index.js!./zenburn.css", function() {
			var newContent = require("!!../../../css-loader/index.js!./zenburn.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Inconsolata|Lato:400,400i,700,700i&subset=latin-ext);", ""]);

// module
exports.push([module.i, "/* Generic styling. */\n.reveal {\n  font-family: Lato, sans-serif;\n  font-size: 8vh;\n  /* Background styles. */\n  /* Support a \"translucent\" background that puts the default gradient over the\n   * top. */\n  /* Slides with specific background images have their opacity crunched down. */\n  /* Slide specific styles. */\n}\n.reveal h1,\n.reveal h2,\n.reveal h3,\n.reveal h4,\n.reveal h5,\n.reveal h6 {\n  font-family: Lato, sans-serif;\n  letter-spacing: 0;\n  text-transform: none;\n}\n.reveal h1 {\n  font-size: 18vh;\n}\n.reveal h2 {\n  font-size: 12vh;\n}\n.reveal h3 {\n  font-size: 10vh;\n}\n.reveal code {\n  font-family: Inconsolata, monospace;\n}\n.reveal pre code {\n  font-size: 7vh;\n  line-height: 1.4;\n  max-height: 40em;\n}\n.reveal a {\n  color: #24396b;\n}\n.reveal ul {\n  list-style: none;\n  margin-left: 0;\n}\n.reveal img {\n  max-height: 90vh;\n  background: transparent !important;\n  border: 0 !important;\n  box-shadow: none !important;\n}\n.reveal img.fill {\n  height: 90vh;\n}\n.reveal img.inline,\n.reveal a:hover img.inline {\n  background: transparent;\n  box-shadow: none;\n  border: 0;\n  width: 1em;\n  display: inline-block;\n  vertical-align: bottom;\n}\n.reveal a:hover img.inline {\n  opacity: 0.5;\n}\n.reveal img.logo,\n.reveal a:hover img.logo {\n  background: transparent;\n  box-shadow: none;\n  border: 0;\n}\n.reveal a:hover img.logo {\n  opacity: 0.5;\n}\n.reveal .todo {\n  color: red !important;\n  font-weight: bold !important;\n  font-family: \"Comic Sans MS\", inherit !important;\n  font-size: 10vw !important;\n  text-decoration: blink !important;\n}\n.reveal .todo:before {\n  content: \"TODO: \";\n}\n.reveal .backgrounds div[data-background-hash^=\"translucent\"].slide-background.present {\n  opacity: 0.85;\n  background: -moz-radial-gradient(center, circle cover, #f7fbfc 0%, #add9e4 100%);\n  background: -webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%, #f7fbfc), color-stop(100%, #add9e4));\n  background: -webkit-radial-gradient(center, circle cover, #f7fbfc 0%, #add9e4 100%);\n  background: -o-radial-gradient(center, circle cover, #f7fbfc 0%, #add9e4 100%);\n  background: -ms-radial-gradient(center, circle cover, #f7fbfc 0%, #add9e4 100%);\n  background: radial-gradient(center, circle cover, #f7fbfc 0%, #add9e4 100%);\n  background-color: #f7fbfc;\n}\n.reveal .backgrounds .stack div[style*=\"background-image\"].slide-background.present {\n  opacity: 0.15;\n}\n.reveal .backgrounds .stack div[style*=\"background-image\"].slide-background.present:not([data-background-hash*=\"translucent\"]) {\n  opacity: 1;\n}\n.reveal .slides section:first-child section:first-child {\n  /* Crystal ball, shamelessly nicked from https://cssanimation.rocks/spheres/ */\n}\n.reveal .slides section:first-child section:first-child .php {\n  display: inline-block;\n  width: 50%;\n  height: 50%;\n  left: 25%;\n  top: 25%;\n  position: absolute;\n  background-image: url(" + __webpack_require__(14) + ");\n  background-size: contain;\n  background-repeat: no-repeat;\n  background-position: 50% 50%;\n  animation: crystal-ball infinite 300s;\n}\n@keyframes crystal-ball {\n  0% {\n    width: 50%;\n    height: 50%;\n    left: 25%;\n    top: 25%;\n  }\n  10% {\n    width: 60%;\n    height: 50%;\n    left: 25%;\n    top: 15%;\n    transform: scale(1.4, 1);\n  }\n  20% {\n    width: 50%;\n    height: 50%;\n    left: 15%;\n    top: 15%;\n    transform: rotateY(20deg);\n  }\n  40% {\n    width: 50%;\n    height: 50%;\n    left: 15%;\n    top: 25%;\n    transform: rotateY(-10deg) rotateX(5deg);\n  }\n  45% {\n    width: 40%;\n    height: 50%;\n    left: 35%;\n    top: 30%;\n    transform: none;\n  }\n  60% {\n    width: 50%;\n    height: 50%;\n    left: 35%;\n    top: 25%;\n    transform: rotateY(-5deg) rotateZ(5deg);\n  }\n  80% {\n    width: 70%;\n    height: 70%;\n    left: 15%;\n    top: 15%;\n  }\n  100% {\n    width: 50%;\n    height: 50%;\n    left: 25%;\n    top: 25%;\n  }\n}\n.reveal .slides section:first-child section:first-child .ball {\n  display: inline-block;\n  width: 100%;\n  height: 100%;\n  border-radius: 100%;\n  position: relative;\n  background: radial-gradient(circle at bottom, #81e8f6, #76deef 10%, #055194 80%, #062745 100%);\n}\n.reveal .slides section:first-child section:first-child .ball:before {\n  content: \"\";\n  position: absolute;\n  top: 1%;\n  left: 5%;\n  width: 90%;\n  height: 90%;\n  border-radius: 100%;\n  background: radial-gradient(circle at top, white, rgba(255, 255, 255, 0) 58%);\n  -webkit-filter: blur(5px);\n  filter: blur(5px);\n  z-index: 2;\n}\n.reveal .slides section:first-child section:first-child .ball:after {\n  content: \"\";\n  position: absolute;\n  display: none;\n  top: 5%;\n  left: 10%;\n  width: 80%;\n  height: 80%;\n  border-radius: 100%;\n  -webkit-filter: blur(1px);\n  filter: blur(1px);\n  z-index: 2;\n  -webkit-transform: rotateZ(-30deg);\n  transform: rotateZ(-30deg);\n}\n.reveal .slides section:first-child section:first-child .ball .shadow {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background: radial-gradient(circle, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0) 50%);\n  -webkit-transform: rotateX(90deg) translateZ(-160px);\n  transform: rotateX(90deg) translateZ(-160px);\n  z-index: 1;\n}\n.reveal .slides section:first-child section:first-child .ball.plain {\n  background: black;\n}\n.reveal .slides section:first-child section:first-child .ball.plain:before,\n.reveal .slides section:first-child section:first-child .ball.plain:after {\n  display: none;\n}\n.reveal .slides section:first-child section:first-child .ball.bubble {\n  background: radial-gradient(circle at 50% 55%, rgba(240, 245, 255, 0.9), rgba(240, 245, 255, 0.9) 40%, rgba(225, 238, 255, 0.8) 60%, rgba(43, 130, 255, 0.4));\n}\n.reveal .slides section:first-child section:first-child .ball.bubble:before {\n  -webkit-filter: blur(0);\n  filter: blur(0);\n  height: 80%;\n  width: 40%;\n  background: radial-gradient(circle at 130% 130%, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0) 46%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0.8) 58%, rgba(255, 255, 255, 0) 60%, rgba(255, 255, 255, 0) 100%);\n  -webkit-transform: translateX(131%) translateY(58%) rotateZ(168deg) rotateX(10deg);\n  transform: translateX(131%) translateY(58%) rotateZ(168deg) rotateX(10deg);\n}\n.reveal .slides section:first-child section:first-child .ball.bubble:after {\n  display: block;\n  background: radial-gradient(circle at 50% 80%, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0) 74%, white 80%, white 84%, rgba(255, 255, 255, 0) 100%);\n}\n.reveal .slides section:first-child section:first-child .stage {\n  width: 60vh;\n  height: 60vh;\n  display: inline-block;\n  margin-bottom: 10vh;\n  -webkit-perspective: 1200px;\n  -moz-perspective: 1200px;\n  -ms-perspective: 1200px;\n  -o-perspective: 1200px;\n  perspective: 1200px;\n  -webkit-perspective-origin: 50% 50%;\n  -moz-perspective-origin: 50% 50%;\n  -ms-perspective-origin: 50% 50%;\n  -o-perspective-origin: 50% 50%;\n  perspective-origin: 50% 50%;\n}\n/* vim: set nocin ai et ts=2 sw=2: */\n", ""]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "/*!\n * reveal.js\n * http://lab.hakim.se/reveal-js\n * MIT licensed\n *\n * Copyright (C) 2016 Hakim El Hattab, http://hakim.se\n */\n/*********************************************\n * RESET STYLES\n *********************************************/\nhtml, body, .reveal div, .reveal span, .reveal applet, .reveal object, .reveal iframe,\n.reveal h1, .reveal h2, .reveal h3, .reveal h4, .reveal h5, .reveal h6, .reveal p, .reveal blockquote, .reveal pre,\n.reveal a, .reveal abbr, .reveal acronym, .reveal address, .reveal big, .reveal cite, .reveal code,\n.reveal del, .reveal dfn, .reveal em, .reveal img, .reveal ins, .reveal kbd, .reveal q, .reveal s, .reveal samp,\n.reveal small, .reveal strike, .reveal strong, .reveal sub, .reveal sup, .reveal tt, .reveal var,\n.reveal b, .reveal u, .reveal center,\n.reveal dl, .reveal dt, .reveal dd, .reveal ol, .reveal ul, .reveal li,\n.reveal fieldset, .reveal form, .reveal label, .reveal legend,\n.reveal table, .reveal caption, .reveal tbody, .reveal tfoot, .reveal thead, .reveal tr, .reveal th, .reveal td,\n.reveal article, .reveal aside, .reveal canvas, .reveal details, .reveal embed,\n.reveal figure, .reveal figcaption, .reveal footer, .reveal header, .reveal hgroup,\n.reveal menu, .reveal nav, .reveal output, .reveal ruby, .reveal section, .reveal summary,\n.reveal time, .reveal mark, .reveal audio, .reveal video {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font-size: 100%;\n  font: inherit;\n  vertical-align: baseline; }\n\n.reveal article, .reveal aside, .reveal details, .reveal figcaption, .reveal figure,\n.reveal footer, .reveal header, .reveal hgroup, .reveal menu, .reveal nav, .reveal section {\n  display: block; }\n\n/*********************************************\n * GLOBAL STYLES\n *********************************************/\nhtml,\nbody {\n  width: 100%;\n  height: 100%;\n  overflow: hidden; }\n\nbody {\n  position: relative;\n  line-height: 1;\n  background-color: #fff;\n  color: #000; }\n\n/*********************************************\n * VIEW FRAGMENTS\n *********************************************/\n.reveal .slides section .fragment {\n  opacity: 0;\n  visibility: hidden;\n  -webkit-transition: all .2s ease;\n          transition: all .2s ease; }\n  .reveal .slides section .fragment.visible {\n    opacity: 1;\n    visibility: inherit; }\n\n.reveal .slides section .fragment.grow {\n  opacity: 1;\n  visibility: inherit; }\n  .reveal .slides section .fragment.grow.visible {\n    -webkit-transform: scale(1.3);\n            transform: scale(1.3); }\n\n.reveal .slides section .fragment.shrink {\n  opacity: 1;\n  visibility: inherit; }\n  .reveal .slides section .fragment.shrink.visible {\n    -webkit-transform: scale(0.7);\n            transform: scale(0.7); }\n\n.reveal .slides section .fragment.zoom-in {\n  -webkit-transform: scale(0.1);\n          transform: scale(0.1); }\n  .reveal .slides section .fragment.zoom-in.visible {\n    -webkit-transform: none;\n            transform: none; }\n\n.reveal .slides section .fragment.fade-out {\n  opacity: 1;\n  visibility: inherit; }\n  .reveal .slides section .fragment.fade-out.visible {\n    opacity: 0;\n    visibility: hidden; }\n\n.reveal .slides section .fragment.semi-fade-out {\n  opacity: 1;\n  visibility: inherit; }\n  .reveal .slides section .fragment.semi-fade-out.visible {\n    opacity: 0.5;\n    visibility: inherit; }\n\n.reveal .slides section .fragment.strike {\n  opacity: 1;\n  visibility: inherit; }\n  .reveal .slides section .fragment.strike.visible {\n    text-decoration: line-through; }\n\n.reveal .slides section .fragment.fade-up {\n  -webkit-transform: translate(0, 20%);\n          transform: translate(0, 20%); }\n  .reveal .slides section .fragment.fade-up.visible {\n    -webkit-transform: translate(0, 0);\n            transform: translate(0, 0); }\n\n.reveal .slides section .fragment.fade-down {\n  -webkit-transform: translate(0, -20%);\n          transform: translate(0, -20%); }\n  .reveal .slides section .fragment.fade-down.visible {\n    -webkit-transform: translate(0, 0);\n            transform: translate(0, 0); }\n\n.reveal .slides section .fragment.fade-right {\n  -webkit-transform: translate(-20%, 0);\n          transform: translate(-20%, 0); }\n  .reveal .slides section .fragment.fade-right.visible {\n    -webkit-transform: translate(0, 0);\n            transform: translate(0, 0); }\n\n.reveal .slides section .fragment.fade-left {\n  -webkit-transform: translate(20%, 0);\n          transform: translate(20%, 0); }\n  .reveal .slides section .fragment.fade-left.visible {\n    -webkit-transform: translate(0, 0);\n            transform: translate(0, 0); }\n\n.reveal .slides section .fragment.current-visible {\n  opacity: 0;\n  visibility: hidden; }\n  .reveal .slides section .fragment.current-visible.current-fragment {\n    opacity: 1;\n    visibility: inherit; }\n\n.reveal .slides section .fragment.highlight-red,\n.reveal .slides section .fragment.highlight-current-red,\n.reveal .slides section .fragment.highlight-green,\n.reveal .slides section .fragment.highlight-current-green,\n.reveal .slides section .fragment.highlight-blue,\n.reveal .slides section .fragment.highlight-current-blue {\n  opacity: 1;\n  visibility: inherit; }\n\n.reveal .slides section .fragment.highlight-red.visible {\n  color: #ff2c2d; }\n\n.reveal .slides section .fragment.highlight-green.visible {\n  color: #17ff2e; }\n\n.reveal .slides section .fragment.highlight-blue.visible {\n  color: #1b91ff; }\n\n.reveal .slides section .fragment.highlight-current-red.current-fragment {\n  color: #ff2c2d; }\n\n.reveal .slides section .fragment.highlight-current-green.current-fragment {\n  color: #17ff2e; }\n\n.reveal .slides section .fragment.highlight-current-blue.current-fragment {\n  color: #1b91ff; }\n\n/*********************************************\n * DEFAULT ELEMENT STYLES\n *********************************************/\n/* Fixes issue in Chrome where italic fonts did not appear when printing to PDF */\n.reveal:after {\n  content: '';\n  font-style: italic; }\n\n.reveal iframe {\n  z-index: 1; }\n\n/** Prevents layering issues in certain browser/transition combinations */\n.reveal a {\n  position: relative; }\n\n.reveal .stretch {\n  max-width: none;\n  max-height: none; }\n\n.reveal pre.stretch code {\n  height: 100%;\n  max-height: 100%;\n  box-sizing: border-box; }\n\n/*********************************************\n * CONTROLS\n *********************************************/\n.reveal .controls {\n  display: none;\n  position: fixed;\n  width: 110px;\n  height: 110px;\n  z-index: 30;\n  right: 10px;\n  bottom: 10px;\n  -webkit-user-select: none; }\n\n.reveal .controls button {\n  padding: 0;\n  position: absolute;\n  opacity: 0.05;\n  width: 0;\n  height: 0;\n  background-color: transparent;\n  border: 12px solid transparent;\n  -webkit-transform: scale(0.9999);\n          transform: scale(0.9999);\n  -webkit-transition: all 0.2s ease;\n          transition: all 0.2s ease;\n  -webkit-appearance: none;\n  -webkit-tap-highlight-color: transparent; }\n\n.reveal .controls .enabled {\n  opacity: 0.7;\n  cursor: pointer; }\n\n.reveal .controls .enabled:active {\n  margin-top: 1px; }\n\n.reveal .controls .navigate-left {\n  top: 42px;\n  border-right-width: 22px;\n  border-right-color: #000; }\n\n.reveal .controls .navigate-left.fragmented {\n  opacity: 0.3; }\n\n.reveal .controls .navigate-right {\n  left: 74px;\n  top: 42px;\n  border-left-width: 22px;\n  border-left-color: #000; }\n\n.reveal .controls .navigate-right.fragmented {\n  opacity: 0.3; }\n\n.reveal .controls .navigate-up {\n  left: 42px;\n  border-bottom-width: 22px;\n  border-bottom-color: #000; }\n\n.reveal .controls .navigate-up.fragmented {\n  opacity: 0.3; }\n\n.reveal .controls .navigate-down {\n  left: 42px;\n  top: 74px;\n  border-top-width: 22px;\n  border-top-color: #000; }\n\n.reveal .controls .navigate-down.fragmented {\n  opacity: 0.3; }\n\n/*********************************************\n * PROGRESS BAR\n *********************************************/\n.reveal .progress {\n  position: fixed;\n  display: none;\n  height: 3px;\n  width: 100%;\n  bottom: 0;\n  left: 0;\n  z-index: 10;\n  background-color: rgba(0, 0, 0, 0.2); }\n\n.reveal .progress:after {\n  content: '';\n  display: block;\n  position: absolute;\n  height: 20px;\n  width: 100%;\n  top: -20px; }\n\n.reveal .progress span {\n  display: block;\n  height: 100%;\n  width: 0px;\n  background-color: #000;\n  -webkit-transition: width 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985);\n          transition: width 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985); }\n\n/*********************************************\n * SLIDE NUMBER\n *********************************************/\n.reveal .slide-number {\n  position: fixed;\n  display: block;\n  right: 8px;\n  bottom: 8px;\n  z-index: 31;\n  font-family: Helvetica, sans-serif;\n  font-size: 12px;\n  line-height: 1;\n  color: #fff;\n  background-color: rgba(0, 0, 0, 0.4);\n  padding: 5px; }\n\n.reveal .slide-number-delimiter {\n  margin: 0 3px; }\n\n/*********************************************\n * SLIDES\n *********************************************/\n.reveal {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  -ms-touch-action: none;\n      touch-action: none; }\n\n.reveal .slides {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  overflow: visible;\n  z-index: 1;\n  text-align: center;\n  -webkit-perspective: 600px;\n          perspective: 600px;\n  -webkit-perspective-origin: 50% 40%;\n          perspective-origin: 50% 40%; }\n\n.reveal .slides > section {\n  -ms-perspective: 600px; }\n\n.reveal .slides > section,\n.reveal .slides > section > section {\n  display: none;\n  position: absolute;\n  width: 100%;\n  padding: 20px 0px;\n  z-index: 10;\n  -webkit-transform-style: flat;\n          transform-style: flat;\n  -webkit-transition: -webkit-transform-origin 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985), -webkit-transform 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985), visibility 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985), opacity 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985);\n          transition: transform-origin 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985), transform 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985), visibility 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985), opacity 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985); }\n\n/* Global transition speed settings */\n.reveal[data-transition-speed=\"fast\"] .slides section {\n  -webkit-transition-duration: 400ms;\n          transition-duration: 400ms; }\n\n.reveal[data-transition-speed=\"slow\"] .slides section {\n  -webkit-transition-duration: 1200ms;\n          transition-duration: 1200ms; }\n\n/* Slide-specific transition speed overrides */\n.reveal .slides section[data-transition-speed=\"fast\"] {\n  -webkit-transition-duration: 400ms;\n          transition-duration: 400ms; }\n\n.reveal .slides section[data-transition-speed=\"slow\"] {\n  -webkit-transition-duration: 1200ms;\n          transition-duration: 1200ms; }\n\n.reveal .slides > section.stack {\n  padding-top: 0;\n  padding-bottom: 0; }\n\n.reveal .slides > section.present,\n.reveal .slides > section > section.present {\n  display: block;\n  z-index: 11;\n  opacity: 1; }\n\n.reveal.center,\n.reveal.center .slides,\n.reveal.center .slides section {\n  min-height: 0 !important; }\n\n/* Don't allow interaction with invisible slides */\n.reveal .slides > section.future,\n.reveal .slides > section > section.future,\n.reveal .slides > section.past,\n.reveal .slides > section > section.past {\n  pointer-events: none; }\n\n.reveal.overview .slides > section,\n.reveal.overview .slides > section > section {\n  pointer-events: auto; }\n\n.reveal .slides > section.past,\n.reveal .slides > section.future,\n.reveal .slides > section > section.past,\n.reveal .slides > section > section.future {\n  opacity: 0; }\n\n/*********************************************\n * Mixins for readability of transitions\n *********************************************/\n/*********************************************\n * SLIDE TRANSITION\n * Aliased 'linear' for backwards compatibility\n *********************************************/\n.reveal.slide section {\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden; }\n\n.reveal .slides > section[data-transition=slide].past,\n.reveal .slides > section[data-transition~=slide-out].past,\n.reveal.slide .slides > section:not([data-transition]).past {\n  -webkit-transform: translate(-150%, 0);\n          transform: translate(-150%, 0); }\n\n.reveal .slides > section[data-transition=slide].future,\n.reveal .slides > section[data-transition~=slide-in].future,\n.reveal.slide .slides > section:not([data-transition]).future {\n  -webkit-transform: translate(150%, 0);\n          transform: translate(150%, 0); }\n\n.reveal .slides > section > section[data-transition=slide].past,\n.reveal .slides > section > section[data-transition~=slide-out].past,\n.reveal.slide .slides > section > section:not([data-transition]).past {\n  -webkit-transform: translate(0, -150%);\n          transform: translate(0, -150%); }\n\n.reveal .slides > section > section[data-transition=slide].future,\n.reveal .slides > section > section[data-transition~=slide-in].future,\n.reveal.slide .slides > section > section:not([data-transition]).future {\n  -webkit-transform: translate(0, 150%);\n          transform: translate(0, 150%); }\n\n.reveal.linear section {\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden; }\n\n.reveal .slides > section[data-transition=linear].past,\n.reveal .slides > section[data-transition~=linear-out].past,\n.reveal.linear .slides > section:not([data-transition]).past {\n  -webkit-transform: translate(-150%, 0);\n          transform: translate(-150%, 0); }\n\n.reveal .slides > section[data-transition=linear].future,\n.reveal .slides > section[data-transition~=linear-in].future,\n.reveal.linear .slides > section:not([data-transition]).future {\n  -webkit-transform: translate(150%, 0);\n          transform: translate(150%, 0); }\n\n.reveal .slides > section > section[data-transition=linear].past,\n.reveal .slides > section > section[data-transition~=linear-out].past,\n.reveal.linear .slides > section > section:not([data-transition]).past {\n  -webkit-transform: translate(0, -150%);\n          transform: translate(0, -150%); }\n\n.reveal .slides > section > section[data-transition=linear].future,\n.reveal .slides > section > section[data-transition~=linear-in].future,\n.reveal.linear .slides > section > section:not([data-transition]).future {\n  -webkit-transform: translate(0, 150%);\n          transform: translate(0, 150%); }\n\n/*********************************************\n * CONVEX TRANSITION\n * Aliased 'default' for backwards compatibility\n *********************************************/\n.reveal .slides section[data-transition=default].stack,\n.reveal.default .slides section.stack {\n  -webkit-transform-style: preserve-3d;\n          transform-style: preserve-3d; }\n\n.reveal .slides > section[data-transition=default].past,\n.reveal .slides > section[data-transition~=default-out].past,\n.reveal.default .slides > section:not([data-transition]).past {\n  -webkit-transform: translate3d(-100%, 0, 0) rotateY(-90deg) translate3d(-100%, 0, 0);\n          transform: translate3d(-100%, 0, 0) rotateY(-90deg) translate3d(-100%, 0, 0); }\n\n.reveal .slides > section[data-transition=default].future,\n.reveal .slides > section[data-transition~=default-in].future,\n.reveal.default .slides > section:not([data-transition]).future {\n  -webkit-transform: translate3d(100%, 0, 0) rotateY(90deg) translate3d(100%, 0, 0);\n          transform: translate3d(100%, 0, 0) rotateY(90deg) translate3d(100%, 0, 0); }\n\n.reveal .slides > section > section[data-transition=default].past,\n.reveal .slides > section > section[data-transition~=default-out].past,\n.reveal.default .slides > section > section:not([data-transition]).past {\n  -webkit-transform: translate3d(0, -300px, 0) rotateX(70deg) translate3d(0, -300px, 0);\n          transform: translate3d(0, -300px, 0) rotateX(70deg) translate3d(0, -300px, 0); }\n\n.reveal .slides > section > section[data-transition=default].future,\n.reveal .slides > section > section[data-transition~=default-in].future,\n.reveal.default .slides > section > section:not([data-transition]).future {\n  -webkit-transform: translate3d(0, 300px, 0) rotateX(-70deg) translate3d(0, 300px, 0);\n          transform: translate3d(0, 300px, 0) rotateX(-70deg) translate3d(0, 300px, 0); }\n\n.reveal .slides section[data-transition=convex].stack,\n.reveal.convex .slides section.stack {\n  -webkit-transform-style: preserve-3d;\n          transform-style: preserve-3d; }\n\n.reveal .slides > section[data-transition=convex].past,\n.reveal .slides > section[data-transition~=convex-out].past,\n.reveal.convex .slides > section:not([data-transition]).past {\n  -webkit-transform: translate3d(-100%, 0, 0) rotateY(-90deg) translate3d(-100%, 0, 0);\n          transform: translate3d(-100%, 0, 0) rotateY(-90deg) translate3d(-100%, 0, 0); }\n\n.reveal .slides > section[data-transition=convex].future,\n.reveal .slides > section[data-transition~=convex-in].future,\n.reveal.convex .slides > section:not([data-transition]).future {\n  -webkit-transform: translate3d(100%, 0, 0) rotateY(90deg) translate3d(100%, 0, 0);\n          transform: translate3d(100%, 0, 0) rotateY(90deg) translate3d(100%, 0, 0); }\n\n.reveal .slides > section > section[data-transition=convex].past,\n.reveal .slides > section > section[data-transition~=convex-out].past,\n.reveal.convex .slides > section > section:not([data-transition]).past {\n  -webkit-transform: translate3d(0, -300px, 0) rotateX(70deg) translate3d(0, -300px, 0);\n          transform: translate3d(0, -300px, 0) rotateX(70deg) translate3d(0, -300px, 0); }\n\n.reveal .slides > section > section[data-transition=convex].future,\n.reveal .slides > section > section[data-transition~=convex-in].future,\n.reveal.convex .slides > section > section:not([data-transition]).future {\n  -webkit-transform: translate3d(0, 300px, 0) rotateX(-70deg) translate3d(0, 300px, 0);\n          transform: translate3d(0, 300px, 0) rotateX(-70deg) translate3d(0, 300px, 0); }\n\n/*********************************************\n * CONCAVE TRANSITION\n *********************************************/\n.reveal .slides section[data-transition=concave].stack,\n.reveal.concave .slides section.stack {\n  -webkit-transform-style: preserve-3d;\n          transform-style: preserve-3d; }\n\n.reveal .slides > section[data-transition=concave].past,\n.reveal .slides > section[data-transition~=concave-out].past,\n.reveal.concave .slides > section:not([data-transition]).past {\n  -webkit-transform: translate3d(-100%, 0, 0) rotateY(90deg) translate3d(-100%, 0, 0);\n          transform: translate3d(-100%, 0, 0) rotateY(90deg) translate3d(-100%, 0, 0); }\n\n.reveal .slides > section[data-transition=concave].future,\n.reveal .slides > section[data-transition~=concave-in].future,\n.reveal.concave .slides > section:not([data-transition]).future {\n  -webkit-transform: translate3d(100%, 0, 0) rotateY(-90deg) translate3d(100%, 0, 0);\n          transform: translate3d(100%, 0, 0) rotateY(-90deg) translate3d(100%, 0, 0); }\n\n.reveal .slides > section > section[data-transition=concave].past,\n.reveal .slides > section > section[data-transition~=concave-out].past,\n.reveal.concave .slides > section > section:not([data-transition]).past {\n  -webkit-transform: translate3d(0, -80%, 0) rotateX(-70deg) translate3d(0, -80%, 0);\n          transform: translate3d(0, -80%, 0) rotateX(-70deg) translate3d(0, -80%, 0); }\n\n.reveal .slides > section > section[data-transition=concave].future,\n.reveal .slides > section > section[data-transition~=concave-in].future,\n.reveal.concave .slides > section > section:not([data-transition]).future {\n  -webkit-transform: translate3d(0, 80%, 0) rotateX(70deg) translate3d(0, 80%, 0);\n          transform: translate3d(0, 80%, 0) rotateX(70deg) translate3d(0, 80%, 0); }\n\n/*********************************************\n * ZOOM TRANSITION\n *********************************************/\n.reveal .slides section[data-transition=zoom],\n.reveal.zoom .slides section:not([data-transition]) {\n  -webkit-transition-timing-function: ease;\n          transition-timing-function: ease; }\n\n.reveal .slides > section[data-transition=zoom].past,\n.reveal .slides > section[data-transition~=zoom-out].past,\n.reveal.zoom .slides > section:not([data-transition]).past {\n  visibility: hidden;\n  -webkit-transform: scale(16);\n          transform: scale(16); }\n\n.reveal .slides > section[data-transition=zoom].future,\n.reveal .slides > section[data-transition~=zoom-in].future,\n.reveal.zoom .slides > section:not([data-transition]).future {\n  visibility: hidden;\n  -webkit-transform: scale(0.2);\n          transform: scale(0.2); }\n\n.reveal .slides > section > section[data-transition=zoom].past,\n.reveal .slides > section > section[data-transition~=zoom-out].past,\n.reveal.zoom .slides > section > section:not([data-transition]).past {\n  -webkit-transform: translate(0, -150%);\n          transform: translate(0, -150%); }\n\n.reveal .slides > section > section[data-transition=zoom].future,\n.reveal .slides > section > section[data-transition~=zoom-in].future,\n.reveal.zoom .slides > section > section:not([data-transition]).future {\n  -webkit-transform: translate(0, 150%);\n          transform: translate(0, 150%); }\n\n/*********************************************\n * CUBE TRANSITION\n *********************************************/\n.reveal.cube .slides {\n  -webkit-perspective: 1300px;\n          perspective: 1300px; }\n\n.reveal.cube .slides section {\n  padding: 30px;\n  min-height: 700px;\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden;\n  box-sizing: border-box;\n  -webkit-transform-style: preserve-3d;\n          transform-style: preserve-3d; }\n\n.reveal.center.cube .slides section {\n  min-height: 0; }\n\n.reveal.cube .slides section:not(.stack):before {\n  content: '';\n  position: absolute;\n  display: block;\n  width: 100%;\n  height: 100%;\n  left: 0;\n  top: 0;\n  background: rgba(0, 0, 0, 0.1);\n  border-radius: 4px;\n  -webkit-transform: translateZ(-20px);\n          transform: translateZ(-20px); }\n\n.reveal.cube .slides section:not(.stack):after {\n  content: '';\n  position: absolute;\n  display: block;\n  width: 90%;\n  height: 30px;\n  left: 5%;\n  bottom: 0;\n  background: none;\n  z-index: 1;\n  border-radius: 4px;\n  box-shadow: 0px 95px 25px rgba(0, 0, 0, 0.2);\n  -webkit-transform: translateZ(-90px) rotateX(65deg);\n          transform: translateZ(-90px) rotateX(65deg); }\n\n.reveal.cube .slides > section.stack {\n  padding: 0;\n  background: none; }\n\n.reveal.cube .slides > section.past {\n  -webkit-transform-origin: 100% 0%;\n          transform-origin: 100% 0%;\n  -webkit-transform: translate3d(-100%, 0, 0) rotateY(-90deg);\n          transform: translate3d(-100%, 0, 0) rotateY(-90deg); }\n\n.reveal.cube .slides > section.future {\n  -webkit-transform-origin: 0% 0%;\n          transform-origin: 0% 0%;\n  -webkit-transform: translate3d(100%, 0, 0) rotateY(90deg);\n          transform: translate3d(100%, 0, 0) rotateY(90deg); }\n\n.reveal.cube .slides > section > section.past {\n  -webkit-transform-origin: 0% 100%;\n          transform-origin: 0% 100%;\n  -webkit-transform: translate3d(0, -100%, 0) rotateX(90deg);\n          transform: translate3d(0, -100%, 0) rotateX(90deg); }\n\n.reveal.cube .slides > section > section.future {\n  -webkit-transform-origin: 0% 0%;\n          transform-origin: 0% 0%;\n  -webkit-transform: translate3d(0, 100%, 0) rotateX(-90deg);\n          transform: translate3d(0, 100%, 0) rotateX(-90deg); }\n\n/*********************************************\n * PAGE TRANSITION\n *********************************************/\n.reveal.page .slides {\n  -webkit-perspective-origin: 0% 50%;\n          perspective-origin: 0% 50%;\n  -webkit-perspective: 3000px;\n          perspective: 3000px; }\n\n.reveal.page .slides section {\n  padding: 30px;\n  min-height: 700px;\n  box-sizing: border-box;\n  -webkit-transform-style: preserve-3d;\n          transform-style: preserve-3d; }\n\n.reveal.page .slides section.past {\n  z-index: 12; }\n\n.reveal.page .slides section:not(.stack):before {\n  content: '';\n  position: absolute;\n  display: block;\n  width: 100%;\n  height: 100%;\n  left: 0;\n  top: 0;\n  background: rgba(0, 0, 0, 0.1);\n  -webkit-transform: translateZ(-20px);\n          transform: translateZ(-20px); }\n\n.reveal.page .slides section:not(.stack):after {\n  content: '';\n  position: absolute;\n  display: block;\n  width: 90%;\n  height: 30px;\n  left: 5%;\n  bottom: 0;\n  background: none;\n  z-index: 1;\n  border-radius: 4px;\n  box-shadow: 0px 95px 25px rgba(0, 0, 0, 0.2);\n  -webkit-transform: translateZ(-90px) rotateX(65deg); }\n\n.reveal.page .slides > section.stack {\n  padding: 0;\n  background: none; }\n\n.reveal.page .slides > section.past {\n  -webkit-transform-origin: 0% 0%;\n          transform-origin: 0% 0%;\n  -webkit-transform: translate3d(-40%, 0, 0) rotateY(-80deg);\n          transform: translate3d(-40%, 0, 0) rotateY(-80deg); }\n\n.reveal.page .slides > section.future {\n  -webkit-transform-origin: 100% 0%;\n          transform-origin: 100% 0%;\n  -webkit-transform: translate3d(0, 0, 0);\n          transform: translate3d(0, 0, 0); }\n\n.reveal.page .slides > section > section.past {\n  -webkit-transform-origin: 0% 0%;\n          transform-origin: 0% 0%;\n  -webkit-transform: translate3d(0, -40%, 0) rotateX(80deg);\n          transform: translate3d(0, -40%, 0) rotateX(80deg); }\n\n.reveal.page .slides > section > section.future {\n  -webkit-transform-origin: 0% 100%;\n          transform-origin: 0% 100%;\n  -webkit-transform: translate3d(0, 0, 0);\n          transform: translate3d(0, 0, 0); }\n\n/*********************************************\n * FADE TRANSITION\n *********************************************/\n.reveal .slides section[data-transition=fade],\n.reveal.fade .slides section:not([data-transition]),\n.reveal.fade .slides > section > section:not([data-transition]) {\n  -webkit-transform: none;\n          transform: none;\n  -webkit-transition: opacity 0.5s;\n          transition: opacity 0.5s; }\n\n.reveal.fade.overview .slides section,\n.reveal.fade.overview .slides > section > section {\n  -webkit-transition: none;\n          transition: none; }\n\n/*********************************************\n * NO TRANSITION\n *********************************************/\n.reveal .slides section[data-transition=none],\n.reveal.none .slides section:not([data-transition]) {\n  -webkit-transform: none;\n          transform: none;\n  -webkit-transition: none;\n          transition: none; }\n\n/*********************************************\n * PAUSED MODE\n *********************************************/\n.reveal .pause-overlay {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: black;\n  visibility: hidden;\n  opacity: 0;\n  z-index: 100;\n  -webkit-transition: all 1s ease;\n          transition: all 1s ease; }\n\n.reveal.paused .pause-overlay {\n  visibility: visible;\n  opacity: 1; }\n\n/*********************************************\n * FALLBACK\n *********************************************/\n.no-transforms {\n  overflow-y: auto; }\n\n.no-transforms .reveal .slides {\n  position: relative;\n  width: 80%;\n  height: auto !important;\n  top: 0;\n  left: 50%;\n  margin: 0;\n  text-align: center; }\n\n.no-transforms .reveal .controls,\n.no-transforms .reveal .progress {\n  display: none !important; }\n\n.no-transforms .reveal .slides section {\n  display: block !important;\n  opacity: 1 !important;\n  position: relative !important;\n  height: auto;\n  min-height: 0;\n  top: 0;\n  left: -50%;\n  margin: 70px 0;\n  -webkit-transform: none;\n          transform: none; }\n\n.no-transforms .reveal .slides section section {\n  left: 0; }\n\n.reveal .no-transition,\n.reveal .no-transition * {\n  -webkit-transition: none !important;\n          transition: none !important; }\n\n/*********************************************\n * PER-SLIDE BACKGROUNDS\n *********************************************/\n.reveal .backgrounds {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  -webkit-perspective: 600px;\n          perspective: 600px; }\n\n.reveal .slide-background {\n  display: none;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n  visibility: hidden;\n  background-color: transparent;\n  background-position: 50% 50%;\n  background-repeat: no-repeat;\n  background-size: cover;\n  -webkit-transition: all 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985);\n          transition: all 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985); }\n\n.reveal .slide-background.stack {\n  display: block; }\n\n.reveal .slide-background.present {\n  opacity: 1;\n  visibility: visible; }\n\n.print-pdf .reveal .slide-background {\n  opacity: 1 !important;\n  visibility: visible !important; }\n\n/* Video backgrounds */\n.reveal .slide-background video {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  max-width: none;\n  max-height: none;\n  top: 0;\n  left: 0; }\n\n/* Immediate transition style */\n.reveal[data-background-transition=none] > .backgrounds .slide-background,\n.reveal > .backgrounds .slide-background[data-background-transition=none] {\n  -webkit-transition: none;\n          transition: none; }\n\n/* Slide */\n.reveal[data-background-transition=slide] > .backgrounds .slide-background,\n.reveal > .backgrounds .slide-background[data-background-transition=slide] {\n  opacity: 1;\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden; }\n\n.reveal[data-background-transition=slide] > .backgrounds .slide-background.past,\n.reveal > .backgrounds .slide-background.past[data-background-transition=slide] {\n  -webkit-transform: translate(-100%, 0);\n          transform: translate(-100%, 0); }\n\n.reveal[data-background-transition=slide] > .backgrounds .slide-background.future,\n.reveal > .backgrounds .slide-background.future[data-background-transition=slide] {\n  -webkit-transform: translate(100%, 0);\n          transform: translate(100%, 0); }\n\n.reveal[data-background-transition=slide] > .backgrounds .slide-background > .slide-background.past,\n.reveal > .backgrounds .slide-background > .slide-background.past[data-background-transition=slide] {\n  -webkit-transform: translate(0, -100%);\n          transform: translate(0, -100%); }\n\n.reveal[data-background-transition=slide] > .backgrounds .slide-background > .slide-background.future,\n.reveal > .backgrounds .slide-background > .slide-background.future[data-background-transition=slide] {\n  -webkit-transform: translate(0, 100%);\n          transform: translate(0, 100%); }\n\n/* Convex */\n.reveal[data-background-transition=convex] > .backgrounds .slide-background.past,\n.reveal > .backgrounds .slide-background.past[data-background-transition=convex] {\n  opacity: 0;\n  -webkit-transform: translate3d(-100%, 0, 0) rotateY(-90deg) translate3d(-100%, 0, 0);\n          transform: translate3d(-100%, 0, 0) rotateY(-90deg) translate3d(-100%, 0, 0); }\n\n.reveal[data-background-transition=convex] > .backgrounds .slide-background.future,\n.reveal > .backgrounds .slide-background.future[data-background-transition=convex] {\n  opacity: 0;\n  -webkit-transform: translate3d(100%, 0, 0) rotateY(90deg) translate3d(100%, 0, 0);\n          transform: translate3d(100%, 0, 0) rotateY(90deg) translate3d(100%, 0, 0); }\n\n.reveal[data-background-transition=convex] > .backgrounds .slide-background > .slide-background.past,\n.reveal > .backgrounds .slide-background > .slide-background.past[data-background-transition=convex] {\n  opacity: 0;\n  -webkit-transform: translate3d(0, -100%, 0) rotateX(90deg) translate3d(0, -100%, 0);\n          transform: translate3d(0, -100%, 0) rotateX(90deg) translate3d(0, -100%, 0); }\n\n.reveal[data-background-transition=convex] > .backgrounds .slide-background > .slide-background.future,\n.reveal > .backgrounds .slide-background > .slide-background.future[data-background-transition=convex] {\n  opacity: 0;\n  -webkit-transform: translate3d(0, 100%, 0) rotateX(-90deg) translate3d(0, 100%, 0);\n          transform: translate3d(0, 100%, 0) rotateX(-90deg) translate3d(0, 100%, 0); }\n\n/* Concave */\n.reveal[data-background-transition=concave] > .backgrounds .slide-background.past,\n.reveal > .backgrounds .slide-background.past[data-background-transition=concave] {\n  opacity: 0;\n  -webkit-transform: translate3d(-100%, 0, 0) rotateY(90deg) translate3d(-100%, 0, 0);\n          transform: translate3d(-100%, 0, 0) rotateY(90deg) translate3d(-100%, 0, 0); }\n\n.reveal[data-background-transition=concave] > .backgrounds .slide-background.future,\n.reveal > .backgrounds .slide-background.future[data-background-transition=concave] {\n  opacity: 0;\n  -webkit-transform: translate3d(100%, 0, 0) rotateY(-90deg) translate3d(100%, 0, 0);\n          transform: translate3d(100%, 0, 0) rotateY(-90deg) translate3d(100%, 0, 0); }\n\n.reveal[data-background-transition=concave] > .backgrounds .slide-background > .slide-background.past,\n.reveal > .backgrounds .slide-background > .slide-background.past[data-background-transition=concave] {\n  opacity: 0;\n  -webkit-transform: translate3d(0, -100%, 0) rotateX(-90deg) translate3d(0, -100%, 0);\n          transform: translate3d(0, -100%, 0) rotateX(-90deg) translate3d(0, -100%, 0); }\n\n.reveal[data-background-transition=concave] > .backgrounds .slide-background > .slide-background.future,\n.reveal > .backgrounds .slide-background > .slide-background.future[data-background-transition=concave] {\n  opacity: 0;\n  -webkit-transform: translate3d(0, 100%, 0) rotateX(90deg) translate3d(0, 100%, 0);\n          transform: translate3d(0, 100%, 0) rotateX(90deg) translate3d(0, 100%, 0); }\n\n/* Zoom */\n.reveal[data-background-transition=zoom] > .backgrounds .slide-background,\n.reveal > .backgrounds .slide-background[data-background-transition=zoom] {\n  -webkit-transition-timing-function: ease;\n          transition-timing-function: ease; }\n\n.reveal[data-background-transition=zoom] > .backgrounds .slide-background.past,\n.reveal > .backgrounds .slide-background.past[data-background-transition=zoom] {\n  opacity: 0;\n  visibility: hidden;\n  -webkit-transform: scale(16);\n          transform: scale(16); }\n\n.reveal[data-background-transition=zoom] > .backgrounds .slide-background.future,\n.reveal > .backgrounds .slide-background.future[data-background-transition=zoom] {\n  opacity: 0;\n  visibility: hidden;\n  -webkit-transform: scale(0.2);\n          transform: scale(0.2); }\n\n.reveal[data-background-transition=zoom] > .backgrounds .slide-background > .slide-background.past,\n.reveal > .backgrounds .slide-background > .slide-background.past[data-background-transition=zoom] {\n  opacity: 0;\n  visibility: hidden;\n  -webkit-transform: scale(16);\n          transform: scale(16); }\n\n.reveal[data-background-transition=zoom] > .backgrounds .slide-background > .slide-background.future,\n.reveal > .backgrounds .slide-background > .slide-background.future[data-background-transition=zoom] {\n  opacity: 0;\n  visibility: hidden;\n  -webkit-transform: scale(0.2);\n          transform: scale(0.2); }\n\n/* Global transition speed settings */\n.reveal[data-transition-speed=\"fast\"] > .backgrounds .slide-background {\n  -webkit-transition-duration: 400ms;\n          transition-duration: 400ms; }\n\n.reveal[data-transition-speed=\"slow\"] > .backgrounds .slide-background {\n  -webkit-transition-duration: 1200ms;\n          transition-duration: 1200ms; }\n\n/*********************************************\n * OVERVIEW\n *********************************************/\n.reveal.overview {\n  -webkit-perspective-origin: 50% 50%;\n          perspective-origin: 50% 50%;\n  -webkit-perspective: 700px;\n          perspective: 700px; }\n  .reveal.overview .slides {\n    -moz-transform-style: preserve-3d; }\n  .reveal.overview .slides section {\n    height: 100%;\n    top: 0 !important;\n    opacity: 1 !important;\n    overflow: hidden;\n    visibility: visible !important;\n    cursor: pointer;\n    box-sizing: border-box; }\n  .reveal.overview .slides section:hover,\n  .reveal.overview .slides section.present {\n    outline: 10px solid rgba(150, 150, 150, 0.4);\n    outline-offset: 10px; }\n  .reveal.overview .slides section .fragment {\n    opacity: 1;\n    -webkit-transition: none;\n            transition: none; }\n  .reveal.overview .slides section:after,\n  .reveal.overview .slides section:before {\n    display: none !important; }\n  .reveal.overview .slides > section.stack {\n    padding: 0;\n    top: 0 !important;\n    background: none;\n    outline: none;\n    overflow: visible; }\n  .reveal.overview .backgrounds {\n    -webkit-perspective: inherit;\n            perspective: inherit;\n    -moz-transform-style: preserve-3d; }\n  .reveal.overview .backgrounds .slide-background {\n    opacity: 1;\n    visibility: visible;\n    outline: 10px solid rgba(150, 150, 150, 0.1);\n    outline-offset: 10px; }\n\n.reveal.overview .slides section,\n.reveal.overview-deactivating .slides section {\n  -webkit-transition: none;\n          transition: none; }\n\n.reveal.overview .backgrounds .slide-background,\n.reveal.overview-deactivating .backgrounds .slide-background {\n  -webkit-transition: none;\n          transition: none; }\n\n.reveal.overview-animated .slides {\n  -webkit-transition: -webkit-transform 0.4s ease;\n          transition: transform 0.4s ease; }\n\n/*********************************************\n * RTL SUPPORT\n *********************************************/\n.reveal.rtl .slides,\n.reveal.rtl .slides h1,\n.reveal.rtl .slides h2,\n.reveal.rtl .slides h3,\n.reveal.rtl .slides h4,\n.reveal.rtl .slides h5,\n.reveal.rtl .slides h6 {\n  direction: rtl;\n  font-family: sans-serif; }\n\n.reveal.rtl pre,\n.reveal.rtl code {\n  direction: ltr; }\n\n.reveal.rtl ol,\n.reveal.rtl ul {\n  text-align: right; }\n\n.reveal.rtl .progress span {\n  float: right; }\n\n/*********************************************\n * PARALLAX BACKGROUND\n *********************************************/\n.reveal.has-parallax-background .backgrounds {\n  -webkit-transition: all 0.8s ease;\n          transition: all 0.8s ease; }\n\n/* Global transition speed settings */\n.reveal.has-parallax-background[data-transition-speed=\"fast\"] .backgrounds {\n  -webkit-transition-duration: 400ms;\n          transition-duration: 400ms; }\n\n.reveal.has-parallax-background[data-transition-speed=\"slow\"] .backgrounds {\n  -webkit-transition-duration: 1200ms;\n          transition-duration: 1200ms; }\n\n/*********************************************\n * LINK PREVIEW OVERLAY\n *********************************************/\n.reveal .overlay {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 1000;\n  background: rgba(0, 0, 0, 0.9);\n  opacity: 0;\n  visibility: hidden;\n  -webkit-transition: all 0.3s ease;\n          transition: all 0.3s ease; }\n\n.reveal .overlay.visible {\n  opacity: 1;\n  visibility: visible; }\n\n.reveal .overlay .spinner {\n  position: absolute;\n  display: block;\n  top: 50%;\n  left: 50%;\n  width: 32px;\n  height: 32px;\n  margin: -16px 0 0 -16px;\n  z-index: 10;\n  background-image: url(data:image/gif;base64,R0lGODlhIAAgAPMAAJmZmf%2F%2F%2F6%2Bvr8nJybW1tcDAwOjo6Nvb26ioqKOjo7Ozs%2FLy8vz8%2FAAAAAAAAAAAACH%2FC05FVFNDQVBFMi4wAwEAAAAh%2FhpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh%2BQQJCgAAACwAAAAAIAAgAAAE5xDISWlhperN52JLhSSdRgwVo1ICQZRUsiwHpTJT4iowNS8vyW2icCF6k8HMMBkCEDskxTBDAZwuAkkqIfxIQyhBQBFvAQSDITM5VDW6XNE4KagNh6Bgwe60smQUB3d4Rz1ZBApnFASDd0hihh12BkE9kjAJVlycXIg7CQIFA6SlnJ87paqbSKiKoqusnbMdmDC2tXQlkUhziYtyWTxIfy6BE8WJt5YJvpJivxNaGmLHT0VnOgSYf0dZXS7APdpB309RnHOG5gDqXGLDaC457D1zZ%2FV%2FnmOM82XiHRLYKhKP1oZmADdEAAAh%2BQQJCgAAACwAAAAAIAAgAAAE6hDISWlZpOrNp1lGNRSdRpDUolIGw5RUYhhHukqFu8DsrEyqnWThGvAmhVlteBvojpTDDBUEIFwMFBRAmBkSgOrBFZogCASwBDEY%2FCZSg7GSE0gSCjQBMVG023xWBhklAnoEdhQEfyNqMIcKjhRsjEdnezB%2BA4k8gTwJhFuiW4dokXiloUepBAp5qaKpp6%2BHo7aWW54wl7obvEe0kRuoplCGepwSx2jJvqHEmGt6whJpGpfJCHmOoNHKaHx61WiSR92E4lbFoq%2BB6QDtuetcaBPnW6%2BO7wDHpIiK9SaVK5GgV543tzjgGcghAgAh%2BQQJCgAAACwAAAAAIAAgAAAE7hDISSkxpOrN5zFHNWRdhSiVoVLHspRUMoyUakyEe8PTPCATW9A14E0UvuAKMNAZKYUZCiBMuBakSQKG8G2FzUWox2AUtAQFcBKlVQoLgQReZhQlCIJesQXI5B0CBnUMOxMCenoCfTCEWBsJColTMANldx15BGs8B5wlCZ9Po6OJkwmRpnqkqnuSrayqfKmqpLajoiW5HJq7FL1Gr2mMMcKUMIiJgIemy7xZtJsTmsM4xHiKv5KMCXqfyUCJEonXPN2rAOIAmsfB3uPoAK%2B%2BG%2Bw48edZPK%2BM6hLJpQg484enXIdQFSS1u6UhksENEQAAIfkECQoAAAAsAAAAACAAIAAABOcQyEmpGKLqzWcZRVUQnZYg1aBSh2GUVEIQ2aQOE%2BG%2BcD4ntpWkZQj1JIiZIogDFFyHI0UxQwFugMSOFIPJftfVAEoZLBbcLEFhlQiqGp1Vd140AUklUN3eCA51C1EWMzMCezCBBmkxVIVHBWd3HHl9JQOIJSdSnJ0TDKChCwUJjoWMPaGqDKannasMo6WnM562R5YluZRwur0wpgqZE7NKUm%2BFNRPIhjBJxKZteWuIBMN4zRMIVIhffcgojwCF117i4nlLnY5ztRLsnOk%2BaV%2BoJY7V7m76PdkS4trKcdg0Zc0tTcKkRAAAIfkECQoAAAAsAAAAACAAIAAABO4QyEkpKqjqzScpRaVkXZWQEximw1BSCUEIlDohrft6cpKCk5xid5MNJTaAIkekKGQkWyKHkvhKsR7ARmitkAYDYRIbUQRQjWBwJRzChi9CRlBcY1UN4g0%2FVNB0AlcvcAYHRyZPdEQFYV8ccwR5HWxEJ02YmRMLnJ1xCYp0Y5idpQuhopmmC2KgojKasUQDk5BNAwwMOh2RtRq5uQuPZKGIJQIGwAwGf6I0JXMpC8C7kXWDBINFMxS4DKMAWVWAGYsAdNqW5uaRxkSKJOZKaU3tPOBZ4DuK2LATgJhkPJMgTwKCdFjyPHEnKxFCDhEAACH5BAkKAAAALAAAAAAgACAAAATzEMhJaVKp6s2nIkolIJ2WkBShpkVRWqqQrhLSEu9MZJKK9y1ZrqYK9WiClmvoUaF8gIQSNeF1Er4MNFn4SRSDARWroAIETg1iVwuHjYB1kYc1mwruwXKC9gmsJXliGxc%2BXiUCby9ydh1sOSdMkpMTBpaXBzsfhoc5l58Gm5yToAaZhaOUqjkDgCWNHAULCwOLaTmzswadEqggQwgHuQsHIoZCHQMMQgQGubVEcxOPFAcMDAYUA85eWARmfSRQCdcMe0zeP1AAygwLlJtPNAAL19DARdPzBOWSm1brJBi45soRAWQAAkrQIykShQ9wVhHCwCQCACH5BAkKAAAALAAAAAAgACAAAATrEMhJaVKp6s2nIkqFZF2VIBWhUsJaTokqUCoBq%2BE71SRQeyqUToLA7VxF0JDyIQh%2FMVVPMt1ECZlfcjZJ9mIKoaTl1MRIl5o4CUKXOwmyrCInCKqcWtvadL2SYhyASyNDJ0uIiRMDjI0Fd30%2FiI2UA5GSS5UDj2l6NoqgOgN4gksEBgYFf0FDqKgHnyZ9OX8HrgYHdHpcHQULXAS2qKpENRg7eAMLC7kTBaixUYFkKAzWAAnLC7FLVxLWDBLKCwaKTULgEwbLA4hJtOkSBNqITT3xEgfLpBtzE%2FjiuL04RGEBgwWhShRgQExHBAAh%2BQQJCgAAACwAAAAAIAAgAAAE7xDISWlSqerNpyJKhWRdlSAVoVLCWk6JKlAqAavhO9UkUHsqlE6CwO1cRdCQ8iEIfzFVTzLdRAmZX3I2SfZiCqGk5dTESJeaOAlClzsJsqwiJwiqnFrb2nS9kmIcgEsjQydLiIlHehhpejaIjzh9eomSjZR%2BipslWIRLAgMDOR2DOqKogTB9pCUJBagDBXR6XB0EBkIIsaRsGGMMAxoDBgYHTKJiUYEGDAzHC9EACcUGkIgFzgwZ0QsSBcXHiQvOwgDdEwfFs0sDzt4S6BK4xYjkDOzn0unFeBzOBijIm1Dgmg5YFQwsCMjp1oJ8LyIAACH5BAkKAAAALAAAAAAgACAAAATwEMhJaVKp6s2nIkqFZF2VIBWhUsJaTokqUCoBq%2BE71SRQeyqUToLA7VxF0JDyIQh%2FMVVPMt1ECZlfcjZJ9mIKoaTl1MRIl5o4CUKXOwmyrCInCKqcWtvadL2SYhyASyNDJ0uIiUd6GGl6NoiPOH16iZKNlH6KmyWFOggHhEEvAwwMA0N9GBsEC6amhnVcEwavDAazGwIDaH1ipaYLBUTCGgQDA8NdHz0FpqgTBwsLqAbWAAnIA4FWKdMLGdYGEgraigbT0OITBcg5QwPT4xLrROZL6AuQAPUS7bxLpoWidY0JtxLHKhwwMJBTHgPKdEQAACH5BAkKAAAALAAAAAAgACAAAATrEMhJaVKp6s2nIkqFZF2VIBWhUsJaTokqUCoBq%2BE71SRQeyqUToLA7VxF0JDyIQh%2FMVVPMt1ECZlfcjZJ9mIKoaTl1MRIl5o4CUKXOwmyrCInCKqcWtvadL2SYhyASyNDJ0uIiUd6GAULDJCRiXo1CpGXDJOUjY%2BYip9DhToJA4RBLwMLCwVDfRgbBAaqqoZ1XBMHswsHtxtFaH1iqaoGNgAIxRpbFAgfPQSqpbgGBqUD1wBXeCYp1AYZ19JJOYgH1KwA4UBvQwXUBxPqVD9L3sbp2BNk2xvvFPJd%2BMFCN6HAAIKgNggY0KtEBAAh%2BQQJCgAAACwAAAAAIAAgAAAE6BDISWlSqerNpyJKhWRdlSAVoVLCWk6JKlAqAavhO9UkUHsqlE6CwO1cRdCQ8iEIfzFVTzLdRAmZX3I2SfYIDMaAFdTESJeaEDAIMxYFqrOUaNW4E4ObYcCXaiBVEgULe0NJaxxtYksjh2NLkZISgDgJhHthkpU4mW6blRiYmZOlh4JWkDqILwUGBnE6TYEbCgevr0N1gH4At7gHiRpFaLNrrq8HNgAJA70AWxQIH1%2BvsYMDAzZQPC9VCNkDWUhGkuE5PxJNwiUK4UfLzOlD4WvzAHaoG9nxPi5d%2BjYUqfAhhykOFwJWiAAAIfkECQoAAAAsAAAAACAAIAAABPAQyElpUqnqzaciSoVkXVUMFaFSwlpOCcMYlErAavhOMnNLNo8KsZsMZItJEIDIFSkLGQoQTNhIsFehRww2CQLKF0tYGKYSg%2BygsZIuNqJksKgbfgIGepNo2cIUB3V1B3IvNiBYNQaDSTtfhhx0CwVPI0UJe0%2Bbm4g5VgcGoqOcnjmjqDSdnhgEoamcsZuXO1aWQy8KAwOAuTYYGwi7w5h%2BKr0SJ8MFihpNbx%2B4Erq7BYBuzsdiH1jCAzoSfl0rVirNbRXlBBlLX%2BBP0XJLAPGzTkAuAOqb0WT5AH7OcdCm5B8TgRwSRKIHQtaLCwg1RAAAOwAAAAAAAAAAAA%3D%3D);\n  visibility: visible;\n  opacity: 0.6;\n  -webkit-transition: all 0.3s ease;\n          transition: all 0.3s ease; }\n\n.reveal .overlay header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 40px;\n  z-index: 2;\n  border-bottom: 1px solid #222; }\n\n.reveal .overlay header a {\n  display: inline-block;\n  width: 40px;\n  height: 40px;\n  line-height: 36px;\n  padding: 0 10px;\n  float: right;\n  opacity: 0.6;\n  box-sizing: border-box; }\n\n.reveal .overlay header a:hover {\n  opacity: 1; }\n\n.reveal .overlay header a .icon {\n  display: inline-block;\n  width: 20px;\n  height: 20px;\n  background-position: 50% 50%;\n  background-size: 100%;\n  background-repeat: no-repeat; }\n\n.reveal .overlay header a.close .icon {\n  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABkklEQVRYR8WX4VHDMAxG6wnoJrABZQPYBCaBTWAD2g1gE5gg6OOsXuxIlr40d81dfrSJ9V4c2VLK7spHuTJ/5wpM07QXuXc5X0opX2tEJcadjHuV80li/FgxTIEK/5QBCICBD6xEhSMGHgQPgBgLiYVAB1dpSqKDawxTohFw4JSEA3clzgIBPCURwE2JucBR7rhPJJv5OpJwDX+SfDjgx1wACQeJG1aChP9K/IMmdZ8DtESV1WyP3Bt4MwM6sj4NMxMYiqUWHQu4KYA/SYkIjOsm3BXYWMKFDwU2khjCQ4ELJUJ4SmClRArOCmSXGuKma0fYD5CbzHxFpCSGAhfAVSSUGDUk2BWZaff2g6GE15BsBQ9nwmpIGDiyHQddwNTMKkbZaf9fajXQca1EX44puJZUsnY0ObGmITE3GVLCbEhQUjGVt146j6oasWN+49Vph2w1pZ5EansNZqKBm1txbU57iRRcZ86RWMDdWtBJUHBHwoQPi1GV+JCbntmvok7iTX4/Up9mgyTc/FJYDTcndgH/AA5A/CHsyEkVAAAAAElFTkSuQmCC); }\n\n.reveal .overlay header a.external .icon {\n  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAcElEQVRYR+2WSQoAIQwEzf8f7XiOMkUQxUPlGkM3hVmiQfQR9GYnH1SsAQlI4DiBqkCMoNb9y2e90IAEJPAcgdznU9+engMaeJ7Azh5Y1U67gAho4DqBqmB1buAf0MB1AlVBek83ZPkmJMGc1wAR+AAqod/B97TRpQAAAABJRU5ErkJggg==); }\n\n.reveal .overlay .viewport {\n  position: absolute;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  top: 40px;\n  right: 0;\n  bottom: 0;\n  left: 0; }\n\n.reveal .overlay.overlay-preview .viewport iframe {\n  width: 100%;\n  height: 100%;\n  max-width: 100%;\n  max-height: 100%;\n  border: 0;\n  opacity: 0;\n  visibility: hidden;\n  -webkit-transition: all 0.3s ease;\n          transition: all 0.3s ease; }\n\n.reveal .overlay.overlay-preview.loaded .viewport iframe {\n  opacity: 1;\n  visibility: visible; }\n\n.reveal .overlay.overlay-preview.loaded .viewport-inner {\n  position: absolute;\n  z-index: -1;\n  left: 0;\n  top: 45%;\n  width: 100%;\n  text-align: center;\n  letter-spacing: normal; }\n\n.reveal .overlay.overlay-preview .x-frame-error {\n  opacity: 0;\n  -webkit-transition: opacity 0.3s ease 0.3s;\n          transition: opacity 0.3s ease 0.3s; }\n\n.reveal .overlay.overlay-preview.loaded .x-frame-error {\n  opacity: 1; }\n\n.reveal .overlay.overlay-preview.loaded .spinner {\n  opacity: 0;\n  visibility: hidden;\n  -webkit-transform: scale(0.2);\n          transform: scale(0.2); }\n\n.reveal .overlay.overlay-help .viewport {\n  overflow: auto;\n  color: #fff; }\n\n.reveal .overlay.overlay-help .viewport .viewport-inner {\n  width: 600px;\n  margin: auto;\n  padding: 20px 20px 80px 20px;\n  text-align: center;\n  letter-spacing: normal; }\n\n.reveal .overlay.overlay-help .viewport .viewport-inner .title {\n  font-size: 20px; }\n\n.reveal .overlay.overlay-help .viewport .viewport-inner table {\n  border: 1px solid #fff;\n  border-collapse: collapse;\n  font-size: 16px; }\n\n.reveal .overlay.overlay-help .viewport .viewport-inner table th,\n.reveal .overlay.overlay-help .viewport .viewport-inner table td {\n  width: 200px;\n  padding: 14px;\n  border: 1px solid #fff;\n  vertical-align: middle; }\n\n.reveal .overlay.overlay-help .viewport .viewport-inner table th {\n  padding-top: 20px;\n  padding-bottom: 20px; }\n\n/*********************************************\n * PLAYBACK COMPONENT\n *********************************************/\n.reveal .playback {\n  position: fixed;\n  left: 15px;\n  bottom: 20px;\n  z-index: 30;\n  cursor: pointer;\n  -webkit-transition: all 400ms ease;\n          transition: all 400ms ease; }\n\n.reveal.overview .playback {\n  opacity: 0;\n  visibility: hidden; }\n\n/*********************************************\n * ROLLING LINKS\n *********************************************/\n.reveal .roll {\n  display: inline-block;\n  line-height: 1.2;\n  overflow: hidden;\n  vertical-align: top;\n  -webkit-perspective: 400px;\n          perspective: 400px;\n  -webkit-perspective-origin: 50% 50%;\n          perspective-origin: 50% 50%; }\n\n.reveal .roll:hover {\n  background: none;\n  text-shadow: none; }\n\n.reveal .roll span {\n  display: block;\n  position: relative;\n  padding: 0 2px;\n  pointer-events: none;\n  -webkit-transition: all 400ms ease;\n          transition: all 400ms ease;\n  -webkit-transform-origin: 50% 0%;\n          transform-origin: 50% 0%;\n  -webkit-transform-style: preserve-3d;\n          transform-style: preserve-3d;\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden; }\n\n.reveal .roll:hover span {\n  background: rgba(0, 0, 0, 0.5);\n  -webkit-transform: translate3d(0px, 0px, -45px) rotateX(90deg);\n          transform: translate3d(0px, 0px, -45px) rotateX(90deg); }\n\n.reveal .roll span:after {\n  content: attr(data-title);\n  display: block;\n  position: absolute;\n  left: 0;\n  top: 0;\n  padding: 0 2px;\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden;\n  -webkit-transform-origin: 50% 0%;\n          transform-origin: 50% 0%;\n  -webkit-transform: translate3d(0px, 110%, 0px) rotateX(-90deg);\n          transform: translate3d(0px, 110%, 0px) rotateX(-90deg); }\n\n/*********************************************\n * SPEAKER NOTES\n *********************************************/\n.reveal aside.notes {\n  display: none; }\n\n.reveal .speaker-notes {\n  display: none;\n  position: absolute;\n  width: 70%;\n  max-height: 15%;\n  left: 15%;\n  bottom: 26px;\n  padding: 10px;\n  z-index: 1;\n  font-size: 18px;\n  line-height: 1.4;\n  color: #fff;\n  background-color: rgba(0, 0, 0, 0.5);\n  overflow: auto;\n  box-sizing: border-box;\n  text-align: left;\n  font-family: Helvetica, sans-serif;\n  -webkit-overflow-scrolling: touch; }\n\n.reveal .speaker-notes.visible:not(:empty) {\n  display: block; }\n\n@media screen and (max-width: 1024px) {\n  .reveal .speaker-notes {\n    font-size: 14px; } }\n\n@media screen and (max-width: 600px) {\n  .reveal .speaker-notes {\n    width: 90%;\n    left: 5%; } }\n\n/*********************************************\n * ZOOM PLUGIN\n *********************************************/\n.zoomed .reveal *,\n.zoomed .reveal *:before,\n.zoomed .reveal *:after {\n  -webkit-backface-visibility: visible !important;\n          backface-visibility: visible !important; }\n\n.zoomed .reveal .progress,\n.zoomed .reveal .controls {\n  opacity: 0; }\n\n.zoomed .reveal .roll span {\n  background: none; }\n\n.zoomed .reveal .roll span:after {\n  visibility: hidden; }\n", ""]);

// exports


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Quicksand:400,700,400italic,700italic);", ""]);
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,400,700);", ""]);

// module
exports.push([module.i, "/**\n * Sky theme for reveal.js.\n *\n * Copyright (C) 2011-2012 Hakim El Hattab, http://hakim.se\n */\n.reveal a {\n  line-height: 1.3em; }\n\n/*********************************************\n * GLOBAL STYLES\n *********************************************/\nbody {\n  background: #add9e4;\n  background: -moz-radial-gradient(center, circle cover, #f7fbfc 0%, #add9e4 100%);\n  background: -webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%, #f7fbfc), color-stop(100%, #add9e4));\n  background: -webkit-radial-gradient(center, circle cover, #f7fbfc 0%, #add9e4 100%);\n  background: -o-radial-gradient(center, circle cover, #f7fbfc 0%, #add9e4 100%);\n  background: -ms-radial-gradient(center, circle cover, #f7fbfc 0%, #add9e4 100%);\n  background: radial-gradient(center, circle cover, #f7fbfc 0%, #add9e4 100%);\n  background-color: #f7fbfc; }\n\n.reveal {\n  font-family: \"Open Sans\", sans-serif;\n  font-size: 40px;\n  font-weight: normal;\n  color: #333; }\n\n::selection {\n  color: #fff;\n  background: #134674;\n  text-shadow: none; }\n\n::-moz-selection {\n  color: #fff;\n  background: #134674;\n  text-shadow: none; }\n\n.reveal .slides > section,\n.reveal .slides > section > section {\n  line-height: 1.3;\n  font-weight: inherit; }\n\n/*********************************************\n * HEADERS\n *********************************************/\n.reveal h1,\n.reveal h2,\n.reveal h3,\n.reveal h4,\n.reveal h5,\n.reveal h6 {\n  margin: 0 0 20px 0;\n  color: #333;\n  font-family: \"Quicksand\", sans-serif;\n  font-weight: normal;\n  line-height: 1.2;\n  letter-spacing: -0.08em;\n  text-transform: uppercase;\n  text-shadow: none;\n  word-wrap: break-word; }\n\n.reveal h1 {\n  font-size: 3.77em; }\n\n.reveal h2 {\n  font-size: 2.11em; }\n\n.reveal h3 {\n  font-size: 1.55em; }\n\n.reveal h4 {\n  font-size: 1em; }\n\n.reveal h1 {\n  text-shadow: none; }\n\n/*********************************************\n * OTHER\n *********************************************/\n.reveal p {\n  margin: 20px 0;\n  line-height: 1.3; }\n\n/* Ensure certain elements are never larger than the slide itself */\n.reveal img,\n.reveal video,\n.reveal iframe {\n  max-width: 95%;\n  max-height: 95%; }\n\n.reveal strong,\n.reveal b {\n  font-weight: bold; }\n\n.reveal em {\n  font-style: italic; }\n\n.reveal ol,\n.reveal dl,\n.reveal ul {\n  display: inline-block;\n  text-align: left;\n  margin: 0 0 0 1em; }\n\n.reveal ol {\n  list-style-type: decimal; }\n\n.reveal ul {\n  list-style-type: disc; }\n\n.reveal ul ul {\n  list-style-type: square; }\n\n.reveal ul ul ul {\n  list-style-type: circle; }\n\n.reveal ul ul,\n.reveal ul ol,\n.reveal ol ol,\n.reveal ol ul {\n  display: block;\n  margin-left: 40px; }\n\n.reveal dt {\n  font-weight: bold; }\n\n.reveal dd {\n  margin-left: 40px; }\n\n.reveal q,\n.reveal blockquote {\n  quotes: none; }\n\n.reveal blockquote {\n  display: block;\n  position: relative;\n  width: 70%;\n  margin: 20px auto;\n  padding: 5px;\n  font-style: italic;\n  background: rgba(255, 255, 255, 0.05);\n  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2); }\n\n.reveal blockquote p:first-child,\n.reveal blockquote p:last-child {\n  display: inline-block; }\n\n.reveal q {\n  font-style: italic; }\n\n.reveal pre {\n  display: block;\n  position: relative;\n  width: 90%;\n  margin: 20px auto;\n  text-align: left;\n  font-size: 0.55em;\n  font-family: monospace;\n  line-height: 1.2em;\n  word-wrap: break-word;\n  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.3); }\n\n.reveal code {\n  font-family: monospace; }\n\n.reveal pre code {\n  display: block;\n  padding: 5px;\n  overflow: auto;\n  max-height: 400px;\n  word-wrap: normal; }\n\n.reveal table {\n  margin: auto;\n  border-collapse: collapse;\n  border-spacing: 0; }\n\n.reveal table th {\n  font-weight: bold; }\n\n.reveal table th,\n.reveal table td {\n  text-align: left;\n  padding: 0.2em 0.5em 0.2em 0.5em;\n  border-bottom: 1px solid; }\n\n.reveal table th[align=\"center\"],\n.reveal table td[align=\"center\"] {\n  text-align: center; }\n\n.reveal table th[align=\"right\"],\n.reveal table td[align=\"right\"] {\n  text-align: right; }\n\n.reveal table tbody tr:last-child th,\n.reveal table tbody tr:last-child td {\n  border-bottom: none; }\n\n.reveal sup {\n  vertical-align: super; }\n\n.reveal sub {\n  vertical-align: sub; }\n\n.reveal small {\n  display: inline-block;\n  font-size: 0.6em;\n  line-height: 1.2em;\n  vertical-align: top; }\n\n.reveal small * {\n  vertical-align: top; }\n\n/*********************************************\n * LINKS\n *********************************************/\n.reveal a {\n  color: #3b759e;\n  text-decoration: none;\n  -webkit-transition: color .15s ease;\n  -moz-transition: color .15s ease;\n  transition: color .15s ease; }\n\n.reveal a:hover {\n  color: #74a7cb;\n  text-shadow: none;\n  border: none; }\n\n.reveal .roll span:after {\n  color: #fff;\n  background: #264c66; }\n\n/*********************************************\n * IMAGES\n *********************************************/\n.reveal section img {\n  margin: 15px 0px;\n  background: rgba(255, 255, 255, 0.12);\n  border: 4px solid #333;\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); }\n\n.reveal section img.plain {\n  border: 0;\n  box-shadow: none; }\n\n.reveal a img {\n  -webkit-transition: all .15s linear;\n  -moz-transition: all .15s linear;\n  transition: all .15s linear; }\n\n.reveal a:hover img {\n  background: rgba(255, 255, 255, 0.2);\n  border-color: #3b759e;\n  box-shadow: 0 0 20px rgba(0, 0, 0, 0.55); }\n\n/*********************************************\n * NAVIGATION CONTROLS\n *********************************************/\n.reveal .controls .navigate-left,\n.reveal .controls .navigate-left.enabled {\n  border-right-color: #3b759e; }\n\n.reveal .controls .navigate-right,\n.reveal .controls .navigate-right.enabled {\n  border-left-color: #3b759e; }\n\n.reveal .controls .navigate-up,\n.reveal .controls .navigate-up.enabled {\n  border-bottom-color: #3b759e; }\n\n.reveal .controls .navigate-down,\n.reveal .controls .navigate-down.enabled {\n  border-top-color: #3b759e; }\n\n.reveal .controls .navigate-left.enabled:hover {\n  border-right-color: #74a7cb; }\n\n.reveal .controls .navigate-right.enabled:hover {\n  border-left-color: #74a7cb; }\n\n.reveal .controls .navigate-up.enabled:hover {\n  border-bottom-color: #74a7cb; }\n\n.reveal .controls .navigate-down.enabled:hover {\n  border-top-color: #74a7cb; }\n\n/*********************************************\n * PROGRESS BAR\n *********************************************/\n.reveal .progress {\n  background: rgba(0, 0, 0, 0.2); }\n\n.reveal .progress span {\n  background: #3b759e;\n  -webkit-transition: width 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985);\n  -moz-transition: width 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985);\n  transition: width 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985); }\n", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "/*\n\nZenburn style from voldmar.ru (c) Vladimir Epifanov <voldmar@voldmar.ru>\nbased on dark.css by Ivan Sagalaev\n\n*/\n\n.hljs {\n  display: block;\n  overflow-x: auto;\n  padding: 0.5em;\n  background: #3f3f3f;\n  color: #dcdcdc;\n}\n\n.hljs-keyword,\n.hljs-selector-tag,\n.hljs-tag {\n  color: #e3ceab;\n}\n\n.hljs-template-tag {\n  color: #dcdcdc;\n}\n\n.hljs-number {\n  color: #8cd0d3;\n}\n\n.hljs-variable,\n.hljs-template-variable,\n.hljs-attribute {\n  color: #efdcbc;\n}\n\n.hljs-literal {\n  color: #efefaf;\n}\n\n.hljs-subst {\n  color: #8f8f8f;\n}\n\n.hljs-title,\n.hljs-name,\n.hljs-selector-id,\n.hljs-selector-class,\n.hljs-section,\n.hljs-type {\n  color: #efef8f;\n}\n\n.hljs-symbol,\n.hljs-bullet,\n.hljs-link {\n  color: #dca3a3;\n}\n\n.hljs-deletion,\n.hljs-string,\n.hljs-built_in,\n.hljs-builtin-name {\n  color: #cc9393;\n}\n\n.hljs-addition,\n.hljs-comment,\n.hljs-quote,\n.hljs-meta {\n  color: #7f9f7f;\n}\n\n\n.hljs-emphasis {\n  font-style: italic;\n}\n\n.hljs-strong {\n  font-weight: bold;\n}\n", ""]);

// exports


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKCXhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCgl4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCgl2ZXJzaW9uPSIxLjEiCgl3aWR0aD0iMTkyIgoJaGVpZ2h0PSI5NiI+Cgk8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDQuNjMxNjYsLTQ0NS41NDcwNCkiPgoJCTxnIHRyYW5zZm9ybT0ibWF0cml4KDIsMCwwLDIsLTE0MC4xNTc0OSwtNDkzLjIyMzA0KSI+CgkJCTxwYXRoCgkJCQlkPSJtIDk5Ljk3MzU3NSw0NzkuNDg0MDQgMTQuMjA0MDA1LDAgYyA0LjE2OTMsMC4wMzU0IDcuMTkwMywxLjIzNjY5IDkuMDYzLDMuNjA0IDEuODcyNjMsMi4zNjczNSAyLjQ5MDk2LDUuNjAwMzUgMS44NTUsOS42OTkgLTAuMjQ3MzcsMS44NzI2OCAtMC43OTUwNCwzLjcxMDAxIC0xLjY0Myw1LjUxMiAtMC44MTI3LDEuODAyMDEgLTEuOTQzMzcsMy40MjczNCAtMy4zOTIsNC44NzYgLTEuNzY2NywxLjgzNzMzIC0zLjY1NzAzLDMuMDAzMzMgLTUuNjcxLDMuNDk4IC0yLjAxNDAzLDAuNDk0NjcgLTQuMDk4NjksMC43NDIgLTYuMjU0LDAuNzQyIGwgLTYuMzYsMCAtMi4wMTQwMDUsMTAuMDcgLTcuMzY3LDAgNy41NzksLTM4LjAwMSAwLDAgbSA2LjIwMTAwNSw2LjA0MiAtMy4xOCwxNS45IGMgMC4yMTE5OCwwLjAzNTMgMC40MjM5OCwwLjA1MyAwLjYzNiwwLjA1MyAwLjI0NzMyLDAgMC40OTQ2NSwwIDAuNzQyLDAgMy4zOTE5OCwwLjAzNTMgNi4yMTg2NCwtMC4zMDAzMyA4LjQ4LC0xLjAwNyAyLjI2MTMsLTAuNzQxOTkgMy43ODA2NCwtMy4zMjEzMiA0LjU1OCwtNy43MzggMC42MzU5NywtMy43MDk5OCAtM2UtNSwtNS44NDc2NSAtMS45MDgsLTYuNDEzIC0xLjg3MjY5LC0wLjU2NTMxIC00LjIyMjM2LC0wLjgzMDMxIC03LjA0OSwtMC43OTUgLTAuNDI0MDIsMC4wMzUzIC0wLjgzMDM1LDAuMDUzIC0xLjIxOSwwLjA1MyAtMC4zNTMzNSwyZS01IC0wLjcyNDM1LDJlLTUgLTEuMTEzLDAgbCAwLjA1MywtMC4wNTMiIC8+CgkJCTxwYXRoCgkJCQlkPSJtIDEzMy40ODc1Niw0NjkuMzYxMDQgNy4zMTM5OSwwIC0yLjA2NzAxLDEwLjEyMyA2LjU3MjAxLDAgYyAzLjYwMzk3LDAuMDcwNyA2LjI4OTI5LDAuODEyNjkgOC4wNTYsMi4yMjYgMS44MDE5NywxLjQxMzM2IDIuMzMxOTgsNC4wOTg2OSAxLjU5MDAyLDguMDU2IGwgLTMuNTUwOTksMTcuNjQ5IC03LjQyLDAgMy4zOTIsLTE2Ljg1NCBjIDAuMzUzMjgsLTEuNzY2NjUgMC4yNDczLC0zLjAyMDk4IC0wLjMxOCwtMy43NjMgLTAuNTY1MzYsLTAuNzQxOTggLTEuNzg0MzUsLTEuMTEyOTggLTMuNjU3MDIsLTEuMTEzIGwgLTUuODgzMDIsLTAuMDUzIC00LjM0NiwyMS43ODMgLTcuMzEzOTYsMCA3LjYzMTk2LC0zOC4wNTQgMCwwIiAvPgoJCQk8cGF0aAoJCQkJZD0ibSAxNjIuODA2NTgsNDc5LjQ4NDA0IDE0LjIwNCwwIGMgNC4xNjkyOCwwLjAzNTQgNy4xOTAzLDEuMjM2NjkgOS4wNjI5OSwzLjYwNCAxLjg3MjYzLDIuMzY3MzUgMi40OTA5NSw1LjYwMDM1IDEuODU0OTksOS42OTkgLTAuMjQ3MzcsMS44NzI2OCAtMC43OTUwMywzLjcxMDAxIC0xLjY0Myw1LjUxMiAtMC44MTI3LDEuODAyMDEgLTEuOTQzMzcsMy40MjczNCAtMy4zOTIsNC44NzYgLTEuNzY2NjksMS44MzczMyAtMy42NTcwMywzLjAwMzMzIC01LjY3MDk5LDMuNDk4IC0yLjAxNDAyLDAuNDk0NjcgLTQuMDk4NywwLjc0MiAtNi4yNTQsMC43NDIgbCAtNi4zNjAwMSwwIC0yLjAxNCwxMC4wNyAtNy4zNjY5OSwwIDcuNTc5MDEsLTM4LjAwMSAwLDAgbSA2LjIwMDk4LDYuMDQyIC0zLjE4LDE1LjkgYyAwLjIxMTk5LDAuMDM1MyAwLjQyMzk5LDAuMDUzIDAuNjM2LDAuMDUzIDAuMjQ3MzIsMCAwLjQ5NDY1LDAgMC43NDIsMCAzLjM5MTk4LDAuMDM1MyA2LjIxODY1LC0wLjMwMDMzIDguNDgsLTEuMDA3IDIuMjYxMzEsLTAuNzQxOTkgMy43ODA2NCwtMy4zMjEzMiA0LjU1OCwtNy43MzggMC42MzU5NywtMy43MDk5OCAtM2UtNSwtNS44NDc2NSAtMS45MDgsLTYuNDEzIC0xLjg3MjY5LC0wLjU2NTMxIC00LjIyMjM2LC0wLjgzMDMxIC03LjA0OSwtMC43OTUgLTAuNDI0MDIsMC4wMzUzIC0wLjgzMDM1LDAuMDUzIC0xLjIxOSwwLjA1MyAtMC4zNTMzNSwyZS01IC0wLjcyNDM1LDJlLTUgLTEuMTEzLDAgbCAwLjA1MywtMC4wNTMiIC8+CgkJPC9nPgoJPC9nPgo8L3N2Zz4K"

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _content = __webpack_require__(3);

var _content2 = _interopRequireDefault(_content);

__webpack_require__(2);

var _reveal = __webpack_require__(4);

var _reveal2 = _interopRequireDefault(_reveal);

__webpack_require__(6);

__webpack_require__(7);

__webpack_require__(8);

__webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Actually write the content HTML.


// Stylesheet imports.


// Reveal dependencies.
document.write(_content2.default);

// Reveal proper.
// Import the content HTML.


_reveal2.default.initialize({
  controls: -1 == window.location.host.indexOf("localhost") && -1 == window.location.host.indexOf("0.0.0.0"),
  progress: false,
  history: true,
  center: true,
  width: 1920,
  height: 1080,

  transition: 'fade', // none/fade/slide/convex/concave/zoom

  // Optional reveal.js plugins
  dependencies: [{ src: 'node_modules/reveal.js/lib/js/classList.js', condition: function condition() {
      return !document.body.classList;
    } }, { src: 'node_modules/reveal.js/plugin/highlight/highlight.js', async: true, condition: function condition() {
      return !!document.querySelector('pre code');
    }, callback: function callback() {
      hljs.initHighlightingOnLoad();
    } }, { src: 'node_modules/reveal.js/plugin/notes/notes.js', async: true }]
});

// Make the Reveal object available to plugins.
window.Reveal = _reveal2.default;

/***/ })
/******/ ]);