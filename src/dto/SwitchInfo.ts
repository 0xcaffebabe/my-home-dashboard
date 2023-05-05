import BasicComponent from "./BasicComponent"

export default interface SwitchInfo extends BasicComponent{
  state: 'on' | 'off' | 'unavailable'
  currentPower?: number
  todayConsumption?: number
  monthConsumption?: number
  temperature?: number
}