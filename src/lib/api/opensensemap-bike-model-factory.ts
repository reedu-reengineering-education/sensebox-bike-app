export type senseBoxBikeModel = 'default' | 'atrai'

export const senseBoxBikeModelFactory = (
  name: string,
  longitude: number,
  latitude: number,
  grouptags?: string[],
  model: senseBoxBikeModel = 'default',
) => {
  const baseProperties = {
    name: name,
    exposure: 'mobile',
    location: [longitude, latitude],
    grouptag: grouptags ?? ['bike'],
  }
  return {
    ...baseProperties,
    sensors: sensors[model],
  }
}

const sensors: Record<
  senseBoxBikeModel,
  {
    id: number
    icon: string
    title: string
    unit: string
    sensorType: string
  }[]
> = {
  default: [
    {
      id: 0,
      icon: 'osem-thermometer',
      title: 'Temperatur',
      unit: '°C',
      sensorType: 'HDC1080',
    },
    {
      id: 1,
      icon: 'osem-humidity',
      title: 'rel. Luftfeuchte',
      unit: '%',
      sensorType: 'HDC1080',
    },
    {
      id: 2,
      icon: 'osem-cloud',
      title: 'PM1',
      unit: 'µg/m³',
      sensorType: 'SPS30',
    },
    {
      id: 3,
      icon: 'osem-cloud',
      title: 'PM25',
      unit: 'µg/m³',
      sensorType: 'SPS30',
    },
    {
      id: 4,
      icon: 'osem-cloud',
      title: 'PM4',
      unit: 'µg/m³',
      sensorType: 'SPS30',
    },
    {
      id: 5,
      icon: 'osem-cloud',
      title: 'PM10',
      unit: 'µg/m³',
      sensorType: 'SPS30',
    },
    {
      id: 6,
      icon: 'osem-signal',
      title: 'Distanz Links',
      unit: 'cm',
      sensorType: 'HC-SR04',
    },
    {
      id: 7,
      icon: 'osem-shock',
      title: 'Beschleunigung X',
      unit: 'm/s²',
      sensorType: 'MPU-6050',
    },
    {
      id: 8,
      icon: 'osem-shock',
      title: 'Beschleunigung Y',
      unit: 'm/s²',
      sensorType: 'MPU-6050',
    },
    {
      id: 9,
      icon: 'osem-shock',
      title: 'Beschleunigung Z',
      unit: 'm/s²',
      sensorType: 'MPU-6050',
    },
    {
      id: 10,
      icon: 'osem-dashboard',
      title: 'Geschwindigkeit',
      unit: 'km/h',
      sensorType: 'GPS',
    },
  ],
  atrai: [
    {
      id: 0,
      icon: 'osem-thermometer',
      title: 'Temperature',
      unit: '°C',
      sensorType: 'HDC1080',
    },
    {
      id: 1,
      icon: 'osem-humidity',
      title: 'Rel. Humidity',
      unit: '%',
      sensorType: 'HDC1080',
    },
    {
      id: 2,
      icon: 'osem-cloud',
      title: 'Finedust PM1',
      unit: 'µg/m³',
      sensorType: 'SPS30',
    },
    {
      id: 3,
      icon: 'osem-cloud',
      title: 'Finedust PM2.5',
      unit: 'µg/m³',
      sensorType: 'SPS30',
    },
    {
      id: 4,
      icon: 'osem-cloud',
      title: 'Finedust PM4',
      unit: 'µg/m³',
      sensorType: 'SPS30',
    },
    {
      id: 5,
      icon: 'osem-cloud',
      title: 'Finedust PM10',
      unit: 'µg/m³',
      sensorType: 'SPS30',
    },
    {
      id: 6,
      icon: 'osem-shock',
      title: 'Overtaking Car',
      unit: '%',
      sensorType: 'VL53L8CX',
    },
    {
      id: 7,
      icon: 'osem-shock',
      title: 'Overtaking Bike',
      unit: '%',
      sensorType: 'VL53L8CX',
    },
    {
      id: 8,
      icon: 'osem-shock',
      title: 'Overtaking Distance',
      unit: 'cm',
      sensorType: 'VL53L8CX',
    },
    {
      id: 9,
      icon: 'osem-shock',
      title: 'Surface Asphalt',
      unit: '%',
      sensorType: 'MPU-6050',
    },
    {
      id: 10,
      icon: 'osem-shock',
      title: 'Surface Sett',
      unit: '%',
      sensorType: 'MPU-6050',
    },
    {
      id: 11,
      icon: 'osem-shock',
      title: 'Surface Compacted',
      unit: '%',
      sensorType: 'MPU-6050',
    },
    {
      id: 12,
      icon: 'osem-shock',
      title: 'Surface Paving',
      unit: '%',
      sensorType: 'MPU-6050',
    },
    {
      id: 13,
      icon: 'osem-shock',
      title: 'Standing',
      unit: '%',
      sensorType: 'MPU-6050',
    },
    {
      id: 14,
      icon: 'osem-shock',
      title: 'Surface Anomaly',
      unit: 'Δ',
      sensorType: 'MPU-6050',
    },
    {
      id: 15,
      icon: 'osem-dashboard',
      title: 'Speed',
      unit: 'm/s',
      sensorType: 'GPS',
    },
  ],
}