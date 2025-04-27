import React, { useState, useEffect, useCallback } from "react";
import { Modal, Form, Radio, Message, Input, Tooltip, TreeSelect, Select } from '@yisa/webui'
import { Icon } from '@yisa/webui/es/Icon'
import BaseModalProps, { RadioDataType } from "./../LabelSetModal/interface";
import LabelModalProps, { ModalDataType } from "./interface";
import { isObject, isFunction } from "@/utils";
import { FormRadioGroup, TimeRangePicker } from "@/components"
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import useReceivers from "@/pages/Deploy/hooks/useReceivers";
import "./index.scss"
import { ResultLabelItem } from '../../interface';
import services from "@/services";
import { SelectCommonProps } from "@yisa/webui/es/Select/interface";
import RuleSelect from "./RuleSelect";
import { LocationData } from "@/components/LocationMapList/interface";
import { DatesParamsType } from "@/components/TimeRangePicker/interface";

const { InputNumber } = Input;

const typeSwitchData = [
  { value: 'personnel', label: '人员' },
  // { value: 'spaceTime', label: '时空' },
  { value: 'vehicle', label: '车辆' },
]

const ruleSwitchData = [
  { value: 'manual', label: '手动打标签' },
  // { value: 'rule', label: '根据配置规则打标签' },
]
const LabelDeploySwitchData = [
  { value: 'yes', label: '是' },
  { value: 'no', label: '否' },
]

const switchData = [
  { value: 'all', label: '全部可见' },
  { value: 'part', label: '部分可见' },
]

const labelColor = [
  { label: "紫色", value: 1 },
  { label: "黄色", value: 2 },
  { label: "蓝色", value: 3 },
  { label: "绿色", value: 4 },
  { label: "青色", value: 5 },
]

const timeRangeSwitch = [
  { value: 'nonFixed', label: '非固定时间' },
  { value: 'fixed', label: '固定时间' },
]

const LabelModal = (props: LabelModalProps) => {
  const {
    modalProps,
    onModalConfirm,
    modalType = 'view',
    data = {} as unknown as ResultLabelItem,
    selectData = {
      // 标签集
      labelSet: [],
      // 标签名称
      labelName: [],
      // 创建人
      creator: [],
      // 创建人所属部门
      creatorDepart: [],
      // 标签类型
      labelType: []
    },
    receiverList = []
  } = props

  const defaultModalData: ModalDataType = {
    labelSetId: undefined,
    // labelType: 'personnel',
    labelName: '',
    labelColorId: 1,
    remarks: '',
    ruleType: 'manual',
    canDeploy: 'yes',
    labelTypeId: 'personnel',
    // 时空标签更新规则参数
    locationGroupIds: [],
    timeType: 'nonFixed',
    beginDate: dayjs().subtract(Number(6) - 1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    beginTime: null,
    endTime: null,
    timeRange: {
      times: [],
      period: 0
    },
    captureCounts: 0,
    captureDays: 0
  }
  const [modalData, setModalData] = useState(defaultModalData)

  const defaultPermissions: RadioDataType = {
    type: 'all',
    persons: [],
    names: []
  }

  // 可见权限
  const [visiblePermissions, setVisiblePermissions] = useState<RadioDataType>(defaultPermissions)
  // 管理权限
  const [managePermissions, setManagePermissions] = useState<RadioDataType>({
    ...defaultPermissions,
    type: 'part'
  })
  // 关联点位组
  const [locationGroupData, setLocationGroupData] = useState<LocationData[]>([])

  // 固定选中的树节点，放在treeSelect组件value的最前面
  const [checkedNodes, setCheckedNodes] = useState<typeof receiverList>([
    // {
    //   name: '用户1',
    //   id: 'yiyisasasa',
    //   type: 'user'
    // }
  ])

  useEffect(() => {
    if (data && modalProps?.visible) {

      // 查看是格式化显示人
      if (modalType === 'view') {
        if (data.managePersons) {
          setManagePermissions(() => (
            {
              ...managePermissions,
              names: findPersonNames(data.managePersons)
            }
          ))
        }
        if (data.visiblePersons) {
          setVisiblePermissions(() => (
            {
              ...visiblePermissions,
              names: findPersonNames(data.visiblePersons)
            }
          ))
        }
      }

      if (modalType === 'edit') {
        setModalData({
          ...modalData,
          ...data
        })

        if (data.managePersons) {
          setManagePermissions(() => (
            {
              ...managePermissions,
              type: data.managePermissions,
              persons: data.managePersons
            }
          ))
        }
        if (data.visiblePersons) {
          setVisiblePermissions(() => (
            {
              ...visiblePermissions,
              type: data.visiblePermissions,
              persons: data.visiblePersons
            }
          ))
        }
      }
    }
  }, [props.data, modalProps?.visible])

  // 寻找人员名称
  const findPersonNames = (ids: string[]) => {
    const names: string[] = []
    const _ids = new Set(ids)
    function df(arr: typeof receiverList) {
      arr.forEach(item => {
        if (_ids.has(item.id)) {
          names.push(item.name)
        }

        if (item.children && item.children.length) {
          df(item.children)
        }
      })
    }
    df(receiverList)
    return names
  }

  // 弹框确认
  const handleOk = () => {
    const { labelSetId, labelName, labelTypeId, rule, locationGroupIds, captureCounts, captureDays } = modalData
    if (!labelSetId) {
      Message.warning('标签集不能设置为空')
      return
    }
    if (!labelName) {
      Message.warning('标签名称不能设置为空')
      return
    }
    if (labelTypeId === 'personnel') {
      if (modalData.ruleType === 'rule') {
        if (!rule?.length) {
          Message.warning('规则配置不能设置为空')
          return
        }
      }
    }
    if (labelTypeId === 'spaceTime') {
      if (!locationGroupIds || !locationGroupIds.length) {
        Message.warning('关联点位组不能设置为空')
        return
      }
      if (!captureCounts) {
        Message.warning('每日抓拍次数不能设置0')
        return
      }
      if (!captureDays) {
        Message.warning('抓拍天数不能设置0')
        return
      }
    }

    if (visiblePermissions.type === 'part') {
      if (!visiblePermissions.persons.length) {
        Message.warning('可见权限人员不能设置为空')
        return
      }
    }
    if (managePermissions.type === 'part') {
      if (!managePermissions.persons.length) {
        Message.warning('管理权限人员不能设置为空')
        return
      }
    }
    const form = {
      ...modalData,
      visiblePermissions: visiblePermissions.type,
      managePermissions: managePermissions.type,
      ...(visiblePermissions.type === 'part' ? {
        visiblePersons: visiblePermissions.persons
      } : {}),
      ...(managePermissions.type === 'part' ? {
        managePersons: managePermissions.persons
      } : {})
    }
    console.log(form)

    // 提交标签 更新
    services.labelManage.updateLabel(form).then(res => {
      if (onModalConfirm && isFunction(onModalConfirm)) {
        onModalConfirm(form)
        resetModalData()
      }
      Message.success(res.message || '标签更新成功')
    }).catch(err => {
      console.log(err)
      Message.error(err.message || '标签更新失败')
    })
  }

  // 弹框取消
  const handleCancel = () => {
    if (modalProps && modalProps.onCancel && isFunction(modalProps.onCancel)) {
      modalProps.onCancel()
    }
    resetModalData()
  }

  // 筛选树节点
  const filterTreeNode = useCallback((inputText: string, node: any) => {
    return node.props.title.toLowerCase().indexOf(inputText.toLowerCase()) > -1;
  }, []);

  // 重置弹框数据
  const resetModalData = () => {
    setModalData(defaultModalData)
    setManagePermissions(defaultPermissions)
    setVisiblePermissions(defaultPermissions)
  }

  // 下拉选择
  const handleFormSelectChange = (
    value: SelectCommonProps["value"],
    fieldName: string
  ) => {
    let newValue = value;

    setModalData({
      ...modalData,
      [fieldName]: newValue,
    });
  };



  // 日期改变事件
  const handleDateChange = (dates: DatesParamsType) => {
    setModalData({
      ...modalData,
      // timeType: dates.timeType,
      beginDate: dates.beginDate,
      endDate: dates.endDate,
      beginTime: dates.beginTime,
      endTime: dates.endTime,
    })
  }

  //获取点位组数据
  const getLocationGroup = async () => {
    const res = await services.location.getLocationList({
      needType: "2",
      typeId: "1,2,3,4",
    })
    setLocationGroupData(res.data as LocationData[])
  }

  useEffect(() => {
    getLocationGroup()
  }, [])

  const isView = modalType === 'view'

  // 人员目标类型规则
  const personnelRule = () => (
    <Form labelAlign="left">
      <Form.Item label="更新规则" required>
        {
          isView ?
            // <span>{data.remarks || '--'}</span>
            <span>手动打标签</span>
            :
            <Radio.Group
              size="mini"
              options={ruleSwitchData}
              value={modalData.ruleType}
              onChange={(e) => {
                setModalData({
                  ...modalData,
                  ruleType: e.target.value,
                  rule: [['sex', '=', '']]
                });
              }}
            />
        }
      </Form.Item>
      {
        modalData.ruleType === 'rule' &&
        <RuleSelect
          selectData={selectData}
          rule={modalData.rule || []}
          onChange={(data) => {
            setModalData({
              ...modalData,
              rule: data
            })
          }}
        />
      }
    </Form>
  )

  // 时空目标类型规则
  const spaceTimeRule = () => (
    <Form labelAlign="left" className="space-time-rule">
      <Form.Item label="关联点位组" required>
        <TreeSelect
          allowClear
          placeholder="请选择"
          showSearch
          multiple
          treeCheckable
          fieldNames={{
            key: "id",
            title: "text",
          }}
          maxTagCount={2}
          filterTreeNode={filterTreeNode}
          value={modalData.locationGroupIds}
          treeData={locationGroupData}
          treeCheckedStrategy="child"
          onChange={(value) => {
            // console.log(value);
            setModalData({
              ...modalData,
              locationGroupIds: value
            });
          }}
        />
      </Form.Item>
      <Form.Item label="统计时间范围" required>
        <div className="time-range">
          <Radio.Group
            size="mini"
            options={timeRangeSwitch}
            value={modalData.timeType}
            onChange={(e) => {
              setModalData({
                ...modalData,
                timeType: e.target.value
              });
            }}
          />
          {
            modalData.timeType === 'fixed' ?
              <TimeRangePicker
                formItemProps={{ label: null }}
                beginDate={modalData.beginDate}
                endDate={modalData.endDate}
                beginTime={modalData.beginTime}
                endTime={modalData.endTime}
                onChange={handleDateChange}
                showinnerTimeType={false}
                timeLayout="vertical"
              />
              :
              <div className="non-fixed-time">
                近
                <InputNumber
                  min={0}
                  value={modalData.timeRange.period}
                  onChange={(val) => {
                    setModalData({
                      ...modalData,
                      timeRange: {
                        period: val || 0,
                      }
                    })
                  }}
                />
                日
              </div>
          }
        </div>
      </Form.Item>
      <Form.Item label="每日抓拍次数" required>
        <InputNumber
          min={0}
          value={modalData.captureCounts}
          onChange={(val) => {
            setModalData({
              ...modalData,
              captureCounts: val || 0
            })
          }}
        />
      </Form.Item>
      <Form.Item label="抓拍天数" required>
        <InputNumber
          min={0}
          value={modalData.captureDays}
          onChange={(val) => {
            setModalData({
              ...modalData,
              captureDays: val || 0
            })
          }}
        />
      </Form.Item>
    </Form>
  )

  return (
    <Modal
      title={`${modalType === 'add' ? '新建' : modalType === 'edit' ? '编辑' : '查看'}标签`}
      {...(modalProps || {})}
      className="label-modal"
      onOk={handleOk}
      onCancel={handleCancel}
      {...(modalType === 'view' ? { footer: null } : {})}
    >
      <div className="form-area-item">
        <div className="form-area-item-title">标签基本信息</div>
        <Form labelAlign="left">
          <Form.Item label="标签集" className="vehicle-form-item" required>
            {
              isView ?
                <span>{data.labelSetName || '--'}</span>
                :
                <Select
                  allowClear
                  options={selectData.labelSet}
                  onChange={(value) => handleFormSelectChange(value, "labelSetId")}
                  value={modalData.labelSetId}
                  showSearch={true}
                  // mode="multiple"
                  maxTagCount={1}
                  // @ts-ignore
                  getTriggerContainer={(triggerNode) =>
                    triggerNode.parentNode as HTMLElement
                  }
                />
            }
          </Form.Item>
          <Form.Item label="标签名称" required>
            {
              isView ?
                <span>{data.labelName || '--'}</span>
                :
                <Input
                  maxLength={15}
                  showWordLimit
                  value={modalData.labelName}
                  placeholder="请输入"
                  onChange={(e) => {
                    setModalData({ ...modalData, labelName: e.target.value });
                  }}
                />
            }
          </Form.Item>
          <Form.Item label="目标类型" required>
            {
              isView ?
                <span>{data.labelType || '--'}</span>
                :
                <Radio.Group
                  size="mini"
                  // optionType="button"
                  options={typeSwitchData}
                  value={modalData.labelTypeId}
                  onChange={(e) => {
                    setModalData({
                      ...modalData,
                      labelTypeId: e.target.value
                    });
                  }}
                  disabled={modalType !== 'add'}
                />
            }
          </Form.Item>
          <Form.Item label="标签颜色" className="vehicle-form-item">
            {
              isView ?
                <span>{data.labelColorId ? labelColor.find((item) => item.value === data.labelColorId)?.label : '--'}</span>
                :
                <Select
                  allowClear
                  options={labelColor}
                  onChange={(value) => handleFormSelectChange(value, "labelColorId")}
                  value={modalData.labelColorId}
                  showSearch={true}
                  // @ts-ignore
                  getTriggerContainer={(triggerNode) =>
                    triggerNode.parentNode as HTMLElement
                  }
                />
            }
          </Form.Item>
          <Form.Item className="passingCount" label="标签备注">
            {
              isView ?
                <span>{data.remarks || '--'}</span>
                :
                <Input
                  maxLength={30}
                  showWordLimit
                  value={modalData.remarks}
                  placeholder="请输入"
                  onChange={(e) => {
                    setModalData({ ...modalData, remarks: e.target.value });
                  }}
                />
            }
          </Form.Item>
        </Form>
      </div>
      <div className="form-area-item">
        <div className="form-area-item-title">标签更新规则</div>
        {
          modalData.labelTypeId === 'spaceTime' ?
            spaceTimeRule()
            :
            personnelRule()
        }
      </div>
      <div className="form-area-item">
        <div className="form-area-item-title">标签权限配置</div>
        <Form className="permissions-form" labelAlign="left">
          <Form.Item label="是否可布控" required>
            {
              isView ?
                <span>{(data.canDeploy || '--') == 'yes' ? '是' : '否'}</span>
                :
                <Radio.Group
                  size="mini"
                  options={LabelDeploySwitchData}
                  value={modalData.canDeploy}
                  onChange={(e) => {
                    setModalData({
                      ...modalData,
                      canDeploy: e.target.value
                    });
                  }}
                />
            }
          </Form.Item>
          <Form.Item label="标签可见权限" required>
            {
              modalType === 'view' ?
                <span>
                  {
                    data.visiblePermissions === 'part' ?
                      <Tooltip
                        className="label-tooltip"
                        trigger="hover"
                        title={data.visiblePersons ? visiblePermissions.names.join('、') : ''}>
                        {data.visiblePersons ? visiblePermissions.names.join('、') : '--'}
                      </Tooltip>
                      : '全部用户'
                  }
                </span>
                :
                <>
                  <Radio.Group
                    size="mini"
                    // optionType="button"
                    options={switchData}
                    value={visiblePermissions.type}
                    onChange={(e) => {
                      setVisiblePermissions({
                        ...visiblePermissions,
                        type: e.target.value
                      });
                    }}
                  />
                  {
                    visiblePermissions.type === 'part' &&
                    <TreeSelect
                      allowClear
                      placeholder="请选择"
                      showSearch
                      multiple
                      treeCheckable
                      fieldNames={{
                        key: "id",
                        title: "name",
                      }}
                      maxTagCount={4}
                      filterTreeNode={filterTreeNode}
                      value={visiblePermissions.persons}
                      treeData={receiverList}
                      treeCheckedStrategy="child"
                      dropMenuClassName="user-list-drop"
                      onChange={(value) => {
                        // console.log(value);
                        setVisiblePermissions({
                          ...visiblePermissions,
                          persons: value
                        });
                      }}
                      treeProps={{
                        isVirtual: true,
                        virtualListProps: { height: 250 }
                      }}
                      // @ts-ignore
                      getTriggerContainer={(triggerNode) =>
                        triggerNode.parentNode as HTMLElement
                      }
                    />
                  }
                </>
            }
          </Form.Item>
          <Form.Item
            label={
              <Tooltip
                className="label-tooltip"
                trigger="hover"
                title="管理权限包含：标签编辑、删除；标签目标添加、删除；">标签管理权限<Icon type="bangzhu" /></Tooltip>
            }
            required
          >
            {
              modalType === 'view' ?
                <span>
                  {
                    data.managePermissions === 'part' ?
                      <Tooltip
                        className="label-tooltip"
                        trigger="hover"
                        title={data.managePersons ? managePermissions.names.join('、') : ''}>
                        {data.managePersons ? managePermissions.names.join('、') : '--'}
                      </Tooltip>
                      :
                      '全部用户'
                  }
                </span>
                :
                <>
                  <Radio.Group
                    size="mini"
                    // optionType="button"
                    options={switchData}
                    value={managePermissions.type}
                    onChange={(e) => {
                      setManagePermissions({
                        ...managePermissions,
                        type: e.target.value
                      });
                    }}
                  />
                  {
                    managePermissions.type === 'part' &&
                    <TreeSelect
                      allowClear
                      placeholder="请选择"
                      showSearch
                      multiple
                      treeCheckable
                      fieldNames={{
                        key: "id",
                        title: "name",
                      }}
                      maxTagCount={4}
                      filterTreeNode={filterTreeNode}
                      value={[...(checkedNodes.map(item => item.id)), ...managePermissions.persons]}
                      treeData={receiverList}
                      treeCheckedStrategy="child"
                      onChange={(value, extra) => {
                        console.log(value, extra);
                        setManagePermissions({
                          ...managePermissions,
                          persons: value
                        });
                      }}
                      treeProps={{
                        isVirtual: true,
                        virtualListProps: { height: 250 }
                      }}
                      // @ts-ignore
                      getTriggerContainer={(triggerNode) =>
                        triggerNode.parentNode as HTMLElement
                      }
                    />
                  }
                </>
            }
          </Form.Item>
        </Form>
      </div>
    </Modal >
  )
}

export default LabelModal