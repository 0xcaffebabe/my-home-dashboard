import axios from "axios"
import SwitchInfo from "../dto/SwitchInfo"
import CameraInfo from "../dto/CameraInfo"
import THInfo from "../dto/THInfo"
import FanInfo from "../dto/FanInfo"
import IlluminationInfo from "../dto/IlluminationInfo"

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3ODM0NDY3NzkwYTQ0NmM1YmQyOWQyNjQ2YTQ1OGRjMSIsImlhdCI6MTY4MjY1MDAyNywiZXhwIjoxOTk4MDEwMDI3fQ.OPwRen3NT8M_p1SCZE_HjVZyun0q8FZ4GppsMSdn8IE'
const url = 'http://192.168.31.188:8123'

class HomeAssistantService {

  private lastGetState = -1
  private lastStates: Array<any> = []

  private async getStates(): Promise<Array<any>> {
    if (new Date().getTime() - this.lastGetState <= 10000) {
      return this.lastStates
    }
    const resp = await axios.get(url + '/api/states', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    this.lastStates = resp.data as Array<any>
    this.lastGetState = new Date().getTime()
    return this.lastStates
  }


  /**
   *
   * 开关信息
   * @return {*}  {Promise<SwitchInfo[]>}
   * @memberof HomeAssistantService
   */
  public async getSwitchList(): Promise<SwitchInfo[]> {
    const entityList = await this.getStates()
    return entityList.filter(v => v.entity_id.startsWith('switch') && v.entity_id.endsWith('_switch'))
      .map(v => {
        return {
          id: v.entity_id,
          state: v.state,
          name: v.attributes.friendly_name,
          temperature: v.attributes['switch.temperature'],
          currentPower: v.attributes['electric_power-11-2'] || v.attributes['electric_power-3-2'] || v.attributes['electric_power-5-6'] / 100,
          todayConsumption: v.attributes['power_cost_today'] / 100,
          monthConsumption: v.attributes['power_cost_month'] / 100
        } as SwitchInfo
      })
  }


  /**
   *
   * 摄像头信息
   * @return {*}  {Promise<CameraInfo[]>}
   * @memberof HomeAssistantService
   */
  public async getCameraList(): Promise<CameraInfo[]> {
    const entityList = await this.getStates()
    return entityList
      .filter(v => v.entity_id.startsWith('camera'))
      .map(v => {
        return {
          id: v.entity_id,
          name: v.attributes.friendly_name,
          picture: url + v.attributes.entity_picture
        } as CameraInfo
      })
  }


  /**
   *
   * 天气情况 + 温湿度计信息
   * @return {*}  {Promise<THInfo[]>}
   * @memberof HomeAssistantService
   */
  public async getTHList(): Promise<THInfo[]> {
    const entityList = await this.getStates()
    return [
      ...entityList.filter(v => v.entity_id.startsWith('weather'))
      .map(v => {
        return {
          id: v.entity_id,
          name: v.attributes.friendly_name,
          temperature: v.attributes.temperature,
          humidity: v.attributes.humidity
        } as THInfo
      })
      ,...entityList
      .filter(v => v.entity_id.startsWith('sensor.miaomiaoce') && v.entity_id.endsWith('temperature_humidity_sensor'))
      .map(v => {
        return {
          id: v.entity_id,
          name: v.attributes.friendly_name,
          temperature: v.attributes['temperature-2-1'],
          humidity: v.attributes['relative_humidity-2-2'],
        } as THInfo
      })]
  }


  /**
   *
   * 风扇列表
   * @return {*}  {Promise<FanInfo[]>}
   * @memberof HomeAssistantService
   */
  public async getFanList(): Promise<FanInfo[]> {
    return (await this.getStates())
      .filter(v => v.entity_id.startsWith('fan') && v.entity_id.endsWith('fan'))
      .map(v => {
        return {
          id: v.entity_id,
          name: v.attributes.friendly_name,
          speed: v.attributes['fan.fan_level'],
          swing: v.attributes['fan.horizontal_swing'],
          mode: v.attributes['fan.mode'],
          state: v.state,
          modePresets: v.attributes['preset_modes']
        } as FanInfo
      })
  }


  /**
   *
   * 光照传感器列表
   * @return {*}  {Promise<IlluminationInfo[]>}
   * @memberof HomeAssistantService
   */
  public async getIlluminationList(): Promise<IlluminationInfo[]> {
    return (await this.getStates())
      .filter(v => v.entity_id.endsWith('_illumination'))
      .map(v => {
        return {
          id: v.entity_id,
          name: v.attributes.friendly_name,
          strength: v.state
        } as IlluminationInfo
      })
  }
}
const instance = new HomeAssistantService()
export default instance