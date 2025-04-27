import React, { useContext, useEffect, useState } from "react";
import { DataContext, SettingContext } from "../store";
import { STATUS } from "../hooks";
import { Progress as ProgressUi } from '@yisa/webui'
import { useRequest } from 'ahooks'
import services from "@/services";

const Progress = () => {
  const setting = useContext(SettingContext);
  const exportData = useContext(DataContext);
  const { status, prefixCls, resultData, changeStatus, changeResult, progress } = exportData!;
  const { progressUrl, progressInterval } = setting!;

  const [percent, setPercent] = useState(0)

  // const { data, run, cancel } = useRequest(() => services.requestProgress(progressUrl, { jobId: resultData.jobId }), {
  //   pollingInterval: progressInterval,
  //   onSuccess: (res, params) => {
  //     console.log(res, params)
  //     const progress = res.progress
  //     setPercent(progress)
  //     if (progress >= 100) {
  //       cancel()
  //       changeStatus(STATUS.RESULT)
  //       changeResult({
  //         ...resultData,
  //         status: 'error',
  //         successUrl: res.successUrl,
  //         successNum: res.successNum,
  //         failUrl: res.failUrl,
  //         failNum: res.failNum
  //       })
  //     }
  //   },
  //   onError: (error) => {
  //     console.log(error)
  //     changeStatus(STATUS.RESULT)
  //     changeResult({
  //       ...resultData,
  //       status: 'error',
  //       errorText: '导出进度接口请求失败'
  //     })
  //   },
  // });

  return <div className={`${prefixCls}-progress`}>
    <header>正在导出中...</header>
    <ProgressUi
      percent={progress}
      strokeColor={"#00CC66"}
      strokeWidth={12}
    />
  </div>;
};

export default Progress;
