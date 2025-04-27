import { Radio, Table, Image, Popover, Modal } from '@yisa/webui'
import classNames from 'classnames'
import React from 'react'
import './index.scss'
interface Props {
  className?: string,
  data: any,
  relationType?: { name: string, type: number },
  onCardClick?: () => void
  idCardClick?: (e: any) => void
}
const RelationCard = (props: Props) => {
  const {
    className,
    data,
    relationType = { name: '', type: -1 },
    onCardClick = () => { },
    idCardClick
  } = props
  const prefixCls = 'relation-card'
  return <div className={classNames(prefixCls, className)} onClick={onCardClick}>
    <div className="item-left">
      <Image src={data.imageUrl} />
    </div>
    <div className="item-right">
      <div className="name">{data.name}</div>
      {
        relationType.name ?
          <>
            <div className="id-card" onClick={idCardClick ? idCardClick : () => { }}>{data.idNumber}</div>
            <div className="person-info">{relationType.name} <span>{data.relationNum[relationType.type]}</span> 次</div>
          </>
          : <>
            <div className="sex-age"><span>{data.sex}</span><span>{data.age}</span></div>
            <div className="id-card" onClick={idCardClick ? idCardClick : () => { }}>{data.idNumber}</div>
            <div className="location">{data.householdAddress}</div>
          </>
      }
    </div>
  </div>
}
export default RelationCard