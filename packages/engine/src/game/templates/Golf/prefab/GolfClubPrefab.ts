
import { Entity } from '../../../../ecs/classes/Entity';
import { NetworkPrefab } from '../../../../networking/interfaces/NetworkPrefab';
import { TransformComponent } from '../../../../transform/components/TransformComponent';
import { ColliderComponent } from '../../../../physics/components/ColliderComponent';
import { RigidBodyComponent } from '../../../../physics/components/RigidBody';
import { initializeNetworkObject } from '../../../../networking/functions/initializeNetworkObject';
import { GolfCollisionGroups, GolfPrefabTypes } from '../GolfGameConstants';
import { UserControlledColliderComponent } from '../../../../physics/components/UserControllerObjectComponent';
import { BoxBufferGeometry, DoubleSide, Group, Material, Mesh, MeshStandardMaterial, Quaternion, Vector3 } from 'three';
import { Engine } from '../../../../ecs/classes/Engine';
import { Body, BodyType, ColliderHitEvent, CollisionEvents, createShapeFromConfig, RaycastQuery, SceneQueryType, SHAPES, Transform } from 'three-physx';
import { CollisionGroups } from '../../../../physics/enums/CollisionGroups';
import { PhysicsSystem } from '../../../../physics/systems/PhysicsSystem';
import { Object3DComponent } from '../../../../scene/components/Object3DComponent';
import { GameObject } from '../../../components/GameObject';
import { Behavior } from '../../../../common/interfaces/Behavior';
import { hasComponent, addComponent, getComponent, getMutableComponent } from '../../../../ecs/functions/EntityFunctions';
import { MathUtils } from 'three';
import { Network } from '../../../../networking/classes/Network';
import { isClient } from '../../../../common/functions/isClient';
import { getGame } from '../../../functions/functions';
import { NetworkObject } from '../../../../networking/components/NetworkObject';
import { GolfClubComponent } from '../components/GolfClubComponent';
import { getHandTransform } from '../../../../xr/functions/WebXRFunctions';
import { CharacterComponent } from '../../../../character/components/CharacterComponent';
import { setupSceneObjects } from '../../../../scene/functions/setupSceneObjects';
import { DebugArrowComponent } from '../../../../debug/DebugArrowComponent';

const vector0 = new Vector3();
const vector1 = new Vector3();
const vec3 = new Vector3();
const quat = new Quaternion();
const quat2 = new Quaternion();
const quat3 = new Quaternion();

/**
 * @author Josh Field <github.com/HexaField>
 */

export const spawnClub: Behavior = (entityPlayer: Entity, args?: any, delta?: number, entityTarget?: Entity, time?: number, checks?: any): void => {

  // server sends clients the entity data
  if (isClient) return;

  const game = getGame(entityPlayer);
  const ownerId = getComponent(entityPlayer, NetworkObject).ownerId;

  console.log('spawning club for player', ownerId)

  const networkId = Network.getNetworkId();
  const uuid = MathUtils.generateUUID();

  const parameters = {
    gameName: game.name,
    role: 'GolfClub',
    uuid
  };

  // this spawns the club on the server
  createGolfClubPrefab({
    networkId,
    uniqueId: uuid,
    ownerId, // the uuid of the player whose balclubl this is
    parameters
  })

  // this sends the club to the clients
  Network.instance.worldState.createObjects.push({
    networkId,
    ownerId,
    uniqueId: uuid,
    prefabType: GolfPrefabTypes.Club,
    parameters: JSON.stringify(parameters).replace(/"/g, '\''),
  })
};

export const enableClub = (entityClub: Entity, enable: boolean): void => {
  const golfClubComponent = getMutableComponent(entityClub, GolfClubComponent);
  golfClubComponent.canHitBall = enable;
  golfClubComponent.meshGroup.traverse((obj: Mesh) => {
    if(obj.material) {
      (obj.material as Material).opacity = enable ? 1 : 0.3;
    }
  })
}

/**
* @author Josh Field <github.com/HexaField>
 */

export const updateClub: Behavior = (entityClub: Entity, args?: any, delta?: number, entityTarget?: Entity, time?: number, checks?: any): void => {
  if(!isClient) return;
  if(!hasComponent(entityClub, UserControlledColliderComponent)) return;
  // only need to update club if it's our own
  // TODO: remove this when we have IK rig in and can get the right hand pos data
  // if(getComponent(entityClub, UserControlledColliderComponent).ownerNetworkId !== Network.instance.localAvatarNetworkId) return;

  const golfClubComponent = getMutableComponent(entityClub, GolfClubComponent);
  const transformClub = getMutableComponent(entityClub, TransformComponent);
  const collider = getMutableComponent(entityClub, ColliderComponent);

  const ownerEntity = Network.instance.networkObjects[getComponent(entityClub, UserControlledColliderComponent).ownerNetworkId].component.entity;

  const handTransform = getHandTransform(ownerEntity);
  const { position, rotation } = handTransform;

  transformClub.position.copy(position);
  transformClub.rotation.copy(rotation);

  golfClubComponent.raycast.origin.copy(position);
  golfClubComponent.raycast.direction.set(0, 0, -1).applyQuaternion(rotation);

  // find the rotation along the XZ plane the hand is pointing
  quat2.setFromUnitVectors(
    vector0.set(0, 0, -1),
    vector1.set(0, 0, -1).applyQuaternion(rotation).setY(0).normalize()
  );

  const hit = golfClubComponent.raycast.hits[0];
  const canHitBall = typeof hit !== 'undefined';
  if(!golfClubComponent.hasHitBall && canHitBall !== golfClubComponent.canHitBall) {
    enableClub(entityClub, canHitBall);
  }
  const headDistance = (hit ? hit.distance : clubLength);

  // update position of club
  golfClubComponent.headGroup.position.setZ(-headDistance)
  golfClubComponent.neckObject.position.setZ(-headDistance * 0.5);
  golfClubComponent.neckObject.scale.setZ(headDistance * 0.5);

  golfClubComponent.meshGroup.getWorldQuaternion(quat);
  // get rotation of club relative to parent
  golfClubComponent.headGroup.quaternion.copy(quat).invert().multiply(quat2);
  golfClubComponent.headGroup.updateMatrixWorld(true);

  // make rotation flush to ground
  // TODO: use ground normal instead of world up vector
  golfClubComponent.headGroup.getWorldDirection(vector1).setY(0);
  // get local forward direction, then apply that in world space
  quat2.setFromUnitVectors(vector0.set(0, 0, 1), vector1);
  golfClubComponent.meshGroup.getWorldQuaternion(quat);
  golfClubComponent.headGroup.quaternion.copy(quat).invert().multiply(quat2);
  golfClubComponent.headGroup.updateMatrixWorld(true);

  // calculate velocity of the head of the golf club
  // average over multiple frames
  golfClubComponent.headGroup.getWorldPosition(vector1)
  vector0.subVectors(vector1, golfClubComponent.lastPositions[0])
  for(let i = 0; i < golfClubComponent.velocityPositionsToCalculate - 1; i++) {
    vector0.add(vector1.subVectors(golfClubComponent.lastPositions[i], golfClubComponent.lastPositions[i + 1]))
  }
  vector0.multiplyScalar(1 / (golfClubComponent.velocityPositionsToCalculate + 1));
  golfClubComponent.velocity.copy(vector0);
  golfClubComponent.body.transform.linearVelocity.copy(vector0);
  // now shift all previous positions down the list
  for(let i = golfClubComponent.velocityPositionsToCalculate - 1; i > 0; i--) {
    golfClubComponent.lastPositions[i].copy(golfClubComponent.lastPositions[i - 1]);
  }
  // add latest position to list
  golfClubComponent.headGroup.getWorldPosition(vector1)
  golfClubComponent.lastPositions[0].copy(vector1);

  // calculate relative rotation of club head
  quat.set(collider.body.transform.rotation.x, collider.body.transform.rotation.y, collider.body.transform.rotation.z, collider.body.transform.rotation.w)
  quat.invert().multiply(quat2)

  collider.body.shapes[0].transform = {
    translation: {
      x: golfClubComponent.headGroup.position.x,
      y: golfClubComponent.headGroup.position.y,
      z: golfClubComponent.headGroup.position.z
    },
    rotation: quat
  }
}

// https://github.com/PersoSirEduard/OculusQuest-Godot-MiniGolfGame/blob/master/Scripts/GolfClub/GolfClub.gd#L18

export const onClubColliderWithBall = (entity: Entity, delta: number, args: { hitEvent: ColliderHitEvent }, entityOther: Entity) => {
  if(!isClient) return;
  const golfClubComponent = getMutableComponent(entity, GolfClubComponent);
  if(!golfClubComponent.canHitBall) return;

  // force is in kg, we need it in grams, so x1000
  const velocityMultiplier = clubPowerMultiplier * 1000;

  // TODO: fix this - use normal and velocity magnitude to determine hits
  /*
  // get velocity in local space
  golfClubComponent.headGroup.getWorldQuaternion(quat).invert()
  vector0.copy(golfClubComponent.velocity).setY(0).applyQuaternion(quat);
  const clubMoveDirection = Math.sign(vector0.x);
  // club normal following whichever direction it's moving
  golfClubComponent.headGroup.getWorldDirection(vec3).setY(0).applyAxisAngle(upVector, clubMoveDirection * HALF_PI);
  // get the angle of incidence which is the angle from the normal to the angle of the velocity
  const angleOfIncidence = vector1.copy(vec3).applyQuaternion(quat).angleTo(vector0) * -Math.sign(vector0.z);
  // take the angle of incidence, and get the same angle on the other side of the normal, the angle of reflection
  vec3.applyAxisAngle(upVector, clubMoveDirection * angleOfIncidence).normalize().multiplyScalar(golfClubComponent.velocity.length());
*/

  vector0.copy(golfClubComponent.velocity).multiplyScalar(hitAdvanceFactor).multiplyScalar(0.3);
  // vector0.copy(vec3).multiplyScalar(hitAdvanceFactor);
  // lock to XZ plane if we disable chip shots
  if(!golfClubComponent.canDoChipShots) {
    vector0.y = 0;
  }
  // teleport ball in front of club a little bit
  args.hitEvent.bodyOther.updateTransform({
    translation: {
      x: args.hitEvent.bodyOther.transform.translation.x + vector0.x,
      y: args.hitEvent.bodyOther.transform.translation.y + vector0.y,
      z: args.hitEvent.bodyOther.transform.translation.z + vector0.z,
    }
  });
  vector1.copy(golfClubComponent.velocity).multiplyScalar(velocityMultiplier).multiplyScalar(0.3);
  // vector1.copy(vec3).multiplyScalar(velocityMultiplier);
  if(!golfClubComponent.canDoChipShots) {
    vector1.y = 0;
  }
  args.hitEvent.bodyOther.addForce(vector1);
  golfClubComponent.hasHitBall = true;
  enableClub(entity, false);
  setInterval(() => {
    golfClubComponent.hasHitBall = false;
  }, 500)
  return;
}

/**
* @author Josh Field <github.com/HexaField>
 */

const clubColliderSize = new Vector3(0.05, 0.2, 0.2);
const clubHalfWidth = 0.05;
const clubPutterLength = 0.1;
const clubLength = 2.5;

const clubPowerMultiplier = 10;
const hitAdvanceFactor = 1.2;

const upVector = new Vector3(0, 1, 0);
const HALF_PI = Math.PI / 2;

export const initializeGolfClub = (entity: Entity) => {

  const transform = getComponent(entity, TransformComponent);

  const networkObject = getComponent(entity, NetworkObject);
  const ownerNetworkObject = Object.values(Network.instance.networkObjects).find((obj) => {
      return obj.ownerId === networkObject.ownerId;
  }).component;
  addComponent(entity, UserControlledColliderComponent, { ownerNetworkId: ownerNetworkObject.networkId });

  const golfClubComponent = getMutableComponent(entity, GolfClubComponent);

  // only raycast if it's our own club
  // TODO: remove this when we have IK rig in and can get the right hand pos data
  // if(ownerNetworkObject.networkId === Network.instance.localAvatarNetworkId) {
    golfClubComponent.raycast = PhysicsSystem.instance.addRaycastQuery(new RaycastQuery({
      type: SceneQueryType.Closest,
      origin: new Vector3(),
      direction: new Vector3(0, -1, 0),
      maxDistance: clubLength,
      collisionMask: CollisionGroups.Default | CollisionGroups.Ground,
    }));
  // }

  if(isClient) {
    const handleObject = new Mesh(new BoxBufferGeometry(clubHalfWidth, clubHalfWidth, 0.25), new MeshStandardMaterial({ color: 0xff2126, transparent: true }));
    golfClubComponent.handleObject = handleObject;

    const headGroup = new Group();
    const headObject = new Mesh(new BoxBufferGeometry(clubHalfWidth, clubHalfWidth, clubPutterLength * 2), new MeshStandardMaterial({ color: 0x2126ff , transparent: true }));
    // raise the club by half it's height and move it out by half it's length so it's flush to ground and attached at end
    headObject.position.set(0, clubHalfWidth, - (clubPutterLength * 0.5));
    headGroup.add(headObject);
    golfClubComponent.headGroup = headGroup;

    const neckObject = new Mesh(new BoxBufferGeometry(clubHalfWidth * 0.5, clubHalfWidth * 0.5, -1.75), new MeshStandardMaterial({ color: 0x21ff26, transparent: true, side: DoubleSide }));
    golfClubComponent.neckObject = neckObject;

    const meshGroup = new Group();
    meshGroup.add(handleObject, headGroup, neckObject);
    golfClubComponent.meshGroup = meshGroup;

    setupSceneObjects(meshGroup);

    addComponent(entity, Object3DComponent, { value: meshGroup });
    Engine.scene.add(meshGroup);
  }

  const shapeHead = createShapeFromConfig({
    shape: SHAPES.Box,
    options: { boxExtents: clubColliderSize },
    config: {
      isTrigger: true,
      collisionLayer: GolfCollisionGroups.Club,
      collisionMask: GolfCollisionGroups.Ball
    }
  });

  const body = PhysicsSystem.instance.addBody(new Body({
    shapes: [shapeHead],
    type: BodyType.KINEMATIC,
    transform: {
      translation: { x: transform.position.x, y: transform.position.y, z: transform.position.z }
    }
  }));

  const collider = getMutableComponent(entity, ColliderComponent);
  collider.body = body;
  golfClubComponent.body = body;

  for(let i = 0; i < golfClubComponent.velocityPositionsToCalculate; i++) {
    golfClubComponent.lastPositions[i] = new Vector3();
  }
  golfClubComponent.velocity = new Vector3();
  addComponent(entity, DebugArrowComponent)
 
  const gameObject = getComponent(entity, GameObject);
  gameObject.collisionBehaviors['GolfBall'] = onClubColliderWithBall;
}

export const createGolfClubPrefab = ( args:{ parameters?: any, networkId?: number, uniqueId: string, ownerId?: string }) => {
  console.log('createGolfClubPrefab')
  initializeNetworkObject({
    prefabType: GolfPrefabTypes.Club,
    uniqueId: args.uniqueId,
    ownerId: args.ownerId,
    networkId: args.networkId,
    prefabParameters: args.parameters,
    override: {
      networkComponents: [
        {
          type: GameObject,
          data: {
            gameName: args.parameters.gameName,
            role: args.parameters.role,
            uuid: args.parameters.uuid
          }
        },
      ]
    }
  });
}

// Prefab is a pattern for creating an entity and component collection as a prototype
export const GolfClubPrefab: NetworkPrefab = {
  initialize: createGolfClubPrefab,
  // These will be created for all players on the network
  networkComponents: [
    // Transform system applies values from transform component to three.js object (position, rotation, etc)
    { type: TransformComponent },
    { type: ColliderComponent },
    { type: RigidBodyComponent },
    { type: GameObject },
    { type: GolfClubComponent }
    // Local player input mapped to behaviors in the input map
  ],
  // These are only created for the local player who owns this prefab
  localClientComponents: [],
  //clientComponents: [{ type: InterpolationComponent, data: { } }],
  clientComponents: [],
  serverComponents: [],
  onAfterCreate: [
    {
      behavior: initializeGolfClub,
      networked: true
    }
  ],
  onBeforeDestroy: []
};
