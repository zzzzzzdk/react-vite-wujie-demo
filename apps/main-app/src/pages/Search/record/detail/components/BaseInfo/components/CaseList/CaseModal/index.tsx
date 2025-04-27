import { useState } from 'react'
import { Modal, Row, Col, Popover } from '@yisa/webui'
import { LeftOutlined, RightOutlined } from '@yisa/webui/es/Icon'
import './index.scss'
const CaseModal = (props: any) => {
  const {
    caseData,
    caseVisible,
    onCancel
  } = props
  const prefixCls = 'baseinfo-caselist'

  const [currentIdIndex, setCurrentIdIndex] = useState<number>(0)
  const handeChangeCurrent = (type: 'prev' | 'next') => {
    if (type == 'prev') {
      if (currentIdIndex == 0) return
      setCurrentIdIndex(currentIdIndex - 1)
    } else {
      if (currentIdIndex === caseData.involvePerson?.length - 1) return
      setCurrentIdIndex(currentIdIndex + 1)
    }
  }
  const handleClickIdCard = () => {
    if (caseData.involvePerson[currentIdIndex]?.idNumber) {
      window.open(`#/record-detail-person?${encodeURIComponent(JSON.stringify({
        idNumber: caseData.involvePerson[currentIdIndex]?.idNumber === '未知'? '' : caseData.involvePerson[currentIdIndex]?.idNumber,
        idType: caseData.involvePerson[currentIdIndex]?.idType || '111',
        groupId: [],
        groupPlateId: [],
      }))}`)
    }
  }

  return <Modal
    title={`案件详情(${caseData.involvePerson?.length})`}
    visible={caseVisible}
    onCancel={onCancel}
    footer={null}
    className={`${prefixCls}-case-modal`}
    width={800}
  >
    <div className={`case-detail`}>
      <div className="cell cell-half ">
        <div className="cell-label">案件编号</div>
        <div className="cell-value">{caseData.caseNumber}</div>
      </div>
      <div className="cell cell-half ">
        <div className="cell-label">案件名称</div>
        <div className="cell-value">{caseData.caseName}</div>
      </div>
      <div className="cell cell-half ">
        <div className="cell-label">案件类别</div>
        <div className="cell-value">
          <div className="case-type">{caseData.caseTypeText}</div>
        </div>
      </div>
      <div className="cell cell-half ">
        <div className="cell-label">案件分类</div>
        <div className="cell-value">{caseData.caseClassify || '--'}</div>
      </div>
      <div className="cell cell-half ">
        <div className="cell-label">案件状态</div>
        <div className="cell-value">{caseData.caseStatusText}</div>
      </div>
      <div className="cell">
        <div className="cell-label">案发地区</div>
        <div className="cell-value">{caseData.caseRegionName}</div>
      </div>
      <div className="cell">
        <div className="cell-label">案发时间</div>
        <div className="cell-value">{caseData.caseTimes?.join('-') || '--'}</div>
      </div>
      <div className="cell">
        <div className="cell-label">详细地址</div>
        <div className="cell-value">{caseData.casePlace}</div>
      </div>
      <Row>
        <Col span={12}>
          <div className="cell">
            <div className="cell-label">经纬度</div>
            <div className="cell-value">{caseData.lngLat?.lat};{caseData.lngLat?.lng};</div>
          </div>
        </Col>
        <Col span={12}>
          <div className="cell">
            <div className="cell-label">案件标签</div>
            <div className="cell-value">
              <ul className="case-label">
                {
                  caseData.caseLabels?.slice(0, 2).map((item: any) =>
                    <li key={item.id} className={`label-item`} title={item.name}>{item.name}</li>)
                }
                {
                  caseData.caseLabels?.length > 2
                    ? <Popover
                      overlayClassName={`${prefixCls}-popover-label`}
                      title={""}
                      content={<ul className="case-label">
                        {
                          caseData.caseLabels.map((item: any,) =>
                            <li className={`label-item`} key={item.id} title={item.name}>{item.name}</li>)
                        }
                      </ul>
                      }
                    >
                      <li key={'...'} className={`label-item label-more`}>+{caseData.caseLabels?.length - 2}</li>
                    </Popover>
                    : null
                }
              </ul>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <div className="cell">
            <div className="cell-label">报案人员</div>
            <div className="cell-value">{caseData.imformantName}</div>
          </div>
        </Col>
        <Col span={12}>
          <div className="cell">
            <div className="cell-label">办案人员</div>
            <div className="cell-value">{caseData.handleName?.join(',') || '--'}</div>
          </div>
        </Col>
      </Row>
      <div className="cell cell-status">
        <div className="cell-label">案发内容</div>
        <div className="cell-value">
          {caseData.caseDetails}
        </div>
      </div>
      <div className="id-card">
        {
          caseData.involvePerson?.length > 1 ?
            <div
              className={currentIdIndex === 0 ? "btn-switch btn-left btn-switch-disabled" : "btn-switch btn-left"}
              onClick={() => handeChangeCurrent('prev')}
            >
              <LeftOutlined /></div>
            : null
        }
        <img src={caseData.involvePerson[currentIdIndex]?.personPhoto} alt="" />
        <div className="name">{caseData.involvePerson[currentIdIndex]?.name}</div>
        <div className="idcard" onClick={handleClickIdCard}>{caseData.involvePerson[currentIdIndex]?.idNumber}</div>
        {
          caseData.involvePerson?.length > 1 ?
            <div
              className={currentIdIndex === caseData.involvePerson?.length - 1 ? "btn-switch btn-right btn-switch-disabled" : "btn-switch btn-right"}
              onClick={() => handeChangeCurrent('next')}
            >
              <RightOutlined />
            </div>
            : null
        }
      </div>
    </div>
  </Modal>
}
export default CaseModal