import Title from '../Title'
import { Modal, Loading, Message, Pagination } from '@yisa/webui'
import noDataDark from '@/assets/images/image/search-nodata-dark.png'
import noDataLight from '@/assets/images/image/search-nodata-light.png'
import { Icon } from '@yisa/webui/es/Icon'
import { Card, FormPlate, BottomRight } from '@/components'
import services, { ApiResponse } from "@/services";
import { useEffect, useRef, useState } from 'react'
import type { PaginationProps } from "@yisa/webui/es/Pagination/interface";
import dictionary from "@/config/character.config";
import { PlateTypeId, PlateProps, BaseInfoProps, FormData, CarData } from '../interface'
import { RootState, useSelector, useDispatch } from '@/store'
import { changeEditSattus } from '@/store/slices/editStatus';
import './index.scss'
const CarList = (props: BaseInfoProps) => {
  const {
    title = '基本信息',
    type = 'phone',
    hasEditBtn = true,
    showPagination = true,
    data,
    handleChangeTabKey,
    personInfoData = {}
  } = props
  const prefixCls = 'baseinfo-carlist'

  const { skin } = useSelector((state: RootState) => state.comment)
  const dispatch = useDispatch()
  // 查询基本信息是否是编辑状态
  const editStatus = useSelector<RootState, boolean>(
    (state) => state.editStatus.status
  );

  // 结果数据
  const [resultData, setResultData] = useState<ApiResponse<CarData[]>>({
    data: [],
    status: 0,
    message: ''
  })
  const resultDataRef = useRef<ApiResponse<CarData[]>>({})

  const [ajaxLoading, setAjaxLoading] = useState<boolean>(false)
  const [pageData, setPageData] = useState({
    pageNo: 1,
    pageSize: dictionary.pageSizeOptions[0]
  })
  const [currentData, setCurrentData] = useState<CarData>()

  const [carinfoLoading, setCarInfoLoading] = useState(false)

  // 获取名下车辆
  const getUnderCar = (page: { pageNo: number, pageSize: number } = pageData) => {
    setAjaxLoading(true)
    services.record.getDetailUnderCar<FormData, CarData[]>(data)
      .then(res => {
        setAjaxLoading(false)
        setResultData(res)
        resultDataRef.current = res
      })
      .catch(err => {
        setAjaxLoading(false)
      })
  }

  // 编辑名下车辆
  const changeUnderCar = () => {
    console.log(resultData.data, 'data');
    setAjaxLoading(true)
    services.record.changeDetailUnderCar<any, CarData[]>({
      updateData: resultData.data || [],
      ...data,
      name: personInfoData.name || '',
    })
      .then(res => {
        setAjaxLoading(false)
        Message.success(res.message || '')
        // 编辑之后再获取一次
        // getUnderCar()
        if (res.data) {
          setAjaxLoading(false)
          setResultData(res)
          resultDataRef.current = res
        }
      })
      .catch(err => {
        setAjaxLoading(false)
      })
  }

  // 添加车辆
  const addUnderCar = () => {
    setCarInfoLoading(true)
    services.record.getCarInfo<{ idNumber: string, idType: string, plateColor: PlateTypeId, licensePlate: string }, CarData>({
      idNumber: data.idNumber,
      idType: data.idType,
      licensePlate: plateData.plateNumber,
      plateColor: plateData.plateTypeId
    })
      .then(res => {
        setCarInfoLoading(false)
        if (res.data) {
          let data = resultData.data || []
          setResultData(Object.assign({}, resultData, {
            data: [{ ...res.data, action: 'insert', type: 'add' }, ...data]
          }))
        }
      }).catch(err => {
        setCarInfoLoading(false)
      })

  }
  //驾乘车辆
  const getTransportCarData = (page: any = pageData) => {
    setAjaxLoading(true)
    services.record.getTransportCarData<any, CarData[]>({ ...data, ...page })
      .then(res => {
        setAjaxLoading(false)
        setResultData(res)
        resultDataRef.current = res
      })
      .catch(err => {
        setAjaxLoading(false)
      })
  }
  //违法车辆
  const getViolationCarData = (page: any = pageData) => {
    setAjaxLoading(true)
    services.record.getViolationCarData<any, CarData[]>({ ...data, ...page })
      .then(res => {
        setAjaxLoading(false)
        setResultData(res)
        resultDataRef.current = res
      })
      .catch(err => {
        setAjaxLoading(false)
      })
  }
  useEffect(() => {
    // 获取卡片数据
    if (type == 'under') {
      getUnderCar()
    } else if (type == 'transport') {
      getTransportCarData()
    } else {
      // getViolationCarData()
    }
  }, [])

  /* ************* 具有编辑效果的车辆卡片事件**************/
  // 是否编辑状态
  const [isEdit, setIsEdit] = useState(false)
  const defaultPlateData: PlateProps = {
    plateTypeId: 5,
    plateNumber: '',
    noplate: ''
  }
  const handleEdit = () => {
    if (editStatus) {
      Message.warning('请对编辑信息进行保存！')
      return
    }
    dispatch(changeEditSattus(true))
    setIsEdit(true)
  }
  // 取消编辑
  const handleCancel = () => {
    dispatch(changeEditSattus(false))
    setIsEdit(false)
    setPlateData(defaultPlateData)
    setResultData(resultDataRef.current)
  }

  // 保存编辑状态
  const handleSave = () => {
    if (carinfoLoading) {
      Message.warning("请等待车辆信息获取")
      return
    }
    dispatch(changeEditSattus(false))
    setIsEdit(false)
    setPlateData(defaultPlateData)
    // TODO:保存用户操作
    changeUnderCar()
  }
  // 编辑车牌数据
  const [plateData, setPlateData] = useState<PlateProps>(defaultPlateData)

  // 添加车辆数据-modal
  const [addVisible, setAddVisible] = useState(false)

  // 删除名下车辆
  const handleDeleteCar = (item: CarData, index: number) => {
    setAjaxLoading(true)
    if (resultData.data) {
      // let data = resultData.data && resultData.data.filter((ele: any) => ele.key !== item.key)
      let newData = resultData.data ? resultData.data.filter((ele: CarData, i: number) => i !== index || ele.type !== 'add') : []
      let newResultData: ApiResponse<CarData[]> = {
        data: []
      }
      // 判断是新增数据还是在原数据上进行删除
      if (newData.length == resultData.data.length) {
        let data = newData.map((ele, i: number) => {
          if (i == index) {
            return { ...ele, action: 'delete', feature: '' }
          }
          return ele
        })
        newResultData = Object.assign({}, resultData, {
          data: data
        })
      } else {
        newResultData = Object.assign({}, resultData, {
          data: newData
        })
      }
      setResultData(newResultData)
    }
    setTimeout(() => {
      setAjaxLoading(false)
    }, 200)
  }

  // 添加车牌
  const handleAddPlate = () => {
    if (plateData.plateNumber.length < 6) {
      Message.warning('请输入长度大于6位的车牌')
      return
    }
    setAddVisible(false)
    setPlateData(defaultPlateData)
    addUnderCar()
  }
  // 取消添加车牌modal
  const handleCancelAddPlate = () => {
    setAddVisible(false)
    setPlateData(defaultPlateData)
  }
  // 车牌变化
  const handleChangePlate = (value: PlateProps) => {
    setPlateData({ ...value })
  }
  /*  ************* end ************* */

  // 地图
  const [bottomRightMapVisible, setBottomRightMapVisible] = useState(false)

  const onCaptureClick = (data: CarData) => {
    handleChangeTabKey && handleChangeTabKey('portrait', { type: 'vehicle', plateData: { licensePlate: data.licensePlate, plateColorTypeId: data.plateColor } })
  }
  // 动态展示每行数据
  const [listCount, setListCount] = useState(4)
  useEffect(() => {
    const calcListCount = () => {
      const itemWidth = 380
      const width = (document.querySelector('.car-lists')?.clientWidth || 0) - 126 // 126为总间距
      const count = Math.floor(width / itemWidth)
      if (count >= 4 || count <= 2) {
        setListCount(count < 0 ? 4 : count)
      } else {
        const diff = width - itemWidth * count + 18 * (count - 1)
        if (diff >= itemWidth * (count / (count + 1))) {
          setListCount(count + 1)
        } else {
          setListCount(count)
        }
      }
    }
    calcListCount()
    window.addEventListener('resize', calcListCount)

    return () => {
      window.removeEventListener('resize', calcListCount)
    }
  }, [])
  // 渲染车辆卡片
  const handleRenderCard = () => {
    const { data = [] } = resultData
    let template = []
    for (let i = 0; i < data.length; i = i + listCount) {
      let _template = []
      for (let j = i; j < i + listCount; j++) {
        if (j < data.length) {
          if (data[j].action != 'delete') {
            _template.push(
              <Card.CarInfo
                key={data[j].key}
                type={type}
                cardData={data[j]}
                showDelete={hasEditBtn && isEdit}
                handleDelete={() => handleDeleteCar(data[j], j)}
                onCaptureClick={() => onCaptureClick(data[j])}
                onLocationClick={() => {
                  setBottomRightMapVisible(true)
                  setCurrentData(data[j])
                }}
              />
            )
          }
        } else {
          _template.push(<div className="card-item-flex" key={j + 'flex'} />)
        }
      }
      template.push(<div className="result-card-list-row" key={i}>{_template}</div>)
    }
    return template
  }

  // 分页切换
  const handlePageChange: PaginationProps["onChange"] = (current, pageSize) => {
    let newFormData;
    if (pageSize !== pageData.pageSize) {
      // console.log("pageSize", current, pageSize);
      newFormData = {
        ...pageData,
        pageNo: 1,
        pageSize: pageSize,
      };
    } else {
      // 页号改变
      console.log("page", current, pageSize);
      newFormData = {
        ...pageData,
        pageNo: current,
        pageSize: pageSize,
      };
    }
    setPageData(newFormData)
    if (type == 'under') {
    } else if (type == 'transport') {//驾乘车辆
      getTransportCarData(newFormData)
    } else {//违法车辆

    }
  };
  // 分页配置
  const paginationConfig: PaginationProps = {
    current: pageData.pageNo,
    pageSize: pageData.pageSize,
    total: resultData.totalRecords,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: dictionary.pageSizeOptions,
    onChange: handlePageChange,
  };

  if (!hasEditBtn && !resultData.data?.length) {
    if (!data.idNumber) {
      return <div className={`${prefixCls}-result-nodata`}>
        <img src={skin === "dark" ? noDataDark : noDataLight} alt="" />
        <div> 暂无数据</div>
      </div>
    }
    return null
  }
  return <div className={`${prefixCls}`}>
    <Title
      title={title}
      hasEditBtn={hasEditBtn}
      isEdit={isEdit}
      handleAdd={() => setAddVisible(true)}
      handleSave={handleSave}
      handleCancel={handleCancel}
      handleEdit={handleEdit}
      type="add"
    />
    <div className={`car-lists ${type == 'under' ? 'under-car-lists' : ''}`}>
      {
        ajaxLoading
          ? <div className="ajax-loading">
            <Loading spinning={true} />
          </div>
          : (resultData.data && resultData.data.length)
            ? type == 'under'
              ? resultData.data.filter(ele => ele.action != 'delete').length
                ? resultData.data.map((ele: CarData, index: number) => {
                  if (ele.action != 'delete') {
                    return <Card.CarInfo
                      key={ele.key}
                      type={type}
                      cardData={ele}
                      showDelete={hasEditBtn && isEdit}
                      handleDelete={() => handleDeleteCar(ele, index)}
                      onCaptureClick={() => onCaptureClick(ele)}
                      onLocationClick={() => {
                        setBottomRightMapVisible(true)
                        setCurrentData(ele)
                      }}
                    />
                  }
                })
                : <div className="result-nodata">
                  <Icon type="zanwushujuqianse" />
                  <div> 这里什么都没有......</div>
                </div>
              : handleRenderCard()
            : <div className="result-nodata">
              <Icon type="zanwushujuqianse" />
              <div> 这里什么都没有......</div>
            </div>
      }
    </div>
    {
      showPagination && (!isEdit && (resultData.data && resultData.data.length)) ?
        <div className="car-pagination">
          <Pagination disabled={ajaxLoading} {...paginationConfig} simple />
        </div>
        : null
    }
    <Modal
      title='请添加名下车辆'
      className={`${prefixCls}-add-plate-modal`}
      visible={addVisible}
      onOk={handleAddPlate}
      onCancel={handleCancelAddPlate}
      width={630}
    >
      <div className="add-plate">
        <div className="plate-label">车牌号码:</div>
        <FormPlate
          remind=""
          isDisableNoLimit={true}
          className="deploy-item-content"
          isShowKeyboard
          onChange={handleChangePlate}
          value={{
            plateTypeId: (plateData.plateTypeId || 5),
            plateNumber: plateData.plateNumber || '',
            noplate: ''
          }} />
      </div>
    </Modal>
    {
      bottomRightMapVisible &&
      <BottomRight
        name={currentData?.locationName || '--'}
        lat={currentData?.lngLat?.lat || null}
        lng={currentData?.lngLat?.lng || null}
        onClose={() => { setBottomRightMapVisible(false) }}
      />
    }
  </div>
}
export default CarList
