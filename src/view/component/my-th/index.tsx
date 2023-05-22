import { Popover, Space, Tag } from "antd";
import THInfo from "../../../dto/THInfo";
import { useEffect, useState } from "react";
import HomeAssistantService from "../../../service/HomeAssistantService";

export default function MyTH(props: {thList: THInfo[]}) {
  const [thList, setThList] = useState<Array<THInfo>>([])
  
  useEffect(() => {
    const listener = (data: any) => {
      let state: THInfo
      if (data.id.indexOf("weather")) {
        state = HomeAssistantService.convertWeatherInfo(data)
      } else {
        state = HomeAssistantService.convertTHInfo(data)
      }
      const entityIndex = thList.findIndex(v => v.id == state.id)
      if (entityIndex != -1) {
        thList[entityIndex] = state
        setThList(thList)
      }
    }
    thList.forEach(v => HomeAssistantService.addEntityStateListener(v.id, listener))
    return () => thList.forEach(v => HomeAssistantService.remoevEntityStateListener(v.id, listener))
  }, [])

  useEffect(() => {
    setThList(props.thList)
  }, [props.thList])

  return <div className="component" style={{margin: 0}}>
    <Popover content={thList.map(v => <div key={v.name}>{v.name.split(" ")[0]} 温度: {v.temperature} ℃</div>)} title="详情">
      <Tag color="#2db7f5" className="component">
        <div style={{verticalAlign: 'center'}}>
          <strong>温度</strong>
        </div>
        <div>{thList.map(v => v.temperature + '℃').join(" | ")}</div>
      </Tag>
    </Popover>
    <Popover content={thList.map(v => <div key={v.name}>{v.name.split(" ")[0]} 湿度: {v.humidity} %</div>)} title="详情">
      <Tag color="#108ee9" className="component">
        <div style={{verticalAlign: 'center'}}>
          <strong>湿度</strong>
        </div>
        <div>{thList.map(v => v.humidity + '%').join(" | ")}</div>
      </Tag>
    </Popover>
  </div>
}