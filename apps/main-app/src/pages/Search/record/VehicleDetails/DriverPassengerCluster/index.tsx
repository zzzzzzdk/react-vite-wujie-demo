import React, { useState } from 'react'
import { Modal, Pagination, Message } from '@yisa/webui'
import { ExclamationOutlined } from '@yisa/webui/es/Icon'
import { ResultBox } from '@yisa/webui_business';
import { Card, BigImg, Panel } from '@/components'
import ajax, { ApiResponse } from "@/services";
import dictionary from '@/config/character.config'
import omit from '@/utils/omit';
import type { DriverPassengerClusterType } from '../interface';
import type { ClusterCardType } from '@/components/Card/ClusterCard/interface';
import type { ResultRowType } from '@/pages/Search/Target/interface';
import type { DriverPassengerClusterFormDataType } from './interface'
import './index.scss'
import RecordDetailNoData from '../components/RecordDetailNoData';
export default function DriverPassengerCluster(props: { data?: DriverPassengerClusterType }) {
  const {
    data,
  } = props
  const prefixCls = "driver-passenger-cluster"
  const titleMap = {
    "details": "聚类详情",
    "connect": "手动关联身份"
  }
  const [ajaxLoading, setAjaxLoading] = useState(false)
  //卡片大图显隐
  const [clusterModalVisible, setClusterModalVisible] = useState(false)
  const [curModalType, setCurModalType] = useState("details")
  // 聚类大图详情卡片数据
  const [clusterDetailData, setClusterDetailData] = useState<ApiResponse<ResultRowType[]>>({
    data: [],
    totalRecords: 0
  })
  // 聚类大图关联卡片数据
  const [connectData, setConnectData] = useState<ClusterCardType["data"][]>([])

  const defaultFormData = {
    groupPlateId: "",
    feature: "",
    pageNo: 1,
    pageSize: dictionary.pageSizeOptions[0]
  }

  const [formData, setFormData] = useState<DriverPassengerClusterFormDataType>(defaultFormData)

  const [bigImgModal, setBigImgModal] = useState({
    visible: false,
    currentIndex: 0
  })


  //获取弹窗卡片数据
  const getCardResult = (form: DriverPassengerClusterFormDataType, type: "details" | "connect" = "details") => {
    setAjaxLoading(true)
    if (type === "details") {
      ajax.recordVehicle.getClusterDetails<DriverPassengerClusterFormDataType, ResultRowType[]>(omit(form, ["feature"]))
        .then(res => {
          setAjaxLoading(false)
          setClusterDetailData(res)
        })
        .catch(err => {
          setClusterDetailData({
            data: []
          })
          setAjaxLoading(false)
        })
    }
    if (type === "connect") {
      ajax.recordVehicle.getClusterIdentityComparison<DriverPassengerClusterFormDataType, ClusterCardType["data"][]>(omit(form, ["pageNo", "pageSize"]))
        .then(res => {
          setAjaxLoading(false)
          setConnectData(res.data || [])
        })
        .catch(err => {
          setConnectData([])
          setAjaxLoading(false)
        })
    }

  }
  //关联身份查询
  const handleIdentityComparison = (data: ClusterCardType["data"]) => {
    setCurModalType("connect")
    setClusterModalVisible(true)
    const { groupPlateId, feature } = data
    setFormData({ ...defaultFormData, groupPlateId, feature })
    setClusterDetailData({ data: [] })
    getCardResult({ ...defaultFormData, groupPlateId, feature }, "connect")
  }
  //驾乘聚类卡片被点击
  const handleImgClick = (data: ClusterCardType["data"]) => {
    setCurModalType("details")
    setClusterModalVisible(true)
    const { groupPlateId } = data
    setFormData({ ...defaultFormData, groupPlateId })
    //把另外一个卡片数据清空
    setConnectData([])
    getCardResult({ ...defaultFormData, groupPlateId })

  }

  const handleConfirm = (data: ClusterCardType["data"]) => {
    ajax.recordVehicle.confirmClusterIdentify<ClusterCardType["data"], null>({
      ...data,
      groupPlateId: formData.groupPlateId
    })
      .then(res => {
        Message.success(res?.message || "成功")
      })
      .catch(err => {
        Message.error(err?.message || "成功")
      })
  }
  //确认关联身份
  const handleConfirmConnect = (data: ClusterCardType["data"]) => {
    Modal.confirm({
      wrapClassName: "driver-passenger-cluster-confirm",
      title: '确认关联提示',
      okText: '确认',
      cancelText: '取消',
      content: <div className="padding-top-bottom-xxl"><ExclamationOutlined /><span>是否关联此人？</span></div>,
      closable: true,
      onOk: () => {
        setClusterModalVisible(false)
        handleConfirm(data)
      }
    });
  }
  // 分页改变
  const handleChangePn = (pn: number, pageSize: number) => {
    let newForm = formData.pageSize === pageSize ? { pageNo: pn } : { pageNo: 1, pageSize }
    //用户页面展示
    setFormData({ ...formData, ...newForm })
    getCardResult({ ...formData, ...newForm })
  }
  // 大图展示
  const handleOpenBigImg = (index: number) => {
    setBigImgModal({
      visible: true,
      currentIndex: index
    })
  }

  const handleCloseBigImg = () => {
    setBigImgModal({
      visible: false,
      currentIndex: 0
    })
  }

  return (
    <div className={`${prefixCls}`}>
      {/* <Panel title="驾驶人聚类"> */}
      {
        data?.length ?
          <div className="cluster-container">
            {
              data?.map(item => <Card.ClusterCard
                key={item.groupPlateId}
                data={item}
                onFooterBtnClick={handleIdentityComparison}
                onImgClick={handleImgClick}
                showFooterBtn={!item.idcard}
              />)
            }
          </div>
          :
          <RecordDetailNoData />
      }
      {/* </Panel> */}
      {/* <Panel title="乘坐人聚类">
        {
          passenger?.length ?
            <div className="cluster-container">
              {
                passenger?.map(item => <Card.ClusterCard
                  key={item.groupPlateId}
                  data={item}
                  onFooterBtnClick={handleIdentityComparison}
                  onImgClick={handleImgClick}
                />)
              }
            </div>
            :
            <RecordDetailNoData />
        }
      </Panel> */}
      <Modal
        title={titleMap[curModalType]}
        visible={clusterModalVisible}
        footer={null}
        onCancel={() => setClusterModalVisible(false)}
        className="driver-passenger-cluster-modal"
        width={curModalType === "details" ? 1344 : 1200}
      >
        <ResultBox
          loading={ajaxLoading}
          nodata={!clusterDetailData?.data?.length && !connectData.length}
        >
          <>
            <div className={`${curModalType === "details" ? "card-container" : "card-container connect"}`}>
              {
                curModalType === "details" ?
                  clusterDetailData?.data?.map((item, index) => <Card.Normal
                    showChecked={false}
                    hasfooter={false}
                    key={index}
                    cardData={item}
                    onImgClick={() => { handleOpenBigImg(index) }}
                    locationCanClick={false}
                  />)
                  :
                  connectData.map(item => <Card.ClusterCard
                    data={item}
                    key={item.groupPlateId}
                    onFooterBtnClick={handleConfirmConnect}
                    footerBtnText="关联"
                    imgCursor="default"
                  />)
              }
            </div>
            {
              curModalType === "details" && <Pagination
                disabled={ajaxLoading}
                showSizeChanger
                showQuickJumper
                showTotal={() => `共 ${clusterDetailData.totalRecords} 条`}
                total={clusterDetailData.totalRecords}
                current={formData.pageNo}
                pageSize={formData.pageSize}
                pageSizeOptions={dictionary.pageSizeOptions}
                onChange={handleChangePn}
              />
            }
          </>
        </ResultBox>
      </Modal>
      <BigImg
        modalProps={{
          visible: bigImgModal.visible,
          onCancel: handleCloseBigImg
        }}
        currentIndex={bigImgModal.currentIndex}
        data={clusterDetailData.data || []}
        disabledAssociateTarget={true}
        onIndexChange={(index) => {
          setBigImgModal({
            visible: true,
            currentIndex: index
          })
        }}
      />
    </div>)
}
