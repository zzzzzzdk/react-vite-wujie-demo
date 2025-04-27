import './index.scss'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { SearchInput, ImportCubeModal } from '@/components'
import { Tabs, Pagination, Select, Button, Loading, Message, Modal, Image } from "@yisa/webui"
import { Icon } from '@yisa/webui/es/Icon'
import dictionary from '@/config/character.config'
import { SelectCommonProps } from "@yisa/webui/es/Select/interface"
import type { PaginationProps } from "@yisa/webui/es/Pagination/interface";
import ajax, { ApiResponse } from '@/services'
import { FormDataProps, } from '../list/interface'
import { useLocation } from 'react-router-dom'
import noDataDark from '@/assets/images/image/search-nodata-dark.png'
import noDataLight from '@/assets/images/image/search-nodata-light.png'
import { useSelector, RootState } from '@/store';
import { CaptureData } from '../search/index'
import { PageData } from './interface'
import { getLogData } from "@/utils/log";
import dayjs from 'dayjs'
import { getParams, isObject } from "@/utils";
import RecordCard from './RecordCard/index';
import { CardDataType } from '@/pages/Search/record/list/RecordCard'
import { isString } from '@/utils/is'
import { forEach } from 'lodash'
function RecordList() {
  const prefixCls = 'record-lists'

  const { skin } = useSelector((state: RootState) => {
    return state.comment
  });

  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig['record-search'] || {}
  });

  // 身份信息检索参数
  const initFormData: FormDataProps = {
    plateColorTypeId: -1,
    noplate: '',
    personName: '',
    idType: '111',
    idNumber: '',
    plateColor: -1,
    licensePlate: '',
    label: [],
    phone: '',
    householdAddress: '',
    noLocal: false,
    residentialAddress: '',
    age: ['', ''],
    minor: false,
    profileType: '1',
    captureCount: ['', ''],
    timeType: 'time',
    beginDate: dayjs().subtract(Number(pageConfig.timeRange?.default || 6) - 1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    beginTime: '',
    endTime: '',
    locationIds: [],
    locationGroupIds: [],
    offlineIds: [],
  }
  const [formData, setFormData] = useState<FormDataProps>(initFormData)
  // 抓拍图像检索参数(后改为车辆参数)
  const [captureData, setCaptureData] = useState<CaptureData>({
    // timeType: 'time',
    // beginDate: dayjs().subtract(Number(pageConfig.timeRange?.default || 6) - 1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    // endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    // beginTime: '',
    // endTime: '',
    // locationIds: [],
    // locationGroupIds: [],
    // offlineIds: [],
    personName: '',
    idType: '111',
    idNumber: '',
    plateColor: -1,
    licensePlate: '',
    noplate: '',
    vehicleLabels: []
  })
  const [savePreciseForm, setSavePreciseForm] = useState({
    flag: false,
    searchType: "1"
  })
  // url携带数据
  const location = useLocation()
  const personData = location.search?.split('?')[1] && location.search?.split('?')[1].startsWith('token')
    ? getParams(location.search)
    : JSON.parse(decodeURIComponent(location.search?.split('?')[1]))

  // searchType    检索类型-是否需要排序  ''关键词 person-1 group-2更多条件检索
  // searchValue   关键词-搜索内容
  // searchInfo    精准检索-检索条件展示
  // activeMoreKey 精准条件检索-检索类型
  const [searchForm, setSearchForm] = useState<{
    searchType: string,
    searchValue: string,
    searchInfo: string
    activeMoreKey: string
  }>({
    searchType: "",
    searchValue: "",
    searchInfo: "",
    activeMoreKey: 'person'
  })
  const searchInputRef: any = useRef(null)

  // 获取token loading
  const [tokenLoading, setTokenLoading] = useState(false)

  const handleParamsData = async () => {
    setTokenLoading(true)
    await getLogData({ token: personData.token }).then(res => {
      setTokenLoading(false)
      const { data } = res as any
      if (data && isObject(data)) {
        try {
          if (data.searchType) {
            getConditionsData({ data, searchType: data.searchType })
            if (data.searchType == '1') {
              setFormData(data)
            } else if (data.searchType == '2') {
              setCaptureData(data)
              setActiveType('car')
            }
            getResultData({ ...data, sort: '', searchType: data.searchType }, 'btn')
          } else {
            setSearchForm({
              searchType: '',
              searchValue: data.keywords,
              searchInfo: data.keywords,
              activeMoreKey: 'person'
            })
            getArchivesResultBlurData(data.keywords)
          }
        } catch (error) {
          Message.error(`数据解析失败`)
        }
      }
    })
  }

  useEffect(() => {
    if (personData.token) {
      handleParamsData()
      return
    }
    if (personData) {
      setSearchForm({
        searchType: personData.searchType,
        searchValue: personData.text,
        searchInfo: personData.text,
        activeMoreKey: personData.searchType == '2' ? 'vehicle' : 'person'
      });

      if (personData.searchType == '1') {
        setFormData(Object.assign({}, formData, personData.data))
      } else if (personData.searchType == '2') {
        setCaptureData(Object.assign({}, captureData, personData.data))
        setActiveType('car')
      } else {
        getArchivesResultBlurData(personData.text)
        return
      }

      // 检索数据-精准条件
      if (personData.data) {
        getResultData({ ...personData.data, sort: '', searchType: personData.searchType }, 'btn')
      }
    }
  }, [])

  let defaultPageData: PageData = {
    pageNo: 1,
    pageSize: dictionary.pageSizeOptions[0],
  }
  // 分页
  const [pageData, setPageData] = useState(defaultPageData)

  // 缓存请求form数据
  const ajaxFormDataRef: any = useRef()
  const [ajaxLoading, setAjaxLoading] = useState(false)

  // 排序
  const [sort, setSort] = useState<SelectCommonProps['value']>('')

  // 导入数智万象
  const [importCubeVisible, setImportCubeVisible] = useState(false)

  // 获取检索条件信息展示
  const getConditionsData = (form: { data?: FormDataProps, searchType?: string, text?: string }) => {
    ajax.record.getConditionsData<(FormDataProps) & { searchType: string }, string>({ ...(form?.data || {} as FormDataProps), searchType: form.searchType || '' })
      .then(res => {
        if (res.data) {
          setSearchForm({
            ...searchForm,
            activeMoreKey: form.searchType == '2' ? 'vehicle' : 'person',
            searchType: form.searchType || '',
            searchInfo: res.data
          })
        }
      })
  }

  const [keywords, setKeywords] = useState<string[]>([])

  useEffect(() => {
    // getPlaceData()
  }, [])

  // 获取检索结果-模糊检索（关键词）resultType 分页时传给后端判断人员或车辆分页
  const getArchivesResultBlurData = (value: string = searchForm.searchValue, page: any = pageData, resultType?: string) => {

    let newKeywrods: string[] = []
    // 关键词通过空格/逗号/分号分割，可能会有多个
    const pattern = /[\s,;，；]+/;
    newKeywrods = value.split(pattern);
    setKeywords(newKeywrods)

    setAjaxLoading(true)
    ajax.record.getArchivesResultBlurData<{ keywords: string } & PageData, any>({
      keywords: value,
      resultType: resultType || '',
      ...page
    })
      .then(res => {
        ajaxFormDataRef.current = { keywords: value }
        // 分页的话不重置tab类型，请求数据需判断是否存在人员数据显示tab
        if (!resultType) {
          if (res.data && !res.data.person.length) {
            setActiveType('car')
          } else {
            setActiveType('person')
          }
          searchInputRef.current?.getHistoryData()
        }
        setAjaxLoading(false)
        setResultData(res)
      })
      .catch(err => {
        setAjaxLoading(false)
      })
  }
  // 获取检索结果 data 检索数据； type  sort 排序检索 btn 重置排序id ；  page 分页
  const getResultData = (data: any, type?: string, page: PageData = pageData) => {
    let newKeywrods: string[] = []
    const keys = ['personName', 'idNumber', 'householdAddress', 'residentialAddress']
    Object.keys(data).forEach(key => {
      if (keys.includes(key)) {
        newKeywrods.push(data[key])
      }
    })
    setKeywords(newKeywrods)

    setAjaxLoading(true)
    // 根据检索类型来确定tab选中
    setActiveType(data.searchType === '1' ? 'person' : 'car')
    if (type != 'page') ajaxFormDataRef.current = data
    ajax.record.getArchivesResultData<any, any>({ ...data, ...page })
      .then(res => {
        // 分页的话不重置tab类型，请求数据需判断是否存在人员数据显示tab
        // if (!data.resultType) {
        //   if (res.data && !res.data.person.length) {
        //     setActiveType('car')
        //   } else {
        //     setActiveType('person')
        //   }
        // }
        setAjaxLoading(false)
        setResultData(res)
        // 点击检索按钮时 才重置排序
        if (type == 'btn') setSort(res.data.selectId)
      })
      .catch(err => {
        setAjaxLoading(false)
      })
  }

  // 检索
  const handleSearch = (resultData: { searchType: string, text: string, data: any }) => {
    setPageData(defaultPageData)
    console.log(searchForm);
    setSavePreciseForm({
      flag: false,
      searchType: resultData.searchType
    })

    // 添加历史记录并获取拼接字段信息
    if (resultData.searchType) {
      if (resultData.searchType == '1') {
        setFormData(resultData.data)
      } else {
        setCaptureData(resultData.data)
        setActiveType('car')
      }
      getConditionsData(resultData)
      getResultData({ ...resultData.data, searchType: resultData.searchType, sort: '' }, 'btn', defaultPageData)

      console.log(resultData.searchType, resultData.data)
      // newKeywrods = Object.values(resultData.data).filter(val => isString(val)) as string[]

    } else {
      setSearchForm({
        ...searchForm,
        searchValue: resultData.text,
        searchType: resultData.searchType,
        activeMoreKey: 'person'
      })
      getArchivesResultBlurData(resultData.text, defaultPageData)

    }

  }
  // 检索结果数据
  const [resultData, setResultData] = useState<ApiResponse<{ person: any[], car: any[], select: any[], selectId: string }>>({
    data: {
      person: [],
      car: [],
      select: [],
      selectId: ''
    },
    totalRecords: 0,
    personTotalRecords: 0,
    vehicleTotalRecords: 0,
    usedTime: 0
  })

  // 结果数据类型 人员/车辆
  const [activeType, setActiveType] = useState('person')
  const handleChangeTypeKey = (key: string) => {
    // 切换时将分页恢复默认并请求第一页数据
    setPageData(defaultPageData)
    if (searchForm.searchType) {//精准检索
      getResultData({
        ...ajaxFormDataRef.current,
        // searchType: searchForm.searchType,
        searchType: savePreciseForm.searchType,
        resultType: key == 'person' ? '1' : '2',
      }, 'page', defaultPageData)
    } else {//模糊（关键词检索）
      getArchivesResultBlurData(searchForm.searchValue, defaultPageData, key == 'person' ? '1' : '2',)
    }
    setActiveType(key)
  }

  // 修改分页
  const handlePageChange: PaginationProps["onChange"] = (current: number, pageSize: number) => {
    let newFormData;
    if (pageSize !== pageData.pageSize) {
      // console.log("pageSize", current, pageSize);
      newFormData = {
        ...pageData,
        pageNo: 1,
        pageSize: pageSize,
      };
    } else {
      // 页号改变
      console.log("page", current, pageSize);
      newFormData = {
        ...pageData,
        pageNo: current,
        pageSize: pageSize,
      };
    }
    setPageData(newFormData)
    // 判断请求类型
    if (searchForm.searchType || savePreciseForm.flag) {//精准检索
      getResultData({
        ...ajaxFormDataRef.current,
        // searchType: searchForm.searchType,
        searchType: savePreciseForm.searchType,
        resultType: activeType == 'person' ? '1' : '2',
      }, 'page', newFormData)
    } else {//模糊（关键词检索）
      getArchivesResultBlurData(searchForm.searchValue, newFormData, activeType == 'person' ? '1' : '2',)
    }
  }

  const handleImportCube = useCallback(() => {
    setImportCubeVisible(true)
  }, [])
  const [checkModal, setCheckModal] = useState(false)
  const [checkedPersonArchives, setcheckedPersonArchives] = useState<CardDataType[]>([])
  const handleOpenCheckModal = () => {
    if (!checkedPersonArchives.length) {
      Message.warning("未选择实名档案")
      return
    }
    setCheckModal(true)
  }

  const handlecancelModal = () => {
    setCheckModal(false)
  }
  const [commonAnalysisLoading, setCommonAnalysisLoading] = useState(false)
  const handlePersonCommonAnalysis = () => {
    if (!checkedPersonArchives.length) {
      Message.warning("请选择实名档案！")
      return
    }
    setCommonAnalysisLoading(true)
    ajax.record.addCommonality<{ commonality: { name: string; idNumber: string; }[] }, string>({
      commonality: checkedPersonArchives
        .map(item => ({ name: item.name || "", idNumber: item.idNumber || "" }))
        .filter(item => item.idNumber)
    })
      .then(res => {
        setCommonAnalysisLoading(false)
        typeof res.data === "string" && window.open(res.data)
      })
      .catch(err => {
        setCommonAnalysisLoading(false)
      })
  }

  const handleRecordCardChecked = (data: CardDataType, checked: boolean) => {
    if (checkedPersonArchives.length >= window.YISACONF.commonalityAnalysisCount) {
      Message.warning(`最多可选择${window.YISACONF.commonalityAnalysisCount}个实名档案`)
      return
    }
    data.idNumber && setcheckedPersonArchives(
      checked ?
        [...checkedPersonArchives, data]
        :
        checkedPersonArchives.filter(item => item.idNumber != data.idNumber)
    )
  }

  const handleRemoveArchive = (idNumber: string) => {
    setcheckedPersonArchives(checkedPersonArchives.filter(item => item.idNumber !== idNumber))
  }

  const handleJumpDetails = (data: CardDataType) => {
    window.open(`#/record-detail-person?${encodeURIComponent(JSON.stringify({
      idNumber: data.idNumber === '未知' ? '' : data.idNumber,
      idType: data.idType || '111',
      groupId: data.groupId || [],
      groupPlateId: data.groupPlateId || [],
      key: data.key || '',
      feature: data.feature || ''
    }))}`)
  }

  return <div style={{ height: '100%' }} className={`${prefixCls}`}>
    <div className={`${prefixCls}-header`}>
      <SearchInput
        ref={searchInputRef}
        searchType='list'
        defaultFormData={searchForm.searchType == '1' ? formData : searchForm.searchType == '2' ? captureData : ''}
        // defaultCaptureData={searchForm.searchType == '2' ? captureData : ''}
        defaultSearchForm={searchForm}
        onSearch={handleSearch}
        onChangeSeacrhForm={(data: {
          searchType: string,
          searchValue: string,
          searchInfo: string
          activeMoreKey: string
        }) => {
          setSavePreciseForm({
            ...savePreciseForm,
            flag: true
          })
          console.log(data)
          setSearchForm(data)
        }}
      />
    </div>
    <div className={`${prefixCls}-content`}>
      <div className="total-header">
        <div className="total-num">
          共<span>{resultData.totalRecords || 0}</span>条数据，用时<span>{resultData.usedTime || 0}</span>秒
        </div>
        <div className="total-btn">
          {
            (resultData.totalRecords && formData.profileType !== '3' && searchForm.searchType)
              ? <Button onClick={handleImportCube}>导入数智万象</Button>
              : ''
          }
          {
            resultData.totalRecords && (searchForm.searchType && activeType == 'person') ?
              <div className="sort-select">
                <Select
                  bordered={false}
                  style={{ width: 160, padding: '0 10px' }}
                  defaultValue={sort}
                  value={sort}
                  options={resultData.data?.select}
                  onChange={(value) => {
                    setPageData(defaultPageData)
                    setSort(value)
                    getResultData({ ...ajaxFormDataRef.current, searchType: searchForm.searchType, sort: value }, '', defaultPageData)
                  }}
                />
              </div>
              : null
          }
        </div>
      </div>
      {
        ajaxLoading ? <div className="result-loading">
          <Loading spinning={true} />
        </div> :
          resultData.totalRecords ?
            <div className="content-data">
              <Tabs
                className={`card-type-tabs`}
                defaultActiveKey={activeType}
                activeKey={activeType}
                type='line'
                onChange={handleChangeTypeKey}
                data={
                  // resultData.personTotalRecords && resultData.vehicleTotalRecords
                  //   ? resultData.data?.person.length && resultData.data?.car.length
                  //     ?
                  savePreciseForm.searchType == '1' ?
                    [{ key: 'person', name: `人员(${resultData.personTotalRecords})` }]
                    :
                    savePreciseForm.searchType == '2' ?
                      [{ key: 'car', name: `车辆(${resultData.vehicleTotalRecords})` }]
                      :
                      [
                        { key: 'person', name: `人员(${resultData.personTotalRecords})` },
                        { key: 'car', name: `车辆(${resultData.vehicleTotalRecords})` }
                      ]
                  //   : resultData.data?.person.length
                  //     ? [{ key: 'person', name: `人员(${resultData.personTotalRecords})` }]
                  //     : [{ key: 'car', name: `车辆(${resultData.vehicleTotalRecords})` }]
                  // : resultData.personTotalRecords
                  //   ? [{ key: 'person', name: `人员(${resultData.personTotalRecords})` }]
                  //   : [{ key: 'car', name: `车辆(${resultData.vehicleTotalRecords})` }]
                }
              />
              <div className="record-data-lists">
                {
                  resultData.data && resultData.data[activeType].length ?
                    resultData.data[activeType].map((item: any) => {
                      return <RecordCard
                        key={item.key}
                        cardData={item}
                        cardType={activeType}
                        checked={activeType == "person" && checkedPersonArchives.findIndex(it => it.idNumber == item.idNumber) > -1}
                        onRecordCardChecked={handleRecordCardChecked}
                        keywords={keywords}
                      />
                    })
                    :
                    <div className="result-nodata">
                      <img src={skin === "dark" ? noDataDark : noDataLight} alt="暂无数据" />
                      暂无数据
                    </div>
                }
              </div>
            </div>
            :
            <div className="result-nodata">
              <img src={skin === "dark" ? noDataDark : noDataLight} alt="暂无数据" />
              暂无数据
            </div>
      }
    </div>
    <div className={`${prefixCls}-footer`}>
      <div className="button-container">
        {
          activeType === "person" ? <>
            <span onClick={handleOpenCheckModal}>已选择<em>{checkedPersonArchives.length}</em>条数据</span>
            <Button type="default" onClick={handlePersonCommonAnalysis} loading={commonAnalysisLoading}>人员共性分析</Button>
            <span>* 最多可选择{window.YISACONF.commonalityAnalysisCount || 10}个实名档案</span>
          </>
            : <span></span>
        }
      </div>
      <Pagination
        disabled={!resultData.totalRecords || ajaxLoading}
        showSizeChanger
        showQuickJumper
        showTotal={() => `共 ${activeType == 'person' ? resultData.personTotalRecords : resultData.vehicleTotalRecords} 条`}
        total={activeType == 'person' ? resultData.personTotalRecords : resultData.vehicleTotalRecords}
        // total={resultData.totalRecords}
        current={pageData.pageNo}
        pageSize={pageData.pageSize}
        pageSizeOptions={dictionary.pageSizeOptions}
        onChange={handlePageChange}
      />
    </div>
    <ImportCubeModal
      url={`/v1/personArchives/export-mofang`}
      resultFormData={{ ...ajaxFormDataRef.current }}
      modalProps={{
        visible: importCubeVisible,
        onCancel: () => setImportCubeVisible(false)
      }}
      recordData={resultData}
      type="record"
      searchInfo={searchForm.searchInfo}
    />
    <Modal
      title="已选数据"
      visible={checkModal}
      alignCenter
      width={1158}
      onCancel={handlecancelModal}
      footer={null}
    >
      <ul className="archives-container">
        {
          !!checkedPersonArchives.length ?
            checkedPersonArchives.map(item => <li key={item.idNumber} className="archives-item">
              <span className="icon" onClick={() => { handleRemoveArchive(item.idNumber || "") }}> <Icon type={"shibai"} /></span>
              <Image src={item.imageUrl} />
              <div className="name">{item.personName || "未知"}</div>
              <div className="id-number" onClick={() => { handleJumpDetails(item) }}>{item.idNumber}</div>
            </li>)
            : <li className="no-data"></li>
        }
      </ul>
    </Modal>
  </div >
}

export default RecordList