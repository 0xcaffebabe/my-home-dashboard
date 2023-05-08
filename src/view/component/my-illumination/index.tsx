import { Popover, Tag } from "antd";
import IlluminationInfo from "../../../dto/IlluminationInfo";

export default function MyIllumination(props: { infoList: IlluminationInfo[] }) {

  return <Popover className="component" title="详情" content={props.infoList.map(v => <div key={v.id}>{v.name}: <strong>{v.strength}</strong></div>)}>
    <Tag color="success">
      <strong>光照强度</strong>
      <div>
        {props.infoList.map(v => v.strength).join(" | ")}
      </div>
    </Tag>
  </Popover>
}