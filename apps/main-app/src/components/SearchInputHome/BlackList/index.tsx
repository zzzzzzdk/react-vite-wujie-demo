import './index.scss'
import React, { useState } from 'react'
import { Card, ImgZoom } from '@/components'
import { ResultRowType } from '@/pages/Search/Target/interface'
import { Icon, } from '@yisa/webui/es/Icon'
import { Button, Tabs, Tag, Modal, Pagination, Checkbox, Loading } from "@yisa/webui"
import { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox'
import dictionary from '@/config/character.config'
import type { PaginationProps } from "@yisa/webui/es/Pagination/interface";
import character from "@/config/character.config";
import ajax, { ApiResponse } from '@/services'
import { useSelector, RootState } from '@/store';
import noDataDark from '@/assets/images/image/search-nodata-dark.png'
import noDataLight from '@/assets/images/image/search-nodata-light.png'
import { PageTypes } from '../interface'

const BlackList = (props: any) => {
  const prefixCls = 'black-lists'
  const { skin } = useSelector((state: RootState) => {
    return state.comment
  });

  /* **********黑名单库*********** */
  let defaultPage = {
    pageNo: 1,
    pageSize: character.pageSizeOptions[0],
  }
  // 黑名单分页
  const [blackPage, setBlackPage] = useState<PageTypes>(defaultPage)

  // 加载loading
  const [ajaxBlackLoading, setBlackAjaxLoading] = useState(false)
  const [blackVisible, setBlackVisible] = useState<boolean>(false)
  // 黑名单数据
  const [blackListData, setBlackListData] = useState<ApiResponse<any[]>>({
    data: [],
    totalRecords: 10
  })
  // 获取黑名单数据
  const getBlackListsData = (page: PageTypes = blackPage, type: string = blackActiveKey) => {
    setCaptureCount(0)
    setBlackAjaxLoading(true)
    ajax.record.getBlackLists<PageTypes & { clusterType: string }, any>({ ...page, clusterType: type })
      .then(res => {
        setBlackAjaxLoading(false)
        setBlackListData(res)
      })
      .catch(err => {
        setBlackAjaxLoading(false)
        setBlackListData({
          data: [],
          totalRecords: 0
        })
      })
  }
  const handleOpenBlackList = () => {
    getBlackListsData(defaultPage, '1')
    setBlackVisible(true)
  }

  // 黑名单列表类型
  const [blackActiveKey, setBlackActiveKey] = useState<string>('1')
  const handleChangeBlackActive = (v: string) => {
    setBlackActiveKey(v)
    setBlackPage(defaultPage)
    getBlackListsData(defaultPage, v)
  }

  // 是否全选
  const [allChecked, setAllChecked] = useState(false)
  // 已选中黑名单数据
  const [checkedLists, setCheckedLists] = useState<any[]>([])
  // 全选
  const handleChangeAllChecked = (e: CheckboxChangeEvent) => {
    setAllChecked(e.target.checked)
    if (e.target.checked) {
      setCheckedLists(blackListData.data || [])
    } else {
      setCheckedLists([])
    }
  }
  // 更改是否选中状态
  const handleChangeBlack = ({ cardData, checked }: { cardData: ResultRowType, checked: boolean }) => {
    if (checked) {
      let lists = [...checkedLists, cardData]
      if (lists.length == blackListData.data?.length) setAllChecked(true)
      setCheckedLists(lists)
    } else {
      let lists = checkedLists.filter(ele => ele.blackId != cardData.blackId)
      if (!lists.length) setAllChecked(false)
      setCheckedLists(lists)
    }
  }
  // 批量删除黑名单
  const handleBatchDelte = () => {
    let ids = checkedLists.map(ele => ele.blackId).join(',')
    ajax.record.delBlackLists({ ids })
      .then(res => {
        getBlackListsData()
        setCheckedLists([])
        setAllChecked(false)
      })
  }
  // 修改分页
  const handlePageChange: PaginationProps["onChange"] = (current, pageSize) => {
    let newFormData;
    if (pageSize !== blackPage.pageSize) {
      // console.log("pageSize", current, pageSize);
      newFormData = {
        ...blackPage,
        pageNo: 1,
        pageSize: pageSize,
      };
    } else {
      // 页号改变
      console.log("page", current, pageSize);
      newFormData = {
        ...blackPage,
        pageNo: current,
        pageSize: pageSize,
      };
    }
    setBlackPage(newFormData)
    getBlackListsData(newFormData)
  }
  // 分页配置
  const paginationConfig: PaginationProps = {
    current: blackPage.pageNo,
    pageSize: blackPage.pageSize,
    total: blackListData.totalRecords,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: dictionary.pageSizeOptions,
    onChange: handlePageChange,
  };

  // 抓拍图像
  const [captureCount, setCaptureCount] = useState(0)
  // 获取抓拍数据数据
  const getPortraitFaceData = (id?: string) => {
    setBlackAjaxLoading(true)
    ajax.record.getPortraitFaceData<any, any[]>({
      clusterType: blackActiveKey,
      groupBy: '-1',
      groupId: id,
      groupBlack: true
    })
      .then(res => {
        setBlackAjaxLoading(false)
        setBlackListData(res)
      })
      .catch(() => {
        setBlackAjaxLoading(false)
        setBlackListData({
          data: [],
          totalRecords: 0
        })
      })
  }
  // 点击抓拍图像数量
  const handleCaptureClick = (data: any) => {
    setCaptureCount(data.captureCount)
    getPortraitFaceData(data.groupId)
  }

  // 聚合弹窗visible
  const [faceCluterVisible, setFaceCluterVisible] = useState(false)
  // 聚合数据请求loading
  const [faceCluterLoading, setFaceCluterLoading] = useState(false)
  // 聚合弹窗数据
  const [faceCluterData, setFaceCluterData] = useState<ApiResponse<ResultRowType[]>>({
    data: []
  })
  // 获取人脸聚类数据
  const getPortraitFaceCluterData = (formData: any) => {
    setFaceCluterLoading(true)
    ajax.record.getPortraitFaceCluterData<{ ids: string[] }, ResultRowType[]>({
      ids: formData.ids,
    })
      .then(res => {
        setFaceCluterData(res)
        setFaceCluterLoading(false)
      })
      .catch(() => {
        setFaceCluterLoading(false)
      })
  }
  // 点击聚合数
  const handlePortraitClick = (event: React.MouseEvent, cardData: any) => {
    event.stopPropagation()
    setFaceCluterVisible(true)
    getPortraitFaceCluterData(cardData)
  }

  /* **********end*********** */
  return <div>
    <div className="black-btn" onClick={handleOpenBlackList}>
      {/* <Icon type="heimingdan" /> */}
      <div>黑名单</div>
    </div>
    <Modal
      title="黑名单库"
      visible={blackVisible}
      onCancel={() => {
        setBlackVisible(false)
        setAllChecked(false)
        setCheckedLists([])
        setBlackActiveKey('1')
        // getBlackListsData(defaultPage, '1')
        setBlackPage(defaultPage)
      }}
      footer={null}
      width={1410}
      autoFocus={false}
      className={`${prefixCls}-black-list-modal`}
    >
      <div className="black-body">
        <Tabs
          data={[
            { name: '抓拍人脸聚类', key: '1' },
            { name: '驾乘人脸聚类', key: '2' },
          ]}
          activeKey={blackActiveKey}
          onChange={handleChangeBlackActive}
          type="line"
        />
        <div className="black-title">
          <div>
            共<span>{blackListData.totalRecords}</span>条数据（注：已根据时空聚合）
          </div>
          {
            captureCount ? <Tag closable onClose={() => getBlackListsData()}>抓拍图像：{captureCount}</Tag>
              : ''
          }
        </div>
        <div className="black-content">
          {
            ajaxBlackLoading ? <div className="loading"><Loading spinning={true} /></div> :
              blackListData.data?.length ? blackListData.data?.map((item: any, index: number) => {
                if (captureCount) {
                  return <Card.Normal
                    showChecked={false}
                    key={item.blackId}
                    cardData={{ ...item, isBlack: true }}
                    // onImgClick={() => handleOpenBigImg(index)}
                    // onLocationClick={() => handleLocationClick(index)}
                    showImgZoom={false}
                    onPortraitClick={(e) => handlePortraitClick(e, item)}
                  />
                } else {
                  return <div className="target-face-card">
                    <Checkbox
                      className="card-checked"
                      checked={checkedLists.filter(ele => ele.blackId === item.blackId).length > 0}
                      onChange={(e) => {
                        handleChangeBlack({ cardData: item, checked: e.target.checked })
                      }}
                    />
                    <div className="image">
                      <ImgZoom imgSrc={item.targetImage} draggable={true} />
                    </div>
                    <div className="face-card-info">
                      <div className="card-info capture-num">
                        <Icon type="zhuapaitianshu" />
                        <div
                          className="card-info-content"
                          // title={item.captureCount}
                          onClick={() => handleCaptureClick(item)}
                        >抓拍图像：<span>{item.captureCount}</span></div>
                      </div>
                      <div className="now-capture">最近抓拍信息：</div>
                      <div className="card-info">
                        <Icon type="shijian" />
                        <div className="card-info-content">{item.captureTime}</div>
                      </div>
                      <div className="card-info">
                        <Icon type="didian" />
                        <div
                          className="card-info-content location"
                          title={item.locationName}
                        >{item.locationName}</div>
                      </div>
                    </div>
                  </div>
                }
              })
                : <div className="no-blackData">
                  <img src={skin === "dark" ? noDataDark : noDataLight} alt="暂无数据" />
                  暂无数据
                </div>
          }
        </div>
        {
          blackListData.data && !captureCount ?
            <div className="black-footer">
              <div className="footer-left">
                <div className="all-checked">
                  <Checkbox
                    checked={allChecked}
                    onChange={handleChangeAllChecked}
                    indeterminate={(Boolean(checkedLists.length)) && (checkedLists.length != blackListData.data.length)}
                  />全选</div>
                <div className="checked-list">已选择<span>{checkedLists.length}</span>个任务</div>
                <Button type="danger" disabled={!checkedLists.length} size="small" onClick={handleBatchDelte}>批量删除</Button>
              </div>
              <div className="footer-right">
                <Pagination {...paginationConfig} />
              </div>
            </div>
            : ''
        }
      </div>
    </Modal>
    <Modal
      visible={faceCluterVisible}
      title="聚合图像"
      className={`${prefixCls}-cluter-modal`}
      width={1040}
      footer={<Button type='primary' onClick={() => setFaceCluterVisible(false)}>确认</Button>}
      onCancel={() => {
        setFaceCluterVisible(false)
      }}
    >
      <div className="cluter-body">
        <div className="title">共有<span>{faceCluterData.totalRecords}</span>个目标</div>
        <div className="content">
          {
            faceCluterLoading ? <div className="ajax-loading"><Loading spinning={true} /></div>
              : faceCluterData.data?.map((item: any, index: number) => {
                return <Card.Normal
                  showChecked={false}
                  key={item.infoId}
                  cardData={{ ...item, isBlack: true }}
                />
              })
          }
        </div>
        {/* <div className="cluter-pagination">
          <Pagination  {...paginationClutertConfig} />
        </div> */}
      </div>
    </Modal>
  </div>
}
export default BlackList
