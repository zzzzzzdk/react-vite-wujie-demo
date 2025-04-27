import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  Form, Modal,
  Tree,
  VirtualList, Input, Message, Button, Tabs, Checkbox, Loading
} from '@yisa/webui'
import LocationMapListProps, { LocationListType, LocationData, LocationMapListCallBack, markerType, DrawType, OfflineData } from "./interface";
import { MassMarker, CityMassMarker } from '@/components'
import { getMapProps } from "@/utils";
import { isFunction, isUndefined, isArray } from '@/utils/is';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { Icon } from '@yisa/webui/es/Icon';
import { BaseMap, TileLayer, Draw, Popup, utils } from '@yisa/yisa-map'
import L, { LeafletEvent, Marker } from "leaflet"
import classNames from 'classnames'
import dictionary from '@/config/character.config'
import ajax from "@/services";
import { DeleteOutlined, MinusCircleFilled } from '@yisa/webui/es/Icon';
import { NodeInstance, NodeProps } from "@yisa/webui/es/Tree/interface";
import img1 from '../../assets/images/map/1.png'
import img1h from '../../assets/images/map/1h.png'
import { OfflineTreeItem, ResultRowType as OfflineChildrenItem } from "@/pages/Analysis/Offline/interface";
import "./index.scss"
import { RootState, useSelector } from "@/store";
import { useDebounceEffect, useUpdateEffect } from "ahooks";

export function formatValue(value: any) {
  const val = value !== null && !isUndefined(value) && isArray(value) ? value : []
  return val
}

const LocationMapList = (props: LocationMapListProps) => {
  const {
    className,
    title = "选择点位/文件",
    buttonTitle = title,
    formItemProps = { label: "数据源" },
    defaultListType = 'region',
    onChange,
    tagTypes = dictionary.tagTypes,
    onlyLocationFlag = false,
    showDrawTools = false,
    showMap = true,
    defaultDrawType = "default",
    onChangeDrawTools = () => { },
    isPermitModal = true, // true 允许弹列表选择点位弹窗 false不允许
    disabled = false,
    themeType = "default",
    showOperator, // 是否显示执机人
  } = props
  const prefixCls = 'location-map-list'
  const { skin } = useSelector((state: RootState) => state.comment)

  const [checkedLocationIds, setCheckedLocationIds] = useMergedState<string[]>([], {
    value: 'locationIds' in props ? formatValue(props.locationIds) : undefined
  })
  const checkedLocationIdsSet = new Set(checkedLocationIds)

  const [checkedLocationGroupIds, setCheckedLocationGroupIds] = useMergedState<string[]>([], {
    value: 'locationGroupIds' in props ? formatValue(props.locationGroupIds) : undefined
  })

  const [checkedOfflineIds, setCheckedOfflineIds] = useMergedState<string[]>([], {
    value: 'offlineIds' in props ? formatValue(props.offlineIds) : undefined
  })

  const { scaleZoom, zoom } = window.YISACONF.map
  //区县与海量点切换
  const [cityMassMarker, setCityMassMarker] = useState({
    showCityMarker: true,
    showMassMarker: false,
  })
  //缩放比例
  const [mapZoom, setMapZoom] = useState(zoom || 13)

  const [filterText, setFilterText] = useState('')
  const [debounceFilterText, setDebounceFilterText] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [markerData, setMarkerData] = useState<LocationData[]>([])
  const [locationData, setLocationData] = useState<LocationData[]>([])
  const [locationGroupData, setLocationGroupData] = useState<LocationData[]>([])
  const [offlineData, setOfflineData] = useState<LocationData[]>([])
  const [drawType, setDrawType] = useState<DrawType>('default')
  const [vectorData, setVectorData] = useState(null)
  const [clickData, setClickData] = useState<any>([])
  const [popupVisible, setPopupVisible] = useState(false)
  const [listType, setListType] = useState<LocationListType>(defaultListType)         // region: 地区；locationGroup：设备组；offline 离线任务
  // console.log('listType', listType)
  const [treeLoading, setTreeLoading] = useState(false)

  // 树状数据暂存，防止每次切换都重新请求
  const treeStroage = useRef<{
    region: LocationData[]
    locationGroup: LocationData[]
    offline: OfflineData[]
  }>({
    region: [],
    locationGroup: [],
    offline: []
  })
  const [treeData, setTreeData] = useState<LocationData[]>([]) // 正在显示的点位数据

  /**数据扁平化梳理*/
  const flatTreeData = (data: LocationData[]) => {
    // console.log(data)
    let result: LocationData[] = [];
    (function recursionFun(_data) {
      _data.forEach(item => {
        if (item.children && item.children.length) {
          recursionFun(item.children)
          // delete item.nodes
        }
        result.push(item)
      })
    })(data)
    return result
  }
  // const isFirst
  const parentIds = useMemo(() => {
    return flatTreeData(treeData).filter(item => !!item.scale).map(item => item.id)
  }, [treeData])
  // const parentIds: any[] = []

  // 回调的数据
  const formData = useRef<LocationMapListCallBack>({
    locationIds: checkedLocationIds,
    locationGroupIds: checkedLocationGroupIds,
    offlineIds: checkedOfflineIds,
    parentIds: parentIds
  })
  formData.current = {
    locationIds: checkedLocationIds,
    locationGroupIds: checkedLocationGroupIds,
    offlineIds: checkedOfflineIds,
    parentIds: parentIds
  }

  // const { mapProps, tileLayerProps } = useMemo(() => {
  //   return getMapProps('locationMap')
  // }, [])
  //地图配置
  const { mapProps, tileLayerProps } = useMemo(() => {
    const { mapProps, tileLayerProps } = getMapProps('locationMap')
    return {
      mapProps: {
        ...mapProps,
        onZoomStart: (e: LeafletEvent) => {
        },
        onZoomEnd: (e: LeafletEvent) => {
          const afterZoom = e.target.getZoom()
          if (afterZoom < scaleZoom) {
            setCityMassMarker({ showCityMarker: true, showMassMarker: false })
          } else {
            setCityMassMarker({ showCityMarker: false, showMassMarker: true })
          }
          setMapZoom(afterZoom)
        }
      },
      tileLayerProps
    }
  }, [])

  useEffect(() => {
    if(modalVisible) {
      if (defaultListType === listType) return;
      setListType(defaultListType)
      getLocation(defaultListType)
    }
  }, [defaultListType, modalVisible])

  const checkedLocations = useMemo(() => {
    const ids = new Set(checkedLocationGroupIds.concat(checkedLocationIds))
    // console.time("生成checkedLocations")
    const locations = locationData.filter(elem => ids.has(elem.id))
    const locationgroups = locationGroupData.filter(elem => ids.has(elem.id))
    // console.timeEnd("生成checkedLocations")
    return [...locations, ...locationgroups]
  }, [checkedLocationIds, locationData, checkedLocationGroupIds])

  const checkedFiles = useMemo(() => {
    const ids = new Set(checkedOfflineIds)
    return offlineData.filter(elem => ids.has(elem.id))
  }, [checkedOfflineIds, offlineData])

  const drawTools: {
    icon: string;
    type: DrawType;
  }[] = [
      {
        icon: 'zhuashou',
        type: 'default'
      },
      {
        icon: 'quanxuan',
        type: 'circle'
      },
      {
        icon: 'kuangxuan',
        type: 'rectangle'
      },
      {
        icon: 'zidingyi',
        type: 'polygon'
      },
      {
        icon: 'shanchu',
        type: 'clear'
      },
    ]

  const getLocation = async (type: LocationListType, changeTree: boolean = true) => {
    if (changeTree) {
      setTreeLoading(true)
    }

    if (treeStroage.current[type].length) {
      if (changeTree) {
        setTreeLoading(false)
      }
      changeTree && setTreeData(treeStroage.current[type])
      return
    }
    let data: any = []

    if (type === 'region') { // 区域点位
      const res = await ajax.location.getLocationList({
        needType: "1",
        typeId: props.showOperator ? "1,2,3,4,5" : "1,2,3,4",
      })
      data = (res.data as LocationData[])
      const result = handleLocationData(data, 'region')
      setMarkerData(result)
      setLocationData((prev) => result)
    } else if (type === 'locationGroup') { // 点位组
      const res = await ajax.location.getLocationList({
        needType: "2",
        typeId: "1,2,3,4",
      })
      data = (res.data as LocationData[])
      setLocationGroupData((prev) => handleLocationData(data, 'locationGroup'))
    } else if (type === 'offline') { // 离线任务
      const res = await ajax.offline.getAllOfflineFile()
      data = (res.data as OfflineData[])
      data = handleOfflineData(data)
      setOfflineData(flatOfflineData(data, 'offline'))
    }
    if (changeTree) {
      setTreeLoading(false)
    }
    changeTree && setTreeData(data)
    treeStroage.current[type] = data
  }

  const handleLocationData = (data: LocationData[], type: LocationListType, parent?: LocationData) => {
    let _locationData: LocationData[] = []
    data.forEach(elem => {
      const { scale, children } = elem
      if (scale && Array.isArray(children)) {
        _locationData = [..._locationData, ...handleLocationData(children, type, elem)]
      }
      if (!scale) {
        _locationData.push({
          ...elem,
          listType: type,
          parent: parent
        })
      }
    })
    return _locationData
  }

  // flat离线任务数据
  const flatOfflineData = (data: OfflineData[], type: LocationListType, parent?: OfflineData) => {
    let _offlineData: OfflineData[] = []
    data.forEach(elem => {
      const { scale, children } = elem
      if (scale && Array.isArray(children)) {
        _offlineData = [..._offlineData, ...flatOfflineData(children, type, elem)]
      }
      if (!scale) {
        _offlineData.push({
          ...elem,
          listType: type,
          parent: parent
        })
      }
    })
    return _offlineData
  }

  // 处理离线任务数据，添加id，text
  const handleOfflineData = (data: OfflineData[]) => {
    let _offlineData = [...data]
    function dg(arr: OfflineData[], level?: number) {
      level = level || 0
      level++
      arr.forEach((item, i) => {
        if (item.fileId) {
          item.id = item.fileId
          item.text = item.fileName || ''
        } else {
          // 添加jobId前缀，防止与fileId重复
          item.id = `jobId-${item.jobId}`
          item.text = item.name + ''
          item.scale = level
        }
        if (item.children && item.children.length) {
          dg(item.children, level)
        }
      })
    }
    dg(_offlineData)
    return _offlineData
  }

  const handleOpenList = () => {
    if (disabled) return
    if (!isPermitModal) {
      Message.warning('请在右侧地图中操作')
      return
    }
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
  }

  const handleChangeFilterText = (e: any) => {
    setFilterText(e.target.value)

    // 清空筛选
    if (!e.target.value) {
      // 从选中id中剔除父级id
      const parentIds = flatTreeData(treeData).filter(item => !!item.scale).map(item => item.id)
      let newIds = listType === 'offline' ? checkedOfflineIds : listType === 'region' ? checkedLocationIds : checkedLocationGroupIds
      newIds = newIds.filter(id => !parentIds.includes(id))
      if (listType === 'offline') {
        if (!('offlineIds' in props)) {
          setCheckedOfflineIds(newIds)
        }
      } else if (listType === 'locationGroup') {
        if (!('locationGroup' in props)) {
          setCheckedLocationGroupIds(newIds)
        }
      } else {
        if (!('locationIds' in props)) {
          setCheckedLocationIds(newIds)
        }
      }
      const fieldName = listType === 'region' ? 'locationIds' : listType === 'locationGroup' ? 'locationGroupIds' : 'offlineIds'

      formData.current[fieldName] = newIds

      if (onChange && isFunction(onChange)) {
        onChange(formData.current)
      }
    }
  }

  useDebounceEffect(() => {
    setDebounceFilterText(filterText)
  }, [filterText], { wait: 300 })

  const handleFilterCheckedChange = (newIds: string[], checked: boolean) => {
    const newIdsSet = new Set(newIds)
    let nowData = (filterText.trim() ? handleFilterTreeData() : treeData);
    let allFilterIds = flatTreeData(nowData).map(item => item.id)
    let checkedFilterIds = allFilterIds.filter(id => newIdsSet.has(id)).reverse()
    let cancelFilterIds = new Set(allFilterIds.filter(id => !newIdsSet.has(id)))

    let oldIds = listType === 'region' ? checkedLocationIds : listType === 'locationGroup' ? checkedLocationGroupIds : checkedOfflineIds

    if (checked) { // 如果是选中，合并之前选中的id数组与过滤之后选中的id数组
      newIds = [...new Set([...checkedFilterIds, ...oldIds])];
    } else {// 如果是取消选中，就要将取消的id，从oldIds数组中也去除，然后再进行合并
      oldIds = oldIds.filter(id => !cancelFilterIds.has(id))
      newIds = [...new Set([...checkedFilterIds, ...oldIds])];
    }
    return newIds
  }

  // 多选框选中
  const handleChangeLocation = (ids: string[], {
    checked,
    checkedNodes,
    halfCheckedKeys,
    halfCheckedNodes,
    e
  }: { checked: boolean, checkedNodes: NodeInstance[], halfCheckedKeys: string[], halfCheckedNodes: NodeInstance[], e: React.MouseEvent }) => {
    let newIds = ids
    if (filterText.trim()) {
      // console.log("有筛选的前提下")
      newIds = handleFilterCheckedChange(newIds, checked)
    }
    if (listType === 'offline') {
      if (!('offlineIds' in props)) {
        setCheckedOfflineIds(newIds)
      }
    } else if (listType === 'locationGroup') {
      if (!('locationGroup' in props)) {
        setCheckedLocationGroupIds(newIds)
      }
    } else {
      if (!('locationIds' in props)) {
        setCheckedLocationIds(newIds)
      }
    }
    const fieldName = listType === 'region' ? 'locationIds' : listType === 'locationGroup' ? 'locationGroupIds' : 'offlineIds'

    formData.current[fieldName] = newIds
    if (onChange && isFunction(onChange)) {
      onChange(formData.current)
    }
  }

  const handleClearLocation = () => {
    if (!('locationIds' in props)) {
      setCheckedLocationIds([])
    }

    formData.current['locationIds'] = []
    if (onChange && isFunction(onChange)) {
      onChange(formData.current)
    }
  }

  const filterTreeNode = useCallback((node: NodeProps) => {
    // 关键词通过空格/逗号/分号分割，可能会有多个
    const pattern = /[\s,;，；]+/;
    const keywords = debounceFilterText.split(pattern);

    return keywords.every(key => (node.title as string)?.includes(key));
  }, [debounceFilterText])

  const handleRenderNodeTitle = (node: NodeProps) => {
    return highlight((node.dataRef?.text || ''), debounceFilterText)
  }

  const highlight = (text: string, highlightText: string) => {
    // 关键词通过空格/逗号/分号分割，可能会有多个
    const pattern = /[\s,;，；]+/;
    const keywords = highlightText.split(pattern);
    if (highlightText) {
      const regex = new RegExp(keywords.map(keyword => `${keyword.trim()}`).join('|'), "gi");
      return <span dangerouslySetInnerHTML={{ __html: text.replace(regex, (match) => `<mark>${match}</mark>`) }}></span>
    }
    return text
  };

  const handleClearList = () => {
    if (!('locationIds' in props)) {
      setCheckedLocationIds([])
    }
    if (!('locationGroupIds' in props)) {
      setCheckedLocationGroupIds([])
    }
    if (!('offlineIds' in props)) {
      setCheckedOfflineIds([])
    }
    formData.current = {
      locationIds: [],
      locationGroupIds: [],
      offlineIds: [],
      parentIds: parentIds
    }
    if (onChange && isFunction(onChange)) {
      onChange(formData.current)
    }
  }



  // 递归检索的方法
  const filterDataHandle = (data: LocationData[]) => {
    // 关键词通过空格/逗号/分号分割，可能会有多个
    const pattern = /[\s,;，；]+/;
    const keywords = filterText.split(pattern);
    // console.log(keywords)

    let result: LocationData[] = []
    data.forEach(ele => {
      if (keywords.every(key => ele.text.includes(key)) || ele?.children) {
        if (ele?.children) {
          let res = filterDataHandle(ele.children)
          res.length === 0 ? (keywords.every(key => ele.text.includes(key)) && result.push(ele)) : result.push({ ...ele, children: res })
          return
        }
        result.push(ele)
      }
    });
    return result
  }

  const handleFilterTreeData = (data = treeData) => {
    let result = filterDataHandle(data)
    return result
  }

  // 全选
  const handleCheckAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    let nowData = (filterText.trim() ? handleFilterTreeData() : treeData);
    // 选中不过滤父级id，不然会导致没有子级的无法选中
    let ids = flatTreeData(nowData).map(item => item.id)
    if (listType === 'offline') {
      if (!('offlineIds' in props)) {
        setCheckedOfflineIds(ids)
      }
    } else if (listType === 'locationGroup') {
      if (!('locationGroup' in props)) {
        setCheckedLocationGroupIds(ids)
      }
    } else {
      if (!('locationIds' in props)) {
        setCheckedLocationIds(ids)
      }
    }
    const fieldName = listType === 'region' ? 'locationIds' : listType === 'locationGroup' ? 'locationGroupIds' : 'offlineIds'
    // 传参过滤父级id
    // const newIds = flatTreeData(nowData).filter(item => !item?.scale).map(item => item.id)
    // formData.current[fieldName] = newIds
    formData.current[fieldName] = ids
    if (onChange && isFunction(onChange)) {
      onChange(formData.current)
    }
  }

  const handleChangeLocationItem = (id: string, isChecked: boolean) => {
    let _value = checkedLocationIds
    if (isChecked) {
      _value = checkedLocationIds.filter(elem => elem !== id)
    } else {
      _value = [..._value, id]
    }
    if (!('locationIds' in props)) {
      setCheckedLocationIds(_value)
    }
    formData.current['locationIds'] = _value

    if (onChange && isFunction(onChange)) {
      onChange(formData.current)
    }

  }

  const handleChangeLocationType = (key: string) => {
    const thisType = (key as LocationListType)
    setListType(thisType)
    getLocation(thisType)
  }

  const renderCheckedList = () => {
    //
    const noData = (listType === 'offline' && !checkedFiles.length) || (listType !== 'offline' && !checkedLocations.length)

    return (
      noData ?
        <div className={`nodata-${skin}`}></div>
        :
        <VirtualList
          data={listType === 'offline' ? checkedFiles : checkedLocations}
          height={556}
          itemKey={child => child.id}
          itemHeight={26}
          virtual={true}
        >
          {
            child => {
              const { id, text, listType, parent } = child
              const currentText = `${listType === 'locationGroup' && parent ? `${parent.text} - ` : ''}${text}`
              return <div className="location-item" title={currentText}>
                <span className="location-item-name">{currentText}</span>
                <span onClick={() => handleDelCheckedList(id, listType)}>
                  <Icon type="shanchu" />
                </span>
              </div>
            }
          }
        </VirtualList>
    )
  }

  // 右侧列表点击删除
  const handleDelCheckedList = (id: string, type: LocationListType) => {
    let _value = type === 'region' ? checkedLocationIds : type === 'locationGroup' ? checkedLocationGroupIds : checkedOfflineIds;
    _value = _value.filter(elem => elem !== id)
    const fieldName = type === 'region' ? 'locationIds' : type === 'locationGroup' ? 'locationGroupIds' : 'offlineIds'

    if (!(fieldName in props)) {
      type === 'region' ?
        setCheckedLocationIds(_value) :
        type === 'locationGroup' ?
          setCheckedLocationGroupIds(_value) :
          setCheckedOfflineIds(_value)
    }
    formData.current[fieldName] = _value
    if (onChange && isFunction(onChange)) {
      onChange(formData.current)
    }
  }

  // function generateMarkers(markerData: LocationData[], checkedLocationIds: string[]) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //         const _icons = [
  //           L.icon({
  //             iconUrl: img1,
  //             iconSize: [18, 18],
  //             iconAnchor: [9, 9]
  //           }),
  //           L.icon({
  //             iconUrl: img1h,
  //             iconSize: [18, 18],
  //             iconAnchor: [9, 9]
  //           })
  //         ]
  //         const _markers = markerData.map(elem => {
  //           const { id, lat, lng, text } = elem
  //           if (!lat || !lng) {
  //             return false
  //           }
  //           let marker: markerType = L.marker([parseFloat(lat), parseFloat(lng)], {
  //             icon: checkedLocationIds.includes(id) ? _icons[1] : _icons[0],
  //             // zIndexOffset: 1000 // canvas 中index无效
  //           }).bindTooltip(text)
  //           marker.data = elem
  //           marker.latlng= [lat, lng]
  //           return marker
  //         }).filter(Boolean)
  //         resolve(_markers);
  //     } catch (err) {
  //       reject(err)
  //     }
  //   });
  // }

  // // 地图相关
  // const [markers, setMarkers] = useState<unknown>([])
  // useDebounceEffect(() => {
  //   generateMarkers(markerData, checkedLocationIds).then(_markers => {
  //     // console.log(_markers)
  //     setMarkers(_markers)
  //   }).catch(err => console.log(err))
  // }, [markerData, checkedLocationIds], { wait: 10 })

  // 地图相关
  const _icons = [
    L.icon({
      iconUrl: img1,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    }),
    L.icon({
      iconUrl: img1h,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    })
  ]
  const unCheckedMarkers = useMemo(() => {
    return markerData.map(elem => {
      const { id, lat, lng, text } = elem
      if (!lat || !lng) {
        return false
      }
      let marker: markerType = L.marker([parseFloat(lat), parseFloat(lng)], {
        icon: _icons[0],
        // zIndexOffset: 1000 // canvas 中index无效
      }).bindTooltip(text)
      marker.data = elem
      marker.latlng = [lat, lng]
      return marker
    }).filter(Boolean)
  }, [markerData])

  const checkedMarkers = useMemo(() => {
    // console.time("生成_markers")
    const _markers = markerData.filter(elem => elem.lng && elem.lat && checkedLocationIdsSet.has(elem.id))
    // console.timeEnd("生成_markers")
    return _markers.map(elem => {
      const { id, lat, lng, text } = elem
      if (!lat || !lng) {
        return false
      }
      let marker: markerType = L.marker([parseFloat(lat), parseFloat(lng)], {
        icon: _icons[1],
        // zIndexOffset: 1000 // canvas 中index无效
      }).bindTooltip(text)
      marker.data = elem
      marker.latlng = [lat, lng]
      return marker
    })
  }, [checkedLocationIds])

  // const markers = useMemo(() => {
  //   return markerData.map(elem => {
  //     const { id, lat, lng, text } = elem
  //     if (!lat || !lng) {
  //       return false
  //     }
  //     let marker: markerType = L.marker([parseFloat(lat), parseFloat(lng)], {
  //       icon: checkedLocationIds.includes(id) ? _icons[1] : _icons[0],
  //       // zIndexOffset: 1000 // canvas 中index无效
  //     }).bindTooltip(text)
  //     marker.data = elem
  //     marker.latlng= [lat, lng]
  //     return marker
  //   }).filter(Boolean)
  // }, [markerData, checkedLocationIds])


  const unCheckedMassMarkerProps = useMemo(() => {
    return {
      data: unCheckedMarkers,
      checkedIds: checkedLocationIds,
      zIndex: 101,
      onChangeClickData: (event: LeafletEvent, data: any) => {
        // console.log(event, data)
        setClickData(data)
      }
    }
  }, [unCheckedMarkers])

  const checkedMassMarkerProps = useMemo(() => {
    // console.log('checkedMarkers', checkedMarkers)
    return {
      data: checkedMarkers,
      zIndex: 102,
      onChangeClickData: (event: LeafletEvent, data: any) => {
      }
    }
  }, [checkedMarkers])


  //切换框选工具
  const handleChangeDrawType = (v: DrawType, use?: string) => {
    if (v === 'clear') {
      handleClearLocation()
    }
    //外部使用
    if (use === "outerUse") {
      onChangeDrawTools(v)
    } else {
      setDrawType(v)
    }
  }

  const handleChangeVectorData = (type: DrawType, vector: any) => {
    console.log(type, vector)
    setVectorData(vector ? {
      type,
      ...vector
    } : null)
    setDrawType('default')
  }

  const handleClosePopup = () => {
    setPopupVisible(false)
  }

  const handleRenderMarkersPopup = () => {
    const { lat = '', lng = '' } = clickData.length > 1 ? clickData[0].data : {}
    return <Popup
      visible={popupVisible}
      lat={lat}
      lng={lng}
      width={300}
      xOffset={0}
      yOffset={10}
      onClose={handleClosePopup}
    >
      <div className="location-list">
        {
          clickData.map((elem: any) => {
            const { id, text } = elem.data || {}
            const isChecked = checkedLocationIdsSet.has(id)
            return <div
              key={id}
              className="location-item"
              onMouseDown={() => handleChangeLocationItem(id, isChecked)}
            >
              <Checkbox checked={isChecked}>{text}</Checkbox>
            </div>
          })
        }
      </div>
    </Popup>
  }

  const [expandIds, setExpandIds] = useState<string[]>([])
  const handleExpand = (ids: string[]) => {
    setExpandIds(ids)
  }

  useEffect(() => {
    setPopupVisible(false)
    if (clickData.length === 1) {
      const { id } = clickData[0].data || {}
      let _value = checkedLocationIds
      if (checkedLocationIdsSet.has(id)) {
        _value = checkedLocationIds.filter(elem => elem !== id)
      } else {
        _value = [..._value, id]
      }
      if (!('locationIds' in props)) {
        setCheckedLocationIds(_value)
      }
      formData.current['locationIds'] = _value
      if (onChange && isFunction(onChange)) {
        onChange(formData.current)
      }
    } else if (clickData.length > 1) {
      setPopupVisible(true)
    }
  }, [clickData])

  useEffect(() => {
    if (vectorData) {
      const ids = markerData.filter(elem => {
        const { lat, lng, id } = elem
        return utils.contains(vectorData, lat, lng) && !checkedLocationIdsSet.has(id)
      }).map(elem => elem.id)
      if (ids.length) {
        const _value = [...checkedLocationIds, ...ids]
        if (!('locationIds' in props)) {
          setCheckedLocationIds(_value)
        }
        formData.current['locationIds'] = _value
        if (onChange && isFunction(onChange)) {
          onChange(formData.current)
        }
      } else {
        Message.warning('未选中设备')
      }
    }
  }, [vectorData])

  useUpdateEffect(() => {
    if ("showOperator" in props) {
      console.log('props.showOperator', props.showOperator)
      // 目标检索发生目标类型改变时，重新请求点位树列表接口
      treeStroage.current['region'] = []
      getLocation('region', true)
    }
  }, [props.showOperator])

  // 组件加载完成
  useEffect(() => {
    // 初始化请求有默认值的树接口，展示右侧选中列表，数据有缓存
    if (listType !== 'region') {
      getLocation('region', false)
    }
    if (listType !== 'locationGroup') {
      getLocation('locationGroup', false)
    }
    if (listType !== 'offline') {
      getLocation('offline', false)
    }

    getLocation(listType)

  }, [])

  return (
    <Form.Item className={classNames(prefixCls, className)} colon={false} {...formItemProps}>
      <>
        {showDrawTools && (<div className="outer-draw-tools">
          {
            drawTools.map(elem => {
              const { icon, type } = elem
              return <span
                key={type}
                className={defaultDrawType === type ? "active" : ""}
                onClick={() => handleChangeDrawType(type, "outerUse")}
              >
                <Icon type={icon} />
              </span>
            })
          }
          <span className="draw-tools-text">在右侧地图操作</span>
        </div>)
        }
        <div className={classNames(`${prefixCls}-btn`, { "disabled": disabled }, { "location-map-list-btn-technology": themeType === "technology" })} onClick={handleOpenList}>
          {
            !checkedLocationIds.length && !checkedLocationGroupIds.length && !checkedOfflineIds.length && <div
              className="location-list-tips"
            >
              {buttonTitle}
            </div>
          }
          {
            (!!checkedLocationIds.length || !!checkedLocationGroupIds.length || !!checkedOfflineIds.length) && <div
              className="location-list-count"
            >
              已选择<span>{checkedLocations.length}</span>个点位{checkedOfflineIds.length ? `，${checkedOfflineIds.filter(item => !`${item}`.includes('jobId-')).length}个文件` : ``}
            </div>
          }
        </div>
        <Modal
          className={`${prefixCls}-modal ${showMap ? '' : 'not-map'}`}
          title={title}
          footer={null}
          visible={modalVisible}
          onCancel={handleCloseModal}
        >
          {showMap && <div className={`${prefixCls}-modal-left`}>
            <BaseMap {...mapProps}>
              <div className="draw-tools">
                {
                  drawTools.map(elem => {
                    const { icon, type } = elem
                    return <span
                      key={type}
                      className={drawType === type ? "active" : ""}
                      onClick={() => handleChangeDrawType(type)}
                    >
                      <Icon
                        type={icon}
                      />
                    </span>
                  })
                }
              </div>
              <TileLayer {...tileLayerProps} />
              <Draw
                type={drawType}
                saveVectorType="3"
                saveTime={500}
                onChange={handleChangeVectorData}
              />
              <CityMassMarker
                showCityMarker={cityMassMarker.showCityMarker}
                showMassMarker={cityMassMarker.showMassMarker}
                mapZoom={mapZoom}
                drawType={drawType}
                onChangeDrawType={setDrawType}
                locationIds={checkedLocationIds}
                onChangeLocationIds={(ids: string[]) => {
                  if (!('locationIds' in props)) {
                    setCheckedLocationIds(ids)
                  }
                  formData.current['locationIds'] = ids
                  if (onChange && isFunction(onChange)) {
                    onChange(formData.current)
                  }
                }}
              />
              {/* <MassMarker {...checkedMassMarkerProps} />
              <MassMarker {...unCheckedMassMarkerProps} />
              {handleRenderMarkersPopup()} */}
            </BaseMap>
          </div>}
          <div className={`${prefixCls}-modal-middle`}>
            <Tabs
              className="location-types-tabs"
              activeKey={listType}
              onChange={handleChangeLocationType}
              data={tagTypes}
            />
            <Input
              placeholder="筛选"
              value={filterText}
              onChange={handleChangeFilterText}
              suffix={<span className="check-all" onClick={handleCheckAll}>全选</span>}
              allowClear
            />
            <Loading spinning={treeLoading}>
              <Tree
                className="location-list"
                checkable
                checkedKeys={listType === 'offline' ? checkedOfflineIds : listType === 'locationGroup' ? checkedLocationGroupIds : checkedLocationIds}
                onCheck={handleChangeLocation}
                actionOnClick={"check"}
                treeData={treeData}
                fieldNames={{
                  key: 'id',
                  title: 'text',
                }}
                {...(filterText && {
                  filterNode: filterTreeNode
                })}
                // filterNode={filterTreeNode}
                isVirtual={true}
                renderTitle={handleRenderNodeTitle}
                virtualListProps={{ height: 570 }}
                expandedKeys={expandIds}
                onExpand={handleExpand}
              // autoExpandParent={false}
              // expandOnFilter={false}
              // checkedStrategy={'child'}
              />
            </Loading>
          </div>
          <div className={`${prefixCls}-modal-right`}>
            <div className={`${prefixCls}-modal-right-header`}>
              <span><span className="bold">已选择</span>（ <i>{checkedLocations.length}</i> 个点位{!onlyLocationFlag && (<>；<i className="file">{checkedOfflineIds.filter(item => !`${item}`.includes('jobId-')).length}</i> 个文件</>)} ）</span>
              <span className="del-all" onClick={handleClearList}>清空</span>
            </div>
            <div className={`${prefixCls}-modal-right-list`}>
              {renderCheckedList()}
            </div>
            <div className={`${prefixCls}-modal-right-btn`}>
              <Button onClick={handleCloseModal} type="primary">确定</Button>
            </div>
          </div>
        </Modal>
      </>
    </Form.Item>
  )
}

export default LocationMapList
