!function(e){function t(t){for(var r,o,i=t[0],l=t[1],c=t[2],s=0,d=[];s<i.length;s++)o=i[s],a[o]&&d.push(a[o][0]),a[o]=0;for(r in l)Object.prototype.hasOwnProperty.call(l,r)&&(e[r]=l[r]);for(f&&f(t);d.length;)d.shift()();return u.push.apply(u,c||[]),n()}function n(){for(var e,t=0;t<u.length;t++){for(var n=u[t],r=!0,i=1;i<n.length;i++){var l=n[i];0!==a[l]&&(r=!1)}r&&(u.splice(t--,1),e=o(o.s=n[0]))}return e}var r={},a={0:0},u=[];function o(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=e,o.c=r,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(t){return e[t]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="";var i=window.webpackJsonp=window.webpackJsonp||[],l=i.push.bind(i);i.push=t,i=i.slice();for(var c=0;c<i.length;c++)t(i[c]);var f=l;u.push([17,1]),n()}([,,,function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var r=n(6),a=n.n(r);for(var u in r)"default"!==u&&function(e){n.d(t,e,function(){return r[e]})}(u);t.default=a.a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={data:function(){return{data:"PAGE2页面"}}}},function(e,t,n){},,,function(e,t,n){"use strict";var r=function(){var e=this,t=e.$createElement;return(e._self._c||t)("h1",{staticClass:"xxxx"},[e._v(e._s(e.data))])},a=[];n.d(t,"a",function(){return r}),n.d(t,"b",function(){return a})},,,,,,,function(e,t,n){"use strict";var r=c(n(11)),a=c(n(20)),u=c(n(59)),o=c(n(23)),i=c(n(46));n(51);var l=c(n(53));function c(e){return e&&e.__esModule?e:{default:e}}r.default.use(a.default),r.default.prototype.$http=o.default;var f=new a.default({routes:l.default});new r.default({store:i.default,router:f,render:function(e){return e(u.default)}}).$mount("#app")},,,,function(e,t,n){"use strict";var r=n(3);n.n(r).a},,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,a=(r=n(24))&&r.__esModule?r:{default:r};t.default={install:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"$http";Object.defineProperty(e.prototype,t,{value:a.default})}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=u(n(25)),a=u(n(44));function u(e){return e&&e.__esModule?e:{default:e}}var o=n(45).Promise,i=r.default.create({baseURL:"",timeout:5e3,withCredentials:!0});i.interceptors.request.use(function(e){if("post"===e.method){var t=new FormData;Object.keys(e.data).forEach(function(n){return t.append(n,e.data[n])}),e.data=t}if("put"===e.method||"delete"==e.method){var n="";for(var r in e.data)n+=r+"="+e.data[r]+"&";n=n.slice(0,n.length-1),e.data=n}if("get"===e.method&&-1!=e.url.indexOf("/api/")&&e.data){var u="?";for(var o in e.data)u+=o+"="+e.data[o]+"&";u=u.slice(0,u.length-1),e.url+=u}return a.default.getToken("token")&&(e.headers.Authorization=a.default.getToken("token")),e},function(e){return alert("参数错误！"),o.reject(e)}),i.interceptors.response.use(function(e){var t=e.data;return t.status,t},function(e){return alert("网络错误，请检查网络再试！"),o.reject(e)}),t.default=i},,,,,,,,,,,,,,,,,,,,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={setToken:function(e,t){localStorage?localStorage.setItem(e,t):window.navigator.cookieEnabled?document.cookie=e+"="+t:alert("浏览器版本太低，请升级浏览器!")},getToken:function(e){if(localStorage&&localStorage.getItem(e))return localStorage.getItem(e);if(window.navigator.cookieEnabled){for(var t=document.cookie.split(";"),n=0;n<t.length;n++){var r=t[n];if(r.split("=")[0].trim()==e)return r.split("=")[1]}return null}return null},removeToken:function(e){localStorage&&localStorage.getItem(e)&&localStorage.removeItem(e),window.navigator.cookieEnabled&&(document.cookie=e+"=; expires=-1")}}},,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=l(n(11)),a=l(n(47)),u=l(n(48)),o=l(n(49)),i=l(n(50));function l(e){return e&&e.__esModule?e:{default:e}}r.default.use(a.default);var c=new a.default.Store({strict:!1,state:u.default,mutations:o.default,actions:i.default});t.default=c},,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={}},function(e,t,n){},,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,a=[{path:"/Page1",name:"page1",component:((r=n(60))&&r.__esModule?r:{default:r}).default},{path:"/Page2",name:"page2",component:n(56)}];t.default=a},function(e,t,n){"use strict";var r=n(4);n.n(r).a},,function(e,t,n){"use strict";n.r(t);var r=n(10),a=n(5);for(var u in a)"default"!==u&&function(e){n.d(t,e,function(){return a[e]})}(u);n(57);var o=n(1),i=Object(o.a)(a.default,r.a,r.b,!1,null,"27d11c54",null);t.default=i.exports},function(e,t,n){"use strict";var r=n(7);n.n(r).a},,function(e,t,n){"use strict";n.r(t),n(21);var r=n(1),a=Object(r.a)({},function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("div",{staticClass:"banner"},[e._v("\n    Vue-webpack4项目模板1\n  ")]),e._v(" "),n("ul",[n("router-link",{class:{active:"page1"==e.$route.name},attrs:{tag:"li",to:{name:"page1"}}},[e._v("Page1")]),e._v(" "),n("router-link",{class:{active:"page2"==e.$route.name},attrs:{tag:"li",to:{name:"page2"}}},[e._v("Page2")])],1),e._v(" "),n("div",{staticClass:"contnet"},[n("router-view")],1)])},[],!1,null,"8bba42c0",null);t.default=a.exports},function(e,t,n){"use strict";n.r(t),n(54);var r=n(1),a=Object(r.a)({},function(){return this.$createElement,this._self._c,this._m(0)},[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("h1",[e._v("哈哈哈")]),e._v(" "),n("h2",[e._v("测试样式")]),e._v(" "),n("h3",[e._v("组件内样式")])])}],!1,null,"0fd38a1a",null);t.default=a.exports}]);