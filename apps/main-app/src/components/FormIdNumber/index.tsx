import React, { useEffect, useState, useRef } from "react";
import FormIdNumberProps, { IdentityValue } from "./interface";
import { ImportResultType } from "../FormPlateNumber/interface";
import classNames from "classnames";
import { Input, Upload, Form, Modal, Message, Loading } from "@yisa/webui";
import { UploadItem } from "@yisa/webui/es/Upload/interface";
import { ExclamationCircleFilled } from "@yisa/webui/es/Icon";
import cookie from "@/utils/cookie";
import { unstable_useBlocker as useBlocker } from "react-router-dom";
import useControllableValue from "ahooks/es/useControllableValue";
import "./index.scss";
/**
 * @description 批量导入身份证
 * @支持受控/非受控模式
 * @受控 传递`value`属性
 * @非受控 不传递任何值或者传`defaultValue`
 * onChange 回调函数
 */
const FormIdNumber = (props: FormIdNumberProps) => {
  const {
    className,
    style,
    // formItemProps = { label: "证件号码" },
    showSwitch = true,
    disabled = false,
    ...rest
  } = props;
  // 批量导入还是单个
  const [isBatch, setIsBatch] = useState(
    props.defaultValue?.type === "single" ? false : true
  );

  const [identityState, setIdentityState] = useControllableValue<IdentityValue>(
    rest,
    { defaultValue: {} }
  );

  // 当前是否导入
  const hasImport =
    !!identityState.uploadedFileURL?.length || props.value?.batchCount;
  // 导入结果
  const [importResult, setImportResult] = useState<ImportResultType>({
    successNum: 0,
    successUrl: "",
    failNum: 0,
    failUrl: "",
    totalNum: 0
  });

  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const isUploading = useRef(importLoading);
  isUploading.current = importLoading;
  const [hoverImport, setHoverImport] = useState(false);

  // 路由拦截，上传过程中给出提示
  const blocker = useBlocker(!!importLoading);
  useEffect(() => {
    if (blocker.state === "blocked") {
      Modal.confirm({
        content: "数据上传未完成，确认关闭吗？",
        onOk: () => {
          blocker.proceed?.();
        },
        onCancel: () => {
          blocker.reset?.();
        },
      });
    }
  }, [blocker]);

  const handleBatchSwitch = () => {
    setIsBatch(!isBatch);
  };

  const handleBeforeUpload = (file: File, filesList: File[]) => {
    const isXlsx =
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (!isXlsx) {
      Message.warning(
        "You can only upload application/vnd.openxmlformats-officedocument.spreadsheetml.sheet file!"
      );
    }
    return isXlsx;
  };

  const handleChange = (fileList: UploadItem[], file: UploadItem) => {
    const { status, response } = file;
    // console.log(status)
    if (status === "init" || status === "uploading") {
      setImportLoading(true);
      return;
    }
    if (status === "done") {
      const result: ImportResultType = (response as ImportResultType) || {
        successNum: 0,
        successUrl: "",
        failNum: 0,
        failUrl: "",
      };
      setImportLoading(false);
      setImportResult(result);
      setImportModalVisible(true);
      setIdentityState({
        type: "batch",
        uploadedFileURL: result.successUrl,
        batchCount: result.successNum,
      });
    }
    if (status === "error") {
      Message.error((response as any).message);
      setImportLoading(false);
    }
  };

  const handleModalCancel = () => {
    setImportModalVisible(false);
  };

  useEffect(() => {
    const beforeunload = async (e: BeforeUnloadEvent) => {
      e.preventDefault();
      if (isUploading.current) {
        // let confirmationMessage = '数据上传未完成，确认关闭吗？';
        // (e || window.event).returnValue = confirmationMessage;
        // return confirmationMessage;
        (e || window.event).returnValue = "";
        return "";
      }
    };
    window.addEventListener("beforeunload", beforeunload);

    return () => {
      window.removeEventListener("beforeunload", beforeunload);
    };
  }, []);

  return (
    <div
      className={classNames("form-id-number", className)}
      // {...formItemProps}
      style={style}
    >
      <div>
        {isBatch ? (
          <div className="plate-batch-import">
            <Upload
              action={`${window.YISACONF.api_host}/v1/monitor/upload-license-person`}
              showUploadList={false}
              accept=".xlsx"
              onChange={handleChange}
              disabled={disabled || importLoading}
              beforeUpload={handleBeforeUpload}
              headers={{
                Authorization: `${cookie.getToken()}`,
                'Frontend-Route':window.location.hash.split('?')[0]
              }}
            >
              <div
                className={classNames("plate-batch-import-inner", {
                  "has-import": hasImport,
                })}
                onMouseEnter={() => setHoverImport(true)}
                onMouseLeave={() => setHoverImport(false)}
              >
                {hasImport ? (
                  hoverImport && !disabled ? (
                    <span className="afresh">重新导入</span>
                  ) : (
                    <span>
                      已导入
                      <span>
                        {identityState.batchCount ?? importResult.successNum}
                      </span>{" "}
                      条数据
                    </span>
                  )
                ) : (
                  <Loading spinning={importLoading}>导入证件号</Loading>
                )}
              </div>
            </Upload>
            <a href={window.YISACONF.licenseExcelUrl} download>
              下载模板
            </a>
          </div>
        ) : (
          <Input />
        )}
        {showSwitch && (
          <span className="batch-switch" onClick={handleBatchSwitch}>
            {isBatch ? "单个导入" : "批量导入"}
          </span>
        )}
        <Modal
          visible={importModalVisible}
          onCancel={handleModalCancel}
          className="import-result-modal"
          // mask={false}
          title={
            <>
              <ExclamationCircleFilled />
              证件号码导入提示
            </>
          }
          footer={null}
        >
          <div className="success">
            上传成功 <span>{importResult.successNum}</span> 条
          </div>
          <div className="fail">
            上传失败 <span>{importResult.failNum}</span> 条
            {importResult.failUrl ? (
              <a href={importResult.failUrl} download>
                下载
              </a>
            ) : (
              ""
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default FormIdNumber;
