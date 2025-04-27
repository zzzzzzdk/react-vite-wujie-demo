import { GaitSequenceListProps } from "./interface"
import { Image, Loading } from '@yisa/webui'
import { ImgOnMouseDrag } from "@/components"
import { useEffect, useState } from "react"
import ajax from '@/services'
import { ResultRowType } from "@/pages/Search/Target/interface"


const GaitSequenceList = (props: GaitSequenceListProps) => {
  const {
    data,
    onGaitSequenceListClick,
    disabledClick = false
  } = props
  const [gaitLoading, setGaitLoading] = useState(true)
  const [resultData, setResultData] = useState<ResultRowType>()

  useEffect(() => {
    ajax.target.getPedestrianGait<{ infoId?: string }, ResultRowType>({
      infoId: data?.infoId
    }).then(res => {
      setGaitLoading(false)
      setResultData(res.data)
    }).catch(err => {
      setGaitLoading(false)
    })
    return () => {
      setGaitLoading(true)
    }
  }, [data])

  const handleGaitSequenceListClick = () => {
    if (![1, 2].includes(window.YISACONF.gaitListMouseMoveCount || 0)) {
      //证明是拖动
      window.YISACONF.gaitListMouseMoveCount = 0
      return
    }
    if (resultData?.gaitObjectUrl && resultData?.gaitObjectUrl.length && resultData?.gaitMaskUrl && resultData?.gaitMaskUrl.length && !disabledClick) {
      onGaitSequenceListClick?.()
    }
  }

  return (
    <>
      {
        gaitLoading ?
          <Loading spinning={gaitLoading} />
          :
          (<div className="gait-sequence-list"
            onClick={handleGaitSequenceListClick}
          >
            <ImgOnMouseDrag>
              <div className="img-group-container" title="鼠标拖动序列图,进行左右查看">
                <div className="list-top">
                  {
                    resultData?.gaitObjectUrl && resultData?.gaitObjectUrl.length ?
                    resultData?.gaitObjectUrl.map(item => {
                        return <Image src={item} draggable={false} key={item} />
                      }) : <div className="nodata">暂无抓拍图</div>
                  }
                </div>
                <div className="list-bottom">
                  {
                    resultData?.gaitMaskUrl && resultData?.gaitMaskUrl?.length ?
                    resultData?.gaitMaskUrl.map(item => {
                        return <Image src={item} draggable={false} key={item} />
                      }) : <div className="nodata">暂无抓拍图</div>
                  }
                </div>
              </div>
            </ImgOnMouseDrag>
          </div>)
      }
    </>
  )
}

export default GaitSequenceList
