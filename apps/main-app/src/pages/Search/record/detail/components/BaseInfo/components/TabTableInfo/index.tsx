import './index.scss'
import { Tabs, Table } from '@yisa/webui'
import Title from '../Title'
import { useEffect, useState } from 'react'
import services from "@/services";
import { BaseInfoProps, TabTableData, FormData } from '../interface'
import { Icon, } from '@yisa/webui/es/Icon'

const TabTableInfo = (props: BaseInfoProps) => {
  const {
    title = '基本信息',
    hasEditBtn = true,
    data
  } = props
  const prefixCls = 'baseinfo-tabtable'

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      render(_: any, __: any, index: number) {
        return index + 1
      }
    },
    {
      title: '时间',
      dataIndex: 'travelDate',
    },
    {
      title: '车次/航班',
      dataIndex: 'trainNumber',
    },
    {
      title: '座位号',
      dataIndex: 'seatNumber',
    },
    {
      title: '类型',
      dataIndex: 'transportType',
      render(text: string) {
        return text == '1' ? '飞机' : text == '2' ? '火车 ' : text == '3' ? '汽车' : '轮船'
      }
    },
    {
      title: '出发站',
      dataIndex: 'departure',
    },
    {
      title: '到达站',
      dataIndex: 'destination',
    },
    {
      title: '来源（更新时间）',
      dataIndex: 'source',
    }
  ];

  const [loading, setLoading] = useState<boolean>(true)
  const [tabTableData, setTabTableData] = useState<TabTableData[]>([])

  const handleChangeTab = (key: string) => {
    console.log(key);
    setActiveKeys(key)
    getData(key)
  }

  const [activeKeys, setActiveKeys] = useState('0')

  const getData = (key: string = activeKeys) => {
    setLoading(true)
    services.record.getDriveInfo<FormData, TabTableData[]>({ ...data, transportType: key == '0' ? '' : key })
      .then(res => {
        setLoading(false)
        if (res?.data?.length) {
          setTabTableData(res.data)
        }else{
          setTabTableData([])
        }
      }).catch((err)=>{
        console.log(err)
        setLoading(false)
        setTabTableData([])
      })
  }

  useEffect(() => {
    getData()
  }, [])

  // if (!hasEditBtn && (!tabTableData?.length && activeKeys == '0')) {
  //   return null
  // }
  return <div className={`${prefixCls}`}>
    <Title
      title={title}
      hasEditBtn={hasEditBtn}
    />
    <div className={`${prefixCls}-content`}>
      <Tabs type='line'
        activeKey={activeKeys}
        className="tabtable-tab"
        onChange={handleChangeTab} data={[
          { key: "0", name: '全部' },
          { key: "1", name: '飞机' },
          { key: "2", name: '火车' },
          { key: "3", name: '汽车' },
          { key: "4", name: '轮船' },
        ]} />
      <Table columns={columns} data={tabTableData} stripe={true} loading={loading}
        noDataElement={
          <div className="table-no-data">
            <Icon type="zanwushujuqianse" />
            <div> 这里什么都没有......</div>
          </div>
        }
        scroll={{
          y: 350
        }}
      />
    </div>
  </div>
}
export default TabTableInfo
