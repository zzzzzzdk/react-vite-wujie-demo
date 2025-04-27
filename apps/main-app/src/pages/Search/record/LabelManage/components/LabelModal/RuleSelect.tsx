import React, { useState } from "react";
import { Form, Select, Input, Radio } from '@yisa/webui'
import { SelectCommonProps } from "@yisa/webui/es/Select/interface";
import { Icon, PlusOutlined, MinusOutlined } from '@yisa/webui/es/Icon'
import { RuleSelectProps } from "./interface";
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { isUndefined, isArray } from "@/utils/is";
import classNames from 'classnames'

const { InputNumber } = Input;

export function formatValue(value: any) {
  const val = value !== null && !isUndefined(value) && isArray(value) ? value : []
  return val
}

export type RuleSelectType = {
  value: string;
  label: string;
  valueType?: 'radio' | 'number' | 'select' | 'input';
  valueData?: { value: number | string, label: string }[];
}



const RuleSelect = (props: RuleSelectProps) => {
  const {
    selectData,
    onChange,
    rule = []
  } = props

  const select0 = [
    { value: 'and', label: '且' },
    { value: 'or', label: '或' },
  ]

  const select1: RuleSelectType[] = [
    { value: 'sex', label: '基本信息-性别', valueType: 'radio', valueData: [{ value: 1, label: '男' }, { value: 2, label: '女' }, { value: 0, label: '未知' }] },
    { value: 'age', label: '基本信息-年龄', valueType: 'number' },
    { value: 'native', label: '基本信息-籍贯地址', valueType: 'input' },
    { value: 'domicile', label: '基本信息-户籍地址', valueType: 'input' },
    { value: 'current', label: '基本信息-现住地址', valueType: 'input' },
    { value: 'caseTime', label: '案件/警情-案发时间', valueType: 'number' },
    { value: 'caseType', label: '案件/警情-案件类型', valueType: 'input' },
    { value: 'address', label: '地址信息-地址', valueType: 'input' },
    { value: 'filingStatus', label: '归案状态', valueType: 'radio', valueData: [{ value: 1, label: '已归案' }, { value: 2, label: '未归案' }, { value: 0, label: '未知' }] },
    {
      value: 'labelName', label: '标签名称', valueType: 'select',
      valueData: selectData?.labelName || []
    },
  ]

  const select2 = [
    { value: '=', label: '=' },
    { value: '≠', label: '≠' },
    { value: 'contain', label: '包含' },
    { value: 'excluding', label: '不包含' },
    { value: '>', label: '>' },
    { value: '≥', label: '≥' },
    { value: '<', label: '<' },
    { value: '≤', label: '≤' },
  ]

  const select3 = [
    { value: 'year', label: '年份、月份、日期、至今时间差（年）' },
    { value: 'month', label: '至今时间差（月）' },
    { value: 'day', label: '至今时间差（日）' },
  ]

  const [ruleData, setRuleData] = useMergedState<string[][]>([['sex', '=', '']], {
    value: 'rule' in props ? formatValue(props.rule) : undefined
  })
  // console.log('ruledata', ruleData)
  const handleFormSelectChange = (
    value: any,
    index: number,
    parentIndex: number
  ) => {
    let newRuleData = [...ruleData]
    if (parentIndex === 0 && index === 0) {
      newRuleData[parentIndex] = value === 'caseTime' ? [value, 'year', '=', ''] : [value, '=', '']
    } else if (parentIndex > 0 && index === 1) {
      newRuleData[parentIndex] = value === 'caseTime' ? ['and', value, 'year', '=', ''] : ['and', value, '=', '']
    } else if (parentIndex > 0 && index === 0) {
      // 且和或保持一致
      newRuleData = newRuleData.map((item, i) => {
        if (i > 0) {
          return [value, ...item.slice(1)]
        }
        return item
      })
    } else {
      newRuleData[parentIndex][index] = value
    }

    handleChange(newRuleData)
  }

  const handleFormInputChange = (
    value: any,
    index: number,
    parentIndex: number
  ) => {
    const newRuleData = [...ruleData]
    newRuleData[parentIndex][index] = value
    handleChange(newRuleData)
  }

  const handleAddSelect = () => {
    const newRuleData = [...ruleData, ['and', 'sex', '=', '']]
    handleChange(newRuleData)
  }

  const handleDelSelect = (index: number) => {
    const newRuleData = [...ruleData]
    newRuleData.splice(index, 1)

    // 第一个不需要且和或
    newRuleData[0] = newRuleData[0].length > 3 ? newRuleData[0].filter(v => v !== 'or' && v !== 'and') : newRuleData[0]
    handleChange(newRuleData)
  }

  const handleChange = (newRuleData: string[][]) => {
    if (!('rule' in props)) {
      setRuleData(newRuleData)
    }
    onChange?.(newRuleData)
  }

  return (
    <div className="rule-select">
      <div className="rule-select-label"><span>*</span> 规则配置：</div>
      {
        ruleData.map((item, index) => {
          const isFirst = index === 0
          const firstItem = (isFirst ? item[0] : item[1])
          const currentSelect = firstItem ? select1.find(elem => elem.value === firstItem) : {} as RuleSelectType
          const isTime = firstItem === 'caseTime'

          // 末尾index
          let lastIndex = 2, beforeLastIndex = 1
          if (!isFirst) {
            lastIndex++;
            beforeLastIndex++;
          }
          if (isTime) {
            lastIndex++;
            beforeLastIndex++;
          }
          return (
            <div className={classNames("rule-select-item", {
              "is-time": isTime
            })} key={index}>
              {
                !isFirst &&
                <Select
                  className="select-0"
                  options={select0}
                  value={item[0] || 'and'}
                  onChange={(value) => handleFormSelectChange(value, 0, index)}
                  // @ts-ignore
                  getTriggerContainer={(triggerNode) =>
                    triggerNode.parentNode as HTMLElement
                  }
                />
              }
              {/* diyi */}
              <Select
                options={select1}
                onChange={(value) => handleFormSelectChange(value, !isFirst ? 1 : 0, index)}
                value={item[!isFirst ? 1 : 0] || 'sex'}
                // @ts-ignore
                getTriggerContainer={(triggerNode) =>
                  triggerNode.parentNode as HTMLElement
                }
              />
              {
                isTime &&
                <Select
                  options={select3}
                  onChange={(value) => handleFormSelectChange(value, !isFirst ? 2 : 1, index)}
                  value={item[!isFirst ? 2 : 1] || 'year'}
                  // @ts-ignore
                  getTriggerContainer={(triggerNode) =>
                    triggerNode.parentNode as HTMLElement
                  }
                />
              }
              <Select
                options={select2}
                onChange={(value) => handleFormSelectChange(value, beforeLastIndex, index)}
                value={item[beforeLastIndex] || '='}
                // @ts-ignore
                getTriggerContainer={(triggerNode) =>
                  triggerNode.parentNode as HTMLElement
                }
              />
              {
                currentSelect?.valueType ?
                  currentSelect.valueType === 'radio' ?
                    <Radio.Group
                      size="mini"
                      // optionType="button"
                      options={currentSelect.valueData}
                      value={item[lastIndex]}
                      onChange={(e) => {
                        handleFormInputChange(e.target.value, lastIndex, index)
                      }}
                    />
                    :
                    currentSelect.valueType === 'select' ?
                      <Select
                        options={currentSelect.valueData}
                        onChange={(value) => handleFormSelectChange(value, lastIndex, index)}
                        value={item[lastIndex]}
                        // @ts-ignore
                        getTriggerContainer={(triggerNode) =>
                          triggerNode.parentNode as HTMLElement
                        }
                      />
                      :
                      currentSelect.valueType === 'number' ?
                        <InputNumber
                          min={0}
                          value={(item[lastIndex]) || 0}
                          onChange={(val) => handleFormInputChange((val || 0), lastIndex, index)}
                        />
                        :
                        <Input
                          value={item[lastIndex]}
                          placeholder="请输入"
                          onChange={(e) => {
                            handleFormInputChange(e.target.value, lastIndex, index)
                          }}
                        />
                  :
                  <Input
                    value={item[lastIndex]}
                    placeholder="请输入"
                    onChange={(e) => {
                      handleFormInputChange(e.target.value, lastIndex, index)
                    }}
                  />
              }
              {
                ruleData.length > 1 ?
                  <>
                    <span className="add-icon" onClick={handleAddSelect}><PlusOutlined /></span>
                    <span className="del-icon" onClick={() => handleDelSelect(index)}><MinusOutlined /></span>
                  </>
                  :
                  <span className="add-icon" onClick={handleAddSelect}><PlusOutlined /></span>
              }
            </div>
          )
        })
      }
    </div>
  )
}

export default RuleSelect