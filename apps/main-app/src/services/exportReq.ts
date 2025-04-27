import ajax from '@/utils/axios.config'
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { Message } from '@yisa/webui'
import { getToken } from "@/utils/cookie";

const api = {

  // 发起导出
  startExport: function <U, T>(url = '', data?: U) {
    return ajax<T, U>({
      method: "post",
      url: url,
      data: data
    });
  },

  // 请求进度
  requestProgress: function <U, T>(url = '/v1/common/export', data: U) {
    return ajax<T, U>({
      method: "post",
      url: url,
      data: data
    });
  },

  getExportInfo: async function <U, T>(url = '/v1/export/progress', data: U, options: {
    onOpen?: (data: any) => void,
    onMessage?: (data: any) => void,
    onError?: (err: any) => void
  }) {
    let controller = new AbortController()
    const signal = controller.signal
    const currentUrl = url.indexOf('http') > -1 ? url : `${window.YISACONF.api_host}${url}`
    fetchEventSource(currentUrl, {

      method: 'POST',

      signal: signal,

      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        "Authorization": getToken() ?? "",
        'Frontend-Route':  window.location.hash.split('?')[0]
      },

      body: JSON.stringify(
        data
      ),
      async onopen(response) {//建立连接的回调
        if (response.status !== 200) {
          options.onError?.(response)
          Message.error(response.statusText)
        } else {
          options.onOpen?.(response)
        }
      },
      onmessage(msg) {   //接收一次数据段时回调，因为是流式返回，所以这个回调会被调用多次
        if (msg.event == '') {
          //进行连接正常的操作
          options.onMessage?.(msg)
        } else if (msg.event === 'close') {
          controller.abort();
        }
      },
      onclose() {//正常结束的回调
        controller.abort() //关闭连接
      },

      onerror(err) {//连接出现异常回调
        options.onError?.(err)
        // 必须抛出错误才会停止
        throw err
      }

    })

  }
}

export default {
  ...api
}
