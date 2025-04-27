import { useEffect, useMemo, useRef, useState } from 'react'
import { ImgPreview } from '@yisa/webui_business'
import { Modal, Space, Statistic, Divider, Link, Image } from '@yisa/webui'
import { Icon, LeftOutlined, RightOutlined, CloseOutlined } from '@yisa/webui/es/Icon'
import { ComparativeBigImgProps } from './interface'
import { RefImgPreviewType, ImgListDataType } from '@yisa/webui_business/es/ImgPreview'
import { ResultRowType } from "@/pages/Search/Target/interface"
import ajax from "@/services"
import classNames from 'classnames'
import { FeatureInfo } from '@yisa/webui_business/es/ImgPreview'

import { isEmptyObject, isFunction } from '@/utils/is'
import { ErrorSubmitModal, JoinClue, XgPlayer, ImgCropper } from '@/components'
import services from '@/services'
import { logReport } from "@/utils/log";
import './index.scss'
import { useLocation } from 'react-router'
import { isObject } from '@/utils'
import { PersonInfoCard } from '../ComparativeCard'
import useHandleDbClick from "../../useHandleDbClick";
import { ColorfulLabelList } from "@/pages/Deploy/components/ColorfulLabel";
import { DB, DBType } from "../../interface";
const { List } = ImgPreview



const BigImg = (props: ComparativeBigImgProps) => {
  const {
    wrapClassName,
    data = [],
    onIndexChange,
    currentIndex = 0,
    modalProps = { visible: false },
    listRender,
    listItemRender,
  } = props

  const prefixCls = 'comparative-big-img'
  const location = useLocation();

  const [defaultCurrentIndex, setDefaultCurrentIndex] = useState(currentIndex)


  const [imgLoading, setImgLoading] = useState(false)

  const [prevData, setPrevData] = useState<ResultRowType>()
  const currentData = Array.isArray(data) && data[defaultCurrentIndex] ? data[defaultCurrentIndex] : {}

  const baseTags: DB[] = currentData.baseExtraDbId?.map((id: any, idx: number) => {
    return {
      id,
      name: currentData.baseExtraDbName[idx],
      type: currentData.baseDbType,
    };
  }) || [];

  // 对后端的数据进行转换
  baseTags.unshift({
    id: currentData.baseDbId,
    name: currentData.baseDbName,
    type: currentData.baseDbType,
  });
  const compareTags: DB[] = currentData.compareExtraDbId?.map((id: any, idx: number) => {
    return {
      id,
      name: currentData.compareExtraDbName[idx],
      type: currentData.compareDbType,
    };
  }) || [];

  compareTags.unshift({
    id: currentData.compareDbId,
    name: currentData.compareDbName,
    type: currentData.compareDbType,
  });

  const handeChangeCurrent = (type: 'prev' | 'next') => {
    if (type === 'prev' && defaultCurrentIndex > 0) {
      onIndexChange && onIndexChange?.(defaultCurrentIndex - 1)
      setDefaultCurrentIndex(defaultCurrentIndex - 1)
    }
    if (type === 'next' && defaultCurrentIndex < data.length - 1) {
      onIndexChange && onIndexChange?.(defaultCurrentIndex + 1)
      setDefaultCurrentIndex(defaultCurrentIndex + 1)
    }
  }

  const handleListChange = (index: number) => {
    if (index >= 0 || index <= data.length) {
      onIndexChange && onIndexChange?.(index)
      setDefaultCurrentIndex(index)
    }
  }



  useEffect(() => {
    setDefaultCurrentIndex(currentIndex)


  }, [currentIndex, modalProps.visible])

  useEffect(() => {



  }, [modalProps.visible, currentIndex])

  const BigImgContextValue = {

  }

  useEffect(() => {
    // 如果切换两张图片相同，不用设置loading状态
    const sameImage = prevData && isObject(prevData) && prevData.bigImage === currentData.bigImage

    if (!imgLoading && !sameImage && !isEmptyObject(prevData)) {
      setImgLoading(true)
    }
    setPrevData(currentData)
  }, [defaultCurrentIndex])



  useEffect(() => {


    return () => {

    }
  }, [])
  const handleDbClick = useHandleDbClick();
  // 跳转详情页
  const handleIdCardClick = (data: any) => {
    window.open(`#/record-detail-person?${encodeURIComponent(JSON.stringify({
      idNumber: data.idNumber === '未知' ? '' : data.idNumber,
      idType: data.idType || '111',
      groupId: data.groupId || [],
      groupPlateId: data.groupPlateId || [],
      key: data.key || '',
      feature: data.feature || ''
    }))}`)
  }

  const handleListItemRender = (data: ImgListDataType, index: number) => {
    return (
      <div className="compare-item">
        <div>
          <Image src={currentData.baseImage} />
          <div className='tip'>基准库</div>
        </div>
        <div>
          <Image src={currentData.compareImage} />
          <div className='tip'>比对库</div>
        </div>
      </div>
    )
  }

  return (
    <Modal
      title="查看大图"
      {...(modalProps || {})}
      className={classNames(`${prefixCls}-modal`)}
      footer={null}
      wrapClassName={`${prefixCls}-modal-wrap ${wrapClassName}`}
      //Tabs组件非受控
      unmountOnExit
      escToExit={false}
    >
      <div className={classNames(`${prefixCls}-content`)}>
        <div className={classNames(`${prefixCls}-item-wrap`)}>
          <div className={classNames(`${prefixCls}-item`)}>
            <div className={classNames(`${prefixCls}-item-title`)}>
              基准库
            </div>
            <div className={classNames(`${prefixCls}-item-img`)}>
              <ImgPreview src={currentData.baseImage} />
            </div>
          </div>
          <div className={classNames(`${prefixCls}-item`)}>
            <div className={classNames(`${prefixCls}-item-title`)}>
              比对库
            </div>
            <div className={classNames(`${prefixCls}-item-img`)}>
              <ImgPreview src={currentData.compareImage} />
            </div>
          </div>
        </div>
        <Divider className="divider" orientation="center" style={{}}>
          <Statistic value={currentData.similarity} precision={2} suffix="%" />
        </Divider>
        <div className={classNames(`${prefixCls}-item-wrap`)}>
          <div className={classNames(`${prefixCls}-item`)}>
            {/* <Image src={currentData.baseImage} /> */}
            <PersonInfoCard
              items={[
                {
                  iconfont: "xingming",
                  text: currentData.baseName,
                },
                {
                  iconfont: "shenfenzheng",
                  text: currentData.baseIdNumber,
                  onClick: () => handleIdCardClick({
                    idNumber: currentData.baseIdNumber,
                    idType: currentData.baseIdType,
                    // groupId: currentData.groupId,
                    // groupPlateId: currentData.groupPlateId,
                    // key: currentData.key,
                    // feature: currentData.feature
                  }),
                },
                {
                  iconfont: "renyuanku1",
                  text: currentData.baseDbName,
                  customText: currentData.baseDbType === DBType.Label && (
                    <ColorfulLabelList labels={baseTags as any} />
                  ),
                  onClick: () =>
                    handleDbClick({
                      id: currentData.baseDbId,
                      name: currentData.baseDbName,
                      type: currentData.baseDbType,
                    }),
                },
              ]}
            />
          </div>
          <div className={classNames(`${prefixCls}-item`)}>
            {/* <Image src={currentData.compareImage} /> */}
            <PersonInfoCard
              items={[
                {
                  iconfont: "xingming",
                  text: currentData.compareName,
                },
                {
                  iconfont: "shenfenzheng",
                  text: currentData.compareIdNumber,
                  onClick: () => handleIdCardClick({
                    idNumber: currentData.compareIdNumber,
                    idType: currentData.caseIdType,
                    // groupId: currentData.groupId,
                    // groupPlateId: currentData.groupPlateId,
                    // key: currentData.key,
                    // feature: currentData.feature
                  }),
                },
                {
                  iconfont: "renyuanku1",
                  text: currentData.compareDbName,
                  customText: currentData.compareDbType === DBType.Label && (
                    <ColorfulLabelList labels={compareTags as any} />
                  ),
                  onClick: () =>
                    handleDbClick({
                      id: currentData.compareDbId,
                      name: currentData.compareDbName,
                      type: currentData.compareDbType,
                    }),
                },
              ]}
            />
          </div>
        </div>
        <div className="big-img-list">
          {
            listRender && isFunction(listRender) ? listRender()
              : <List
                data={data}
                currentIndex={defaultCurrentIndex}
                onChange={handleListChange}
                itemRender={handleListItemRender}
                itemWidth={450}
                itemHeight={126}
              />
          }
        </div>
      </div>
    </Modal>
  )
}

export default BigImg
