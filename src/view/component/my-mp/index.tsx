import { Card, Col, Progress, Row, Slider, Tag } from "antd";
import MPInfo from "../../../dto/MPInfo";
import { useEffect, useState } from "react";
import type { SliderMarks } from 'antd/es/slider';
import HomeAssistantService from '../../../service/HomeAssistantService'

const marks: SliderMarks = {
  0: '0 %',
  50: '50 %',
  65: '65 %',
  90: '90 %',
  100: {
    style: {
      color: '#f50',
    },
    label: <strong>100%</strong>,
  },
};

export default function MyMP(props: {mpInfo: MPInfo}) {
  const [mpInfo, setMpInfo] = useState(props.mpInfo)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
  const onVolumeChange = async (val: number) => {
    if (timer) {
      clearTimeout(timer)
    }
    setTimer(setTimeout(() => {
      HomeAssistantService.executeCommand('media_player/volume_set', mpInfo.id, 'mp', {
        volume_level: val / 100
      })
    }, 300)) 
  }
  useEffect(() => {
    const listener = (data: any) => {
      const state = HomeAssistantService.convertMPInfo(data)
      setMpInfo(state)
    }
    HomeAssistantService.addEntityStateListener(mpInfo.id, listener)
    return () => HomeAssistantService.remoevEntityStateListener(mpInfo.id, listener)
  }, [])
  return <div className='component'>
    <Card title={
      <div>
        <strong>{mpInfo.name}</strong>
        <Tag color="#2db7f5" style={{ marginLeft: '6px' }}>{mpInfo.room}</Tag>
      </div>
    }>
      <div style={{textAlign: 'center'}}>{mpInfo.volume} %</div>
      <Slider marks={marks} defaultValue={mpInfo.volume} onChange={v => onVolumeChange(v)}/>
    </Card>
  </div>
}