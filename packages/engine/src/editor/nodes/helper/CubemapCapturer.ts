import { WebGLCubeRenderTarget,ClampToEdgeWrapping, CubeCamera, DoubleSide, LinearFilter, Mesh, OrthographicCamera, PlaneBufferGeometry, RawShaderMaterial, RGBAFormat, Scene, UnsignedByteType, Vector3, WebGLRenderer, WebGLRenderTarget, Uniform, CubeTexture, PMREMGenerator, BackSide, MeshBasicMaterial, IcosahedronGeometry, Texture } from 'three';
import Renderer from '../../renderer/Renderer';

const vertexShader = `
	attribute vec3 position;
	attribute vec2 uv;

	uniform mat4 projectionMatrix;
	uniform mat4 modelViewMatrix;

	varying vec2 vUv;

	void main()  {

		vUv = vec2( 1.- uv.x, uv.y );
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

	}
`;

const fragmentShader = `
	precision mediump float;

	uniform samplerCube map;

	varying vec2 vUv;

	#define M_PI 3.1415926535897932384626433832795

	void main()  {

		vec2 uv = vUv;

		float longitude = uv.x * 2. * M_PI - M_PI + M_PI / 2.;
		float latitude = uv.y * M_PI;

		vec3 dir = vec3(
			- sin( longitude ) * sin( latitude ),
			cos( latitude ),
			- cos( longitude ) * sin( latitude )
		);
		normalize( dir );

		gl_FragColor = textureCube( map, dir );

	}
`;


export default class CubemapCapturer{
	
	width: number;
	height: number;
	renderer:WebGLRenderer;
	material: RawShaderMaterial;
	scene: Scene;
	quad: Mesh<PlaneBufferGeometry, RawShaderMaterial>;
	camera: OrthographicCamera;
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	cubeCamera: CubeCamera;
	cubeMapSize: any;
	renderTarget:WebGLCubeRenderTarget;
	cubeRenderTarget:CubeTexture;
	sceneToRender:Scene;
	downloadAfterCapture:boolean;
	
	constructor(renderer:WebGLRenderer,sceneToRender:Scene,resolution:number,downloadAfterCapture=false){
		this.width = resolution;
		this.height = resolution;
		this.sceneToRender=sceneToRender;
		this.renderer = renderer;
		this.downloadAfterCapture=downloadAfterCapture;
		
		this.material = new RawShaderMaterial( {
			uniforms:{
				map:new Uniform(new CubeTexture())
			},
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			side: DoubleSide,
			transparent: true
		} );
	
		this.scene = new Scene();
		this.quad = new Mesh(
			new PlaneBufferGeometry( 1, 1 ),
			this.material
		);
		this.scene.add( this.quad );
		this.camera = new OrthographicCamera( 1 / - 2, 1 / 2, 1 / 2, 1 / - 2, -10000, 10000 );
	
		this.canvas = document.createElement( 'canvas' );
		this.ctx = this.canvas.getContext( '2d' );
	
		this.cubeCamera = null;
		const gl = this.renderer.getContext();
		this.cubeMapSize = gl.getParameter( gl.MAX_CUBE_MAP_TEXTURE_SIZE )
		this.setSize(this.width,this.height );
		
	}

	setSize = function( width, height ) {

		this.width = width;
		this.height = height;
		this.quad.scale.set( this.width, this.height, 1 );
		this.camera.left = this.width / - 2;
		this.camera.right = this.width / 2;
		this.camera.top = this.height / 2;
		this.camera.bottom = this.height / - 2;
		this.camera.updateProjectionMatrix();
		this.renderTarget = new WebGLRenderTarget( this.width, this.height, {
			minFilter: LinearFilter,
			magFilter: LinearFilter,
			wrapS: ClampToEdgeWrapping,
			wrapT: ClampToEdgeWrapping,
			format: RGBAFormat,
			type: UnsignedByteType
		});
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.getCubeCamera(this.width);
	}


	getCubeCamera = function( size ) {

		const cubeMapSize = Math.min( this.cubeMapSize, size );
		this.cubeRenderTarget=new WebGLCubeRenderTarget( cubeMapSize, { format: RGBAFormat, magFilter: LinearFilter, minFilter: LinearFilter } );
		this.cubeCamera = new CubeCamera( .1, 1000,this.cubeRenderTarget);
		return this.cubeCamera;
	}

	convert = function(imageName:string ) {

		this.quad.material.uniforms.map.value = this.cubeCamera.renderTarget.texture;
		this.renderer.render( this.scene, this.camera, this.renderTarget, true );
		const pixels = new Uint8Array( 4 * this.width * this.height );
		this.renderer.readRenderTargetPixels( this.renderTarget, 0, 0, this.width, this.height, pixels );
		const imageData = new ImageData( new Uint8ClampedArray( pixels ), this.width, this.height );
		this.download( imageData,imageName );
		return imageData
	
	};


	download = function( imageData:ImageData,imageName:string ) {
		this.ctx.putImageData( imageData, 0, 0 );
	
		this.canvas.toBlob( ( blob ) => {
	
			const url = URL.createObjectURL(blob);
			const fileName = `${imageName}.png`;
			const anchor = document.createElement( 'a' );
			anchor.href = url;
			anchor.setAttribute("download", fileName);
			anchor.className = "download-js-link";
			anchor.innerHTML = "downloading...";
			anchor.style.display = "none";
			document.body.appendChild(anchor);
			setTimeout(() => {
				anchor.click();
				document.body.removeChild(anchor);
			}, 1 );
	
		}, 'image/png' );
	
	};


	update = function( position:Vector3,imageName="EnvMap") {

		const autoClear = this.renderer.autoClear;
		this.renderer.autoClear = true;
		this.cubeCamera.position.copy(position );
		this.cubeCamera.updateCubeMap( this.renderer, this.sceneToRender );
		this.renderer.autoClear = autoClear;
		this.downloadAfterCapture&&this.convert(imageName);
		return (this.cubeRenderTarget);
	}


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	 static convertEquiToCubemap = ( renderer:WebGLRenderer,source:Texture, size:number )=> {

		const convertScene = new Scene();
	
		const gl = renderer.getContext();
		const maxSize = gl.getParameter( gl.MAX_CUBE_MAP_TEXTURE_SIZE )
	
	
		const material = new MeshBasicMaterial( {
			map: null,
			side: BackSide
		} );
	
		const mesh = new Mesh(
			new IcosahedronGeometry( 100, 4 ),
			material
		);
		convertScene.add( mesh );



		const mapSize = Math.min( size, maxSize );
		const cubeRenderTarget:WebGLCubeRenderTarget=new WebGLCubeRenderTarget(mapSize);
		const cubecam = new CubeCamera( 1, 100000, cubeRenderTarget );
		material.map = source;
		cubecam.update(renderer,convertScene);
		return cubeRenderTarget;
	
	}
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


}
