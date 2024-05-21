import Map from '@/components/Map/Map'
import { useExclusionZoneStore } from '@/lib/store/useExclusionZoneStore'
import { useEffect, useRef, useState } from 'react'
import DrawControl from '../Map/DrawControl'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'

import { bbox, featureCollection } from '@turf/turf'
import { MapRef } from 'react-map-gl'

export default function ExclusionZoneDialog() {
  const zones = useExclusionZoneStore(state => state.zones)
  const overwriteZones = useExclusionZoneStore(state => state.overwriteZones)

  const [drawRef, setDrawRef] = useState<MapboxDraw | null>(null)
  useEffect(() => {
    if (drawRef) {
      drawRef.deleteAll()
      drawRef.add(zones)
    }
  }, [drawRef])

  const mapRef = useRef<MapRef>(null)

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.on('load', () => {
        const zones = drawRef?.getAll()

        if (!zones || !zones.features || zones.features.length === 0) return

        // @ts-ignore
        mapRef.current?.fitBounds(bbox(zones), {
          padding: 50,
          duration: 800,
        })
      })
    }
  }, [mapRef.current, drawRef])

  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full">
          Private Zonen verwalten
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Private Zonen</DialogTitle>
          <DialogDescription>
            Sie können private Zonen definieren, in denen keine Daten
            aufgezeichnet werden.
          </DialogDescription>
          <DialogDescription className="flex flex-wrap items-center gap-x-1">
            Tippen Sie auf
            <span className="flex h-6 w-6 items-center justify-center rounded bg-white">
              <i className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_polygon" />
            </span>
            um eine Zone zu zeichnen und auf
            <span className="flex h-6 w-6 items-center justify-center rounded bg-white">
              <i className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash" />
            </span>
            um eine Zone zu löschen.
          </DialogDescription>
        </DialogHeader>
        <div className="h-96 w-full overflow-hidden rounded-md">
          {/* @ts-ignore */}
          <Map ref={mapRef}>
            <DrawControl
              position="top-left"
              displayControlsDefault={false}
              controls={{
                polygon: true,
                trash: true,
              }}
              ref={ref => setDrawRef(ref)}
            />
          </Map>
        </div>
        <Button
          onClick={() => {
            const fc = drawRef?.getAll()
            if (!fc) return

            const polygons = featureCollection(
              fc.features.filter(f => f.geometry.type === 'Polygon'),
            ) as GeoJSON.FeatureCollection<GeoJSON.Polygon>
            overwriteZones(polygons)
            setOpen(false)
          }}
        >
          Speichern
        </Button>
      </DialogContent>
    </Dialog>
  )
}
