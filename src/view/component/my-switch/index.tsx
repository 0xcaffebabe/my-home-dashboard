import { Switch, Card, Statistic, Row, Col, Segmented, Tag } from 'antd';
import styles from './my-switch.module.css'
import SwitchInfo from '../../../dto/SwitchInfo';
import { useEffect, useState } from 'react';
import HomeAssistantService from '../../../service/HomeAssistantService'

export default function MySwitch(props: { switchInfo: SwitchInfo }) {
  const [switchInfo, setSwitchInfo] = useState(props.switchInfo)
  const [loading, setLoading] = useState(false)
  const offlineTempalte = () => {
    if (switchInfo.state == 'unavailable') {
      return <Tag color='error'>离线</Tag>
    }
  }
  const temperatureTemplate = () => {
    if (switchInfo.temperature) {
      return <Tag color='warning'>{switchInfo.temperature} ℃</Tag>
    }
  }
  const onSwitchChange = async (checked: boolean)  => {
    let cmd = 'on'
    if (!checked) {
      cmd = 'off'
    }
    setLoading(true)
    setSwitchInfo(await HomeAssistantService.executeCommand('switch/turn_' + cmd, switchInfo.id, 'switch', {}) as SwitchInfo)
    setLoading(false)
  }
  useEffect(() => {
    const listener = (data: any) => {
      const state = HomeAssistantService.convertSwitchInfo(data)
      setSwitchInfo(state)
    }
    HomeAssistantService.addEntityStateListener(switchInfo.id, listener)
    return () => HomeAssistantService.remoevEntityStateListener(switchInfo.id, listener)
  }, [])
  return <div className={styles.mySwitch + ' component'}>
    <Card title={
      <div>
        <strong>{switchInfo.name.split(" ")[0]}</strong>
        <Tag color="#2db7f5" style={{ marginLeft: '6px' }}>{switchInfo.room}</Tag>
        {offlineTempalte()}
        {temperatureTemplate()}
      </div>
    } extra={<Switch onChange={onSwitchChange} loading={loading} checked={switchInfo.state === 'on'} disabled={switchInfo.state === 'unavailable' || switchInfo.name.indexOf("常开") !== -1} />}>
      <Row>
        <Col span={8}>
          <Statistic title="本月用电" value={switchInfo.monthConsumption || '-'} suffix="度" />
        </Col>
        <Col span={8}>
          <Statistic title="今日用电" value={switchInfo.todayConsumption || '-'} suffix="度" />
        </Col>
        <Col span={8}>
          <Statistic title="当前功耗" value={switchInfo.currentPower || '-'} suffix="w" />
        </Col>
      </Row>
    </Card>
  </div>
}