import AbstractSensor from './abstract-sensor'
import BaseSensor from './base-sensor'
import i18n from '@/i18n'

export default class OvertakingPredictionSensor<T extends [number, number]>
  extends BaseSensor<T>
  implements AbstractSensor<T>
{
  public static BLE_CHARACTERISTIC: string =
    'FC01C688-2C44-4965-AE18-373AF9FED18D'

  public static type: string = 'overtaking'
  public static attributes: string[] = [i18n.t('phenomena.overtaking_car'), i18n.t('phenomena.overtaking_bike')]

  parseData(data: DataView): T {
    const [overtaking_car, overtaking_bike] = this.parsePackages(data)

    return [overtaking_car, overtaking_bike] as T
  }
}
