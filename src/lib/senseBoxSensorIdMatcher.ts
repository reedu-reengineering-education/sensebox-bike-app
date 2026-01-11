import { BoxEntity } from './store/useAuthStore'

/**
 *
 * @param getSensorKeyFromTitle
 * @returns [key: string, attribute: string] pair matching the sensor title
 */
function getSensorKeyFromTitle(title: string) {
  const lowerCaseTitle = title.toLowerCase()

  if (lowerCaseTitle.includes('temp')) return ['temperature', null]
  if (lowerCaseTitle.includes('luftfe')) return ['humidity', null]
  if (lowerCaseTitle.includes('pm10')) return ['finedust', 'pm10']
  if (lowerCaseTitle.includes('pm4')) return ['finedust', 'pm4']
  if (lowerCaseTitle.includes('pm2')) return ['finedust', 'pm2_5']
  if (lowerCaseTitle.includes('pm1')) return ['finedust', 'pm1']
  if (lowerCaseTitle.includes('distan')) return ['overtaking', null]
  if (lowerCaseTitle.includes('geschwin')) return ['speed', null]
}

export function getTitlefromSensorKey(
  key: string,
  attribute: string | undefined,
) {
  if (key === 'temperature') return 'Temperature'
  if (key === 'humidity') return 'Rel. Humidity'
  if (key === 'finedust') {
    if (attribute === 'pm10') return 'Finedust PM10'
    if (attribute === 'pm4') return 'Finedust PM4'
    if (attribute === 'pm2_5') return 'Finedust PM2.5'
    if (attribute === 'pm1') return 'Finedust PM1'
  }
  if (key === 'accelerometer') {
    if (attribute === 'x') return 'Acceleration X'
    if (attribute === 'y') return 'Acceleration Y'
    if (attribute === 'z') return 'Acceleration Z'
  }
  if (key === 'distance') return 'Overtaking Distance'
  if (key === 'overtaking') return 'Overtaking Manoeuvre'
  if (key === 'surface_classification') {
    if (attribute === 'asphalt') return 'Surface Asphalt'
    if (attribute === 'sett') return 'Surface Sett'
    if (attribute === 'compacted') return 'Surface Compacted'
    if (attribute === 'paving') return 'Surface Paving'
    if (attribute === 'standing') return 'Standing'
  }
  if (key === 'speed') return 'Speed'
  if (key === 'surface_anomaly') return 'Surface Anomaly'
}

export default function match(senseBox: BoxEntity, data: any) {
  return senseBox.sensors.reduce<
    {
      sensor: string
      value: number
      createdAt: string
      location: { lng: number; lat: number }
    }[]
  >((acc, sensor) => {
    const [key, _attribute] = getSensorKeyFromTitle(sensor.title) as [
      string,
      string,
    ]
    if (key && data.gps_lat && data.gps_lng) {
      acc.push({
        sensor: sensor._id,
        value: data[key] ?? -1,
        createdAt: data.timestamp.toISOString(),
        location: { lng: data.gps_lng, lat: data.gps_lat },
      })
    }
    return acc
  }, [])
}
