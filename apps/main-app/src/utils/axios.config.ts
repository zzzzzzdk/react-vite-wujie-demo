import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios'
import { isObject } from '@/utils/is'
import { Message } from "@yisa/webui";
import { getToken } from "./cookie";
import omit from '@/utils/omit'

axios.defaults.baseURL = window.YISACONF.api_host;
axios.defaults.timeout = 2 * 60 * 1000
axios.defaults.headers.common['Authorization'] = getToken() ?? ""

type Method = 'get' | 'post' | 'put' | 'delete' | 'patch'

interface AjaxDataProps extends AxiosRequestConfig {
  method?: Method;
  url: string;
  data?: any;
  onUploadProgress?: AxiosRequestConfig["onUploadProgress"];
  onGlobalLoading?: (loading: boolean) => void;
}

// 泛型函数，接口，类
export interface ApiResponse<T, U = any> {
  status?: number;
  message?: string,
  data?: T;
  totalRecords?: number;
  usedTime?: number;
  personInfoData?: U
  personInfoDataRecords?: number //身份信息（以图）
  [key: string]: any;
}

window.cancelTokens = []

// 接口请求过慢的，添加全局loading
axios.interceptors.request.use(config => {
  // console.log(config)
  if (config['onGlobalLoading']) {
    config['onGlobalLoading'](true)

    const source = axios.CancelToken.source();
    window.cancelTokens.push(source);
    config.cancelToken = source.token;
  }
  return config;
}, error => Promise.reject(error));

export const cancelAllRequests = () => {
  window.cancelTokens.forEach((source) => {
    source.cancel('Operation canceled due to route change.');
  });
  window.cancelTokens.length = 0; // 清空数组
};


/**
 * @description ajax 请求
 * @param {Object} ajaxData 配置 ajax 请求的键值对集合U
 * @param {String} ajaxData.method 创建请求使用的方法
 * @param {String} ajaxData.url 请求服务器的 URL
 * @param {Object} ajaxData.data 与请求一起发送的 URL 参数
 */
// 类型T为返回数据Data的数据类型 U为响应的数据类型和data同级
function ajax<T = any, U = {}>(ajaxData: AjaxDataProps) {
  return new Promise<ApiResponse<T, U>>((resolve, reject) => {
    if (!isObject(ajaxData)) {
      return reject(new Error('ajax请求配置错误'))
    }
    let method: Method = ajaxData.method || 'get'
    method = (method.toLowerCase() as Method)
    let url = ajaxData.url
    // let data = method === 'get' ? { params: ajaxData.data } : ajaxData.data
    let data =
      method === 'get' ?
        { params: ajaxData.data }
        :
        method === 'delete' || method === 'post' || method === 'put' ?
          { data: ajaxData.data }
          :
          ajaxData.data
    const axiosRequestConfig = omit(ajaxData, ['method', 'url', 'data'])

    let onUploadProgress = ajaxData.onUploadProgress
    axios({
      method,
      url,
      ...data,
      ...axiosRequestConfig,
      onUploadProgress: onUploadProgress,
      headers: { 'Frontend-Route': window.location.hash.split('?')[0] }
    })
      .then((res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 202:
          case 204:

            if (ajaxData.onGlobalLoading) {
              cancelAllRequests()
              ajaxData.onGlobalLoading(false)
            }

            resolve({
              status: res.status,
              ...res.data
            })
            break
        }
      }).catch(err => {
        console.log(err)
        if (err.message && err.message === "canceled") {
          console.log('请求已取消')
          // Message.warning('请求已取消')
        }
        if (ajaxData.onGlobalLoading) {
          cancelAllRequests()
          ajaxData.onGlobalLoading(false)
        }

        let response = err.response || {}
        const msg = response.data ? response.data.message : "服务繁忙，请联系以萨运维人员处理。"
        if (response.status) {
          switch (response.status) {
            case 401:
              Message.error("用户权限已失效！")
              // 如果是在登录页,不需要重定向
              if (window.location.hash.indexOf('#/login') == -1) {
                window.location.href = window.YISACONF.login_url + '&target_url=' + window.location.href
              }
              break
            case 403:
              Message.error(msg)
              break
            case 404:
              Message.error(`${url}: ${response.statusText}`)
              break
            case 400:
            case 405:
            case 406:
            case 408:
            case 409:
            case 410:
            case 413:
            case 414:
            case 415:
            case 429:
              Message.error(msg)
              break
            case 500:
            case 503:
            case 504:
              Message.error(msg)
              break
            default:
              // window.location.href = window.YISACONF.login_url
              Message.error(response.statusText)
              break
          }
        }
        return reject(err)
      })
  })
}

export default ajax


