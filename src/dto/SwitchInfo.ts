import BasicComponent from "./BasicComponent"

export default interface SwitchInfo extends BasicComponent{
  state: 'on' | 'off'
  currentPower?: number
  todayConsumption?: number
  monthConsumption?: number
  temperature?: number
}