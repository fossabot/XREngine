import { AssetLoader } from "@xr3ngine/engine/src/assets/components/AssetLoader";
import { CameraComponent } from '@xr3ngine/engine/src/camera/components/CameraComponent';
import { addObject3DComponent } from '@xr3ngine/engine/src/common/behaviors/Object3DBehaviors';
import { Object3DComponent } from "@xr3ngine/engine/src/common/components/Object3DComponent";
import { createPrefab } from '@xr3ngine/engine/src/common/functions/createPrefab';
import { addComponent, createEntity, getComponent, getMutableComponent } from '@xr3ngine/engine/src/ecs/functions/EntityFunctions';
import { DefaultInitializationOptions, initializeEngine } from "@xr3ngine/engine/src/initialize";
import { NetworkSchema } from '@xr3ngine/engine/src/networking/interfaces/NetworkSchema';
import { PlayerCharacter } from "@xr3ngine/engine/src/templates/character/prefabs/PlayerCharacter";
import { DefaultNetworkSchema } from '@xr3ngine/engine/src/templates/networking/DefaultNetworkSchema';
import { TransformComponent } from '@xr3ngine/engine/src/transform/components/TransformComponent';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { AmbientLight } from 'three';
import { SocketWebRTCClientTransport } from '../../classes/transports/SocketWebRTCClientTransport';
import Terminal from '../terminal';
import { commands, description } from '../terminal/commands';
import { staticWorldColliders } from "@xr3ngine/engine/src/templates/car/prefabs/staticWorldColliders";
import { CarController } from "@xr3ngine/engine/src/templates/car/prefabs/CarController";
import { rigidBodyBox2 } from "@xr3ngine/engine/src/templates/car/prefabs/rigidBodyBox2";
import { rigidBodyBox } from "@xr3ngine/engine/src/templates/car/prefabs/rigidBodyBox";


export const EnginePage: FunctionComponent = (props: any) => {

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    console.log('initializeEngine!');

    const networkSchema: NetworkSchema = {
      ...DefaultNetworkSchema,
      transport: SocketWebRTCClientTransport
    };

    const InitializationOptions = {
      ...DefaultInitializationOptions,
      networking: {
        enabled: true,
        supportsMediaStreams: true,
        schema: networkSchema
      },
      physics: {
        enabled: true
      },
      audio: {
        src: '/audio/djMagda.m4a'
      },
    };
    initializeEngine(InitializationOptions);

    // Load glb here
    // createPrefab(rigidBodyBox);

    addObject3DComponent(createEntity(), { obj3d: AmbientLight, ob3dArgs: {
      intensity: 5.0
    }});

    const cameraTransform = getMutableComponent<TransformComponent>(CameraComponent.instance.entity, TransformComponent);
    cameraTransform.position.set(0, 1.2, 3);


    // const { sound } = Engine as any;
    // if (sound) {
    //   const audioMesh = new Mesh(
    //     new SphereBufferGeometry(0.3),
    //     new MeshPhongMaterial({color: 0xff2200})
    //   );
    //   const audioEntity = createEntity();
    //   addObject3DComponent(audioEntity, {
    //     obj3d: audioMesh
    //   });
    //   audioMesh.add(sound);
    //   const transform = addComponent(audioEntity, TransformComponent) as TransformComponent;
    //   transform.position.set(0, 1, 0);
    //   // const audioComponent = addComponent(audioEntity,
    //   //   class extends Component {static scema = {}}
    //   // )
    // }

    console.log("Creating a scene entity to test");
    // const levelEntity = createEntity();
    // addComponent(levelEntity, AssetLoader, {
    //   url: "models/library.glb",
    //   receiveShadow: true,
    //   castShadow: true,
    //   onLoaded: () => {
    //     console.log('level is loaded');
    //     // TODO: parse Floor_plan
    //     // TODO: parse Spawn point

    //     // TODO: this is temporary, to make level floor mach zero
    //     const level3d = getComponent<Object3DComponent>(levelEntity, Object3DComponent);
    //     //level3d.value.position.y -= 0.17;
    //     level3d.value.position.y -= 0.22;

    //   }
    // });


    createPrefab(PlayerCharacter);
    createPrefab(staticWorldColliders);
    createPrefab(rigidBodyBox);
    createPrefab(rigidBodyBox2);
    createPrefab(CarController);

    // addComponent(createEntity(), AssetLoader, {
    //   url: "models/OldCar.fbx",
    //   receiveShadow: true,
    //   castShadow: true
    // })

    return (): void => {
      // cleanup
      console.log('cleanup?!');
      // TODO: use resetEngine when it will be completed. for now just reload
      document.location.reload();
      // resetEngine();
    };
  }, []);

  useEffect(() => {
    const f = (event: KeyboardEvent): void => {
      // const P_PLAY_PAUSE = 112;
      // if (event.keyCode === 27)
      if (event.keyCode === 192) {
        event.preventDefault();
        toggleEnabled();
      }
      // else if(event.keyCode == P_PLAY_PAUSE)
    };
    document.addEventListener("keydown", f);
    return (): void => {
      document.removeEventListener("keydown", f);
    };
  });

  const toggleEnabled = (): void => {
    // console.log("enabled", enabled);
    if (enabled === true) {
      setEnabled(false);
    } else {
      setEnabled(true);
    }
  };

  return (
    enabled && (
      <Terminal
        color='green'
        backgroundColor='black'
        // allowTabs={false}
        allowTabs={true}
        startState='maximised'
        showCommands={true}
        style={{
          fontWeight: "bold",
          fontSize: "1em",
          position: "fixed",
          bottom: "0",
          width: "100%", 
          // Height is set in termimal itself depending is it expanded.
          // height: "30%",
          zIndex: 4000 }}
        commands={commands}
        description={description}
        msg='Interactive terminal. Please consult the manual for commands.'
      />
    )
  );
};

export default EnginePage;
