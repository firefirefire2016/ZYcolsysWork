import axios from 'axios'



//export const sourceUrl = 'zyContract';

const instance = axios.create({
  baseURL: 'http://192.168.0.222:4000/',
  //baseURL: 'http://106.52.145.96:4000/',
  timeout: 5000,
  // transformRequest:[function(data){
  //   return data
  // }],
  // transformResponse:[function(data){
  //   return data
  // }],
  headers: { 'Content-type': 'application/json' }
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
export function get(url, params, req) {
  //console.log(req);
  //http://192.168.0.222:4000/zyCollection/list/:page/:limit
  console.log('url=' + url + 'params = ' + params);
  if (!req) {
    req = {}
  }
  return instance.post(url, req, (
    params
  ))

}

/**
 * post请求
 * @param {*} url 请求地址
 * @param {*} data 数据
 */
export function post(url, data) {
  return instance.post(url, data);
}


/**
 * put请求
 * @param {*} url 请求地址
 * @param {*} data 数据
 */
export function put(url, data) {
  return instance.put(url, data);
}

/**
 * del请求
 * @param {*} url 请求地址
 * @param {*} data 数据
 */
export function del(url, data) {
 // console.log(JSON.stringify(data));
  return instance.put(url, data);
}

