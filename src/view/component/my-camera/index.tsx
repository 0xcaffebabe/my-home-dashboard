import { Card, Tag, Image } from "antd";
import CameraInfo from "../../../dto/CameraInfo";

export default function MyCamera(props: { cameraInfo: CameraInfo }) {
  return <Card className="component" title={
    <div>
      <strong>{props.cameraInfo.name}</strong>
      <Tag color="#2db7f5" style={{ marginLeft: '6px' }}>默认家庭 卧室</Tag>
    </div>
  }>
    <Image
    width='100%'
    src={props.cameraInfo.picture}
    />
  </Card>
}