import BasicInfo from "./BasicInfo";
import DeployTargetBlock from "./DeployTarget";
import Creator from "./Creator";
import Receiver from "./Receiver";
import Approver from "./Approver";
import CurrentStatus from "./CurrentStatus";
const DeploymentBlock = {
  BasicInfo,
  DeployTarget: DeployTargetBlock,
  Creator,
  Receiver,
  Approver,
  CurrentStatus,
};
export default DeploymentBlock;
