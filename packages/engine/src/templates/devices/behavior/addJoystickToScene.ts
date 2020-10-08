import { Engine } from "@xr3ngine/engine/src/ecs/classes/Engine";
import { TransformComponent } from "@xr3ngine/engine/src/transform/components/TransformComponent";
import { CylinderGeometry, LOD, Matrix4, Mesh, Vector3 } from "three";
import { Behavior } from '@xr3ngine/engine/src/common/interfaces/Behavior';
import { Entity } from '@xr3ngine/engine/src/ecs/classes/Entity';
import { addColliderWithoutEntity } from '@xr3ngine/engine/src/physics/behaviors/addColliderWithoutEntity';

export const addJoystickToScene: Behavior = (entity: Entity, args: any ) => {

  const asset = args.asset;
  const lodJoystick = new LOD();
//   const deleteArr = [];

   asset.scene.traverse( mesh => {
     console.log(mesh);

     for (let i = 0; i < mesh.length; i++) {
        Engine.scene.add(mesh)
             
           }
    
   });

   
  return entity;
};
