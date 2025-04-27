import { useEffect, useRef, useState } from 'react'
import { ImgPreview } from '@yisa/webui_business'
import { Modal, Space } from '@yisa/webui'
import { Icon, LeftOutlined, RightOutlined } from '@yisa/webui/es/Icon'

const { List } = ImgPreview

function BigImg(props) {
  const {
    data,
    currentIndex = 0,
    modalProps
  } = props

  const previewRef = useRef()
  const [defaultCurrentIndex, setDefaultCurrentIndex] = useState(currentIndex)
  const [disabled, setDisabled] = useState({
    zoomInDisabled: true,
    zoomOutDisabled: true,
    resetDisabled: true,
    adaptDisabled: true
  })

  useEffect(() => {
    setDefaultCurrentIndex(currentIndex)
  }, [currentIndex])

  const currentData = Array.isArray(data) && data[defaultCurrentIndex] ? data[defaultCurrentIndex] : {}
  const tools = [
    {
      text: '放大',
      icon: 'fangda',
      disabled: disabled.zoomInDisabled,
      onClick: () => previewRef.current.zoomIn()
    },
    {
      text: '缩小',
      icon: 'suoxiao',
      disabled: disabled.zoomOutDisabled,
      onClick: () => previewRef.current.zoomOut()
    },
    {
      text: '原始尺寸',
      icon: 'yuanshichicun',
      disabled: disabled.resetDisabled,
      onClick: () => previewRef.current.reset()
    },
    {
      text: '适应视图',
      icon: 'pingmufangda',
      disabled: disabled.adaptDisabled,
      onClick: () => previewRef.current.adapt()
    },
    {
      text: '下载',
      icon: 'xiazai',
      disabled: 'downloadUrl' in currentData && currentData.downloadUrl ? false : true,
      onClick: () => handleDownLoad
    },
  ]

  const handleDownLoad = () => {
    const { downloadUrl } = currentData
    if (downloadUrl) {
      let link = document.createElement('a')
      link.href = downloadUrl
      link.click()
    }
  }

  const handeChangeCurrent = (type) => {
    if (type === 'prev' && defaultCurrentIndex > 0) {
      setDefaultCurrentIndex(defaultCurrentIndex - 1)
    }
    if (type === 'next' && defaultCurrentIndex < data.length - 1) {
      setDefaultCurrentIndex(defaultCurrentIndex + 1)
    }
  }

  const handleListChange = (index) => {
    if (index >= 0 || index <= data.length) {
      setDefaultCurrentIndex(index)
    }
  }

  return (
    <Modal
      {...(modalProps || {})}
      className="big-img-modal"
      footer={null}
    >
      <div className="big-img-left">
        <Space className="big-img-tools" split={<span className="tools-split">|</span>}>
          {
            tools.map(tool => {
              const { text, icon, disabled, onClick } = tool
              return <div
                className={disabled ? "big-img-tools-item big-img-tools-item-disabled" : "big-img-tools-item"}
                key={icon}
                {...disabled ? {} : {
                  onClick
                }}
              >
                {text}
                <Icon type={icon} />
              </div>
            })
          }
        </Space>
        <div>

        </div>
        <div className="big-img-preview">
          <ImgPreview
            ref={previewRef}
            src={currentData.imgUrl || ''}
            onChange={setDisabled}
            btns={{
              left: <div
                className={defaultCurrentIndex === 0 ? "btn-switch btn-switch-disabled" : "btn-switch"}
                onClick={() => handeChangeCurrent('prev')}
              >
                <LeftOutlined />
              </div>,
              right: <div
                className={defaultCurrentIndex === 0 ? "btn-switch btn-switch-disabled" : "btn-switch"}
                onClick={() => handeChangeCurrent('next')}
              >
                <RightOutlined />
              </div>
            }}
          />
        </div>
        <div className="big-img-list">
          <List
            data={data}
            currentIndex={defaultCurrentIndex}
            fieldNames={{
              key: 'id',
              src: 'imgUrl'
            }}
            onChange={handleListChange}
          />
        </div>
      </div>
      <div className="big-img-right">右侧详细信息</div>
    </Modal>
  )
}

export default BigImg
