import { Space, Tag } from "antd";
import THInfo from "../../../dto/THInfo";

export default function MyTH(props: {thList: THInfo[]}) {
  return <Tag color="processing" className="component">
    温度: {props.thList.map(v => `${v.name.split(" ")[0]} 温度: ${v.temperature} ℃, 湿度: ${v.humidity} %`).sort().join("</br>")}
  </Tag>
}