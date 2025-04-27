import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Form, Modal, Tree, VirtualList, Input, Message, Space, Tabs, Checkbox, Loading, Divider, Button } from '@yisa/webui'
import { Icon, LoadingOutlined, PlusOutlined, ExclamationCircleFilled } from '@yisa/webui/es/Icon'
import { ErrorImage } from '@yisa/webui_business'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { TimeRangePicker } from '@/components'
import dictionary from '@/config/character.config'
import ajax, { ApiResponse } from '@/services'
import { NodeInstance, NodeProps } from "@yisa/webui/es/Tree/interface";
import { TargetFeatureItem } from "@/config/CommonType";
import { DatesParamsType } from "@/components/TimeRangePicker/interface";
import LocationMapListProps, { LocationListType, LocationData, LocationMapListCallBack, OfflineData } from "@/components/LocationMapList/interface";
import ImgUploadProps, { UploadButtonProps } from "@/components/ImgUpload/interface";
import GaitUploadProps, { GaitFormDataType } from './interface'
import targetNodataLightPng from '@/assets/images/image/target-nodata-light.png'
import targetNodataDarkPng from '@/assets/images/image/target-nodata-dark.png'
import './index.scss'
import { ResultRowType } from '@/pages/Search/Target/interface'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
const { featureTypeToText, tagTypes, gaitParams } = dictionary

function UploadButton(props: UploadButtonProps) {
  const { load, innerSlot } = props
  return (
    <>
      {
        load ?
          <LoadingOutlined />
          :
          innerSlot ?
            typeof innerSlot == 'function' ? innerSlot() : innerSlot
            :
            <>
              <PlusOutlined />
              <div className="upload-text">上传目标</div>
            </>
      }
    </>
  )
}

export default function GaitModalBtn(props: GaitUploadProps) {

  const {
    limit = 5,
    innerSlot,
    className,
    defaultListType = 'region',
    disabled = false,
    featureList = [],
    onChange
  } = props
  const prefixCls = 'gait-modal-btn'
  const limitTime = 30
  const skin = useSelector((state: RootState) => {
    return state.comment.skin
  });
  //点位与离线任务不共用时间
  const [gaitFormData, setGaitFormData] = useState<GaitFormDataType>({
    isGait: 1,
    timeType: 'time',
    beginDate: dayjs().subtract(6, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    offlineBeginDate: '',
    offlineEndDate: '',
    checkedLocationIds: [],
    checkedLocationGroupIds: [],
    checkedOfflineIds: [],
    pageNo: 1,
    pageSize: 200,
    sort: {
      field: dictionary.yituSort[1].value,
      order: dictionary.yituSort[0].order,
    },
  })
  const [ajaxLoading, setAjaxLoading] = useState(false)
  //已经选择的步态目标
  const [selectedGaitList, setSelectedGaitList] = useState<ResultRowType[]>(featureList)
  //右侧步态结果数据
  const [gaitData, setGaitData] = useState<ApiResponse<ResultRowType[]>>({})  //TargetFeatureItem

  const [filterText, setFilterText] = useState('')
  const [modalVisible, setModalVisible] = useState(false)

  const [listType, setListType] = useState<LocationListType>(defaultListType)     // region: 地区；locationGroup：设备组；offline 离线任务
  const [treeLoading, setTreeLoading] = useState(false)
  //离线类型
  const [curImageOfflineTab, setCurImageOfflineTab] = useState(dictionary.imageOfflineTabs[0].value)
  // const [curImageOfflineTab, setCurImageOfflineTab] = useState(dictionary.imageOfflineTabs[1].value)
  //上传情况
  const [uploadState, setUploadState] = useState<Record<string, number>>({
    uploadProgress: 100,
    analysisProgress: 0,
    gaitNumber: 0,
  })
  // 文件上传
  const $fileUpload = useRef<HTMLInputElement>(null)

  // 树状数据暂存，防止每次切换都重新请求
  const treeStorage = useRef<{
    region: LocationData[]
    locationGroup: LocationData[]
    offline: OfflineData[]
  }>({
    region: [],
    locationGroup: [],
    offline: []
  })
  const [treeData, setTreeData] = useState<LocationData[]>([]) // 正在显示的点位数据
  const [locationData, setLocationData] = useState<LocationData[]>([])
  const [offlineData, setOfflineData] = useState<LocationData[]>([])

  //筛选数据
  const filterTreeNode = useCallback((node: NodeProps) => {
    // 关键词通过空格/逗号/分号分割，可能会有多个
    const pattern = /[\s,;，；]+/;
    const keywords = filterText.split(pattern);

    return keywords.every(key => (node.title as string)?.includes(key));
  }, [filterText])

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
  const handleRenderNodeTitle = (node: NodeProps) => {
    return highlight((node.dataRef?.text || ''), filterText)
  }

  //获取点位(工具)
  const getLocation = async (type: LocationListType, changeTree: boolean = true) => {
    setTreeLoading(true)

    if (treeStorage.current[type].length) {
      setTreeLoading(false)
      changeTree && setTreeData(treeStorage.current[type])
      return
    }

    let data: any[] = []

    if (type === 'region') { // 区域点位
      const res = await ajax.location.getLocationList<{ [key: string]: string }, LocationData[]>({
        needType: "1",
        typeId: "1,2,3,4",
      })
      data = res.data || []
    } else if (type === 'locationGroup') { // 点位组
      const res = await ajax.location.getLocationList<{ [key: string]: string }, LocationData[]>({
        needType: "2",
        typeId: "1,2,3,4",
      })
      data = res.data || []
    } else if (type === 'offline') { // 离线任务
      const res = await ajax.offline.getAllOfflineFile<{}, OfflineData[]>()
      data = handleOfflineData(res.data || [])
      setOfflineData(flatOfflineData(data, 'offline'))
    }
    setTreeLoading(false)
    changeTree && setTreeData(data || [])
    treeStorage.current[type] = data || []
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
    setModalVisible(true)
  }
  const handleCloseModal = () => {
    setModalVisible(false)
  }
  //切换tab
  const handleChangeLocationType = (key: string) => {
    const thisType = (key as LocationListType)
    setListType(thisType)
    setCurImageOfflineTab(dictionary.imageOfflineTabs[0].value)
    // setCurImageOfflineTab(dictionary.imageOfflineTabs[1].value)
    getLocation(thisType)
  }
  //处理输入框
  const handleChangeFilterText = (e: any) => {
    setFilterText(e.target.value)
  }
  //点击树节点复选框的回调
  const handleChangeLocation = (ids: string[], {
    checkedNodes
  }: { checkedNodes: NodeInstance[] }) => {
    // console.log(_)
    // @ts-ignore
    // const ids = checkedNodes.filter(node => !('scale' in node.props)).map(node => node.props.id)
    // console.log(ids)
    if (listType === 'offline') {
      if (!('offlineIds' in props)) {
        // setCheckedOfflineIds(ids)
        console.log(ids)
        setGaitFormData({ ...gaitFormData, checkedOfflineIds: ids })
      }
    } else if (listType === 'locationGroup') {
      if (!('locationGroup' in props)) {
        setGaitFormData({ ...gaitFormData, checkedLocationGroupIds: ids })
      }
    } else {
      if (!('locationIds' in props)) {
        setGaitFormData({ ...gaitFormData, checkedLocationIds: ids })
      }
    }
    // const fieldName = listType === 'region' ? 'locationIds' : listType === 'locationGroup' ? 'locationGroupIds' : 'offlineIds'

    // formData.current[fieldName] = ids
  }
  //清空列表
  const handleClearList = () => {
    setGaitFormData({ ...gaitFormData, checkedLocationIds: [], checkedLocationGroupIds: [], checkedOfflineIds: [] })
  }
  //日期收集
  const handleDateChange = (dates: DatesParamsType, type: string) => {
    console.log(dates)
    switch (type) {
      case "offline":
        setGaitFormData({
          ...gaitFormData,
          timeType: dates.timeType,
          offlineBeginDate: dates.beginDate,
          offlineEndDate: dates.endDate,
        })
        break;
      case "locationId":
        setGaitFormData({
          ...gaitFormData,
          timeType: dates.timeType,
          beginDate: dates.beginDate,
          endDate: dates.endDate,
        })
        break;
      default:
        Message.warning("未知的时间类型")
        break;
    }
  }
  //选择目标
  const handleSelectedGaitList = (item: ResultRowType, index: number) => {
    if (gaitData.data) {
      const { isChecked, feature } = gaitData.data[index]
      let _gaitDataList: ResultRowType[]
      if (!isChecked) {
        if (selectedGaitList.length >= gaitParams.maxSelectedNumber) {
          Message.warning(`步态目标最多选择${gaitParams.maxSelectedNumber}个`)
          return
        }
        _gaitDataList = [...selectedGaitList, gaitData.data[index]]
        setSelectedGaitList(_gaitDataList)
      } else {
        _gaitDataList = selectedGaitList.filter(item => item.feature !== feature)
        setSelectedGaitList(_gaitDataList)
      }
      gaitData.data[index].isChecked = !isChecked
      setGaitData({ ...gaitData, data: [...gaitData.data] })
      onChange && onChange(_gaitDataList)
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

  const handleFilterTreeData = () => {
    let result = filterDataHandle(treeData)
    return result
  }

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

  //删除目标
  const handleDelTargetFeature = (infoId: string) => {
    //区分是检索出来的，还是拖拽上去的
    const _index = gaitData?.data?.findIndex(item => item.infoId === infoId)
    if (_index !== undefined && _index > -1 && gaitData.data) {
      gaitData.data[_index].isChecked = false
      setGaitData({ ...gaitData, data: [...gaitData.data] })
    }
    const newFeatureList = selectedGaitList.filter(item => item.infoId !== infoId)
    setSelectedGaitList(newFeatureList)
    if (onChange) {
      onChange(newFeatureList)
    }
  }

  // 全选
  const handleCheckAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    let nowData = (filterText.trim() ? handleFilterTreeData() : treeData);
    // let ids = flatTreeData(nowData).filter(item => !item?.scale).map(item => item.id)

    // 选中不过滤父级id，不然会导致没有子级的无法选中
    let ids = flatTreeData(nowData).map(item => item.id)


    if (listType === 'offline') {
      if (!('offlineIds' in props)) {
        setGaitFormData({ ...gaitFormData, checkedOfflineIds: ids })
      }
    } else if (listType === 'locationGroup') {
      if (!('locationGroup' in props)) {
        setGaitFormData({ ...gaitFormData, checkedLocationGroupIds: ids })

      }
    } else {
      if (!('locationIds' in props)) {
        setGaitFormData({ ...gaitFormData, checkedLocationIds: ids })
      }
    }

  }
  //格式化请求参数
  const formFormat = (form: GaitFormDataType) => {
    let newForm = { ...form }
    // 格式化日期参数
    let timeRange = {}
    if (form.timeType === 'time') {
      timeRange = { times: [form.beginDate, form.endDate] }
    } else {
      timeRange = {
        periods: {
          dates: [form.beginDate, form.endDate],
          times: [form.beginTime, form.endTime]
        }
      }
    }
    newForm['timeRange'] = timeRange
    // 点位和文件ids
    newForm['locationIds'] = [...form.checkedLocationIds, ...form.checkedLocationGroupIds]
    // 过滤掉checkedOfflineIds中的任务id
    newForm['fileId'] = form.checkedOfflineIds.filter(item => !`${item}`.includes('jobId-'))
    // 公共参数删减，不必要的删除
    const delKeys = ["timeType", "beginDate", "endDate", "beginTime", "endTime", "checkedLocationIds", "checkedLocationGroupIds", "checkedOfflineIds"]
    delKeys.forEach(key => delete newForm[key])
    return newForm
  }
  //检索
  const handleGaitSearch = async () => {
    const { checkedLocationIds, checkedLocationGroupIds, checkedOfflineIds } = gaitFormData
    if (!checkedLocationIds.length && !checkedLocationGroupIds.length && !checkedOfflineIds.length) {
      Message.warning("请选择点位或者文件")
      return
    }
    //检索之前先清空
    setSelectedGaitList([])
    onChange && onChange([])
    try {
      setAjaxLoading(true)
      const _newForm = formFormat(gaitFormData)
      const res = await ajax.getGaitData<GaitFormDataType, ResultRowType[]>(_newForm)
      Array.isArray(res.data) && setGaitData(res)
      setAjaxLoading(false)
    } catch (error) {
      Message.warning((error as any).message)
      setAjaxLoading(false)
    }
  }

  const handleTabsChange = (key: string) => {
    setCurImageOfflineTab(key)
  }

  // 上传区域点击
  const handleUploadClick = () => {
    $fileUpload.current?.click()
  }
  //处理上传视频
  const handleAddFile = (files: FileList | null) => {
    if (!files?.length) return;
    if (!/video\/*/.test(files[0].type)) {
      Message.warning("请上传正确的视频格式")
      return
    }
    const file = files[0]
    if (file) {
      const _URL = window.URL || window.webkitURL;
      const videoElement = document.createElement("video");
      videoElement.src = _URL.createObjectURL(file);
      // 当指定的音频/视频的元数据已加载时，会发生 loadedmetadata 事件。 元数据包括：时长、尺寸（仅视频）以及文本轨道。
      videoElement.addEventListener("loadedmetadata", _event => {
        const duration = videoElement.duration; // 视频时长
        if (duration <= limitTime) {
          //此处进行上传逻辑处理
          let formData = new FormData();
          formData.append("file", file);
          formData.append("type", "file");
          setAjaxLoading(true)
          ajax.getGaitData<FormData, ResultRowType[]>(formData
            // ,"http://localhost:8844/stream"
            ).then(res => {
            Array.isArray(res.data) && setGaitData(res)
            setAjaxLoading(false)
          }).catch(err => {
            setAjaxLoading(false)
          })
        } else {
          Message.warning(`上传视频不能超过${limitTime}秒！`);
        }
        _URL.revokeObjectURL(videoElement.src)
      });
    }
  }
  // 区域拖拽
  const handleUploadDragover = (event: React.DragEvent) => {
    event.stopPropagation()
    event.preventDefault();
  }
  // 区域拖拽结束
  const handleUploadDrop = (event: React.DragEvent) => {
    event.stopPropagation()
    event.preventDefault();
    handleAddFile(event.dataTransfer.files)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // const file = event.target.files?.[0
    console.log(event)
    handleAddFile(event.target.files)
    event.target.value = ''
  }

  // 组件加载完成
  useEffect(() => {
    getLocation(listType)
  }, [])

  useEffect(() => {
    //筛选出新添加的哪一个，给选中状态和总量数据中都加上
    // const newFeature = featureList.find(item => !selectedGaitList.includes(item))
    // if(){

    // }else{

    // }
    setSelectedGaitList(featureList)
  }, [featureList])


  return (
    <div className={classNames(prefixCls, className)}>
      <div className={`${prefixCls}-wrapper`}>
        <ul className={`${prefixCls}-feature-list`}>
          {
            selectedGaitList.map(item => {
              const { gaitFeature, targetImage, targetType, infoId, isGait = false } = item
              return (
                <li key={infoId}>
                  {targetType && <span className="feature-type-tip">{featureTypeToText[isGait ? "gait" : targetType]}</span>}
                  {
                    !disabled ?
                      <span className='del-target' onClick={() => handleDelTargetFeature(infoId || "")}>
                        <Icon type='lajitong' />
                      </span> :
                      <></>
                  }
                  <ErrorImage src={targetImage} />
                </li>
              )
            })
          }
        </ul>
        {
          selectedGaitList.length < limit && (
            <div className={`${prefixCls}-slot`} onClick={handleOpenList}>
              <UploadButton innerSlot={innerSlot} />
            </div>)
        }
      </div>
      <Modal
        className={`${prefixCls}-modal`}
        title={`上传目标`}
        footer={null}
        visible={modalVisible}
        onCancel={handleCloseModal}
      >
        <div className={`${prefixCls}-modal-tip`}>
          <ExclamationCircleFilled />
          <span>注：本地视频文件需完成<i>离线分析</i>后再应用。</span>
        </div>
        <div className={`${prefixCls}-modal-wrapper`}>
          <div className={`${prefixCls}-modal-left`}>
            <Tabs
              className="location-types-tabs"
              activeKey={listType}
              onChange={handleChangeLocationType}
              data={tagTypes}
            />
            <Divider />
            {listType === "offline" && <Tabs
              className="offline-tabs"
              type="line"
              data={dictionary.imageOfflineTabs
                // .slice(1)
                .map(item => ({ key: item.value, name: item.label }))}
              activeKey={curImageOfflineTab}
              onChange={handleTabsChange}
            />
            }
            {
              listType === "offline" && curImageOfflineTab === "upload" ?
                <div
                  className="upload-area"
                >
                  <input
                    type="file"
                    style={{ display: "none" }}
                    ref={$fileUpload}
                    accept="video/*,.mbf"
                    onChange={handleFileChange}
                  />
                  <div
                    className="upload-btn"
                    onClick={handleUploadClick}
                    onDragOver={handleUploadDragover}
                    onDrop={handleUploadDrop}
                  >
                    <span>+</span>
                    <span>添加视频文件</span>
                  </div>
                  <div className="upload-tip">
                    <p>上传文件说明：</p>
                    <p>1、视频时长不大于30秒；</p>
                    <p>2、支持AVI、MP4、MPG、MOV、VOB、WMV、FLV、RMVB、MBF等视频装封格式。</p>
                  </div>
                </div>
                :
                <>
                  <Input
                    placeholder="筛选"
                    value={filterText}
                    onChange={handleChangeFilterText}
                    suffix={<span className="check-all" onClick={handleCheckAll}>全选</span>}
                    allowClear
                  />
                  <div className={`${prefixCls}-modal-left-header`}>
                    <span><span className="bold">已选择</span>（ <i>{gaitFormData.checkedLocationIds.length + gaitFormData.checkedLocationGroupIds.length}</i> 个点位；<i className="file">{
                      gaitFormData.checkedOfflineIds.filter(item => !`${item}`.includes('jobId-')).length
                    }</i> 个文件）</span>
                    <span className="del-all" onClick={handleClearList}>清空</span>
                  </div>
                  <Loading spinning={treeLoading}>
                    <Tree
                      className="location-list"
                      checkable
                      checkedKeys={listType === 'offline' ? gaitFormData.checkedOfflineIds : listType === 'locationGroup' ? gaitFormData.checkedLocationGroupIds : gaitFormData.checkedLocationIds}
                      onCheck={handleChangeLocation}
                      actionOnClick={"check"}
                      treeData={treeData}
                      fieldNames={{
                        key: 'id',
                        title: 'text',
                      }}
                      filterNode={filterTreeNode}
                      renderTitle={handleRenderNodeTitle}
                      isVirtual={true}
                      virtualListProps={{ height: listType === "offline" ? 400 : 450 }}
                      checkedStrategy={'child'}
                    />
                  </Loading>
                  <div className={`${prefixCls}-modal-left-footer`}>
                    <Divider className={`divider-footer`} />
                    {
                      listType === "offline" ? <TimeRangePicker
                        showTimeType={false}
                        formItemProps={{ label: <span className="prefix">时间范围</span> }}
                        beginDate={gaitFormData.offlineBeginDate}
                        endDate={gaitFormData.offlineEndDate}
                        // beginTime={gaitFormData.offline_beginTime}
                        // endTime={gaitFormData.offline_endTime}
                        onChange={(date: DatesParamsType) => { handleDateChange(date, "offline") }}
                      />
                        :
                        <TimeRangePicker
                          showTimeType={false}
                          formItemProps={{ label: <span className="prefix">时间范围</span> }}
                          beginDate={gaitFormData.beginDate}
                          endDate={gaitFormData.endDate}
                          // beginTime={gaitFormData.beginTime}
                          // endTime={gaitFormData.endTime}
                          onChange={(date: DatesParamsType) => { handleDateChange(date, "locationId") }}
                        />
                    }
                    <div className={`${prefixCls}-modal-left-search`}>
                      <Button loading={ajaxLoading} onClick={handleGaitSearch} type="primary">获取目标</Button>
                    </div>
                  </div>
                </>
            }

          </div>
          <div className={`${prefixCls}-modal-right`}>
            <div className={`${prefixCls}-modal-right-header`}>
              <b className="bold">选择目标</b><span>(最多可展示<i>{gaitParams.maxDisplayNumber}</i>个目标，可选择<i className="gait-target">{gaitParams.maxSelectedNumber}</i>个)</span>
            </div>
            {
              gaitData?.data?.length ? <div className={`${prefixCls}-modal-right-selected`}>
                <span>共<em>{gaitData?.data?.length}</em>个目标，已选择<em>{selectedGaitList.length}</em>个</span>
              </div>
                : ""
            }
            <div className={`${prefixCls}-modal-right-list`}>
              {
                gaitData?.data?.length ? (
                  <Loading spinning={ajaxLoading} tip="请求数据中......">
                    <ul className="container">
                      {
                        gaitData.data.map((item, index) => <li
                          key={index}
                          className="container-item"
                          onClick={() => { handleSelectedGaitList(item, index) }}>
                          <div className="content">
                            <Checkbox checked={item.isChecked} ></Checkbox>
                            <span ><Icon type="butai" />{item?.gaitObjectNumber || 0}</span>
                            <ErrorImage src={item.targetImage} />
                          </div>
                        </li>)
                      }
                    </ul>
                  </Loading>)
                  :
                  ajaxLoading
                    ?
                    <Loading className="nodata" spinning={ajaxLoading} tip="请求数据中......"></Loading>
                    :
                    <div className="nodata">
                      <img src={skin === "dark" ? targetNodataDarkPng : targetNodataLightPng} alt="暂无数据" />
                      <div>暂无数据</div>
                    </div>
              }
            </div>
            <div className={`${prefixCls}-modal-right-btn`}>
              {gaitData.data?.length ? <Button loading={ajaxLoading} onClick={handleCloseModal} type="primary">确定</Button> : ""}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
