import axios from 'axios'



const sourceUrl = 'zyContract';

const instance = axios.create({
    baseURL:'http://192.168.0.222:4000/' + sourceUrl,
    timeout:0,
    // transformRequest:[function(data){
    //   return data
    // }],
    // transformResponse:[function(data){
    //   return data
    // }],
    headers:{'Content-type':'application/json'}
})

// Add a request interceptor
// 全局请求拦截
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });

/**
 * get请求
 * @param {*} url 请求地址
 * @param {*} params 查询条件
 */
export function get(url,params){
    return instance.get(url,(
        params
    ))
}

/**
 * post请求
 * @param {*} url 请求地址
 * @param {*} data 数据
 */
export function post(url,data){
    return instance.post(url,data);
}


/**
 * put请求
 * @param {*} url 请求地址
 * @param {*} data 数据
 */
export function put(url,data){
    return instance.put(url,data);
}

/**
 * del请求
 * @param {*} url 请求地址
 * @param {*} data 数据
 */
export function del(url,data){
    return instance.delete(url,data);
}