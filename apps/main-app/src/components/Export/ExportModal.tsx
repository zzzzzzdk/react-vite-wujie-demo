import React, { useContext, useCallback } from "react";
import { Modal } from "@yisa/webui";
import { DataContext, SettingContext } from "./store";
import classnames from "classnames";
import Range from "./components/Range";
import Tip from "./components/Tip";
import Result from "./components/Result";
import Footer from "./components/Footer";
import Progress from "./components/Progress";
import Tab from "./components/Tab";
import { STATUS } from "./hooks";

export default function ExportModal() {
  const setting = useContext(SettingContext);
  const exportData = useContext(DataContext);
  const { title = "" } = setting!;
  const { visible, prefixCls, status, modalAction } = exportData!;

  const isProgress = status === STATUS.PROGRESS;
  const isResult = status === STATUS.RESULT;
  const renderTitle = useCallback(() => {
    if (isProgress || isResult) {
      return null;
    } else {
      return title || "导出";
    }
  }, [isProgress]);

  return (
    <Modal
      visible={visible}
      title={renderTitle()}
      maskClosable={false}
      onCancel={() => modalAction(false)}
      closable={!isProgress && !isResult}
      style={{ width: 600 }}
      className={classnames(`${prefixCls}-modal`)}
      footer={null}
    >
      <Tab />
      <Range />
      {
        status === STATUS.PROGRESS &&
        <Progress />
      }
      <Tip />
      <Result />
      <Footer />
    </Modal>
  );
}
