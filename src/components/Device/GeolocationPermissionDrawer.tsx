import { usePermissionsStore } from '@/lib/store/usePermissionsStore'
import { Button } from '../ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '../ui/drawer'
import { Geolocation } from '@capacitor/geolocation';

export default function GeolocationPermissionDrawer() {
  const showGeolocationPermissionsDrawer = usePermissionsStore(
    state => state.showGeolocationPermissionsDrawer,
  )
  const setShowGeolocationPermissionsDrawer = usePermissionsStore(
    state => state.setShowGeolocationPermissionsDrawer,
  )
  const setGeolocationPermissionGranted = usePermissionsStore(
    state => state.setGeolocationPermissionGranted,
  )

  return (
    <Drawer
      open={showGeolocationPermissionsDrawer}
      onOpenChange={setShowGeolocationPermissionsDrawer}
    >
      <DrawerContent>
        <div className="mx-auto max-w-md px-4 pb-safe">
          <DrawerHeader>
            <DrawerTitle>Geolocation permission required</DrawerTitle>
            <DrawerDescription>
              senseBox:bike erhebt Standortdaten, um deine Fahrt aufzuzeichnen
              und deine Positionen mit Umweltdaten zu verknüpfen, auch wenn die
              App geschlossen ist oder nicht verwendet wird.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex w-full gap-2">
            <DrawerClose className="flex-1" asChild>
              <Button variant={'secondary'}>Ablehnen</Button>
            </DrawerClose>
            <Button
              className="flex-1"
              onClick={() => {
                Geolocation.requestPermissions();
                setGeolocationPermissionGranted(true);
              }}
            >
              Akzeptieren
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
