import { Behavior } from "../../common/interfaces/Behavior";
import { EngineEvents } from "../../ecs/classes/EngineEvents";
import { addComponent, getComponent, hasComponent } from "../../ecs/functions/EntityFunctions";
import { Interactable } from "../../interaction/components/Interactable";
import { InteractiveSystem } from "../../interaction/systems/InteractiveSystem";
import { Object3DComponent } from "../components/Object3DComponent";
import { EquippedComponent } from "../../interaction/components/EquippedComponent";
import { equipEntity } from "../../interaction/functions/equippableFunctions";

const onInteraction: Behavior = (entityInitiator, args, delta, entityInteractive, time) => {
  const interactiveComponent = getComponent(entityInteractive, Interactable);

  if(interactiveComponent.data.interactionType === 'equippable') {
    if(!hasComponent(entityInitiator, EquippedComponent)) {
      equipEntity(entityInitiator, entityInteractive)
    }
  } else {
    EngineEvents.instance.dispatchEvent({type: InteractiveSystem.EVENTS.OBJECT_ACTIVATION, ...interactiveComponent.data });
  }
};

const onInteractionHover: Behavior = (entityInitiator, { focused }: { focused: boolean }, delta, entityInteractive, time) => {
  const interactiveComponent = getComponent(entityInteractive, Interactable);

  const engineEvent: any = { type: InteractiveSystem.EVENTS.OBJECT_HOVER, focused, ...interactiveComponent.data };
  EngineEvents.instance.dispatchEvent(engineEvent);

  if (!hasComponent(entityInteractive, Object3DComponent)) {
    return;
  }

  // TODO: add object to OutlineEffect.selection? or add OutlineEffect

  // const object3d = getMutableComponent(entityInteractive, Object3DComponent).value as Mesh;
};

export const createCommonInteractive: Behavior = (entity, args: any) => {
  if (!args.objArgs.interactable) {
    return;
  }

  const interactiveData = {
    onInteraction: onInteraction,
    onInteractionFocused: onInteractionHover,
    onInteractionCheck: () => { return true },
    data: args.objArgs
  };

  addComponent(entity, Interactable, interactiveData);
};