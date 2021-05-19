import { Component } from "../../ecs/classes/Component";
import { Entity } from "../../ecs/classes/Entity";
import { isClient } from "../../common/functions/isClient";
import { AssetLoader } from '../../assets/classes/AssetLoader';
import { addComponent } from "../../ecs/functions/EntityFunctions";
import { parseModelColliders, clearFromColliders } from '../../physics/behaviors/parseModelColliders';
import { createVehicleFromSceneData } from '../../vehicle/prefabs/NetworkVehicle';
import { AmbientLight, CircleBufferGeometry, Color, HemisphereLight, Mesh, MeshPhongMaterial, PointLight, SpotLight } from 'three';
import { ComponentConstructor } from "../../ecs/interfaces/ComponentInterfaces";
import { createParticleEmitterObject } from '../../particles/functions/particleHelpers';
import { addObject3DComponent } from '../behaviors/addObject3DComponent';
import { createBackground } from '../behaviors/createBackground';
import { createBoxCollider } from '../behaviors/createBoxCollider';
import { createMeshCollider } from '../behaviors/createMeshCollider';
import { createCommonInteractive } from "../behaviors/createCommonInteractive";
import { createGroup } from '../behaviors/createGroup';
import { createLink } from '../behaviors/createLink';
import { createAudio, createMediaServer, createVideo, createVolumetric } from "../behaviors/createMedia";
import { createShadow } from '../behaviors/createShadow';
import createSkybox from '../behaviors/createSkybox';
import { createTransformComponent } from "../behaviors/createTransformComponent";
import { createTriggerVolume } from '../behaviors/createTriggerVolume';
import { handleAudioSettings } from '../behaviors/handleAudioSettings';
import { setFog } from '../behaviors/setFog';
import { LightTagComponent, VisibleTagComponent } from '../components/Object3DTagComponents';
import ScenePreviewCameraTagComponent from "../components/ScenePreviewCamera";
import SpawnPointComponent from "../components/SpawnPointComponent";
import WalkableTagComponent from '../components/Walkable';
import Image from '../classes/Image';
import { createGame, createGameObject } from "../behaviors/createGame";
import { setPostProcessing } from "../behaviors/setPostProcessing";
import { CameraSystem } from "../../camera/systems/CameraSystem";
import { CopyTransformComponent } from "../../transform/components/CopyTransformComponent";
import { isServer } from "../../common/functions/isServer";
/**
 * Add Component into Entity from the Behavior.
 * @param entity Entity in which component will be added.
 * @param args Args contains Component and args of Component which will be added into the Entity.
 */
export function addComponentFromBehavior<C>(
  entity: Entity,
  args: {
    component: ComponentConstructor<Component<C>>
    objArgs: any
  }
): void {
  addComponent(entity, args.component, args.objArgs);
}

/**
 * Add Tag Component with into Entity from the Behavior.
 * @param entity Entity in which component will be added.
 * @param args Args contains Component which will be added into the Entity.
 */
export function addTagComponentFromBehavior<C>(
  entity: Entity,
  args: { component: ComponentConstructor<Component<C>> }
): void {
  // console.log("Adding ", args.component, " to ", entity);
  addComponent(entity, args.component);
}

export const SceneObjectLoadingSchema = {
  'game': {
    behaviors: [{
      behavior: createGame,
      values: [
        { from: 'name', to: 'name' },
        { from: 'gameMode', to: 'gameMode' },
        { from: 'isGlobal', to: 'isGlobal' },
        { from: 'minPlayers', to: 'minPlayers' },
        { from: 'maxPlayers', to: 'maxPlayers' }
      ]
    }]
  },
  'game-object': {
    behaviors: [{
      behavior: createGameObject,
      values: [
        { from: 'gameName', to: 'game' },
        { from: 'role', to: 'role' },
        { from: 'sceneEntityId', to: 'uuid' }
      ]
    }]
  },
  'ambient-light': {
    behaviors: [
      {
        behavior: addObject3DComponent,
        args: { obj3d: AmbientLight },
        values: [
          { from: 'color', to: 'color' },
          { from: 'intensity', to: 'intensity' }
        ]
      }
    ],
    components: [{
      type: LightTagComponent
    }]
  },
  // currently this breaks CSM

  //   'directional-light': {
  //     behaviors: [
  //       {
  //         behavior: addObject3DComponent,
  //         args: { obj3d: DirectionalLight, objArgs: { castShadow: true } },
  //         values: [
  //           { from: 'shadowMapResolution', to: 'shadow.mapSize' },
  //           { from: 'shadowBias', to: 'shadow.bias' },
  //           { from: 'shadowRadius', to: 'shadow.radius' },
  //           { from: 'intensity', to: 'intensity' },
  //           { from: 'color', to: 'color' }
  //         ]
  //       }
  //     ],
  //       components: [{
  //         type: LightTagComponent
  //       }]
  //   },
  'collidable': {
    behaviors: [
      {
        behavior: () => {
          // console.warn("SceneObjectLoadingSchema: Using 'collidable' which is not implemented");
        },
      },
    ]},
  "floor-plan": {}, // Doesn't do anything in client mode
  'gltf-model': {
    behaviors: [
      {
        behavior: (entity, args) => {
          AssetLoader.load({
            url: args.objArgs.url,
            entity,
          }, (res) => {
            if (args.objArgs.dontParseModel) clearFromColliders(entity, { asset: res });
            else parseModelColliders(entity, { asset: res, uniqueId: args.objArgs.sceneEntityId });
          });
        },
        values: [
          { from: 'src', to: 'url' },
          { from: 'equippable', to: 'equippable' },
          'dontParseModel',
          'sceneEntityId'
        ]
      },
    ]
  },
  'interact': {
    behaviors: [
      {
        behavior: createCommonInteractive,
        values: [
          { from: 'interactable', to: 'interactable' },
          { from: 'interactionType', to: 'interactionType' },
          { from: 'interactionText', to: 'interactionText' },
          { from: 'payloadName', to: 'payloadName' },
          { from: 'payloadUrl', to: 'payloadUrl' },
          { from: 'payloadBuyUrl', to: 'payloadBuyUrl' },
          { from: 'payloadLearnMoreUrl', to: 'payloadLearnMoreUrl' },
          { from: 'payloadHtmlContent', to: 'payloadHtmlContent' },
          { from: 'payloadModelUrl', to: 'payloadModelUrl' },
        ],
      }
    ]
  },
  'ground-plane': {
    behaviors: [
      {
        behavior: addObject3DComponent,
        args: {
          // obj3d: new GridHelper( 1000, 5000 )
          obj3d: new Mesh(
            new CircleBufferGeometry(1000, 32).rotateX(-Math.PI / 2),
            new MeshPhongMaterial({
              color: new Color(0.313410553336143494, 0.31341053336143494, 0.30206481294706464)
            })
          ),
          objArgs: { receiveShadow: true }
        },
        values: [{ from: 'color', to: 'material.color' }]
      }
    ]
  },
  'hemisphere-light': {
    behaviors: [
      {
        behavior: addObject3DComponent,
        args: { obj3d: HemisphereLight },
        values: [
          { from: 'skyColor', to: 'skyColor' },
          { from: 'groundColor', to: 'groundColor' },
          { from: 'intensity', to: 'intensity' }
        ]
      }
    ]
  },
  'point-light': {
    behaviors: [
      {
        behavior: addObject3DComponent,
        args: { obj3d: PointLight },
        values: [
          { from: 'color', to: 'color' },
          { from: 'intensity', to: 'intensity' },
          { from: 'distance', to: 'distance' },
          { from: 'decay', to: 'decay' }
        ]
      }
    ]
  },
  'skybox': {
    behaviors: [
      {
        behavior: createSkybox,
        // args: { obj3d: Sky },
        values: [
          { from: 'texture', to: 'texture' },
          { from: 'skytype', to: 'skytype' },
          { from: 'distance', to: 'distance' },
          { from: 'inclination', to: 'inclination' },
          { from: 'azimuth', to: 'azimuth' },
          { from: 'mieCoefficient', to: 'mieCoefficient' },
          { from: 'mieDirectionalG', to: 'mieDirectionalG' },
          { from: 'rayleigh', to: 'rayleigh' },
          { from: 'turbidity', to: 'turbidity' }
        ]
      }
    ]
  },
  'image': {
    behaviors: [
      {
        behavior: addObject3DComponent,
        args: { obj3d: Image },
        values: [
          { from: 'src', to: 'src' },
          { from: 'projection', to: 'projection' },
          { from: 'controls', to: 'controls' },
          { from: 'alphaMode', to: 'alphaMode' },
          { from: 'alphaCutoff', to: 'alphaCutoff' }
        ]
      }
    ]
  },
  'video': {
    behaviors: [
      {
        behavior: isClient ? createVideo : createMediaServer,
        values: [
          { from: 'src', to: 'src' },
          { from: 'projection', to: 'projection' },
          { from: 'controls', to: 'controls' },
          { from: 'autoPlay', to: 'autoPlay' },
          { from: 'loop', to: 'loop' },
          { from: 'audioType', to: 'audioType' },
          { from: 'volume', to: 'volume' },
          { from: 'distanceModel', to: 'distanceModel' },
          { from: 'rolloffFactor', to: 'rolloffFactor' },
          { from: 'refDistance', to: 'refDistance' },
          { from: 'maxDistance', to: 'maxDistance' },
          { from: 'coneInnerAngle', to: 'coneInnerAngle' },
          { from: 'coneOuterAngle', to: 'coneOuterAngle' },
          { from: 'coneOuterGain', to: 'coneOuterGain' }
        ]
      }
    ]
  },
  'audio': {
    behaviors: [
      {
        behavior: isClient ? createAudio : createMediaServer,
        values: [
          { from: 'src', to: 'src' },
          { from: 'projection', to: 'projection' },
          { from: 'controls', to: 'controls' },
          { from: 'autoPlay', to: 'autoPlay' },
          { from: 'loop', to: 'loop' },
          { from: 'audioType', to: 'audioType' },
          { from: 'volume', to: 'volume' },
          { from: 'distanceModel', to: 'distanceModel' },
          { from: 'rolloffFactor', to: 'rolloffFactor' },
          { from: 'refDistance', to: 'refDistance' },
          { from: 'maxDistance', to: 'maxDistance' },
          { from: 'coneInnerAngle', to: 'coneInnerAngle' },
          { from: 'coneOuterAngle', to: 'coneOuterAngle' },
          { from: 'coneOuterGain', to: 'coneOuterGain' }
        ]
      }
    ]
  },
  'volumetric': {
    behaviors: [
      {
        behavior: isClient ? createVolumetric : createMediaServer,
        values: [
          { from: 'src', to: 'src' },
          { from: 'controls', to: 'controls' },
          { from: 'autoPlay', to: 'alphaMode' },
          { from: 'loop', to: 'loop' },
          { from: 'audioType', to: 'audioType' },
          { from: 'volume', to: 'volume' },
          { from: 'distanceModel', to: 'distanceModel' },
          { from: 'rolloffFactor', to: 'rolloffFactor' },
          { from: 'refDistance', to: 'refDistance' },
          { from: 'maxDistance', to: 'maxDistance' },
          { from: 'coneInnerAngle', to: 'coneInnerAngle' },
          { from: 'coneOuterAngle', to: 'coneOuterAngle' },
          { from: 'coneOuterGain', to: 'coneOuterGain' }
        ]
      }
    ]
  },
  'spot-light': {
    behaviors: [
      {
        behavior: addObject3DComponent,
        args: { obj3d: SpotLight },
        values: ['color', 'intensity', 'distance', 'angle', 'penumbra', 'decay']
      }
    ]
  },
  'transform': {
    behaviors: [
      {
        behavior: createTransformComponent,
        values: ['position', 'rotation', 'scale']
      }
    ]
  },
  'visible': {
    behaviors: [
      {
        behavior: addTagComponentFromBehavior,
        args: { component: VisibleTagComponent }
      }
    ]
  },
  'walkable': {
    behaviors: [
      {
        behavior: addTagComponentFromBehavior,
        args: { component: WalkableTagComponent }
      }
    ]
  },
  'fog': {
    behaviors: [
      {
        behavior: setFog,
        values: ['color', 'density', 'far', 'near', 'type']
      }
    ]
  },
  'background': {
    behaviors: [
      {
        behavior: createBackground,
        values: ['color']
      }
    ]
  },
  'audio-settings': {
    behaviors: [
      {
        behavior: handleAudioSettings,
        values: ['avatarDistanceModel', 'avatarMaxDistance', 'avatarRefDistance', 'avatarRolloffFactor', 'mediaConeInnerAngle', 'mediaConeOuterAngle', 'mediaConeOuterGain', 'mediaDistanceModel', 'mediaMaxDistance', 'mediaRefDistance', 'mediaRolloffFactor', 'mediaVolume', 'overrideAudioSettings']
      }
    ]
  },
  'spawn-point': {
    behaviors: [
      {
        behavior: addTagComponentFromBehavior,
        args: { component: SpawnPointComponent }
      }
    ]
  },
  'scene-preview-camera': {
    behaviors: [
      {
        behavior: addTagComponentFromBehavior,
        args: { component: ScenePreviewCameraTagComponent }
      },
      {
        behavior: (previewPointEntity: Entity) => {
          if (!isServer && CameraSystem.instance.activeCamera) {
            addComponent(CameraSystem.instance.activeCamera, CopyTransformComponent, { input: previewPointEntity });
          }
        }
      }
    ]
  },
  'shadow': {
    behaviors: [
      {
        behavior: createShadow,
        values: [
          { from: 'cast', to: 'castShadow' },
          { from: 'receive', to: 'receiveShadow' },
        ]
      }
    ]
  },
  'group': {
    behaviors: [
      {
        behavior: createGroup
      }
    ]
  },
  'box-collider': {
    behaviors: [
      {
        behavior: createBoxCollider,
        values: ['type', 'position', 'quaternion', 'scale']
      }
    ]
  },
  'mesh-collider': {
    behaviors: [
      {
        behavior: createMeshCollider,
        values: ['data', 'type', 'position', 'quaternion', 'scale', 'vertices', 'indices', 'sceneEntityId']
      }
    ]
  },
  'vehicle-saved-in-scene': {
    behaviors: [
      {
        behavior: createVehicleFromSceneData,
        values: ['arrayWheelsPosition', 'entrancesArray', 'seatsArray', 'startPosition', 'startQuaternion', 'suspensionRestLength', 'interactionPartsPosition', 'mass', 'sceneEntityId']
      }
    ]
  },
  'trigger-volume': {
    behaviors: [
      {
        behavior: createTriggerVolume
      }
    ]
  },
  'link': {
    behaviors: [
      {
        behavior: createLink,
        values: [
          { from: 'href', to: 'url' },
        ]
      }
    ]
  },
  'particle-emitter': {
    behaviors: [
      {
        behavior: createParticleEmitterObject,
        values: ['ageRandomness', 'angularVelocity', 'colorCurve', 'endColor', 'endOpacity', 'endSize', 'endVelocity', 'lifetime', 'lifetimeRandomness', 'middleColor', 'middleOpacity', 'particleCount', 'sizeCurve', 'sizeRandomness', 'src', 'startColor', 'startOpacity', 'startSize', 'startVelocity', 'velocityCurve']
      }
    ],
  },

  'postprocessing':
  {
    behaviors:[
      {
        behavior:setPostProcessing,
        values:["options"]
      }
    ]
  }
};
