import React, { useContext } from "react";
import { Button } from "@yisa/webui";
import { DataContext, SettingContext } from "./store";

export default function ExportBtn() {

  const setting = useContext(SettingContext);
  const exportData = useContext(DataContext);

  const { customButton, btnText, disable = false, total } = setting!;
  const hasCustomBtn = !!customButton;
  const hasBtnText = !!btnText;
  const { prefixCls, modalAction } = exportData!;

  const onBtnClick = () => {
    modalAction(true);
  };

  return (
    <div className={`${prefixCls}-btn-wrap`}>
      {hasCustomBtn ? (
        <div className={`${prefixCls}-btn`} onClick={onBtnClick}>
          {customButton}
        </div>
      ) : (
        <Button type="primary" onClick={onBtnClick} disabled={disable || (total === 0)}>
          {hasBtnText ? btnText : "导出"}
        </Button>
      )}
    </div>
  );
}
