import React, { useState, useEffect } from "react";
import { ResultBox } from "@yisa/webui_business";
import { BottomRight, BigImg, Panel, MapAroundPoint, CopyToClipboard } from "@/components";
import { isFunction } from "@/utils";
import { ResultProps, ResultDataType } from "../interface";
import { ImgListDataType } from "@yisa/webui_business/es/ImgPreview";
import Card from "../Card";
import { jumpRecordVehicle } from '@/utils'
import { validatePlate } from "@/utils";

const Result = (props: ResultProps) => {
  const {
    loading = false,
    resultData,
    checkedList = [],
    onCheckedChange,
  } = props;

  const [listCount, setListCount] = useState(8);

  // 大图
  const [bigImgModal, setBigImgModal] = useState({
    visible: false,
    currentIndex: 0,
  });

  // 地图
  const [bottomRightMapVisible, setBottomRightMapVisible] = useState(false);

  const currentData: ResultDataType =
    Array.isArray(resultData.data) && resultData.data[bigImgModal.currentIndex]
      ? resultData.data[bigImgModal.currentIndex]
      : ({} as ResultDataType);

  const handleCheckedChange = (data: {
    cardData: ResultDataType;
    checked: boolean;
  }) => {
    if (onCheckedChange && isFunction(onCheckedChange)) {
      onCheckedChange(data);
    }
  };

  const handleLocationClick = (index: number) => {
    setBottomRightMapVisible(true);
    setBigImgModal({
      visible: false,
      currentIndex: index,
    });
  };

  const renderCard = () => {
    const { data = [] } = resultData;
    let template = [];
    for (let i = 0; i < data.length; i = i + listCount) {
      let _template = [];
      for (let j = i; j < i + listCount; j++) {
        if (j < data.length) {
          _template.push(
            <Card
              key={data[j].infoId}
              checked={
                checkedList.filter((item) => item.infoId === data[j].infoId)
                  .length > 0
              }
              cardData={data[j]}
              onImgClick={() => handleOpenBigImg(j)}
              onChange={handleCheckedChange}
              onLocationClick={() => handleLocationClick(j)}
              showImgZoom
            />
          );
        } else {
          _template.push(<div className="card-item-flex" key={j + "flex"} />);
        }
      }
      template.push(
        <div className="result-card-list-row" key={i}>
          {_template}
        </div>
      );
    }
    return template;
  };

  const BigImgInfoRender = (data: ImgListDataType, currentIndex: number) => {
    return (
      <div className="fake-clone-big-img">
        <Panel title="目标信息" className="img-info-target">
          <div className="img-info-item">
            <div>
              <div>前端识别</div>:
              <div>
                <a target="_blank"
                  href={jumpRecordVehicle(data.licensePlate1, data['plateColorTypeId1'])}
                  className={!validatePlate(data.licensePlate1) ? 'plate-text plate-error ' : 'plate-text'}>
                  {data.licensePlate1}
                </a>
              </div>
            </div>
            <div>
              <div>二次识别</div>:
              <a href={jumpRecordVehicle(data.licensePlate2, data?.plateColorTypeId2)}
                className={`plate2-text plate-bg plate-color-${data.plateColorTypeId2}`}
                target="_blank"
              >
                {data.licensePlate2}
              </a>
              <CopyToClipboard text={data.licensePlate2} />
            </div>
            <div title={data.carInfo || ""}>
              <div style={{ textAlignLast: "justify" }}>识别车型</div>:
              <div>{data.carInfo}</div>
            </div>
            {
              data.drivingLibraryModel &&
              <div title={data.drivingLibraryModel || ""}>
                <div style={{ textAlignLast: "justify" }}>登记车型</div>:
                <div>{data.drivingLibraryModel}</div>
              </div>
            }
            <div>
              <div>出现天数</div>:<div>{data.daysElapsed} 天</div>
            </div>
            <div>
              <div>最早时间</div>:<div>{data.minCaptureTime}</div>
            </div>
          </div>
        </Panel>
        <Panel title="抓拍信息">
          <div className="img-info-item">
            <div>
              <div>抓拍时间</div>:<div>{data.captureTime}</div>
            </div>
            <div className="location" title={data.locationName || ""}>
              <div>抓拍地点</div>:<div>{data.locationName}</div>
            </div>
          </div>
        </Panel>
        <div className="info-map-wrap">
          <MapAroundPoint
            locationId={data.locationId}
            lng={data.lngLat.lng}
            lat={data.lngLat.lat}
          />
        </div>
      </div>
    );
  };

  // 大图
  const handleOpenBigImg = (index: number) => {
    setBigImgModal({
      visible: true,
      currentIndex: index,
    });
  };

  const handleCloseBigImg = () => {
    setBigImgModal({
      visible: false,
      currentIndex: 0,
    });
  };

  useEffect(() => {
    const calcListCount = () => {
      const itemWidth = 208;
      const width =
        (document.querySelector(".result-box-body")?.clientWidth || 0) - 126; // 126为总间距
      const count = Math.floor(width / itemWidth);
      if (count >= 8 || count <= 2) {
        setListCount(count);
      } else {
        const diff = width - itemWidth * count + 18 * (count - 1);
        if (diff >= itemWidth * (count / (count + 1))) {
          setListCount(count + 1);
        } else {
          setListCount(count);
        }
      }
    };
    calcListCount();
    window.addEventListener("resize", calcListCount);

    return () => {
      window.removeEventListener("resize", calcListCount);
    };
  }, []);

  return (
    <div className="result-box-body">
      <ResultBox
        loading={loading}
        nodata={
          !resultData.data || (resultData.data && !resultData.data.length)
        }
      >
        {renderCard()}
      </ResultBox>
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
        data={resultData.data}
        disabledAssociateTarget={true}
        imgInfoRender={BigImgInfoRender}
      />
      {bottomRightMapVisible ? (
        <BottomRight
          name={currentData.locationName || "--"}
          lat={currentData.lngLat?.lat || null}
          lng={currentData.lngLat?.lng || null}
          onClose={() => {
            setBottomRightMapVisible(false);
          }}
        />
      ) : null}
    </div>
  );
};

export default Result;
