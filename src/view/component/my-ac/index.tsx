import { Switch, Card, Statistic, Row, Col, Button, Tag, Progress, Space, Segmented } from 'antd';
import ACInfo from '../../../dto/ACInfo';
import { useState } from 'react';
import {
  MinusOutlined,
  PlusOutlined
} from '@ant-design/icons';
import HomeAssistantService from '../../../service/HomeAssistantService'

const fanModeMap = {
  'auto': '自动',
  'low': '低速',
  'medium': '中速',
  'high': '高速'
}

const fanModeReverseMap = {
   '自动':'auto',
   '低速':'low',
   '中速':'medium',
   '高速':'high'
}

const hvacActionMap = {
  'off': '关闭',
  'cooling': '制冷',
  'auto': '自动'
}

export default function MyAC(props: { acInfo: ACInfo }) {
  const [acInfo, setAcInfo] = useState(props.acInfo);
  const onSwitchChanged = async (checked: boolean) => {
    let cmd = 'cool'
    if (!checked) {
      cmd = 'off'
    }
    setAcInfo(await HomeAssistantService.executeCommand('climate/set_hvac_mode', acInfo.id, 'ac', {
      hvac_mode: cmd
    }) as ACInfo)
  }

  const setTemperature = async (tmp: number) => {
    await onSwitchChanged(true)
    setAcInfo(await HomeAssistantService.executeCommand('climate/set_temperature', acInfo.id, 'ac', {
      temperature: tmp
    }) as ACInfo)
  }

  const onFanModeChanged = async (mode: string) => {
    const cmd = (fanModeReverseMap as any)[mode]
    setAcInfo(await HomeAssistantService.executeCommand('climate/set_fan_mode', acInfo.id, 'ac', {
      fan_mode: cmd
    }) as ACInfo)
  }

  return <div className='component'>
    <Card title={
      <div>
        <strong>{acInfo.name}</strong>
        <Tag color="#2db7f5" style={{ marginLeft: '6px' }}>{acInfo.room}</Tag>
      </div>
    } extra={<Switch  disabled={acInfo.state === 'unavailable'} checked={acInfo.state !== 'off' && acInfo.state !== 'unavailable'} onChange={onSwitchChanged} />}>
      <Row style={{ textAlign: 'center' }}>
        <Col span={12}>
          <Progress size="default" strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} type="dashboard" percent={(acInfo.temperature - 16) / 15 * 100} gapDegree={90} format={(p) => acInfo.temperature + ' ℃'} />
        </Col>
        <Col span={12}>
          <div>
            <Button><MinusOutlined /></Button><Button style={{ marginLeft: '10px' }}><PlusOutlined /></Button>
          </div>
          <div style={{ marginTop: '10px' }}>
            <Button size='small' type="primary" onClick={() => setTemperature(24)}>24 ℃</Button>
            <Button size='small' type="primary" onClick={() => setTemperature(26)} style={{ marginLeft: '5px' }}>26 ℃</Button>
          </div>
          <div style={{ marginTop: '10px' }}>
            <Switch checkedChildren='扫风' unCheckedChildren="未扫风" checked={acInfo.swingMode != 'off'} />
          </div>
        </Col>
        <Col md={14} xs={24}>
          <div style={{ marginTop: '10px' }}>
            <Segmented onChange={v => onFanModeChanged(v + '')} value={fanModeMap[acInfo.fanMode]} options={['自动', '低速', '中速', '高速']} />
          </div>
          <div style={{ marginTop: '10px' }}>
            <Segmented value={hvacActionMap[acInfo.hvacAction]} options={['关闭', '制冷', '自动', '制热', '除湿', '送风']} />
          </div>
        </Col>
      </Row>
      <Row style={{ marginTop: '10px' }}>
        <Col span={8}>
          <Statistic title="本月用电" value={acInfo.monthConsumption || '-'} suffix="度" />
        </Col>
        <Col span={8}>
          <Statistic title="今日用电" value={acInfo.todayConsumption || '-'} suffix="度" />
        </Col>
        <Col span={8}>
          <Statistic title="当前功耗" value={acInfo.currentPower || '-'} suffix="w" />
        </Col>
      </Row>
    </Card>
  </div>
}