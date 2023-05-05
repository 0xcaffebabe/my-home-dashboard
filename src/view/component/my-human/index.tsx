import { Tag } from "antd";
import HumanInfo from "../../../dto/HumanInfo";

export default function MyHuman(props: {humanList: HumanInfo[]}) {
  return <Tag className="component" color="warning">
    人体: {props.humanList.map(v => v.state).join(" | ")}
  </Tag>
}