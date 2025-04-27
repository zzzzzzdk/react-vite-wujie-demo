import { Table, Modal, PopConfirm, Select, Input, Cascader, Message, Button, } from '@yisa/webui'
import { Icon } from '@yisa/webui/es/Icon'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import Title from '../Title'
import ajax from "@/utils/axios.config"
import './index.scss'
import services from "@/services";
import { BaseInfoProps, TableFormData } from '../interface'
import { UserInfoState } from "@/store/slices/user";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { changeEditSattus } from '@/store/slices/editStatus';
import dayjs from 'dayjs'
import { isFunction, jumpRecordVehicle } from "@/utils";

const TabelInfo = (props: BaseInfoProps) => {
  const {
    title = '基本信息',
    type = 'phone',
    hasEditBtn = true,
    data = {},
    getUrl = '',
    changeUrl = '',
    personInfoData = {}
  } = props
  const prefixCls = 'baseinfo-tableinfo'
  // 查询用户信息
  const user = useSelector<RootState, UserInfoState>(
    (state) => state.user.userInfo
  );
  const dispatch = useDispatch()
  // 查询基本信息是否是编辑状态
  const editStatus = useSelector<RootState, boolean>(
    (state) => state.editStatus.status
  );

  // 联系方式
  const phoneColumns = [
    {
      title: '序号',
      dataIndex: 'index',
      render(_: any, __: any, index: number) {
        return index + 1
      },
      width: 80
    },
    {
      title: '号码类型',
      width: 270,
      dataIndex: 'phoneType',
      // render(text: string, record: any, index: number) {
      //   return <div>
      //     {
      //       isEdit ?
      //         <Select
      //           options={[{ label: '名下', value: '1' }, { label: '工作地址', value: '2' }, { label: '其他', value: '0' },]}
      //           onChange={(value, options: any) => handleChange(value, 'phoneTypeId', record, { phoneType: options?.children })}
      //           value={text}
      //         />
      //         :
      //         text
      //     }
      //   </div>
      // }
    },
    {
      title: '号码',
      width: 270,
      dataIndex: 'accountNumber',
      render(text: string, record: any, index: number) {
        return <div>
          {
            // isEdit ?
            //   <Input onChange={(e) => handleChange(e.target.value, 'accountNumber', record)} value={text} />
            //   :
            text
          }
        </div>
      }
    },
    {
      title: '来源（更新时间）',
      dataIndex: 'sourceAndUpdateTime',
    },
  ]
  // 地址信息
  const addressColumns = [
    {
      title: '序号',
      dataIndex: 'index',
      render(_: any, __: any, index: number) {
        return index + 1
      },
      width: 80
    },
    {
      title: '地址类型',
      dataIndex: 'addressTypeId',
      width: 140,
      render(text: string, record: any, index: number) {
        return <div>
          {
            // isEdit ?
            //   <Select
            //     options={[{ label: '住宅', value: '1' }, { label: '工作地址', value: '2' }, { label: '其他', value: '0' },]}
            //     onChange={(value, options: any) => handleChange(value, 'addressTypeId', record, { addressType: options?.children })}
            //     value={text}
            //   />
            //   :
            record.addressType
          }
        </div>
      }
    },
    {
      title: '地址',
      dataIndex: 'address',
      // width: 426,
      render(text: string, record: any, index: number) {
        return <div>
          {
            // isEdit ?
            //   <div className="address-cell" key={record.id}>
            //     <Cascader
            //       defaultValue={record.place.split('-')}
            //       options={placeData}
            //       onChange={(value: any, options) => {
            //         let place = options.map((ele: any) => ele.name).join('-')
            //         handleChange(value, 'placeCode', record, { place })
            //       }}
            //       // value={record.placeCode}
            //       showSearch={true}
            //       renderFormat={renderFormat}
            //       fieldNames={{
            //         "label": "name",
            //         "value": "id",
            //         "children": "nodes"
            //       }}
            //     />
            //     <Input onChange={(e) => handleChange(e.target.value, 'address', record)} value={record.address} />
            //   </div>
            //   :
            record.type == 'update' ?
              record.place + '   ' + record.address
              : record.address
          }
        </div>
      }
    },
    {
      title: '来源（更新时间）',
      dataIndex: 'sourceAndUpdateTime',
    },
  ]
  // 宾馆住宿
  const hotelColumns = [
    {
      title: '序号',
      dataIndex: 'index',
      render(_: any, __: any, index: number) {
        return index + 1
      },
      width: 80
    },
    {
      title: '入住时间',
      dataIndex: 'startTime',
      width: 200
    },
    {
      title: '退宿时间',
      dataIndex: 'endTime',
      width: 200
    },
    {
      title: '所属地及详细地址',
      dataIndex: 'address',
    },
    {
      title: '宾馆名称',
      dataIndex: 'name',
    },
    {
      title: '房间号',
      dataIndex: 'roomNumber',
      width: 100,
    },
    {
      title: '来源（更新时间）',
      dataIndex: 'source',
    },
  ]
  // 上网记录
  const interColumns = [
    {
      title: '序号',
      dataIndex: 'index',
      render(_: any, __: any, index: number) {
        return index + 1
      },
      width: 80
    },
    {
      title: '网吧名称',
      dataIndex: 'name',
    },
    {
      title: '网吧地址',
      dataIndex: 'address',
    },
    {
      title: '上网终端号',
      dataIndex: 'terminalNumber',
      width: 100,
    },
    {
      title: '上网开始时间',
      dataIndex: 'startTime',
      width: 200
    },
    {
      title: '上网结束时间',
      dataIndex: 'endTime',
      width: 200
    },
    {
      title: '来源（更新时间）',
      dataIndex: 'source',
    },
  ]

  // 违法车辆
  const illegalInfoColumns = [
    {
      title: '序号',
      dataIndex: 'index',
      render(_: any, __: any, index: number) {
        return index + 1
      },
      width: 80
    },
    {
      title: '车牌',
      dataIndex: 'licensePlate',
      render: (text: any, record: any) => {
        const emptyArr = ["无牌", "无车牌", "未识别", "未知"];
        return  !text || emptyArr.includes(text) ?
          // <span className={`plate2-text plate-bg plate-color-8`}></span>
          <span className={`plate2-text`}>{text || "未识别"}</span>
          :
          <a
            target="_blank"
            href={jumpRecordVehicle(record.licensePlate, record.plateColor)}
            className={`plate2-text plate-bg plate-color-${record.plateColor}`}
          >
            {text}
          </a>
      }
    },
    {
      title: '违法时间',
      dataIndex: 'violationTime',
    },
    {
      title: '违法地址',
      dataIndex: 'violationAddress',
      width: 100,
    },
    {
      title: '违法行为',
      dataIndex: 'violationBehavior',
      width: 200
    },
    {
      title: '违法计分',
      dataIndex: 'violationPenaltyPoints',
      width: 200
    },
    {
      title: '罚款金额',
      dataIndex: 'fineAmount',
    },
  ]

  const columns = type == 'address' ? addressColumns
    : type == 'hotel' ? hotelColumns
      : type == 'intel' ? interColumns
      : type == 'illegalInfo' ? illegalInfoColumns 
        : phoneColumns

  // 区域数据
  const [placeData, setPlaceData]: any = useState([])
  // 获取区域数据
  const getPlaceData = () => {
    services.record.getPlaceData({})
      .then(res => {
        if (res?.data) setPlaceData(res?.data)
      })
      .catch(err => {
        console.log(err);
      })
  }
  const [ajaxLoading, setAjaxLoading] = useState(false)
  // 表格数据
  const [tableData, setTableData] = useState<any[]>([])

  // 缓存表格展示数据
  const tableDataRef = useRef(tableData)

  // 是否编辑状态
  const [isEdit, setIsEdit] = useState<boolean>(false)

  // 获取表格数据
  const getTableData = () => {
    setAjaxLoading(true)
    ajax({
      method: 'get',
      url: getUrl,
      data
    }).then(res => {
      setAjaxLoading(false)
      if (res.data) {
        setTableData(res.data)
        tableDataRef.current = res.data
      }
    })
      .catch(err => {
        setAjaxLoading(false)
        setTableData([])
        tableDataRef.current = []
        console.log(err);
      })
  }

  // 修改表格数据
  const changeTableData = () => {
    setAjaxLoading(true)
    console.log(tableData, 'tableData');
    ajax({
      method: 'post',
      url: changeUrl,
      data: {
        ...data,
        name: personInfoData.name || '',
        updateData: tableData
      }
    }).then(res => {
      Message.success('编辑成功')
      setAjaxLoading(false)
      if (res.data) {
        setTableData(res.data)
        tableDataRef.current = res.data
      }
      // getTableData()
    })
      .catch(err => {
        setAjaxLoading(false)
        setTableData(tableDataRef.current)
        console.log(err);
      })
  }

  useEffect(() => {
    getPlaceData()
    // getUrl --获取数据
    if (getUrl) {
      getTableData()
    }
  }, [])

  // 打开编辑状态
  const handleEdit = () => {
    if (editStatus) {
      Message.warning('请对编辑信息进行保存！')
      return
    }
    dispatch(changeEditSattus(true))
    setIsEdit(true)
  }

  // 取消编辑状态
  const handleCancel = () => {
    dispatch(changeEditSattus(false))
    setIsEdit(false)
    // setAddData([])
    setTableData(tableDataRef.current)
  }

  // 保存编辑状态
  const handleSave = () => {
    // 手机号做校验-添加时有校验 不需要重复校验（保留万一表格需要编辑情况）
    // let flag = true
    // if (type == 'phone') {
    // tableData.forEach((item: any) => {
    //   let reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
    //   let typeFlag = ['-', '(', ')', '（', '）'].some(ele => String(item.accountNumber).includes(ele))
    //   if (!reg.test(item.accountNumber) && !typeFlag) {
    //     flag = false
    //   }
    // })
    //   if (!flag) {
    //     Message.warning("请输入正确的手机号")
    //     return
    //   }
    // }
    dispatch(changeEditSattus(false))
    setIsEdit(false)
    // 修改数据
    changeTableData()
  }

  // 操作按钮
  const optionColumns = {
    title: '操作',
    render(text: any, record: any) {
      return <PopConfirm
        title={<span>确认要删除这条内容吗？</span>}
        onConfirm={() => handleDelete(record)}
      >
        <Button size="mini" type="danger">删除</Button>
      </PopConfirm>
    }
  }

  // 删除数据
  const handleDelete = (data: any) => {
    let newData = tableData ? tableData.filter((ele: any) => ele.id !== data.id || ele.type !== 'update') : []
    let resultData = newData.map(ele => {
      if (ele.id == data.id) {
        return { ...ele, type: 'delete' }
      }
      return ele
    })
    console.log(resultData);
    setTableData(resultData)
  }

  // 添加弹窗
  const [addVisible, setAddVisible] = useState(false)

  // 添加数据form
  let defaultFormData: TableFormData = {
    id: '',
    accountNumber: '',
    phoneType: '名下',
    phoneTypeId: '1',
    source: '-',
    sourceAndUpdateTime: '-',
    addressType: '住宅',
    addressTypeId: '1',
    placeCode: [],
    place: '',
    address: '',
  }

  // 新加数据参数
  const [formData, setFormData] = useState(defaultFormData)

  const handleChange = (value: any, type: string, record: any, options: { addressType?: string, address?: string, place?: string } = {}) => {
    let data = tableData.map((ele: any) => {
      if (ele.id == record.id) {
        return {
          ...ele,
          ...options,
          [type]: value
        }
      }
      return ele
    })
    setTableData(data)
  }

  // 弹窗-添加数据
  const handleAdd = () => {
    setAddVisible(true)
  }

  // 弹窗-确认添加数据
  const handleAddTableInfo = () => {
    let newForm = formData
    // 去除无用参数
    let flag = true
    if (type == 'phone') {
      let reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
      let typeFlag = ['-', '(', ')', '（', '）'].some(ele => formData.accountNumber.includes(ele))
      if (!reg.test(formData.accountNumber) && !typeFlag) {
        flag = false
      }
      if (!flag) {
        Message.warning("请输入正确的手机号")
        return
      }
      let delKeys = ['addressType', 'addressTypeId', 'placeCode', 'address', 'address',]
      delKeys.forEach(key => {
        delete newForm[key]
      })
    } else if (type == 'address') {
      if (!newForm.placeCode.length) {
        Message.warning("请选择地址")
        return
      }
      let delKeys = ['accountNumber']
      delKeys.forEach(key => {
        delete newForm[key]
      })
    }
    setAddVisible(false)
    let id = 'add' + Date.now()
    setTableData([
      {
        ...newForm,
        id,
        type: 'update',
        sourceAndUpdateTime: `手动录入 (${user.name}) (${dayjs().format('YYYY-MM-DD HH:mm:ss')})`,
        sourceId: []
      }, ...tableData])
    setFormData(defaultFormData)
  }

  // 弹窗-取消添加数据
  const handleCancelAddTableInfo = () => {
    setAddVisible(false)
    setFormData(defaultFormData)
  }

  // 弹窗-修改添加数据
  const handleAddChangeInput = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    setFormData({
      ...formData,
      [type]: e.target.value
    })
  }

  const handleAddChangeSelect = (value: any, type: string, options: { addressType?: string, address?: string, phoneType?: string, place?: string } = {}) => {
    setFormData({
      ...formData,
      ...options,
      [type]: value,
    })
  }

  const renderFormat = useCallback((valueShow: string[]) => {
    return valueShow.join('-')
  }, [])

  if (!hasEditBtn && !tableData?.length) {
    return null
  }
  return <div className={`${prefixCls}`}>
    <Title
      title={title}
      handleSave={handleSave}
      handleCancel={handleCancel}
      handleEdit={handleEdit}
      handleAdd={handleAdd}
      isEdit={isEdit}
      hasEditBtn={hasEditBtn}
      type='add'
    />
    <div className={`${prefixCls}-content`}>
      <Table
        className="table-info"
        columns={isEdit ? [...columns, optionColumns] : columns}
        data={tableData.filter(ele => ele.type != 'delete')}
        // data={[]}
        // data={isEdit ? [...addData, ...tableData] : tableData}
        stripe={true}
        scroll={{
          y: 350
        }}
        loading={ajaxLoading}
        noDataElement={
          <div className="table-no-data">
            {/* <img src={noData} alt="" /> */}
            <Icon type="zanwushujuqianse" />
            <div> 这里什么都没有......</div>
          </div>
        }
        rowKey={"id"}
      />
    </div>

    <Modal
      title={`请添加${title}`}
      className={`${prefixCls}-add-table-modal`}
      visible={addVisible}
      onOk={handleAddTableInfo}
      onCancel={handleCancelAddTableInfo}
      width={630}
      unmountOnExit={true}
    >
      {
        type == 'address'
          ? <div className="add-address">
            <div className="address-type">
              <div className="label">地址类型:</div>
              <div className="value">
                <Select
                  options={[{ label: '住宅', value: '1' }, { label: '工作地址', value: '2' }, { label: '其他', value: '0' },]}
                  onChange={(value, option: any) => handleAddChangeSelect(value, 'addressTypeId', { addressType: option?.children })}
                  value={formData.addressTypeId}
                />
              </div>
            </div>
            <div className="address-detail">
              <div className="label">地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址:</div>
              <div className="value">
                <Cascader
                  options={placeData}
                  onChange={(value: any, selectedOptions) => {
                    let place = selectedOptions.map((ele: any) => ele.name).join('-')
                    handleAddChangeSelect(value, 'placeCode', { place })
                  }}
                  value={formData.placeCode}
                  showSearch={true}
                  renderFormat={renderFormat}
                  fieldNames={{
                    "label": "name",
                    "value": "id",
                    "children": "nodes"
                  }}
                />
                <Input value={formData.address} onChange={(e) => handleAddChangeInput(e, 'address')} />
              </div>
            </div>
          </div>
          : <div className="add-tel">
            <div className="tel-label">号&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码:</div>
            <div className="tel-value">
              <Select options={[{ label: '名下', value: '1' }, { label: '使用', value: '2' }, { label: '未知', value: '3' }]} style={{ width: '100px' }}
                value={formData.phoneTypeId}
                onChange={(e, option: any) => { handleAddChangeSelect(e, 'phoneTypeId', { phoneType: option?.children }) }} />
              <Input value={formData.accountNumber} onChange={(e) => handleAddChangeInput(e, 'accountNumber')} />
            </div>
          </div>
      }
    </Modal>
  </div>

}
export default TabelInfo
