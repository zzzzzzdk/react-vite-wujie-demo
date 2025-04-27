import { Modal, Space } from '@yisa/webui'
import { GaitSequenceModalProps } from "./interface"
import { isArray } from '@/utils'
import GaitSequenceList from './List'

const GaitSequenceModal = (props: GaitSequenceModalProps) => {
  const {
    modalProps,
    data,
  } = props

  const hasCondition = data && data.conditionData && data.conditionData?.gaitObjectNumber > 0
  const hasResult = data && data.resultData && data.resultData?.gaitObjectNumber > 0

  const handleGaitSearch = (type: string) => {
    window.open(`#/image?featureList=${encodeURIComponent(JSON.stringify([{
      ...(type === "result" ? data?.resultData : data?.conditionData),
      isGait: true
    }
    ]))}&isGait=1`)
  }

  return (
    <Modal
      title="查看步态大图"
      {...(modalProps || {})}
      wrapClassName="gait-sequence-modal"
      maskStyle={{ zIndex: 2022 }}
      footer={null}
    >
      {
        hasCondition &&
        <div className='gait-result'>
          <div className='gait-header'>
            <div style={{ display: "flex" }}>
              <div>检索条件({data.conditionData?.gaitObjectNumber})</div>
              <div className="tip">【按住左键可拖动图像】</div>
            </div>
            <div onClick={() => { handleGaitSearch("condition") }} className="gait-search-btn">步态检索</div>
          </div>
          <div className="gait-con">
            <GaitSequenceList
              data={data.conditionData}
            />
          </div>
        </div>
      }
      {
        hasCondition &&
        <div className="similarity"><span>{data.resultData?.similarity || 0}</span>%</div>
      }
      {
        hasResult &&
        <div className='gait-result'>
          <div className='gait-header'>
            <div style={{ display: "flex" }}>
              {
                hasCondition ?
                  <div>检索结果({data.resultData?.gaitObjectNumber})</div>
                  :
                  <div className='has-bg'>步态序列图({data.resultData?.gaitObjectNumber})</div>
              }
              <div className="tip">【按住左键可拖动图像】</div>
            </div>
            <div onClick={() => { handleGaitSearch("result") }} className="gait-search-btn">步态检索</div>
          </div>
          <div className="gait-con">
            <GaitSequenceList
              disabledClick={true}
              data={data.resultData}
            />
          </div>
        </div>
      }
    </Modal>
  )
}

export default GaitSequenceModal
