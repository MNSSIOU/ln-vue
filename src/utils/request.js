import axios from 'axios'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: 'http://www.lndeveloper.cn',
  // 超时
  timeout: 10000
})

//请求拦截器
service.interceptors.request.use(config => {
    // 从localStorage中获取token
      let token = localStorage.getItem('token');
    // 如果有token, 就把token设置到请求头中Authorization字段中
      token && (config.headers.Authorization = token);
      return config;
    }, error => {
      return Promise.reject(error);
});

//响应拦截器
service.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response.data;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });


  export default service