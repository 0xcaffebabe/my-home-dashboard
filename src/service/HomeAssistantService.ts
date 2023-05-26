import axios from "axios"
import SwitchInfo from "../dto/SwitchInfo"
import CameraInfo from "../dto/CameraInfo"
import THInfo from "../dto/THInfo"
import FanInfo from "../dto/FanInfo"
import IlluminationInfo from "../dto/IlluminationInfo"
import ACInfo from "../dto/ACInfo"
import BasicComponent from "../dto/BasicComponent"
import HumanInfo from "../dto/HumanInfo"
import dayjs from "dayjs"
import MPInfo from "../dto/MPInfo"

type EntityType = 'switch' | 'fan' | 'ac' | 'mp' | 'camera'

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3ODM0NDY3NzkwYTQ0NmM1YmQyOWQyNjQ2YTQ1OGRjMSIsImlhdCI6MTY4MjY1MDAyNywiZXhwIjoxOTk4MDEwMDI3fQ.OPwRen3NT8M_p1SCZE_HjVZyun0q8FZ4GppsMSdn8IE'

const host = '192.168.31.188:8080'
const protocol: 'http' | 'https' = 'http'
const url = protocol + '://' + host

class HomeAssistantService {

  public lastGetState = -1
  private lastStates: Array<any> = []
  private listeners: Map<string, Function[]> = new Map()
  private webSocket: WebSocket | null = null
  public errMsg: string = ''

  public constructor() {
    this.initWSConnection()
    setInterval(() => {
      if (this.webSocket != null) {
        if (this.webSocket.readyState === WebSocket.CLOSED) {
          console.log('websocket 挂了 重连')
          this.initWSConnection()
        }
      }
    }, 5000)
  }

  private async initWSConnection() {
    const wsProtocol = protocol == 'https' ? 'wss' : 'ws'
    this.webSocket = new WebSocket(`${wsProtocol}://${host}/api/websocket`);
    const webSocket = this.webSocket!;
    webSocket.onerror = (e) => {
      this.errMsg = '已关闭'
      webSocket.close()
    }
    webSocket.onopen = (e) => {
      this.errMsg = ''
    }
    webSocket.onclose = (e) => {
      console.log('websocket 断开')
    }
    webSocket.onmessage = (e) => {
      const data = JSON.parse(e.data) as any
      console.log(data)
      if (data.type == 'auth_required') {
        webSocket.send(JSON.stringify({
          "type": "auth",
          "access_token": token
        }))
      }
      if (data.type == 'auth_ok') {
        webSocket.send(JSON.stringify({
          "id": 18,
          "type": "subscribe_events",
          "event_type": "state_changed"
        }))
      }
      if (data.type == 'event') {
        const newState = data.event.data.new_state
        const observers = this.listeners.get(newState.entity_id)
        if (observers) {
          for(var i of observers) i.call(i, newState)
        }
      }
    }
  }

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

  private extractCommonInfo(data: any): BasicComponent {
    const subEntities = []
    for(const i of this.lastStates) {
      if (i.attributes.parent_entity_id == data.entity_id) {
        subEntities.push(i.entity_id)
      }
    }
    return {
      id: data.entity_id,
      name: data.attributes.friendly_name,
      subEntities,
      room: data.attributes['home_room']
    }
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
      .map(v => this.convertSwitchInfo(v)).map(v => {
        if (v.monthConsumption) {
          v.monthConsumption = parseFloat(v.monthConsumption.toFixed(1))
        }
        return v;
      })
  }

  public convertSwitchInfo(v: any) {
    let today = v.attributes['power_cost_today'] / 100
    if (today > 100) {
      today /= 10000
    }
    if (today) {
      today = parseFloat(today.toFixed(2))
    }
    let month = v.attributes['power_cost_month'] / 100 || v.attributes['power_consumption']
    if (month > 1000) {
      month /= 10000
    }
    let current = v.attributes['electric_power-11-2'] || v.attributes['electric_power-3-2'] || v.attributes['electric_power-5-6'] / 100
    if (current) {
      current = parseFloat(current.toFixed(2))
    }
    if (month) {
      month = parseFloat(month.toFixed(2))
    }
    return {
      ...this.extractCommonInfo(v),
      state: v.state,
      temperature: v.attributes['switch.temperature'],
      currentPower: current,
      todayConsumption: today,
      monthConsumption: month
    } as SwitchInfo
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
      .map(v => this.convertCameraInfo(v))
  }

  public convertCameraInfo(v: any) {
    return {
      ...this.extractCommonInfo(v),
      picture: url + v.attributes.entity_picture,
      on: v.attributes['camera_control.on']
    } as CameraInfo
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
      .map(v => this.convertWeatherInfo(v))
      ,...entityList
      .filter(v => v.entity_id.startsWith('sensor.miaomiaoce') && v.entity_id.endsWith('temperature_humidity_sensor'))
      .map(v => this.convertTHInfo(v))]
  }

  public convertWeatherInfo(v: any) {
    return {
      ...this.extractCommonInfo(v),
      temperature: v.attributes.temperature,
      humidity: v.attributes.humidity
    } as THInfo
  }

  public convertTHInfo(v: any) {
    return {
      ...this.extractCommonInfo(v),
      temperature: v.attributes['temperature-2-1'],
      humidity: v.attributes['relative_humidity-2-2'],
    } as THInfo
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
      .map((v) => this.convertFanInfo(v))
  }

  public convertFanInfo(v: any): FanInfo {
    return {
      ...this.extractCommonInfo(v),
      speed: v.attributes['fan.fan_level'],
      swing: v.attributes['fan.horizontal_swing'],
      mode: v.attributes['fan.mode'],
      state: v.state,
      modePresets: v.attributes['preset_modes']
    }
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
      .map(v => this.convertIlluminationInfo(v))
  }

  public convertIlluminationInfo(v: any) {
    return {
      ...this.extractCommonInfo(v),
      strength: v.state
    } as IlluminationInfo
  }


  /**
   *
   * 人在传感器与人体传感器列表
   * @return {*}  {Promise<HumanInfo[]>}
   * @memberof HomeAssistantService
   */
  public async getHumanSensorList(): Promise<HumanInfo[]> {
    return (await this.getStates())
        .filter(v => v.entity_id.endsWith('_motion_sensor') || v.entity_id.endsWith('_occupancy_sensor') || v.entity_id.indexOf("person.") != -1)
        .map(v => this.convertHumanSensortInfo(v))
  }

  public convertHumanSensortInfo(v: any) {
    return {
      ...this.extractCommonInfo(v),
      state: v.state
    } as HumanInfo
  }

  /**
   *
   * 空调列表
   * @return {*}  {Promise<ACInfo[]>}
   * @memberof HomeAssistantService
   */
  public async getACList(): Promise<ACInfo[]> {
    return (await this.getStates())
      .filter(v => v.entity_id.endsWith('_air_conditioner'))
      .map(v => this.convertAcInfo(v))
  }

  private convertAcInfo(v: any): ACInfo {
    return {
      ...this.extractCommonInfo(v),
      state: v.state,
      temperature: v.attributes.temperature,
      currentPower: parseFloat(v.attributes['electric_power-5-1'].toFixed(2)),
      todayConsumption: parseFloat((v.attributes['power_cost_today'] / 1000).toFixed(2)),
      monthConsumption: parseFloat((v.attributes['power_cost_month'] / 1000).toFixed(2)),
      fanModes: v.attributes['fan_modes'],
      fanMode: v.attributes['fan_mode'],
      hvacModes: v.attributes['hvac_modes'],
      hvacAction: v.attributes['hvac_action'],
      swingMode: v.attributes['swing_mode'],
      swingModes: v.attributes['swing_modes'],
    } as ACInfo
  }


  /**
   *
   * 音响列表
   * @return {*}  {Promise<MPInfo[]>}
   * @memberof HomeAssistantService
   */
  public async getMPList(): Promise<MPInfo[]> {
    return (await this.getStates())
      .filter(v => v.entity_id.startsWith('media_player'))
      .map(v => this.convertMPInfo(v))
  }

  public convertMPInfo(v: any): MPInfo {
    return {
      ...this.extractCommonInfo(v),
      state: v.state,
      volume: v.attributes['speaker.volume']
    } as MPInfo
  }


  /**
   *
   * 获取实体状态列表
   * @param {string} entityId
   * @param {Date} [end_time=new Date(new Date().getTime() - 24 * 3600 * 1000)]
   * @return {*}  {Promise<[string, string][]>}
   * @memberof HomeAssistantService
   */
  public async getEntityState(entityId: string, endTime: Date = new Date(new Date().getTime() - 30 * 24 * 3600 * 1000)): Promise<[string, string][]> {
    const resp = await axios({
      url: url + `/api/history/period?filter_entity_id=${entityId}&end_time=${dayjs(endTime).toISOString()}`,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    const data = resp.data[0] as Array<any>
    if (!data) {
      return []
    }
    return data.map(v => {
      return [v.last_changed, v.state]
    })
  }

  public async executeCommand(path: string, entityId: string, entityType: EntityType, params: any) {
    const resp = await axios({
      method: 'post',
      url: url + `/api/services/${path}`,
      data: {
        entity_id: entityId,
        ...params
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    const data = (resp.data as Array<any>)[0]
    if (data) {
      if (entityType == 'fan') {
        return this.convertFanInfo(data)
      }
      if (entityType == 'switch') {
        return this.convertSwitchInfo(data)
      }
      if (entityType == 'ac') {
        return this.convertAcInfo(data)
      }
      if (entityType == 'mp') {
        return this.convertMPInfo(data)
      }
      if (entityType == 'camera') {
        return this.convertCameraInfo(data)
      }
    }
  }

  public addEntityStateListener(id: string, fn: (e: any) => void) {
    if (!this.listeners.has(id)) {
      this.listeners.set(id, [])
    }
    this.listeners.get(id)?.push(fn)
  }

  public remoevEntityStateListener(id: string, fn: (e: any) => void) {
    const index = this.listeners.get(id)?.findIndex(e => e == fn) || -1
    if (index != -1) {
      this.listeners.set(id, this.listeners.get(id)?.splice(index, 1) || [])
    }
  }
}
const instance = new HomeAssistantService()
export default instance