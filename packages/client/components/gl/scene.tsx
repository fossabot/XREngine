import React, { Component, useEffect, FunctionComponent, useState } from 'react';
import { initializeEngine, DefaultInitializationOptions } from "@xr3ngine/engine/src/initialize";
import { PlayerCharacter } from "@xr3ngine/engine/src/templates/character/prefabs/PlayerCharacter";
import { createPrefab } from '@xr3ngine/engine/src/common/functions/createPrefab';
import { NetworkSchema } from '@xr3ngine/engine/src/networking/interfaces/NetworkSchema';
import { SocketWebRTCClientTransport } from '../../classes/transports/SocketWebRTCClientTransport';
import Terminal from '../terminal';
import { commands, description } from '../terminal/commands';
import { createEntity, addComponent } from '@xr3ngine/engine/src/ecs/functions/EntityFunctions';
import { AssetLoader } from "@xr3ngine/engine/src/assets/components/AssetLoader"
import { AssetType } from '@xr3ngine/engine/src/assets/enums/AssetType';
import { AssetClass } from '@xr3ngine/engine/src/assets/enums/AssetClass';

import { staticWorldColliders } from './staticWorldColliders'
import { rigidBodyBox } from './rigidBodyBox'
import { addObject3DComponent } from '@xr3ngine/engine/src/common/behaviors/Object3DBehaviors';
import { AmbientLight } from 'three';
import { PositionalAudio, Mesh, SphereBufferGeometry, MeshPhongMaterial  } from 'three';
import { DefaultNetworkSchema } from '@xr3ngine/engine/src/templates/network/DefaultNetworkSchema';
import { resetEngine } from '@xr3ngine/engine/src/ecs/functions/EngineFunctions';
//import { Engine } from '@xr3ngine3/engine/src/ecs/classes/Engine';
import { Engine } from '../../../engine/src/ecs/classes/Engine';

export const EnginePage: FunctionComponent = (props: any) => {

  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    console.log('initializeEngine!');

    const networkSchema: NetworkSchema = {
      ...DefaultNetworkSchema,
      transport: SocketWebRTCClientTransport
    }

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
        src: '/audio/108.ogg'
      },
    };
    initializeEngine(InitializationOptions);

    // Load glb here
    // createPrefab(rigidBodyBox);

    createPrefab(PlayerCharacter);

    //  createPrefab(staticWorldColliders);

    addObject3DComponent(createEntity(), { obj3d: AmbientLight, ob3dArgs: {
      intensity: 2.0
    }})

    if( Engine.sound ){
      const audioMesh = new Mesh(
        new SphereBufferGeometry( 20, 32, 16 ),
        new MeshPhongMaterial({ color: 0xff2200 })
      );
      addObject3DComponent(createEntity(), { 
        obj3d: audioMesh
      });
      audioMesh.add( Engine.sound );
    }

    // console.log("Creating a scene entity to test")
    // addComponent(createEntity(), AssetLoader, {
    //   url: "models/library.glb",
    //   receiveShadow: true,
    //   castShadow: true
    // }) 
    // addComponent(createEntity(), AssetLoader, {
    //   url: "models/OldCar.fbx",
    //   receiveShadow: true,
    //   castShadow: true
    // })

    return () => {
      // cleanup
      console.log('cleanup?!')
      resetEngine()
    }
  }, [])

  useEffect(() => {
    const f = event => {
      if (event.keyCode === 27)
        toggleEnabled();
    }
    document.addEventListener("keydown", f);
    return () => {
      document.removeEventListener("keydown", f);
    };
  });

  const toggleEnabled = () => {
    console.log("enabled ", enabled)
    if (enabled === true) {
      setEnabled(false)
    } else {
      setEnabled(true)
    }
  }

  return (
    enabled && (
      <Terminal
        color='green'
        backgroundColor='black'
        allowTabs={false}
        startState='maximised'
        showCommands={true}
        style={{ fontWeight: "bold", fontSize: "1em", position: "fixed", bottom: "0", width: "100%", height: "30%", zIndex: 4000 }}
        commands={commands}
        description={description}
        msg='Interactive terminal. Please consult the manual for commands.'
      />
    )
  )
};

export default EnginePage;
