import { BoxBufferGeometry, Mesh } from "three";
import { myCustomBehavior } from "./mycustomBehavior";
import { Prefab } from "@xr3ngine/engine/src/common/interfaces/Prefab";
import { addObject3DComponent } from "@xr3ngine/engine/src/common/defaults/behaviors/Object3DBehaviors";

import { TransformComponent } from "@xr3ngine/engine/src/transform/components/TransformComponent";
import { VehicleBody } from "@xr3ngine/engine/src/physics/components/VehicleBody";
import { ColliderComponent } from "@xr3ngine/engine/src/physics/components/ColliderComponent";
import { RigidBody } from "@xr3ngine/engine/src/physics/components/RigidBody";

const myCoolCar = new BoxBufferGeometry(2,1,4);

export const car: Prefab = {
    components: [
      { type: TransformComponent },
      {
        type: ColliderComponent,
        data: { type: 'box', size: {x:1,y:1,z:1} }
      },
      {
        type: RigidBody,
        data: { mass: 10 }
      }
    ],
    onCreate: [
        // add a 3d object
        {
            behavior: addObject3DComponent,
            args: {
                obj3d: Mesh,
                obj3dArgs: myCoolCar
            }
        },
        {
            behavior: myCustomBehavior
        }
    ]
};
