import { Switch, Card, Statistic, Row, Col, Button, Tag   } from 'antd';
import ACInfo from '../../../dto/ACInfo';


export default function MyAC(props: {acInfo: ACInfo}) {
  return <div className='component'>
    <Card title={
      <div>
        <strong>{props.acInfo.name}</strong>
        <Tag color="#2db7f5" style={{marginLeft: '6px'}}>默认家庭 卧室</Tag>
      </div>
    } extra={<Switch defaultChecked={props.acInfo.state === 'on'} />}>
      <Button>-</Button> {props.acInfo.temperature} <Button>+</Button>
      <Row>
        <Col span={8}>
          <Statistic title="本月用电" value={props.acInfo.monthConsumption || '-'} suffix="度" />
        </Col>
        <Col span={8}>
          <Statistic title="今日用电" value={props.acInfo.todayConsumption || '-'} suffix="度" />
        </Col>
        <Col span={8}>
          <Statistic title="当前功耗" value={props.acInfo.currentPower || '-'} suffix="w" />
        </Col>
      </Row>
    </Card> 
  </div>
}