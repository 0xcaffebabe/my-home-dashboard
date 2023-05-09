import { Card, Switch, Tag } from "antd";
import SwitchInfo from "../../../dto/SwitchInfo";
import { useState } from "react";
import HomeAssistantService from "../../../service/HomeAssistantService";

export default function MySimpleSwitch(props: {switch: SwitchInfo}) {
  const [switchInfo, setSwitchInfo] = useState(props.switch);
  const [loading, setLoading] = useState(false)
  const offlineTempalte = () => {
    if (switchInfo.state == 'unavailable') {
      return <Tag color='error'>离线</Tag>
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
  return <Tag className="component" color="cyan">
    <div style={{padding: '10px 6px'}}>
      <strong>{switchInfo.name.split(" ")[0]}</strong>
      {offlineTempalte()}
      <Switch loading={loading} onChange={onSwitchChange} checked={switchInfo.state === 'on'} disabled={switchInfo.state === 'unavailable'} style={{marginLeft: '6px'}} size="small"/>
    </div>
  </Tag>
}