import { PhysicsSystem } from '../systems/PhysicsSystem';
import { CollisionGroups, DefaultCollisionMask } from "../enums/CollisionGroups";
import { createShapeFromConfig, Shape, SHAPES, Body, BodyType, getGeometry, arrayOfPointsToArrayOfVector3 } from "three-physx";
import { Entity } from '../../ecs/classes/Entity';
import { ColliderComponent } from '../components/ColliderComponent';
import { getComponent, getMutableComponent } from '../../ecs/functions/EntityFunctions';
import { Vector3, Quaternion, CylinderBufferGeometry, Mesh } from 'three';
import { ConvexGeometry } from '../../assets/threejs-various/ConvexGeometry';
import { TransformComponent } from '../../transform/components/TransformComponent';
import { ColliderTypes } from '../types/PhysicsTypes';

/**
 * @author HydraFire <github.com/HydraFire>
 * @author Josh Field <github.com/hexafield>
 */
 // it's for static (or dynamic with second component 'RigidBody') but changeable objects like (doors, flying up down planform);
export function addColliderWithEntity(entity: Entity) {

  const colliderComponent = getMutableComponent<ColliderComponent>(entity, ColliderComponent);
  const transformComponent = getComponent<TransformComponent>(entity, TransformComponent);

  const { mesh, vertices, indices, collisionLayer, collisionMask } = colliderComponent;

  const body = addColliderWithoutEntity(
    { bodytype: colliderComponent.bodytype, type: colliderComponent.type },
    colliderComponent.position,
    colliderComponent.quaternion,
    colliderComponent.scale,
    { mesh, vertices, indices, collisionLayer, collisionMask }
  );
  colliderComponent.body = body;
}
// its for static world colliders (wall, floar)
const quat1 = new Quaternion();
const quat2 = new Quaternion();
const xVec = new Vector3(1, 0, 0);
const halfPI = Math.PI / 2;

type ColliderData = {
  type: ColliderTypes;
  bodytype?: BodyType;
  isTrigger?: boolean;
  restitution?: number;
  action?: 'portal';
  link?: 'link'
}

type ModelData = {
  mesh?: Mesh;
  vertices?: number[];
  indices?: number[];
  collisionLayer?: number | string;
  collisionMask?: number | string;
}

export function addColliderWithoutEntity(userData: ColliderData, pos = new Vector3(), rot = new Quaternion(), scale = new Vector3(),
 model: ModelData = { }): Body {
  //console.log(userData, pos, rot, scale, model)
  if(model.mesh && !model.vertices) {
    const mergedGeom = getGeometry(model.mesh);
    model.vertices = Array.from(mergedGeom.attributes.position.array);
    model.indices = mergedGeom.index ? Array.from(mergedGeom.index.array) : Object.keys(model.vertices).map(Number);
  }
  const shapeArgs: any = {};
  switch (userData.type) {
    case 'box':
      shapeArgs.shape = SHAPES.Box;
      shapeArgs.options = { boxExtents: { x: Math.abs(scale.x), y: Math.abs(scale.y), z: Math.abs(scale.z) } };
      break;

    case 'ground':
      shapeArgs.shape = SHAPES.Plane;
      quat1.setFromAxisAngle(xVec, -halfPI);
      quat2.set(rot.x, rot.y, rot.z, rot.w);
      quat2.multiply(quat1);
      rot.x = quat2.x;
      rot.y = quat2.y;
      rot.z = quat2.z;
      rot.w = quat2.w;
      break;

    case 'sphere':
      shapeArgs.shape = SHAPES.Sphere;
      shapeArgs.options = { radius: Math.abs(scale.x) };
      break;

    case 'capsule':
      shapeArgs.shape = SHAPES.Capsule;
      shapeArgs.options = { halfHeight: Math.abs(scale.y), radius: Math.abs(scale.x) };
      break;

    // physx doesnt have cylinder shapes, default to convex
    case 'cylinder':
      if(!model.mesh && !model.vertices) {
        const geom = new CylinderBufferGeometry(scale.x, scale.x, scale.y); // width & height\
        const convexGeom = new ConvexGeometry(arrayOfPointsToArrayOfVector3(geom.attributes.position.array))
        model.vertices = Array.from(convexGeom.attributes.position.array);
        model.indices = geom.index ? Array.from(geom.index.array) : Object.keys(model.vertices).map(Number);
      }
    // yes, don't break here - use convex for cylinder
    case 'convex':
      shapeArgs.shape = SHAPES.ConvexMesh;
      shapeArgs.options = { vertices: model.vertices, indices: model.indices };
      break;

    case 'trimesh':
    default:
      shapeArgs.shape = SHAPES.TriangleMesh;
      shapeArgs.options = { vertices: model.vertices, indices: model.indices };
      break;
  }

  const shape = createShapeFromConfig(shapeArgs);
  shape.config.material = { restitution: userData.restitution ?? 0 };
 
 shape.config.collisionLayer = Number(model.collisionLayer ?? CollisionGroups.Default);
 switch(model.collisionMask) {
   case undefined: case -1: case '-1': case '': shape.config.collisionMask = DefaultCollisionMask; break;
   default: if(/all/i.test(model.collisionMask as string))
       shape.config.collisionMask = DefaultCollisionMask;
     else
       shape.config.collisionMask = Number(model.collisionMask);
     break;
 }

  if(userData.type === 'ground') {
    shape.config.collisionLayer = CollisionGroups.Ground;
  }

  if(userData.action === 'portal') {
    shape.config.collisionLayer |= CollisionGroups.TriggerCollider;
    // TODO: This was commented out in dev, do we want this?
    shape.userData = { action: 'portal', link: userData.link };

  }

  if(userData.isTrigger) {
    shape.config.isTrigger = Boolean(userData.isTrigger);
  }

  const body = new Body({
    shapes: [shape],
    type: userData.bodytype ?? BodyType.STATIC,
    transform: {
      translation: { x: pos.x, y: pos.y, z: pos.z },
      rotation: { x: rot.x, y: rot.y, z: rot.z, w: rot.w },
      scale: { x: scale.x, y: scale.y, z: scale.z },
      linearVelocity: { x: 0, y: 0, z: 0 },
      angularVelocity: { x: 0, y: 0, z: 0 },
    },
  });

  PhysicsSystem.instance.addBody(body);

  return body;
}
