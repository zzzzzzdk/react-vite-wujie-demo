import { useContext } from "react";
import { ClueContext} from "./context";
import { SearchTree } from "@/components";
import { LeftTreeProps } from "./interface";
const LeftTree = (props: LeftTreeProps) => {
    const {
        prefixCls,
        onSelect,
    } = props
    const {
        onclueTreeDataChange,ontreestatus
    } = useContext(ClueContext)
    
    return (
        <div className={`${prefixCls}-task-list`}>
            <SearchTree onSelect={onSelect} onclueTreeDataChange={onclueTreeDataChange} ontreestatus={ontreestatus}></SearchTree>
        </div>
    )
}


export default LeftTree
