import { Popover, Space, Tag } from "antd";
import THInfo from "../../../dto/THInfo";
import { useEffect, useState } from "react";
import HomeAssistantService from "../../../service/HomeAssistantService";

export default function MyTH(props: {thList: THInfo[]}) {
  const [thList, setThList] = useState<Array<THInfo>>([])
  
  useEffect(() => {
    const listener = (data: any) => {
      let state: THInfo
      if (data.entity_id.indexOf("weather") != -1) {
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

  const weather = thList.filter(v => v.id.indexOf("weather") != -1)[0]
  const notWeather = thList.filter(v => v.id.indexOf("weather") == -1)[0]
  return <div className="component" style={{margin: 0}}>
    <Tag color="#2db7f5" className="component">
      <div style={{verticalAlign: 'center'}}>
          <strong>天气</strong>
        </div>
      {weather?.temperature} ℃ / {weather?.humidity} %
    </Tag>
    <Tag color="#108ee9" className="component">
      <div style={{verticalAlign: 'center'}}>
          <strong>室内</strong>
        </div>
      {notWeather?.temperature} ℃ / {notWeather?.humidity} %
    </Tag>
  </div>
}