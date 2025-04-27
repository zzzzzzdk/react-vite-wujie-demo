import axios from 'axios'
import { Message } from "@yisa/webui";
import { removeToken, getToken, getRToken, setRToken, setToken, getID } from "./cookie";
import qs from 'qs';

axios.defaults.baseURL = window.YISACONF.api_host;
axios.defaults.timeout = 5 * 60 * 1000


/**
 * 过期ajax数据存储, ajax请求的时候判断一下token是否过期，
 * 如果过期用refreshToken去请求token和refreshToken并把当前请求的参数存储起来，
 * 如果刷新成功就拿存储的参数执行新的ajax请求，如果失败就直接退出登录
 */
let ajaxArr = []
let refreshTag = false


/**
 * @description  请求全局拦截
 * @param  {boolean} transFormData  post,put方法 true转form提交表单方式
 * */
axios.interceptors.request.use(
  config => {
    if (config.data && config.data.transFormData) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
      delete config.data.transFormData
      config.data = qs.stringify(config.data)
    }
    axios.defaults.headers.common['Authorization'] = getToken()
    return config
  },
  error => {
    return Promise.reject(error)
  })


/**
 * @description ajax 请求
 * @param {Object} ajaxData 配置 ajax 请求的键值对集合
 * @param {String} ajaxData.type 创建请求使用的方法
 * @param {String} ajaxData.url 请求服务器的 URL
 * @param {Object} ajaxData.data 与请求一起发送的 URL 参数
 */
function ajax(ajaxData = {}) {

  if (window.user_id && getID() != window.user_id) {
    window.location.reload()
    return
  }

  if (ajaxData.transFormData) {
    ajaxData.data = { ...ajaxData.data, transFormData: true }
  }

  return new Promise((resolve, reject) => {

    if (refreshTag) {
      ajaxArr.push({
        data: ajaxData,
        resolve: resolve,
        reject: reject
      })
      return
    }

    axios({ ...ajaxData }).then(res => {
      if (res.data.status === 30009 || res.data.status === 40006 || res.data.status === 40005) {
        if (getRToken()) {
          refreshTag = true
          ajaxArr.push({
            data: ajaxData,
            resolve: resolve,
            reject: reject
          })
          getNewToken()
        } else {
          logout()
        }
      } else {
        if (res.data.status === 20000) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      }
    }).catch(err => {
      let response = err.response
      if (response) {
        switch (response.status) {
          case 401:
            logout()
            break
          case 500:
            Message.error('服务器响应失败')
            break
          case 504:
            Message.error('请求超时')
            break
        }
      }
      reject(err)
    })
  })
}


const logout = () => {
  removeToken()
  window.location.replace(YISACONF.logout_url)
}


/*
  获取新token
*/
const getNewToken = () => {
  axios.get('/refresh_token', {
    params: {
      token: getRToken()
    }
  }).then(res => {
    if (res.data.status !== 20000) {
      logout()
    } else {
      const { refresh_token, apisix_token } = res.data
      setRToken(refresh_token)
      setToken(apisix_token)
      refreshTag = false
      ajaxArr.forEach((item) => {
        ajax(item.data).then(res => {
          item.resolve(res)
        }).catch(err => {
          item.reject(res)
        })
      })
      ajaxArr = []

    }
  }).catch(err => {
    logout()
  })
}

export default ajax


