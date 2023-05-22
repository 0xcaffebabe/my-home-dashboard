import { Card, Tag, Image } from "antd";
import CameraInfo from "../../../dto/CameraInfo";
import styles from './my-camera.module.css'
import { useEffect, useState } from "react";
import HomeAssistantService from "../../../service/HomeAssistantService";

export default function MyCamera(props: { cameraInfo: CameraInfo }) {

  const [cameraInfo, setCameraInfo] = useState(props.cameraInfo)

  useEffect(() => {
    const listener = (data: any) => {
      const state = HomeAssistantService.convertCameraInfo(data)
      setCameraInfo(state)
    }
    HomeAssistantService.addEntityStateListener(cameraInfo.id, listener)
    return () => HomeAssistantService.remoevEntityStateListener(cameraInfo.id, listener)
  }, [])

  return <Card className="component" title={
    <div>
      <strong>{cameraInfo.name}</strong>
      <Tag color="#2db7f5" style={{ marginLeft: '6px' }}>{cameraInfo.room}</Tag>
    </div>
  }>
    <Image
    className={styles.CameraImage}
    width='100%'
    src={cameraInfo.picture}
    />
  </Card>
}