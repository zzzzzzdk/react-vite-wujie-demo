import { useState, useMemo, useEffect, useCallback } from 'react'
import { Input, Select, Radio, DatePicker, Slider, Button, Upload, Message, Form, Checkbox, Modal, Tree } from '@yisa/webui'
import { FormPlate, FormPlateColor } from '@yisa/webui_business'
import { PlusCircleFilled, MinusCircleFilled, UploadOutlined, Icon } from '@yisa/webui/es/Icon'
import { BaseMap, TileLayer, Draw, MassMarker, Popup, utils } from '@yisa/yisa-map'
import L from 'leaflet'
import dayjs from 'dayjs'
import ajax from "@/services"
import img1 from '@/assets/images/map/1.png'
import img1h from '@/assets/images/map/1h.png'
import './index.scss'

function Deploy(props) {

  const {
    isDestroy = () => { }
  } = props

  const mapProps = useMemo(() => {
    return {
      domId: 'homeMap',
      mapOptions: {
        center: [35.965781, 120.205252],
        zoom: 14
      },
      showScale: true
    }
  }, [])

  const tileLayerProps = useMemo(() => {
    return {
      tileUrlTemplate: '{mapTileHost}/_alllayers/{z}/{y}/{x}.png',
      tileLayerOptions: {
        maxZoom: 18,
        minZoom: 5,
        mapTileHost: 'http://192.168.4.149'
      }
    }
  }, [])

  const [formData, setFormData] = useState({
    title: '',
    deploy_features: [],
    label: '',
    timeType: '1',
    beginDate: dayjs().format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    times: [[0, 24]],
    warning_type: ['1'],
    locationIds: '',
    reason: ''
  })
  const [errorMessage, setErrorMessage] = useState({})
  const [treeData, setTreeData] = useState([])
  const [locationData, setLocationData] = useState([])
  const [drawType, setDrawType] = useState('default')
  const [vectorData, setVectorData] = useState(null)
  const [clickData, setClickData] = useState([])
  const [popupVisible, setPopupVisible] = useState(false)
  const [filterText, setFilterText] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const locationIds = useMemo(() => {
    return formData.locationIds ? formData.locationIds.split(',') : []
  }, [formData.locationIds])
  const checkedLocations = useMemo(() => {
    const ids = new Set(locationIds)
    return locationData.filter(elem => ids.has(elem.id))
  }, [locationIds])

  const labelData = [
    {
      label: '标签一',
      value: '1'
    },
    {
      label: '标签二',
      value: '2'
    },
    {
      label: '标签三',
      value: '3'
    },
    {
      label: '标签四',
      value: '4'
    }
  ]
  const deployTimeType = [
    {
      label: '短期布控',
      value: '1'
    },
    {
      label: '永久布控',
      value: '2'
    },
  ]
  const timeMarks = {
    0: '00:00',
    6: '06:00',
    12: '12:00',
    18: '18:00',
    24: '24:00'
  }
  const timeOperates = [
    {
      label: '一周',
      value: '6'
    },
    {
      label: '一月',
      value: '29'
    },
    {
      label: '三月',
      value: '89'
    },
    {
      label: '半年',
      value: '179'
    },
  ]
  const drawTools = [
    {
      icon: 'zhuashou',
      type: 'default'
    },
    {
      icon: 'quan',
      type: 'circle'
    },
    {
      icon: 'kuang',
      type: 'rectangle'
    },
    {
      icon: 'xingzhuang',
      type: 'polygon'
    },
    {
      icon: 'shanchu',
      type: 'clear'
    },
  ]
  const warningType = [
    {
      label: '系统预警',
      value: '1',
      disabled: true
    },
    {
      label: '短信预警',
      value: '2'
    }
  ]

  const testOptions = [
    {
      key: 'title',
      text: '请输入布控标题',
      test: () => !formData.title
    },
    {
      key: 'deploy_features',
      text: '请上传布控照片',
      test: () => !Array.isArray(formData.deploy_features) || !formData.deploy_features.length
    },
    {
      key: 'label',
      text: '请选择人员标签',
      test: () => !formData.label
    }
  ]

  const sliderFormatter = (v) => {
    return parseInt(v) > 9 ? `${v}:00` : `0${v}:00`
  }

  const handleChangeTitle = (e) => {
    setFormData({
      ...formData,
      title: e.target.value
    })
    setErrorMessage({
      ...errorMessage,
      title: !e.target.value ? '请输入布控标题' : ''
    })
  }

  const handleChangeLable = (v) => {
    setFormData({
      ...formData,
      label: v
    })
    setErrorMessage({
      ...errorMessage,
      label: !v ? '请选择人员标签' : ''
    })
  }

  const handleChangeTimeType = (e) => {
    setFormData({
      ...formData,
      timeType: e.target.value
    })
  }

  const handleChangeDate = (v) => {
    const [beginDate, endDate] = v
    setFormData({
      ...formData,
      beginDate: beginDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD')
    })
  }

  const handleAddSlider = () => {
    const { times } = formData
    setFormData({
      ...formData,
      times: [...times, [0, 24]]
    })
  }

  const handleDelSlider = (index) => {
    const { times } = formData
    setFormData({
      ...formData,
      times: times.filter((_, i) => i !== index)
    })
  }

  const handleChangeSlider = (v, index) => {
    let { times } = formData
    times[index] = v
    setFormData({
      ...formData,
      times
    })
  }

  const handleOperateDate = (v) => {
    setFormData({
      ...formData,
      beginDate: dayjs().subtract(v, 'days').format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD')
    })
  }

  const handleChangeDrawType = (v) => {
    setDrawType(v)
    if (v === 'clear') {
      setFormData({
        ...formData,
        locationIds: ''
      })
    }
  }

  const handleChangeWarningType = (v) => {
    setFormData({
      ...formData,
      warning_type: v
    })
  }

  const handleChangeVectorData = (type, vector) => {
    setVectorData(vector ? {
      type,
      ...vector
    } : null)
    setDrawType('default')
  }

  useEffect(() => {
    if (vectorData) {
      const ids = locationData.filter(elem => {
        const { lat, lng, id } = elem
        return utils.contains(vectorData, lat, lng) && !locationIds.includes(id)
      }).map(elem => elem.id)
      if (ids.length) {
        setFormData({
          ...formData,
          locationIds: Array.from(new Set([...locationIds, ...ids])).toString()
        })
      } else {
        Message.error('未选中设备')
      }
    }
  }, [vectorData])

  const handleChangeLocation = (_, { checkedNodes }) => {
    let ids = checkedNodes.filter(node => !('scale' in node.props)).map(node => node.props.id)
    setFormData({
      ...formData,
      locationIds: ids.toString()
    })
  }

  const handleChangeReason = (e) => {
    setFormData({
      ...formData,
      reason: e.target.value
    })
  }

  const beforeSubmit = () => {
    let _errorMessage = {}
    testOptions.forEach(elem => {
      const { key, text, test } = elem
      if (test()) {
        console.log(key)
        _errorMessage[key] = text
      }
    })
    setErrorMessage(_errorMessage)
    return !Object.keys(_errorMessage).length
  }

  const handleSubmit = () => {
    console.log(formData)
    if (beforeSubmit()) return
  }

  useEffect(() => {
    handleGetLocation()
  }, [])

  const handleGetLocation = () => {
    ajax.location.getLocationList().then(res => {
      const { data } = res
      if (!isDestroy() && Array.isArray(data)) {
        setTreeData(data)
        setLocationData(handleLocationData(JSON.parse(JSON.stringify(data))))
      }
    }).catch(err => {
      if (!isDestroy()) {
        Message.error(err.message || '请求失败')
        console.error(err)
      }
    })
  }

  const handleLocationData = (data) => {
    let _locationData = []
    data.forEach(elem => {
      const { scale, children } = elem
      if (scale && Array.isArray(children)) {
        _locationData = [..._locationData, ...handleLocationData(children)]
      }
      if (!scale) {
        _locationData.push({
          ...elem
        })
      }
    })
    return _locationData
  }

  const markers = useMemo(() => {
    const icons = [
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
    return locationData.map(elem => {
      const { id, lat, lng, text } = elem
      if (!parseFloat(lat) || !parseFloat(lng)) {
        return false
      }
      let marker = L.marker([parseFloat(lat), parseFloat(lng)], {
        icon: locationIds.includes(id) ? icons[1] : icons[0]
      }).bindTooltip(text)
      marker.data = elem
      return marker
    }).filter(Boolean)
  }, [locationData, locationIds])

  const massMarkerProps = useMemo(() => {
    return {
      data: markers,
      onChangeClickData: (_, data) => {
        setClickData(data)
      }
    }
  }, [markers])

  useEffect(() => {
    setPopupVisible(false)
    if (clickData.length === 1) {
      const { id } = clickData[0].data || {}
      if (locationIds.includes(id)) {
        setFormData({
          ...formData,
          locationIds: locationIds.filter(i => i !== id).toString()
        })
      } else {
        setFormData({
          ...formData,
          locationIds: [...locationIds, id].toString()
        })
      }
    } else if (clickData.length > 1) {
      setPopupVisible(true)
    }
  }, [clickData])

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
          clickData.map(elem => {
            const { id, text } = elem.data || {}
            const checked = locationIds.includes(id)
            return <div key={id} className="location-item" onMouseDown={() => handleChangeMassMarker(id, checked)}>
              <Checkbox checked={checked}>{text}</Checkbox>
            </div>
          })
        }
      </div>
    </Popup>
  }

  const handleChangeMassMarker = (id, checked) => {
    if (checked) {
      setFormData({
        ...formData,
        locationIds: locationIds.filter(i => i !== id).toString()
      })
    } else {
      setFormData({
        ...formData,
        locationIds: [...locationIds, id].toString()
      })
    }
  }

  const handleClosePopup = () => {
    setPopupVisible(false)
  }

  const handleOpenModal = () => {
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
  }

  const handleChangeFilterText = (e) => {
    setFilterText(e.target.value)
  }

  const filterTreeNode = useCallback((node) => {
    return node.title.toLowerCase().indexOf(filterText.toLowerCase()) > -1;
  }, [filterText])

  const handleClearLocation = () => {
    setFormData({
      ...formData,
      locationIds: ''
    })
  }

  return (
    <div className="deploy-container">
      <div className="deploy-left">
        <div className="deploy-left-content">
          <Form
            labelAlign="right"
            labelWidth={70}
            colon={false}
          >
            <Form.Item
              required
              label="布控标题"
              errorMessage={errorMessage.title || ''}
            >
              <Input
                placeholder="请输入布控标题"
                className="deploy-item-content"
                value={formData.title}
                onChange={handleChangeTitle}
                maxLength={20}
                showWordLimit={true}
              />
            </Form.Item>
            <Form.Item
              label="车牌号码"
            >
              <FormPlate isShowNoPlate className="deploy-item-content" isShowKeyboard />
            </Form.Item>
            <Form.Item
              label="车牌颜色"
            >
              <FormPlateColor className="deploy-item-content" />
            </Form.Item>
            <div className="upload-container">
              <Form.Item
                label=""
                errorMessage={errorMessage.deploy_features || ''}
              >
                <Upload
                  drag
                  showUploadList={false}
                  accept="image/*"
                  onDrop={(e) => {
                    let uploadFile = e.dataTransfer.files[0]
                    let accept = ['.png', '.gif', '.bmp', '.jpg']
                    if (accept.some((item) => uploadFile.name.endsWith(item))) {
                      return
                    } else {
                      Message.info('不接受的文件类型，请重新上传指定文件类型~');
                    }
                  }}
                  tip="支持扩展名：.png .gif .bmp .jpg"
                  action="/upload"
                >
                  <div className="upload-content">
                    <UploadOutlined />
                    <p>请上传布控照片</p>
                  </div>
                </Upload>
              </Form.Item>
            </div>
            <Form.Item
              required
              label="人员标签"
              errorMessage={errorMessage.label || ''}
            >
              <Select
                placeholder="请选择人员标签"
                className="deploy-item-content"
                options={labelData}
                value={formData.label || undefined}
                onChange={handleChangeLable}
                getTriggerContainer={() => document.querySelector('.deploy-left-content')}
                showSearch
              />
            </Form.Item>
            <Form.Item
              label="布控时限"
            >
              <Radio.Group
                className="deploy-item-content"
                options={deployTimeType}
                value={formData.timeType}
                onChange={handleChangeTimeType}
              />
            </Form.Item>
            {
              formData.timeType === '1' && <Form.Item
                className="form-item-date"
                label="时间范围"
              >
                <DatePicker.RangePicker
                  className="deploy-item-content"
                  allowClear={false}
                  value={[dayjs(formData.beginDate), dayjs(formData.endDate)]}
                  onChange={handleChangeDate}
                  getPopupContainer={() => document.querySelector('.search-group')}
                />
              </Form.Item>
            }
            {
              formData.timeType === '1' && formData.times.map((elem, index) => {
                return <div className="slider-time" key={`${index}-${elem.toString()}`}>
                  <Slider
                    range
                    min={0}
                    max={24}
                    marks={timeMarks}
                    defaultValue={elem}
                    onAfterChange={(v) => handleChangeSlider(v, index)}
                    tooltip={{ formatter: sliderFormatter }}
                  />
                  <div className="slider-btns">
                    {
                      index !== 0 && <MinusCircleFilled
                        className="slider-minus"
                        onClick={() => handleDelSlider(index)}
                      />
                    }
                    {
                      index === formData.times.length - 1 && index < 3 && <PlusCircleFilled
                        className="slider-plus"
                        onClick={handleAddSlider}
                      />
                    }
                  </div>
                </div>
              })
            }
            {
              formData.timeType === '1' && <div className="time-operate-btns">
                {
                  timeOperates.map(elem => {
                    const { label, value } = elem
                    return <div
                      key={value}
                      className="time-operate-btn"
                      onClick={() => handleOperateDate(value)}
                    >
                      {label}
                    </div>
                  })
                }
              </div>
            }
            <Form.Item
              label="布控区域"
            >
              <div className="deploy-item-content">
                <div className="draw-content">
                  <div className="draw-tools">
                    {
                      drawTools.map(elem => {
                        const { icon, type } = elem
                        return <span
                          key={type}
                          className={drawType === type ? "active" : ""}
                          dangerouslySetInnerHTML={{ __html: Icon.toString(icon) }}
                          onClick={() => handleChangeDrawType(type)}
                        />
                      })
                    }
                  </div>
                  <div className="draw-tips">在右侧地图操作</div>
                </div>
                <div className="location-content" onClick={handleOpenModal}>
                  {
                    !locationIds.length && <div className="location-tips">请根据列表选择点位</div>
                  }
                  {
                    !!locationIds.length && <div className="location-count">已选择<span>{locationIds.length}</span>个点位</div>
                  }
                  <span dangerouslySetInnerHTML={{ __html: Icon.toString('jiagou') }} />
                </div>
              </div>
            </Form.Item>
            <Form.Item
              label="预警方式"
            >
              <Checkbox.Group
                className="deploy-item-content"
                options={warningType}
                value={formData.warning_type}
                onChange={handleChangeWarningType}
              />
            </Form.Item>
            <Form.Item
              label="布控原因"
            >
              <Input.TextArea
                placeholder="请输入布控原因"
                className="deploy-item-content"
                value={formData.reason}
                onChange={handleChangeReason}
                autoSize={{ minRows: 4, maxRows: 4 }}
                maxLength={100}
                showWordLimit={true}
              />
            </Form.Item>
          </Form>
          <div className="btn-group">
            <Button type='primary' onClick={handleSubmit}>提交</Button>
          </div>
        </div>
      </div>
      <div className="deploy-right">
        <BaseMap {...mapProps}>
          <TileLayer {...tileLayerProps} />
          <Draw
            type={drawType}
            saveVectorType="3"
            saveTime={500}
            onChange={handleChangeVectorData}
          />
          <MassMarker {...massMarkerProps} />
          {handleRenderMarkersPopup()}
        </BaseMap>
      </div>
      <Modal
        className="location-modal"
        title="选择点位"
        footer={null}
        visible={modalVisible}
        onCancel={handleCloseModal}
      >
        <div className="location-modal-left">
          <Input.Search
            placeholder="点位筛选"
            value={filterText}
            onChange={handleChangeFilterText}
          />
          <Tree
            className="location-list"
            checkable
            checkedKeys={locationIds}
            onCheck={handleChangeLocation}
            treeData={treeData}
            fieldNames={{
              key: 'id',
              title: 'text',
            }}
            filterNode={filterTreeNode}
            isVirtual={true}
            virtualListProps={{ height: 518 }}
          />
        </div>
        <div className="location-modal-right">
          <div className="location-modal-right-header">
            <span>已选择点位<i>{checkedLocations.length}</i></span>
            <span
              dangerouslySetInnerHTML={{ __html: Icon.toString('shanchu') }}
              onClick={handleClearLocation}
            />
          </div>
          <div className="location-modal-right-list">
            {
              checkedLocations.map(elem => {
                const { id, text } = elem
                return <div className="location-item" onClick={() => handleChangeMassMarker(id, true)}>
                  <MinusCircleFilled />
                  {text}
                </div>
              })
            }
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Deploy
