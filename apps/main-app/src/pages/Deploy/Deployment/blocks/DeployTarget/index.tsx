import React, { createRef, useContext, useEffect, useRef, useState } from "react";
import { LeftOutlined, RightOutlined } from "@yisa/webui/es/Icon";
import { Table, Image, Space, Link } from "@yisa/webui";
import { Icon } from "@yisa/webui/es/Icon";
import { useToggle } from "ahooks";
import classnames from "classnames";
import type { ColumnProps } from "@yisa/webui/es/Table";
import { ImgZoom } from "@yisa/webui_business";
import featureData from "@/config/feature.json";
import ColorfulPlate from "@/pages/Deploy/components/ColorfulPlate";
import Heading from "../../../components/Heading";
import { VehicleFormData } from "@/pages/Deploy/Deploy/AddDeployModal/useVehicleForm";
import { IdentityFormData } from "@/pages/Deploy/Deploy/AddDeployModal/useIdentityForm";
import { PictureFormData } from "@/pages/Deploy/Deploy/AddDeployModal/usePictureForm";
import {
  isIdentityDeploy,
  isPictureDeploy,
  isVehicleDeploy,
} from "@/pages/Deploy/Deploy/interface";
import MapContext from "@/pages/Deploy/DeployWarning/MapContext";
import { BaseFormData } from "@/pages/Deploy/Deploy/AddDeployModal";

import type { DeploymentBlockProps } from "../../interface";
import "./index.scss";
import services from "@/services";
import {
  AlarmType,
  AlarmTypeTextSetting,
  IdentityDeployThresholdText,
  DeployTargetPickKeys
} from "@/pages/Deploy/DeployDetail/interface";
import { ColorfulLabelList } from "@/pages/Deploy/components/ColorfulLabel";
function DeployTargetBlock(props: DeploymentBlockProps) {
  const { id, title, deployItem } = props;

  const monitorList = deployItem.monitorList ?? [];
  const vehicleList: VehicleFormData[] = [];
  const identityList: IdentityFormData[] = [];
  const pictureList: PictureFormData[] = [];

  const mapContext = useContext(MapContext);
  monitorList.forEach((m) => {
    if (isVehicleDeploy(m.monitorType)) {
      vehicleList.push(m);
    }
    if (isIdentityDeploy(m.monitorType)) {
      identityList.push(m as IdentityFormData);
    }
    if (isPictureDeploy(m.monitorType)) {
      pictureList.push(m as PictureFormData);
    }
  });
  const [pointers, setPointers] = useState(new Array(pictureList.length).fill(0))
  const [pointersPerson, setPointersPerson] = useState(new Array(identityList.length).fill(0))


  useEffect(() => {
    if (pictureList.length) {
      // console.log('pointers', pointers)
      setPointers(new Array(pictureList.length).fill(0))
    }
  }, [JSON.stringify(pictureList)])

  useEffect(() => {
    if (identityList.length) {
      // console.log('pointers', pointers)
      setPointersPerson(new Array(identityList.length).fill(0))
    }
  }, [JSON.stringify(identityList)])

  const [vehicleBrands, setBrand] = useState<{
    [index: number | string]: { k: number; v: string };
  }>({});
  /* 获取车辆品牌 */
  useEffect(() => {
    services.getBMY().then((res) => {
      let { brand, model, year } = res.data as any;
      setBrand(brand);
    });
  }, []);
  /* 获取车型 */
  const vehicleTypes = featureData["car"]["vehicleTypeId"]["value"];

  const personColumns: ColumnProps<IdentityFormData>[] = [
    // {
    //   title: "布控单号",
    //   width: "100px",
    //   dataIndex: "seq",
    //   render(_, item, index) {
    //     return deployItem.jobId;
    //   },
    // },
    {
      title: "姓名",
      dataIndex: "plate",
      render(_, item) {
        return item.personName || "-";
      },
    },
    {
      title: "证件号码",
      dataIndex: "idcard",
      render(_, item) {
        if (item.monitorType === "monitorPersonBatchType") {
          return (
            <a
              className="ysd-link ysd-link-default"
              href={`${window.YISACONF.api_host}/v1/monitor/export-license?itemId=${item.itemId}`}
              download={`批量人员-${item.itemId}`}
            >
              批量证件号
            </a>
          );
        }
        return item.license || "-";
      },
    },
    {
      title: "证件照",
      dataIndex: "idcard",
      render(_, item, index) {
        const featureList = item.featureList ?? [];
        return (
          <div className="image-wrapper">
            {featureList.length > 1 && (
              <>
                <span
                  className={classnames("prev", {
                    disabled: pointersPerson[index] === 0,
                  })}
                  onClick={() => {
                    const newPointers = [...pointersPerson];
                    newPointers[index] = Math.max(0, pointersPerson[index] - 1);
                    setPointersPerson(newPointers)
                  }}
                >
                  <LeftOutlined />
                </span>
              </>
            )}

            <ImgZoom
              key={item.featureList[pointersPerson[index]]?.targetImage}
              imgSrc={item.featureList[pointersPerson[index]]?.targetImage}
            />

            {featureList.length > 1 && (
              <>
                <span
                  className={classnames("next", {
                    disabled: pointersPerson[index] === featureList.length - 1,
                  })}
                  onClick={() => {
                    const newPointers = [...pointersPerson];
                    newPointers[index] = Math.max(
                      0,
                      Math.min(featureList.length - 1, pointersPerson[index] + 1)
                    );
                    setPointersPerson(newPointers)
                  }}
                >
                  <RightOutlined />
                </span>
              </>
            )}
          </div>
        );
      },
    },
    {
      title: "人员标签",
      dataIndex: "label",
      width: "300px",
      render(_, item) {
        if (!item.labelInfos?.length) return "-";
        return (
          <ColorfulLabelList center labels={item.labelInfos} width="300px" />
        );
      },
    },
  ];
  const vehiclecolumns: ColumnProps<VehicleFormData>[] = [
    // {
    //   title: "布控单号",
    //   width: "100px",
    //   dataIndex: "seq",
    //   render(_, item, index) {
    //     return deployItem.jobId;
    //   },
    // },
    {
      title: "车牌号",
      dataIndex: "plate",
      render(_, item) {
        if (item.monitorType === "monitorVehicleTagType") return "-";
        if (item.monitorType == "monitorVehicleBatchType") {
          return (
            <a
              className="ysd-link ysd-link-default"
              href={`${window.YISACONF.api_host}/v1/monitor/export-license?itemId=${item.itemId}`}
              download={`批量车牌-${item.itemId}`}
            >
              批量车牌
            </a>
          );
        }
        return (
          <ColorfulPlate
            plate={item.licensePlate}
            color={item.plateColorTypeId}
            showTiTle={false}
          />
        );
      },
    },
    {
      title: "车辆类型",
      dataIndex: "vehicleType",
      render(_, item) {
        return vehicleTypes.find(it => it.value == item.vehicleTypeId)?.text ?? "-";
      },
    },
    {
      title: "品牌型号",
      dataIndex: "brand",
      width: 276,
      render(_, item) {
        // console.log(vehicleBrands[item.brandId as string])
        return (
          <div className="brand-info" title={item.carInfo}>
            {
              item.carInfo ? item.carInfo :
                vehicleBrands[item.brandId as string] ?
                  vehicleBrands[item.brandId as string].v : "-"}
          </div>
        );
      },
    },
    // {
    //   title: "车辆标签",
    //   dataIndex: "label",
    //   width: "200px",
    //   render(_, item) {
    //     if (!item.labelInfos?.length) return "-";
    //     return (
    //       <ColorfulLabelList center labels={item.labelInfos} width="300px" />
    //     );
    //   },
    // },
  ];
  const pictureColumns: ColumnProps<PictureFormData>[] = [
    // {
    //   title: "布控单号",
    //   width: "100px",
    //   dataIndex: "seq",
    //   render(_, item, index) {
    //     return deployItem.jobId;
    //   },
    // },
    {
      title: "布控图片",
      dataIndex: "picture",
      render(_, item, index) {
        const featureList = item.featureList ?? [];
        return (
          <div className="image-wrapper">
            {featureList.length > 1 && (
              <>
                <span
                  className={classnames("prev", {
                    disabled: pointers[index] === 0,
                  })}
                  onClick={() => {
                    const newPointers = [...pointers];
                    newPointers[index] = Math.max(0, pointers[index] - 1);
                    setPointers(newPointers)
                  }}
                >
                  <LeftOutlined />
                </span>
              </>
            )}

            <ImgZoom
              key={item.featureList[pointers[index]]?.targetImage}
              imgSrc={item.featureList[pointers[index]]?.targetImage}
            />

            {featureList.length > 1 && (
              <>
                <span
                  className={classnames("next", {
                    disabled: pointers[index] === featureList.length - 1,
                  })}
                  onClick={() => {
                    const newPointers = [...pointers];
                    newPointers[index] = Math.max(
                      0,
                      Math.min(featureList.length - 1, pointers[index] + 1)
                    );
                    setPointers(newPointers)
                  }}
                >
                  <RightOutlined />
                </span>
              </>
            )}
          </div>
        );
      },
    },
  ];


  const commonColumns: ColumnProps<BaseFormData>[] = [
    {
      title: "预警方式",
      dataIndex: "alarmType",
      render(_, item) {
        // 人员布控阈值
        if (isIdentityDeploy(item.monitorType)) {
          const thresholds = (item as IdentityFormData).thresholds ?? {};
          return (
            <div>
              {Object.entries(thresholds).map(([name, value]) => {
                return (
                  <div>
                    <Space>
                      {IdentityDeployThresholdText[name]}
                      {`${value}%`}
                    </Space>
                  </div>
                );
              })}
            </div>
          );
        }

        const alarmTypes = item.alarmTypes ?? [];
        return alarmTypes.map((alarm, idx) => {
          return (
            <div key={idx}>
              <p>{AlarmTypeTextSetting[AlarmType[alarm]]?.text}</p>
            </div>
          );
        });
      },
    },
    {
      title: "最近抓拍时间",
      dataIndex: "time",
      render(_, item) {
        return item.captureTime || "-";
      },
    },
    {
      title: "最近抓拍地点",
      dataIndex: "locationName",
      render(col, item, index) {
        if (!item.locationName) {
          return "-";
        }
        return (
          <span
            className="ysd-link ysd-link-default"
            onClick={() => {
              mapContext.showLngLat({
                name: item.locationName || "",
                lat: item.lngLat?.lat || "",
                lng: item.lngLat?.lng || "",
              });
            }}
          >
            {item.locationName}
          </span>
        );
      },
    },
    {
      title: "最近抓拍",
      dataIndex: "recentCapture",
      render(_, item) {
        if (!item.targetImage) {
          return "-";
        }
        return (
          <div className="recent-capture">
            <Image src={item.targetImage} />
          </div>
        );
      },
    },
  ];

  return (
    <section className="deploy-target-block">
      <Heading level={2} id={id} round>
        {title}
      </Heading>
      <div className="targets block-main">
        {
          !!vehicleList.length ?
            <CollapseTable title="车辆布控">
              <Table
                stripe
                rowKey="itemId"
                columns={[...vehiclecolumns, ...commonColumns]}
                data={vehicleList}
                noDataElement={
                  <div className="table-no-data">
                    {/* <img src={noData} alt="" /> */}
                    <Icon type="zanwushujuqianse" />
                    <div> 这里什么都没有......</div>
                  </div>
                }
              />
            </CollapseTable>
            : ''
        }
        {
          !!pictureList.length ?
            <CollapseTable title="人脸布控">
              <Table
                stripe
                rowKey="itemId"
                columns={[...pictureColumns, ...commonColumns]}
                data={pictureList}
                noDataElement={
                  <div className="table-no-data">
                    {/* <img src={noData} alt="" /> */}
                    <Icon type="zanwushujuqianse" />
                    <div> 这里什么都没有......</div>
                  </div>
                }
              />
            </CollapseTable>
            : ''
        }
        {
          !!identityList.length ?
            <CollapseTable title="人员布控">
              <Table
                stripe
                rowKey="itemId"
                columns={[...personColumns, ...commonColumns]}
                data={identityList}
                noDataElement={
                  <div className="table-no-data">
                    {/* <img src={noData} alt="" /> */}
                    <Icon type="zanwushujuqianse" />
                    <div> 这里什么都没有......</div>
                  </div>
                }
              />
            </CollapseTable>
            : ''
        }
      </div>
    </section>
  );
}

type CollapseTableProps = {
  title: string;
  children: React.ReactNode;
};
function CollapseTable(props: CollapseTableProps) {
  const [collapsed, { toggle }] = useToggle(false);
  return (
    <section>
      <span
        style={{
          cursor: "pointer",
        }}
        onClick={toggle}
      >
        <Heading gray level={2} round={false}>
          <span>{props.title}</span>
          <span
            className={classnames("collapse", {
              "collapse-more": collapsed,
              "collapse-less": !collapsed,
            })}
          >
            {collapsed ? "展开" : "收起"}
          </span>
        </Heading>
      </span>
      {!collapsed && props.children}
    </section>
  );
}

export default DeployTargetBlock;
