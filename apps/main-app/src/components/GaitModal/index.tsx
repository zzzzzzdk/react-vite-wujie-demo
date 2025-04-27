import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Modal, Message, Loading, Image } from '@yisa/webui'
import { Icon } from '@yisa/webui/es/Icon'
import { ImgPreview } from '@yisa/webui_business'
import { ImgTagWrap, BigImg, GaitSequence, Panel } from '@/components'
import GaitVideo from './GaitVideo'
import ajax, { ApiResponse } from '@/services'
import { GaitModalProps, GaitVideoRef } from './interface'
import './index.scss'
import { ResultRowType } from '@/pages/Search/Target/interface'
import { TargetType } from '@/config/CommonType'
const { List } = ImgPreview



function GaitModal(props: GaitModalProps) {
  const {
    title = "查看大图",
    gaitModalVisible = false,
    onCancel = () => { },
    data = [],
    currentIndex = 0,
  } = props
  // 当前下标
  const [gaitCurrentIndex, setGaitCurrentIndex] = useState(currentIndex)
  // 视频组件ref
  const conditionVideoRef = useRef<GaitVideoRef>(null)
  const targetVideoRef = useRef<GaitVideoRef>(null)
  //关联目标
  const [connectData, setConnectData] = useState<ApiResponse<ResultRowType[]>>()
  //步态大图中，点击的是人体还是人脸
  const [connectDataTarget, setConnectDataTarget] = useState<ResultRowType>()
  const [gaitShowConnectFlag, setGaitShowConnectFlag] = useState(false)

  const calcsimilarity = isNaN(Number(data[gaitCurrentIndex]?.similarity)) ? ["00", "00"] : String(data[gaitCurrentIndex]?.similarity)?.split(".")?.length === 2 ? String(data[gaitCurrentIndex]?.similarity)?.split(".") : [String(data[gaitCurrentIndex]?.similarity), "00"]

  const [bigVisible, setBigVisible] = useState(false)

  // const [clickType, setClickType] = useState('')

  //点击的是人体，还是人脸
  const handleImgClick = (currentData: ResultRowType) => {
    setConnectDataTarget(currentData)
    // setClickType(type)
    setGaitShowConnectFlag(true)
    setBigVisible(true)
  }

  const handleBigCancel = () => {

    setBigVisible(false)
  }
  //关闭步态框
  const handleGaitModalCancel = () => {
    setGaitCurrentIndex(0)
    conditionVideoRef.current?.closeVideo()
    targetVideoRef.current?.closeVideo()
    onCancel?.()
  }
  //一起播放，单个关闭
  const playAllVideo = () => {
    if (!data[gaitCurrentIndex].gaitVideoUrl) {
      Message.warning("视频链接不存在")
      return
    }
    conditionVideoRef.current?.playVideo()
    targetVideoRef.current?.playVideo()
  }
  //获取关联目标数据
  const getConnectData = async (currentData: ResultRowType) => {
    try {
      const res = await ajax.getConnectData<{}, ResultRowType[]>({
        infoId: currentData.infoId,
        targetType: currentData.targetType
      })
      setConnectData(res.data || [])
    } catch (error) {
      setConnectData([])
    }
  }

  const handleListChange = async (index: number) => {
    getConnectData(data[index])
    if (index >= 0 || index <= data.length) {
      setGaitCurrentIndex(index)
    }
  }
  //比对大图索引改变的时候，步态大图同步请求关联目标
  const handleIndexChange = (index: number) => {
    getConnectData(data[index])
    setConnectDataTarget(undefined)
    setGaitCurrentIndex(index)
  }

  useEffect(() => {
    if (gaitModalVisible) {
      getConnectData(data[currentIndex])
      setGaitCurrentIndex(currentIndex)
    }
  }, [currentIndex, gaitModalVisible])
  // 当前图片下标变动时触发
  useEffect(() => {
    conditionVideoRef.current?.closeVideo()
    targetVideoRef.current?.closeVideo()
  }, [gaitCurrentIndex, data])

  return (
    <Modal
      title={title}
      wrapClassName="gait-modal"
      footer={null}
      unmountOnExit
      visible={gaitModalVisible}
      onCancel={handleGaitModalCancel}
      width={1200}
      alignCenter
    >
      <div className="gait-modal-content">
        <div className="gait-modal-content-search">
          <Panel
            title="检索条件"
          >
            <div className="gait-modal-content-search-container">
              <div className="video-wrapper">
                <GaitVideo
                  ref={conditionVideoRef}
                  data={Array.isArray(data[gaitCurrentIndex]?.matches) && data[gaitCurrentIndex]?.matches?.length ? data[gaitCurrentIndex]?.matches[0] : {} as any}
                  playAllVideo={playAllVideo}
                  playerId="mse1"
                />
              </div>
              <div className="info-wrapper">
                <div className="info-wrapper-tag">
                  <ImgTagWrap
                    data={Array.isArray(data[gaitCurrentIndex]?.matches) && data[gaitCurrentIndex]?.matches?.length ? data[gaitCurrentIndex]?.matches[0] : {} as any}
                  // handleImgClick={(v) => handleImgClick(v)}
                  />
                </div>
                <div className="info-wrapper-sequence">
                  <GaitSequence
                    isConditionFlag={true}
                    data={data[gaitCurrentIndex] || {}}
                  />
                </div>
              </div>
            </div>
          </Panel>

        </div>
        <div className="gait-modal-content-similarity">
          <div className="similarity-container">
            <span>{calcsimilarity[0]}</span>
            <span>.{calcsimilarity[1]}%</span>
          </div>
        </div>
        <div className="gait-modal-content-result">
          <Panel
            title="检索结果"
          >
            <div className="gait-modal-content-result-container">
              <div className="video-wrapper">
                <GaitVideo
                  ref={targetVideoRef}
                  data={data[gaitCurrentIndex]}
                  playAllVideo={playAllVideo}
                  playerId="mse2"
                />
              </div>
              <div className="info-wrapper">
                <ImgTagWrap
                  currentData={data[gaitCurrentIndex]}
                  data={connectData?.length ? connectData[0] : {}}
                  handleImgClick={(data) => handleImgClick(data)}
                // handleImgClick={(v:any) => handleImgClick(v, data.data[currentIndex], 'result')}
                />
                <div className="info-wrapper-sequence">
                  <GaitSequence
                    isResultFlag={true}
                    data={data[gaitCurrentIndex]}
                  />
                </div>
              </div>
            </div>
          </Panel>

        </div>
        <footer className="gait-modal-content-list">
          <List
            data={data}
            itemHeight={80}
            itemWidth={80}
            currentIndex={gaitCurrentIndex}
            fieldNames={{
              key: 'gaitFeature',
              src: 'targetImage'
            }}
            onChange={handleListChange}
          />
        </footer>
      </div>
      <BigImg
        data={[connectDataTarget]}
        connectDataTarget={connectDataTarget}
        currentIndex={0}
        onIndexChange={(index) => { handleIndexChange(index) }}
        modalProps={{
          visible: bigVisible,
          onCancel: handleBigCancel
        }}
        disabledAssociateTarget={true}
        // onConnectItemClick={handleConnectItemClick}
      />
    </Modal>
  )
}

export default GaitModal
