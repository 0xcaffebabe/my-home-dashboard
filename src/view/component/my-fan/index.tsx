import { Card, Segmented, Space, Switch, Tag } from "antd";
import FanInfo from "../../../dto/FanInfo";

const speedLevel = ['一档', '二档', '三档']

export default function MyFan(props: { fanInfo: FanInfo }) {
  return <Card className="component" title={
    <div>
      <strong>{props.fanInfo.name}</strong>
      <Tag color="#2db7f5" style={{ marginLeft: '6px' }}>默认家庭 卧室</Tag>
    </div>
  } extra={<Switch defaultChecked={props.fanInfo.state === 'on'} />}>
    <Switch checkedChildren="正在摇头" unCheckedChildren="未在摇头"/>
    <Segmented options={speedLevel} style={{marginLeft: '10px'}} defaultValue={speedLevel[props.fanInfo.speed - 1]}/>
    <Segmented options={['直吹风', '睡眠风']} style={{marginLeft: '10px'}}/>
  </Card>
}