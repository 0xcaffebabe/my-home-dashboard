import { Card, Segmented, Space, Switch, Tag } from "antd";
import FanInfo from "../../../dto/FanInfo";
import HomeAssistantService from '../../../service/HomeAssistantService'
import { useState } from "react";

const speedLevel = ['一档', '二档', '三档']
const presets = ['直吹风', '睡眠风']

export default function MyFan(props: { fanInfo: FanInfo }) {
  const [fanInfo, setFanInfo] = useState(props.fanInfo)
  const [switchLoading, setSwitchLoading] = useState(false)
  const [swingLoading, setSwingLoading] = useState(false)
  const [presetLoading, setPresetLoading] = useState(false)

  // 开关
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

  // 档位
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

  // 摇头
  const onSwingChange = async (checked: boolean) => {
    let cmd = false
    if (checked) {
      cmd = true
    }
    setSwingLoading(true)
    const ret = (await HomeAssistantService.executeCommand('fan/oscillate', props.fanInfo.id, 'fan', {
      oscillating: cmd
    })) as FanInfo
    setFanInfo(ret)
    setSwingLoading(false)
  }

  // 模式
  const onPresetChange = async (val: string) => {
    const index = presets.findIndex(v => v === val)
    if (index != -1) {
      setPresetLoading(true)
      const ret = (await HomeAssistantService.executeCommand('fan/set_preset_mode', props.fanInfo.id, 'fan', {
        preset_mode: fanInfo.modePresets[index]
      })) as FanInfo
      setFanInfo(ret)
      setPresetLoading(false)
    }
  }

  return <Card className="component" title={
    <div>
      <strong>{fanInfo.name}</strong>
      <Tag color="#2db7f5" style={{ marginLeft: '6px' }}>{fanInfo.room}</Tag>
    </div>
  } extra={<Switch checked={fanInfo.state === 'on'} onChange={(c) => onSwitchChange(c)} loading={switchLoading}/>}>
    <div style={{textAlign: 'center', marginBottom: '10px'}}>
      <Switch disabled={fanInfo.state !== 'on'} checkedChildren="正在摇头" unCheckedChildren="未在摇头" checked={fanInfo.swing} loading={swingLoading} onChange={onSwingChange}/>
    </div>
    <div style={{textAlign: 'center', marginBottom: '10px'}}>
      <Segmented options={speedLevel} style={{marginLeft: '10px'}} defaultValue={speedLevel[fanInfo.speed - 1]} onChange={(e) => onSpeedChange(e + '')}/>
    </div>
    <div style={{textAlign: 'center'}}>
      <Segmented disabled={fanInfo.state !== 'on'} options={presets} style={{marginLeft: '10px'}} onChange={e => onPresetChange(e + '')}/>
    </div>

  </Card>
}