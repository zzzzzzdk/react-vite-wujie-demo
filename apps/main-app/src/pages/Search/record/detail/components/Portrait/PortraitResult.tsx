import { Button, Image, Message, PopConfirm, Tooltip } from '@yisa/webui'
import { Card } from "@/components";
import GaitSequenceList from '@/components/GaitSequence/List'
import classNames from 'classnames'
import { ResultBox } from '@yisa/webui_business'
import ajax, { ApiResponse } from '@/services'
import { Icon } from '@yisa/webui/es/Icon'
import { ResultRowType } from "@/pages/Search/Target/interface";
import './index.scss'
import { logReport } from "@/utils/log";
import { GroupFilterCallBackType } from '@/components/Card/Normal/interface';
import character from '@/config/character.config';
enum GroupByTypes {
  GroupLicense = '1',//换成车辆
  GroupDate = '2',//同天换衣
  GroupClothes = '3',//衣着颜色分组
}
enum FaceTypes {
  FacePic = '-1',
  FaceCluter = '4'//聚类分组
}

const PortraitResult = (props: any) => {
  const {
    resultData,
    ajaxLoading,
    listCount,
    targetType,
    faceType,
    captureData,
    pedestrianData,
    onOpenBigImg,
    onCaptureClick,
    onLocationClick,
    onPortraitClick,
    onDetailClick,
    onCaptureDateClick,
    onOpenGaitSequence,
    onFilterChange,
  } = props

  const handleOpenBigImg = (j: number) => {
    onOpenBigImg && onOpenBigImg(j)
  }
  const handleCaptureClick = (data: any) => {
    onCaptureClick && onCaptureClick(data)
  }
  const handleLocationClick = (j: number) => {
    onLocationClick && onLocationClick(j)
  }
  const handlePortraitClick = (e: any, data: any) => {
    onPortraitClick && onPortraitClick(e, data)
  }
  const handleDetailClick = (data: any, j: number) => {
    onDetailClick && onDetailClick(data, j)
  }
  const handleCaptureDateClick = (data: any) => {
    onCaptureDateClick && onCaptureDateClick(data)
  }
  const handleOpenGaitSequence = (j: number) => {
    onOpenGaitSequence && onOpenGaitSequence(j)
  }
  const handleFilterChange = (data: GroupFilterCallBackType) => {
    if (data.cardData?.targetType !== "vehicle") return
    onFilterChange && onFilterChange(data.cardData)
  }

  const handleJump = (data: ResultRowType) => {
    window.open(`#/image?featureList=${encodeURIComponent(JSON.stringify([{ ...data, isGait: true }]))}&isGait=1`)
    // 日志提交
    logReport({
      type: 'gait',
      data: {
        desc: `图片【1】-【步态检索】`,
        data
      }
    })
  }
  const handleRenderCard = () => {
    const { data = [] } = resultData
    let template = []
    for (let i = 0; i < data.length; i = i + listCount) {
      let _template = []
      for (let j = i; j < i + listCount; j++) {
        if (j < data.length) {
          const showZoom = data[j].targetType === 'vehicle' || data[j].targetType === 'bicycle' || data[j].targetType === 'tricycle'
          if (targetType == 'face') {
            // 聚类组展示并且无选中具体聚类信息数据时
            if (faceType[0] == FaceTypes.FaceCluter && !captureData) {
              _template.push(
                <div className="target-face-card">
                  <div className="image" onClick={() => handleOpenBigImg(j)}>
                    <Image src={data[j].targetImage} draggable={true} />
                    {/* <ImgZoom imgSrc={data[j].targetImage} draggable={true} /> */}
                  </div>
                  <div className="face-card-info">
                    <PopConfirm
                      title={<span>确认把此条信息加入黑名单吗？</span>}
                      onConfirm={() => handleAddBlack(data[j])}
                    >
                      <Tooltip
                        title={<span>加入黑名单</span>}
                      >
                        <div className="add-btn">+黑名单</div>
                      </Tooltip>
                    </PopConfirm>
                    <div className="card-info capture-num">
                      <Icon type="zhuapaitianshu" />
                      <div
                        className="card-info-content"
                        // title={'-'}
                        onClick={() => handleCaptureClick(data[j])}
                      >抓拍图像：<span>{data[j].captureCount}</span></div>
                    </div>
                    <div className="now-capture">最近抓拍信息：</div>
                    <div className="card-info">
                      <Icon type="shijian" />
                      <div className="card-info-content">{data[j].captureTime}</div>
                    </div>
                    <div className="card-info">
                      <Icon type="didian" />
                      <div
                        className="card-info-content location"
                        onClick={() => handleLocationClick(j)}
                        title={data[j].locationName}
                      >{data[j].locationName}</div>
                    </div>
                  </div>
                </div>
              )
            } else {
              _template.push(
                <Card.Normal
                  showChecked={false}
                  key={data[j].infoId}
                  cardData={data[j]}
                  onImgClick={() => handleOpenBigImg(j)}
                  onLocationClick={() => handleLocationClick(j)}
                  showImgZoom={showZoom}
                  onPortraitClick={(e) => handlePortraitClick(e, data[j])}
                />
              )
            }
          } else if (targetType == 'pedestrian') {
            if (pedestrianData.pedestrianType.length) {
              if (pedestrianData.pedestrianType[0] == GroupByTypes.GroupDate) {
                _template.push(
                  <Card.ClothSameInfo
                    data={data[j]}
                    hasMore={false}
                    key={data[j].feature}
                    handleDetailClick={(index: number) => handleDetailClick(data[j].details, index)}
                  />
                )
              } else if (pedestrianData.pedestrianType[0] == GroupByTypes.GroupClothes) {
                if (pedestrianData.captureCount) {
                  _template.push(
                    <Card.Normal
                      showChecked={false}
                      key={data[j].infoId}
                      cardData={data[j]}
                      onImgClick={() => handleOpenBigImg(j)}
                      onLocationClick={() => handleLocationClick(j)}
                      showImgZoom={showZoom}
                    />
                  )
                } else {
                  _template.push(
                    <Card.ClothInfo
                      isShowGait={true}
                      key={data[j].feature}
                      cardData={data[j]}
                      onCaptureClick={() => handleCaptureDateClick(data[j])}
                      onCardClick={() => handleOpenBigImg(j)}
                    />
                  )
                }
              }
            } else {
              _template.push(
                <Card.Normal
                  showChecked={false}
                  key={data[j].infoId}
                  cardData={data[j]}
                  onImgClick={() => handleOpenBigImg(j)}
                  onLocationClick={() => handleLocationClick(j)}
                  showImgZoom={showZoom}
                />
              )
            }
          } else if (targetType == 'vehicle' || targetType == 'bicycle' || targetType == 'tricycle') {
            _template.push(
              <Card.Normal
                showChecked={false}
                key={data[j].infoId}
                cardData={data[j]}
                onImgClick={() => handleOpenBigImg(j)}
                onLocationClick={() => handleLocationClick(j)}
                onFilterChange={handleFilterChange}
                showImgZoom={showZoom}
              />
            )
          } else if (targetType == 'gait') {
            _template.push(
              <div className="gait-card-info" key={data[j].infoId}>
                <div className="gait-video" onClick={() => handleOpenBigImg(j)}>
                  <Image src={data[j].bigImage} />
                  <div className="video-btn"><Icon type="bofang1" /></div>
                </div>
                {
                  character.hasGait ?
                    <div className="gait-mask">
                      <GaitSequenceList data={data[j]} />
                      <div className="tip-mask">步态序列图</div>
                      <div className="tip-info" onClick={() => handleOpenGaitSequence(j)}>查看大图</div>
                    </div>
                    : ''
                }
                <div className="gait-info">
                  <div className="card-info">
                    <Icon type="shijian" />
                    <div className="card-info-content">{data[j].captureTime || '-'}</div>
                  </div>
                  <div className="card-info">
                    <Icon type="didian" />
                    <div
                      className={classNames("card-info-content location can-click")}
                      title={data[j].locationName || '-'}
                      onClick={() => handleLocationClick(j)}
                    >{data[j].locationName || '-'}</div>
                  </div>
                  <Button size="large" onClick={() => handleJump(data[j])}>步态检索</Button>
                </div>
              </div>
            )
          }
        } else {
          _template.push(<div className="card-item-flex" key={j + 'flex'} />)
        }
      }
      template.push(<div className="result-card-list-row" key={i}>{_template}</div>)
    }
    return template
  }

  // 加入黑名单
  const handleAddBlack = (data: any) => {
    ajax.record.addBlackLists<{ groupId: string[], groupPlateId: string[] }, any>({ groupId: data.groupId ? [data.groupId] : [], groupPlateId: data.groupPlateId ? [data.groupPlateId] : [] })
      .then(res => {
        console.log(res);
        Message.success(res.message || '')
        // getResultData(formData)
      })
  }
  return <ResultBox
    loading={ajaxLoading}
    nodata={!resultData.data || (resultData.data && !resultData.data.length)}
  >
    {
      handleRenderCard()
    }
  </ResultBox>
}
export default PortraitResult
