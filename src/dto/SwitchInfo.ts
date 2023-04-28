export default interface SwitchInfo {
  id: string
  name: string
  state: 'on' | 'off'
  currentPower?: number
  todayConsumption?: number
  monthConsumption?: number
  temperature?: number
}