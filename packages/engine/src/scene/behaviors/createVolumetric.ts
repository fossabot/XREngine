import { Behavior } from '../../common/interfaces/Behavior';
import DracosisPlayer from '@xr3ngine/volumetric/src/Player';
import { Engine } from '../../ecs/classes/Engine';
import VolumetricComponent from "../components/VolumetricComponent"
import { addComponent, getMutableComponent } from '../../ecs/functions/EntityFunctions';
export const createVolumetric: Behavior = (entity, args: { objArgs }) => {
    console.warn("Handle volumetric, args are", args);
    // Create new volumetric player component
   addComponent(entity, VolumetricComponent);
   const volumetricComponent = getMutableComponent(entity, VolumetricComponent);

   console.log("Args src is ", args.objArgs.src)
   const drcs = args.objArgs.src.replace(".drcs", ".mp4");

    const DracosisSequence = new DracosisPlayer({
        scene: Engine.scene,
        renderer: Engine.renderer,
        meshFilePath: args.objArgs.src,
        videoFilePath: drcs,
        loop: args.objArgs.loop,
        autoplay: args.objArgs.autoPlay,
        scale: 1,
        frameRate: 25,
        keyframeBufferSize: 20,
        iframeBufferSize: 100
      });

      
    
      volumetricComponent.player = DracosisSequence;

      console.log("Created volumetric");

};
