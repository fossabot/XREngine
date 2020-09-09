import { BoxBufferGeometry, Mesh } from "three";
import { Prefab } from "@xr3ngine/engine/src/common/interfaces/Prefab";
import { addObject3DComponent } from "@xr3ngine/engine/src/common/behaviors/Object3DBehaviors";
import { addMeshCollider } from "@xr3ngine/engine/src/physics/behaviors/addMeshCollider";
import { TransformComponent } from "@xr3ngine/engine/src/transform/components/TransformComponent";

const scale = [100, 0.1, 100]


const floor = new BoxBufferGeometry(scale[0], scale[1], scale[2]);

export const staticWorldColliders: Prefab = {
    components: [
      { type: TransformComponent, data: { position: [ 0, 0, 0 ]  } }
    ],
    onCreate: [
        // add a 3d object
        // {
        //     behavior: addObject3DComponent,
        //     args: {
        //         obj3d: Mesh,
        //         obj3dArgs: floor
        //     }
        // },
        {
            behavior: addMeshCollider,
            args: {
               type: 'box', scale: [scale[0], scale[1], scale[2]], mass: 0
            }
        }
    ]
};
