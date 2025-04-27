import React, { useContext, useState } from "react";
import { DataContext, SettingContext } from "../store";
import { Button, Message } from "@yisa/webui";
import { STATUS } from "../hooks";
import { useRequest } from "ahooks";
import services from "@/services";
import { RANGETYPE, EXPORTTYPE } from "../hooks";
import omit from "@/utils/omit";

const Footer = () => {
  const setting = useContext(SettingContext);
  const exportData = useContext(DataContext);
  const { prefixCls, closeModal, changeStatus, status, resultData, changeResult, rangeData, exportType, setProgress } = exportData!;
  const { footer, url = '', hasProgress, size = 1000, sizeWithImage, formData, total = 0 } = setting!;
  // const [loading, setLoading] = useState(false)
  const exportUrl = url

  const { loading, run, runAsync, cancel } = useRequest((data = {}) => services.requestProgress<any, {
    jobId: string,
    progress: number,
    fileUrl: string,
    successNum: number,
    failNum: number,
    failUrl: string
  }>('/v1/common/export', {
    ...data
  }), {
    manual: true,
    pollingInterval: 1000,
    onSuccess: (res, params) => {
      console.log(res, params)
      if (hasProgress) {
        const { progress = 0, fileUrl = '', successNum } = res.data || {}
        if (res.data) {
          if (progress < 100) {
            if (status !== STATUS.PROGRESS) {
              changeStatus(STATUS.PROGRESS)
            }
            setProgress(progress)
          } else {
            setProgress(100)
            changeStatus(STATUS.RESULT)
            window.open(fileUrl)
            cancel()
            changeResult({
              ...resultData,
              status: 'success',
              successUrl: fileUrl,
              successNum: successNum
            })
          }
        } else {
          cancel()
          changeStatus(STATUS.RESULT)
          changeResult({
            ...resultData,
            status: 'error',
            errorText: '导出进度接口格式不正确'
          })
        }
      } else {
        setProgress(100)
        changeStatus(STATUS.RESULT)
        window.open(res.data?.fileUrl)
        cancel()
        changeResult({
          ...resultData,
          status: 'success',
          successUrl: res.data?.fileUrl,
          successNum: res.data?.successNum,
          failUrl: res.data?.failUrl,
          failNum: res.data?.failNum
        })
      }
    },
    onError: (error) => {
      console.log(error)
      cancel()
      changeStatus(STATUS.RESULT)
      changeResult({
        ...resultData,
        status: 'error',
        errorText: '导出进度接口请求失败'
      })
    },
  });

  const onClose = () => {
    closeModal();
  };

  const onAgain = () => {
    changeStatus(STATUS.CHECK)
    changeResult({
      ...resultData,
      jobId: '',
      progress: 0,
      successUrl: '',
      successNum: 0,
      failUrl: '',
      failNum: 0
    })
  }

  const startExport = async () => {
    const { type, start, end } = rangeData
    if (type === RANGETYPE.CUSTOM) {
      if (!start || !end) {
        Message.warning("请输入分段范围！")
        return
      }

      if (Number(start) > Number(end)) {
        Message.warning('分段范围前面应小于等于后面')
        return false
      }
      if (Number(end) < Number(start)) {
        Message.warning('分段范围后面应大于前面')
        return false
      }

      const maxSize = exportType === EXPORTTYPE.NORMAL ? size : sizeWithImage
      if (Number(end) - Number(start) + 1 > Number(maxSize)) {
        Message.warning('分段范围超出限制')
        return false
      }
    } else if (type === RANGETYPE.CHECKED) {
      if (!formData?.checkedIds?.length) {
        Message.warning("请选择目标结果！")
        return
      }
    } else if (type === RANGETYPE.CURRENT) {
      if (total === 0) {
        Message.warning("导出结果为0！")
        return
      }
    }



    // setLoading(true)
    // 格式化form参数
    const exportFormData = {
      exportType: exportType === EXPORTTYPE.IMAGE ? 'xlsxWithImage' : "xlsxWithoutImage",
      begin:
        type === RANGETYPE.CUSTOM
          ? start
          : type === RANGETYPE.ALL
            ? 1
            : (((formData?.pageNo || 0) - 1) * (formData?.pageSize || 0) + 0 + 1),
      end:
        type === RANGETYPE.CUSTOM
          ? end
          : type === RANGETYPE.ALL
            ? (total > 100000 ? 100000 : total)
            : (((formData?.pageNo || 0) - 1) * (formData?.pageSize || 0) + (formData?.pageSize - 1) + 1),
      range: rangeData,
      ...(type === RANGETYPE.CHECKED ? { infoId: formData?.checkedIds } : {}),
      ...(formData || {})
    }
    const _exportFormData = rangeData.type === RANGETYPE.CHECKED ? omit(exportFormData, ["begin", "end"]) : exportFormData

    let exportId = ''
    await services.startExport<any, string>(exportUrl, _exportFormData).then(res => {
      console.log(res)
      exportId = res.data || ''
    }).catch(err => {
      console.log(err)
      Message.error("导出请求id失败")
    })

    if (!exportId) {
      return
    }
    const progressFormData = {
      exportId: exportId,
    }
    run(progressFormData)
    // 线上不支持sse和websocket
    // services.getExportInfo(
    //   exportUrl,
    //   _exportFormData,
    //   {
    //     onOpen: handleSseOpen,
    //     onMessage: handleSseMessage,
    //     onError: handleSseError
    //   }
    // )

  };

  // const handleSseOpen = (res: any) => {
  //   setProgress(0)
  //   setLoading(false)
  //   console.log('onopen: ', res)
  //   if (hasProgress) {
  //     changeStatus(STATUS.PROGRESS)

  //   } else {
  //     changeStatus(STATUS.RESULT)
  //     changeResult({
  //       ...resultData,
  //       status: 'success',
  //       successUrl: res.url,
  //     })
  //   }
  // }

  // const handleSseMessage = (res: any) => {
  //   setLoading(false)
  //   console.log(res)
  //   const { data } = res

  //   try {
  //     const { progress, url, successNum } = JSON.parse(data)
  //     if (progress < 100) {
  //       if (status !== STATUS.PROGRESS) {
  //         changeStatus(STATUS.PROGRESS)
  //       }
  //       setProgress(Math.floor(progress * 100) / 100)
  //     } else {
  //       setProgress(100)
  //       changeStatus(STATUS.RESULT)
  //       window.open(url)
  //       changeResult({
  //         ...resultData,
  //         status: 'success',
  //         successUrl: url,
  //         successNum: successNum || 0
  //       })
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // const handleSseError = () => {
  //   setLoading(false)
  //   setProgress(0)
  // }

  const isCheck = status === STATUS.CHECK;
  const isResult = status === STATUS.RESULT;

  if (!isCheck && !isResult) {
    return null;
  }

  if (footer) {
    return footer(onClose, startExport);
  }

  const CheckFooter = (
    <>
      <Button onClick={onClose}>取消</Button>
      <Button type="primary" onClick={startExport} loading={loading}>
        确认
      </Button>
    </>
  );
  const ResultFooter = (
    <>
      <Button onClick={onClose}>关闭</Button>
      <Button type="primary" onClick={onAgain}>
        {resultData.status === 'success' ? '继续导出' : '重新选择'}
      </Button>
    </>
  );

  return (
    <footer className={`${prefixCls}-footer`}>
      {isCheck && CheckFooter}
      {isResult && ResultFooter}
    </footer>
  );
};

export default Footer;
