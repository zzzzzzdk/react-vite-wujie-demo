import React, { useState, useEffect, useRef, useMemo } from 'react'
import { TrackAnalysisType, VehicleLocusAnalysisLocation, VehicleLocusAnalysisLocationType, VehicleLocusAnalysisTime } from './interface'
import { Button, Pagination, Table, Image, Link } from '@yisa/webui'
import './index.scss'
import { Icon } from '@yisa/webui/es/Icon'
import ReactEcharts from 'echarts-for-react'
import { BoxDrawer, Panel, TimeRangePicker } from '@/components'
import { BaseMap, TileLayer } from '@yisa/yisa-map'
import ajax from "@/services";
import { VehicleDetailFormDataType } from '../interface'
import { LeafletEvent } from 'leaflet'
import { getMapProps } from '@/utils'
import dayjs from 'dayjs'
import { ResultBox } from '@yisa/webui_business'
import { DatesParamsType } from '@/components/TimeRangePicker/interface'
import Marker from './Marker'
import { CurContext } from "./context";
import { useSelector } from '@/store'
export default function TrackAnalysis(props: TrackAnalysisType) {
  const {
    mainFormData
  } = props
  const prefixCls = "track-analysis"
  const dateChart = useRef<any>()
  const periodChart = useRef<any>()
  //抽屉挂载节点
  const boxRef = useRef<HTMLDivElement>(null)
  //抽屉
  const [rightDrawerVisible, setRightDrawerVisible] = useState(false)
  const [locationData, setLocationData] = useState<VehicleLocusAnalysisLocation[]>([])
  const [totalRecords, setTotalRecords] = useState(0)

  const [tableHeight, setTableHeight] = useState(0)
  const tableRef = useRef<HTMLDivElement>(null)
  //查询参数
  const restPage = {
    pageSize: 40,
    pageNo: 1,
  }
  const [pageForm, setPageForm] = useState(
    {
      pageSize: 40,
      pageNo: 1,
    }
  )
  const [timeFrom, setTimeFrom] = useState({
    beginDate: dayjs().subtract(29, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    timeRange: { times: [dayjs().subtract(29, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'), dayjs().format('YYYY-MM-DD HH:mm:ss')] }
  })
  //表格点击
  const [curIndex, setCurIndex] = useState(-1)
  const CurContextValue = {
    curIndex: curIndex,
    onCurIndex: (data: number) => {
      // debugger
      setCurIndex(data)
    }
  }
  //是否正在查询
  const [ajaxLoading, setAjaxLoading] = useState(false)
  //时间参数缓存
  const timeRef = useRef({})

  const [dateSeries, setDateSeries] = useState<any[]>([])
  const [dateXAxis, setDateXAxis] = useState<any[]>([])
  const [periodSeries, setPeriodSeries] = useState<any[]>([])
  const [periodXAxis, setPeriodXAxis] = useState<any[]>([])

  //地图配置
  const { mapProps, tileLayerProps } = useMemo(() => {
    const { mapProps, tileLayerProps } = getMapProps('VehicleAnalisisMap')
    return {
      mapProps: {
        ...mapProps,
        onZoomStart: (e: LeafletEvent) => {
        },
        onZoomEnd: (e: LeafletEvent) => {
          // const afterZoom = e.target.getZoom()
          // if (afterZoom < scaleZoom) {
          //   setCityMassMarker({ showCityMarker: true, showMassMarker: false })
          // } else {
          //   setCityMassMarker({ showCityMarker: false, showMassMarker: true })
          // }
          // setMapZoom(afterZoom)
        }
      },
      tileLayerProps
    }
  }, [])
  // const dispatch = useDispatch();
  const skin = useSelector((state: any) => {
    return state.comment.skin
  });
  // 出现日期柱状图
  const optionDate = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        label: {
          backgroundColor: 'white'
        }
      },
      formatter: '{b0}<br />{c0} 次'
    },
    grid: {
      top: 10,
      left: 10,
      right: 20,
      bottom: 20,
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: [],
        axisLine: {
          lineStyle: {
            color: 'rgba(51,119,255,0.1)',
            width: 2
          },
        },
        axisLabel: {
          color: "#222226"
        },
        axisTick: {
          show: false
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        data: [],
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(51,119,255,0.1)'
          },
        },
        axisLabel: {
          color: "#222226"
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          interval: 'auto', // 坐标轴分隔线的显示间隔
          lineStyle: {
            color: ['rgba(51,119,255,0.1)'], // 分隔线颜色。
            width: 1, // 分隔线线宽
            type: 'dashed', // 线的类型
            opacity: 1 // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
          }
        }
      }
    ],
    series: [
      {
        type: 'bar',
        itemStyle: {
          barBorderRadius: [3, 3, 0, 0],
        }
      }
    ]
  }
  // 出现时段横向柱状图
  const optionPeriod = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        label: {
          backgroundColor: '#6a7985'
        }
      },
      formatter: '{b0}<br />{c0} 次'
    },
    grid: {
      top: 10,
      left: 10,
      right: 20,
      bottom: 0,
      containLabel: true
    },
    yAxis: [
      {
        type: 'category',
        data: [],
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(51,119,255,0.1)'
          },
        },
        axisLabel: {
          color: "#222226"
        },
        axisTick: {
          show: false
        }
      }
    ],
    xAxis: [
      {
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(51,119,255,0.1)',
            width: 2
          },
        },
        axisLabel: {
          color: "#222226"
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false
        },
      }
    ],
    series: [{
      type: 'bar',
      itemStyle: {
        barBorderRadius: [0, 3, 3, 0],
      }
    }
    ]
  }
  const changeDateOption = (yData = {}) => {
    let data = [
      {
        type: 'bar',
        stack: true,
        barMaxWidth: 20,
        data: Object.values(yData),
        itemStyle: {
          normal: {
            color: {
              type: 'linear',
              x: 0,  //右
              y: 1,  //下
              x2: 0,  //左
              y2: 0,  //上
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(80,190,238,1)' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(51,119,255,0.27)' // 100% 处的颜色
                }
              ]
            }
          },
          barBorderRadius: [3, 3, 0, 0]
        }
      }
    ]
    let xData = Object.keys(yData)
    setDateSeries(data)
    setDateXAxis(xData)
    dateChart.current && dateChart.current.getEchartsInstance().setOption({
      series: data,
      xAxis: [{
        data: xData
      }]
    })
  }

  const changePeriodOption = (yData = {}) => {
    let data = [
      {
        type: 'bar',
        stack: true,
        barMaxWidth: 20,
        data: Object.values(yData),
        itemStyle: {
          normal: {
            color: {
              type: 'linear',
              x: 0,  //右
              y: 0,  //下
              x2: 1,  //左
              y2: 0,  //上
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(80,190,238,1)' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(51,119,255,0.27)' // 100% 处的颜色
                }
              ]
            }
          },
          barBorderRadius: [0, 3, 3, 0],
        }
      }
    ]
    let xData = Object.keys(yData)
    setPeriodSeries(data)
    setPeriodXAxis(xData)
    periodChart.current && periodChart.current.getEchartsInstance().setOption({
      series: data,
      yAxis: [{
        data: xData
      }]
    })
  }

  const handleClick = (index: number) => {
    setCurIndex(index)
  }
  // 表头
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      render: (text: string, data: VehicleLocusAnalysisLocation, index: number) => {
        return <span>{((pageForm.pageNo - 1) * pageForm.pageSize) + (index + 1)}</span>
      }
    },
    {
      title: '出现点位',
      dataIndex: 'locationName',
      key: 'locationName',
      render: (text: string, data: VehicleLocusAnalysisLocation, index: number) => {
        return <span className='location-name' onClick={() => handleClick(index)} title={data.locationName}>{data.locationName}</span>
      }
    },
    {
      width: 90,
      title: '出现次数',
      dataIndex: 'count',
      key: 'count'
    }
  ]

  // 获取点位表格数据
  const getLocation = (formdata: VehicleDetailFormDataType) => {
    setAjaxLoading(true)
    ajax.recordVehicle.getVehicleLocusAnalysisLocation<VehicleDetailFormDataType, VehicleLocusAnalysisLocationType[]>(formdata)
      .then(res => {
        setCurIndex(-1)
        setAjaxLoading(false)
        if (res.data) {
          //   console.log(res.data);
          let newdata: VehicleLocusAnalysisLocation[] = res.data.map((item, index) => {
            return { ...item, id: index }
          })
          setLocationData(newdata)
        }
        if (res.totalRecords) {
          setTotalRecords(res.totalRecords)
        }
      })
      .catch(err => {
        setAjaxLoading(false)
        setCurIndex(-1)
      })
  }

  // 获取echarts数据
  const getTime = () => {
    dateChart.current && dateChart.current.getEchartsInstance().showLoading()
    periodChart.current && periodChart.current.getEchartsInstance().showLoading()
    //车辆行迹分析-按时间
    ajax.recordVehicle.getVehicleLocusAnalysisTime<VehicleDetailFormDataType, VehicleLocusAnalysisTime>(mainFormData)
      .then(res => {
        if (res?.data) {
          changeDateOption(res.data?.dateData)
          changePeriodOption(res.data?.timeData)
        }
        dateChart.current && dateChart.current.getEchartsInstance().hideLoading()
        periodChart.current && periodChart.current.getEchartsInstance().hideLoading()
      })
      .catch(err => {
        dateChart.current && dateChart.current.getEchartsInstance().hideLoading()
        periodChart.current && periodChart.current.getEchartsInstance().hideLoading()
      })
  }
  //分页跳转
  const changePageSize = (pageNo: number, pageSize: number) => {
    let newForm = { pageNo: pageNo, pageSize: 40 }
    setPageForm(newForm)
    let newformdata = {
      ...mainFormData,
      ...newForm,
      timeRef: timeRef.current
    }
    getLocation(newformdata)
  }
  const handleDateChange = (dates: DatesParamsType) => {
    setTimeFrom({
      beginDate: dates.beginDate,
      endDate: dates.endDate,
      timeRange: { times: [dates.beginDate, dates.endDate] }
    })
  }

  const TableList = () => {
    return (
      <ResultBox
        loading={ajaxLoading}
        nodata={!locationData || (locationData && !locationData.length)}
      >
        <Table
          border
          className='yisa-table'
          data={locationData}
          columns={columns}
          stripe
          rowKey={(record) => record.id}
          scroll={{
            y: tableHeight
          }}
        />
      </ResultBox>
    )
  }
  useEffect(() => {
    getTime()
    handleSearchBtnClick()
  }, [mainFormData])
  useEffect(() => {
    dateChart.current && dateChart.current.getEchartsInstance().setOption({
      xAxis: [
        {
          type: 'category',
          show: true,
          axisLine: {
            lineStyle: {
              color: 'rgba(51,119,255,0.1)',
              width: 2
            },
          },
          axisLabel: {
            color: skin === 'dark' ? '#fff' : "#222226"
          },
          axisTick: {
            show: false
          }
        }
      ],
      yAxis: [{
        data: dateXAxis,
        axisLabel: {
          color: skin === 'dark' ? '#fff' : '#222226'
        },
      }],
      series: dateSeries
    })
    periodChart.current.getEchartsInstance().setOption({
      xAxis: [
        {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(51,119,255,0.1)',
              width: 2
            },
          },
          axisLabel: {
            color: skin === 'dark' ? '#fff' : "#222226"
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
        }
      ],
      yAxis: [{
        axisLabel: {
          color: skin === 'dark' ? '#fff' : '#222226'
        },
        data: periodXAxis
      }],
      series: periodSeries
    })
    console.log('change');

  }, [skin])

  useEffect(() => {
    if (tableRef.current) {
      const ro = new ResizeObserver(() => {
        // console.log(tableRef.current?.clientHeight)
        setTableHeight(tableRef.current?.clientHeight ? (tableRef.current?.clientHeight - 95) : 0)
      })
      ro.observe(tableRef.current)
    }
  }, [])
  //点击查询
  const handleSearchBtnClick = () => {
    timeRef.current = timeFrom.timeRange
    let newformdata = {
      ...mainFormData,
      timeRange: timeFrom.timeRange,
      ...restPage
    }
    getLocation(newformdata)
    setRightDrawerVisible(true)
  }

  //弹窗
  const vectorContentCb = (elem: any) => {
    return (
      <div className="track-content">
        <div className="track-content-card">
          <div className="card-img">
            <Image src={elem.bigImage} />
          </div>
          <div className="card-info"><Icon type="shijian" />{elem.captureTime}</div>
          <div className="card-info" title={elem.text}><Icon type="didian" />{elem.text}</div>
          <div className="card-info"><Icon type="zhuapaicishu" />出现<span>{elem.count}</span>次</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${prefixCls}`}>
      {/* 车辆行迹分析 */}
      <div className={`${prefixCls}-left`}>
        <Panel title="出现日期分析(近一月内数据)">
          <ReactEcharts
            className={'data-bar'}
            style={{ height: '100%' }}
            // style={{ height: '300px' }}
            option={optionDate}
            notMerge={true}
            ref={(e) => { dateChart.current = e }}
          />
        </Panel>
        <Panel title="出现时段分析(近一月内数据)">
          <ReactEcharts
            className={'shiduan-bar'}
            // style={{ height: '345px' }}
            style={{ height: '100%' }}
            option={optionPeriod}
            notMerge={true}
            ref={(e) => { periodChart.current = e }}
          />
        </Panel>
      </div>
      <div className={`${prefixCls}-right`}>
        <Panel
          headerSlot={
            <header className={`yisa-panel-header`}>
              <span className={`yisa-panel-header-title title-icon`}>车辆行迹分析</span>
              <div className='title-right'>
                <TimeRangePicker
                  showinnerTimeType={false}
                  showTimeType={false}
                  timeLayout="vertical"
                  beginDate={timeFrom.beginDate}
                  endDate={timeFrom.endDate}
                  onChange={handleDateChange}
                />
                <Button
                  type='primary'
                  loading={ajaxLoading}
                  onClick={handleSearchBtnClick}
                >
                  查询
                </Button>
              </div>
            </header>}
          ref={boxRef}
        >
          <CurContext.Provider
            value={CurContextValue}
          >
            <BaseMap {...mapProps}>
              <TileLayer {...tileLayerProps} />
              <Marker data={locationData} contentCb={vectorContentCb} />
            </BaseMap>
          </CurContext.Provider>
          <BoxDrawer
            onOpen={() => setRightDrawerVisible(true)}
            onClose={() => setRightDrawerVisible(false)}
            placement={'right'}
            title={<div className='list-title'>
              <div className="title">行迹列表</div>
              <Link
                target='_blank'
                href={`#/vehicle-track?licensePlate=${mainFormData.licensePlate}&plateColorTypeId=${mainFormData.plateColorTypeId}`}
              >轨迹重现</Link>
            </div>}
            visible={rightDrawerVisible}
            getContainer={() => boxRef.current as HTMLDivElement}
          >
            <div ref={tableRef} className="ysd-table-container" style={{ height: "100%" }}>
              {
                TableList()
              }
            </div>
            <Pagination
              showSizeChanger
              showQuickJumper
              pageSize={pageForm.pageSize}
              current={pageForm.pageNo}
              total={totalRecords}
              simple={true}
              hideOnSinglePage
              onChange={changePageSize}
            />
          </BoxDrawer>
        </Panel>
      </div>
    </div>)
}

