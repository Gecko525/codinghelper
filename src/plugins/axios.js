"use strict";

import Vue from 'vue';
import axios from "axios";
import { Message } from 'element-ui'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  baseURL: 'http://localhost:3000/api'
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

console.log(config);
const _axios = axios.create(config);

_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Do something with response error
    console.log(error.response);
    if (error.response) {
      Message({
        message: '系统异常 ' + error.response.status,
        type: 'error'
      })
    }
    return Promise.reject(error);
  }
);

Plugin.install = function (Vue, options) {
  options
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get () {
        return _axios;
      }
    },
    $axios: {
      get () {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;
