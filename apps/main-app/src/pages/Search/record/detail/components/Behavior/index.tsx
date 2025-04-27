
import './index.scss'
import { useCallback, useMemo } from 'react'
import { Checkbox, Radio, Loading, Tooltip } from '@yisa/webui'
import { BaseMap, TileLayer } from '@yisa/yisa-map'
import { ResultBox } from "@yisa/webui_business";
import { getMapProps } from '@/utils'
import { QuestionCircleOutlined } from '@yisa/webui/es/Icon'
import { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox'
import { useSelector, RootState } from '@/store';
import { Card } from '@/components'
import AreaMap from './AreaMap'
import { RadioChangeEvent } from '@yisa/webui/es/Radio/interface'
import WorkPerson from '@/assets/images/record/work-person.png'
import DriverPerson from '@/assets/images/record/driver-person.png'
import ServicePerson from '@/assets/images/record/service-person.png'
import services from "@/services";
import React, { useEffect, useRef, useState } from 'react'
import { Props } from '../../interface'
import echarts from '@/utils/echarts';
import dayjs from 'dayjs'
// import * as echarts from 'echarts';

const Behavior = (props: Props) => {
  const { data, handleChangeTabKey } = props
  const prefixCls = 'record-detail-behavior'
  const skin = useSelector((state: RootState) => {
    return state.comment.skin
  });
  const vertical = useSelector((state: RootState) => {
    return state.vertical.fixed
  });

  // 职业画像
  const [behaviorType, setBehaviorType] = useState<{ characterId: number, characterName: string, description: string[] }>({
    characterId: -1,
    characterName: '',
    description: []
  })

  // 活动频率数据 [[x,y,num]]
  const [activeRateData, setActiveRateData] = useState({
    xAxis: {},
    yAxis: {},
    data: []
  })
  // 交通工具数据
  const [trafficToolsData, setTrafficToolsData] = useState([])
  // 交通工具数据-时间
  const [trafficType, setTrafficType] = useState('0')

  // 活动范围
  const [locationsData, setLocationsData] = useState({})

  // 衣着特征数据
  const [clothData, setClothData]: any = useState({
    data: []
  })
  const [clothLoading, setClothLoading] = useState(false)

  const activeReteRef = useRef<any>(null)
  const trafficToolsRef = useRef<any>(null)
  const canvasBox = useRef<any>(null)

  // 修改活动范围时间
  const handleChangeTrafficType = useCallback((e: RadioChangeEvent) => {
    setTrafficType(e.target.value)
    getTrafficToolsData(e.target.value)
  }, [])

  // 初始化每日活动频率echarts
  const initActiveRateCanvas = (rateData: any) => {
    // prettier-ignore
    const option = {
      tooltip: {
        position: 'top',
        // formatter: '{a}<br />{b0}{c}{d}'
      },
      grid: {
        top: '20%',
        height: '70%',
        width: '88%',
        left: '8%'
      },
      xAxis: {
        type: 'category',
        data: rateData.xAxis || [
          "0a",
          "2a",
          "4a",
          "6a",
          "8a",
          "10a",
          "12a",
          "2p",
          "4p",
          "6p",
          "8p",
          "10p"
        ],
        nameLocation: 'middle',
        splitArea: {
          show: true
        },
        axisLabel: {
          interval: '0'
        },
        axisLine: {
          lineStyle: {
            color: skin == 'dark' ? 'rgba(255,255,255, 0.5)' : '#333'
          }
        },
        axisTick: {
          inside: true
        }
      },
      yAxis: {
        type: 'category',
        data: rateData.yAxis || [
          "周一",
          "周二",
          "周三",
          "周四",
          "周五",
          "周六",
          "周日"
        ],
        splitArea: {
          show: true
        },
        axisLine: {
          lineStyle: {
            color: skin == 'dark' ? 'rgba(255,255,255, 0.5)' : '#333'
          }
        },
        axisTick: {
          inside: true
        }
      },
      visualMap: {
        min: 0,
        max: 14,
        show: false,
        calculable: true,
        orient: 'horizontal',
        right: '10px',
        top: '0',
        inRange: {
          color: ['#F7B378', '#FB8762', '#F0584A']
        },
        textStyle: {
          color: skin == 'dark' ? 'rgba(255,255,255, 0.5)' : '#333'
        },
        align: "bottom",
      },
      series: [
        {
          name: '每日活动频率',
          type: 'heatmap',
          data: rateData.data || [],
          label: {
            show: true,
            color: '#fff'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              // color:'#fff'
            }
          }
        }
      ],
    };

    const chartDom = document.getElementById('active-rate');
    if (chartDom && rateData?.data?.length) {
      activeReteRef.current = echarts.init(chartDom);
      activeReteRef.current.setOption(option);
    }
  }
  const [trafficCount, setTrafficCount] = useState(0)
  // 初始化交通工具echarts
  const initTrafficToolsCanvas = (trafficData: any) => {
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}:{d}%'
      },
      legend: {
        left: '60%',
        top: 'center',
        orient: 'vertical',
        textStyle: {
          color: skin == 'dark' ? 'rgba(255,255,255, 0.5)' : '#333'
        },
        formatter: function (name: string) {
          let percentage = (trafficData.filter((ele: any) => ele.name == name)[0].value)
          if (name == '步行') {
            return "  " + name + "           " + percentage + '%';
          } else if (name == '二轮车' || name == '三轮车') {
            return "  " + name + "        " + percentage + '%';
          }
          return "  " + name + "     " + percentage + '%';
        }
      },
      grid: {
        // left: 'center',
        // width: '100%',
        top: '20%',
        bottom: 0,
        height: '80%'
      },

      series: [
        {
          // name: 'Access From',
          type: 'pie',
          radius: ['60%', '70%'],
          center: ['30%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: 'transparent',
            borderWidth: 5
          },
          color: ['#319CF5', '#F9675B', '#FB922D', '#30BB75', '#47DCF3'],
          // width: '100%',
          // height: '100%',
          // top: 0,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: false
              // fontSize: 20,
              // fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: trafficData
        }
      ]
    };
    let count = trafficData?.reduce((num: number, ele: any) => ele.value + num, 0)
    setTrafficCount(count)

    const chartDom = document.getElementById('traffic-tool');
    if (chartDom && count) {
      trafficToolsRef.current = echarts.init(chartDom);
      trafficToolsRef.current.setOption(option);
    }
  }

  // 获取活动频率数据
  const getActiveRateData = () => {
    services.record.getBehaviorRateData<any, any>({ ...data })
      .then(res => {
        if (res.data) {
          setActiveRateData(res.data)
          initActiveRateCanvas(res.data)
        }
      })
      .catch(err => {
        initActiveRateCanvas({})
      })
  }

  //职业画像
  const getCharacterizationData = (type: string = trafficType) => {
    services.record.getCharacterizationData<any, any>({ ...data, trafficType: type })
      .then(res => {
        if (res.data) {
          setBehaviorType({
            characterId: res.data.characterId,
            characterName: res.data.characterName,
            description: res.data.description
          })
        }
      })
  }

  // 获取交通工具数据
  const getTrafficToolsData = (type: string = trafficType) => {
    services.record.getBehaviorTrafficData<any, any>({ ...data, trafficType: type })
      .then(res => {
        if (res.data) {
          setTrafficToolsData(res.data)
          initTrafficToolsCanvas(res.data)
        }
      })
  }
  useEffect(() => {
    canvasResize()
  }, [vertical])
  /**canvas重新设置宽度 */
  const canvasResize = function () {
    if (canvasBox.current && activeReteRef.current) {
      activeReteRef.current.resize({
        width: vertical ? 400 : 623,
        height: 350
      })
    }
    if (canvasBox.current && trafficToolsRef.current) {
      trafficToolsRef.current.resize({
        width: vertical ? 395 : 623,
        height: 200
      })
    }
  }


  // 获取活动范围
  const getActiveLocationsData = () => {
    services.record.getActiveLocationsData<any, any>({ ...data })
      .then(res => {
        if (res.data) {
          setLocationsData(res.data)
        }
      })
  }
  // 获取衣着特征数据
  const getClothSameData = (groupBy?: string) => {
    setClothLoading(true)
    services.record.getPortraitPersonData<any, any>({
      ...data,
      pageSize: 40,
      pageNo: 1,
      groupBy: groupBy || '3'
    })
      .then(res => {
        setClothLoading(false)
        setClothData(res)
      })
      .catch(() => {
        setClothLoading(false)
      })
  }
  useEffect(() => {
    getCharacterizationData()
    // 获取活动频率数据
    getActiveRateData()
    // 获取交通工具数据
    getTrafficToolsData()
    // 获取活动范围
    getActiveLocationsData()
    // 获取衣着特征数据
    getClothSameData()
  }, [])

  useEffect(() => {
    if (activeRateData.data.length) initActiveRateCanvas(activeRateData)
    if (trafficToolsData.length) initTrafficToolsCanvas(trafficToolsData)
  }, [skin])

  //地图配置
  const { mapProps, tileLayerProps } = useMemo(() => {
    return getMapProps('BehaviorMap')
  }, [])

  const handleClickArea = (type: string) => {
    setIsShowArea(Object.assign({}, isShowArea, {
      ['area_' + type]: !isShowArea['area_' + type]
    }))
  }
  const [isShowArea, setIsShowArea] = useState({
    'area_1': true,
    'area_2': true,
    'area_3': true,
  })
  // 是否同天换衣
  const [isSameDay, setIsSameDay] = useState(false)

  const handleChangeSameDay = useCallback((e: CheckboxChangeEvent) => {
    setIsSameDay(e.target.checked);
    getClothSameData(e.target.checked ? '2' : '3')
  }, [])

  // 衣着特征查看更多
  const searchMore = () => {
    // 跳转到抓拍图像人体-同天换衣
    handleChangeTabKey && handleChangeTabKey('portrait', { type: 'pedestrian', pedestrianType: isSameDay ? ['2'] : ['3'] })
  }

  return <div className={`${prefixCls}`}>
    <div className={`${prefixCls}-left`} ref={canvasBox}>
      <div className="behavior behavior-career">
        <div className="title">职业画像&nbsp;&nbsp;
        </div>
        <div className="content">
          <div className="career-type">
            <img src={behaviorType.characterId == 1 ? WorkPerson : behaviorType.characterId == 2 ? DriverPerson : ServicePerson} alt="" />
            {behaviorType.characterName}
          </div>
          <Tooltip title={
            behaviorType.characterName || behaviorType.description ?
            <div>
              <span>{behaviorType.characterName}:</span>
              <div>{behaviorType.description}</div>
            </div>
            :
            <div>暂无描述</div>
          }>
            <QuestionCircleOutlined />
          </Tooltip>
          {/* <div className="career-type driver-type">
            <img src={DriverPerson} alt="" />
            网约车司机
          </div>
          <div className="career-type service-type">
            <img src={ServicePerson} alt="" />
            服务人员
          </div> */}
        </div>
      </div>
      <div className="behavior behavior-rate">
        <div className="title">每日活动频率</div>
        <div id="active-rate" style={{
          width: vertical ? 400 : 623,
          height: 350
        }} ></div>
        {
          activeRateData.data && activeRateData.data.length ? null
            : <div className="no-data"> <div className="no-img"></div> 暂无活动频率数据</div>
        }
      </div>
      <div className="behavior behavior-traffic">
        <div className="title">交通工具</div>
        <div className='content'>
          {/* <Radio.Group
            optionType="button"
            className="traffic-radio-item"
            options={[{ label: '全部', value: '0' }, { label: '周一至周五', value: '1' }, { label: '周六至周日', value: '2' },]}
            value={trafficType}
            onChange={handleChangeTrafficType}
          /> */}
          <div className="traffic-echarts">
            <div id="traffic-tool"
              style={{
                width: vertical ? 395 : 623,
                height: 200,
                zIndex: 2
              }}>
            </div>
            {
              trafficCount ? <div className="traffic-center-item">
                <div className="total-num">
                  {/* <div className="num">1801</div>
                <div>总数</div> */}
                  <div className="name">交通工具</div>
                </div>
              </div>
                : null
            }
          </div>
          {
            trafficCount ? null
              : <div className="no-data"> <div className="no-img"></div> 暂无交通工具数据</div>
          }
        </div>
      </div>
    </div>
    <div className={`${prefixCls}-right`}>
      <div className="characteristics">
        <div className="title-header">
          <div className="title-left">
            <div className="title">衣着特征</div>
            <div className="charac">
              <Checkbox checked={isSameDay} onChange={handleChangeSameDay}>
                同天换衣
              </Checkbox>
            </div>
          </div>
          <div className="title-right" onClick={searchMore}>查看更多{'>'}</div>
        </div>
        <div className={`content ${isSameDay ? 'same-content' : ''}`}>
          <ResultBox
            nodataClass="nodata"
            nodataTip="暂无衣着特征数据"
            loading={clothLoading}
            nodata={clothData.data.length == 0}
          >
            <div className={`content ${isSameDay ? 'same-content' : ''}`}>
              {
                isSameDay
                  ? <>
                    {
                      clothData.data.slice(0, 2).map((item: any) => {
                        return <Card.ClothSameInfo
                          onClickMore={searchMore}
                          data={item}
                        />
                      })
                    }
                  </>
                  : <>
                    {
                      clothData.data.slice(0, 4).map((item: any) => {
                        return <Card.ClothInfo
                          onCaptureClick={() => {
                            // 跳转到抓拍图像人体-同天换衣
                            handleChangeTabKey && handleChangeTabKey('portrait', {
                              type: 'pedestrian',
                              pedestrianType: isSameDay ? ['2'] : ['3'],
                              data: item,
                              showCount: true,
                              timeRange: {
                                times: [
                                  dayjs().subtract(89, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                                  dayjs().format('YYYY-MM-DD HH:mm:ss')
                                ]
                              }
                            })
                          }}
                          cardData={item}
                        />
                      })
                    }
                  </>
              }
            </div>
          </ResultBox>
        </div>
      </div>
      <div className={`area-info ${data?.idNumber ? '' : 'noreal-area-info'}`}>
        <div className="title">场所信息</div>
        <div className="content">
          <BaseMap {...mapProps}>
            <TileLayer {...tileLayerProps} />
            <AreaMap
              key={isShowArea}
              isShowArea={isShowArea}
              locationsData={locationsData}
            />
          </BaseMap>
          <div className="map-tools">
            <div className="tool-item" onClick={() => handleClickArea('1')}>
              <div className={`circle blue-circle ${isShowArea.area_1 ? '' : 'grey-circle'}`}></div>
              <div>住宅区域</div>
            </div>
            <div className="tool-item" onClick={() => handleClickArea('2')}>
              <div className={`circle red-circle ${isShowArea.area_2 ? '' : 'grey-circle'}`}></div>
              <div>工作区域</div>
            </div>
            <div className="tool-item" onClick={() => handleClickArea('3')}>
              <div className={`circle green-circle ${isShowArea.area_3 ? '' : 'grey-circle'}`}></div>
              <div>活跃区域</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}
export default Behavior
