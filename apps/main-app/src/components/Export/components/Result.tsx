import React, { useContext } from "react";
import { DataContext, SettingContext } from "../store";
import { STATUS } from "../hooks";
import { Button } from "@yisa/webui";
import { isFunction } from "@/utils";
import { Link } from '@yisa/webui'
import { CheckOutlined, ExclamationOutlined } from "@yisa/webui/es/Icon"

const Result = () => {
  const setting = useContext(SettingContext);
  const exportData = useContext(DataContext);
  const { prefixCls, closeModal, changeStatus, status, resultData, changeResult } = exportData!;
  const { customSuccess, customError } = setting!;

  const isResult = status === STATUS.RESULT;

  if (!isResult) {
    return null
  }

  const resultStatus = resultData.status

  if (resultStatus === 'success') {
    const successTemplate = !!customSuccess && isFunction(customSuccess) ? <>{customSuccess(resultData)}</> : (
      <div className={`${prefixCls}-result success`}>
        <div className="icon-wrap"><CheckOutlined /></div>
        <p className="text">导出成功</p>
        <div className="success-text">导出成功 <span className="total">{resultData.successNum}</span> 条，请点击此处 <Link href={resultData.successUrl}>开始下载</Link></div>
      </div>
    )

    return successTemplate
  }

  if (resultStatus === 'error') {
    const errorTemplate = !!customError && isFunction(customSuccess) ? <>{customError(resultData)}</> : (
      <div className={`${prefixCls}-result error`}>
        <div className="icon-wrap"><ExclamationOutlined /></div>
        <p className="text">导出失败</p>
        <div className="error-text">{resultData.errorText || '--'}</div>
      </div>
    )
    return errorTemplate
  }
  return null
};

export default Result;
