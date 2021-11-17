import { EngineEvents } from '../../ecs/classes/EngineEvents'
import {
  addComponent,
  defineQuery,
  getComponent,
  hasComponent,
  removeComponent
} from '../../ecs/functions/ComponentFunctions'
import { Object3DComponent } from '../../scene/components/Object3DComponent'
import { BoundingBoxComponent } from '../components/BoundingBoxComponent'
import { InteractableComponent } from '../components/InteractableComponent'
import { InteractiveFocusedComponent } from '../components/InteractiveFocusedComponent'
import { InteractorComponent } from '../components/InteractorComponent'
import { SubFocusedComponent } from '../components/SubFocusedComponent'
import { HighlightComponent } from '../../renderer/components/HighlightComponent'
import { XRUIComponent } from '@xrengine/engine/src/xrui/components/XRUIComponent'
import { LocalInputTagComponent } from '../../input/components/LocalInputTagComponent'
import { AvatarComponent } from '../../avatar/components/AvatarComponent'

import { interactBoxRaycast } from '../functions/interactBoxRaycast'
import { InteractedComponent } from '../components/InteractedComponent'
import AudioSource from '../../scene/classes/AudioSource'
import { createBoxComponent } from '../functions/createBoxComponent'
import { AudioTagComponent } from '../../audio/components/AudioTagComponent'
import { System } from '../../ecs/classes/System'
import { World } from '../../ecs/classes/World'
import {
  createInteractUI,
  showInteractUI,
  hideInteractUI,
  getInteractUI,
  updateInteractUI,
  setUserDataInteractUI
} from '../functions/interactUI'

export default async function InteractiveSystem(world: World): Promise<System> {
  const interactorsQuery = defineQuery([InteractorComponent])
  const interactiveQuery = defineQuery([InteractableComponent])
  const boundingBoxQuery = defineQuery([BoundingBoxComponent])
  const focusQuery = defineQuery([InteractableComponent, InteractiveFocusedComponent])
  const subfocusQuery = defineQuery([InteractableComponent, SubFocusedComponent])
  const interactedQuery = defineQuery([InteractedComponent])
  const xrComponentQuery = defineQuery([XRUIComponent, Object3DComponent])
  const localUserQuery = defineQuery([LocalInputTagComponent, AvatarComponent])

  return () => {
    for (const entity of interactiveQuery.enter(world)) {
      if (!hasComponent(entity, BoundingBoxComponent) && hasComponent(entity, Object3DComponent)) {
        createBoxComponent(entity)
      }
      if (!getInteractUI(entity)) {
        createInteractUI(entity)
      }
    }

    const interactives = interactiveQuery(world)

    for (const entity of interactorsQuery(world)) {
      if (interactives.length) {
        interactBoxRaycast(entity, boundingBoxQuery(world))
        const interacts = getComponent(entity, InteractorComponent)
        if (interacts.focusedInteractive) {
          if (!hasComponent(interacts.focusedInteractive, InteractiveFocusedComponent)) {
            addComponent(interacts.focusedInteractive, InteractiveFocusedComponent, { interacts: entity })
          }
        }

        // unmark all unfocused
        for (const entityInter of interactives) {
          if (entityInter !== interacts.focusedInteractive && hasComponent(entityInter, InteractiveFocusedComponent)) {
            removeComponent(entityInter, InteractiveFocusedComponent)
          }
          if (interacts.subFocusedArray.some((v) => v[0].entity === entityInter)) {
            if (!hasComponent(entityInter, SubFocusedComponent)) {
              addComponent(entityInter, SubFocusedComponent, { subInteracts: entityInter })
            }
          } else {
            removeComponent(entityInter, SubFocusedComponent)
          }
        }
      }
    }

    // removal is the first because the hint must first be deleted, and then a new one appears
    for (const entity of focusQuery.exit()) {
      hideInteractUI(entity)
    }

    for (const entity of focusQuery.enter()) {
      showInteractUI(entity)
    }

    for (const entity of subfocusQuery.enter()) {
      addComponent(entity, HighlightComponent, { color: 0xff0000, hiddenColor: 0x0000ff, edgeStrength: 1 })
    }
    for (const entity of subfocusQuery.exit()) {
      removeComponent(entity, HighlightComponent)
    }

    for (const entity of xrComponentQuery.enter()) {
      setUserDataInteractUI(entity)
    }

    for (const xrEntity of xrComponentQuery()) {
      for (const entity of localUserQuery()) {
        updateInteractUI(entity, xrEntity)
      }
    }

    for (const entity of interactedQuery.enter()) {
      const interactiveComponent = getComponent(entity, InteractableComponent)
      if (hasComponent(entity, AudioTagComponent)) {
        const mediaObject = getComponent(entity, Object3DComponent).value as AudioSource
        mediaObject?.toggle()
      } else {
        EngineEvents.instance.dispatchEvent({
          type: EngineEvents.EVENTS.OBJECT_ACTIVATION,
          ...interactiveComponent.data
        })
      }
      removeComponent(entity, InteractedComponent)
    }
  }
}
