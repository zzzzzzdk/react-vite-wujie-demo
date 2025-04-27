import React, { useState, useEffect } from "react";
import { Modal, Space, Table, Message, Input, Tooltip, TreeSelect, Button, PopConfirm } from '@yisa/webui';
import { Icon } from '@yisa/webui/es/Icon';
import BaseModalProps from "./interface";
import { isObject, isFunction } from "@/utils";
import "./index.scss";
import { ResultLabelItem, PermissionsType } from '../../interface';
import services from "@/services";
import ajax, { ApiResponse } from "@/services";
import LabelSetModal from '../LabelSetModal'

export interface LableSetItem {
  labelSetId: number
  labelSetName: string  
  labelCount: number
  visiblePermissionsSet: PermissionsType;
  managePermissionsSet: PermissionsType;
  visiblePersonsSet: string[];
  managePersonsSet: string[];
}

const LabelSetManageModal = (props: BaseModalProps) => {
  const {
    modalProps,
    onModalConfirm,
    receiverList
  } = props;

  const [labelSets, setLabelSets] = useState<LableSetItem[]>([]);
  const [labelSetModal, setLabelSetModal] = useState<{
    visible: boolean;
    type: 'add' | 'view' | 'edit';
    data: LableSetItem
  }>({
    visible: false,
    type: 'add',
    data: {} as LableSetItem
  })

  const delLabelSet = (labelSetId: number) => {
    services.labelManage.deleteLabelSet<{ labelSetId: number }, any>({ labelSetId }).then(res => {
      Message.success('删除成功')
      setLabelSets(labelSets.filter(item => item.labelSetId !== labelSetId))
    }).catch(err => {
      console.log(err)
      Message.error('删除失败')
    })
  }

  const getLabelSets = () => {
    services.labelManage.getLabelSetManage<unknown, LableSetItem[]>().then(res => {
      const { data = [] } = res
      if (!data) {
        Message.error(res.message || '获取标签集失败')
        return
      }
      setLabelSets(data)
    }).catch(err => {
      console.log(err)
      Message.error(err.message || '获取标签集失败')
    })
  }


  useEffect(() => {
    if (modalProps?.visible) {
      getLabelSets()
    }
  }, [modalProps?.visible]);

  const handleOk = async () => {
    onModalConfirm?.();
  };

  const handleCancel = () => {
    if (modalProps && modalProps.onCancel && isFunction(modalProps.onCancel)) {
      modalProps.onCancel();
    }
  };

  const handleEdit = (labelSet: LableSetItem) => {
    // 实现编辑逻辑
    console.log('Edit label set:', labelSet);
    setLabelSetModal({
      ...labelSetModal,
      data: labelSet,
      type: 'edit',
      visible: true,
    })
  };

  // 标签集确认
  const handleLabelSetOk = (data: ResultLabelItem) => {

    if (labelSetModal.type === 'edit') {
      const newResultData = [...labelSets]
      newResultData.forEach(item => {
        if (item.labelSetId === labelSetModal.data.labelSetId) {
          item.managePermissionsSet = data.managePermissionsSet
          item.managePersonsSet = data.managePersonsSet
          item.visiblePermissionsSet = data.visiblePermissionsSet
          item.visiblePersonsSet = data.visiblePersonsSet
          item.labelSetName = data.labelSetName
        }
      })
      console.log('newResultData', newResultData)
      setLabelSets(newResultData)
    }

    setLabelSetModal({
      ...labelSetModal,
      visible: false
    })

  }

  const columns = [
    {
      title: '标签集名称',
      dataIndex: 'labelSetName',
      key: 'labelSetName',
    },
    {
      title: '包含标签数量',
      dataIndex: 'labelCount',
      key: 'labelCount',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: LableSetItem) => (
        <Space className="label-set-actions">
          <Button size='mini' type='table' onClick={() => handleEdit(record)}>编辑</Button>
          <PopConfirm
            title="确认删除该标签集吗？"
            onConfirm={() => delLabelSet(record.labelSetId)}
            disabled={record.labelCount !== 0}
          >
            <Button size='mini' type='danger' disabled={record.labelCount !== 0}>删除</Button>
          </PopConfirm>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title={`管理标签集`}
      {...(modalProps || {})}
      className="label-set-manage-modal"
      onOk={handleOk}
      onCancel={handleCancel}
    // footer={null}
    >
      <Table
        data={labelSets}
        columns={columns}
        rowKey="labelSetId"
        pagination={false}
      />
      <LabelSetModal
        modalProps={{
          visible: labelSetModal.visible,
          onCancel: () => setLabelSetModal({
            ...labelSetModal,
            visible: false,
          })
        }}
        onModalConfirm={handleLabelSetOk}
        receiverList={receiverList}
        modalType={labelSetModal.type}
        data={labelSetModal.data}
      />
    </Modal>
  );
};

export default LabelSetManageModal;