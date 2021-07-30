import { getAllMutableComponentOfType } from '../../../engine/src/ecs/functions/EntityFunctions'
import { setRemoteLocationDetail } from '../../../engine/src/scene/behaviors/createPortal'
import { PortalComponent } from '../../../engine/src/scene/components/PortalComponent'

export const getPortalDetails = async (configs) => {
  const token = localStorage.getItem((configs as any).FEATHERS_STORE_KEY)
  const SERVER_URL = (configs as any).SERVER_URL

  const options = {
    headers: {
      authorization: `Bearer ${token}`
    }
  }

  const portals = getAllMutableComponentOfType(PortalComponent)

  await Promise.all(
    portals.map(async (portal: PortalComponent): Promise<void> => {
      return fetch(`${SERVER_URL}/portal/${portal.linkedPortalId}`, options)
        .then((res) => {
          try {
            return res.json()
          } catch (e) {}
        })
        .then((res) => {
          if (res) setRemoteLocationDetail(portal, res.data.spawnPosition, res.data.spawnRotation)
        })
    })
  )
}
