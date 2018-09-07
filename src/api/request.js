/*
*author: wuyuxu
*day: 2018-01-29
*/
const axios = require('axios');        
const querystring = require('querystring');

const apiRequest = function (path,options) {
  // 增强体验：加载中(静默模式时不显示)
  if(! (options && options.silence)){
    //var loading = Loading();
  }
  // 超时自动关闭
  setTimeout(() => {
    //loading.close();
  }, 10000);
  var options = options || {};
  return new Promise(function(resolve,reject){
    var headers = {}
    var params = options.params || {},
      data = options.data || {};
    if(options && options.headers) {
      options.headers = Object.assign( headers, options.headers );
    }else{
      options.headers = headers;
    }
    if(!path){
      reject({message: '请求缺少path参数'});
    }
    axios({
      method: options.method || 'get',
      url: path,
      data: data,
      params: params,
      headers: options.headers,
      timeout: 10000,
      paramsSerializer: function(params) {
        return querystring.stringify(params);
      },
    })
    .then(function (response) {
      // 隐藏加载提示
      //loading.close();
      resolve(response.data);
    })
    .catch(function (error) {
      // 隐藏加载提示
      //loading.close();
      if (error.response) {
        //console.log("error.response.data",error.response.data);
        var status = error.response.status;
        const router = require('../router').default;
        // status为 401 时为未授权，统一跳转到登录页处理
        // if(status == 401) {
        //   if(!options.noRedirect){
        //     router.push({path: '/login'})
        //   }
        // }
        reject(error.response.data);
      } else if (error.request) {
        //console.log("error.request",error);
        reject(error.request);
      } else {
        //console.log('Error', error.message);
        reject(error.message);
      }
    });
  })
};

module.exports = apiRequest;
