import './index.scss'
import { Tabs, Table, Button, Input, Checkbox, Pagination, Modal, Radio, PopConfirm, Message, Tooltip } from "@yisa/webui"
import { TimeRangePicker } from '@/components'
import { Icon } from '@yisa/webui/es/Icon'
import { useEffect, useState, useCallback } from 'react'
import dictionary from "@/config/character.config";
import type { PaginationProps } from "@yisa/webui/es/Pagination/interface";
import { RadioChangeEvent } from '@yisa/webui/es/Radio/interface'
import services, { ApiResponse } from "@/services";
import { useLocation } from 'react-router-dom'
import { DatesParamsType, } from "@/components/TimeRangePicker/interface";
import { useDispatch, useSelector, RootState } from '@/store';
import dayjs from 'dayjs'
const { Search, TextArea } = Input
enum AuthApproveTypes {
  Approve = '2',//待审批
  Passed = '1',//已通过
  Reject = '3',//已驳回
  Revoke = '4',//已撤销
  Expire = '5'//已过期
}
interface AuditDataTypes {
  "id": number,
  "uid": string,
  "submitName": string,
  "unit": string,
  "queryInfo": string,
  "reason": string,
  "startTime": string,
  "endTime": string,
  "createTime": string,
  "approvalUid": string,
  "approvalName": string,
  "approvalTime": string,
  "approvalMsg": string,
  "status": number,
  "isSelf": number,
  "url": string
  isView: number
  key: string
}
interface FormDataTypes {
  queryInfo: string,
  activeKey: AuthApproveTypes,
  pageNo: number,
  pageSize: number
}
const AuthStatusTextSetting = {
  // revoke: {
  //   text: "已撤销",
  //   iconfont: "yishibai",
  //   backgroundColor: "#FF5B4D1A",
  // },
  '1': {
    text: "已通过",
    iconfont: "chenggong",
    backgroundColor: "rgba(0,204,102,0.1)",
  },
  '3': {
    text: "已驳回",
    iconfont: "shibai",
    backgroundColor: "#FF5B4D1A",
  },
  // approve: {
  //   text: "待审批",
  //   iconfont: "daishenpi",
  //   backgroundColor: "#3377FF1A",
  // },
  // expire: {
  //   text: "已过期",
  //   iconfont: "yishibai",
  //   backgroundColor: "#FF5B4D1A",
  // }
};

const AuthApprove = () => {
  const prefixCls = 'auth-approve'
  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig['auth-approve'] || {}
  });
  // 是否是管理员权限
  const [isAuthLog, setIsAUthLog] = useState<boolean>(false)

  // url携带数据
  const location = useLocation()
  // 查询信息-无权限时跳转至本页面提交审批
  let personData: AuditDataTypes = {
    "id": 0,
    "uid": '',
    "submitName": '',
    "unit": '',
    "queryInfo": '',
    "reason": '',
    "startTime": '',
    "endTime": '',
    "createTime": '',
    "approvalUid": '',
    "approvalName": '',
    "approvalTime": '',
    "approvalMsg": '',
    "status": 0,
    "isSelf": 0,
    isView: 0,
    "url": '',
    key: ''
  }
  if (location.search) {
    personData = JSON.parse(decodeURIComponent(location.search?.split('?')[1]))
    console.log(JSON.parse(decodeURIComponent(location.search?.split('?')[1])), 'location');
  }

  // 数据请求loading
  const [loading, setLoading] = useState<boolean>(false);

  // 审批表格数据
  const [approveData, setApproveData] = useState<ApiResponse<AuditDataTypes[]>>({
    data: [],
    totalRecords: 0,
    usedTime: 0
  })

  // 缓存表格数据
  const activeNightItems = approveData.data ?? [];
  // 表格已选择数据
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);

  // 请求参数
  const [formData, setFormData] = useState<FormDataTypes>({
    queryInfo: '',
    activeKey: AuthApproveTypes.Approve,
    pageNo: 1,
    pageSize: dictionary.pageSizeOptions[0],
  })

  // 修改审批类型
  const handleChangeMoreKey = (key: string) => {
    let newForm = Object.assign({}, formData, {
      activeKey: key,
      pageNo: 1
    })
    setSelectedRowKeys([]);
    setFormData(newForm)
    handleSearch(newForm)
  }

  // 申请信息
  const [approveInfo, setApproveInfo] = useState<AuditDataTypes>({
    "id": 0,
    "uid": '',
    "submitName": '',
    "unit": '',
    "queryInfo": '',
    "reason": '',
    "startTime": '',
    "endTime": '',
    "createTime": '',
    "approvalUid": '',
    "approvalName": '',
    "approvalTime": '',
    "approvalMsg": '',
    "status": 0,
    "isSelf": 0,
    isView: 0,
    "url": '',
    key: ''
  })

  // 审批/重新提交类型1 为单选  2 为多选
  const [approveType, setApproveType] = useState<string>('1')

  // 修改关键词查询
  const handleChangeSearch = () => {
    handleSearch()
  }
  // 更新已读状态
  const changeMsgStatus = () => {
    services.record.changeMsgStatus()
      .then(res => {
        console.log(res);
      })
  }
  // 检索结果数据
  const handleSearch = (ajaxData: FormDataTypes = formData) => {
    setLoading(true)
    services.record.getAuditLists<FormDataTypes & { status: AuthApproveTypes }, AuditDataTypes[]>({
      ...ajaxData,
      status: ajaxData.activeKey,
    })
      .then(res => {
        setLoading(false)
        setApproveData(res)
      })
      .catch(err => {
        console.log(err);
        setLoading(false)
      })
  }

  useEffect(() => {
    // 首次没权限 提交审批
    if (personData.queryInfo) {
      Message.warning('暂无访问权限，请先提交审批！')
      setSubmitApproveVisible(true)
      setApproveInfo(personData)
    }
    handleSearch()
    services.record.getAdminAuth<any, boolean>()
      .then(res => {
        if (res.data) {
          setIsAUthLog(res.data)
          changeMsgStatus()
        }
      })
  }, [])

  // 撤销审批单
  const handleRevoke = (data?: AuditDataTypes) => {
    let id;
    if (data) {
      id = data.id
    } else {
      id = selectedRowKeys.join(',')
    }
    services.record.revokeAudit({ id })
      .then(res => {
        console.log(res);
        setSelectedRowKeys([])
        let newForm = Object.assign({}, formData, {
          activeKey: AuthApproveTypes.Revoke
        })
        setFormData(newForm)
        handleSearch(newForm)
      })
  }
  const approveColumns = [
    {
      title: '序号',
      dataIndex: 'idnex',
      width: 80,
      render(_: number, __: AuditDataTypes, index: number) {
        return (formData.pageNo - 1) * formData.pageSize + (index + 1)
      },
    },
    {
      title: '提交人',
      dataIndex: 'submitName',
    },
    {
      title: '所属部门',
      dataIndex: 'unit',
    },
    {
      title: '查询信息',
      dataIndex: 'queryInfo',
      render(text: string, record: AuditDataTypes) {
        if (isAuthLog || (formData.activeKey == AuthApproveTypes.Passed && record.isView)) {
          return <a href={record.url} className="record-link" target="_blank">{text}</a>
        } else {
          return <div>{text}</div>
        }
      }
    },
    {
      title: '申请查询时间范围',
      dataIndex: 'startTime',
      render(text: string, record: AuditDataTypes) {
        return <div>{record.startTime}-{record.endTime}</div>
      }
    },
    {
      title: '查询原因',
      dataIndex: 'reason',
    },
    {
      title: '提交时间',
      dataIndex: 'createTime',
    },
  ]
  const revokeColumns = [
    {
      title: '撤销时间',
      dataIndex: 'revokeTime',
      render(text: string, record: AuditDataTypes) {
        return <div>{text}</div>
      }
    }
  ]
  const opinionColumns = [
    {
      title: '审批人',
      dataIndex: 'approvalName',
    },
    {
      title: '审批意见',
      dataIndex: 'approvalMsg',
      // render(_: any, record: AuditDataTypes) {
      //   return <span
      //     style={{
      //       borderRadius: '4px',
      //       width: "80px",
      //       height: "29px",
      //       display: "inline-flex",
      //       alignItems: "center",
      //       justifyContent: "center",
      //       background: AuthStatusTextSetting[formData.activeKey]?.backgroundColor,
      //     }}
      //   >
      //     <Icon type={AuthStatusTextSetting[formData.activeKey]?.iconfont} />
      //     {AuthStatusTextSetting[formData.activeKey]?.text}
      //   </span>
      // }
    }
  ]
  const optionsColumns = [
    {
      title: '操作',
      dataIndex: 'option',
      render(_: any, record: AuditDataTypes) {
        return <div>
          {
            isAuthLog ?
              <Button type="default" size='mini' onClick={() => {
                setApproveVisible(true)
                setApproveInfo(record)
                setApproveType('1')
              }}>审批</Button>
              :
              formData.activeKey == AuthApproveTypes.Approve ?
                <PopConfirm
                  title={<span>确认要撤销这条任务吗？</span>}
                  onConfirm={() => handleRevoke(record)}
                >
                  <Button type="danger" size='mini'>撤销</Button>
                </PopConfirm>
                :
                <Button type="default" size='mini' onClick={() => {
                  setIsResetSubmit(true)
                  setSubmitApproveVisible(true)
                  setApproveInfo(record)
                  setApproveType('1')
                }}>重新提交</Button>
          }
        </div>
      }
    }
  ]

  // 底部全选checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowKeys(activeNightItems.map((item: AuditDataTypes) => item.id));
    } else {
      setSelectedRowKeys([]);
    }
  };
  // 勾选
  const handleSelectedChange = useCallback(
    (newSelectedRowKeys: (string | number)[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    []
  );
  // 分页切换
  const handlePageChange: PaginationProps["onChange"] = (current, pageSize) => {
    // 先判断页面大小是否改变(必须)
    let newFormData: FormDataTypes;
    if (pageSize !== formData.pageSize) {
      newFormData = {
        ...formData,
        pageNo: 1,
        pageSize: pageSize,
      };
    } else {
      // 页号改变
      newFormData = {
        ...formData,
        pageNo: current,
        pageSize: pageSize,
      };
    }
    setFormData(newFormData);
    handleSearch(newFormData)
  };

  // 全部审批
  const hanedleApproveAll = () => {
    setApproveVisible(true)
    setApproveType('2')
  }
  // 全部重新提交
  const hanedleSubmitAll = () => {
    setIsResetSubmit(true)
    setApproveType('2')
    setSubmitApproveVisible(true)
  }

  let defaultApproveForm = {
    approveType: '1',
    approveReason: '',
    approveInfo: '',
    beginDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().add(Number(pageConfig.inquiryTime?.default || 6) - 1, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  }
  // 审批请求数据
  const [approveForm, setApproveForm] = useState(defaultApproveForm)
  // 审批弹窗
  const [approveVisible, setApproveVisible] = useState<boolean>(false)

  const handleChangeRadio = (e: RadioChangeEvent) => {
    setApproveForm(Object.assign({}, approveForm, {
      approveType: e.target.value
    }))
  }
  // 确认审批意见
  const handleApprove = () => {
    setApproveVisible(false)
    services.record.auditMessage({
      approvalMsg: approveForm.approveReason,
      status: approveForm.approveType,
      ids: approveType == '1' ? approveInfo?.id : selectedRowKeys.join(',')
    })
      .then(res => {
        console.log(res);
        setApproveForm(defaultApproveForm)
        setSelectedRowKeys([])
        handleSearch()
      })
  }

  const handleDateChange = (dates: DatesParamsType) => {
    setApproveForm({
      ...approveForm,
      beginDate: dates.beginDate,
      endDate: dates.endDate,
    });
  };
  // 是否重新提交
  const [isResetSubmit, setIsResetSubmit] = useState<boolean>(false)
  // 提交审批弹窗
  const [submitApproveVisible, setSubmitApproveVisible] = useState<boolean>(false)
  // 确认提交审批
  const handleSubmitApprove = () => {
    if (!approveForm.beginDate || !approveForm.endDate) {
      Message.warning('请选择查询时间范围')
      return
    }
    let dateRangeMax = Number(pageConfig.inquiryTime?.max || 0)
    if (dateRangeMax) {
      let timeDiff = dayjs(approveForm.endDate).diff(dayjs(approveForm.beginDate), 'days') + 1
      if (timeDiff > dateRangeMax) {
        Message.warning(`请选择时间范围在${dateRangeMax}日内！`)
        return
      }
    }
    if (!approveForm.approveReason) {
      Message.warning('请输入查询原因')
      return
    }
    let ajaxData: any = {
      id: (approveInfo?.id || '') + '',
      startTime: approveForm.beginDate,
      queryReason: approveForm.approveReason,
      endTime: approveForm.endDate,
      key: approveInfo.key || '',
      url: isResetSubmit ? approveInfo.url : `${window.YISACONF.staticUrl}#/record-detail-person?${encodeURIComponent(JSON.stringify({ ...personData }))}`,
    }
    // 多选
    if (approveType == '2' && approveData.data) {
      ajaxData.url = ''
      ajaxData.id = selectedRowKeys.join(',')
    } else {
      ajaxData.queryInfo = approveInfo?.queryInfo || ''
    }
    services.record.submitApprove(ajaxData)
      .then(res => {
        console.log(res);
        setApproveForm(defaultApproveForm)
        setSubmitApproveVisible(false)
        handleSearch()
      })
      .catch(err => {
        setSubmitApproveVisible(false)
      })
  }
  const disabledDate = (current: any) => {
    return current && current < dayjs().startOf('day')
  }
  return <div className={`${prefixCls}`}>
    <Tabs
      className={`${prefixCls}-tab`}
      defaultActiveKey={formData.activeKey}
      activeKey={formData.activeKey}
      type='line'
      onChange={handleChangeMoreKey}
      data={[
        { key: AuthApproveTypes.Approve, name: '待审批', disabled: loading },
        { key: AuthApproveTypes.Passed, name: '已通过', disabled: loading },
        { key: AuthApproveTypes.Reject, name: '已驳回', disabled: loading },
        { key: AuthApproveTypes.Revoke, name: '已撤销', disabled: loading },
        { key: AuthApproveTypes.Expire, name: '已过期', disabled: loading },
      ]}
    />
    <div className={`${prefixCls}-search-input`}>
      <Search
        searchButton
        allowClear
        defaultValue={formData.queryInfo}
        placeholder="关键词搜索查询信息"
        style={{ width: 350 }}
        onChange={e => setFormData(Object.assign({}, formData, {
          queryInfo: e.target.value
        }))}
        onPressEnter={handleChangeSearch}
      />
    </div>
    <div className={`${prefixCls}-content`}>
      <div className="result-total">
        共<span>{approveData.totalRecords}</span>条数据，用时<span>{approveData.usedTime}</span>秒
      </div>
      <Table
        loading={loading}
        rowSelection={
          isAuthLog
            ? [AuthApproveTypes.Passed, AuthApproveTypes.Reject, AuthApproveTypes.Revoke, AuthApproveTypes.Expire].includes(formData.activeKey)
              ? undefined
              : {
                selectedRowKeys: selectedRowKeys,
                onChange: handleSelectedChange,
              }
            : AuthApproveTypes.Passed == formData.activeKey
              ? undefined
              : {
                selectedRowKeys: selectedRowKeys,
                onChange: handleSelectedChange,
              }
        }
        // rowSelection={
        //   [AuthApproveTypes.Approve, AuthApproveTypes.Reject, AuthApproveTypes.Revoke, AuthApproveTypes.Expire].includes(formData.activeKey)
        //     ? {
        //       selectedRowKeys: selectedRowKeys,
        //       onChange: handleSelectedChange,
        //     }
        //     :
        //     undefined}
        rowKey="id"
        className="auth-table"
        data={approveData.data}
        columns={
          formData.activeKey == AuthApproveTypes.Approve
            ? [...approveColumns, ...optionsColumns]
            : formData.activeKey == AuthApproveTypes.Passed
              ? [...approveColumns, ...opinionColumns]
              : formData.activeKey == AuthApproveTypes.Reject
                ? isAuthLog ? [...approveColumns, ...opinionColumns] : [...approveColumns, ...opinionColumns, ...optionsColumns]
                : formData.activeKey == AuthApproveTypes.Revoke
                  ? isAuthLog ? [...approveColumns, ...revokeColumns] : [...approveColumns, ...revokeColumns, ...optionsColumns]
                  : isAuthLog ? approveColumns : [...approveColumns, ...optionsColumns]
        }
        noDataElement={
          <div className="table-no-data">
            {/* <img src={noData} alt="" /> */}
            <div className="no-data-img"></div>
            {/* <Icon type="zanwushujuqianse" /> */}
            <div> 暂无数据</div>
          </div>
        }
      />
    </div>
    <div className={`${prefixCls}-page-bottom`}>
      <div className="left">
        {
          isAuthLog
            ? formData.activeKey == AuthApproveTypes.Approve
              ? <div>
                <Checkbox
                  className="card-checked"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  checked={
                    !!selectedRowKeys.length &&
                    selectedRowKeys.length === activeNightItems.length
                  }
                  indeterminate={
                    !!selectedRowKeys.length &&
                    selectedRowKeys.length !== activeNightItems.length
                  }
                >
                  全选
                </Checkbox>
                已经选择<span className="num">{selectedRowKeys.length}</span>项
              </div>
              : null
            :
            formData.activeKey == AuthApproveTypes.Passed
              ? null
              : <div>
                <Checkbox
                  className="card-checked"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  checked={
                    !!selectedRowKeys.length &&
                    selectedRowKeys.length === activeNightItems.length
                  }
                  indeterminate={
                    !!selectedRowKeys.length &&
                    selectedRowKeys.length !== activeNightItems.length
                  }
                >
                  全选
                </Checkbox>
                已经选择<span className="num">{selectedRowKeys.length}</span>项
              </div>
        }
        {
          isAuthLog
            ? formData.activeKey == AuthApproveTypes.Approve
              ? <Button type="default" size='mini' onClick={hanedleApproveAll} disabled={!selectedRowKeys.length}>全部审批</Button>
              : null
            : formData.activeKey == AuthApproveTypes.Approve
              ? <PopConfirm
                title={<span>确认要撤销这些任务吗？</span>}
                onConfirm={() => handleRevoke()}
              >
                <Button type="default" size='mini' disabled={!selectedRowKeys.length}>全部撤销</Button>
              </PopConfirm>
              : formData.activeKey == AuthApproveTypes.Passed
                ? null
                : <Button type="default" size='mini' onClick={hanedleSubmitAll} disabled={!selectedRowKeys.length}>全部提交</Button>
        }
      </div>
      <Pagination
        disabled={!approveData.totalRecords || loading}
        showSizeChanger
        showQuickJumper
        showTotal={() => `共 ${approveData.totalRecords} 条`}
        total={approveData.totalRecords}
        current={formData.pageNo}
        pageSize={formData.pageSize}
        pageSizeOptions={dictionary.pageSizeOptions}
        onChange={handlePageChange}
      />
    </div>
    <Modal
      title="审批"
      visible={approveVisible}
      width={570}
      className={`${prefixCls}-approve-modal`}
      onCancel={() => {
        setApproveVisible(false)
        setApproveForm(defaultApproveForm)
      }}
      onOk={handleApprove}
    >
      <div className="content">
        <div className="approve-item opinion ">
          <div className="label">审批结果：</div>
          <div className="value">
            <Radio.Group options={[{ label: '通过', value: '1' }, { label: '驳回', value: '3' }]} onChange={handleChangeRadio} value={approveForm.approveType} />
          </div>
        </div>
        <div className="approve-item reason">
          <div className="label">审批意见：</div>
          <div className="value">
            <TextArea
              value={approveForm.approveReason}
              onChange={e => setApproveForm(Object.assign({}, approveForm, {
                approveReason: e.target.value
              }))}
              placeholder='请输入原因'
              style={{ width: 335 }}
              autoSize={{ minRows: 4 }}
              maxLength={30}
              showWordLimit
            />
          </div>
        </div>
      </div>
    </Modal>
    <Modal
      title={`${!isResetSubmit ? "提交审批" : '重新提交'}`}
      visible={submitApproveVisible}
      width={570}
      className={`${prefixCls}-submit-approve-modal`}
      onCancel={() => {
        setSubmitApproveVisible(false)
        setApproveForm(defaultApproveForm)
      }}
      maskClosable={isResetSubmit}
      onOk={handleSubmitApprove}
    >
      <div className="content">
        <div className="approve-item info ">
          <div className="label">申请信息：</div>
          <div className="value">
            {
              approveType == '2' && approveData?.data ?
                approveData.data.filter((ele: AuditDataTypes) => selectedRowKeys.includes(ele.id))
                  .slice(0, 3).map(i => {
                    return <div>{i.queryInfo}
                    </div>
                  })
                :
                approveInfo.queryInfo
            }
            <div className="more-queryInfo">
              {
                (approveData?.data && approveType == '2') && selectedRowKeys.length > 3 ?
                  <Tooltip title={
                    <div>
                      {
                        approveData.data.filter((ele: AuditDataTypes) => selectedRowKeys.includes(ele.id))
                          .slice(3).map((ele: AuditDataTypes) => {
                            return <div>{ele.queryInfo}</div>
                          })
                      }
                    </div>
                  }>
                    共{selectedRowKeys.length}条
                  </Tooltip>
                  : ''
              }
            </div>
          </div>
        </div>
        <div className="approve-item time">
          <div className="label"><span>*</span></div>
          <div className="value">
            <TimeRangePicker
              showTimeType={false}
              formItemProps={{ label: '申请查询时间：' }}
              beginDate={approveForm.beginDate}
              endDate={approveForm.endDate}
              onChange={handleDateChange}
              disabledDate={disabledDate}
              futureFirst={true}
              showYesterday={false}
            />
          </div>
        </div>
        <div className="approve-item reason">
          <div className="label"><span>*</span>查询原因：</div>
          <div className="value">
            <TextArea
              value={approveForm.approveReason}
              onChange={e => setApproveForm(Object.assign({}, approveForm, {
                approveReason: e.target.value
              }))}
              placeholder='请输入原因'
              autoSize={{ minRows: 4 }}
              style={{ width: 335 }}
              maxLength={30}
              showWordLimit
            />
          </div>
        </div>
      </div>
    </Modal>
  </div>
}
export default AuthApprove
