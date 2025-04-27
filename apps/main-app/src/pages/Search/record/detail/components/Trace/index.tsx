
import React, { useEffect, useState } from "react";
import { DatesParamsType } from "@/components/TimeRangePicker/interface";
import { Form, Space, Button, Timeline, Checkbox, Message } from '@yisa/webui'
import { CheckboxValueType } from '@yisa/webui/es/Checkbox/Group'
import { Icon } from '@yisa/webui/es/Icon'
import { TimeRangePicker } from "@/components";
import TraceMap from './TraceMap'
import services, { ApiResponse } from "@/services";
import { TraceData, Props, TraceFormData, TimeData, TraceType } from '../../interface'
import { useSelector, RootState } from '@/store';
import dayjs from 'dayjs'
import './index.scss'
const CheckboxGroup = Checkbox.Group;

const Trace = (props: Props) => {
  const { data } = props

  const prefixCls = 'record-detail-trace'

  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig['record-detail-person'] || {}
  });

  // 轨迹类型-图标展示
  const iconText = {
    [TraceType.capture]: 'zhuapaituxiang',
    [TraceType.case]: 'jingqinganqing',
    [TraceType.travel]: 'chuhangxinxi1',
    [TraceType.hotel]: 'binguanzhusu1',
    [TraceType.inter]: 'wangbashangwang',
  }
  // 轨迹数据类型
  const traceOptions = [
    { label: '抓拍图像', value: TraceType.capture },
    { label: '案件/警情', value: TraceType.case },
    { label: '出行信息', value: TraceType.travel },
    { label: '宾馆住宿', value: TraceType.hotel },
    { label: '网吧上网记录', value: TraceType.inter },
  ]

  // 时间
  const [timeData, setTimeData] = useState<TimeData>({
    timeType: 'time',
    beginDate: dayjs().subtract(Number(pageConfig.timeRange?.default || 6) - 1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    beginTime: '',
    endTime: '',
  })

  // 轨迹数据类型
  const [trackType, setTrackType] = useState<CheckboxValueType[]>(
    [TraceType.capture, TraceType.case, TraceType.travel, TraceType.hotel, TraceType.inter]
  )
  // 改变时间范围
  const handleDateChange = (dates: DatesParamsType) => {
    setTimeData({
      timeType: dates.timeType,
      beginDate: dates.beginDate,
      endDate: dates.endDate,
      beginTime: dates.beginTime,
      endTime: dates.endTime,
    })
  }
  // 改变轨迹数据类型
  const handleChangeCheckbox = (data: CheckboxValueType[]) => {
    setTrackType(data)
    // handleSearchBtnClick(data)
  }

  // 当前展示数据下标
  const [activeTimeIndex, setActiveTimeIndex] = useState<number>(0)
  const [ajaxLoading, setAjaxLoading] = useState<boolean>(false)

  // 轨迹结果数据
  const [traceData, setTraceData] = useState<ApiResponse<TraceData[]>>({
    data: [],
    totalRecords: 0,
    usedTime: 0
  })

  useEffect(() => {
    handleSearchBtnClick()
  }, [])

  // 检索结果
  const handleSearchBtnClick = (type: CheckboxValueType[] = trackType) => {
    let dateRangeMax = Number(pageConfig.timeRange?.max || 0)
    if (dateRangeMax) {
      let timeDiff = dayjs(timeData.endDate).diff(dayjs(timeData.beginDate), 'days') + 1
      if (timeDiff > dateRangeMax) {
        Message.warning(`请选择时间范围在${dateRangeMax}日内！`)
        return
      }
    }
    if (!type.length) {
      Message.warning("请勾选轨迹数据类型")
      return
    }
    setAjaxLoading(true)
    // 恢复初始状态
    setActiveTimeIndex(0)
    services.record.getTrackData<TraceFormData, TraceData[]>({
      ...data,
      trackType: type.join(','),
      beginDate: timeData.beginDate,
      endDate: timeData.endDate,
    })
      .then(res => {
        setAjaxLoading(false)
        if (res.data) {
          setTraceData(res)
          // 默认展示最新一条数据
          let data = res.data || []
          if (data.length) {
            setTimeout(() => {
              setActiveTimeIndex(data.length)
            }, 500)
          }
        } else {
          setTraceData({
            data: [],
            totalRecords: 0,
            usedTime: 0
          })
        }
      })
      .catch(err => {
        setAjaxLoading(false)
      })
  }
  return <div className={`${prefixCls}`}>
    <div className={`${prefixCls}-header`}>
      <Form layout="vertical">
        <Form.Item
          label="轨迹数据类型"
          className="trace-type"
          colon={false}
        >
          <CheckboxGroup
            options={traceOptions}
            value={trackType}
            onChange={handleChangeCheckbox}
          />
        </Form.Item>
        <TimeRangePicker
          formItemProps={{ label: "时间范围" }}
          beginDate={timeData.beginDate}
          endDate={timeData.endDate}
          beginTime={timeData.beginTime}
          endTime={timeData.endTime}
          onChange={handleDateChange}
          showTimeType={false}
        />
        <Form.Item colon={false} label={' '} style={{ marginLeft: 'auto' }}>
          <Space size={16}>
            <Button
              loading={ajaxLoading}
              onClick={() => handleSearchBtnClick()}
              type='primary'
            >
              查询
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
    <div className={`${prefixCls}-content`}>
      <div className="total-num">
        共<span>{ajaxLoading ? '···' : traceData.totalRecords}</span>条信息，用时<span>{ajaxLoading ? '···' : traceData.usedTime}</span>秒
      </div>
      <div className="total-data">
        <div className="time-line">
          {
            traceData.data && traceData.data.length ?
              <Timeline className={`${prefixCls}-timeline`} reverse={true}>
                {
                  traceData.data.map((ele: TraceData, index: number) => {
                    return <Timeline.Item
                      dotType="solid"
                      lineType="dashed"
                      lineColor="var(--tabs-line-border)"
                      dot={<div className={`dot ${activeTimeIndex == (index + 1) ? 'active-dot' : ''}`}>{index + 1}</div>}
                    >
                      <div className={`time-content ${activeTimeIndex == (index + 1) ? 'active-time' : ''}`} onClick={() => setActiveTimeIndex(index + 1)}>
                        <div className="time">{ele.captureTime}</div>
                        <div className="content">
                          <div className="title">
                            <Icon type={iconText[ele.trackType]} /> {ele.title}
                          </div>
                          {
                            ele.trackType == TraceType.travel ?
                              <div className="info">
                                <div className="label">航班座位：</div>
                                <div className="text">{ele.seat}</div>
                              </div>
                              : null
                          }
                          <div className="info">
                            <div className="label">地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点：</div>
                            <div className="text">{ele.locationName}</div>
                          </div>
                        </div>
                      </div>
                    </Timeline.Item>
                  })
                }
              </Timeline>
              : <div className="no-data">  </div>
          }
        </div>
        <div className="time-map">
          <TraceMap
            trackData={traceData.data}
            selectedIndex={activeTimeIndex}
            onSelectedChange={(index: number) => { setActiveTimeIndex(index) }}
          />
        </div>
      </div>
    </div>
  </div>
}

export default Trace