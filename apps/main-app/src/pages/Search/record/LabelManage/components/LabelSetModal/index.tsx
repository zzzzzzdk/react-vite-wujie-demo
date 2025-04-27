import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Modal, Form, Radio, Message, Input, Tooltip, TreeSelect } from '@yisa/webui'
import { Icon, CloseOutlined } from '@yisa/webui/es/Icon'
import BaseModalProps, { RadioDataType } from "./interface";
import { isObject, isFunction } from "@/utils";
import { FormRadioGroup } from "@/components"
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import useReceivers from "@/pages/Deploy/hooks/useReceivers";
import "./index.scss"
import { ResultLabelItem } from '../../interface';
import services from "@/services";

const switchData = [
  { value: 'all', label: '全部可见' },
  { value: 'part', label: '部分可见' },
]

const LabelSetModal = (props: BaseModalProps) => {
  const {
    modalProps,
    onModalConfirm,
    modalType = 'view',
    data = {} as unknown as ResultLabelItem,
    receiverList = [],

    // data = {
    //   visiblePersonsSet: ['yiyisasasa', 'angular', 'javascript'],
    //   managePersonsSet: ['yiyisasasa', 'javascript']
    // } as unknown as ResultLabelItem
  } = props

  const defaultPermissions: RadioDataType = {
    type: 'all',
    persons: [],
    names: []
  }

  const [visiblePermissions, setVisiblePermissions] = useState<RadioDataType>(defaultPermissions)
  const [managePermissions, setManagePermissions] = useState<RadioDataType>({
    ...defaultPermissions,
    type: 'part'
  })

  const [modalData, setModalData] = useState({
    labelSetName: '',
    labelSetId: 0
  })

  const hasChanged = useRef(false)

  useEffect(() => {
    if (data && modalProps?.visible) {
      hasChanged.current = false
      // 查看是格式化显示人
      if (modalType === 'view') {
        if (data.managePersonsSet) {
          setManagePermissions(() => (
            {
              ...managePermissions,
              names: findPersonNames(data.managePersonsSet)
            }
          ))
        }
        if (data.visiblePersonsSet) {
          setVisiblePermissions(() => (
            {
              ...visiblePermissions,
              names: findPersonNames(data.visiblePersonsSet)
            }
          ))
        }
      }

      if (modalType === 'edit') {
        setModalData({
          ...modalData,
          ...data
        })

        if (data.managePersonsSet) {
          setManagePermissions(() => (
            {
              ...managePermissions,
              type: data.managePermissionsSet,
              persons: data.managePersonsSet
            }
          ))
        }
        if (data.visiblePersonsSet) {
          setVisiblePermissions(() => (
            {
              ...visiblePermissions,
              type: data.visiblePermissionsSet,
              persons: data.visiblePersonsSet
            }
          ))
        }
      }
    }
  }, [props.data, modalProps?.visible])

  const findPersonNames = (ids: string[] = []) => {
    const names: string[] = []
    const _ids = new Set(ids)
    function df(arr: typeof receiverList) {
      arr.forEach(item => {
        if (_ids.has(item.id)) {
          names.push(item.name)
        }

        if (item.children && item.children.length) {
          df(item.children)
        }
      })
    }
    df(receiverList)
    return names
  }


  const handleOk = async () => {
    if (!modalData.labelSetName) {
      Message.warning('标签集名称不能设置为空')
      return
    }
    const ifDuplicate = await verifyDuplicate(modalData.labelSetName)
    if (!ifDuplicate) {
      Message.warning('该标签集名称已存在！')
      return
    }

    if (visiblePermissions.type === 'part' && !visiblePermissions.persons.length) {
      Message.warning('部分可见人员不能设置为空')
      return
    }

    if (managePermissions.type === 'part' && !managePermissions.persons.length) {
      Message.warning('部分管理人员不能设置为空')
      return
    }

    const form = {
      ...modalData,
      visiblePermissionsSet: visiblePermissions.type,
      managePermissionsSet: managePermissions.type,
      ...(visiblePermissions.type === 'part' ? {
        visiblePersonsSet: visiblePermissions.persons
      } : {}),
      ...(managePermissions.type === 'part' ? {
        managePersonsSet: managePermissions.persons
      } : {})
    }
    // 提交标签集 更新
    services.labelManage.updateLabelSet(form).then(res => {
      Message.success(res.message || '标签集更新成功')
      if (onModalConfirm && isFunction(onModalConfirm)) {
        onModalConfirm(form)
        resetModalData()
      }
    }).catch(err => {
      console.log(err)
      Message.error(err.message || '标签集更新失败')
    })
  }



  const filterTreeNode = useCallback((inputText: string, node: any) => {
    return node.props.title.toLowerCase().indexOf(inputText.toLowerCase()) > -1;
  }, []);

  const resetModalData = () => {
    setModalData({
      labelSetName: '',
      labelSetId: 0
    })
    setManagePermissions(defaultPermissions)
    setVisiblePermissions(defaultPermissions)
    hasChanged.current = false
  }

  // 验证标签集名称是否重复
  const verifyDuplicate = (value: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (value) {
        services.labelManage.checkLabelSetName({
          labelSetName: value,
          labelSetId: modalData.labelSetId || 0
        }).then(res => {
          const { exist } = res;
          resolve(!exist);
        }).catch(err => {
          console.log(err)
          resolve(false);
        })
      } else {
        resolve(true); // 如果值为空，返回 true, 不验证
      }
    });
  }

  const handleCancel = () => {
    if (modalProps && modalProps.onCancel && isFunction(modalProps.onCancel)) {
      modalProps.onCancel()
    }
    resetModalData()
  }

  const handleClose = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (modalProps && modalProps.onCancel && isFunction(modalProps.onCancel)) {
      modalProps.onCancel()
    }

    // 新建时候点击叉号不清空，编辑时候清空
    if (modalType === 'edit') {
      resetModalData()
    }
  };


  return (
    <Modal
      title={`${modalType === 'add' ? '新建' : modalType === 'edit' ? '编辑' : '查看'}标签集`}
      {...(modalProps || {})}
      className="label-set-modal"
      maskClosable={false}
      onOk={handleOk}
      // onCancel={handleCancel}
      {...(modalType === 'view' ? {
        footer: null
      } : {})}
      cancelButtonProps={{
        onClick: handleCancel
      }}
      // 需求，要求关闭按钮的事件与取消不一样
      closeIcon={<span className="close-icon" onClick={handleClose}><CloseOutlined /></span>}
    >
      <Form>
        <Form.Item label="标签集名称">
          {
            modalType === 'view' ?
              <div>{data.labelSetName || '--'}</div>
              :
              <Input
                maxLength={15}
                showWordLimit
                value={modalData.labelSetName}
                onChange={(e) => {
                  hasChanged.current = true
                  setModalData({
                    ...modalData,
                    labelSetName: e.target.value
                  })
                }}
                onBlur={async (e) => {
                  if (e.target.value && hasChanged.current) {
                    const ifDuplicate = await verifyDuplicate(modalData.labelSetName)
                    if (!ifDuplicate) {
                      Message.warning('该标签集名称已存在！')
                    }
                  }
                }}
              />
          }
        </Form.Item>
        <Form.Item label={"可见权限"}>
          {
            modalType === 'view' ?
              <span>
                {
                  data.visiblePermissionsSet === 'part' ?
                    <Tooltip
                      className="label-tooltip"
                      trigger="hover"
                      title={data.visiblePersonsSet ? visiblePermissions.names.join('、') : ''}>
                      {data.visiblePersonsSet ? visiblePermissions.names.join('、') : '--'}
                    </Tooltip>
                    : '全部用户'
                }
              </span>
              :
              <>
                <Radio.Group
                  size="mini"
                  // optionType="button"
                  options={switchData}
                  value={visiblePermissions.type}
                  onChange={(e) => {
                    setVisiblePermissions({
                      ...visiblePermissions,
                      type: e.target.value
                    });
                  }}
                />
                {
                  visiblePermissions.type === 'part' &&
                  <TreeSelect
                    placeholder="请选择"
                    showSearch
                    multiple
                    treeCheckable
                    fieldNames={{
                      key: "id",
                      title: "name",
                    }}
                    maxTagCount={2}
                    filterTreeNode={filterTreeNode}
                    value={visiblePermissions.persons}
                    treeData={receiverList}
                    treeCheckedStrategy="child"
                    onChange={(value) => {
                      // console.log(value);
                      setVisiblePermissions({
                        ...visiblePermissions,
                        persons: value
                      });
                    }}
                    treeProps={{
                      isVirtual: true,
                      virtualListProps: { height: 250 }
                    }}
                  />
                }
              </>
          }
        </Form.Item>
        <Form.Item
          label={<Tooltip
            className="label-tooltip"
            trigger="hover"
            title="管理权限包含：标签集编辑、删除">管理权限<Icon type="bangzhu" /></Tooltip>}
        >
          {
            modalType === 'view' ?
              <span>
                {
                  data.managePermissionsSet === 'part' ?
                    <Tooltip
                      className="label-tooltip"
                      trigger="hover"
                      title={data.managePersonsSet ? managePermissions.names.join('、') : ''}
                    >
                      {data.managePersonsSet ? managePermissions.names.join('、') : '--'}
                    </Tooltip>
                    : '全部用户'
                }
              </span>

              :
              <>
                <Radio.Group
                  size="mini"
                  // optionType="button"
                  options={switchData}
                  value={managePermissions.type}
                  onChange={(e) => {
                    setManagePermissions({
                      ...managePermissions,
                      type: e.target.value
                    });
                  }}
                />
                {
                  managePermissions.type === 'part' &&
                  <TreeSelect
                    placeholder="请选择"
                    showSearch
                    multiple
                    treeCheckable
                    fieldNames={{
                      key: "id",
                      title: "name",
                    }}
                    maxTagCount={2}
                    filterTreeNode={filterTreeNode}
                    value={managePermissions.persons}
                    treeData={receiverList}
                    treeCheckedStrategy="child"
                    onChange={(value, extra) => {
                      console.log(value, extra);
                      setManagePermissions({
                        ...managePermissions,
                        persons: value
                      });
                    }}
                    treeProps={{
                      isVirtual: true,
                      virtualListProps: { height: 250 }
                    }}
                  />
                }
              </>
          }
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default LabelSetModal