/**
 * @description 当前是否可编辑状态
 */

import { ItemMenu } from "@/store/slices/user";
import React, { useContext } from "react";

type ConfigurableContextType = {
  configurable: boolean;
  handleDrop?: (item: ItemMenu) => void;
  shortcuts?: ItemMenu[];
};
const ConfigurableContext = React.createContext<ConfigurableContextType>({
  configurable: false,
  shortcuts: [],
});

const ConfigurableProvider: React.FC<
  React.PropsWithChildren<ConfigurableContextType>
> = (props) => {
  return (
    <ConfigurableContext.Provider value={props}>
      {props.children}
    </ConfigurableContext.Provider>
  );
};

export const useConfigurable = () => {
  return useContext(ConfigurableContext);
};

export default ConfigurableProvider;
