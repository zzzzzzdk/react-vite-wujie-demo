import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
// import chinaJson from 'echarts/map/json/china.json';
import { Row, Col, Spin } from 'antd';
// echarts.registerMap('china', chinaJson);

const ScreenContainer = {
  padding: '20px',
  height: '95vh',
  backgroundColor: '#f8f9fa',
  fontSize: '14px',
};

const ChartCard = {
  height: '400px',
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '20px',
  margin: '15px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
};

const LoadingWrapper = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default function Demo4() {
  const [isLoading, setIsLoading] = useState(false);
  const chartRef1 = useRef<HTMLDivElement>(null);
  const chartRef2 = useRef<HTMLDivElement>(null);
  const chartRef3 = useRef<HTMLDivElement>(null);
  const chartRef4 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 初始化图表1
    if (!chartRef1.current) return;
    const chart1 = echarts.init(chartRef1.current);
    chart1.setOption({
      title: { text: '业务指标趋势' },
      xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五'] },
      yAxis: { type: 'value' },
      series: [{ data: [120, 200, 150, 80, 220], type: 'line' }],
    });

    // 初始化图表2
    if (!chartRef2.current) return;
    const chart2 = echarts.init(chartRef2.current);
    chart2.setOption({
      title: { text: '用户分布' },
      tooltip: {},
      legend: { data: ['新用户', '老用户'] },
      xAxis: { data: ['华北', '华东', '华南', '华中'] },
      yAxis: {},
      series: [
        { name: '新用户', type: 'bar', data: [320, 302, 301, 334] },
        { name: '老用户', type: 'bar', data: [220, 182, 191, 234] },
      ],
    });

    // 初始化图表3（饼图）
    if (!chartRef3.current) return;
    const chart3 = echarts.init(chartRef3.current);
    chart3.setOption({
      title: { text: '用户类型占比' },
      tooltip: { trigger: 'item' },
      legend: { top: 'bottom' },
      series: [
        {
          type: 'pie',
          radius: '60%',
          data: [
            { value: 335, name: '直接访问' },
            { value: 310, name: '邮件营销' },
            { value: 274, name: '联盟广告' },
          ],
        },
      ],
    });

    // 初始化图表4（地图）
    if (!chartRef4.current) return;
    const chart4 = echarts.init(chartRef4.current);
    // chart4.setOption({
    //   title: { text: '业务分布' },
    //   tooltip: { trigger: 'item' },
    //   visualMap: { type: 'piecewise', min: 0, max: 500 },
    //   series: [
    //     {
    //       type: 'map',
    //       map: 'china',
    //       data: [
    //         { name: '北京', value: 450 },
    //         { name: '上海', value: 380 },
    //         { name: '广东', value: 520 },
    //       ],
    //     },
    //   ],
    // });

    // 窗口resize时更新图表
    const resizeHandler = () => {
      chart1.resize();
      chart2.resize();
      chart3.resize();
      chart4.resize();
    };
    window.addEventListener('resize', resizeHandler);

    setIsLoading(false);
    // loadCharts();
    return () => {
      window.removeEventListener('resize', resizeHandler);
      chart1.dispose();
      chart2.dispose();
      chart3.dispose();
      chart4.dispose();
    };
  }, []);

  return (
    <div style={ScreenContainer}>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={12} lg={12}>
          {isLoading ? <Spin style={LoadingWrapper} /> : <div ref={chartRef1} style={ChartCard}></div>}
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          {isLoading ? <Spin style={LoadingWrapper} /> : <div ref={chartRef2} style={ChartCard}></div>}
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          {isLoading ? <Spin style={LoadingWrapper} /> : <div ref={chartRef3} style={ChartCard}></div>}
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          {isLoading ? <Spin style={LoadingWrapper} /> : <div ref={chartRef4} style={ChartCard}></div>}
        </Col>
      </Row>
    </div>
  );
}
