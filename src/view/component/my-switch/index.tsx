import { Switch, Card, Statistic, Row, Col, Segmented, Tag } from 'antd';
import styles from './my-switch.module.css'
import SwitchInfo from '../../../dto/SwitchInfo';

export default function MySwitch(props: { switchInfo: SwitchInfo }) {
  const offlineTempalte = () => {
    if (props.switchInfo.state == 'unavailable') {
      return <Tag color='error'>离线</Tag>
    }
  }
  return <div className={styles.mySwitch + ' component'}>
    <Card title={
      <div>
        <strong>{props.switchInfo.name.split(" ")[0]}</strong>
        <Tag color="#2db7f5" style={{ marginLeft: '6px' }}>{props.switchInfo.room}</Tag>
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
    </Card>
  </div>
}