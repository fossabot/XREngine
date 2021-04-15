import ThreeMeshUI, { Block, Keyboard } from "../../assets/three-mesh-ui";
import { Group, Object3D, Color } from "three";

class SceneButton extends Object3D {
	constructor(title, index) {
		super();	
		this.init(title, index);
	  }
	
	  init(title, index){
		let pos = [0, 0, 0];
		
		switch ( index ) {
			case 0:
				pos = [-0.5, 1.85, 0];
				break;
			case 1:
				pos = [-0.05, 1.85, 0];
				break;
			case 2:
				pos = [1, 2, 0];
				break;
		}
	
		this.textBlock = new ThreeMeshUI.Block({
		  height: 0.1,
		  width: 0.4,
		  margin: 0,
		  padding: 0.03,
		  fontSize: 0.025,
		  alignContent: "center",
		  backgroundColor: new Color( 'blue' ),
		  backgroundOpacity: 1.0,
	
		  fontFamily:
			"https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.json",
		  fontTexture:
			"https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.png"
		}).add(
		  new ThreeMeshUI.Text({
			content: title,
			fontSize: 0.05,
			// fontColor: new THREE.Color(0x96ffba)
		  })
		);
	
		this.textBlock.position.set(pos[0], pos[1], pos[2]);
	

		this.add(this.textBlock);


		const hoveredStateAttributes = {
			state: "hovered",
			attributes: {
				offset: 0.035,
				backgroundColor: new Color( 0x999999 ),
				backgroundOpacity: 1,
				fontColor: new Color( 0xffffff )
			},
		};
	
		const idleStateAttributes = {
			state: "idle",
			attributes: {
				offset: 0.035,
				backgroundColor: new Color( 0x666666 ),
				backgroundOpacity: 0.3,
				fontColor: new Color( 0xffffff )
			},
		};

		const selectStateAttributes = {
			state: "selected",
			attributes: {
				offset: 0.02,
				backgroundColor: new Color( 0x777777 ),
				fontColor: new Color( 0x222222 )
			},
			onSet: ()=> {
				console.log('seleteced');
			}
		};

		this.textBlock.setupState(hoveredStateAttributes);
		this.textBlock.setupState(idleStateAttributes);
		this.textBlock.setupState(selectStateAttributes);
	  }

	picked(state){
		if ( state ) {
			// Component.setState internally call component.set with the options you defined in component.setupState
			this.textBlock.setState( 'selected' );
		} else {
			// Component.setState internally call component.set with the options you defined in component.setupState
			this.textBlock.setState( 'hovered' );
		}
	}

	unpick(){
		this.textBlock.setState( 'idle' );
	}
}

export default SceneButton;