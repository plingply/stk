import vue from 'vue'
import vueRouter from 'vue-router'
import App from './app'
import axios from './plugin/ajax/index'
import store from './store'
import filters from "./plugin/flites/index"
// //引入
// import FastClick from 'fastclick'
// //初始化FastClick实例。在页面的DOM文档加载完成后
// FastClick.attach(document.body)

// FastClick.prototype.onTouchEnd = function (event) {
//     if (event.target.hasAttribute("type") && event.target.getAttribute("type") == "text") {
//         event.preventDefault();
//         return false;
//     }
// }


import 'vue-ydui/dist/ydui.base.css'
import './less/ydui-reset.less'
import './less/index.less'

vue.use(vueRouter)
vue.use(axios)
filters(vue)

// ui组件引入
import { Tab, TabPanel } from 'vue-ydui/dist/lib.rem/tab';
import { InfiniteScroll } from 'vue-ydui/dist/lib.rem/infinitescroll';
import { Toast, Loading } from 'vue-ydui/dist/lib.rem/dialog';
import {Popup} from 'vue-ydui/dist/lib.rem/popup';
import {CheckBox, CheckBoxGroup} from 'vue-ydui/dist/lib.rem/checkbox';

vue.component(Tab.name, Tab);
vue.component(TabPanel.name, TabPanel);
vue.component(InfiniteScroll.name, InfiniteScroll);
vue.component(Popup.name, Popup);
vue.component(CheckBox.name, CheckBox);
vue.component(CheckBoxGroup.name, CheckBoxGroup);
vue.prototype.$dialog = {
    toast: Toast,
    loading: Loading,
};
//实例化VueRouter
import routes from './router/index'
let router = new vueRouter({
    routes
})

router.beforeEach((to, from, next)=>{
    window.scroll(0, 0);
    setInterval(()=>{
        if(store.state.user.id){
            next()
        }
    },100)
})

new vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app')