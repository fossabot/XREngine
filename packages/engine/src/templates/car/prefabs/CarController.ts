import { BoxBufferGeometry, Mesh } from "three";

import { Prefab } from "@xr3ngine/engine/src/common/interfaces/Prefab";

import { TransformComponent } from "@xr3ngine/engine/src/transform/components/TransformComponent";
import { Input } from "@xr3ngine/engine/src/input/components/Input";
import { State } from "@xr3ngine/engine/src/state/components/State";
import { AssetLoader } from "../../../assets/components/AssetLoader";
import { attachCamera } from "@xr3ngine/engine/src/camera/behaviors/attachCamera";
import { addCarPhysics } from "@xr3ngine/engine/src/physics/behaviors/addCarPhysics";
import { CharacterStateSchema } from "@xr3ngine/engine/src/templates/character/CharacterStateSchema";
import { addObject3DComponent } from "@xr3ngine/engine/src/common/behaviors/Object3DBehaviors";
import { addComponentFromSchema } from "../../../common/behaviors/addComponentFromSchema";
 import { VehicleInputSchema } from "@xr3ngine/engine/src/templates/car/VehicleInputSchema"
import { Interactive } from "../../../interaction/components/Interactive";
import { getInCar } from "../behaviors/getInCarBehavior";
import { getInCarPossible } from "../behaviors/getInCarPossible";

const myCoolCar = new BoxBufferGeometry(2,1,6);

export const CarController: Prefab = {
    components: [
      { type: TransformComponent, data: { position: [-3,6,3]} },
      // Local player input mapped to behaviors in the input map
      // { type: Input, data: { schema: VehicleInputSchema } },
      // Current state (isJumping, isidle, etc)
    //   { type: State, data: { schema: VehicleStateSchema } },
      // Similar to Unity's Update(), LateUpdate(), and Start()
  //    { type: Subscription, data: { schema: DefaultSubscriptionSchema } }
        { type: Interactive, data: { onInteraction: getInCar, onInteractionCheck: getInCarPossible } }
    ],
    onCreate: [
        // add a 3d object
        {
            behavior: addComponentFromSchema,
            args: {
                // addObject3DComponent is going to call new obj(objArgs)
                // so this will be new Mesh(new BoxBufferGeometry(0.2, 0.2, 0.2))
                component: AssetLoader,
                componentArgs: {
                    url: "models/newTestCar.fbx", //  "models/car.glb"
                    receiveShadow: true,
                    castShadow: true,
                    onLoaded: addCarPhysics
                }
            }
        },
        // {
        //     behavior: addCarPhysics
        // },
/*
        {
            behavior: attachCamera
        }
*/
    ]
};
