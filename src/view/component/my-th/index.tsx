import { Space, Tag } from "antd";
import THInfo from "../../../dto/THInfo";

export default function MyTH(props: {thInfo: THInfo}) {
  return <Tag color="processing" className="component">
    {props.thInfo.name} <Space />
    温度: {props.thInfo.temperature} ℃ / 湿度: {props.thInfo.humidity} %
  </Tag>
}