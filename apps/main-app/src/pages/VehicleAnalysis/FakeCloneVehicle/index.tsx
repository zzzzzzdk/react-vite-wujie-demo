import FakeCloneVehicle from "./FakeCloneVehicle";
import { useLocation } from "react-router";

export default function Container() {
  const location = useLocation();

  // 模块类型 1 假牌车 2套牌车
  const module: 1 | 2 = location.pathname.includes("fake") ? 1 : 2;

  return <FakeCloneVehicle key={module} module={module} />;
}
