import { toast } from '@/components/ui/use-toast'
import { BleClient, BleDevice } from '@capacitor-community/bluetooth-le'
import { create } from 'zustand'
import { characteristicRegistry } from '../sensors'
import { BLE_SENSEBOX_SERVICE } from '../sensors/base-sensor'
import { useRawBLEDataStore } from '../store/use-raw-data-store'
import { useBLEStore } from '../store/useBLEStore'

export const useDisconnectStore = create<{
  userDisconnect: boolean
  setUserDisconnect: (userDisconnect: boolean) => void
}>(set => ({
  userDisconnect: false,
  setUserDisconnect: (userDisconnect: boolean) => set({ userDisconnect }),
}))

export const connectToDevice = async (
  name?: string,
  onDisconnect?: (_deviceId: string) => void,
): Promise<void> => {
  try {
    await BleClient.initialize({ androidNeverForLocation: true })

    const device = await findDeviceByName(name)
    if (!device) {
      throw new Error('No device found')
    }

    await connectToDeviceWithHandler(device.deviceId, onDisconnect)

    useBLEStore.getState().setDevice(device)
  } catch (error) {
    console.error('Failed to connect to device:', error)
  }
}

const findDeviceByName = async (name?: string): Promise<BleDevice> => {
  if (name) {
    return new Promise<BleDevice>(async (resolve, reject) => {
      const timeout = setTimeout(async () => {
        await BleClient.stopLEScan()
        reject('Timeout')
      }, 10000)

      try {
        await BleClient.requestLEScan({ name }, result => {
          clearTimeout(timeout)
          resolve(result.device)
        })
      } catch (error) {
        clearTimeout(timeout)
        reject(error)
      }
    })
  } else {
    return BleClient.requestDevice({
      namePrefix: 'senseBox',
      optionalServices: [BLE_SENSEBOX_SERVICE.toLowerCase()],
    })
  }
}

const connectToDeviceWithHandler = async (
  deviceId: string,
  onDisconnect?: (_deviceId: string) => void,
): Promise<void> => {
  const disconnectHandler = async () => {
    const userDisconnect = useDisconnectStore.getState().userDisconnect
    if (userDisconnect) {
      toast({ title: '🦈 Device disconnected by user' })
      if (onDisconnect) {
        onDisconnect(deviceId)
      }
      useBLEStore.getState().setDevice(undefined)
      useDisconnectStore.getState().setUserDisconnect(false)
      useBLEStore.getState().setConnected(false)
    } else {
      toast({ title: 'Device disconnected, attempting to reconnect...' })
      await reconnectWithRetry(deviceId)
    }
  }

  try {
    await BleClient.connect(deviceId, disconnectHandler)
  } catch (error) {
    console.error('🦈 Initial connection failed:', error)
  }
}

const reconnectWithRetry = async (deviceId: string): Promise<void> => {
  const maxRetries = 5
  let retries = 0

  while (retries < maxRetries) {
    try {
      toast({
        title: `Reconnecting... ${retries + 1} / ${maxRetries}`,
      })
      await BleClient.connect(deviceId, undefined, { timeout: 5000 })

      toast({ title: 'Successfully reconnected to device' })
      subscribeToAvailableSensors()
      return
    } catch (error) {
      toast({ title: `Reconnect attempt ${retries + 1} failed: ${error}` })
      retries++
    }
  }

  toast({ title: 'Could not reconnect to device after 5 attempts' })
  disconnectFromDevice()
}

export const disconnectFromDevice = async () => {
  const deviceId = useBLEStore.getState().device?.deviceId
  if (!deviceId) {
    useDisconnectStore.getState().setUserDisconnect(false)
    throw new Error('No device connected')
  }
  useDisconnectStore.getState().setUserDisconnect(true)
  console.log('🦈 Disconnecting from device', deviceId)
  console.log(useDisconnectStore.getState().userDisconnect)
  await BleClient.disconnect(deviceId)
  useRawBLEDataStore.getState().reset()
  useBLEStore.getState().setDevice(undefined)
  useBLEStore.getState().setConnected(false)
  await unsubscribeFromAvailableSensors()
}

export const subscribeToAvailableSensors = async () => {
  const deviceId = useBLEStore.getState().device?.deviceId
  if (!deviceId) {
    throw new Error('No device connected')
  }
  const services = await BleClient.getServices(deviceId)
  console.log('🦈 Services', services)
  const senseBoxService = services.find(
    service => service.uuid === BLE_SENSEBOX_SERVICE.toLowerCase(),
  )
  if (!senseBoxService) {
    throw new Error('No senseBox service found')
  }
  for (const characteristic of senseBoxService.characteristics) {
    const upperCaseUUID = characteristic.uuid.toUpperCase()
    if (characteristicRegistry[upperCaseUUID]) {
      const sensor = new characteristicRegistry[upperCaseUUID]()
      sensor.subscribe()
    }
  }
}

export const unsubscribeFromAvailableSensors = async () => {
  const deviceId = useBLEStore.getState().device?.deviceId
  if (!deviceId) {
    throw new Error('No device connected')
  }
  const services = await BleClient.getServices(deviceId)
  const senseBoxService = services.find(
    service => service.uuid === BLE_SENSEBOX_SERVICE.toLowerCase(),
  )
  if (!senseBoxService) {
    throw new Error('No senseBox service found')
  }
  for (const characteristic of senseBoxService.characteristics) {
    const upperCaseUUID = characteristic.uuid.toUpperCase()
    if (characteristicRegistry[upperCaseUUID]) {
      const sensor = new characteristicRegistry[upperCaseUUID]()
      sensor.unsubscribe()
    }
  }
}

export const getSubscribableSensors = async () => {
  const deviceId = useBLEStore.getState().device?.deviceId
  if (!deviceId) {
    throw new Error('No device connected')
  }
  const services = await BleClient.getServices(deviceId)
  const availableCharacteristics = []
  for (const service of services) {
    console.log('🦈 Service', service)
    for (const characteristic of service.characteristics) {
      if (characteristicRegistry[characteristic.uuid]) {
        availableCharacteristics.push(characteristic.uuid)
      }
    }
  }
  return availableCharacteristics
}
