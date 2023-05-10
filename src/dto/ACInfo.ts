import BasicComponent from "./BasicComponent";

export default interface ACInfo extends BasicComponent {
  state: 'on' | 'off' | 'unavailable'
  temperature: number
  fanMode: string
  fanModes: string[]
  hvacModes: string[]
  hvacAction: string
  swingModes: string
  swingMode: string
  currentPower: number
  todayConsumption: number
  monthConsumption: number
}