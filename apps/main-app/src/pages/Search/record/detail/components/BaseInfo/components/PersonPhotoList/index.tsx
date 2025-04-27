
import Title from '../Title'
import { Card } from '@/components'
import { Message, Loading } from '@yisa/webui'
import { useState, useEffect, useRef } from 'react'
import services, { ApiResponse } from "@/services";
import { Icon } from '@yisa/webui/es/Icon'
import { Method, PhotoData, BaseInfoProps, FormData } from '../interface'
import { UserInfoState } from "@/store/slices/user";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { changeEditSattus } from '@/store/slices/editStatus';
import dayjs from 'dayjs'
import './index.scss'

const PersonPhotoList = (props: BaseInfoProps) => {
  const {
    title = '基本信息',
    type = 'phone',
    hasEditBtn = true,
    data,
    personInfoData = {}
  } = props

  const prefixCls = 'baseinfo-photolist'
  // 查询用户信息
  const userInfo = useSelector<RootState, UserInfoState>(
    (state) => state.user.userInfo
  );
  const dispatch = useDispatch()
  // 查询基本信息是否是编辑状态
  const editStatus = useSelector<RootState, boolean>(
    (state) => state.editStatus.status
  );

  // 证件照数据
  const [resultData, setResultData] = useState<ApiResponse<PhotoData[]>>({
    data: []
  })
  const resultDataRef = useRef<ApiResponse<PhotoData[]>>({
    data: []
  })
  // 缓存初始证件照数据
  const initResultDataRef = useRef<ApiResponse<PhotoData[]>>({
    data: []
  })
  // 获取证件照
  const getDetailPhotoLists = (type: Method = 'get') => {
    setAjaxLoading(true)
    services.record.getDetailPhotoLists<FormData, PhotoData[]>(data)
      .then(res => {
        setAjaxLoading(false)
        setResultData(res)
        resultDataRef.current = res
        initResultDataRef.current = res
      })
      .catch(err => {
        setAjaxLoading(false)
      })
  }
  // 编辑证件照
  const changeDetailPhotoLists = () => {
    setAjaxLoading(true)
    services.record.changeDetailPhoto<{ updateData: { photos: PhotoData[], idNumber: string, deleteLabels: string[], isLabelUpdate: number, action: string, idType: string } }, PhotoData[]>({
      updateData: {
        ...personInfoData,
        idType: data?.idType,
        idNumber: data?.idNumber,
        photos: resultData.data || [],
        deleteLabels: [],
        isLabelUpdate: 0,
        action: 'update'
      }
    })
      .then(res => {
        Message.success('编辑成功')
        setAjaxLoading(false)
        // getDetailPhotoLists()
        if (res.data) {
          setResultData(res)
          resultDataRef.current = res
          initResultDataRef.current = res
        }
      })
      .catch(err => {
        console.log(err);
        setAjaxLoading(false)
        setResultData(initResultDataRef.current)
        resultDataRef.current = initResultDataRef.current
      })
  }

  useEffect(() => {
    getDetailPhotoLists()
  }, [])

  const [ajaxLoading, setAjaxLoading] = useState<boolean>(false)

  // 是否编辑状态
  const [isEdit, setIsEdit] = useState(false)

  const handleEdit = () => {
    if (editStatus) {
      Message.warning('请对编辑信息进行保存！')
      return
    }
    dispatch(changeEditSattus(true))
    setIsEdit(true)
  }

  const handleCancel = () => {
    dispatch(changeEditSattus(false))
    setIsEdit(false)
    setResultData(initResultDataRef.current)
    resultDataRef.current = initResultDataRef.current
  }

  // 保存证件照
  const handleSave = () => {
    dispatch(changeEditSattus(false))
    setIsEdit(false)
    // 保存用户操作
    changeDetailPhotoLists()
  }

  // 删除证件照
  const handleDeleteCard = (item: PhotoData, index: number) => {
    setAjaxLoading(true)
    if (resultData.data) {
      let newData = resultData.data.filter((ele: PhotoData, i: number) => i !== index || ele.type !== 'add')
      let newResultData: { data: PhotoData[] } = {
        data: []
      }
      // 判断是新增数据还是在原数据上进行删除
      if (newData.length == resultData.data.length) {
        let data = newData.map((ele, i: number) => {
          if (i == index) {
            return { ...ele, effective: 0, feature: '' }
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
      resultDataRef.current = newResultData
      setTimeout(() => {
        setAjaxLoading(false)
      }, 500)
    }
  }

  const handleAdd = (item: PhotoData[]) => {
    let data = resultDataRef.current.data || []
    if (!item.length) return
    if (data.filter(ele => ele.feature == item[0].feature).length) {
      Message.warning('请勿重复添加！')
      return
    }
    let newData = Object.assign({}, resultData, {
      data: [...data, {
        ...item[0],
        type: 'add',
        effective: 1,
        sourceId: 1,
        collectTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        userName: userInfo.name,
        userId: userInfo.id,
      }]
    })
    setResultData(newData)
    resultDataRef.current = newData
  }

  // 动态展示每行数据
  const [listCount, setListCount] = useState(7)
  const calcListCount = () => {
    const itemWidth = 208
    const width = (document.querySelector('.photo-lists')?.clientWidth || 0) - 126 // 126为总间距
    const count = Math.floor(width / itemWidth)
    if (count >= 7 || count <= 2) {
      setListCount(count < 0 ? 1 : count)
    } else {
      const diff = width - itemWidth * count + 18 * (count - 1)
      if (diff >= itemWidth * (count / (count + 1))) {
        setListCount(count + 1)
      } else {
        setListCount(count)
      }
    }
  }

  useEffect(() => {
    calcListCount()
    window.addEventListener('resize', calcListCount)

    return () => {
      window.removeEventListener('resize', calcListCount)
    }
  }, [])
  // 渲染证件照卡片
  const handleRenderCard = () => {
    const { data = [] } = resultData
    let template = []
    for (let i = 0; i < data.length; i = i + listCount) {
      let _template = []
      for (let j = i; j < i + listCount; j++) {
        if (j < data.length) {
          if (data[j].effective != 0) {
            _template.push(
              <Card.Normal
                key={data[j].feature}
                cardData={{
                  bigImage: data[j].url,
                  captureTime: data[j].collectTime,
                  userName: data[j].userName,
                  targetImage: data[j].url
                }}
                showChecked={false}
                showDelete={isEdit}
                handleDelete={() => handleDeleteCard(data[j], j)}
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

  return <div className={`${prefixCls}`}>
    <Title
      title={title}
      handleSave={handleSave}
      handleAdd={handleAdd}
      handleCancel={handleCancel}
      handleEdit={handleEdit}
      isEdit={isEdit}
      type="add"
      addType='file'
      uploadForm={{
        analysisType: 'face'
      }}
    // uploadurl={}
    />
    <div className="photo-lists">
      {
        ajaxLoading
          ? <div className="ajax-loading">
            <Loading spinning={true} />
          </div>
          : (resultData.data && resultData.data.length)
            // ? handleRenderCard()
            ? resultData.data.filter(ele => ele.effective != 0).length
              ? resultData.data.map((ele: any, index: number) => {
                if (ele.effective != 0) {
                  return <Card.Normal
                    key={index}
                    cardData={{
                      ...ele,
                      bigImage: ele.targetImage,
                      captureTime: ele.collectTime,
                    }}
                    showChecked={false}
                    showDelete={isEdit}
                    handleDelete={() => handleDeleteCard(ele, index)}
                  />
                }
              })
              : <div className="result-nodata">
                <Icon type="zanwushujuqianse" />
                <div> 这里什么都没有......</div>
              </div>
            : <div className="result-nodata">
              <Icon type="zanwushujuqianse" />
              <div> 这里什么都没有......</div>
            </div>
      }
    </div>
  </div>
}
export default PersonPhotoList