import { ResultRowType } from '@/pages/Search/Target/interface'
import { DetailResultType } from '../../interface'
export type StayListProps= {
    cardData:DetailResultType,
    index:number,
    onImgClick?:(infoId:string) => void,
    active?:boolean,
    onCardClick:React.MouseEventHandler<HTMLDivElement>
  }
  