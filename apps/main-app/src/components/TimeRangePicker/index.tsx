import React, { useState } from "react";
import { Space, Tabs, Form, Input, TreeSelect, DatePicker, Divider, Popover, TimePicker, Select } from '@yisa/webui'
import { RangeValue } from '@yisa/webui/es/DatePicker/picker/interface'
import { DatePickerProps, RangePickerProps } from '@yisa/webui/es/DatePicker'
import { Icon, LeftOutlined, DownOutlined } from '@yisa/webui/es/Icon'
import { SelectCommonProps } from '@yisa/webui/es/Select/interface'
import type { Dayjs } from 'dayjs'
import TimeRangePickerProps, { DatesParamsType, TimeSpan } from "./interface";
import { isFunction, isUndefined, isString } from '@/utils/is';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import './index.scss'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { useControllableValue } from "ahooks";
const { Option } = Select
const { RangePicker } = DatePicker
const { RangePicker: TimePickerRange } = TimePicker
dayjs.extend(customParseFormat)
// @ts-ignore
window.dayjs = dayjs
export function formatValue(value: any) {
  const val = value !== null && value !== '' && !isUndefined(value) && isString(value) ? value : undefined
  return val
}

const TimeRangePicker = (props: TimeRangePickerProps) => {
  const {
    className,
    showTimeType = true,
    beginDate,
    endDate,
    beginTime,
    endTime,
    formItemProps = { label: "时间范围", },
    onChange,
    timeLayout = 'horizontal',
    timeCustomLabel = "",
    timeSelectTypeStyle,
    disabled = false,
    multiRange = false,
    disabledDate,
    showYesterday = true,
    showMonth = true,
    showinnerTimeType = true,
    futureFirst = false,
    showTime = true,
    themeType = "default",
    allowClear = false,
    getPopupContainer,
    popupStyle
  } = props
  const prefixCls = 'time-range-picker'
  const [timeType, setTimeType] = useState<SelectCommonProps['value']>('time')
  const innerTimeType = props.timeType ?? timeType
  const [stateValue, setStateValue] = useState<{ [key: string]: Dayjs | null | string }>({
    beginDate: dayjs().subtract(6, 'days').startOf('day'),
    endDate: dayjs(),
    beginTime: null,
    endTime: null,
  })
  const innerValue = {
    beginDate: 'beginDate' in props ? beginDate ? dayjs(formatValue(beginDate)) : null : stateValue.beginDate,
    endDate: 'endDate' in props ? endDate ? dayjs(formatValue(endDate)) : null : stateValue.endDate,
    beginTime: 'beginTime' in props ? beginTime ? dayjs(formatValue(beginTime), 'HH:mm:ss') : null : stateValue.beginTime,
    endTime: 'endTime' in props ? endTime ? dayjs(formatValue(endTime), 'HH:mm:ss') : null : stateValue.endTime,
  }
  // 多个时间段 受控/不受控
  const [spans, setSpans] = useControllableValue<NonNullable<TimeRangePickerProps['spans']>>(props, {
    valuePropName: 'spans',
    trigger: 'onSpansChange',
    defaultValue: [[null, null]]
  })
  const periods = [
    { value: 0, title: '今日' },
    { value: 1, title: '昨日' },
    { value: 2, title: '三日' },
    { value: 6, title: '一周' },
    { value: 29, title: '一月' },
  ]


  const handleTypeChange = (value: SelectCommonProps['value']) => {
    setTimeType(value)
    if (onChange && isFunction(onChange)) {

      value === 'time' ?
        onChange({
          timeType: value,
          beginDate: innerValue.beginDate ? dayjs(innerValue.beginDate).format('YYYY-MM-DD HH:mm:ss') : '',
          endDate: innerValue.endDate ? dayjs(innerValue.endDate).set('hour', 23).set('minute', 59).set('second', 59).format('YYYY-MM-DD HH:mm:ss') : ''
        })
        :
        onChange({
          timeType: (value as string),
          beginDate: innerValue.beginDate ? dayjs(innerValue.beginDate).format('YYYY-MM-DD') : '',
          endDate: innerValue.endDate ? dayjs(innerValue.endDate).format('YYYY-MM-DD') : '',
          beginTime: innerValue.beginTime ? dayjs(innerValue.beginTime).format('HH:mm:ss') : '',
          endTime: innerValue.endTime ? dayjs(innerValue.endTime).format('HH:mm:ss') : '',
        })
    }
  }

  const handleChangeDate = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    console.log(dates)
    //TODO: 清空日期
    // if(allowClear && !dates){
    //   // onchange
    // }
    // if (!dates) return;

    const [begin = "", end = ""] = dates || []
    if (!('beginDate' in props) && !('endDate' in props)) {
      setStateValue({
        ...innerValue,
        beginDate: begin,
        endDate: end
      })
    }

    if (onChange && isFunction(onChange)) {
      console.log(innerTimeType);
      innerTimeType === 'time' ?
        onChange({
          timeType: innerTimeType,
          beginDate: begin ? dayjs(begin).format('YYYY-MM-DD HH:mm:ss') : "",
          endDate: end ? dayjs(end).format('YYYY-MM-DD HH:mm:ss') : "",
        })
        :
        onChange({
          timeType: (innerTimeType as string),
          beginDate: begin ? dayjs(begin).format('YYYY-MM-DD') : "",
          endDate: end ? dayjs(end).format('YYYY-MM-DD') : "",
          beginTime: innerValue.beginTime ? dayjs(innerValue.beginTime).format('HH:mm:ss') : '',
          endTime: innerValue.endTime ? dayjs(innerValue.endTime).format('HH:mm:ss') : '',
          // beginTime: dayjs(innerValue.beginTime).format('HH:mm:ss'):'',
          // endTime: dayjs(innerValue.endTime).format('HH:mm:ss'):,
        })
    }
  }

  const handleChangeTime = (times: null | (Dayjs | null)[], timeString: string[]) => {
    // console.log(times)
    // if (!times) return;

    const [begin, end] = times || []
    if (!('beginTime' in props) && !('endTime' in props)) {
      setStateValue({
        ...innerValue,
        beginTime: begin,
        endTime: end
      })
    }

    if (onChange && isFunction(onChange)) {
      onChange({
        timeType: (innerTimeType as string),
        beginDate: innerValue.beginDate ? dayjs(innerValue.beginDate).format('YYYY-MM-DD') : '',
        endDate: innerValue.endDate ? dayjs(innerValue.endDate).format('YYYY-MM-DD') : '',
        beginTime: begin ? dayjs(begin).format('HH:mm:ss') : '',
        endTime: end ? dayjs(end).format('HH:mm:ss') : '',
      })
    }
  }

  const handleChangePeriod = (period: number) => {
    let newPeriodDate = {
      beginDate: dayjs(),
      endDate: dayjs()
    }
    if (period === 1) { // 昨日单独处理
      newPeriodDate = {
        ...innerValue,
        beginDate: dayjs().subtract(period, 'days').startOf('day'),
        endDate: dayjs().subtract(period, 'days').endOf('day')
      }
    } else {
      newPeriodDate =
        // 是否使用未来时间, 3日 一周 一月
        futureFirst
          ?
          {
            ...innerValue,
            beginDate: dayjs(),
            endDate: dayjs().add(period, 'days').endOf('day'),
          }
          :
          {
            ...innerValue,
            beginDate: dayjs().subtract(period, 'days').startOf('day'),
            endDate: dayjs()
          }
    }

    if (!('beginDate' in props) && !('endDate' in props)) {
      setStateValue(newPeriodDate)
    }

    if (onChange && isFunction(onChange)) {
      onChange({
        timeType: (innerTimeType as string),
        beginDate: dayjs(newPeriodDate.beginDate).format('YYYY-MM-DD HH:mm:ss'),
        endDate: dayjs(newPeriodDate.endDate).format('YYYY-MM-DD HH:mm:ss'),
      })
    }
  }

  return (
    <Form.Item className={classNames(prefixCls, className, {
      "has-time-type": showTimeType
    })} {...formItemProps} colon={false}>
      <>
        {
          showTimeType && <Select
            className={classNames(
              "time-type-select",
              {
                "no-right-radius": showTimeType && (timeLayout === 'horizontal' || (timeLayout === 'vertical' && innerTimeType === 'time')),
                "has-right-gap": timeLayout === 'vertical' && innerTimeType === 'range'
              },
              { "ysd-select-technology": themeType === "technology" }
            )}
            dropdownClassName={classNames({ "ysd-select-technology-menu": themeType === "technology" })}
            style={{ width: '76px', minWidth: '76px', ...timeSelectTypeStyle }}
            placeholder=""
            value={innerTimeType}
            onChange={handleTypeChange}
            disabled={disabled}
            // @ts-ignore
            getTriggerContainer={triggerNode => triggerNode.parentNode as HTMLElement}
          >
            <Option value="time">时间</Option>
            <Option value="range">时段</Option>
          </Select>
        }
        {
          timeCustomLabel && <div className="time-custom-label">{timeCustomLabel}</div>
        }
        {
          innerTimeType === 'range' ?
            <Space size={8} direction={timeLayout}>
              <RangePicker
                key='range-picker'
                allowClear={allowClear}
                value={beginDate === "" && endDate === "" ? undefined : [dayjs(innerValue.beginDate), dayjs(innerValue.endDate)]}
                onChange={handleChangeDate}
                disabled={disabled}
                disabledDate={disabledDate}
                className={classNames({ "no-left-radius": showTimeType && (timeLayout === 'horizontal') }, { "ysd-ranger-picker-technology": themeType === "technology" })}
                getPopupContainer={getPopupContainer}
                popupStyle={popupStyle}
              />
              {
                multiRange
                  ?
                  <>
                    {
                      spans.map((span, idx) => {
                        const safeSpan = span.map(t => {
                          const d = dayjs(t, 'HH:mm:ss')
                          return d.isValid() ? d : null
                        })
                        return (
                          <div key={idx} className="time-span">
                            <TimePickerRange
                              className={classNames({ "ysd-ranger-picker-technology": themeType === "technology" })}
                              allowClear={allowClear}
                              disabled={disabled}
                              value={safeSpan as any}
                              format={"HH:mm:ss"}
                              disabledDate={disabledDate}
                              onChange={(value, formatString) => {
                                const newSpans = spans.map((span, i) => {
                                  if (idx === i) {
                                    return formatString;
                                  }
                                  return span;
                                })
                                setSpans(newSpans)
                              }}
                              getPopupContainer={getPopupContainer}
                              popupStyle={popupStyle}
                            />
                            {
                              spans.length < 3 && idx === spans.length - 1
                              &&
                              <span className="add"
                                onClick={() => {
                                  const newSpans = [
                                    ...spans, ['00:00:00', '23:59:59'] as TimeSpan
                                  ]
                                  setSpans(newSpans)
                                }}
                              >
                                <Icon classNamedel type="xinzeng1" />
                              </span>
                            }
                            {
                              spans.length > 1
                              &&
                              <span className="del"
                                onClick={() => {
                                  const newSpans = spans.filter((_, i) => i !== idx)
                                  setSpans(newSpans)
                                }}>
                                <Icon className='add' type="shanchu2" />
                              </span>
                            }
                          </div>
                        )
                      }
                      )
                    }
                  </>
                  :
                  <TimePickerRange
                    className={classNames("time-add-gap", { "ysd-ranger-picker-technology": themeType === "technology" })}
                    allowClear={allowClear}
                    value={innerValue.beginTime && innerValue.endTime ? [dayjs(innerValue.beginTime), dayjs(innerValue.endTime)] : null}
                    onChange={handleChangeTime}
                    disabled={disabled}
                    disabledDate={disabledDate}
                    getPopupContainer={getPopupContainer}
                    popupStyle={popupStyle}
                  />
              }
            </Space>
            :
            <>
              <RangePicker
                className={classNames("type-time", { "no-left-radius": showTimeType && (timeLayout === 'horizontal' || (timeLayout === 'vertical' && innerTimeType === 'time')) }, { "ysd-ranger-picker-technology": themeType === "technology" })}
                allowClear={allowClear}
                showTime={showTime}
                // format="YYYY-MM-DD HH:mm:ss"
                // value={[dayjs(innerValue.beginDate), dayjs(innerValue.endDate)]}
                //fix:当传递的空字符串时，显示placeholder
                value={beginDate === "" && endDate === "" ? undefined : [dayjs(innerValue.beginDate), dayjs(innerValue.endDate)]}
                onChange={handleChangeDate}
                disabled={disabled}
                disabledDate={disabledDate}
                getPopupContainer={getPopupContainer}
                popupStyle={popupStyle}
              // getPopupContainer={() => document.querySelector('.search-group')}
              />

              {/* <Popover
                placement="bottom"
                overlayClassName="periods-dropdown"
                content={<ul>
                  {
                    periods.map((elem, index) => <li
                      key={elem.value}
                      onClick={() => handleChangePeriod(elem.value)}
                    >
                      {elem.title}
                    </li>)
                  }
                </ul>}
              >
                <span className="common-periods">常用时段 <DownOutlined /></span>
              </Popover> */}
            </>
        }
        {
          innerTimeType == 'time' && showinnerTimeType ?
            <ul className={`periods ${themeType === "technology" ? "periods-technology" : ""}`}>
              <Space size={12}>
                {
                  periods.map((elem, index) => {
                    if (!showYesterday && elem.title == '昨日') {
                      return ''
                    }
                    if (!showMonth && elem.title == '一月') {
                      return ''
                    }
                    return <li
                      className={classNames({ "periods-disabled": disabled })}
                      key={elem.value}
                      onClick={() => handleChangePeriod(elem.value)}
                    >
                      {elem.title}
                    </li>
                  })
                }
              </Space>
            </ul>
            : null
        }
      </>
    </Form.Item >
  )
}

export default TimeRangePicker
