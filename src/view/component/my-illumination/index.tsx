import { Popover, Tag } from "antd";
import IlluminationInfo from "../../../dto/IlluminationInfo";
import { useEffect, useState } from "react";
import HomeAssistantService from "../../../service/HomeAssistantService";

export default function MyIllumination(props: { infoList: IlluminationInfo[] }) {

  const [infoList, setInfoList] = useState<Array<IlluminationInfo>>([])

  useEffect(() => {
    const listener = (data: any) => {
      const state = HomeAssistantService.convertIlluminationInfo(data)
      const entityIndex = infoList.findIndex(v => v.id == state.id)
      if (entityIndex != -1) {
        infoList[entityIndex] = state
        setInfoList(infoList)
      }
    }
    infoList.forEach(v => HomeAssistantService.addEntityStateListener(v.id, listener))
    return () => infoList.forEach(v => HomeAssistantService.remoevEntityStateListener(v.id, listener))
  }, [])

  useEffect(() => {
    setInfoList(props.infoList)
  }, [props.infoList])

  return <Popover className="component" title="详情" content={props.infoList.map(v => <div key={v.id}>{v.name}: <strong>{v.strength}</strong></div>)}>
    <Tag color="success">
      <strong>光照强度</strong>
      <div>
        {props.infoList.map(v => v.strength).join(" | ")}
      </div>
    </Tag>
  </Popover>
}