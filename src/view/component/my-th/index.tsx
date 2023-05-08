import { Popover, Space, Tag } from "antd";
import THInfo from "../../../dto/THInfo";

export default function MyTH(props: {thList: THInfo[]}) {
  return <div className="component" style={{margin: 0}}>
    <Popover content={props.thList.map(v => <div key={v.name}>{v.name.split(" ")[0]} 温度: {v.temperature} ℃</div>)} title="详情">
      <Tag color="#2db7f5" className="component">
        <div style={{verticalAlign: 'center'}}>
          <strong>温度</strong>
        </div>
        <div>{props.thList.map(v => v.temperature + '℃').join(" | ")}</div>
      </Tag>
    </Popover>
    <Popover content={props.thList.map(v => <div key={v.name}>{v.name.split(" ")[0]} 湿度: {v.humidity} %</div>)} title="详情">
      <Tag color="#108ee9" className="component">
        <div style={{verticalAlign: 'center'}}>
          <strong>湿度</strong>
        </div>
        <div>{props.thList.map(v => v.humidity + '%').join(" | ")}</div>
      </Tag>
    </Popover>
  </div>
}