import {
  Cascader,
  Radio, Select, Input,
  Row, Col, Message,
  DatePicker,
  Loading
} from '@yisa/webui'
import { RadioChangeEvent } from '@yisa/webui/es/Radio'
import { useState,  useCallback, useEffect, useRef } from 'react'
import './index.scss'
import services  from "@/services";
import {  PersonData, BaseInfoProps } from '../interface'
import Title from '../Title'
import character from "@/config/character.config"
import dayjs from 'dayjs'
import { changeEditSattus } from '@/store/slices/editStatus';
import { RootState, useSelector, useDispatch } from '@/store'
import type { Dayjs } from 'dayjs'
const { InputNumber } = Input

const PersonInfo = (props: BaseInfoProps) => {
  const prefixCls = 'baseinfo-personinfo'
  const { data, handleChangePerson } = props
  // 是否编辑状态
  const [isEdit, setIsEdit] = useState(false)

  const dispatch = useDispatch()
  // 查询基本信息是否是编辑状态
  const editStatus = useSelector<RootState, boolean>(
    (state) => state.editStatus.status
  );

  // 基本信息
  const [personInfoData, setPersonInfoData] = useState<PersonData>({
    sexId: '',//性别-id
    sex: '',//性别-中文
    nationId: '',//民族-id
    nation: '',//民族-中文
    age: '',//年龄
    birthday: '',
    marriageId: '',//婚姻-id
    marriage: '',//婚姻-中文
    idCardType: '',//证件类型
    educationId: '',//文化程度-id
    education: '',//文化程度-中文
    nativeId: [],//籍贯地址-id
    native: '',//籍贯地址-中文
    nativeAddress: '',//籍贯地址-详细地址
    idNumber: '530002199080723072X',//证件号码
    religiousId: '',//宗教信仰-id
    religious: '',//宗教信仰-中文
    domicileId: [],//户籍地址-id
    domicile: '',//户籍地址-中文
    domicileAddress: '',//户籍地址-详细地址
    work: '',//工作单位
    currentId: [],//现住地址-id
    current: '',//现住地址-中文
    currentAddress: '',//现住地址-详细地址
    createTime: "2023-02-22 13:21:10",//创建时间
    updateTime: "2023-02-22 13:21:10",//更新时间
  })
  const personInfoDataRef = useRef<PersonData>(personInfoData)

  const [ajaxLoading, setAjaxLoading] = useState(false)
  // 下拉数据
  const [selectData, setSelectData] = useState({
    nation: character.nation,//民族
    marital: character.marital,//婚姻
    education: character.education,//文化
    faith: character.faith,//宗教
  })
  // 区域数据
  const [placeData, setPlaceData] = useState([])

  const handleEdit = () => {
    if (editStatus) {
      Message.warning('请对编辑信息进行保存！')
      return
    }
    dispatch(changeEditSattus(true))
    setIsEdit(true)
  }

  // 取消编辑
  const handleCancel = () => {
    dispatch(changeEditSattus(false))
    setIsEdit(false)
    setPersonInfoData(personInfoDataRef.current)
  }

  const handleSave = () => {
    dispatch(changeEditSattus(false))
    setIsEdit(false)
    // TODO:保存用户操作
    changeDetailBaseInfo()
  }
  const handleChangeRadio = (e: RadioChangeEvent) => {
    setPersonInfoData(Object.assign({}, personInfoData, {
      sexId: e.target.value
    }))
  }
  const handleChangeSelect = (value: any, type: string) => {
    setPersonInfoData(Object.assign({}, personInfoData, {
      [type]: value
    }))
  }
  const handleChangeInput = (value: any, type: string) => {
    setPersonInfoData(Object.assign({}, personInfoData, {
      [type]: type == 'age' ? value : value.target.value
    }))
  }

  const renderFormat = useCallback((valueShow: string[]) => {
    return valueShow.join('-')
  }, [])

  // 获取基本信息
  const getPersonInfoData = () => {
    setAjaxLoading(true)
    services.record.getDetailBaseInfo<{ idNumber?: string, groupId?: string[] }, PersonData[]>(data)
      .then(res => {
        setAjaxLoading(false)
        if (res.data && res.data.length) {
          setPersonInfoData(res.data[0])
          personInfoDataRef.current = res.data[0]
        }
      })
      .catch(err => {
        setAjaxLoading(false)
        console.log(err);
      })
  }

  // 编辑基本信息
  const changeDetailBaseInfo = () => {
    setAjaxLoading(true)
    services.record.changeDetailBaseInfo<{ updateData: { idNumber?: string, groupId?: string[] } & { deleteLabels: string[], isLabelUpdate: number, action: string } }, PersonData[]>({
      updateData: {
        ...personInfoData,
        deleteLabels: [],
        isLabelUpdate: 0,
        action: 'update'
      }
    })
      .then(res => {
        Message.success('编辑成功')
        setAjaxLoading(false)
        // getPersonInfoData()
        if (res.data && res.data.length) {
          setPersonInfoData(res.data[0])
          personInfoDataRef.current = res.data[0]
          handleChangePerson && handleChangePerson(res.data[0])
        }
      })
      .catch(err => {
        setAjaxLoading(false)
        console.log(err);
      })
  }
  // 获取下拉数据-民族、婚姻、文化、宗教
  const getSelectData = () => {
    services.record.getSelectData<{ id: string }, any>({ id: '1,2,3,4' })
      .then(res => {
        if (res.data) setSelectData(res?.data)
      })
  }
  // 获取区域数据
  const getPlaceData = () => {
    services.record.getPlaceData<{}, any>({})
      .then(res => {
        console.log(res);
        if (res?.data) setPlaceData(res?.data)
      })
      .catch(err => {
        console.log(err);
      })
  }

  useEffect(() => {
    // 获取基本信息
    getPersonInfoData()
    // 获取下拉数据
    getSelectData()
    // 获取区域数据
    getPlaceData()
  }, [])

  return <div className={`${prefixCls} similar-style`}>
    <Title
      title='基本信息'
      handleSave={handleSave}
      handleCancel={handleCancel}
      handleEdit={handleEdit}
      isEdit={isEdit}
    />
    {
      ajaxLoading ? <div className={`${prefixCls}-loading`}>
        <Loading spinning={true} />
      </div>
        : <div className={`${prefixCls}-content`}>
          <Row>
            <Col span={6}>
              <div className='cell'>
                <div className='cell-label'>性别</div>
                <div className='cell-value'>
                  {
                    isEdit ?
                      <Radio.Group
                        options={[{ label: '男', value: '1' }, { label: '女', value: '2' }]}
                        onChange={handleChangeRadio}
                        value={personInfoData.sexId} />
                      : personInfoData.sex
                  }
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div className='cell'>
                <div className='cell-label'>民族</div>
                <div className='cell-value'>
                  {
                    isEdit ?
                      <Select
                        options={selectData.nation.map((item: any) => ({ label: item.text, value: item.id }))}
                        onChange={(value) => handleChangeSelect(value, 'nationId')}
                        value={personInfoData.nationId}
                        defaultValue={personInfoData.nationId}
                        // @ts-ignore
                        getTriggerContainer={(triggerNode) =>
                          triggerNode.parentNode as HTMLElement
                        }
                        showSearch={true}
                      />
                      : personInfoData.nation
                  }
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div className='cell'>
                <div className='cell-label'>
                  {
                    isEdit ? '出生日期' : '年龄'
                  }
                </div>
                <div className='cell-value'>
                  {
                    isEdit ?
                      <DatePicker
                        allowClear={false}
                        onChange={(day) => {
                          setPersonInfoData(Object.assign({}, personInfoData, {
                            birthday: day?.format('YYYY-MM-DD')
                          }))
                        }}
                        value={dayjs(personInfoData.birthday)}
                        // @ts-ignore
                        getPopupContainer={(triggerNode) =>
                          triggerNode.parentNode as HTMLElement
                        }
                        disabledDate={(current: Dayjs) => {
                          return current > dayjs()
                        }} />
                      // <InputNumber onChange={(e) => { handleChangeInput(e, 'age') }} value={personInfoData.age} />
                      : personInfoData.age
                  }
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div className='cell'>
                <div className='cell-label'>婚姻</div>
                <div className='cell-value'>
                  {
                    isEdit ?
                      <Select
                        options={selectData.marital.map((item: any) => ({ label: item.text, value: item.id }))}
                        onChange={(value) => handleChangeSelect(value, 'marriageId')}
                        defaultValue={personInfoData.marriageId}
                        value={personInfoData.marriageId}
                        // @ts-ignore
                        getTriggerContainer={(triggerNode) =>
                          triggerNode.parentNode as HTMLElement
                        }
                        showSearch={true}
                      />
                      : personInfoData.marriage
                  }
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <div className='cell'>
                <div className='cell-label'>证件类型</div>
                <div className='cell-value'>{personInfoData.idCardType}</div>
              </div>
            </Col>
            <Col span={6}>
              <div className='cell'>
                <div className='cell-label'>证件号码</div>
                <div className='cell-value'>{personInfoData.idNumber}</div>
              </div>
            </Col>
            <Col span={6}>

              <div className='cell'>
                <div className='cell-label'>文化程度</div>
                <div className='cell-value'>
                  {
                    isEdit ?
                      <Select
                        options={selectData.education.map((item: any) => ({ label: item.text, value: item.id }))}
                        onChange={(value) => handleChangeSelect(value, 'educationId')}
                        defaultValue={personInfoData.educationId}
                        value={personInfoData.educationId}
                        // @ts-ignore
                        getTriggerContainer={(triggerNode) =>
                          triggerNode.parentNode as HTMLElement
                        }
                        showSearch={true}
                      />
                      : personInfoData.education
                  }
                </div>
              </div>
            </Col>
            <Col span={6}>

              <div className='cell'>
                <div className='cell-label'>宗教信仰</div>
                <div className='cell-value'>
                  {
                    isEdit ?
                      <Select
                        options={selectData.faith.map((item: any) => ({ label: item.text, value: item.id }))}
                        onChange={(value) => handleChangeSelect(value, 'religiousId')}
                        defaultValue={personInfoData.religiousId}
                        value={personInfoData.religiousId}
                        // @ts-ignore
                        getTriggerContainer={(triggerNode) =>
                          triggerNode.parentNode as HTMLElement
                        }
                        showSearch={true}
                      />
                      : personInfoData.religious
                  }
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <div className={`cell edit-place`}>
                <div className='cell-label'>籍贯地址</div>
                <div className='cell-value'>
                  {
                    isEdit ?
                      <>
                        <Cascader
                          defaultValue={personInfoData.native.split('-')}
                          options={placeData}
                          onChange={(value: any) => handleChangeSelect(value, 'nativeId')}
                          // value={personInfoData.nativeId}
                          showSearch={true}
                          renderFormat={renderFormat}
                          fieldNames={{
                            "label": "name",
                            "value": "id",
                            "children": "nodes"
                          }}
                          // @ts-ignore
                          getTriggerContainer={(triggerNode) =>
                            triggerNode.parentNode as HTMLElement
                          }
                        />
                        <Input onChange={(e) => { handleChangeInput(e, 'nativeAddress') }} value={personInfoData.nativeAddress} maxLength={30} showWordLimit />
                      </>
                      : <div className="value" title={personInfoData.native + personInfoData.nativeAddress}>
                        {
                          personInfoData.native + personInfoData.nativeAddress
                        }
                      </div>
                  }
                </div>
              </div>
            </Col>
            <Col span={12}>

              <div className={`cell edit-place`}>
                <div className='cell-label'>户籍地址</div>
                <div className='cell-value'>
                  {
                    isEdit ?
                      <>
                        <Cascader
                          defaultValue={personInfoData.domicile.split('-')}
                          options={placeData}
                          onChange={(value: any) => handleChangeSelect(value, 'domicileId')}
                          // value={personInfoData.domicileId}
                          showSearch={true}
                          renderFormat={renderFormat}
                          fieldNames={{
                            "label": "name",
                            "value": "id",
                            "children": "nodes"
                          }}
                          // @ts-ignore
                          getTriggerContainer={(triggerNode) =>
                            triggerNode.parentNode as HTMLElement
                          }
                        />
                        <Input onChange={(e) => { handleChangeInput(e, 'domicileAddress') }} value={personInfoData.domicileAddress} maxLength={30} showWordLimit />
                      </>
                      : <div className="value" title={personInfoData.domicile + personInfoData.domicileAddress}>
                        {
                          personInfoData.domicile + personInfoData.domicileAddress
                        }
                      </div>
                  }
                </div>
              </div>
            </Col>
          </Row>


          <Row>

            <Col span={12}>
              <div className={`cell edit-place`}>
                <div className='cell-label'>现住地址</div>
                <div className='cell-value'>
                  {
                    isEdit ?
                      <>
                        <Cascader
                          defaultValue={personInfoData.current.split('-')}
                          options={placeData}
                          onChange={(value: any) => handleChangeSelect(value, 'currentId')}
                          // value={personInfoData.currentId}
                          showSearch={true}
                          renderFormat={renderFormat}
                          fieldNames={{
                            "label": "name",
                            "value": "id",
                            "children": "nodes"
                          }}
                          // @ts-ignore
                          getTriggerContainer={(triggerNode) =>
                            triggerNode.parentNode as HTMLElement
                          }
                        />
                        {/* <RcCascader
                  value={personInfoData.currentId}
                  options={placeData}
                  onChange={(value: any) => {
                    console.log(value);
                  }}
                >
                  <Input onChange={(e) => { }} value={personInfoData.current} readOnly />
                </RcCascader> */}
                        <Input onChange={(e) => { handleChangeInput(e, 'currentAddress') }} value={personInfoData.currentAddress} maxLength={30} showWordLimit />
                      </>
                      : <div className="value" title={personInfoData.current + personInfoData.currentAddress}>
                        {
                          personInfoData.current + personInfoData.currentAddress
                        }
                      </div>
                  }
                </div>
              </div>
            </Col>
            <Col span={12}>

              <div className='cell edit-work'>
                <div className='cell-label'>工作单位</div>
                <div className='cell-value'>
                  {
                    isEdit ?
                      <Input onChange={(e) => { handleChangeInput(e, 'work') }} value={personInfoData.work} maxLength={30} showWordLimit />
                      : <div className="value" title={personInfoData.work}>
                        {
                          personInfoData.work
                        }
                      </div>
                  }
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <div className='cell edit-place'>
                <div className='cell-label'>创建时间</div>
                <div className='cell-value'>{personInfoData.createTime}</div>
              </div>
            </Col>
            <Col span={12}>
              <div className='cell edit-place'>
                <div className='cell-label'>更新时间</div>
                <div className='cell-value'>{personInfoData.updateTime}</div>
              </div>
            </Col>
          </Row>
        </div>
    }
  </div>
}
export default PersonInfo