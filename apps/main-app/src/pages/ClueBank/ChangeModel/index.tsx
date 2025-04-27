import React, { useState, useContext, useMemo } from "react";
import { Input, Modal, Form, DatePicker, Select, Divider } from "@yisa/webui";
import { ClueContext } from "../context";
import "./index.scss";
import ClueTreeSelect from "./ClueTreeSelect";
function ChangeModel(props: any) {
  const { visible, onOk, onCancel } = props;
  const { clueTreeData, group, ongroupchange } = useContext(ClueContext);
  const groupchange = (value: any) => {
    if (ongroupchange) ongroupchange(value);
  };
  return (
    <Modal
      title="修改分组"
      className="change-grop"
      visible={visible}
      // visible={true}
      onCancel={onCancel}
      onOk={onOk}
      unmountOnExit
    >
      <Form>
        <Form.Item label="归属分组">
          <ClueTreeSelect value={group} onChange={groupchange} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ChangeModel;
