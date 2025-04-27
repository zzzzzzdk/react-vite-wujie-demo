import { FootholdResultType } from "../../interface";
export type DetailCardType = {
  index?: number
  active: boolean
  onCardClick?: React.MouseEventHandler<HTMLDivElement>
  cardData: FootholdResultType,
  checked?: boolean;
  onChange?: (cardData: any) => void;
  type?: string;
}
