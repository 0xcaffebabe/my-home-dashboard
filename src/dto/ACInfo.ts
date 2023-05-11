import BasicComponent from "./BasicComponent";

export default interface ACInfo extends BasicComponent {
  state: 'on' | 'off' | 'unavailable'
  temperature: number
  fanMode: 'auto' | 'low' | 'medium' | 'high'
  fanModes: string[]
  hvacModes: string[]
  hvacAction: 'off' | 'cooling'
  swingModes: string
  swingMode: string
  currentPower: number
  todayConsumption: number
  monthConsumption: number
}