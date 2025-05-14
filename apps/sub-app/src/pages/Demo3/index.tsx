import { useEffect, useState } from 'react';
import { Card, Row, Col, Spin } from 'antd';
import * as echarts from 'echarts';

const Demo3 = () => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<number[]>([120, 200, 150, 80, 70, 110, 130]);
  const fetchData = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setChartData([150, 180, 220, 100, 90, 140, 160]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();

    return () => {
    }
  }, [])

  useEffect(() => {

    const chart = echarts.init(document.getElementById('demo3-chart')!);
    const getOption = () => {
      switch (chartType) {
        case 'line':
          return {
            xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
            yAxis: { type: 'value' },
            series: [{ data: chartData, type: 'line', smooth: true }]
          };
        case 'pie':
          return {
            series: [{ type: 'pie', radius: '70%', data: chartData.map((value, index) => ({ value, name: `周${['一','二','三','四','五','六','日'][index]}` })) }]
          };
        default:
          return {
            xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
            yAxis: { type: 'value' },
            series: [{ data: chartData, type: 'bar' }]
          };
      }
    };
    chart.setOption(getOption());

    chart.on('click', () => {
      setChartData(chartData.map(val => Math.floor(val * 0.8 + Math.random() * 50)));
      chart.setOption(getOption());
    });

    return () => {
      chart.dispose();
    };
  }, [chartType, chartData]);

  return (
    <div className='demo-page'>
      <Row gutter={20} style={{ margin: '20px' }}>
        <Col span={24}>
          <Card title="数据统计图表" bordered={false} style={{ margin: 0 }}>
            <div style={{ marginBottom: '16px' }}>
              图表类型：
              <button onClick={() => setChartType('bar')} style={{ marginRight: '8px' }}>柱状图</button>
              <button onClick={() => setChartType('line')} style={{ marginRight: '8px' }}>折线图</button>
              <button onClick={() => setChartType('pie')}>饼图</button>
            </div>
            <Spin spinning={isLoading}>
              <div id="demo3-chart" style={{ width: '100%', height: '400px' }} />
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Demo3;
