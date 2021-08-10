import { Vector3 } from 'three'
import { getCoord, getTile, updateMap } from '.'
import { AvatarComponent } from '../avatar/components/AvatarComponent'
import { PI } from '../common/constants/MathConstants'
import { Engine } from '../ecs/classes/Engine'
import { System } from '../ecs/classes/System'
import { getComponent } from '../ecs/functions/EntityFunctions'
import { Object3DComponent } from '../scene/components/Object3DComponent'
import { getCenterTile } from './MapBoxClient'

export class MapUpdateSystem extends System {
  execute(delta: number, time: number): void {
    for (const entity of this.queryResults.move.changed) {
      const position = getComponent(entity, Object3DComponent).value.position
      const centrCoord = getCoord()

      //Calculate new move coords
      const startLong = centrCoord[0]
      const startLat = centrCoord[1]
      const longtitude = -position.x / 111134.861111 + startLong
      const latitude = position.z / (Math.cos((startLat * PI) / 180) * 111134.861111) + startLat

      //get Current Tile
      const startTile = getTile()
      const moveTile = getCenterTile([longtitude, latitude])

      if (startTile[0] == moveTile[0] && startTile[1] == moveTile[1]) {
        console.log('in center')
      } else {
        alert('Need to update')
        //UPdate Map
        updateMap(
          Engine.renderer,
          {
            isGlobal: true,
            scale: new Vector3(1, 1, 1)
          },
          longtitude,
          latitude,
          position
        )

        const remObj = Engine.scene.getObjectByName('MapObject')
        console.log(remObj)
        remObj.removeFromParent()
      }
    }
  }

  static queries: any = {
    move: {
      components: [Object3DComponent, AvatarComponent],
      listen: {
        added: true,
        changed: true
      }
    }
  }
}
