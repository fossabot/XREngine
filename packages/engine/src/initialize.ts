import _ from 'lodash';
import { BufferGeometry, Mesh, PerspectiveCamera, Scene } from 'three';
import { acceleratedRaycast, computeBoundsTree } from "three-mesh-bvh";
import AssetLoadingSystem from './assets/systems/AssetLoadingSystem';
import { CameraSystem } from './camera/systems/CameraSystem';
import { isClient } from './common/functions/isClient';
import { Timer } from './common/functions/Timer';
import { DebugHelpersSystem } from './debug/systems/DebugHelpersSystem';
import { Engine, AudioListener } from './ecs/classes/Engine';
import { execute, initialize } from "./ecs/functions/EngineFunctions";
import { registerSystem } from './ecs/functions/SystemFunctions';
import { SystemUpdateType } from "./ecs/functions/SystemUpdateType";
import { EntityActionSystem } from './input/systems/EntityActionSystem';
import { InteractiveSystem } from "./interaction/systems/InteractiveSystem";
import { ClientNetworkSystem } from './networking/systems/ClientNetworkSystem';
import { MediaStreamSystem } from './networking/systems/MediaStreamSystem';
import { ServerNetworkIncomingSystem } from './networking/systems/ServerNetworkIncomingSystem';
import { ServerNetworkOutgoingSystem } from './networking/systems/ServerNetworkOutgoingSystem';
import { ParticleSystem } from './particles/systems/ParticleSystem';
import { PhysicsSystem } from './physics/systems/PhysicsSystem';
import { createCanvas } from './renderer/functions/createCanvas';
import { HighlightSystem } from './renderer/HighlightSystem';
import { WebGLRendererSystem } from './renderer/WebGLRendererSystem';
import { ServerSpawnSystem } from './scene/systems/SpawnSystem';
import { StateSystem } from './state/systems/StateSystem';
import { CharacterInputSchema } from './templates/character/CharacterInputSchema';
import { CharacterStateSchema } from './templates/character/CharacterStateSchema';
import { DefaultNetworkSchema } from './templates/networking/DefaultNetworkSchema';
import { TransformSystem } from './transform/systems/TransformSystem';
import { EngineEvents, addIncomingEvents, addOutgoingEvents } from './ecs/classes/EngineEvents';
import { ClientInputSystem } from './input/systems/ClientInputSystem';
// import { PositionalAudioSystem } from './audio/systems/PositionalAudioSystem';

Mesh.prototype.raycast = acceleratedRaycast;
BufferGeometry.prototype["computeBoundsTree"] = computeBoundsTree;

const webXRShouldBeAvailable = typeof navigator === 'undefined' || /Version\/[\d\.]+.*Safari/.test(window.navigator.userAgent);

export const DefaultInitializationOptions = {
  input: {
    schema: CharacterInputSchema,
    useWebXR: webXRShouldBeAvailable,
  },
  networking: {
    schema: DefaultNetworkSchema
  },
  state: {
    schema: CharacterStateSchema
  },
};

export async function initializeEngine(initOptions: any = DefaultInitializationOptions): Promise<void> {
  const options = _.defaultsDeep({}, initOptions, DefaultInitializationOptions);

  new EngineEvents();

  addIncomingEvents()
  addOutgoingEvents()
  
  // Create a new world -- this holds all of our simulation state, entities, etc
  initialize();

  // Create a new three.js scene
  const scene = new Scene();

  // Add the three.js scene to our manager -- it is now available anywhere
  Engine.scene = scene;

  if(typeof window !== 'undefined') {
    // Add iOS and safari flag to window object -- To use it for creating an iOS compatible WebGLRenderer for example
    (window as any).iOS = !window.MSStream && /iPad|iPhone|iPod/.test(navigator.userAgent);
    (window as any).safariWebBrowser = !window.MSStream && /Safari/.test(navigator.userAgent);
  }

  // Networking
  const networkSystemOptions = { schema: options.networking.schema, app: options.networking.app };
  if (isClient) {
    registerSystem(ClientNetworkSystem, { ...networkSystemOptions, priority: -1 });
  } else {
    registerSystem(ServerNetworkIncomingSystem, { ...networkSystemOptions, priority: -1 });
    registerSystem(ServerNetworkOutgoingSystem, { ...networkSystemOptions, priority: 10000 });
  }

  // Do we want audio and video streams?
  registerSystem(MediaStreamSystem);

  registerSystem(AssetLoadingSystem);

  registerSystem(PhysicsSystem);

  registerSystem(StateSystem);

  registerSystem(ServerSpawnSystem, { priority: 899 });

  registerSystem(TransformSystem, { priority: 900 });

  if (isClient) {
    Engine.camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.3, 750);
    Engine.scene.add(Engine.camera);
    registerSystem(HighlightSystem);

    registerSystem(ClientInputSystem, { useWebXR: DefaultInitializationOptions.input.useWebXR });
    registerSystem(EntityActionSystem, { useWebXR: DefaultInitializationOptions.input.useWebXR });
    
    Engine.audioListener = new AudioListener();
    Engine.camera.add(Engine.audioListener);
    // registerSystem(PositionalAudioSystem);

    registerSystem(InteractiveSystem);
    registerSystem(ParticleSystem);
    registerSystem(DebugHelpersSystem);
    registerSystem(CameraSystem);
    registerSystem(WebGLRendererSystem, { priority: 1001, canvas: options.renderer.canvas || createCanvas() });
    Engine.viewportElement = Engine.renderer.domElement;
  }

  // Start our timer!
  Engine.engineTimerTimeout = setTimeout(() => {
    Engine.engineTimer = Timer(
      {
        networkUpdate: (delta:number, elapsedTime: number) => execute(delta, elapsedTime, SystemUpdateType.Network),
        fixedUpdate: (delta:number, elapsedTime: number) => execute(delta, elapsedTime, SystemUpdateType.Fixed),
        update: (delta, elapsedTime) => execute(delta, elapsedTime, SystemUpdateType.Free)
      }, Engine.physicsFrameRate, Engine.networkFramerate).start();
  }, 1000);
}
