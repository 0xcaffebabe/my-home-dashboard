import { Switch, Card, Statistic, Row, Col, Button, Tag, Progress, Space, Segmented   } from 'antd';
import ACInfo from '../../../dto/ACInfo';
import { useState } from 'react';
import {
  MinusOutlined,
  PlusOutlined
} from '@ant-design/icons';
import HomeAssistantService from '../../../service/HomeAssistantService'


export default function MyAC(props: {acInfo: ACInfo}) {
  const [acInfo, setAcInfo] = useState(props.acInfo);
  const onSwitchChanged = async (checked: boolean) => {
    let cmd = 'on'
    if (!checked) {
      cmd = 'off'
    }
    setAcInfo(await HomeAssistantService.executeCommand('climate/turn_' + cmd, acInfo.id, 'ac', {}) as ACInfo)
  }
  return <div className='component'>
    <Card title={
      <div>
        <strong>{acInfo.name}</strong>
        <Tag color="#2db7f5" style={{marginLeft: '6px'}}>{acInfo.room}</Tag>
      </div>
    } extra={<Switch disabled={acInfo.state === 'unavailable'} checked={acInfo.state === 'on'} onChange={onSwitchChanged}/>}>
      <Row style={{textAlign: 'center'}}>
        <Col span={8}>
          <div>
            <Button><MinusOutlined /></Button><Button style={{marginLeft: '10px'}}><PlusOutlined /></Button>
          </div>
          <div style={{marginTop: '10px'}}>
            <Button size='small' type="primary">24 ℃</Button>
            <Button size='small' type="primary" style={{marginLeft: '5px  '}}>26 ℃</Button>
          </div>
          <div style={{marginTop: '10px'}}>
            <Switch checkedChildren='扫风' unCheckedChildren="未扫风"/>
          </div>
        </Col>
        <Col span={16}>
          <Progress strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} type="dashboard" percent={15 / acInfo.temperature * 100} gapDegree={90} format={(p) => acInfo.temperature + ' ℃'}/>
        </Col>
        <Col md={14} xs={24}>
          <div style={{marginTop: '10px'}}>
            <Segmented options={['自动', '低速', '中速', '高速']} />
          </div>
          <div style={{marginTop: '10px'}}>
            <Segmented options={['自动', '制冷', '制热', '除湿', '送风', '关闭']} />
          </div>
        </Col>
      </Row>
      <Row style={{marginTop: '10px'}}>
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