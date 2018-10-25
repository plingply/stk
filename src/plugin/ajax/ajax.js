import axios from 'axios';
import tokenFun from '../token'
import { Alert } from 'vue-ydui/dist/lib.rem/dialog';

let Promise = require('es6-promise').Promise;
// let baseUrl = "http://local.xyb.com"
let baseUrl = "https://dev.imxyb.com"
const Axios = axios.create({
    baseURL: baseUrl,
    timeout: 60000,
    withCredentials: false, //带上 cookie
})


// 添加一个请求拦截器
Axios.interceptors.request.use(config => {

    // 通过请求时候传递 notShowError 判断是否拦截的时候提示错误 true 为拦截 
    // 通过请求时候传递 errorMsg是否显示自定义提示 这里是做错误提示处理

    /*
        示例代码
        this.$http.get(url,{
            data,
            notShowError:true,
            errorMsg:"显示自定义提示"
        })

        this.$http.post(url,{
            data,
            notShowError:true,
            errorMsg:"显示自定义提示"
        })
    */

    let notShowError = config.data ? config.data.notShowError : false
    config.notShowError = notShowError
    config.errorMsg = (config.data && config.data.errorMsg) ? config.data.errorMsg : false

    //POST传参序列化
    if (config.method === 'post') {
        // 数据序列化成表单
        if (config.data && config.data.data) {
            const formData = new FormData()
            Object.keys(config.data.data).forEach(key => formData.append(key, config.data.data[key]))
            config.data = formData
        }
    }

    if (config.method === 'put' || config.method == 'delete') {
        let url = ''
        for (let key in config.data) {
            url += key + '=' + config.data[key] + '&'
        }
        url = url.slice(0, url.length - 1)
        config.data = url
    }

    if (config.method === 'get' && config.url.indexOf('/api/') != -1 && config.data) {
        let url = '?'
        for (let key in config.data) {
            url += key + '=' + config.data[key] + '&'
        }
        url = url.slice(0, url.length - 1)
        config.url += url
    }

    // 存储 token
    if (!tokenFun.getToken('token')) {
        //存储token 后跳至  如果不需要 可以删除此步
    } else {
        config.headers.authorization = tokenFun.getToken('token')
    }
    return config
}, error => {
    Alert({ mes: '参数错误！' });
    return Promise.reject(error)
})

//添加一个返回拦截器
Axios.interceptors.response.use(res => {
    const { data } = res

    if (data.status == 'ok') {
        return data
    } else {
        let msg = res.config.errorMsg ? res.config.errorMsg : false
        //处理错误
        if (data.code == 'no_login' || data.code == '5001' || data.code == '5002' || data.code == '5003' || data.code == '5004' || data.code == '5005') {
            Alert({ mes: '未登录' });
        } else if (data.code == 'NO_AUTHORITY') {
            Alert({ mes: '没有权限' });
        } else if (data.code == 'NO_POWER') {
            Alert({ mes: '没有权限' });
        } else {
            // 通过请求时候传递 notShowError 判断是否拦截的时候提示错误 true 为拦截 
            if (!res.config.notShowError) {
                Alert({ mes: data.msg });
            }
        }
        return data
    }

}, error => {
    Alert({ mes: "网络错误，请检查网络再试" });
    return Promise.reject(error)
})

export default Axios