import React, { useState, useContext } from "react";
import { SettingContext, DataContext } from "../store";
import { Tabs } from "@yisa/webui";
import { EXPORTTYPE } from "../hooks";
import { STATUS } from "../hooks";

const Tab = () => {
  const setting = useContext(SettingContext);
  const { hasImage = true } = setting!;
  const exportData = useContext(DataContext);
  const { exportType, prefixCls, changeType, status } = exportData!;

  const changeExportType = (key: string) => {
    changeType(key as EXPORTTYPE);
  };

  if (status !== STATUS.CHECK) {
    return null;
  }

  return (
    <>
      <div className={`${prefixCls}-tabs`}>
        {hasImage && (
          <Tabs
            defaultActiveKey="1"
            activeKey={exportType}
            data={[
              {
                key: EXPORTTYPE.IMAGE,
                name: "含图导出",
              },
              {
                key: EXPORTTYPE.NORMAL,
                name: "无图导出",
              },
            ]}
            onChange={changeExportType}
          />
        )}
      </div>
    </>
  );
};

export default Tab;
