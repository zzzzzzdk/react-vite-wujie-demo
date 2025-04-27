import "./index.scss"
import { Radio, Table, Image, Popover, Modal, Pagination } from "@yisa/webui"
import character from "@/config/character.config";
import { Card } from "@/components"
import { useEffect, useState } from "react";
import { RadioChangeEvent } from '@yisa/webui/es/Radio/interface'
import type { PaginationProps } from "@yisa/webui/es/Pagination/interface";
import services, { ApiResponse } from "@/services";
import { RelationData, RelationType, Props } from '../../interface'

const RelationPerson = (props: Props) => {
  const { data } = props
  const prefixCls = "record-detail-relation-person"

  const resultColumns = [
    {
      title: "序号",
      dataIndex: "index",
      width: 70,
      render(_: number, __: RelationData, index: number) {
        return index + 1
      }
    },
    {
      title: "照片",
      dataIndex: "imageUrl",
      // width: 210,
      render(text: string) {
        return <div className="image">
          <Image src={text} />
        </div>
      }
    },
    {
      title: "姓名",
      dataIndex: "name",
    },
    {
      title: "证件号",
      dataIndex: "idNumber",
      render(text: string, record: any) {
        return <div className="id-card" onClick={() => idCardClick(record)}>{text}</div>
      }
    },
    {
      title: "标签",
      dataIndex: "labels",
      width: 380,
      render(text: { color: number, name: string, id: string }[]) {
        return text.length > 3 ?
          <Popover
            overlayClassName={`${prefixCls}-popover-label`}
            title={""}
            content={<ul className="person-label">
              {
                text.map((item: { color: number, name: string, id: string }, index: number) =>
                  <li key={index} className={`label-item label-item-${item.color}`} title={item.name}>{item.name}</li>)
              }
            </ul>
            }
          >
            <ul className="person-label">
              {
                text.slice(0, 3).map((item: { color: number, name: string, id: string }, index: number) =>
                  <li key={index} className={`label-item label-item-${item.color}`} title={item.name}>{item.name}</li>)
              }
              <li key={'more'} className={`label-item label-item-1`}>+{text.length - 3}</li>
            </ul>
          </Popover>
          :
          <ul className="person-label">
            {
              text.map((item: { color: number, name: string, id: string }, index: number) =>
                <li key={index} className={`label-item label-item-${item.color}`} title={item.name}>{item.name}</li>)
            }
          </ul>
      }
    },
    {
      title: "关系",
      dataIndex: "relationNum",
      width: 430,
      render(text: { name: string }[], record: RelationData) {
        return <div className="person-source">
          {
            record.householdName
              ? <li className="source-item"
                key={'同户籍1'}
                onClick={() => handleOpenRelationModalList({ type: 1, name: '同户籍' }, record)}>同户籍</li>
              : null
          }
          {
            character.relationPerson.map(ele => {
              if (text[ele.value]) {
                return <li key={ele.value} className="source-item"
                  onClick={() => handleOpenRelationModalList({ type: ele.value, name: ele.name }, record)}>
                  {`${ele.label}(${text[ele.value]})`}
                </li>
              }
            })
          }
        </div>
      }
    },
  ];
  // 同车违章
  const relationViolateColumns = [
    {
      title: "序号",
      dataIndex: "index",
      width: 70,
      render(_: number, __: RelationData, index: number) {
        return index + 1
      }
    },
    {
      title: "车牌号",
      dataIndex: "licensePlate",
      render(text: string, record: RelationData, index: number) {
        return <span className={`plate2-text plate-bg plate-color-${record?.plateColor || '1'}`} onClick={() => handleClickPlate(record)}>{text}</span>
      }
    },
    {
      title: "车主",
      dataIndex: "name",
    },
    {
      title: "车辆类型",
      dataIndex: "vehicleCategory",
    },
    {
      title: "登记车型",
      dataIndex: "registeredVehicleModel",
    },
    {
      title: "车身颜色",
      dataIndex: "vehicleColor",
    },
    {
      title: "发证日期",
      dataIndex: "firstRegistrationDate",
    },
    {
      title: "车辆状态",
      dataIndex: "vehicleStatus",
    },
  ];
  // 同手机使用人
  const relationPhoneColumns = [
    {
      title: "序号",
      dataIndex: "index",
      width: 70,
      render(_: number, __: RelationData, index: number) {
        return index + 1
      }
    },
    {
      title: "号码",
      dataIndex: "tel",
    },
    {
      title: "来源",
      dataIndex: "personSource",
    },
    {
      title: "使用人",
      dataIndex: "relationSource",
    },
  ];
  // 同车使用人
  const relationCarColumns = [
    {
      title: "序号",
      dataIndex: "index",
      width: 70,
      render(_: number, __: RelationData, index: number) {
        return index + 1
      }
    },
    {
      title: "车主",
      dataIndex: "name",
    },
    {
      title: "车牌号",
      dataIndex: "licensePlate",
      render(text: string, record: RelationData, index: number) {
        return <span className={`plate2-text plate-bg plate-color-${record?.plateColor || '1'}`} onClick={() => handleClickPlate(record)}>{text}</span>
      }
    },
    {
      title: "车辆类型",
      dataIndex: "vehicleCategory",
    },
    {
      title: "登记车型",
      dataIndex: "registeredVehicleModel",
    },
    {
      title: "车身颜色",
      dataIndex: "vehicleColor",
    },
    {
      title: "发证日期",
      dataIndex: "firstRegistrationDate",
    },
  ];
  // 同案件人
  const relationCaseColumns = [
    {
      title: "序号",
      dataIndex: "index",
      width: 70,
      render(_: number, __: RelationData, index: number) {
        return index + 1
      }
    },
    {
      title: "案件标签",
      dataIndex: "caseLabels",
      width: 380,
      align: 'center',
      render(text: { id: string, name: string }[]) {
        return <div className="case-label">{
          text && text.map((ele: { id: string, name: string }) => {
            return <div className="case-text">{ele.name}</div>
          })
        }</div>
      }
    },
    {
      title: "案件类别",
      dataIndex: "caseTypeText",
      width: 150,
      render(text: string) {
        return <div className="case-type">{text}</div>
      }
    },
    {
      title: "案件编号",
      width: 220,
      dataIndex: "caseNumber",
    },
    {
      title: "案发时间",
      dataIndex: "caseTimes",
      width: 220,
      render(text: string[]) {
        return <div>{text && text[0]}</div>
      }
    },
    {
      title: "案发地点",
      dataIndex: "caseRegionName",
      render(text: string, record: any) {
        return <div>{record.caseRegionName + record.caseDetails}</div>
      }
    },
  ];
  // 同出人体
  const relationTravelColumns = [
    {
      title: "序号",
      dataIndex: "index",
      width: 70,
      render(_: number, __: RelationData, index: number) {
        return index + 1
      }
    },
    {
      title: "日期",
      dataIndex: "travelDate",
    },
    {
      title: "车次/航班",
      dataIndex: "trainNumber",
    },
    {
      title: "类型",
      dataIndex: "transportType",
      render(text: string) {
        return text == '1' ? '飞机' : text == '2' ? '火车 ' : text == '3' ? '汽车' : '轮船'
      }
    },
    {
      title: "出发站",
      dataIndex: "departure",
    },
    {
      title: "到达站",
      dataIndex: "destination",
    },
  ];
  // 同上网人
  const relationInterColumns = [
    {
      title: "序号",
      dataIndex: "index",
      width: 70,
      render(_: number, __: RelationData, index: number) {
        return index + 1
      }
    },
    {
      title: "网吧名称",
      dataIndex: "cafesName",
    },
    {
      title: "详细地址",
      dataIndex: "cafesSddress",
    },
    {
      title: "目标人上机时间",
      dataIndex: "onlineTimePerson",
      width: 200,
    },
    {
      title: "关系人上机时间",
      dataIndex: "onlineTimeRelation",
      width: 200,
    },
    {
      title: "目标人下机时间",
      dataIndex: "offlineTimePerson",
      width: 200,
    },
    {
      title: "关系人下机时间",
      dataIndex: "offlineTimeRelation",
      width: 200,
    },
    {
      title: "目标人座位号",
      dataIndex: "terminalNumberPerson",
      width: 80
    },
    {
      title: "关系人座位号",
      dataIndex: "terminalNumberRelation",
      width: 80
    },
  ];
  //同住人
  const relationStayColumns = [
    {
      title: "序号",
      dataIndex: "index",
      width: 70,
      render(_: number, __: RelationData, index: number) {
        return index + 1
      }
    },
    {
      title: "宾馆",
      dataIndex: "hotelName",
      width: 150,
    },
    {
      title: "地区",
      dataIndex: "place",
    },
    {
      title: "详细地址",
      dataIndex: "placeDetails",
    },
    {
      title: "入住时间",
      dataIndex: "checkIn",
      width: 220,
    },
    {
      title: "退宿时间",
      dataIndex: "checkOut",
      width: 220,
    },
    {
      title: "同住天数",
      dataIndex: "hotelCount",
    },
  ];
  //同户籍
  const relationNativeColumns = [
    {
      title: "序号",
      dataIndex: "index",
      width: 70,
      render(_: number, __: RelationData, index: number) {
        return index + 1
      }
    },
    {
      title: "姓名",
      dataIndex: "name",
    },
    {
      title: "身份证号",
      dataIndex: "idNumber",
      render(text: string, record: RelationData) {
        return <div className="id-card" onClick={() => idCardClick(record)}>{text}</div>
      }
    },
    {
      title: "与户主关系",
      dataIndex: "relationName",
    },
    {
      title: "户籍地",
      dataIndex: "houseHold",
      render(text: string) {
        // return <div className="id-card">{text}</div>
        return <div>{text}</div>
      }
    },
  ];

  const relationColumns = {
    [RelationType.stay]: relationStayColumns,//同住人
    [RelationType.phone]: relationPhoneColumns,//同手机使用人
    [RelationType.violate]: relationViolateColumns,//同车违章
    [RelationType.native]: relationNativeColumns,//同户籍
    [RelationType.inter]: relationInterColumns,//同上网人
    [RelationType.case]: relationCaseColumns,//同案件人
    [RelationType.travel]: relationTravelColumns,//同出人体
    [RelationType.car]: relationCarColumns,//同车使用人
  }

  const handleClickPlate = (data: RelationData) => {
    if (!data.licensePlate || data.plateColor) return
    window.open(`#/record-detail-vehicle?${encodeURIComponent(JSON.stringify({ licensePlate: data.licensePlate || '', plateColorTypeId: data.plateColor || '-1' }))}`)
  }
  // 关系对照人数据
  const [compareData, setCompareData]: any = useState({})

  // 获取基本信息
  const getPersonInfoData = () => {
    services.record.getDetailBaseInfo<{ idNumber?: string, groupId?: string[] }, RelationData[]>(data)
      .then(res => {
        if (res.data && res.data.length) {
          setCompareData(res.data[0])
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  // 默认分页
  const defaultPage: { pageNo: number, pageSize: number } = {
    pageNo: 1,
    pageSize: character.pageSizeOptions[0],
  }
  // 关系人列表分页
  const [pageForm, setPageForm] = useState(defaultPage)

  // 关系人弹窗详情分页
  const [pageDetailForm, setPageDetailForm] = useState(defaultPage)

  // 关系人列表类型-单选id
  const [targetType, setTartgetType] = useState<RelationType>(0)

  // 修改关系类型
  const handleTargetTypeChange = (e: RadioChangeEvent) => {
    setTartgetType(e.target.value)
    setPageForm(defaultPage)
    // 搜索关系人列表数据
    getRelationPersonData(e.target.value, defaultPage)
  }

  /*  -----------关系人列表事件-----------*/
  // 关系人列表数据
  const [relationPersonData, setRelationDetalData] = useState<ApiResponse<RelationData[]>>({
    data: [],
    totalRecords: 0
  })

  // 获取关系人列表数据
  const getRelationPersonData = (key: RelationType = targetType, pageData: { pageNo: number, pageSize: number } = pageForm, type = "", relationData?: RelationData) => {
    // 全部不分页
    let ajaxData = { ...data, relationType: key }
    // if (key != 0) {
    //   ajaxData = { ...ajaxData, ...pageData }
    // }
    services.record.getRelationPersonData<{ idNumber?: string, relationType?: RelationType }, RelationData[]>(ajaxData)
      .then(res => {
        if (res.data) {
          // 弹窗中关系人某一类型数据
          if (type == 'modal') {
            setRelationOneData(res)
            setPageDetailForm(defaultPage)
            if (relationData) {
              // 获取关系人详情数据
              getRelationDetailData({ ...relationData, relationType: key }, defaultPage)
            }
          } else {
            setRelationDetalData(res)
          }
        }
      })
  }

  // 修改关系人列表分页
  const handlePageChange: PaginationProps["onChange"] = (current, pageSize) => {
    let newFormData: { pageNo: number, pageSize: number };
    if (pageSize !== pageForm.pageSize) {
      // console.log("pageSize", current, pageSize);
      newFormData = {
        ...pageForm,
        pageNo: 1,
        pageSize: pageSize,
      };
    } else {
      // 页号改变
      console.log("page", current, pageSize);
      newFormData = {
        ...pageForm,
        pageNo: current,
        pageSize: pageSize,
      };
    }
    setPageForm(newFormData)
    getRelationPersonData(targetType, newFormData)
  }

  // 分页配置
  const paginationConfig: PaginationProps = {
    current: pageForm.pageNo,
    pageSize: pageForm.pageSize,
    total: relationPersonData.totalRecords,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: character.pageSizeOptions,
    onChange: handlePageChange,
  };

  useEffect(() => {
    // 获取关系对照人数据
    getPersonInfoData()
    // 获取关系人列表
    getRelationPersonData()
  }, [])
  /*  ------------end-----------*/

  /*  -----------关系人某一类型弹窗展示事件-----------*/

  // 关系人详情弹窗
  const [openRelationVisible, setOpenRelationVisible] = useState<boolean>(false)

  // 某一类关系人类型数据
  const [relationOneData, setRelationOneData] = useState<ApiResponse<RelationData[]>>({
    data: []
  })

  // 当前选中关系人数据
  const [activeRelationData, setActiveRelationData] = useState<RelationData>({
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

  // 关系人类型-弹窗显示
  const [relationTypeData, setRelationTypeData] = useState<{ type: number, name: string }>({
    type: 1,
    name: ""
  })

  // modal - 详情表格数据
  const [relationDetailData, setRelationDetailData] = useState<ApiResponse<RelationData[]>>({
    data: [],
    totalRecords: 0
  })
  // 详情表格loading
  const [detailLoading, setDetailLoading] = useState(false)
  // 关系人弹窗
  const handleOpenRelationModalList = (item: { type: number, name: string }, record: RelationData) => {
    setOpenRelationVisible(true)
    setActiveRelationData(record)
    setRelationTypeData(item)
    if (item.type == 1) {
      // getHouseHoldPerson(record)
      return
    }
    // 搜索关系人该类型列表数据
    getRelationPersonData(item.type, pageForm, 'modal', record)
  }

  // modal -点击关系人
  const handleClickRelation = (item: RelationData, index: number) => {
    setActiveRelationData(item)
    setPageDetailForm(defaultPage)
    // 搜索关系人详情表格数据
    getRelationDetailData({ ...item, relationType: relationTypeData.type }, defaultPage)
  }

  // 搜索关系人详情表格数据
  const getRelationDetailData = (item: RelationData & { relationType: number }, pageData: { pageNo: number, pageSize: number } = pageDetailForm) => {
    setDetailLoading(true)
    if (item.relationType == 1) {
      services.record.getRelationHouseHoldData<any, any>({
        ...pageData,
        fromIdNumber: compareData.idNumber,
        fromIdType: compareData.idCardType,
        toIdNumber: item.idNumber,
        toIdType: item.idType,
        relationType: item.relationType
      })
        .then(res => {
          setDetailLoading(false)
          if (res.data) {
            setRelationDetailData(res)
          }
        })
        .catch(err => {
          setDetailLoading(false)
        })
    } else {
      services.record.getRelationDetailData<any, any>({
        ...pageData,
        fromIdNumber: compareData.idNumber,
        fromIdType: compareData.idCardType,
        toIdNumber: item.idNumber,
        toIdType: item.idType,
        relationType: item.relationType
      })
        .then(res => {
          setDetailLoading(false)
          if (res.data) {
            setRelationDetailData(res)
          }
        })
        .catch(err => {
          setDetailLoading(false)
        })
    }
  }

  // 修改详情弹窗分页
  const handlePageModalChange: PaginationProps["onChange"] = (current, pageSize) => {
    let newFormData: { pageNo: number, pageSize: number };
    if (pageSize !== pageDetailForm.pageSize) {
      // console.log("pageSize", current, pageSize);
      newFormData = {
        ...pageDetailForm,
        pageNo: 1,
        pageSize: pageSize,
      };
    } else {
      // 页号改变
      console.log("page", current, pageSize);
      newFormData = {
        ...pageDetailForm,
        pageNo: current,
        pageSize: pageSize,
      };
    }
    setPageDetailForm(newFormData)
    getRelationDetailData({ ...activeRelationData, relationType: relationTypeData.type }, newFormData)
  }

  // 修改详情弹窗-分页配置
  const paginationModalConfig: PaginationProps = {
    current: pageDetailForm.pageNo,
    pageSize: pageDetailForm.pageSize,
    total: relationDetailData.totalRecords,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: character.pageSizeOptions,
    onChange: handlePageModalChange,
  };

  // 关闭弹窗
  const handleCancel = () => {
    setOpenRelationVisible(false);
    setTimeout(() => {
      setRelationTypeData({ name: "", type: 1 })
    }, 200)
  }

  // 点击身份证号
  const idCardClick = (data: any) => {
    window.open(`#/record-detail-person?${encodeURIComponent(JSON.stringify({
      idNumber: data.idNumber === '未知' ? '' : data.idNumber,
      idType: data.idType || '111',
      groupId: data.groupId ? [data.groupId] : []
    }))}`)
  }

  // 获取户籍中两人关系
  const getHouseHoldPerson = (item: any) => {
    setDetailLoading(true)
    services.record.getHouseHoldDetailData<any, any>({
      fromIdNumber: compareData.idNumber,
      fromIdType: compareData.idCardType,
      toIdNumber: item.idNumber,
      toIdType: item.idType,
    })
      .then(res => {
        setDetailLoading(false)
        if (res.data) {
          setRelationDetailData(res)
        }
      })
      .catch(err => {
        setDetailLoading(true)
      })
  }
  return <div className={`${prefixCls}`}>
    <div className={`${prefixCls}-header`}>
      <Radio.Group
        optionType="button"
        options={character.relationPerson}
        onChange={handleTargetTypeChange}
        value={targetType}
      />
    </div>
    <div className={`${prefixCls}-content`}>
      <Table columns={resultColumns} data={relationPersonData.data} stripe={true} className={`${prefixCls}-table`} />
      {/* {
        targetType != 0 && relationPersonData.totalRecords ?
          <div className="result-pagination">
            <Pagination  {...paginationConfig} />
          </div>
          : null
      } */}
    </div>
    <Modal
      visible={openRelationVisible}
      width={relationTypeData.type == RelationType.native ? 1400 : 1700}
      title="关系详情"
      onCancel={handleCancel}
      footer={null}
      className={`${prefixCls}-relation-modal`}
    >
      <div className="body">
        {
          relationTypeData.type !== RelationType.native ?
            <div className="body-left">
              <div className="title">{relationTypeData.name}({relationOneData.data?.length})</div>
              <div className="content">
                {
                  relationOneData.data && relationOneData.data.map((item: RelationData, index: number) => {
                    return <Card.RelationCard
                      data={item}
                      relationType={relationTypeData}
                      className={`${activeRelationData.idNumber === item.idNumber ? "active-person-item" : ""}`}
                      onCardClick={() => handleClickRelation(item, index)}
                    />
                  })
                }
              </div>
            </div>
            : null
        }
        <div className="body-right">
          <div className="header">
            <Card.RelationCard
              data={activeRelationData || {}}
              idCardClick={(e) => {
                e.stopPropagation()
                idCardClick(activeRelationData)
              }}
            />
            <div className="relation-pk">
              {
                relationTypeData.type !== RelationType.native ? <>
                  <div className="num">
                    <span>{activeRelationData?.relationNum[relationTypeData.type] ? activeRelationData?.relationNum[relationTypeData.type] : 0}</span>
                    次
                  </div>
                  <div className="type">{relationTypeData.name}</div>
                </>
                  : <div className="relation-type">{activeRelationData.householdName}</div>
              }
            </div>
            <Card.RelationCard
              data={{
                ...compareData,
                householdAddress: compareData.native + compareData.nativeAddress,
                imageUrl: compareData.photoUrl
              }}
              idCardClick={(e) => {
                e.stopPropagation()
                idCardClick(compareData)
              }}
            />
          </div>
          <div className="content">
            <Table
              loading={detailLoading}
              columns={relationColumns[relationTypeData.type] || []}
              data={relationDetailData.data}
              stripe={true}
              scroll={{ y: 300 }} />
            {
              relationTypeData.type != 1 && relationDetailData.totalRecords ?
                <div className="result-pagination">
                  <Pagination  {...paginationModalConfig} />
                </div>
                : null
            }
          </div>
        </div>
      </div>
    </Modal>
  </div>
}
export default RelationPerson
