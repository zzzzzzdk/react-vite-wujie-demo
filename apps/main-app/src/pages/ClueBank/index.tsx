import React, { useState, useEffect } from 'react'
import { Form, Radio, Tabs, Pagination, Button, Space, Checkbox, Divider, Message, Tooltip, Modal } from '@yisa/webui'
import { ResultBox } from "@yisa/webui_business";
import './index.scss'
// import ClueTree from './ClueTree'
import cn from 'classnames'
import Testtree from './Testtree';
import services, { ApiResponse } from '@/services'
import { NodeInstance } from "@yisa/webui/es/Tree/interface";
import { CardDataItem, SearchCondition } from './interface'
import ChangeModel from './ChangeModel'
import { Export, BigImg, Card, CreateTrackBtn } from '@/components';
import { JoinClue } from '@/components';
// import services from "@/services";
import { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox';
import { RadioChangeEvent } from '@yisa/webui/es/Radio/interface'
import type { PaginationProps } from "@yisa/webui/es/Pagination/interface";
import { ClueTreeItem } from '@/components/SearchTree/interface';
import dictionary from "@/config/character.config";
import { ClueContext } from "./context";
import { Link } from "react-router-dom";
import { RootState, useSelector } from '@/store';
import { logReport } from '@/utils/log';
function Cluebank() {
  const prefixCls = "clue-task"
  //tab数据
  const data = [
    { value: "", label: '全部' },
    { value: "face", label: '人脸' },
    { value: "pedestrian", label: '人体' },
    { value: "bicycle", label: '二轮车' },
    { value: "tricycle", label: '三轮车' },
    { value: "vehicle", label: '汽车' },
    // { value: "gait", label: '步态' }
  ]
  const { skin } = useSelector((state: RootState) => {
    return state.comment
  })
  //是否全选
  const [checkAll, setCheckAll] = useState(false);
  //是否已经检索
  const [hasSelect, setHasSelect] = useState(false)
  //已选中数据列表
  const [checkedList, setCheckedList] = useState<CardDataItem[]>([])
  //数据列表
  const [cardarr, setCardarr] = useState<CardDataItem[]>([])
  //数据总数
  const [total, setTotal] = useState<number>(0)
  //加载动画
  const [loading, setLoading] = useState(false)
  const [indeterminate, setIndeterminate] = useState(checkedList.length > 0 && checkedList.length < cardarr.length);
  //修改分组弹窗打开控制
  const [changegropmodel, setChangegropmodel] = useState(false)
  //左侧tree树
  const [clueTreeData, setClueTreeData] = useState<ClueTreeItem[]>([])
  //分页控制
  const [pageConfig, setPageConfig] = useState({
    current: 1,
    pageSize: 40,
    pageSizeOptions: dictionary.pageSizeOptions,
  });
  //树的状态 是否新增或编辑操作未完成
  const [treeStatus, setTreeStatus] = useState(false)
  //当前选中的分组id
  const [selectid, setSelectid] = useState('')
  //大图弹窗控制
  const [bigImgModal, setBigImgModal] = useState({
    visible: false,
    currentIndex: 0
  })
  const [group, setGroup] = useState('')
  //tag标签
  const [targetType, setTargetType] = useState('')
  const ClueContextValue = {
    clueTreeData: clueTreeData,
    onclueTreeDataChange: (data: ClueTreeItem[]) => setClueTreeData(data),
    group: group,
    ongroupchange: (data: string) => setGroup(data),
    ontreestatus: (data: boolean) => setTreeStatus(data)
  }
  //分页器改变
  const handlePageChange: PaginationProps["onChange"] = (current, pageSize) => {
    if (current !== pageConfig.current) {
      // 页号改变
      console.log("page", current, '页码');
      //选中列表清空
      setCheckedList([])
      //容量不变，页面变化
      setPageConfig({
        ...pageConfig,
        current: current,
      });
    }
    if (pageSize !== pageConfig.pageSize) {
      // 页面大小改变
      console.log("pageSize", pageSize);
      //选中列表清空
      setCheckedList([])
      //页码变为1，
      setPageConfig({
        ...pageConfig,
        current: 1,
        pageSize: pageSize,
      });
    }
  };
  const handleboxchange = ({ cardData, checked }: { cardData: CardDataItem, checked: boolean }) => {
    //点击的卡片数据是否包含在已选中的 0不在 >0在
    const isExist = checkedList.filter(item => item.id === cardData.id).length
    let newCheckedData = []
    if (isExist) {
      //卡片数据存在已选中列表中时候
      //已选中列表变为除当前点击的新选中列表
      newCheckedData = checkedList.filter(item => item.id !== cardData.id)
    } else {
      //卡片数据不存在已选中列表中时候
      //已选中列表增加新项
      newCheckedData = checkedList.concat([cardData])
    }
    //更新选中列表
    setCheckedList(newCheckedData)
  }
  //全选点击
  const handleCheckAllChange = (event: CheckboxChangeEvent) => {
    const checked = event.target.checked
    // console.log(checked,'checked');
    if (checked) {
      //全选
      setCheckedList(cardarr || [])
      setIndeterminate(false)
      setCheckAll(true)
    } else {
      //重置
      setCheckedList([])
      setIndeterminate(false)
      setCheckAll(false)
    }
  }
  //获取数据
  const getList = () => {
    // console.log(group,'la');
    if (selectid === '') {
      // 没选择就不用发请求了
      setHasSelect(false)
      setCardarr([])
      setTotal(0)
      return
    }
    setLoading(true)
    setHasSelect(true)
    services.getInfo<SearchCondition, any>({ caseId: selectid, targetType: targetType, pageNo: pageConfig.current, pageSize: pageConfig.pageSize }).then(res => {
      setCardarr(res.data)

      setTotal(res.totalRecords || 0)
      setLoading(false)
    })
  }
  //tab切换
  const handleTargetTypeChange = (event: RadioChangeEvent) => {
    //更新tab
    setTargetType(event.target.value)
    //分页还原
    setPageConfig({
      ...pageConfig,
      current: 1,
      pageSize: 40
    });
    //状态清空
    setCheckedList([])

  }
  //点击删除
  const handleDelete = () => {
    if (!checkedList.length) {
      Message.warning('未选择任何数据')
      return
    }
    let deletearr = checkedList.map(item => item.id)
    services.deleteInfo({ id: deletearr.join() }).then(res => {
      // console.log(res);
      Message.success('删除成功')
      setCheckedList([])
      getList()
    }).catch((err) => {
      Message.error('删除失败')
    });
  }

  const handleClick = () => {
    Modal.confirm({
      title: '提示',
      content: '确认要删除这几条数据吗',
      onOk: () => {
        handleDelete()
      },
    });
  }

  //修改分组
  const changeGroup = () => {
    // console.log(treeStatus);
    if (treeStatus) {
      Message.warning('请完成本次操作')
      return
    }
    if (!checkedList.length) {
      // console.log(111);
      Message.warning('未选择任何数据')
      return
    }
    setChangegropmodel(true)
  }

  const onCancel = () => {
    setChangegropmodel(false)
    setGroup(selectid)
  }
  const onOk = () => {
    // console.log('ok');
    if (group === "") {
      Message.warning('未选择分组')
      return
    }
    if (selectid === group) {
      // console.log('不需要发送请求');
      Message.warning('分组并未改变')
      return
    }

    //所选的需要更改分组的id数组
    const idList = checkedList.map((item: CardDataItem) => item.id)
    //修改分组请求
    services.changeGroup({ oldcaseId: selectid, caseId: group, id: idList.join(',') }).then(res => {
      // console.log(res);
      getList()
      //关闭弹窗
      Message.success('修改分组成功')
      setChangegropmodel(false)
      setCheckedList([])
      setGroup(selectid)
    }).catch((error) => {
      Message.error('修改分组失败')
      return
    })
  }
  //获取数据
  useEffect(() => {
    getList()
  }, [selectid, targetType, pageConfig.current, pageConfig.pageSize])

  useEffect(() => {
    if ((checkedList.length === cardarr.length) && cardarr.length !== 0) {
      setCheckAll(true)
    }
    else {
      setCheckAll(false)
    }
    setIndeterminate(checkedList.length > 0 && checkedList.length < cardarr.length)
  }, [checkedList.length, cardarr.length])

  const handleOpenBigImg = (index: number) => {
    //身份信息没有大图
    setBigImgModal({
      visible: true,
      currentIndex: index
    })
  }
  const handleCloseBigImg = () => {
    setBigImgModal((i) => {
      return {
        ...i,
        visible: false
      }
    })
  }

  const handleSelected = (selectedNodes: NodeInstance[]) => {
    setPageConfig({
      ...pageConfig,
      current: 1,
      pageSize: 40
    });
    //切换时状态清空
    setCheckedList([])
    //tab重置为1
    setTargetType('')

    if (selectedNodes.length) {
      setSelectid(selectedNodes[0].key ? selectedNodes[0].key : selectedNodes[0].props.dataRef?.id)
      setGroup(selectedNodes[0].key ? selectedNodes[0].key : selectedNodes[0].props.dataRef?.id)
    } else {
      setSelectid('')
      setGroup('')
    }
  }
  const handleRenderCard = () => {
    let template = []
    for (let i = 0; i < cardarr.length; i = i + 4) {
      let _template = []
      for (let j = i; j < i + 4; j++) {
        if (j < cardarr.length) {
          // console.log(cardarr[j]);
          _template.push(
            <Card.PersonInfo
              cardData={cardarr[j]}
              key={cardarr[j].id}
              checked={checkedList.filter(item => item.id === cardarr[j].id).length > 0}
              onChange={handleboxchange}
              onImgClick={() => handleOpenBigImg(j)}
              hasfooter={true}
              cardtype='clubbox'
            ></Card.PersonInfo>
          )

        } else {
          _template.push(<div className="card-item-flex" key={j + 'flex'} />)
        }
      }
      template.push(<div className="result-card-list-row" key={i}>{_template}</div>)
    }
    return template
  }

  const [jumpData, setJumpData] = useState({
    to: '',
    // state: {}
  })
  const handleJump = (link: string, e?: React.MouseEvent) => {
    // 日志提交
    if (link === '/image') {
      logReport({
        type: 'image',
        data: {
          desc: `图片【${checkedList.length}】-【批量操作：以图检索】`,
          data: checkedList
        }
      })
      const params = checkedList.map(item => ({
        bigImage: item.bigImage,
        feature: item.feature,
        targetType: item.targetType,
        targetImage: item.targetImage,
        windowFeature:item?.windowFeature || ""
      }))
      setJumpData({ to: `${link}?featureList=${encodeURIComponent(JSON.stringify(params))}` })
    }
    else if (link === '/face-peer') {
      // let flag = false
      logReport({
        type: 'image',
        data: {
          desc: `图片【${checkedList.length}】-【批量操作：以图检索】`,
          data: checkedList
        }
      })
      let flag = checkedList.every(item => item.targetType === "face")
      if (!flag) {
        Message.warning("仅能选择人脸数据")
        e?.preventDefault()
        return
      }
      if (checkedList.length > 200) {
        Message.warning("最大支持200条数据")
        e?.preventDefault()
        return
      }
      logReport({
        type: 'image',
        data: {
          desc: `图片【${checkedList.length}】-【批量操作：同行分析】`,
          data: checkedList
        }
      })
      const params = [...checkedList || []]
      services.uploadTokenParams<{}, ApiResponse<string>>({
        params: { peerData: params }
      }).then(res => {
        if (res.data) {
          window.open(`/#/face-peer?id=${res.data}&type=batch`)
        } else {
          Message.warning(res.message || "")
        }
      }).catch(err => {
        Message.warning(err.message)
      })
    }
  }
  return (
    <ClueContext.Provider
      value={ClueContextValue}
    >
      <div className={`${prefixCls} page-content`}>
        <Testtree
          prefixCls={prefixCls}
          onSelect={handleSelected}
        />
        <div className={`${prefixCls}-task-details`}>
          <div className='right-box'>
            <Radio.Group
              optionType="button"
              options={data}
              onChange={handleTargetTypeChange}
              value={targetType}
            />
            <Divider />
            <div className='title-box'>
              {
                hasSelect ?
                  <div className='top-title'><span>共</span><span className='total-length'>{total}</span><span>条数据</span></div>
                  : ""
              }
              {
                !!cardarr.length &&
                <Export
                  total={total}
                  url={`/v1/clue/details/export`}
                  formData={Object.assign({},
                    { caseId: selectid, pageNo: pageConfig.current, pageSize: pageConfig.pageSize, targetType: targetType },
                    {
                      checkedIds: checkedList.map(item => item.id.toString()),
                    })
                  }
                />
              }
            </div>
            <ResultBox
              loading={loading}
              nodata={total === 0}
              nodataTip={hasSelect ? "搜索结果为空" : "请尝试检索一下"}
              nodataClass={hasSelect ? "" : `first-coming-${skin}`}
            >
              <div className='listbox'>
                <div className='card-list'>
                  {handleRenderCard()}
                </div>
                {
                  <BigImg
                    modalProps={{
                      visible: bigImgModal.visible,
                      onCancel: handleCloseBigImg
                    }}
                    currentIndex={bigImgModal.currentIndex}
                    data={cardarr}
                    onIndexChange={(index) => {
                      setBigImgModal({
                        visible: true,
                        currentIndex: index
                      })
                    }}
                  />
                }
              </div>
            </ResultBox>
            {
              total > 0 ?
                <div className='bottombox'>
                  <div className='button-box'>
                    <Checkbox
                      indeterminate={indeterminate}
                      onChange={handleCheckAllChange}
                      checked={checkAll}
                      disabled={cardarr.length === 0}
                    >
                      全选
                    </Checkbox>
                    <div className='bottom-title'><span>已选择</span> <span className='checked-length'>{checkedList.length}</span> <span>个任务</span></div>

                    <Space size={15}>
                      <Tooltip title="仅可选取5个目标" placement="top">
                        <span>
                          <Link
                            {...jumpData}
                            target="_blank"
                            onClick={(e) => handleJump('/image')}
                            className={!checkedList.length || checkedList.length > 5 ? 'disabled btn-link' : 'btn-link'}
                          >以图检索</Link>
                        </span>
                      </Tooltip>
                      <span>
                        <Button
                          onClick={(e) => handleJump('/face-peer', e)}
                          size="small"
                          className={!checkedList.length ? 'disabled btn-link' : 'btn-link'}
                        >同行分析</Button>
                      </span>
                      <CreateTrackBtn disabled={checkedList.length === 0} checkedList={checkedList} />
                      <Button size='small' disabled={checkedList.length === 0} onClick={changeGroup}>修改分组</Button>
                      <Button size='small' type='danger' onClick={handleClick} disabled={checkedList.length === 0}>删除</Button>
                    </Space>
                  </div>
                  <Pagination disabled={loading} total={total} showTotal={() => '共' + total + '条'} responsive showQuickJumper showSizeChanger {...pageConfig} onChange={handlePageChange} />
                </div>
                : ''
            }

            <ChangeModel visible={changegropmodel} onCancel={onCancel} onOk={onOk} selectid={selectid} checkedList={checkedList}></ChangeModel>
          </div>
        </div>
      </div>
    </ClueContext.Provider>

  )
}



export default Cluebank
