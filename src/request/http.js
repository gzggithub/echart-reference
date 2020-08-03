/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios';
import QS from 'qs';
import {
    Message
} from 'element-ui'
//import router from './router'
//import store from '../store/index'

//axios.defaults.baseURL = 'https://fx.cp2y.com';

// 请求超时时间
axios.defaults.timeout = 100000;

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

var instanceJSON = axios.create({
    headers: {'Content-type':'application/json;charset=UTF-8'}
});

var instanceFile = axios.create({
    headers: {'Content-type':'multipart/form-data'}
});
// 请求拦截器
axios.interceptors.request.use(
    config => {
        // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
        let Authentication = sessionStorage.getItem('token');
        Authentication && (config.headers.Authentication = `Bearer-${Authentication}`);

        /*给每个请求添加同一参数*/
        if (config.method == 'get') {
            config.params = {
                ...config.params
            }
        } else if (config.method == 'delete') {
            config.params = {
                ...config.params
            }
        } else if (config.method == 'post') {
            config.data = QS.stringify({
                ...config.data,
            })
        } else if (config.method == 'put') {
            config.data = QS.stringify({
                ...config.data,
            })
        }
        return config;
    },

    error => {
        return Promise.error(error);
    })

//在main.js设置全局的请求次数，请求的间隙
axios.defaults.retry = 6;
axios.defaults.retryDelay = 1000;

// 响应拦截器
axios.interceptors.response.use(
    response => {

        if (response.data.code == 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
            Message({
                message: response.data.message,
                type: 'error',
                duration: 2000
            });
        }

    },
    // 服务器状态码不是200的情况
    error => {
        if (error.response.code) {
            switch (error.response.code) {
                // 401: 未登录
                // 未登录则跳转登录页面，并携带当前页面的路径
                // 在登录成功后返回当前页面，这一步需要在登录页操作。
                case 401:
                    /*router.replace({
                        path: '/login',
                        query: { redirect: router.currentRoute.fullPath }
                    });*/
                    break;
                    // 403 token过期
                    // 登录过期对用户进行提示
                    // 清除本地token和清空vuex中token对象
                    // 跳转登录页面
                case 403:
                    this.$message.error('登录过期，请重新登录');
                    // 清除token
                    sessionStorage.removeItem('token');
                    //store.commit('loginSuccess', null);
                    // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
                    setTimeout(() => {
                        /*router.replace({
                            path: '/login',
                            query: {
                                redirect: router.currentRoute.fullPath
                            }
                        });*/
                    }, 1000);
                    break;
                    // 404请求不存在
                case 404:
                    this.$message.error('网络请求不存在');
                    break;
                    // 其他错误，直接抛出错误提示
                default:
                    this.$message.error('错了哦，这是一条错误消息');
            }
            return Promise.reject(error.response);
        }
    }
);

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
                params: params
            })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}

/**
 * delete方法，对应delete请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function deletes(url, params) {
    return new Promise((resolve, reject) => {
        axios.delete(url, {
                params: params
            })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function postJSON(url, params) {
    return new Promise((resolve, reject) => {        
        instanceJSON.post(url, params)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function postFile(url, params) {
    return new Promise((resolve, reject) => {        
        instanceFile.post(url, params)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}
/**
 * put方法，对应put请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function put(url, params) {
    return new Promise((resolve, reject) => {
        axios.put(url, params)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}
