import { Switch, Card, Statistic, Row, Col, Segmented, Tag   } from 'antd';
import styles from './my-switch.module.css'
import * as echarts from 'echarts';
import { useEffect } from 'react';
import SwitchInfo from '../../../dto/SwitchInfo';
type EChartsOption = echarts.EChartsOption;

function initChart(id: string) {
  var chartDom = document.getElementById(id)!;
  var myChart = echarts.init(chartDom);
  var option: EChartsOption;

  option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true
      }
    ]
  };

  option && myChart.setOption(option);
}

export default function MySwitch(props: {switchInfo: SwitchInfo}) {
  const id = 'my-switch-chart-' + Math.random() * 99999999999
  useEffect(() => {
    initChart(id)
  })
  const offlineTempalte = () => {
    if (props.switchInfo.state == 'unavailable') {
      return <Tag color='error'>离线</Tag>
    }
  }
  return <div className={styles.mySwitch + ' component'}>
    <Card title={
      <div>
        <strong>{props.switchInfo.name.split(" ")[0]}</strong>
        <Tag color="#2db7f5" style={{marginLeft: '6px'}}>{props.switchInfo.room}</Tag>
        {offlineTempalte()}
      </div>
    } extra={<Switch defaultChecked={props.switchInfo.state === 'on'} />}>
      <Row>
        <Col span={8}>
          <Statistic title="本月用电" value={props.switchInfo.monthConsumption || '-'} suffix="度" />
        </Col>
        <Col span={8}>
          <Statistic title="今日用电" value={props.switchInfo.todayConsumption || '-'} suffix="度" />
        </Col>
        <Col span={8}>
          <Statistic title="当前功耗" value={props.switchInfo.currentPower || '-'} suffix="w" />
        </Col>
      </Row>
      <div style={{height: '200px'}}>
        <Segmented options={['月视图', '周视图', '天视图']} />
        <div id={id} style={{height: '100%', width: '100%'}}></div>
      </div>
    </Card> 
  </div>
}