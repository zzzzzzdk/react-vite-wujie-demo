import { useState } from "react";
import { Divider, Radio, Modal, Form, Input } from "@yisa/webui";
import { Icon } from "@yisa/webui/es/Icon";
import type { DeployItem } from "../interface";

import "./index.scss";
import services from "@/services";
import { useResetState } from "ahooks";
const { TextArea } = Input;
// 配置相应的弹框

export type operationType = "close" | "undo" | "review" | undefined;
type ReviewingModalProps = {
  modalType: operationType;
  deployItem?: DeployItem;
  close: () => void;
  onSuccess: () => void;
};

function ReviewingModal(props: ReviewingModalProps) {
  const { modalType, deployItem, close, onSuccess } = props;
  /* 关闭 */
  const [closeForm, setCloseForm, resetClose] = useResetState({
    remark: "",
  });
  const handleClosed = () => {
    services.deploy
      .close<any, any>({
        ...closeForm,
        operation: "close",
        jobId: deployItem?.jobId,
      })
      .then(() => {
        resetClose();
        close();
        onSuccess();
      });
  };

  const [undoForm, setUndoForm, resetUndo] = useResetState({
    remark: "",
  });

  /* 撤销 */
  const handleUndo = () => {
    services.deploy
      .close<any, any>({
        ...undoForm,
        operation: "undo",
        jobId: deployItem?.jobId,
      })
      .then(() => {
        resetUndo();
        close();
        onSuccess();
      });
  };

  /* 审批 */
  const [reviewForm, setReviewForm, resetReview] = useResetState<{
    operation: "agree" | "reject";
    remark: string;
  }>({
    operation: "agree", // reject
    remark: "",
  });

  const handleReview = () => {
    services.deploy
      .review({ ...reviewForm, jobId: deployItem?.jobId })
      .then(() => {
        resetReview();
        close();
        onSuccess();
      });
  };
  if (!modalType || !deployItem) {
    return null;
  }

  return (
    <Modal
      title={
        modalType === "close"
          ? "关闭"
          : modalType === "review"
            ? "审批"
            : "撤销"
      }
      visible={!!props.modalType}
      onCancel={close}
      onOk={() => {
        switch (modalType) {
          case "close": {
            handleClosed();
            break;
          }
          case "review": {
            handleReview();
            break;
          }
          case "undo": {
            handleUndo();
            break;
          }
        }
      }}
    >
      <div className="deploy-detail-review-modal">
        {/* 撤销 */}
        {modalType === "undo" && (
          <Form layout="vertical">
            <p className="warning">
              <Icon type="zhuyi" />
              撤销布控单后，内容将会清空，你确定要撤销吗？
            </p>
            <Form.Item label="撤销原因">
              <TextArea
                maxLength={20}
                showWordLimit
                placeholder="请输入原因"
                style={{ minHeight: 4 * 16 }}
                autoSize={{ minRows: 4 }}
                value={undoForm.remark}
                onChange={(e, v) => {
                  setUndoForm({ ...undoForm, remark: v });
                }}
              />
            </Form.Item>
          </Form>
        )}
        {/* 关闭 */}
        {modalType === "close" && (
          <Form layout="vertical">
            <p className="warning">
              <Icon type="zhuyi" />
              关闭布控单后，内容将会清空，你确定要关闭吗？
            </p>
            <Form.Item label="关闭原因">
              <TextArea
                maxLength={20}
                showWordLimit
                placeholder="请输入原因"
                style={{ minHeight: 4 * 16 }}
                autoSize={{ minRows: 4 }}
                value={closeForm.remark}
                onChange={(e, v) => {
                  setCloseForm({ ...closeForm, remark: v });
                }}
              />
            </Form.Item>
          </Form>
        )}
        {/* 审批 */}
        {modalType == "review" && (
          <Form layout="vertical">
            <Radio.Group
              options={[
                { label: "通过", value: "agree" },
                { label: "驳回", value: "reject" },
              ]}
              value={reviewForm.operation}
              onChange={(e) => {
                setReviewForm({ ...reviewForm, operation: e.target.value });
              }}
            />
            <Form.Item label="审批原因">
              <TextArea
                maxLength={20}
                showWordLimit
                placeholder="请输入原因"
                style={{ minHeight: 4 * 16 }}
                autoSize={{ minRows: 4 }}
                value={reviewForm.remark}
                onChange={(e, v) => {
                  setReviewForm({ ...reviewForm, remark: v });
                }}
              />
            </Form.Item>
          </Form>
        )}
      </div>
      <Divider />
    </Modal>
  );
}

export default ReviewingModal;
