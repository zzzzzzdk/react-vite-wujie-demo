import { ResultRowType } from "@/pages/Search/Target/interface";
import { DoublecarListType } from "../interface";

export type DoubleCarCardProps = {
  cardData: DoublecarListType;
  onCheckedChange:
    | (({ cardData, checked }: { cardData: any; checked: boolean }) => void)
    | undefined;
  checkedList: ResultRowType[];
  handleOpenBigImg: (
    index: number,
    cardlist: ResultRowType[],
    totaldata: DoublecarListType
  ) => void;
  handleLocationClick: (data: ResultRowType) => void;
};
