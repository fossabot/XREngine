import { Engine } from '../../ecs/classes/Engine';
import { SceneTagComponent } from '../../common/components/Object3DTagComponents';
import { addComponent, createEntity, getMutableComponent } from '../../ecs/functions/EntityFunctions';
import { SceneObjectLoadingSchema } from '../constants/SceneObjectLoadingSchema';
import { PhysicsManager } from '../../physics/components/PhysicsManager';
import AssetVault from '../../assets/components/AssetVault';
import { hashResourceString } from '../../assets/functions/hashResourceString';
import { AssetLoader } from '../../assets/components/AssetLoader';

export function loadScene (scene) {
  console.warn(Engine.scene);
  console.warn("Loading scene", scene);
  const loadPromises = [];
  let loaded = 0;
  const event = new CustomEvent('scene-loaded-entity', { detail: { left: loadPromises.length } });
  document.dispatchEvent(event);
  Object.keys(scene.entities).forEach(key => {
    const sceneEntity = scene.entities[key];
    const entity = createEntity();
    addComponent(entity, SceneTagComponent);
    sceneEntity.components.forEach(component => {
      loadComponent(entity, component);
      if(component.name === 'gltf-model'){
        const loaderComponent = getMutableComponent(entity, AssetLoader);
        loadPromises.push(new Promise((resolve, reject)=>{ 
          loaderComponent.onLoaded = ()=> {
            loaded++;
            const event = new CustomEvent('scene-loaded-entity', { detail: { left: (loadPromises.length-loaded) } });
            document.dispatchEvent(event);
          };
        }))
      }
    });
  });
  //PhysicsManager.instance.simulate = true;

  Promise.all(loadPromises).then(()=>{
    const event = new CustomEvent('scene-loaded', { detail: { loaded: true } });
    document.dispatchEvent(event);
  });
}

export function loadComponent (entity, component) {
  if (SceneObjectLoadingSchema[component.name] === undefined) return console.warn("Couldn't load ", component.name);
  const componentSchema = SceneObjectLoadingSchema[component.name];
  // for each component in component name, call behavior
  componentSchema.behaviors?.forEach(b => {
    // For each value, from component.data
    const values = {}
    b.values?.forEach(val => {
      // Does it have a from and to field? Let's map to that
      if(val['from'] !== undefined) {
        values[val['to']] = component.data[val['from']];
      }
      else {
      // Otherwise raw data
      values[val] = component.data[val];
      }
    });
    // run behavior after load model
    if((b as any).onLoaded) values['onLoaded'] = (b as any).onLoaded;
    // Invoke behavior with args and spread args
    b.behavior(entity, { ...b.args, objArgs: { ...values } });
  });

  // for each component in component name, add copmponent
  componentSchema.components?.forEach(c => {
    // For each value, from component.data, add to args object
    const values = c.values ? c.values.map(val => component.data[val]) : {};
    // Add component with args
    addComponent(entity, c.type, values);
  });
}
