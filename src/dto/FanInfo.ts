import BasicComponent from "./BasicComponent"

export default interface FanInfo extends BasicComponent {
  speed: number
  state: 'on' | 'off'
  mode: number
  swing: boolean
  modePresets: string[]
}