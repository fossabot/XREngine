// import fs from 'fs';
import * as draco3d from 'draco3d';
import { byteArrayToLong, lerp } from '../Shared/Utilities';
import {
  Action,
  IFileHeader,
  IBufferGeometryCompressedTexture,
  WorkerDataRequest,
  WorkerInitializationRequest,
  WorkerInitializationResponse,
} from './Interfaces';
import RingBuffer from './RingBuffer';
import {
  Scene,
  Renderer,
  BufferGeometry,
  SphereBufferGeometry,
  CompressedTexture,
  BoxBufferGeometry,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MeshPhongMaterial,
  Mesh,
  Uint16BufferAttribute,
  Uint32BufferAttribute,
  Float32BufferAttribute,
  DataTexture,
  RGBFormat,
  sRGBEncoding,
  Color,
  RepeatWrapping,
  PlaneBufferGeometry,
  TextureLoader,
  NearestFilter,
  ClampToEdgeWrapping
} from 'three';
import { BasisTextureLoader } from 'three/examples/jsm/loaders/BasisTextureLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
// import { ReadStream } from 'fs';
import ReadStream from 'fs-readstream-seek';
import { MessageType } from './Enums';
import * as CodecHelpers from './CodecHelpers';

const worker = new Worker('./Worker.js');

// Class draco / basis player
export default class DracosisPlayer {
  // Public Fields
  public frameRate = 30;
  public speed = 1.0; // Multiplied by framerate for final playback output rate

  // Three objects
  public scene: Scene;
  public renderer: Renderer;
  public mesh: Mesh;
  public material: MeshBasicMaterial;
  public bufferGeometry: BufferGeometry;
  public compressedTexture: CompressedTexture;
  public dracoLoader = new DRACOLoader();

  // Private Fields
  private _startFrame = 1;
  private _endFrame = 0;
  private _numberOfFrames = 0;
  private _currentFrame = 1;
  private _loop = true;
  private _playOnStart = true;
  private _isinitialized = false;
  private _onLoaded: any; // External callback when volumetric is loaded
  private _ringBuffer: RingBuffer<IBufferGeometryCompressedTexture>;
  private _dataBufferSize = 100;
  private _filePath: string;
  private _isPlaying = false;
  private _fileHeader: IFileHeader;

  private _fileReadStream: ReadStream;
  private _readStreamOffset = 0;
  private _basisTextureLoader = new BasisTextureLoader();
  private _decoderModule = draco3d.createDecoderModule({});
  private _encoderModule = draco3d.createEncoderModule({});

  private _nullBufferGeometry = new BufferGeometry();
  private _nullCompressedTexture = new CompressedTexture(
    [new ImageData(200, 200)],
    0,
    0
  );

  // Temp variables -- reused in loops, etc (beware of initialized value!)
  private _pos = 0;
  private _frameNumber = 0;
  private _framesUpdated = 0; // TODO: Remove after debug
  private _numberOfBuffersRemoved = 0; // TODO: Remove after debug

  // public getters and settings
  get currentFrame(): number {
    return this._currentFrame;
  }

  get startFrame(): number {
    return this._startFrame;
  }
  set startFrame(value: number) {
    this._startFrame = value;
    this._numberOfFrames = this._endFrame - this._startFrame;
    worker.postMessage({
      type: MessageType.SetEndFrameRequest,
      value,
    } as Action);
  }

  get endFrame(): number {
    return this._endFrame;
  }
  set endFrame(value: number) {
    this._endFrame = value;
    this._numberOfFrames = this._endFrame - this._startFrame;
    worker.postMessage({
      type: MessageType.SetEndFrameRequest,
      value,
    } as Action);
  }

  get loop(): boolean {
    return this._loop;
  }
  set loop(value: boolean) {
    this._loop = value;
    worker.postMessage({ type: MessageType.SetLoopRequest, value } as Action);
  }

  httpGetAsync(theUrl: any, callback: any) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
        callback(xmlHttp.responseText);
    };

    xmlHttp.open('GET', theUrl, true); // true for asynchronous
    xmlHttp.send(null);
  }

  constructor(
    scene: any,
    renderer: any,
    filePath: string,
    onLoaded: any,
    playOnStart = true,
    loop = true,
    startFrame = 1,
    endFrame = -1,
    speedMultiplier = 1,
    bufferSize = 100
  ) {
    this.scene = scene;
    this.renderer = renderer;
    this._filePath = filePath;
    this._onLoaded = onLoaded;
    this._loop = loop;
    this.speed = speedMultiplier;
    this._startFrame = startFrame;
    this._playOnStart = playOnStart;
    this._currentFrame = startFrame;

    this.bufferGeometry = new BoxBufferGeometry(1, 1, 1);
    this.material = new MeshBasicMaterial();
    this.bufferGeometry.name = 'sphere';
    this.mesh = new Mesh(this.bufferGeometry, this.material);
    this.scene.add(this.mesh);
    // this.bufferGeometry = true;

    // this.bufferGeometry = new PlaneBufferGeometry(2, 20, 32);

    this._basisTextureLoader.setTranscoderPath('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/basis/');
    this._basisTextureLoader.detectSupport(renderer);


    this.dracoLoader.setDecoderPath(
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/'
    );

    let player = this;

    this.httpGetAsync('http://localhost:8000/dracosis', function (data: any) {
      data = JSON.parse(data);
      if (endFrame > 1) {
        player._endFrame = endFrame;
      } else {
        player._endFrame = data.fileHeader.frameData.length;
      }
      player._numberOfFrames = player._endFrame - player._startFrame;

      // init buffers with settings
      player._ringBuffer = new RingBuffer(bufferSize);

      const initializeMessage = {
        startFrame: player._startFrame,
        endFrame: player._endFrame,
        type: MessageType.InitializationRequest,
        data: data,
        loop: player._loop,
        filePath: data.filePath,
        fileHeader: data.fileHeader,
        isInitialized: true,
        readStreamOffset: data.readStreamOffset,
      };

      worker.postMessage(initializeMessage);

      // Add event handler for manging worker responses
      worker.addEventListener('message', ({ data }) => {
        player.handleMessage(data);
      });
    });
  }

  decodeDracoData(rawBuffer: Buffer) {
    const decoder = new this._decoderModule.Decoder();
    const buffer = new this._decoderModule.DecoderBuffer();
    buffer.Init(new Int8Array(rawBuffer), rawBuffer.byteLength);
    const geometryType = decoder.GetEncodedGeometryType(buffer);

    let dracoGeometry;
    let status;

    if (geometryType === this._decoderModule.TRIANGULAR_MESH) {
      dracoGeometry = new this._decoderModule.Mesh();
      status = decoder.DecodeBufferToMesh(buffer, dracoGeometry);
    } else if (geometryType === this._decoderModule.POINT_CLOUD) {
      dracoGeometry = new this._decoderModule.PointCloud();
      status = decoder.DecodeBufferToPointCloud(buffer, dracoGeometry);
    } else {
      const errorMsg = 'Error: Unknown geometry type.';
      console.error(errorMsg);
    }
    this._decoderModule.destroy(buffer);

    const bufferGeometry = this.getBufferFromDracoGeometry(
      dracoGeometry,
      decoder
    );

    bufferGeometry.computeVertexNormals();

    return bufferGeometry;
  }

  //   assignUVs(geometry) {

  //     geometry.faceVertexUvs[0] = [];

  //     geometry.faces.forEach(function(face) {

  //         var components = ['x', 'y', 'z'].sort(function(a, b) {
  //             return Math.abs(face.normal[a]) > Math.abs(face.normal[b]);
  //         });

  //         var v1 = geometry.vertices[face.a];
  //         var v2 = geometry.vertices[face.b];
  //         var v3 = geometry.vertices[face.c];

  //         geometry.faceVertexUvs[0].push([
  //             new THREE.Vector2(v1[components[0]], v1[components[1]]),
  //             new THREE.Vector2(v2[components[0]], v2[components[1]]),
  //             new THREE.Vector2(v3[components[0]], v3[components[1]])
  //         ]);

  //     });

  //     geometry.uvsNeedUpdate = true;
  // }

  getBufferFromDracoGeometry(uncompressedDracoMesh, decoder) {
    const encoder = new this._encoderModule.Encoder();
    const meshBuilder = new this._encoderModule.MeshBuilder();
    // Create a mesh object for storing mesh data.
    const newMesh = new this._encoderModule.Mesh();

    let uncompressedNumFaces, uncompressedNumPoints;
    let numVertexCoordinates, numTextureCoordinates, numColorCoordinates;
    let numAttributes;
    let numColorCoordinateComponents = 3;

    // For output basic geometry information.
    uncompressedNumFaces = uncompressedDracoMesh.num_faces();
    uncompressedNumPoints = uncompressedDracoMesh.num_points();
    numVertexCoordinates = uncompressedNumPoints * 3;
    numTextureCoordinates = uncompressedNumPoints * 2;
    numColorCoordinates = uncompressedNumPoints * 3;
    numAttributes = uncompressedDracoMesh.num_attributes();

    // Get position attribute. Must exists.
    let posAttId = decoder.GetAttributeId(
      uncompressedDracoMesh,
      this._decoderModule.POSITION
    );
    if (posAttId == -1) {
      let errorMsg = 'THREE.DRACOLoader: No position attribute found.';
      console.error(errorMsg);
      this._decoderModule.destroy(decoder);
      this._decoderModule.destroy(uncompressedDracoMesh);
      throw new Error(errorMsg);
    }
    let posAttribute = decoder.GetAttribute(uncompressedDracoMesh, posAttId);
    let posAttributeData = new this._decoderModule.DracoFloat32Array();
    decoder.GetAttributeFloatForAllPoints(
      uncompressedDracoMesh,
      posAttribute,
      posAttributeData
    );

    // Get normal attributes if exists.
    let normalAttId = decoder.GetAttributeId(
      uncompressedDracoMesh,
      this._decoderModule.NORMAL
    );
    let norAttributeData;
    if (normalAttId != -1) {
      let norAttribute = decoder.GetAttribute(
        uncompressedDracoMesh,
        normalAttId
      );
      norAttributeData = new this._decoderModule.DracoFloat32Array();
      decoder.GetAttributeFloatForAllPoints(
        uncompressedDracoMesh,
        norAttribute,
        norAttributeData
      );
    }

    // Get texture coord attributes if exists.
    let texCoordAttId = decoder.GetAttributeId(uncompressedDracoMesh, this._decoderModule.TEX_COORD);
    let textCoordAttributeData;
    if (texCoordAttId != -1) {
      let texCoordAttribute = decoder.GetAttribute(uncompressedDracoMesh, texCoordAttId);
      textCoordAttributeData = new this._decoderModule.DracoFloat32Array();
      decoder.GetAttributeFloatForAllPoints(uncompressedDracoMesh, texCoordAttribute, textCoordAttributeData);
    }

    // Structure for converting to THREEJS geometry later.
    let geometryBuffer = {
      vertices: new Float32Array(numVertexCoordinates),
      normals: new Float32Array(numVertexCoordinates),
      uvs: new Float32Array(numTextureCoordinates),
      indices: null,
    };

    for (let i = 0; i < numVertexCoordinates; i += 3) {
      geometryBuffer.vertices[i] = posAttributeData.GetValue(i);
      geometryBuffer.vertices[i + 1] = posAttributeData.GetValue(i + 1);
      geometryBuffer.vertices[i + 2] = posAttributeData.GetValue(i + 2);
      // Add normal.
      if (normalAttId != -1) {
        geometryBuffer.normals[i] = norAttributeData.GetValue(i);
        geometryBuffer.normals[i + 1] = norAttributeData.GetValue(i + 1);
        geometryBuffer.normals[i + 2] = norAttributeData.GetValue(i + 2);
      }
    }

    // Add texture coordinates.
    if (texCoordAttId != -1) {
      for (let i = 0; i < numTextureCoordinates; i += 2) {
        geometryBuffer.uvs[i] = textCoordAttributeData.GetValue(i);
        geometryBuffer.uvs[i + 1] = textCoordAttributeData.GetValue(i + 1);
      }
    }

    this._decoderModule.destroy(posAttributeData);
    if (normalAttId != -1) this._decoderModule.destroy(norAttributeData);
    if (texCoordAttId != -1) this._decoderModule.destroy(textCoordAttributeData);

    let uncompressedNumIndices = uncompressedNumFaces * 3;
    geometryBuffer.indices = new Uint32Array(uncompressedNumIndices);
    let ia = new this._decoderModule.DracoInt32Array();
    for (let i = 0; i < uncompressedNumFaces; ++i) {
      decoder.GetFaceFromMesh(uncompressedDracoMesh, i, ia);
      let index = i * 3;
      geometryBuffer.indices[index] = ia.GetValue(0);
      geometryBuffer.indices[index + 1] = ia.GetValue(1);
      geometryBuffer.indices[index + 2] = ia.GetValue(2);
    }
    this._decoderModule.destroy(ia);

    // Import data to Three JS geometry.
    let geometry = new BufferGeometry();

    geometry.setIndex(
      new (geometryBuffer.indices.length > 65535
        ? Uint32BufferAttribute
        : Uint16BufferAttribute)(geometryBuffer.indices, 1)
    );
    geometry.setAttribute(
      'position',
      new Float32BufferAttribute(geometryBuffer.vertices, 3)
    );

    if (normalAttId != -1) {
      geometry.setAttribute(
        'normal',
        new Float32BufferAttribute(geometryBuffer.normals, 3)
      );
    }

    if (texCoordAttId != -1) {
      geometry.setAttribute("uv",
        new Float32BufferAttribute(geometryBuffer.uvs, 2)
      );
    }

    this._decoderModule.destroy(decoder);
    this._decoderModule.destroy(uncompressedDracoMesh);

    return geometry;

  }

  handleMessage(data: any) {
    switch (data.type) {
      case MessageType.InitializationResponse:
        this.handleInitializationResponse(data);
        break;
      case MessageType.DataResponse: {

        if (data && data.buffers) {
          this.handleDataResponse(data.buffers);
        }
        break;
      }
    }
  }

  handleInitializationResponse(data: WorkerInitializationResponse) {
    if (data.isInitialized) {
      this._isinitialized = true;
      this.handleBuffers();
      if (this._playOnStart) this.play();
      console.log('Received initialization response from worker');
    } else console.error('Initialization failed');
  }

  handleDataResponse(data) {
    // For each object in the array...

    const player = this;

    //@ts-ignore
    this._basisTextureLoader._createTexture(data[0].compressedTexture, data[0].frameNumber.toString())
      .then(function (texture, param) {
        // player._ringBuffer.get(0).compressedTexture = texture;
        // //@ts-ignore
        // player.mesh.material.color = new Color(0xff0000);

        // //@ts-ignore
        // player.mesh.material.needsUpdate = true; 
        player.mesh.geometry = player.decodeDracoData(data[0].bufferGeometry);
        // @ts-ignore
        var texturepng = new TextureLoader().load('./tex.00001.png');

        // @ts-ignore
        // player.mesh.material.map = texture;
        player.mesh.material.map = texturepng;

        // texture.encoding = sRGBEncoding;
        // texture.wrapS = RepeatWrapping;
        // texture.wrapT = RepeatWrapping;
        // texture.repeat.y = -1

        texturepng.magFilter = NearestFilter;
        texturepng.minFilter = NearestFilter;
        // @ts-ignore
        texture.anisotropy = player.renderer.getMaxAnisotropy()


        // texturepng.wrapT = ClampToEdgeWrapping;
        // texturepng.wrapS = ClampToEdgeWrapping;

        texturepng.encoding = sRGBEncoding;
        texturepng.wrapS = RepeatWrapping;
        texturepng.wrapT = RepeatWrapping;
        // texturepng.repeat.y = -1


        // @ts-ignore
        player.mesh.material.needsUpdate = true;

        console.log('456 inside createtexture')

      })
      .catch(function (error) {
        console.log("Error:", error)
      });

    // data.forEach((geomTex) => {

    //   console.log('465 inside data loop')

    //   player._frameNumber = geomTex.frameNumber;
    //   // Find the frame in our circular buffer
    //   // player._pos = player.getPositionInBuffer(player._frameNumber);
    //   // Set the mesh and texture buffers

    //   // console.log("BufferTexture", geomTex.compressedTexture)

    //   //@ts-ignore
    //   // this._basisTextureLoader._createTexture(geomTex.compressedTexture, geomTex.frameNumber.toString())
    //   //   .then( function (e) {
    //   //     console.log("basisTextureCreated", e)
    //   //   });

    //   //@ts-ignore
    //   // const texture = this._basisTextureLoader._createTexture(geomTex.compressedTexture, geomTex.frameNumber.toString());

    //   // console.log("382 compressed texture", new DataTexture(geomTex.compressedTexture, 1024, RGBFormat));
    //   // console.log("BasisTexture", this.mesh.material, texture);
    //   // player._ringBuffer.get(player._frameNumber).compressedTexture = texture;
    //   console.log("413 before BufferGeometry")

    //   player._ringBuffer.get(
    //     player._frameNumber
    //   ).bufferGeometry = player.decodeDracoData(geomTex.bufferGeometry);
    //   player._framesUpdated++;
    // });
    // console.log(
    //   'Updated mesh and texture data on ' + player._framesUpdated + ' frames'
    // );
    // console.log("Ringbuffer", player._ringBuffer);
  }

  getPositionInBuffer(frameNumber: number): number {
    // Search backwards, which should make the for loop shorter on longer buffer
    for (let i = this._ringBuffer.getPos(); i > 0; i--)
      if ((frameNumber = this._ringBuffer.get(i).frameNumber)) return i;
    return -1;
  }

  handleBuffers() {
    // If not initialized, skip.
    if (!this._isinitialized) return setTimeout(this.handleBuffers, 100);
    // Clear the buffers
    while (true) {
      // Peek the current frame. if it's frame number is below current frame, trash it
      if (
        !this._ringBuffer || !this._ringBuffer.getFirst() ||
        this._ringBuffer.getFirst().frameNumber >= this._currentFrame
      )
        break;

      // if it's equal to or greater than current frame, break the loop
      // this._ringBuffer.remove(0);
      this._numberOfBuffersRemoved++;
    }

    if (this._numberOfBuffersRemoved > 0)
      console.warn(
        'Removed ' +
        this._numberOfBuffersRemoved +
        ' since they were skipped in playback'
      );

    const framesToFetch: number[] = [];

    // Fill buffers with new data
    while (!this._ringBuffer.full()) {
      // Increment onto the last frame
      const lastFrame =
        (this._ringBuffer.getLast() &&
          this._ringBuffer.getLast().frameNumber) ||
        0;
      const nextFrame = (lastFrame + 1) % this._numberOfFrames;
      const frameData: IBufferGeometryCompressedTexture = {
        frameNumber: nextFrame,
        bufferGeometry: this._nullBufferGeometry,
        compressedTexture: this._nullCompressedTexture,
      };
      framesToFetch.push(nextFrame);
      this._ringBuffer.add(frameData);
    }

    const fetchFramesMessage: WorkerDataRequest = {
      type: MessageType.DataRequest,
      framesToFetch,
    };

    if (framesToFetch.length > 0) worker.postMessage(fetchFramesMessage);

    // Every 1/4 second, make sure our workers are working
    setTimeout(this.handleBuffers, 100);
  }

  update() {
    // console.log(
    //   'Player update called, current frame is + ' + this._currentFrame
    // );

    // If playback is paused, stop updating
    // if (!this._isPlaying) return;

    // If we aren't initialized yet, skip logic but come back next frame
    // if (!this._isinitialized) return;
    //   return setTimeout(this.update, (1.0 / this.frameRate) * this.speed);

    // Advance to next frame
    // this._currentFrame++;

    // Loop logic
    // if (this._currentFrame >= this._endFrame) {
    //   if (this._loop) this._currentFrame = this._startFrame;
    //   else {
    //     this._isPlaying = false;
    //     return;
    //   }
    // }

    // this._currentFrame = 1;
    // console.log('514', this._currentFrame)

    // console.log('Current frame', this._currentFrame);
    // console.log("515 in update", this._ringBuffer && this._ringBuffer.getFirst(), this._ringBuffer.getFirst().frameNumber, this._currentFrame)

    // If the frame exists in the ring buffer, use it
    // if (
    //   this._ringBuffer && this._ringBuffer.getFirst() &&
    //   this._ringBuffer.getFirst().frameNumber == this._currentFrame
    // ) {
    //   // console.log(
    //   //   'Buffer Geometry',
    //   //   this._ringBuffer.getFirst().bufferGeometry
    //   // );
    //   // read buffer into current buffer geometry
    //   console.log("Frame Number", this._ringBuffer.getFirst().frameNumber);

    //   this.bufferGeometry = this._ringBuffer.getFirst().bufferGeometry;
    //   this.mesh.geometry = this.bufferGeometry;

    //   console.log("BufferGeometry", this.bufferGeometry)

    //   // read buffer into current texture
    //   // this.compressedTexture = this._ringBuffer.get(0).compressedTexture;
    //   // this.compressedTexture.encoding = sRGBEncoding;
    //   // this.compressedTexture.wrapS = RepeatWrapping;
    //   // this.compressedTexture.wrapT = RepeatWrapping;
    //   // // this.compressedTexture.flipY = true;
    //   // // this.compressedTexture.repeat.x = -1
    //   // this.compressedTexture.repeat.y = -1

    //   // this.compressedTexture.needsUpdate = true;

    //   console.log("607 compressed Teture", this.compressedTexture)

    //   // // @ts-ignore
    //   // this.mesh.material.map = this.compressedTexture;
    //   // // @ts-ignore
    //   // this.mesh.material.needsUpdate = true;
    //   // console.log("Compressed Texture", this.compressedTexture)
    //   console.log("Mesh", this.mesh)

    //   console.log("Current frame", this._ringBuffer.get(0).frameNumber)

    //   //@ts-ignore

    //   // const newTex = this._basisTextureLoader._createTexture(this.compressedTexture, this._ringBuffer.getFirst().frameNumber.toString())
    //   // const myMaterial = new MeshBasicMaterial()
    //   // myMaterial.map = newTex
    //   //@ts-ignore
    //   // this.mesh.material.map = newTex

    //   // Remove buffer
    //   // this._ringBuffer.remove(0);
    //   // console.log("Popped value", typeof poppedValue, this._ringBuffer.getPos());

    //   // console.log(
    //   //   'Recalled the frame ' + this._ringBuffer.getFirst().frameNumber
    //   // );
    // } else {
    //   // Frame doesn't exist in ring buffer, so throw an error
    //   console.warn(
    //     'Frame ' +
    //     this._ringBuffer.getFirst().frameNumber +
    //     ' did not exist in ring buffer'
    //   );
    // }

    setTimeout(() => {
      this.update();
    }, (1000 / this.frameRate) * this.speed);
  }

  play() {
    this._isPlaying = true;
    this.show();
    this.update();
  }

  pause() {
    this._isPlaying = false;
  }

  reset() {
    this._currentFrame = this._startFrame;
  }

  goToFrame(frame: number, play: boolean) {
    this._currentFrame = frame;
    this.handleBuffers();
    if (play) this.play();
  }

  setSpeed(multiplyScalar: number) {
    this.speed = multiplyScalar;
  }

  show() {
    this.mesh.visible = true;
  }

  hide() {
    this.mesh.visible = false;
    this.pause();
  }

  fadeIn(stepLength = 0.1, fadeTime: number, currentTime = 0) {
    if (!this._isPlaying) this.play();
    this.material.opacity = lerp(0, 1, currentTime / fadeTime);
    currentTime = currentTime + stepLength * fadeTime;
    if (currentTime >= fadeTime) {
      this.material.opacity = 1;
      return;
    }

    setTimeout(() => {
      this.fadeIn(fadeTime, currentTime);
    }, stepLength * fadeTime);
  }

  fadeOut(stepLength = 0.1, fadeTime: number, currentTime = 0) {
    this.material.opacity = lerp(1, 0, currentTime / fadeTime);
    currentTime = currentTime + stepLength * fadeTime;
    if (currentTime >= fadeTime) {
      this.material.opacity = 0;
      this.pause();
      return;
    }

    setTimeout(() => {
      this.fadeOut(fadeTime, currentTime);
    }, stepLength * fadeTime);
  }
}
