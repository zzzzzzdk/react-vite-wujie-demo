
import './index.scss';
import { useEffect, useRef, useState } from 'react'
import { Radio, Checkbox, Button, Select, Popover, Modal, Table, Image, Tag } from '@yisa/webui'
import { ResultBox } from "@yisa/webui_business";
import { Card, BigImg } from '@/components'
import character from "@/config/character.config"
import { ResultRowType } from '@/pages/Search/Target/interface';
import { BottomRight, GroupTable } from "@/components"
import { CaseData } from '../../components/BaseInfo/components/interface'
import CaseModal from '../../components/BaseInfo/components/CaseList/CaseModal'
import RelateStaticModal from './RelateStaticModal'
const defaultAreaForm = {
  resultType: 'face',
  clusterType: '1',
  isGroup: false,
  locationId: ''
}
enum RelateType {
  person = 1,
  vehicle,
  area,
  thing
}

const Result = (props: any) => {
  const {
    resultData,
    relateTypeValue,
    handleSearchBtnClick,
    ajaxLoading,
    formData
  } = props

  const prefixCls = 'relate-analysis'
  const personColumns = [
    {
      title: '序号',
      dataIndex: 'index',
      render(_: any, __: any, index: number) {
        return (formData.pageNo - 1) * formData.pageSize + (index + 1)
      },
      width: 80,
    },
    {
      title: '关系人照片',
      dataIndex: 'imageUrl',
      render(text: string) {
        return <div className="image">
          <Image src={text} />
        </div>
      },
      width: 140,
    },
    {
      title: '关系人姓名',
      dataIndex: 'name',
      width: 100,
    },
    {
      title: '关系人证件号',
      dataIndex: 'idNumber',
      width: 200,
      render(text: string, record: any) {
        if (text) {
          return <div className="idNumber" onClick={() => handleClickRecordDetail(record, 'person')}>{text}</div>
        }
        return '--'
      }
    },
    {
      title: '关系人标签',
      dataIndex: 'labels',
      width: 280,
      render(text: any) {
        return text?.length > 2 ?
          <Popover
            overlayClassName={`${prefixCls}-popover-label`}
            title={""}
            content={<ul className="popover-label">
              {
                text?.map((item: { color: number, name: string, id: string }, index: number) =>
                  <li key={index} className={`label-item label-item-${item.color}`} title={item.name}>{item.name}</li>)
              }
            </ul>
            }
          >
            <ul className="popover-label">
              {
                text?.slice(0, 2).map((item: { color: number, name: string, id: string }, index: number) =>
                  <li key={index} className={`label-item label-item-${item.color}`} title={item.name}>{item.name}</li>)
              }
              <li key={'more'} className={`label-item label-item-more`}>+{text.length - 2}</li>
            </ul>
          </Popover>
          :
          <ul className="popover-label">
            {
              text?.map((item: { color: number, name: string, id: string }, index: number) =>
                <li key={index} className={`label-item label-item-${item.color}`} title={item.name}>{item.name}</li>)
            }
          </ul>
      }
    },
    {
      title: '关系',
      dataIndex: 'relate',
      render(text: any, record: any) {
        return <div className="relate-label">
          <div className="static">
            {
              character.relationPerson.map(ele => {
                if (!ele.value) return ''
                return <li key={ele.value} className="static-relate"
                  onClick={() => handleOpenRelationModalList({ type: ele.value, name: ele.name }, record)}>
                  {`${ele.label}`}
                </li>
              })
            }
            {/* <div className="static-relate">同户籍(1)</div>
            <div className="static-relate">同手机使用人(1)</div>
            <div className="static-relate">同车违章(1)</div>
            <div className="static-relate">同车使用(1)</div>
            <div className="static-relate">同案(1)</div>
            <div className="static-relate">同出行(1)</div>
            <div className="static-relate">同住(1)</div> */}
          </div>
          <div className="active">
            <div className="active-relate" onClick={() => handleClickVehicleRelate('行驶车辆')}>同商场区域活跃(1)</div>
            <div className="active-relate" onClick={() => handleClickVehicleRelate('行驶车辆')}>同学校区域活跃(1)</div>
            <div className="active-relate" onClick={() => handleClickVehicleRelate('行驶车辆')}>同小区活跃(1)</div>
            <div className="active-relate" onClick={() => handleClickVehicleRelate('行驶车辆')}>近三月同行(1)</div>
            <div className="active-relate" onClick={() => handleClickVehicleRelate('乘坐车辆')}>近一年同行(1)</div>
            <div className="active-relate" onClick={() => handleClickVehicleRelate('乘坐车辆')}>同主驾(1)</div>
            <div className="active-relate" onClick={() => handleClickVehicleRelate('乘坐车辆')}>主副驾(1)</div>
          </div>
        </div>
      }
    },
    {
      title: '关系亲密度',
      dataIndex: 'relateNum',
      width: 100,
      render() {
        return 87
      }
    },
  ]
  const vehicleColumns = [
    {
      title: '序号',
      dataIndex: 'index',
      render(_: any, __: any, index: number) {
        return (formData.pageNo - 1) * formData.pageSize + (index + 1)
      },
      width: 80,
    },
    {
      title: '车辆图片',
      dataIndex: 'vehicleImage',
      render(text: string) {
        return <div className="image">
          <Image src={text} />
        </div>
      },
      width: 200,
    },
    {
      title: '车牌',
      dataIndex: 'licensePlate',
      width: 220,
      render(text: string, record: any) {
        if (record.licensePlate) {
          return <div
            className={`plate2-text plate-bg plate-color-${record.plateColor}`}
            onClick={() => handleClickRecordDetail(record, 'vehicle')}
          >
            {record.licensePlate}
          </div>
        }
        return '--'
      }
    },
    {
      title: '车辆类别',
      dataIndex: 'vehicleCategory',
    },
    {
      title: '使用性质',
      dataIndex: 'useNature',
    },
    {
      title: '车辆型号',
      dataIndex: 'identifyVehicleModel',
    },
    {
      title: '车辆标签',
      dataIndex: 'labels',
      render(text: any) {
        console.log(text, resultData.data, 'text');
        return text?.length > 2 ?
          <Popover
            overlayClassName={`${prefixCls}-popover-label`}
            title={""}
            content={<ul className="popover-label">
              {
                text.map((item: { color: number, name: string, id: string }, index: number) =>
                  <li key={index} className={`label-item label-item-${item.color}`} title={item.name}>{item.name}</li>)
              }
            </ul>
            }
          >
            <ul className="popover-label">
              {
                text.slice(0, 2).map((item: { color: number, name: string, id: string }, index: number) =>
                  <li key={index} className={`label-item label-item-${item.color}`} title={item.name}>{item.name}</li>)
              }
              <li key={'more'} className={`label-item label-item-more`}>+{text.length - 2}</li>
            </ul>
          </Popover>
          :
          <ul className="popover-label">
            {
              text?.map((item: { color: number, name: string, id: string }, index: number) =>
                <li key={index} className={`label-item label-item-${item.color}`} title={item.name}>{item.name}</li>)
            }
          </ul>
      }
    },
    {
      title: '关系',
      dataIndex: 'relate',
      render(text: any, record: any) {
        return <div className="relate-label">
          <div className="static">
            <div className="static-relate">处理交通违法</div>
          </div>
          <div className="active">
            <div className="active-relate" onClick={() => handleClickVehicleRelate('行驶车辆')}>行驶车辆</div>
            <div className="active-relate" onClick={() => handleClickVehicleRelate('乘坐车辆')}>乘坐车辆</div>
          </div>
        </div>
      }
    },
  ]
  const thingColumns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
      render(_: any, __: any, index: number) {
        return (formData.pageNo - 1) * formData.pageSize + (index + 1)
      },
    },
    {
      title: '事件类型',
      dataIndex: 'caseType',
      width: 150,
    },
    {
      title: '事件编号',
      dataIndex: 'caseNumber',
      width: 250,
      render(text: string, record: CaseData) {
        return <div className="case-number" onClick={() => handleOpenCaseModal(record)}>{text}</div>
      }
    },
    {
      title: '事件名称',
      dataIndex: 'caseName',
      render(text: string, record: CaseData) {
        return <div className="case-number" onClick={() => handleOpenCaseModal(record)}>{text}</div>
      }
    },
    {
      title: '事件详情',
      dataIndex: 'caseDetails',
      width: 200,
      render(text: string, record: CaseData) {
        return <div className="case-details">{text}</div>
      }
    },
    {
      title: '事发时间',
      dataIndex: 'caseTimes',
      width: 180,
      render(text: string[]) {
        return (text && text[0]) || '--'
      }
    },
    {
      title: '关系',
      dataIndex: 'relate',
      width: 200,
      render(_: any, record: CaseData) {
        return <span className="static-relate" onClick={() => handleOpenCaseModal(record)}>涉案关系</span>
      }
    },
  ]

  const defaultColumns = relateTypeValue == RelateType.person ? personColumns
    : relateTypeValue == RelateType.vehicle ? vehicleColumns :
      relateTypeValue == RelateType.thing ? thingColumns : []

  // 跳转详情页
  const handleClickRecordDetail = (data: any, type: string) => {
    if (type == 'person') {
      window.open(`#/record-detail-person?${encodeURIComponent(JSON.stringify({
        idNumber: data.idNumber || '',
        idType: data.idType || '111',
        groupId: data.groupId || [],
        groupPlateId: data.groupPlateId || [],
        feature: data.feature || ''
      }))}`)
    } else {
      window.open(`#/record-detail-vehicle?${encodeURIComponent(JSON.stringify({
        licensePlate: data.licensePlate || '',
        plateColorTypeId: data.plateColor || '-1'
      }))}`)
    }
  }

  // 人地关系-额外参数
  const [areaFormData, setAreaFormData] = useState<{
    resultType: string,//目标类型
    clusterType: string,//抓拍类型
    isGroup: boolean//是否按点位组分组
    locationId?: string//点位分组之后获取具体数据
  }>(defaultAreaForm)
  const areaFormDataRef = useRef(areaFormData)
  areaFormDataRef.current = areaFormData

  // 动态展示每行数据
  const [listCount, setListCount] = useState(7)
  useEffect(() => {
    const calcListCount = () => {
      const itemWidth = 208
      const width = (document.querySelector('.result-data')?.clientWidth || 0) - 126 // 126为总间距
      const count = Math.floor(width / itemWidth)
      if (count >= 7 || count <= 2) {
        setListCount(count < 0 ? 7 : count)
      } else {
        const diff = width - itemWidth * count + 18 * (count - 1)
        if (diff >= itemWidth * (count / (count + 1))) {
          setListCount(count + 1)
        } else {
          setListCount(count)
        }
      }
    }
    calcListCount()
    window.addEventListener('resize', calcListCount)

    return () => {
      window.removeEventListener('resize', calcListCount)
    }
  }, [])

  // 检索
  const handleSearch = () => {
    handleSearchBtnClick && handleSearchBtnClick(areaFormDataRef.current)
  }
  // 人车关系-动态关系弹窗
  const [vehicleVisible, setVehicleVisible] = useState(false)
  // 人车关系-动态关系弹窗数据
  const [vehicleData, setVehicleData] = useState([])

  const [ajaxVehicleLoading, setAjaxVehicleLoading] = useState(false)
  const [vehicleTitle, setVehicleTitle] = useState('')
  const handleClickVehicleRelate = (data: any) => {
    setVehicleVisible(true)
    setVehicleTitle(data)
    setVehicleData(resultData.data)
  }

  // 人事关系-案件弹窗详情数据
  const [caseDetailData, setCaseDetailData] = useState<CaseData>({
    "id": "",
    "caseName": "",
    "caseNumber": "",
    "caseType": "",
    caseTypeText: '',
    "caseClassify": "",
    "caseStatus": "",
    "caseStatusText": "",
    "caseRegionName": "",
    "caseTimes": [],
    "casePlace": "",
    "lngLat": {
      "lat": "",
      "lng": ""
    },
    "caseLabels": [],
    "imformantName": "",
    "handleName": [],
    "involvePerson": [],
    "caseDetails": ""
  })
  const [caseVisible, setCaseVisible] = useState(false)

  const handleOpenCaseModal = (data: CaseData) => {
    setCaseDetailData(data)
    setCaseVisible(true)
  }
  // 大图
  const [bigImgModal, setBigImgModal] = useState({
    visible: false,
    currentIndex: 0
  })
  // 地图
  const [bottomRightMapVisible, setBottomRightMapVisible] = useState(false)
  // 打开大图
  const handleOpenBigImg = (index: number) => {
    setBigImgModal({
      visible: true,
      currentIndex: index
    })
  }

  // 关闭大图
  const handleCloseBigImg = () => {
    setBigImgModal({
      visible: false,
      currentIndex: 0
    })
  }

  const bigModalData = relateTypeValue == RelateType.area ? resultData.data : vehicleData
  const currentData: ResultRowType = Array.isArray(bigModalData) && bigModalData[bigImgModal.currentIndex] ? bigModalData[bigImgModal.currentIndex] : ({} as ResultRowType)

  // 点击卡片点位名称
  const handleLocationClick = (index: number) => {
    setBottomRightMapVisible(true)
    setBigImgModal({
      visible: false,
      currentIndex: index
    })
  }

  // 按点位分组-点击数量
  const handleGroupTableFilter = (groupId: string, group: string) => {
    console.log(groupId, group);
    const newAreaForm = Object.assign({}, areaFormData, {
      locationId: group
    })
    setAreaFormData(newAreaForm)
    areaFormDataRef.current = newAreaForm
    handleSearch()
  }

  // 关闭具体点位分组展示数据
  const handleCloseGroup = () => {
    const newAreaForm = Object.assign({}, areaFormData, {
      locationId: ''
    })
    setAreaFormData(newAreaForm)
    areaFormDataRef.current = newAreaForm
    handleSearch()
  }
  // 渲染按点位分组页面
  const handleRenderGroup = () => {
    return (
      <GroupTable
        data={resultData.data}
        pageSize={formData.pageSize}
        tableConfig={{
          name: '点位',
          countTitle: areaFormData.resultType === 'vehicle' ? '过车数量' : '数量'
        }}
        onSelect={handleGroupTableFilter}
      />
    )
  }

  // 渲染卡片
  const handleRenderCard = () => {
    const data = resultData.data || []
    let template = []
    for (let i = 0; i < data.length; i = i + listCount) {
      let _template = []
      for (let j = i; j < i + listCount; j++) {
        if (j < data.length) {
          _template.push(
            <Card.Normal
              showChecked={false}
              key={data[j].infoId}
              cardData={data[j]}
              onImgClick={() => handleOpenBigImg(j)}
              onLocationClick={() => handleLocationClick(j)}
            />
          )
        } else {
          _template.push(<div className="card-item-flex" key={j + 'flex'} />)
        }
      }
      template.push(<div className="result-card-list-row" key={i}>{_template}</div>)
    }
    return template
  }

  //人人关系- 静态关系弹窗
  const [relationStaticVisible, setRelationStaticVisible] = useState(false)
  // 人人关系- 动态关系弹窗
  const [relationActiveVisible, setRelationActiveVisible] = useState(false)
  const [relationTypeData, setRelationTypeData] = useState({
    type: 1,
    name: '同户籍'
  })
  // 当前选中关系人数据
  const [activeRelationData, setActiveRelationData] = useState<any>({
    id: '',
    "name": '',
    "age": 0,
    "sex": '',
    "address": '',
    "idNumber": '',
    idType: '',
    "source": [],
    "labels": [],
    num: '',
    "householdName": "",
    "relationNum": {},
  })
  // 关系人弹窗
  const handleOpenRelationModalList = (item: { type: number, name: string }, record: any) => {
    setRelationStaticVisible(true)
    setActiveRelationData(record)
    setRelationTypeData(item)
    // getHouseHoldPerson(record)
  }

  // 关闭弹窗
  const handleCancel = () => {
    setRelationStaticVisible(false);
    setTimeout(() => {
      setRelationTypeData({ name: "", type: 1 })
    }, 200)
  }

  return <>
    <div className="total-header">
      <div className="total-num">
        共 <span>{ajaxLoading ? '···' : resultData.totalRecords}</span>条数据，用时<span>{ajaxLoading ? '···' : resultData.usedTime}</span>秒
      </div>
      {
        relateTypeValue == RelateType.area &&
        <div className="total-options">
          <Radio.Group
            optionType="button"
            options={character.targetTypes}
            onChange={(e) => {
              let newFormData = Object.assign({}, areaFormData, {
                resultType: e.target.value,
                clusterType: '1',
                isGroup: false,
                locationId: ''
              })
              setAreaFormData(newFormData)
              areaFormDataRef.current = newFormData
              handleSearch()
            }}
            value={areaFormData.resultType}
          />
          <Select
            options={[
              { label: '抓拍人脸', value: '1' },
              { label: '车中人脸', value: '2' },
            ]}
            value={areaFormData.clusterType}
            onChange={(v) => {
              let newFormData = Object.assign({}, areaFormData, {
                clusterType: v,
                locationId: '',
                isGroup: false,
              })
              setAreaFormData(newFormData)
              areaFormDataRef.current = newFormData
              handleSearch()
            }}
            // @ts-ignore
            getTriggerContainer={(triggerNode) =>
              triggerNode.parentNode as HTMLElement
            }
          />
          <Checkbox
            onChange={(e) => {
              let newFormData = Object.assign({}, areaFormData, {
                isGroup: e.target.checked,
                locationId: '',
              })
              setAreaFormData(newFormData)
              areaFormDataRef.current = newFormData
              handleSearch()
            }}
            checked={areaFormData.isGroup}
          >
            按点位组分组
          </Checkbox>
          {
            areaFormData.locationId ? <Tag closable onClose={handleCloseGroup}>{areaFormData.locationId}</Tag>
              : null
          }
        </div>
      }
    </div>
    <div className="result-data">
      {
        relateTypeValue == RelateType.area
          ?
          areaFormData.isGroup && !areaFormData.locationId
            ? handleRenderGroup()
            : <ResultBox
              loading={ajaxLoading}
              nodata={resultData.totalRecords == 0}
              nodataTip="暂无数据"
            >
              {handleRenderCard()}
            </ResultBox>
          :
          <Table
            className="table-data"
            data={resultData.data}
            loading={ajaxLoading}
            columns={defaultColumns}
            stripe={true}
            noDataElement={
              <div className="table-no-data">
                {/* <img src={noData} alt="" /> */}
                <div className="no-data-img"></div>
                {/* <Icon type="zanwushujuqianse" /> */}
                <div> 暂无数据</div>
              </div>
            }
          />
      }
    </div>
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
      data={bigModalData}
    />
    {
      bottomRightMapVisible &&
      <BottomRight
        name={currentData.locationName || "--"}
        lat={currentData.lngLat?.lat || null}
        lng={currentData.lngLat?.lng || null}
        onClose={() => { setBottomRightMapVisible(false) }}
      />
    }
    <CaseModal
      key={caseDetailData.caseNumber}
      caseData={caseDetailData}
      caseVisible={caseVisible}
      onCancel={() => setCaseVisible(false)}
    />
    <Modal
      visible={vehicleVisible}
      onCancel={() => setVehicleVisible(false)}
      onOk={() => setVehicleVisible(false)}
      className={`${prefixCls}-vehicle-modal`}
      width={1400}
      title={vehicleTitle}
    >
      <div className="result-data">
        <ResultBox
          loading={ajaxVehicleLoading}
          nodata={vehicleData.length == 0}
          nodataTip="暂无数据"
        >
          {
            vehicleData.map((ele: any, index: number) => {
              return <Card.Normal
                showImgZoom={true}
                showChecked={false}
                key={ele.infoId}
                cardData={ele}
                onImgClick={() => handleOpenBigImg(index)}
                onLocationClick={() => handleLocationClick(index)}
              />
            })
          }
        </ResultBox>
      </div>
    </Modal>
    {/* 人人关系-静态弹窗 */}
    <RelateStaticModal
      openRelationVisible={relationStaticVisible}
      relationTypeData={relationTypeData}
      defaultActiveRelationData={activeRelationData}
      onCancel={handleCancel}
      // recordData={}
    />
  </>
}
export default Result
