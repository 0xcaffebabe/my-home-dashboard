import { Card, Segmented, Space, Switch, Tag } from "antd";
import FanInfo from "../../../dto/FanInfo";
import HomeAssistantService from '../../../service/HomeAssistantService'
import { useState } from "react";

const speedLevel = ['一档', '二档', '三档']

export default function MyFan(props: { fanInfo: FanInfo }) {
  const [fanInfo, setFanInfo] = useState(props.fanInfo)
  const [switchLoading, setSwitchLoading] = useState(false)
  const onSwitchChange = async (checked: boolean) => {
    let command = 'on'
    if (!checked) {
      command = 'off'
    }
    setSwitchLoading(true)
    const ret = (await HomeAssistantService.executeCommand('fan/turn_' + command, props.fanInfo.id, 'fan', {})) as FanInfo
    setFanInfo(ret)
    setSwitchLoading(false)
  }

  const onSpeedChange = async (val: string) => {
    let speed = 100
    if (val == '一档') {
      speed = 33
    }
    if (val == '二档') {
      speed = 66
    }
    setSwitchLoading(true)
    const ret = (await HomeAssistantService.executeCommand('fan/set_percentage', props.fanInfo.id, 'fan', {
      percentage: speed
    })) as FanInfo
    setFanInfo(ret)
    setSwitchLoading(false)
  }

  return <Card className="component" title={
    <div>
      <strong>{fanInfo.name}</strong>
      <Tag color="#2db7f5" style={{ marginLeft: '6px' }}>{fanInfo.room}</Tag>
    </div>
  } extra={<Switch checked={fanInfo.state === 'on'} onChange={(c) => onSwitchChange(c)} loading={switchLoading}/>}>
    <Switch checkedChildren="正在摇头" unCheckedChildren="未在摇头"/>
    <Segmented options={speedLevel} style={{marginLeft: '10px'}} defaultValue={speedLevel[fanInfo.speed - 1]} onChange={(e) => onSpeedChange(e + '')}/>
    <Segmented options={['直吹风', '睡眠风']} style={{marginLeft: '10px'}}/>
  </Card>
}