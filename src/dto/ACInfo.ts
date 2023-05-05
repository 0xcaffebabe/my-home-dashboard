import BasicComponent from "./BasicComponent";

export default interface ACInfo extends BasicComponent {
  state: 'on' | 'off'
  temperature: number
  currentPower: number
  todayConsumption: number
  monthConsumption: number
}