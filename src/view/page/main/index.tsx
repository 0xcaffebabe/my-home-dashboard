import { Col, Row } from 'antd';
import MySwitch from '../../component/my-switch';
import HomeAssistantService from '../../../service/HomeAssistantService';
import { useEffect, useState } from 'react';
import SwitchInfo from '../../../dto/SwitchInfo';
export default function Main() {
  const [ switchList, setSwitchList ] = useState<SwitchInfo[]>([])

  useEffect(() => {
    HomeAssistantService.getSwitchList()
      .then(data => setSwitchList(data))
  })
  return <Row style={{height:'200px'}}>
    {switchList.map(v => <Col key={v.id} span={6}>
      <MySwitch switchInfo={v}/>
    </Col>)}
  </Row>
}