// Default component, holds data about what behaviors our actor has.
import { Types } from '../../../ecs/types/Types';
import { Component } from '../../../ecs/classes/Component';
import { Vector3, Group, Material, AnimationMixer, Mesh, BoxBufferGeometry, AnimationAction } from 'three';
import { CapsuleCollider } from '../../../physics/components/CapsuleCollider';
import { VectorSpringSimulator } from '../../../physics/classes/VectorSpringSimulator';
import { RelativeSpringSimulator } from '../../../physics/classes/SpringSimulator';
import { RaycastResult, Vec3 } from 'cannon-es';

// idle|   idle  +  walk     |    walk      |    walk + run     |   run
// 0   | > WALK_START_SPEED  | > WALK_SPEED | > RUN_START_SPEED | > RUN_SPEED
export const WALK_SPEED = 1.2;
export const RUN_SPEED = 2.4;

export class CharacterComponent extends Component<CharacterComponent> {

	dispose(): void {
    super.dispose();
		this.modelContainer.parent.remove(this.modelContainer);
    this.tiltContainer = null;
  }

  public movementEnabled: boolean = false;
	public initialized = false;

// TODO: Move these... but for now...
	public currentAnimationAction: AnimationAction[] = [];
	public currentAnimationLength = 0;
	public timer = 0;
	public animationsTimeScale = .5;
  public avatarId:string;
  public avatarURL: string;
	public height = 0;
	public tiltContainer: Group;
	public modelContainer: Group;
	public materials: Material[] = [];
  public visible = true;
	public mixer: AnimationMixer;
	public animations: any[]  = [];

  // TODO: Remove integrate this
  public physicsEnabled = true
	// Movement
	/**
	 * desired moving direction from user inputs
	 */
	public localMovementDirection = new Vector3();
	public acceleration: Vector3 = new Vector3();
	/**
	 * this needs to be multiplied by moveSpeed to get real speed;
	 * probably does not represent real physics speed
	 */
	public velocity: Vector3 = new Vector3();
	public arcadeVelocityInfluence: Vector3 = new Vector3();
	public velocityTarget: Vector3 = new Vector3();
	public arcadeVelocityIsAdditive: boolean;

	public currentInputHash: any = ""

	public defaultVelocitySimulatorDamping = 0.8;
	public defaultVelocitySimulatorMass = 50;
	public velocitySimulator: VectorSpringSimulator
	public animationVectorSimulator: VectorSpringSimulator
	public moveVectorSmooth: VectorSpringSimulator
	public moveSpeed = RUN_SPEED;
	public otherPlayerMaxSpeedCount = 0;
	public angularVelocity = 0;
	public orientation: Vector3 = new Vector3(0, 0, 1);
	public orientationTarget: Vector3 = new Vector3(0, 0, 1);
	public defaultRotationSimulatorDamping = 0.5;
	public defaultRotationSimulatorMass = 10;
	public rotationSimulator: RelativeSpringSimulator;
	public viewVector: Vector3;
	public changedViewAngle = 0;
	public actions: any;
	public actorCapsule: CapsuleCollider;

	// Actor collision Capsule
	public actorMass = 1;
	public actorHeight = 1;
	public capsuleRadius = 0.25;
	public capsuleSegments = 8;
	public capsuleFriction = 0.1;
	public capsulePosition: Vec3 = new Vec3();
	// Ray casting
	public rayResult: RaycastResult = new RaycastResult();
	public rayDontStuckX: RaycastResult = new RaycastResult();
	public rayDontStuckZ: RaycastResult = new RaycastResult();
	public rayDontStuckXm: RaycastResult = new RaycastResult();
	public rayDontStuckZm: RaycastResult = new RaycastResult();
	public rayHasHit = false;
	public rayGroundHit = false;
	public rayGroundY = null;
	public rayCastLength = 0.85; // depends on the height of the actor
	public raySafeOffset = 0.03;
	public wantsToJump = false;
	public initJumpSpeed = -1;
	public playerInPortal = 0;
	public animationVelocity: Vector3 = new Vector3();
	public groundImpactVelocity: Vector3 = new Vector3();

	public controlledObject: any;

	public raycastBox: Mesh;
  public vehicleEntryInstance: any;
  public occupyingSeat: any;
  quaternion: any;
	canFindVehiclesToEnter: boolean;
	canEnterVehicles: boolean;
	canLeaveVehicles: boolean;
  alreadyJumped: boolean;
	rotationSpeed: any;
}

CharacterComponent._schema = {
	tiltContainer: { type: Types.Ref, default: null },
};
