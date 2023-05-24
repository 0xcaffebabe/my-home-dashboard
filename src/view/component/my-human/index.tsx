import { Popover, Tag } from "antd";
import HumanInfo from "../../../dto/HumanInfo";
import { useEffect, useState } from "react";
import HomeAssistantService from "../../../service/HomeAssistantService";

export default function MyHuman(props: {humanList: HumanInfo[]}) {

  const [humanList, setHumanList] = useState<Array<HumanInfo>>([])

  useEffect(() => {
    const listener = (data: any) => {
      const state = HomeAssistantService.convertHumanSensortInfo(data)
      const entityIndex = humanList.findIndex(v => v.id == state.id)
      if (entityIndex != -1) {
        humanList[entityIndex] = state
        setHumanList(humanList)
      }
    }
    humanList.forEach(v => HomeAssistantService.addEntityStateListener(v.id, listener))
    return () => humanList.forEach(v => HomeAssistantService.remoevEntityStateListener(v.id, listener))
  }, [])

  useEffect(() => {
    setHumanList(props.humanList)
  }, [props.humanList])

  return <Popover className="component" title="详情" content={props.humanList.map(v => <div key={v.id}>{v.name}: <strong>{v.state}</strong></div>)}>
    <Tag className="component" color="warning">
      <strong>人体</strong>
      <div>
      {props.humanList.map(v => v.state).join(" | ")}
      </div>
    </Tag>
  </Popover>
}