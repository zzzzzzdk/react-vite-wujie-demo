import { Image, PopConfirm } from '@yisa/webui'
import { Icon, DeleteOutlined } from '@yisa/webui/es/Icon'
import { ImgZoom } from '@/components'
import classNames from 'classnames'
import './index.scss'
const CarInfo = (props: any) => {
  const {
    handleDelete,
    locationCanClick = true,
    showDelete = false,
    onLocationClick = () => { },
    type = "",
    onCaptureClick = () => { },
    cardData,
    isShowZoom = true
  } = props
  const prefixCls = 'carlist-item'

  const handleLocClick = (event: React.MouseEvent) => {
    if (onLocationClick) {
      onLocationClick(event, cardData)
    }
  }

  return <div className={`${prefixCls}`}>
    <div className="car-img">
      {
        isShowZoom ?
          <ImgZoom imgSrc={cardData.vehicleImage} draggable={false} />
          :
          <Image src={cardData.vehicleImage} />
      }
      {
        showDelete ?
          <PopConfirm
            title="确认要删除这条内容吗？"
            onConfirm={handleDelete}
          >
            <div className="card-delete"
            // onClick={handleDelete}
            >
              <DeleteOutlined />
            </div>
          </PopConfirm>
          : null
      }
    </div>
    <div className="car-info">
      <div className="plate-info">
        <a target="_blank"
          href={`#/record-detail-vehicle?${encodeURIComponent(JSON.stringify({ licensePlate: cardData.licensePlate, plateColorTypeId: cardData.plateColor }))}`}
          className={`plate2-text plate-bg plate-color-${cardData.plateColor}`}>{cardData.licensePlate}
        </a>
      </div>
      {
        type == 'transport' ?
          <>
            <div className="label-text">
              <div className="car-label">车&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;主：</div>
              <div className="car-text">{cardData.driver}</div>
            </div>
            <div className="label-text">
              <div className="car-label">抓拍次数：</div>
              <div className="car-text" onClick={onCaptureClick}><span>{cardData.count}</span> 次 </div>
            </div>
            <div className="time-location">
              最近抓拍信息：
              <div className="time-info">
                <Icon type="shijian" />
                <div className="card-info-content">{cardData.captureTime}</div>
              </div>
              <div className="location-info">
                <Icon type="didian" />
                <div
                  className={classNames("card-info-content location", {
                    'can-click': locationCanClick
                  })}
                  title={cardData.locationName || '-'}
                  onClick={locationCanClick ? handleLocClick : () => { }}
                >{cardData.locationName}</div>
              </div>
              {
                cardData.labels && cardData.labels.length ?
                  <div className="label-info">
                    <Icon type="renyuanku1" />
                    <div className="card-info-content card-label">
                      <div className="label-item">{cardData.labels[0]?.name}</div>
                      {
                        cardData.labels.length > 1 ?
                          <div className="label-more">+{cardData.labels.length - 1}</div>
                          : null
                      }
                    </div>
                  </div>
                  : null
              }
            </div>
          </>
          :
          type === "recordVehicle" ?
            <>
              <div className="label-text">
                <div className="car-label">车辆类别：</div>
                <div className="car-text" title={cardData.vehicleType}>{cardData.vehicleType || "--"}</div>
              </div>
              <div className="label-text">
                <div className="car-label">品牌型号：</div>
                <div className="car-text" title={cardData.vehicleModel}>{cardData.vehicleModel || "--"}</div>
              </div>
              <div className="label-text">
                <div className="car-label">登记日期：</div>
                <div className="car-text" title={cardData.firstRegistrationDate}>{cardData.firstRegistrationDate || "--"}</div>
              </div>
              <div className="label-text">
                <div className="car-label">违章记录：</div>
                <div className="car-text"><em>{cardData.violationRecord || 0}</em>次</div>
              </div>
            </>
            :
            <>
              <div className="label-text">
                <div className="car-label">车辆类别：</div>
                <div className="car-text" title={cardData.vehicleCategory}>{cardData.vehicleCategory || '--'}</div>
              </div>
              <div className="label-text">
                <div className="car-label">登记车型：</div>
                <div className="car-text" title={cardData.registeredVehicleModel}>{cardData.registeredVehicleModel || '--'}</div>
              </div>
              <div className="label-text">
                <div className="car-label">识别车型：</div>
                <div className="car-text" title={cardData.identifyVehicleModel}>{cardData.identifyVehicleModel || '--'}</div>
              </div>

              <div className="label-text">
                <div className="car-label">车身颜色：</div>
                <div className="car-text">{cardData.vehicleColor ? ['其他', '花色', '未知'].includes(cardData.vehicleColor) ? cardData.vehicleColor : `${cardData.vehicleColor}色` : '--'}</div>
              </div>
              <div className="label-text">
                <div className="car-label">发证时间：</div>
                <div className="car-text" title={cardData.firstRegistrationDate}>{cardData.firstRegistrationDate || '--'} </div>
              </div>
              {
                type === 'under' ? <div className="label-text">
                  <div className="car-label">车辆状态：</div>
                  <div className="car-text">{cardData.vehicleStatus || '--'}</div>
                </div>
                  : <div className="label-text">
                    <div className="car-label">处理时间：</div>
                    <div className="car-text" title={cardData.processTime}>{cardData.processTime || '--'} </div>
                  </div>
              }

            </>
      }
    </div>
  </div>
}
export default CarInfo
