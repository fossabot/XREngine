import type { Material, Mesh } from "three";
import { Engine } from "../../ecs/classes/Engine";
import { System, SystemAttributes } from "../../ecs/classes/System";
import { getComponent } from "../../ecs/functions/EntityFunctions";
import { SystemUpdateType } from "../../ecs/functions/SystemUpdateType";
import { beforeMaterialCompile } from "../../editor/nodes/helper/BPCEMShader";
import { WebGLRendererSystem } from "../../renderer/WebGLRendererSystem";
import { Object3DComponent } from "../components/Object3DComponent";

export class SceneObjectSystem extends System {

  updateType = SystemUpdateType.Fixed;
  static instance: SceneObjectSystem;
  bpcemOptions: {};

  constructor(attributes: SystemAttributes = {}) {
    super(attributes);
    this.bpcemOptions = {
      "probeScale": { x: 1, y: 1, z: 1 },
      "probePositionOffset": { x: 0, y: 0, z: 0 },
    };
    SceneObjectSystem.instance = this;
  }

  /** Executes the system. */
  execute(deltaTime, time): void {

    for (const entity of this.queryResults.sceneObject.added) {
      const object3DComponent = getComponent(entity, Object3DComponent);

      // Add to scene
      if(!Engine.scene.children.includes(object3DComponent.value)) {
        Engine.scene.add(object3DComponent.value);
      } else {
        console.warn('[Object3DComponent]: Scene object has been added manually.')
      }

      // Apply material stuff
      object3DComponent.value.traverse((obj: Mesh) => {
        const material = obj.material as Material;
        if (typeof material !== 'undefined') {

          // BPCEM
          material.onBeforeCompile = beforeMaterialCompile((this.bpcemOptions as any).probeScale, (this.bpcemOptions as any).probePositionOffset);

          // CSM
          if (obj.receiveShadow) {
            WebGLRendererSystem.instance.csm.setupMaterial(material);
          }
        }
      });
    }

    for (const entity of this.queryResults.sceneObject.removed) {
      const object3DComponent = getComponent<Object3DComponent>(entity, Object3DComponent, true);

      // Remove from scene
      if(Engine.scene.children.includes(object3DComponent.value)) {
        Engine.scene.remove(object3DComponent.value);
      } else {
        console.warn('[Object3DComponent]: Scene object has been removed manually.')
      }
    }
  }
}

SceneObjectSystem.queries = {
  sceneObject: {
    components: [Object3DComponent],
    listen: {
      removed: true,
      added: true
    }
  }
};
