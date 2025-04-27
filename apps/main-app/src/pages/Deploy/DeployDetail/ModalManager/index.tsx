import React from "react";
import { Icon } from "@yisa/webui/es/Icon";
import { Radio, Modal, Form, Input } from "@yisa/webui";
import type { ModalProps } from "@yisa/webui/es/Modal/interface";

import { type ModalType, type DeployItem, Reason } from "../interface";

const { TextArea } = Input;

// 配置相应的弹框
const modals: Record<
  NonNullable<ModalType>,
  { title: string; Comp: React.FC<ModalContentProps> }
> = {
  approve: {
    title: "审批",
    Comp: ApproveModal,
  },
  revoke: {
    title: "撤销",
    Comp: RevokeModal,
  },
  stop: {
    title: "关闭",
    Comp: StopModal,
  },
};

type ModalManagerProps = {
  modalType: ModalType;
  deployItem?: DeployItem;
  close: () => void;
};

function ModalManager(props: ModalManagerProps) {
  const { modalType, deployItem, close } = props;
  return (
    <>
      {Object.entries(modals).map((modal) => {
        const [type, { title, Comp }] = modal;
        return (
          <Comp
            key={type}
            className="deploy-detail modal-manager"
            title={title}
            visible={type === modalType}
            deployItem={deployItem}
            onCancel={close}
          />
        );
      })}
    </>
  );
}

export type ModalContentProps = {
  deployItem?: DeployItem;
} & ModalProps;

export function RevokeModal(props: ModalContentProps) {
  const { deployItem, ...modalProps } = props;
  return (
    <Modal {...modalProps}>
      <div className="content">
        <p className="warning">撤销布控单后，内容将会清空，你确定要撤销吗？</p>
        <Form layout="vertical">
          <Form.Item label="撤销原因">
            <TextArea
              maxLength={200}
              showWordLimit
              placeholder="请输入原因"
              style={{ minHeight: 64, width: 350 }}
              autoSize={{ minRows: 4, maxRows: 8 }}
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}

export function StopModal(props: ModalContentProps) {
  const { deployItem, ...modalProps } = props;
  return (
    <Modal {...modalProps}>
      <div className="content">
        <p className="warning">关闭布控单后，内容将会清空，你确定要关闭吗？</p>
        <Form layout="vertical">
          <Form.Item label="关闭原因">
            <TextArea
              maxLength={200}
              showWordLimit
              placeholder="请输入原因"
              style={{ minHeight: 64, width: 350 }}
              autoSize={{ minRows: 4, maxRows: 8 }}
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}

export function ApproveModal(props: ModalContentProps) {
  const { deployItem, ...modalProps } = props;
  const options = [
    { label: "通过", value: "ok" },
    { label: "通过", value: Reason.Reject },
  ];
  return (
    <Modal {...modalProps}>
      <div className="content">
        <Form layout="vertical">
          <Form.Item label="审批意见" className="test">
            <Radio.Group options={options} value={"ok"}></Radio.Group>
          </Form.Item>
          <Form.Item label="原因">
            <TextArea
              maxLength={200}
              showWordLimit
              placeholder="请输入原因"
              style={{ minHeight: 64, width: 350 }}
              autoSize={{ minRows: 4, maxRows: 8 }}
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
export default ModalManager;
