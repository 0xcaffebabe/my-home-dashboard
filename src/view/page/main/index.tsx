import { Alert, Col, Row } from 'antd';
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
import MySimpleSwitch from '../../component/my-simple-switch';

export default function Main() {
  const [switchList, setSwitchList] = useState<SwitchInfo[]>([])
  const [cameraList, setCameraList] = useState<CameraInfo[]>([])
  const [thList, setTHList] = useState<THInfo[]>([])
  const [fanList, setFanList] = useState<FanInfo[]>([])
  const [illuminationList, setIlluminationList] = useState<IlluminationInfo[]>([])
  const [acList, setAcList] = useState<ACInfo[]>([])
  const [humanList, setHumanList] = useState<HumanInfo[]>([])
  const [lastUpdateTime, setLastUpdateTime] = useState(0)

  const refreshData = async () => {
    HomeAssistantService.getSwitchList().then(setSwitchList).then(() => setLastUpdateTime(HomeAssistantService.lastGetState))
    HomeAssistantService.getCameraList().then(setCameraList)
    HomeAssistantService.getTHList().then(setTHList)
    HomeAssistantService.getFanList().then(setFanList)
    HomeAssistantService.getIlluminationList().then(setIlluminationList)
    HomeAssistantService.getACList().then(setAcList)
    HomeAssistantService.getHumanSensorList().then(setHumanList)
  }

  const sensorsTempalte = () => {
    return [<Col sm={12} md={6}>
      <MyTH thList={thList} />
    </Col>,

    <Col xs={8} md={3}>
      <MyIllumination infoList={illuminationList} />
    </Col>,

    <Col xs={6} md={3}>
      <MyHuman humanList={humanList} />
    </Col>,
    // <Col xs={12} md={12}></Col>  
  ]
  }

  useEffect(() => {
    refreshData()
    const timer = setInterval(refreshData, 10000)
    return () => clearInterval(timer)
  }, [])
  return <Row style={{ height: '200px' }}>
    <div style={{ textAlign: 'center', width: '100%' }}>
      {`最后更新时间: ${new Date(lastUpdateTime).toLocaleString()}`}
    </div>

    {sensorsTempalte()}

    {switchList.filter(v => v.id.indexOf("lemesh") != -1).map(v => <Col key={v.id} xs={6} md={3}>
      <MySimpleSwitch switch={v} />
    </Col>)}

    {cameraList.map(v => <Col key={v.name} xs={24} md={10}>
      <MyCamera cameraInfo={v} />
    </Col>)}

    {fanList.map(v => <Col key={v.name} xs={24} md={6}>
      <MyFan fanInfo={v} />
    </Col>)}

    {acList.map(v => <Col key={v.name} xs={24} md={8}>
      <MyAC acInfo={v} />
    </Col>)}

    {switchList.filter(v => v.id.indexOf("lemesh") == -1).map(v => <Col key={v.id} md={8} xs={24}>
      <MySwitch switchInfo={v} />
    </Col>)}
  </Row>
}