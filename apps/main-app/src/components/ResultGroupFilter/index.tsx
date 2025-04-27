import React, { useEffect, useState } from "react";
import { ResultGroupFilterChooseProps, ResultGroupFilterShowProps } from './interface'
import { Select, Button, Space } from '@yisa/webui'
import { SelectCommonProps } from '@yisa/webui/es/Select/interface'
import character from "@/config/character.config";
import { useDispatch, useSelector, RootState } from '@/store';
import { changeSelectedGroup, changeSelectedFilter, changeFilterTags, clearAll } from '@/store/slices/groupFilter';
import './index.scss'
import { GroupFilterItem } from "@/config/CommonType";
import { isFunction } from "@/utils";
import { Icon, RightOutlined, CloseOutlined } from '@yisa/webui/es/Icon'
import classNames from 'classnames'
const { Option } = Select


const Show = (props: ResultGroupFilterShowProps) => {
  const {
    onChange
  } = props
  const dispatch = useDispatch()
  const { selectedGroup, selectedFilter, filterTags } = useSelector((state: RootState) => {
    return state.groupFilter
  })

  const handleDelOne = (item: GroupFilterItem) => {
    const { type, value } = item
    const newFilterTags = [...filterTags]
    newFilterTags.pop()
    dispatch(changeFilterTags(newFilterTags))


    if (type === 'group') {
      const newSelectedGroup = [...selectedGroup]
      newSelectedGroup.pop()
      dispatch(changeSelectedGroup(newSelectedGroup))
    }

    if (type === 'filter') {
      const newSelectedFilter = [...selectedFilter]
      newSelectedFilter.pop()
      dispatch(changeSelectedFilter(newSelectedFilter))
    }

    if (onChange && isFunction(onChange)) {
      onChange({
        filterTags: newFilterTags
      })
    }
  }

  const handleDelAll = () => {
    dispatch(clearAll())
    if (onChange && isFunction(onChange)) {
      onChange({
        filterTags: []
      })
    }
  }

  return (
    <>
      <div className={"result-group-filter-show"} >
        <div className="left-label">
          <span className='tag-header'>分组筛选条件：</span>
          <Button type='danger' className='del-all' onClick={handleDelAll}>全部清除</Button>
        </div>
        <Space size={5} split={<RightOutlined />} wrap>
          {filterTags.map((item, index) => {
            const lastChild = index == filterTags.length - 1
            return (
              <div
                className={classNames(
                  "group-filter-item-wrap",
                  {
                    "last-child": lastChild
                  }
                )}
                key={index + 1}
                onClick={lastChild ? () => handleDelOne(item) : () => { }} >
                <span className='group-filter-item'>
                  {item.text}
                </span>
                {
                  index == (filterTags.length - 1) ?
                    <span className="close"><CloseOutlined /></span> :
                    ''
                }
              </div>
            )
          })}
        </Space>
      </div>

    </>
  )
}

const Choose = (props: ResultGroupFilterChooseProps) => {
  const {
    onChange,
    disabled = false,
    targetType = "vehicle",
    defaultFilterTypeOptions = null,
    needgroupchoose = true,
    needFilterChoose = true
  } = props

  const dispatch = useDispatch()
  const { selectedGroup, selectedFilter, filterTags } = useSelector((state: RootState) => {
    return state.groupFilter
  })
  const filteredGroup = character.groupType.filter(item => !selectedGroup.includes(item.value) && item.targetType.indexOf(targetType) > -1);
  const filteredFilter = (defaultFilterTypeOptions || character.filterType).filter(item => !selectedFilter.includes(item.value) && item.targetType.indexOf(targetType) > -1);

  const handleGroupTypeChange = (value: SelectCommonProps['value'], options: any) => {
    // console.log(options)
    let obj: GroupFilterItem = {
      value: '',
      text: '',
      type: 'group'
    }
    character.groupType.forEach((item) => {
      if (item.value == value) {
        obj = {
          ...item,
          type: 'group',
        }
      }
    })
    // changeSelectedGroup(obj)

    let arr = [...selectedGroup]
    let newFilterTags = [...filterTags]
    // setGroup(v)
    // 如果是正在分组，切换分组状态
    if (newFilterTags[newFilterTags.length - 1] && newFilterTags[newFilterTags.length - 1].type === 'group') {
      arr[arr.length - 1] = value as string
      newFilterTags[newFilterTags.length - 1] = obj
    } else {
      arr.push(value as string)
      newFilterTags.push(obj)
    }
    dispatch(changeFilterTags(newFilterTags))
    dispatch(changeSelectedGroup(arr))
    if (onChange && isFunction(onChange)) {
      onChange({
        filterTags: newFilterTags
      })
    }
  }

  const handleFilterTypeChange = (value: SelectCommonProps['value']) => {
    let obj: GroupFilterItem = {
      value: '',
      text: '',
      type: 'group'
    }
    character.filterType.forEach((item) => {
      if (item.value == value && item.targetType.includes(targetType)) {
        obj = {
          ...item,
          type: 'filter',
        }
        return false
      }
    })

    dispatch(changeSelectedFilter(selectedFilter.concat([value as string])))
    let newFilterTags = filterTags.concat([obj])
    dispatch(changeFilterTags(newFilterTags))
    // search(tags)
    if (onChange && isFunction(onChange)) {
      onChange({
        filterTags: newFilterTags
      })
    }
  }

  // useEffect(() => {
  //   if (targetType) {
  //     console.log(targetType)

  //   }
  // }, [JSON.stringify(targetType)])

  return (
    <div className="result-group-filter-choose">
      {
        needgroupchoose ?
          <Select
            disabled={!filteredGroup.length || disabled}
            placeholder="请选择分组"
            value={undefined}
            onChange={handleGroupTypeChange}
            // @ts-ignore
            getTriggerContainer={triggerNode => triggerNode.parentNode as HTMLElement}
          >
            {filteredGroup.map(item => (
              <Option key={item.value} value={item.value}>
                {item.text}
              </Option>
            ))}
          </Select>
          : ''
      }
      {
        needFilterChoose && filteredFilter.length ?
        <Select
          disabled={!filteredFilter.length || disabled}
          placeholder="请选择筛选方式"
          value={undefined}
          onChange={handleFilterTypeChange}
          style={{
            display: filterTags[filterTags.length - 1] && filterTags[filterTags.length - 1].type === 'group' ? 'none' : 'inline-flex'
          }}
          // @ts-ignore
          getTriggerContainer={triggerNode => triggerNode.parentNode as HTMLElement}
        >
          {filteredFilter.map(item => (
            <Option key={item.value} value={item.value}>
              {item.text}
            </Option>
          ))}
        </Select>
        :
        ''
      }
    </div>
  )
}

const ResultGroupFilter = (props: ResultGroupFilterChooseProps) => {
  return <Choose {...props} />
}

ResultGroupFilter.Choose = Choose
ResultGroupFilter.Show = Show

export default ResultGroupFilter
