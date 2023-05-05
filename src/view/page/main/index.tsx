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
import ACInfo from '../../../dto/ACInfo';
import MyAC from '../../component/my-ac';
import HumanInfo from '../../../dto/HumanInfo';
import MyHuman from '../../component/my-human';
export default function Main() {
  const [ switchList, setSwitchList ] = useState<SwitchInfo[]>([])
  const [ cameraList, setCameraList ] = useState<CameraInfo[]>([])
  const [ thList, setTHList ] = useState<THInfo[]>([])
  const [ fanList, setFanList ] = useState<FanInfo[]>([])
  const [ illuminationList, setIlluminationList ] = useState<IlluminationInfo[]>([])
  const [ acList, setAcList ] = useState<ACInfo[]>([])
  const [ humanList, setHumanList ] = useState<HumanInfo[]>([])

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

    HomeAssistantService.getACList()
      .then(setAcList)
    
    HomeAssistantService.getHumanSensorList()
      .then(setHumanList)
  }, [])
  return <Row style={{height:'200px'}} gutter={12}>

    <Col span={6}>
      <MyTH thList={thList} />
    </Col>
    
    <Col span={6}>
      <MyIllumination infoList={illuminationList} />
    </Col>

    <Col span={6}>
      <MyHuman humanList={humanList} />
    </Col>

    {cameraList.map(v => <Col key={v.name} span={12}>
      <MyCamera cameraInfo={v} />
    </Col>)}

    {fanList.map(v => <Col key={v.name} span={6}>
      <MyFan fanInfo={v} />
    </Col>)}

    {acList.map(v => <Col key={v.name} span={6}>
      <MyAC acInfo={v} />
    </Col>)}

    {switchList.map(v => <Col key={v.id} span={6}>
      <MySwitch switchInfo={v}/>
    </Col>)}
    

  </Row>
}