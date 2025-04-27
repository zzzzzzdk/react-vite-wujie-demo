import React, { useEffect, useState, useRef } from "react";
import PlateNumberProps, {
  ParamsPlateNumberType,
  ImportResultType,
} from "./interface";
import classNames from "classnames";
import { FormPlate } from "@/components";
import { PlateValueProps, PlateTypeId } from "@/components/FormPlate/interface";
import { Button, Upload, Form, Modal, Message, Loading } from "@yisa/webui";
import { UploadItem } from "@yisa/webui/es/Upload/interface";
import { Icon, ExclamationCircleFilled } from "@yisa/webui/es/Icon";
import { isFunction } from "@/utils";
import cookie from "@/utils/cookie";
import { unstable_useBlocker as useBlocker } from "react-router-dom";
import "./index.scss";

const FormPlateNumber = (props: PlateNumberProps) => {
  const {
    className,
    style,
    formItemProps = { label: "车牌号码" },
    onChange,
    showSwitch = true,
    address = "/v1/targetretrieval/license-excel",
    disabled = false
  } = props;

  const [statePlateType, setStatePlateType] = useState(props?.params?.type);
  const plateType = "params" in props ? props.params?.type : statePlateType;

  const [statePlateData, setStatePlateData] = useState<ParamsPlateNumberType>({
    licensePlate: "",
    plateColorTypeId: -1,
    licensePlateFile: "",
    noplate: "",
  });
  const plateData = "params" in props ? props.params : statePlateData;

  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importResult, setImportResult] = useState<ImportResultType>({
    successNum: 0,
    successUrl: "",
    failNum: 0,
    failUrl: "",
    totalNum: 0
  });
  const [importLoading, setImportLoading] = useState(false);
  const isUploading = useRef(importLoading);
  isUploading.current = importLoading;
  // const [hasImport, setHasImport] = useState(false)
  // 当前是否导入
  const hasImport = !!plateData?.licensePlateFile?.length;
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

  const handlePlateChange = ({
    plateNumber: plateNumber,
    plateTypeId: plateTypeId,
    noplate,
  }: PlateValueProps) => {
    if (!("params" in props)) {
      setStatePlateData({
        ...plateData,
        licensePlate: plateNumber,
        plateColorTypeId: plateTypeId,
        noplate: noplate,
      });
    }

    if (onChange && isFunction(onChange)) {
      onChange({
        ...plateData,
        licensePlate: plateNumber,
        plateColorTypeId: plateTypeId,
        noplate: noplate,
        type: "single",
      });
    }
  };

  const handleBatchSwitch = () => {
    if (!("params" in props)) {
      setStatePlateType(plateType === 'single' ? 'batch' : 'single');
    }
    if (onChange && isFunction(onChange)) {
      onChange({
        ...plateData,
        type: plateType === 'single' ? 'batch' : 'single'
      });
    }
  };

  const handleBeforeUpload = (file: File, filesList: File[]) => {
    console.log(file)
    const isXlsx =
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (!isXlsx) {
      Message.warning(
        "文件格式错误，仅支持XLSX格式文件"
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
        totalNum: 0
      };
      // setHasImport(true)
      setImportLoading(false);
      console.log(response);
      setImportResult(result);
      setImportModalVisible(true);
      if (onChange && isFunction(onChange) && plateData) {
        onChange({
          ...plateData,
          type: "batch",
          licensePlateFile: result.successUrl,
          successNum: result.successNum,
        });
      }
      if (result.totalNum === 0 && result.successNum === 0 && result.failNum === 0) {
        Message.warning("上传文件内容为空，请核对后重新上传")
      }
    }
    if (status === "error") {
      console.log(file);
      Message.error((response as any).message);
      setImportLoading(false);
    }
  };

  const handleModalCancel = () => {
    setImportModalVisible(false);
  };

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

  useEffect(() => {
    window.addEventListener("beforeunload", beforeunload);

    return () => {
      window.removeEventListener("beforeunload", beforeunload);
    };
  }, []);
  // 不走axios,所以拼个前缀
  const uploadAddress = `${window.YISACONF.api_host}${address}`;
  return (
    <Form.Item
      className={classNames("form-plate-number", className)}
      colon={false}
      {...formItemProps}
      style={style}
    >
      <div>
        {plateType === 'batch' ? (
          <div className="plate-batch-import">
            <Upload
              action={uploadAddress}
              showUploadList={false}
              accept=".xlsx"
              onChange={handleChange}
              disabled={disabled || importLoading}
              beforeUpload={handleBeforeUpload}
              headers={{ Authorization: `${cookie.getToken()}`, 'Frontend-Route':window.location.hash.split('?')[0][0]}}
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
                      已导入{" "}
                      <span>
                        {plateData.successNum ?? importResult.successNum}
                      </span>{" "}
                      条数据
                    </span>
                  )
                ) : (
                  <Loading spinning={importLoading}>导入车牌号</Loading>
                )}
              </div>
            </Upload>
            <a href={window.YISACONF.plateExcelUrl} download>
              下载模板
            </a>
          </div>
        ) : (
          <FormPlate
            isShowNoPlate
            isShowKeyboard
            onChange={handlePlateChange}
            value={{
              plateTypeId: plateData?.plateColorTypeId || -1,
              plateNumber: plateData?.licensePlate || "",
              noplate: plateData?.noplate || "",
            }}
          />
        )}
        {showSwitch && (
          <span className="batch-switch" onClick={handleBatchSwitch}>
            {plateType === 'batch' ? "单牌搜车" : "批量搜车"}
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
              车牌号码导入提示
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
    </Form.Item>
  );
};

export default FormPlateNumber;
