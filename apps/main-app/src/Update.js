/* eslint-disable no-restricted-globals */
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Modal } from '@yisa/webui'

export default function Update(props) {
  const pollingWorker = useRef(null)
  const currentConfirmModal = useRef(null)

  // 创建Worker
  const createWorker = (f) => {
    var blob = new Blob(['(' + f.toString() + ')()']);
    var url = window.URL.createObjectURL(blob);
    var worker = new Worker(url);
    return worker;
  }


  const handleConfirm = () => {
    console.log('确定升级')
    window.location.reload();
  }

  const workerEvents = () => {
    // worker绑定
    pollingWorker.current = createWorker(function (e) {
      // 当前版本号
      let curVersion = ''
      let timer = null

      // 轮询间隔
      const pollingTime = 60 * 60 * 1000

      // 获取新版本
      function fetchNewVersion() {
        // 在 js 中请求首页地址不会更新页面
        const timestamp = new Date().getTime();
        let response = ''
        fetch(location.origin + '/fusion3/index.html?time=' + timestamp).then(res => {
          res.text().then(text => {
            response = text
            // 匹配当前index写入的版本号（新）
            let newVersion = text.match(/name="versionNow" content="(\S*)"/) ? text.match(/name="versionNow" content="(\S*)"/)[1] : "";
            // self.postMessage(`新版本号：${newVersion}`)
            // self.postMessage(`旧版本号：${curVersion}`)
            if (newVersion && newVersion !== curVersion) {
              // 版本更新，弹出提示
              self.postMessage('update');
            } else if (newVersion && newVersion === curVersion) {
              self.postMessage('');
            }
          })
        });
      }

      self.postMessage("getCurrentVersion");

      function setTimer() {
        if (process.env.NODE_ENV === 'production') {
          timer = setInterval(() => {
            fetchNewVersion()
          }, pollingTime)
        } else {
          // console.log('开发环境不轮询')
        }
      }

      function clearTimer() {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      }

      setTimer()

      // worker线程的message监听
      self.onmessage = function (evt) {
        if (evt.data) {
          // 赋值从外面获取的旧版本号
          const evtData = JSON.parse(evt.data)
          if (evtData.type === 'curVersionCallBack') {
            // self.postMessage(`改变了curversion${`evtData`.data}`)
            curVersion = evtData.data
            if (process.env.NODE_ENV === 'production') {
              fetchNewVersion()
            }
          }

          if (evtData.type === 'openDetection') { // 打开检测
            self.postMessage("getCurrentVersion");
            setTimer()
          }

          if (evtData.type === 'closeDetection') { // 关闭检测
            clearTimer()
          }
        }
      }
    })

    pollingWorker.current.onmessage = function (data) {
      // console.log("主线程收到：", data)
      // 收到此类型消息，需要从外面拿到document获取旧版本号，再传入worker
      if (data.data === 'getCurrentVersion') {
        let version = '';
        const metaList = document.querySelectorAll('meta');
        if (metaList.length) {
          metaList.forEach((item) => {
            if (item.name === 'versionNow') {
              version = item.content;
            }
          });
        }
        // console.log('旧版本号', version)
        pollingWorker.current.postMessage(JSON.stringify({
          type: "curVersionCallBack",
          data: version
        }))
      }

      // 升级版本提示
      if (data.data === 'update') {
        if (currentConfirmModal.current) {
          // currentConfirmModal.current.close()
          Modal.destroyAll()
        }
        currentConfirmModal.current = Modal.confirm({
          title: null,
          icon: null,
          content: '发现新版本，快来更新吧！',
          cancelButtonProps: { style: { display: 'none' } },
          okText: '立即更新',
          className: 'version-update-modal',
          onOk: handleConfirm
        });
      }
    }
    pollingWorker.current.setInterval = window.setInterval
    pollingWorker.current.onerror = function (error) {
      console.log(error)
    }
  }

  // 浏览器窗口是否显示隐藏
  const onVisibilityChange = useCallback(() => {
    // console.log(document.hidden)
    if (pollingWorker.current) {
      if (!document.hidden) {
        pollingWorker.current.postMessage(JSON.stringify({
          type: "openDetection",
        }))
      } else {
        pollingWorker.current.postMessage(JSON.stringify({
          type: "closeDetection",
        }))
      }
    }
  }, [])

  useEffect(() => {
    workerEvents()

    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (pollingWorker.current) {
        pollingWorker.current.terminate()
      }
    }
  }, [])

  return null
}
