import React, { useContext, useState } from "react";
import { Image, Divider, Statistic, Link, Checkbox, Table } from "@yisa/webui";
import type { ColumnProps, TableProps } from "@yisa/webui/es/Table";
import { Icon } from "@yisa/webui/es/Icon";
import classnames from "classnames";
import "./index.scss";
import FooterLinks from "@/components/Card/FooterLinks";
import { ImgZoom } from "@yisa/webui_business";
import { ResultRowType } from "@/pages/Search/Target/interface";
import ColorfulPlate from "../../components/ColorfulPlate";
import { Measure, MeasureTextSetting } from "../../DeployDetail/interface";
import { useControllableValue, useToggle } from "ahooks";
import { StandardProps } from "ahooks/es/useControllableValue";
import { WarningItem, WarningListProps } from "../interface";
import TableAction from "../../components/TableAction";
import MapContext from "../MapContext";
import { BigImg, MoreFilter } from "@/components";
import {
  isIdentityDeploy,
  isPictureDeploy,
  isVehicleDeploy,
} from "../../Deploy/interface";
import useVehicleBrands from "../../hooks/useVehicleBrands";
import useVehicleTypes from "../../hooks/useVehicleTypes";
function WarningList(props: WarningListProps) {
  const { items, selected } = props;

  const mapContext = useContext(MapContext);
  const vehicleBrands = useVehicleBrands();
  const vehicleTypes = useVehicleTypes();

  const columns: ColumnProps<WarningItem>[] = [
    {
      title: "序号",
      dataIndex: "seq",
      key: "seq",
      width: "84px",
      render(col, item, index) {
        return index + 1;
      },
    },
    {
      title: "布控单号",
      dataIndex: "jobId",
      width: "100px",
    },
    {
      width: "200px",
      title: "布控标题",
      ellipsis: true,
      dataIndex: "title",
      render(col, item, index) {
        return <Link href={`#/deployment/${item.jobId}`} target="_blank">
          <span title={item.title}>{item.title}</span>
        </Link>
      },
    },
    {
      width: "100px",
      title: "采取措施",
      dataIndex: "measure",
      render(col, item, index) {
        return MeasureTextSetting[Measure[item.measure]]?.text;
      },
    },
    {
      width: "250px",
      title: "布控目标",
      dataIndex: "warningTarget",
      render(col, item, index) {
        // 是哪种布控?

        const monitorTarget = item.monitorTarget;
        const vehicleDeploy = isVehicleDeploy(item.monitorType);
        const pictureDeploy = isPictureDeploy(item.monitorType);
        const identityDeploy = isIdentityDeploy(item.monitorType);
        // 人脸布控
        if (pictureDeploy) {
          return (
            <div className="image-wrapper">
              <Image src={monitorTarget?.monitorTargetUrl} />
            </div>
          );
        }
        // 证件号布控(人员布控) 显示人员姓名-证件号码
        if (identityDeploy) {
          const infos = [monitorTarget?.personName, monitorTarget?.license];

          const params = {
            idNumber: monitorTarget?.license === '未知' ? '' : monitorTarget?.license,
            idType: "111",
            groupId: [],
            groupPlate: [],
          };

          const queryStr = encodeURIComponent(JSON.stringify(params));
          return (
            <Link target="_blank" href={`#/record-detail-person/?${queryStr}`}>
              {infos.filter(Boolean).join("-")}
            </Link>
          );
        }
        // 车辆布控
        if (vehicleDeploy) {
          if (item.monitorType == "monitorVehiclePropertyType") {
            // 展示: 车辆类型 品牌 车牌号
            const info = [
              vehicleTypes.find(
                (v) => v.value === (monitorTarget?.vehicleTypeId as any)
              )?.text,
              vehicleBrands[monitorTarget?.brandId!]?.v,
            ].filter(Boolean);
            return (
              <div>
                {!!monitorTarget?.licensePlate?.length && (
                  <ColorfulPlate
                    showTiTle={false}
                    plate={monitorTarget?.licensePlate}
                    color={monitorTarget?.plateColorTypeId}
                  />
                )}
                {info.length > 0 &&
                  !!monitorTarget?.licensePlate?.length &&
                  "-"}
                {info.filter(Boolean).join("-")}
              </div>
            );
          }
          if (item.monitorType == "monitorVehicleBatchType") {
            return (
              <ColorfulPlate
                showTiTle={false}
                plate={monitorTarget?.licensePlate}
                color={monitorTarget?.plateColorTypeId}
              />
            );
          }
          if (item.monitorType == "monitorVehicleTagType") {
            return (
              <ColorfulPlate
                showTiTle={false}
                plate={monitorTarget?.licensePlate}
                color={monitorTarget?.plateColorTypeId}
              />
            );
          }
        }
        return "-";
      },
    },
    {
      width: "250px",
      title: "告警目标",
      dataIndex: "captureTarget",
      render(col, item, index) {
        return (
          <div
            className="image-wrapper"
            onClick={() => {
              setBigImgModal({
                visible: true,
                currentIndex: index,
              });
            }}
          >
            <Image src={item.targetImage} />
          </div>
        );
      },
    },
    {
      width: "200px",
      title: "抓拍时间",
      dataIndex: "capatureTime",
      render(col, item, index) {
        return item.captureTime || "-";
      },
    },
    {
      width: "200px",
      title: "抓拍地点",
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
      width: "100px",
      title: "相似度",
      dataIndex: "similarity",
      render(col, item) {
        return item.similarity || "-";
      },
    },
    {
      fixed: "right",
      title: "操作",
      dataIndex: "actions",
      key: "actions",
      width: `100px`,
      render(col, item) {
        return (
          <div className="actions">
            <TableAction
              item={item}
              onClick={() => {
                window.open(`#/warning-detail/${item.resultId}`);
              }}
            >
              告警详情
            </TableAction>
          </div>
        );
      },
    },
  ];
  // 大图
  const [bigImgModal, setBigImgModal] = useState({
    visible: false,
    currentIndex: 0,
  });
  const handleCloseBigImg = () => {
    setBigImgModal({
      visible: false,
      currentIndex: 0,
    });
  };

  return (
    <>
      <BigImg
        modalProps={{
          visible: bigImgModal.visible,
          onCancel: handleCloseBigImg,
        }}
        currentIndex={bigImgModal.currentIndex}
        onIndexChange={(index) => {
          setBigImgModal({
            visible: true,
            currentIndex: index,
          });
        }}
        data={items}
      />
      <div className="warning-list">
        <Table
          rowKey="uniqueId"
          columns={columns}
          data={items}
          scroll={{ x: true }}
          rowSelection={{
            selectedRowKeys: selected,
            onChange: props.onSeletedChange,
          }}
        />
      </div>
    </>
  );
}

export default WarningList;
