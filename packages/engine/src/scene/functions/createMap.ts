import { createMapObjects, getStartCoords } from '../../map'
import { MapProps } from '../../map/MapProps'
import { addComponent } from '../../ecs/functions/EntityFunctions'
import { NavMeshComponent } from '../../navigation/component/NavMeshComponent'
import { DebugNavMeshComponent } from '../../debug/DebugNavMeshComponent'
import { Object3DComponent } from '../components/Object3DComponent'
import { Entity } from '../../ecs/classes/Entity'
import { GeoLabelSetComponent } from '../../map/GeoLabelSetComponent'
import { MapComponent } from '../../map/MapComponent'

export async function createMap(entity: Entity, args: MapProps): Promise<void> {
  // TODO: handle "navigator.geolocation.getCurrentPosition" rejection?
  const center = await getStartCoords(args)

  const minimumSceneRadius = 1000

  addComponent(entity, MapComponent, {
    center,
    triggerRefreshRadius: 300,
    refreshInProgress: false,
    minimumSceneRadius,
    args
  })

  const { mapMesh, navMesh, groundMesh, labels } = await createMapObjects(center, minimumSceneRadius, args)

  addComponent(entity, Object3DComponent, {
    value: mapMesh
  })
  addComponent(entity, NavMeshComponent, {
    yukaNavMesh: navMesh,
    navTarget: groundMesh
  })
  addComponent(entity, GeoLabelSetComponent, { value: new Set(labels) })
  if (args.enableDebug) {
    addComponent(entity, DebugNavMeshComponent, null)
  }
}
