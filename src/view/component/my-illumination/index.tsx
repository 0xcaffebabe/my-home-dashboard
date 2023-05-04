import { Tag } from "antd";
import IlluminationInfo from "../../../dto/IlluminationInfo";

export default function MyIllumination(props: {infoList: IlluminationInfo[]}) {

  return <Tag color="success" className="component">
  光照强度 {props.infoList.map(v => v.strength).join(" | ")}
</Tag>
}