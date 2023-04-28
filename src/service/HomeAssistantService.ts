import axios from "axios"
import SwitchInfo from "../dto/SwitchInfo"

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3ODM0NDY3NzkwYTQ0NmM1YmQyOWQyNjQ2YTQ1OGRjMSIsImlhdCI6MTY4MjY1MDAyNywiZXhwIjoxOTk4MDEwMDI3fQ.OPwRen3NT8M_p1SCZE_HjVZyun0q8FZ4GppsMSdn8IE'
const url = ''

class HomeAssistantService {

  public async getSwitchList(): Promise<SwitchInfo[]> {
    const resp = await axios.get(url + 'states', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    const entityList = resp.data as Array<any>
    return entityList.filter(v => v.entity_id.startsWith('switch'))
      .map(v => {
        return {
          id: v.entity_id,
          state: v.state,
          name: v.attributes.friendly_name,
          temperature: v.attributes['switch.temperature'],
          currentPower: v.attributes['electric_power-11-2'] || v.attributes['electric_power-3-2'] || v.attributes['electric_power-5-6'] / 100,
          monthConsumption: v.attributes['power_cost_month'] / 100
        } as SwitchInfo
      })
  }
}

export default new HomeAssistantService()