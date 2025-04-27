import React, { useContext, useCallback } from "react";
import { ExclamationCircleFilled } from "@yisa/webui/es/Icon";
import { DataContext, SettingContext } from "../store";
import { STATUS, EXPORTTYPE } from "../hooks";
import classnames from "classnames";

export default function Tip() {
  const setting = useContext(SettingContext);
  const exportData = useContext(DataContext);
  const {
    customTip,
    sizeWithImage,
    size,
    total,
    showTotal
  } = setting!;
  const { exportType, prefixCls, status } = exportData!;

  if (!!customTip) {
    return <>{customTip(exportType, status)}</>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const checkMessage = () => {
    return (
      <div>
        <p><em>*</em>注：每次分段导出最多支持导出 <em>{exportType === EXPORTTYPE.NORMAL ? size : sizeWithImage}</em> 条</p>
        {
          showTotal &&
          <p><em>*</em>本次检索包含 <em>{total}</em> 条数据可供导出</p>
        }
      </div>
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const progressMessage = useCallback(() => {
    return (
      <div>
        <ExclamationCircleFilled />
        <p>导出进行中，请不要刷新或关闭页面</p>
      </div>
    );
  }, []);

  const isCheck = status === STATUS.CHECK;
  const isProgress = status === STATUS.PROGRESS;

  return (
    <div
      className={classnames(`${prefixCls}-tip`, {
        [`${prefixCls}-tip-check`]: isCheck,
        [`${prefixCls}-tip-progress`]: isProgress,
      })}
    >
      {/* <ExclamationCircleFilled /> */}
      {isCheck && <>{checkMessage()}</>}
      {isProgress && <>{progressMessage()}</>}
    </div>
  );
}
