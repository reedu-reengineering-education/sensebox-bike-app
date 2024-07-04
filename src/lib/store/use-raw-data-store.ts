import { create } from 'zustand'

type Characteristic = string

export interface RawBLESensorData<T> {
  measurement: T
  timestamp: Date
}

interface RawBLEDataStore<T> {
  rawBleSensorData: Record<Characteristic, RawBLESensorData<T>[]>
  addRawBLESensorData: (
    _characteristic: Characteristic,
    _measurements: RawBLESensorData<T>,
  ) => void
  rawGeolocationData: GeoJSON.LineString
  addRawGeolocationData: (_geolocation: GeoJSON.Point) => void
  reset: () => void
}

export const useRawBLEDataStore = create<RawBLEDataStore<number[]>>(set => ({
  rawBleSensorData: {},
  addRawBLESensorData: (characteristic, measurement) => {
    // remove data older than 15 seconds
    const now = new Date()
    set(state => ({
      rawBleSensorData: {
        ...state.rawBleSensorData,
        [characteristic]: [
          ...(state.rawBleSensorData[characteristic] || []).filter(
            data => now.getTime() - data.timestamp.getTime() < 15000,
          ),
          measurement,
        ],
      },
    }))
  },
  rawGeolocationData: {
    type: 'LineString',
    coordinates: [],
  },
  addRawGeolocationData: geolocation => {
    set(state => ({
      rawGeolocationData: {
        ...state.rawGeolocationData,
        coordinates: [
          ...state.rawGeolocationData.coordinates,
          [geolocation.coordinates[0], geolocation.coordinates[1]],
        ],
      },
    }))
  },
  reset: () =>
    set({
      rawBleSensorData: {},
      rawGeolocationData: { type: 'LineString', coordinates: [] },
    }),
}))
