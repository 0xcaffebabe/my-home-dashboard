import { Col, Row } from 'antd';
import MySwitch from '../../component/my-switch';
import HomeAssistantService from '../../../service/HomeAssistantService';
import { useEffect, useState } from 'react';
import SwitchInfo from '../../../dto/SwitchInfo';
import CameraInfo from '../../../dto/CameraInfo';
import MyCamera from '../../component/my-camera';
import THInfo from '../../../dto/THInfo';
import MyTH from '../../component/my-th';
import FanInfo from '../../../dto/FanInfo';
import MyFan from '../../component/my-fan';
import IlluminationInfo from '../../../dto/IlluminationInfo';
import MyIllumination from '../../component/my-illumination';
export default function Main() {
  const [ switchList, setSwitchList ] = useState<SwitchInfo[]>([])
  const [ cameraList, setCameraList ] = useState<CameraInfo[]>([])
  const [ thList, setTHList ] = useState<THInfo[]>([])
  const [ fanList, setFanList ] = useState<FanInfo[]>([])
  const [ illuminationList, setIlluminationList ] = useState<IlluminationInfo[]>([])

  useEffect(() => {
    HomeAssistantService.getSwitchList()
      .then(data => {
        console.log(data)
        setSwitchList(data)
      })

    HomeAssistantService.getCameraList()
      .then(setCameraList)

    HomeAssistantService.getTHList()
      .then(setTHList)
    
    HomeAssistantService.getFanList()
      .then(setFanList)

      HomeAssistantService.getIlluminationList()
      .then(setIlluminationList)
  }, [])
  return <Row style={{height:'200px'}} gutter={12}>

    {thList.map(v => <Col key={v.id} span={6}>
      <MyTH thInfo={v} />
    </Col>)}
    
    <Col span={12}>
      <MyIllumination infoList={illuminationList} />
    </Col>

    {cameraList.map(v => <Col key={v.name} span={12}>
      <MyCamera cameraInfo={v} />
    </Col>)}

    {fanList.map(v => <Col key={v.name} span={12}>
      <MyFan fanInfo={v} />
    </Col>)}

    {switchList.map(v => <Col key={v.id} span={6}>
      <MySwitch switchInfo={v}/>
    </Col>)}
    

  </Row>
}