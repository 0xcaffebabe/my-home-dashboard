import { Popover, Tag } from "antd";
import HumanInfo from "../../../dto/HumanInfo";

export default function MyHuman(props: {humanList: HumanInfo[]}) {
  return <Popover className="component" title="详情" content={props.humanList.map(v => <div key={v.id}>{v.name}: <strong>{v.state}</strong></div>)}>
    <Tag className="component" color="warning">
      <strong>人体</strong>
      <div>
      {props.humanList.map(v => v.state).join(" | ")}
      </div>
    </Tag>
  </Popover>
}