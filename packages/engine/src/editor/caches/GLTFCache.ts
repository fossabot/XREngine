import { GLTFLoader } from "@xr3ngine/engine/src/assets/loaders/gltf/GLTFLoader";
import { LoadGLTF } from "../../assets/functions/LoadGLTF";

export default class GLTFCache {
  cache: Map<any, any>;
  constructor() {
    this.cache = new Map();
  }
  get(url, options) {
    const absoluteURL = new URL(url, (window as any).location).href;
    if (this.cache.has(absoluteURL)) {
      return this.cache.get(absoluteURL);
    } else {
      const loader =  LoadGLTF(url);
      this.cache.set(absoluteURL, loader);
      return loader;
    }
  }
  disposeAndClear() {
    this.cache.clear();
  }
}
