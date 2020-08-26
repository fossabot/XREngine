import { AmbientLight, Camera, GridHelper, PerspectiveCamera, Scene } from 'three';
import { registerSystem } from './ecs/functions/SystemFunctions';
import { createEntity } from './ecs/functions/EntityFunctions';
import { Engine } from './ecs/classes/Engine';
import { execute, initialize, startTimer } from './ecs/functions/EngineFunctions';
import { PhysicsSystem } from './physics/systems/PhysicsSystem';
import { CharacterInputSchema } from './templates/character/CharacterInputSchema';
import { CharacterSubscriptionSchema } from './templates/character/CharacterSubscriptionSchema';
import { TransformSystem } from './transform/systems/TransformSystem';
import { isBrowser } from './common/functions/isBrowser';
import { CameraSystem } from './camera/systems/CameraSystem';
import { InputSystem } from './input/systems/InputSystem';
import { NetworkSystem } from './networking/systems/NetworkSystem';
import { MediaStreamSystem } from './networking/systems/MediaStreamSystem';
import { StateSystem } from './state/systems/StateSystem';
import { SubscriptionSystem } from './subscription/systems/SubscriptionSystem';
import { ParticleSystem } from "./particles/systems/ParticleSystem"
import { WebGLRendererSystem } from './renderer/systems/WebGLRendererSystem';
import AssetLoadingSystem from './assets/systems/AssetLoadingSystem';
import { DefaultNetworkSchema } from './templates/network/DefaultNetworkSchema';
import { CharacterStateSchema } from './templates/character/CharacterStateSchema';
import { addObject3DComponent } from './common/behaviors/Object3DBehaviors';

export const DefaultInitializationOptions = {
  debug: true,
  withTransform: true,
  withWebXRInput: true,
  input: {
    enabled: true,
    schema: CharacterInputSchema
  },
  assets: {
    enabled: true
  },
  networking: {
    enabled: false,
    supportsMediaStreams: false,
    schema: DefaultNetworkSchema
  },
  state: {
    enabled: true,
    schema: CharacterStateSchema
  },
  subscriptions: {
    enabled: true,
    schema: CharacterSubscriptionSchema
  },
  physics: {
    enabled: false
  },
  particles: {
    enabled: false
  },
  camera: {
    enabled: true
  },
  transform: {
    enabled: true
  },
  renderer: {
    enabled: true
  }
};

export function initializeEngine (options: any = DefaultInitializationOptions) {
  console.log(options)
  // Create a new world -- this holds all of our simulation state, entities, etc
  initialize();
  // Create a new three.js scene
  const scene = new Scene();

  // Add the three.js scene to our manager -- it is now available anywhere
  Engine.scene = scene;

  // Asset Loading system
  if (options.assets && options.assets.enabled) {
    registerSystem(AssetLoadingSystem);
  }

  // Transform
  if (options.transform && options.transform.enabled) {
    registerSystem(TransformSystem, { priority: 900 });
  }

  // If we're a browser (we don't need to create or render on the server)
    // Camera system and component setup
    if (options.camera && options.camera.enabled) {
    // Create a new three.js camera
    const camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Add the camera to the camera manager so it's available anywhere
    Engine.camera = camera
    // Add the camera to the three.js scene
    scene.add(camera);
      registerSystem(CameraSystem);
    }

  // Input
  if (options.input && options.input.enabled && isBrowser) {
    registerSystem(InputSystem, { useWebXR: options.withWebXRInput });
  }

  // Networking
  if (options.networking && options.networking.enabled) {
    registerSystem(NetworkSystem, { schema: options.networking.schema});

    // Do we want audio and video streams?
    if (options.networking.supportsMediaStreams == true) {
      registerSystem(MediaStreamSystem);
    } else {
      console.warn('Does not support media streams');
    }
  }

  // State
  if (options.state && options.state.enabled) {
    registerSystem(StateSystem);
  }

  // Subscriptions
  if (options.subscriptions && options.subscriptions.enabled) {
    registerSystem(SubscriptionSystem);
  }
  // Physics
  if (options.physics && options.physics.enabled) {
    registerSystem(PhysicsSystem);
  }
  // Particles
  if (options.particles && options.particles.enabled) {
    registerSystem(ParticleSystem)
  }

  // Rendering
  if (options.renderer && options.renderer.enabled) {
    registerSystem(WebGLRendererSystem, { priority: 999 });
  }

  // if (options.debug === true) {
  //   // If we're in debug, add a gridhelper
  //   const gridHelper = new GridHelper(1000, 100, 0xffffff, 0xeeeeee);
  //   scene.add(gridHelper);
  //   const entity = createEntity();
  //   // Add an ambient light to the scene
  //   addObject3DComponent(entity, { obj3d: AmbientLight });
  // }

  // Start our timer!
  if (isBrowser) {
    Engine.engineTimerTimeout = setTimeout(startTimer, 1000);
  }
}
