# ECS GLTF Object Metadata

The gltf format and all threejs objects support userData / user properties, which can store arbitrary data as JSON. This can enable interop and usage of data outside of the xrengine ecosystem.


Model userData properties

```ts
{
  [xrengine.entity]: name
  [xrengine.component-type.property]: value
}
```

Golf holes example

```ts
{
  "xrengine.entity": “GolfHole-0"
  "xrengine.box-collider.isTrigger": true
  "xrengine.box-collider.removeMesh": false
}
```

would result in an entity with components

NameComponent { name: "GolfHole-0" }
TransformComponent { position, rotation, scale } (from mesh relative to world origin)
Object3DComponent { value: (the mesh this was loaded from) } (setting removeMesh would remove this component)
ColliderComponent { body: (a physics trigger box body) }