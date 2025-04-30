/**

!function(o){var r={};function n(t){if(r[t])return r[t].exports;var e=r[t]={exports:{},id:t,loaded:!1};return o[t].call(e.exports,e,e.exports,n),e.loaded=!0,e.exports}n.m=o,n.c=r,n.p="",n(0)}([function(t,e,o){t.exports=o(1)},function(t,e){"use strict";var o,r,n;r=createIS(),n=new XMLHttpRequest,"undefined"!=typeof yscUrl?(n.open("get",yscUrl,!1),n.send(null),200===n.status&&20000===(o=JSON.parse(n.responseText)).status?(n=Object.prototype.toString.call(o.data),window.YISACONF="[object String]"===n?r.aesUtil.decrypt(o.data,atob("M1JyMHpsbXpPMUlUQWVZUQ==")):o.data):window.location.href=globalErrorUrl):window.location.href=globalErrorUrl}]);

 */

function getToken() {
  let cookie = document.cookie.replace(/\s/g, '')
  let cookieArr = cookie.split(';')
  let info = {}
  cookieArr.forEach(elem => {
    let elemArr = elem.split('=')
    let key = elemArr[0]
    let value = elemArr[1]
    if (!info.hasOwnProperty(key)) {
      info[key] = value
    }
  })
  return info.YSTOKEN || ""
}


function getYSC() {
  const isInstance = window.createIS();
  const ciphertext = 'M1JyMHpsbXpPMUlUQWVZUQ==';
  const xhr = new XMLHttpRequest();
  if (typeof yscUrl === 'undefined') {
    window.location.href = globalLoginUrl;
    return false;
  }
  xhr.addEventListener("error", (e) => {
    console.log(e)
    window.location.href = window.globalLoginUrl
  });
  xhr.open('get', baseApi + yscUrl, false);
  xhr.setRequestHeader("Authorization", getToken());
  // xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
  // xhr.setRequestHeader("X-HTTP-Method-Override","get");
  xhr.send();
  switch (xhr.status) {
    case 200:
    case 201:
    case 202:
    case 204:
      const data = JSON.parse(xhr.responseText)
      const dataType = Object.prototype.toString.call(data.data);
      if (dataType === '[object String]') {
        window.YISACONF = isInstance.aesUtil.decrypt(data.data, atob(ciphertext));
      } else {
        window.YISACONF = data.data;
      }
      document.title = window.YISACONF.sys_text
      break
    case 400:
    case 401:
      console.log("用户无权限")
      window.location.href = window.globalLoginUrl
      break
    case 403:
    case 404:
    case 405:
    case 406:
    case 408:
    case 409:
    case 410:
    case 413:
    case 414:
    case 415:
    case 429:
      console.log('客户端响应错误')
      window.location.href = window.globalLoginUrl
      break
    case 500:
      console.log('服务器响应失败')
      window.location.href = window.globalLoginUrl
      break
    case 503:
      console.log('服务器暂时处于不可用的状态')
      window.location.href = window.globalLoginUrl
      break
    case 504:
      console.log('请求超时')
      window.location.href = window.globalLoginUrl
      break
    default:
      console.log('其他错误：', xhr)
      window.location.href = window.globalLoginUrl
      break
  }
}

getYSC();
