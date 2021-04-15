import ThreeMeshUI, { Block, Keyboard } from "../../assets/three-mesh-ui";
import { Group, Object3D, Color, TextureLoader, VideoTexture } from "three";

class SceneOverview extends Object3D {
	constructor(title, description, image){
		super();
	
		this.init(title, description, image);
	  }
	
	  init(title, description, image){
		const container = new ThreeMeshUI.Block({
		  width: 3.2,
		  height: 0.8
		});
	  
		container.position.set(0.1, 1.35, 0);
		this.add(container);
	
	
		
		const video = document.getElementById('video360') as HTMLVideoElement;

		console.log('video360', video);
		// video.play();
		// video.addEventListener( 'play', function () {

		// } );
		
		const texture = new VideoTexture( video );

		console.log('texture', texture);
		container.set({backgroundTexture: texture});

		const textBlock = new ThreeMeshUI.Block({
		  height: 0.1,
		  width: 0.9,
		  margin: 0.00,
		  padding: 0.00,
		  fontSize: 0.025,
		  alignContent: "left",
		  backgroundColor: new Color( 'red' ),
		  backgroundOpacity: 0.0,
	
		  fontFamily:
			"https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.json",
		  fontTexture:
			"https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.png"
		}).add(
		  new ThreeMeshUI.Text({
			content: title + '\n',
			fontSize: 0.05,
			// fontColor: new THREE.Color(0x96ffba)
		  }),  
		  new ThreeMeshUI.Text({
			content: description
		  })
		);
	
		textBlock.position.set(-0.95, 1.1, 0.04);
	
		this.add(textBlock);
	  }
}

export default SceneOverview;