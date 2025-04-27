/**
 * @description 更新布控单时 禁用右侧所有表单
 */
import React, { useContext } from "react";
const EditableContext = React.createContext<boolean>(false);

export function useEditableContext() {
  return useContext(EditableContext);
}

export default function EditableProvider(props: {
  children: React.ReactNode;
  editable: boolean;
}) {
  const { editable, children } = props;
  return (
    <EditableContext.Provider value={editable}>{children}</EditableContext.Provider>
  );
}
