import GroupTableProps from "./interface";
import { Table, Image, Link, Button, Space, Row, Col } from '@yisa/webui'
import { ColumnProps } from '@yisa/webui/es/Table/interface'
import './index.scss'

// 数据分为三列表格展示
const GroupTable = (props: GroupTableProps) => {
  const {
    className,
    style,
    data = [],
    pageSize = 30,
    tableConfig = {
      name: '',
      countTitle: '过车数量'
    },
    onSelect
  } = props

  let TableItemCount = Math.ceil(pageSize / 3)
  const datas = {
    data1: data.slice(0, TableItemCount),
    data2: data.slice(TableItemCount * 1, TableItemCount * 2),
    data3: data.slice(TableItemCount * 2, TableItemCount * 3)
  }

  const tablecolumns: ColumnProps[] = [
    {
      title: '序号',
      dataIndex: 'sortT',
      key: 'sortT',
      width: 80,
    },
    {
      title: tableConfig.name,
      dataIndex: 'group',
      key: 'group',
      ellipsis: true
    },
    {
      title: tableConfig.countTitle,
      dataIndex: 'count',
      key: 'count',
      width: 100,
      render: (text, row, index) => (
        <span className="group-count" onClick={() => { onSelect?.(row.groupId, row.group) }}>{text}</span>
      )
    },
  ]

  return (
    <Row gutter={16} className={className} style={style}>
      <Col className="gutter-row" span={8}>
        <Table
          rowKey={"sortT"}
          columns={tablecolumns}
          data={datas.data1}
          stripe
        />
      </Col>
      {
        datas.data2 && datas.data2.length ?
          <Col className="gutter-row" span={8}>
            <Table
              rowKey={"sortT"}
              columns={tablecolumns}
              data={datas.data2}
              stripe
            />
          </Col> :
          <></>
      }
      {
        datas.data3 && datas.data3.length ?
          <Col className="gutter-row" span={8}>
            <Table
              rowKey={"sortT"}
              columns={tablecolumns}
              data={datas.data3}
              stripe
            />
          </Col> :
          <></>
      }
    </Row>
  )
}

export default GroupTable