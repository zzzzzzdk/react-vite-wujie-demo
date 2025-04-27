import { useEffect, useRef, useState } from 'react'
import { RelateValueType } from './index'
import { Radio, Checkbox, Button, Select, Pagination, Table, Image, Tag } from '@yisa/webui'
import { CheckboxValueType } from '@yisa/webui/es/Checkbox/Group'
import { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox'
enum RelateType {
  person = 1,
  vehicle,
  area,
  thing
}
const defaultRelateValue: RelateValueType = {
  checked: true,
  indeterminate: false,
  value: [1, 2, 3, 4, 5, 6, 7]
}
// 关系类型中的静态关系、动态关系字段
const correspondRelateObj: any = {
  // 人人关系
  [RelateType.person]: {
    // 人人关系-静态关系
    staticRelate: {
      title: '静态关系',
      type: 'static',
      checkedValue: 'staticTypeValue',
      children: [
        { value: 1, label: '同户籍', name: '同户籍' },
        { value: 2, label: '同手机使用人', name: '同手机' },
        { value: 3, label: '同车违章', name: '同违章' },
        { value: 4, label: '同车使用', name: '同车' },
        { value: 5, label: '同案', name: '同案' },
        { value: 6, label: '同出行', name: '同出行' },
        { value: 7, label: '同住', name: '同住' },
      ]
    },
    // 人人关系-动态关系
    activeRelate: {
      title: '动态关系',
      type: 'active',
      checkedValue: 'activeTypeValue',
      children: [
        { value: 1, label: '同商场区域活跃', name: '同商场区域活跃' },
        { value: 2, label: '同学校区域活跃', name: '同学校区域活跃' },
        { value: 3, label: '同小区活跃', name: '同小区活跃' },
        { value: 4, label: '近三月同行', name: '近三月同行' },
        { value: 5, label: '近一年同行', name: '近一年同行' },
        { value: 6, label: '同主驾', name: '同主驾' },
        { value: 7, label: '主副驾', name: '主副驾' },
      ]
    }
  },
  [RelateType.vehicle]: {
    staticRelate: {
      title: '静态关系',
      type: 'static',
      checkedValue: 'staticTypeValue',
      children: [
        { value: 1, label: '名下车辆', name: '名下车辆' },
        { value: 2, label: '处理交通违法', name: '处理交通违法' },
      ]
    },
    activeRelate: {
      title: '动态关系',
      type: 'active',
      checkedValue: 'activeTypeValue',
      children: [
        { value: 1, label: '行驶车辆', name: '行驶车辆' },
        { value: 2, label: '乘坐车辆', name: '乘坐车辆' },
      ]
    }
  },
  [RelateType.area]: {
    label: {
      title: '人地关联标签',
      type: 'label',
      checkedValue: 'labelValue',
      children: []
    }
  },
  [RelateType.thing]: {
    staticRelate: {
      title: '静态关系',
      type: 'static',
      checkedValue: 'staticTypeValue',
      children: [
        { value: 1, label: '涉案关系', name: '涉案关系' },
      ]
    }
  }
}

const Header = (props: any) => {
  const {
    relateTypeValue,
    handleSearchBtnClick
  } = props

  //静态类型 
  const [staticTypeValue, setStaticTypeValue] = useState<RelateValueType>(defaultRelateValue)
  // 动态类型
  const [activeTypeValue, setActiveTypeValue] = useState<RelateValueType>(defaultRelateValue)
  // 人地标签value
  const [labelValue, setLabelValue] = useState<RelateValueType>(defaultRelateValue)

  // 人地标签
  const [areaLabel, setAreaLable] = useState([])

  useEffect(() => {
    // 获取人地标签
    // 获取数据
    handleSearch()
  }, [])

  const allCheckedValue = {
    'staticTypeValue': staticTypeValue,
    'activeTypeValue': activeTypeValue,
    'labelValue': labelValue
  }

  const correspondRelate = correspondRelateObj[relateTypeValue]

  // 修改全选
  const handleCheckAllChange = (e: CheckboxChangeEvent, type: string) => {
    if (type == 'static') {
      let ids = correspondRelate.staticRelate.children.map((ele: any) => ele.value)
      setStaticTypeValue({
        checked: e.target.checked,
        indeterminate: false,
        value: e.target.checked ? ids : []
      })
    } else if (type == 'active') {
      let ids = correspondRelate.activeRelate.children.map((ele: any) => ele.value)
      setActiveTypeValue({
        checked: e.target.checked,
        indeterminate: false,
        value: e.target.checked ? ids : []
      })
    } else if (type == 'label') {
      setLabelValue({
        checked: e.target.checked,
        indeterminate: false,
        value: e.target.checked ? correspondRelate.staticRelate : []
      })
    }
  }
  // 修改多选框
  const handleCheckedChange = (value: CheckboxValueType[], type: string) => {
    if (type == 'static') {
      setStaticTypeValue({
        checked: value.length == correspondRelate.staticRelate.children.length,
        indeterminate: !!value.length && value.length < correspondRelate.staticRelate.children.length,
        value: value
      })
    } else if (type == 'active') {
      setActiveTypeValue({
        checked: value.length == correspondRelate.activeRelate.children.length,
        indeterminate: !!value.length && value.length < correspondRelate.activeRelate.children.length,
        value: value
      })
    } else if (type == 'label') {
      setLabelValue({
        checked: value.length == correspondRelate.staticRelate.children.length,
        indeterminate: !!value.length && value.length < correspondRelate.staticRelate.children.length,
        value: value
      })
    }
  }

  const handleSearch = () => {
    handleSearchBtnClick && handleSearchBtnClick({
      static: relateTypeValue == RelateType.area ? [] : staticTypeValue.value,
      active: relateTypeValue == RelateType.area ? [] : activeTypeValue.value,
      label: relateTypeValue == RelateType.area ? labelValue.value : [],
    })
  }

  return <div className="static-active-relate">
    {
      Object.keys(correspondRelate).map(ele => {
        let options = correspondRelate[ele]
        if (options) {
          let { title, type, checkedValue } = options
          return <div className={`relate ${type}-relate`}>
            <div className="title">{title}</div>
            <div className={`value ${type}-value`}>
              <Checkbox
                indeterminate={allCheckedValue[checkedValue].indeterminate}
                onChange={(e) => handleCheckAllChange(e, type)}
                checked={allCheckedValue[checkedValue].checked}>
                全部
              </Checkbox>
              <Checkbox.Group
                options={correspondRelate[ele].children}
                value={allCheckedValue[checkedValue].value}
                onChange={(e) => handleCheckedChange(e, type)}
              />
            </div>
          </div>
        }
        return ''
      })
    }
    <div className="search-btn">
      <Button type="primary" onClick={handleSearch}>查询</Button>
    </div>
  </div>
}
export default Header