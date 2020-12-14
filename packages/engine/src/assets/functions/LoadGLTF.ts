import { DRACOLoader } from "../loaders/gltf/DRACOLoader";
import { GLTFLoader } from "../loaders/gltf/GLTFLoader";
import { AssetUrl } from "../types/AssetTypes";

export interface LoadGLTFResultInterface {
 scene: any;
 json: any;
 stats: {
     nodes: number,
     meshes: number,
     materials: number,
     textures: number,
     triangles: number,
     vertices: number,
     totalSize: number,
     jsonSize: number,
     bufferInfo: Array<{ name: string, size: number }>,
     textureInfo: {
         [key: string]: {
             name: string,
             size: number,
             url: string,
             width: number,
             height: number,
             type: string
         }
     },
     meshInfo: Array<{
         name: string,
         triangles: number,
         vertices: number
     }>
 };
}

export async function LoadGLTF(url: AssetUrl): Promise<LoadGLTFResultInterface> {
    return await new Promise<LoadGLTFResultInterface>((resolve, reject) => {
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/loader_decoders/');
        loader.setDRACOLoader(dracoLoader);
        loader.load(url, async (gltf) => {
            const json = gltf.parser.json;

            const stats: LoadGLTFResultInterface["stats"] = {
                bufferInfo: (await gltf.parser.getDependencies('buffer')).map((bufferDef, bufferIndex) => {
                    return {
                        name: bufferDef.name || `Buffer ${bufferIndex}`,
                        size: bufferDef.byteLength
                    }
                }),
                meshInfo: json.meshes.map( (meshDef, meshIndex) => {
                    return {
                        name: meshDef.name || `Mesh ${meshIndex}`,
                        triangles: 0,
                        vertices: 0
                    }
                }),
                textureInfo: (await gltf.parser.getDependencies('texture')).map((textureDef) => {
                    return {
                        name: source.name || textureDef.name || `Image ${textureDef.source}`,
                        size: imageSize,
                        url: textureUrl,
                        width: texture.image.width,
                        height: texture.image.height,
                        type: source.mimeType
                    }
                }),
                triangles: 0,
                vertices: 0,
                nodes: json.nodes ? json.nodes.length : 0,
                meshes: json.meshes ? json.meshes.length : 0,
                materials: json.materials ? json.materials.length : 0,
                textures: json.textures ? json.textures.length : 0,
                jsonSize: 0, // content.length
                totalSize: 0,
            };
            stats.totalSize = stats.jsonSize;

            Object.keys(stats.bufferInfo).forEach(key => {
                const item = stats.bufferInfo[key];
                stats.totalSize += item.size || 0;
            });

            Object.keys(stats.textureInfo).forEach(key => {
                const item = stats.textureInfo[key];
                stats.totalSize += item.size || 0;
            });

            resolve({ scene: gltf.scene, json, stats });
        }, null, (e) => { reject(e); });
    });
}