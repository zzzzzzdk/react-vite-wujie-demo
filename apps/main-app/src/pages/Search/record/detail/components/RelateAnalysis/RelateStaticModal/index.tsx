import "./index.scss"
import { Radio, Table, Image, Popover, Modal, Pagination } from "@yisa/webui"
import character from "@/config/character.config";
import { Card } from "@/components"
import { useEffect, useState } from "react";
import { RadioChangeEvent } from '@yisa/webui/es/Radio/interface'
import type { PaginationProps } from "@yisa/webui/es/Pagination/interface";
import services, { ApiResponse } from "@/services";

// 关系人类型
export enum RelationType {
  all,//全部
  native, //同户籍
  phone,// 同手机使用人
  violate,// 同车违章
  car,// 同车使用人
  case,// 同案件人
  travel,// 同出人体
  stay, //同住人
  inter// 同上网人
}

const RelateStaticModal = (props: any) => {
  const {
    openRelationVisible,
    relationTypeData = { type: 1, name: '同户籍' },
    defaultActiveRelationData = {},
    onCancel = () => { },
    recordData = {},
  } = props

  const prefixCls = 'relate-static-modal'
  // 同车违章
  const relationViolateColumns = [
    {
      title: "序号",
      dataIndex: "index",
      width: 70,
      render(_: number, __: any, index: number) {
        return index + 1
      }
    },
    {
      title: "车牌号",
      dataIndex: "licensePlate",
      render(text: string, record: any, index: number) {
        return <span
          className={`plate2-text plate-bg plate-color-${record?.plateColor || '1'}`}
          onClick={() => handleClickDetail(record, 'vehicle')}
        >{text}</span>
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
      render(_: number, __: any, index: number) {
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
      render(_: number, __: any, index: number) {
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
      render(text: string, record: any, index: number) {
        return <span
          className={`plate2-text plate-bg plate-color-${record?.plateColor || '1'}`}
          onClick={() => handleClickDetail(record, 'vehicle')}
        >{text}</span>
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
      render(_: number, __: any, index: number) {
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
      render(_: number, __: any, index: number) {
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
      render(_: number, __: any, index: number) {
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
      render(_: number, __: any, index: number) {
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
      render(_: number, __: any, index: number) {
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
      render(text: string, record: any) {
        return <div className="id-card" onClick={() => handleClickDetail(record)}>{text}</div>
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

  // 点击身份证号或车牌跳转详情
  const handleClickDetail = (data: any, type: string = 'person') => {
    if (type == 'person') {
      window.open(`#/record-detail-person?${encodeURIComponent(JSON.stringify({
        idNumber: data.idNumber === '未知' ? '' : data.idNumber,
        idType: data.idType || '111',
        groupId: data.groupId ? [data.groupId] : [],
        groupPlateId: data.groupPlateId ? [data.groupPlateId] : []
      }))}`)
    } else {
      if (!data.licensePlate || data.plateColor) return
      window.open(`#/record-detail-vehicle?${encodeURIComponent(JSON.stringify({
        licensePlate: data.licensePlate || '',
        plateColorTypeId: data.plateColor || '-1'
      }))}`)
    }
  }

  // 档案人该关系类型数据-左侧
  const [relationData, setRelationData] = useState({
    data: [],
    totalRecords: 0
  })
  // 选中该关系人数据
  const [activeRelationData, setActiveRelationData] = useState(defaultActiveRelationData)

  // 详情表格loading
  const [detailLoading, setDetailLoading] = useState(false)
  // modal - 详情表格数据
  const [relationDetailData, setRelationDetailData] = useState<ApiResponse<any[]>>({
    data: [],
    totalRecords: 0
  })

  // 默认分页
  const defaultPage: { pageNo: number, pageSize: number } = {
    pageNo: 1,
    pageSize: character.pageSizeOptions[0],
  }
  // 关系人弹窗详情分页
  const [pageDetailForm, setPageDetailForm] = useState(defaultPage)

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
    getRelationDetailData()
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

  // 点击关系人-需重新请求该关系人与档案人的关系
  const handleClickRelation = (data: any, index: number) => {
    setActiveRelationData(data)
  }

  // 获取左侧单种关系列表数据
  const getRelationData = () => {
    // 关系类型   档案人
    // setRelationData
  }

  // 获取该关系人与档案人的关系数据
  const getRelationDetailData = () => {
    //关系类型 关系人defaultActiveRelationData  档案人 recordData
    // setRelationDetailData
    // setDetailLoading
  }


  useEffect(() => {
    getRelationDetailData()
    getRelationData()
  }, [])

  return <Modal
    visible={openRelationVisible}
    width={relationTypeData.type == RelationType.native ? 1400 : 1700}
    title="关系详情"
    onCancel={onCancel}
    footer={null}
    className={`${prefixCls}-relation-modal`}
  >
    <div className="body">
      {
        relationTypeData.type !== RelationType.native ?
          <div className="body-left">
            <div className="title">{relationTypeData.name}({relationData.data?.length})</div>
            <div className="content">
              {
                relationData.data && relationData.data.map((item: any, index: number) => {
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
              handleClickDetail(activeRelationData)
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
              ...recordData,
              householdAddress: recordData.native + recordData.nativeAddress,
              imageUrl: recordData.photoUrl
            }}
            idCardClick={(e) => {
              e.stopPropagation()
              handleClickDetail(recordData)
            }}
          />
        </div>
        <div className="content">
          <Table
            loading={detailLoading}
            columns={relationColumns[relationTypeData.type] || []}
            data={relationDetailData.data}
            stripe={true}
            scroll={{ y: 500 }}
            noDataElement={<div className="table-no-data">
              {/* <img src={noData} alt="" /> */}
              <div className="no-data-img"></div>
              {/* <Icon type="zanwushujuqianse" /> */}
              <div> 暂无数据</div>
            </div>}
          />
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
}
export default RelateStaticModal
