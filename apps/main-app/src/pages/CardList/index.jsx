import { useEffect, useMemo, useState } from 'react'
import { Message, Tabs, Form, Input, TreeSelect, DatePicker, Divider, Button, Pagination, Image } from '@yisa/webui'
import { Icon } from '@yisa/webui/es/Icon'
import { AspectRatioBox, BigImg } from "@/components"
import { ResultBox } from '@yisa/webui_business'
import character from "@/config/character.config"
import ajax from "@/services"
import { flushSync } from 'react-dom'
import dayjs from 'dayjs'
import './index.scss'

const { RangePicker } = DatePicker

const tabsData = [
  {
    key: "1",
    name: '盘查人脸-未知身份'
  },
  {
    key: "2",
    name: '盘查人脸-已知身份'
  }
]

function CardList(props) {

  const {
    isDestroy = () => { }
  } = props

  const baseFormData = {
    tabs: tabsData[0].key,
    name: '',
    locationIds: '',
    beginTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    endTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    pn: 1,
    pageSize: character.pageSizeOptions[0]
  }
  const [formData, setFormData] = useState(baseFormData)
  const [lastFormData, setLastFormData] = useState({ ...baseFormData })
  const [loading, setLoading] = useState(true)
  const [listCount, setListCount] = useState(6)
  const [resultData, setResultData] = useState({
    totalRecords: 0,
    data: []
  })
  const [locationData, setLocationData] = useState([])
  const locationIds = useMemo(() => {
    return formData.locationIds ? formData.locationIds.split(',') : []
  }, [formData.locationIds])
  const [bigImgModal, setBigImgModal] = useState({
    visible: false,
    currentIndex: 0
  })

  useEffect(() => {
    const calcListCount = () => {
      const width = document.querySelector('.result-group').clientWidth - 104
      const count = Math.floor(width / 234)
      if (count >= 6 || count <= 2) {
        setListCount(count)
      } else {
        const diff = width - 234 * count + 18 * (count - 1)
        if (diff >= 234 * (count / (count + 1))) {
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

  const handleChangeTabs = (v) => {
    setFormData({
      ...formData,
      tabs: v
    })
  }

  const handleChangeName = (e) => {
    setFormData({
      ...formData,
      name: e.target.value
    })
  }

  const handleChangeLocationIds = (v = []) => {
    setFormData({
      ...formData,
      locationIds: v.toString()
    })
  }

  const handleChangeDate = (v) => {
    const [beginTime, endTime] = v
    setFormData({
      ...formData,
      beginTime: beginTime.format('YYYY-MM-DD HH:mm:ss'),
      endTime: endTime.format('YYYY-MM-DD HH:mm:ss')
    })
  }

  const handleChangePn = (pn, pageSize) => {
    if (formData.pageSize === pageSize) {
      setLastFormData({
        ...lastFormData,
        pn
      })
    } else {
      setLastFormData({
        ...lastFormData,
        pn: 1,
        pageSize
      })
      setFormData({
        ...formData,
        pageSize
      })
    }
  }

  const handleSearch = () => {
    setLastFormData({ ...formData })
    setResultData({
      totalRecords: 0,
      data: []
    })
  }

  const handleReset = () => {
    setFormData({
      ...baseFormData,
      pageSize: formData.pageSize
    })
  }

  const handleGetData = () => {
    setLoading(true)
    ajax.card.getCardData(lastFormData).then(res => {
      console.log(res)
      const { totalRecords, data } = res
      if (!isDestroy() && Array.isArray(data)) {
        setLoading(false)
        // 使用flushSync同步更新Dom
        flushSync(() => {
          setResultData({
            totalRecords: parseInt(totalRecords) || 0,
            data
          })
        })


      }
    }).catch(err => {
      console.log(err)
      if (!isDestroy()) {
        setLoading(false)
        Message.error(err.message || '请求失败')
        // console.error(err)
      }
    })
    // resultData.totalRecords.data.data.forEach(element => {
    //   console.log(element)
    // });
  }

  useEffect(() => {
    handleGetData()
  }, [lastFormData])

  const handleGetLocation = () => {
    ajax.location.getLocationList().then(res => {
      const { data } = res
      if (!isDestroy() && Array.isArray(data)) {
        setLocationData(data)
      }
    }).catch(err => {
      if (!isDestroy()) {
        Message.error(err.message || '请求失败')
        console.error(err)
      }
    })
  }

  useEffect(() => {
    handleGetLocation()
  }, [])

  const handleRenderCard = () => {
    const { data } = resultData
    let template = []
    for (let i = 0; i < data.length; i = i + listCount) {
      let _template = []
      for (let j = i; j < i + listCount; j++) {
        if (j < data.length) {
          const item = data[j]
          const { id, imgUrl, name, captureTime, locationName } = item
          _template.push(
            <div className="card-item" key={id}>
              <AspectRatioBox
                className="card-img"
                ratio={200 / 214}
              >
                <Image src={imgUrl} onClick={() => handleOpenBigImg(j)} />
                <span className="card-img-tips">人脸抓拍照</span>
              </AspectRatioBox>
              <div className="card-info">
                <span dangerouslySetInnerHTML={{ __html: Icon.toString('jingcha') }} />
                <div className="card-info-name">{name || '未知'}</div>
              </div>
              <div className="card-info">
                <span dangerouslySetInnerHTML={{ __html: Icon.toString('shijian') }} />
                <div className="card-info-content">{captureTime || '-'}</div>
              </div>
              <div className="card-info">
                <span dangerouslySetInnerHTML={{ __html: Icon.toString('shexiangtou') }} />
                <div className="card-info-content" title={locationName || '-'}>{locationName || '-'}</div>
              </div>
            </div>
          )
        } else {
          _template.push(<div className="card-item-flex" key={j + 'flex'} />)
        }
      }
      template.push(<div className="result-card-list-row" key={i}>{_template}</div>)
    }
    return template
  }

  const handleOpenBigImg = (index) => {
    setBigImgModal({
      visible: true,
      currentIndex: index
    })
  }

  const handleCloseBigImg = () => {
    setBigImgModal({
      visible: false,
      currentIndex: 0
    })
  }

  return (
    <div className="page-content page-has-bottom page-card-list">
      <div className='page-top'>
        <Tabs
          type='line'
          defaultActiveKey={formData.tabs}
          onChange={handleChangeTabs}
          data={tabsData}
        />
        <div className="search-group">
          <Form
            layout='vertical'
            colon={false}
            inline={true}
          >
            <Form.Item label="巡逻人员">
              <Input
                placeholder="请输入"
                className="search-group-item-content"
                value={formData.name}
                onChange={handleChangeName}
              />
            </Form.Item>
            <Form.Item label="盘查地点">
              <TreeSelect
                placeholder="请选择盘查地点"
                className="search-group-item-content"
                treeCheckable
                treeData={locationData}
                fieldNames={{
                  key: 'id',
                  title: 'text',
                }}
                maxTagCount={1}
                allowClear
                treeCheckedStrategy={TreeSelect.SHOW_CHILD}
                value={locationIds}
                onChange={handleChangeLocationIds}
                getTriggerContainer={() => document.querySelector('.search-group')}
                treeProps={{
                  isVirtual: true,
                  virtualListProps: {
                    height: 300
                  }
                }}
              />
            </Form.Item>
            <Form.Item label="盘查时间">
              <RangePicker
                className="search-group-item-content"
                allowClear={false}
                showTime
                value={[dayjs(formData.beginTime), dayjs(formData.endTime)]}
                onChange={handleChangeDate}
                getPopupContainer={() => document.querySelector('.search-group')}
              />
            </Form.Item>
            <div className="form-btn-group">
              <Button type='primary' onClick={handleSearch} loading={loading}>查询</Button>
              <Button type='default' onClick={handleReset} disabled={loading}>重置</Button>
            </div>
          </Form>
        </div>
        <Divider className="search-group-bottom" />
        <div className="result-group">
          {
            loading && !resultData.totalRecords ?
              <div className="result-total">加载中...</div>
              :
              <div className="result-total">共<span>{resultData.totalRecords}</span>条结果</div>
          }
          <ResultBox loading={loading} nodata={!resultData.data.length}>
            {
              !loading && !!resultData.data.length && <div className="result-card-list">
                {handleRenderCard()}
              </div>
            }
            {/* <div className="result-card-list">
              {
                resultData.data.map(elem => {
                  const { id, imgUrl, name, captureTime, locationName } = elem
                  return <div className="card-item" key={id}>
                    <div className="card-img">
                      <Image src={imgUrl} />
                      <span className="card-img-tips">人脸抓拍照</span>
                    </div>
                    <div className="card-info">
                      <span dangerouslySetInnerHTML={{ __html: Icon.toString('jingcha') }} />
                      <div className="card-info-name">{name || '未知'}</div>
                    </div>
                    <div className="card-info">
                      <span dangerouslySetInnerHTML={{ __html: Icon.toString('shijian') }} />
                      <div className="card-info-content">{captureTime || '-'}</div>
                    </div>
                    <div className="card-info">
                      <span dangerouslySetInnerHTML={{ __html: Icon.toString('shexiangtou') }} />
                      <div className="card-info-content" title={locationName || '-'}>{locationName || '-'}</div>
                    </div>
                  </div>
                })
              }
            </div> */}
          </ResultBox>
        </div>
      </div>
      <div className='page-bottom'>
        <Pagination
          disabled={!resultData.totalRecords || loading}
          showSizeChanger
          showQuickJumper
          showTotal={() => `共 ${resultData.totalRecords} 条`}
          total={resultData.totalRecords}
          current={parseInt(lastFormData.pn)}
          pageSize={parseInt(lastFormData.pageSize)}
          pageSizeOptions={character.pageSizeOptions}
          onChange={handleChangePn}
        />
      </div>
      <BigImg
        modalProps={{
          visible: bigImgModal.visible,
          title: '查看大图',
          onCancel: handleCloseBigImg
        }}
        currentIndex={bigImgModal.currentIndex}
        data={resultData.data}
      />
    </div>
  )
}

export default CardList
