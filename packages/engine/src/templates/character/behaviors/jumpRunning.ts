import { CharacterComponent } from "../components/CharacterComponent";
import { TransformComponent } from "../../../transform/components/TransformComponent";
import { Behavior } from "../../../common/interfaces/Behavior";
import { Entity } from "../../../ecs/classes/Entity";
import { getMutableComponent, getComponent } from "../../../ecs/functions/EntityFunctions";
import { setCameraRelativeOrientationTarget } from "./setCameraRelativeOrientationTarget";
import { setTargetVelocityIfMoving } from "./setTargetVelocityIfMoving";
import { checkIfDropped } from "./checkIfDropped";
import { onAnimationEnded } from "./onAnimationEnded";
import { FallingState } from "../states/FallingState";
import { jumpStart } from "./jumpStart";

export const jumpRunning: Behavior = (entity: Entity, args: null, delta: any): void => {
	const transform = getComponent<TransformComponent>(entity, TransformComponent);
	const actor = getMutableComponent<CharacterComponent>(entity, CharacterComponent as any);

	setCameraRelativeOrientationTarget(entity);

	// Move in air
	if (actor.alreadyJumped) {
		setTargetVelocityIfMoving(entity, { ifTrue: { x: 0.8, y: 0.8, z: 0.8 }, ifFalse: { x: 0, y: 0, z: 0 } });
	}

	// Physically jump
	if (actor.timer > 0.13 && !actor.alreadyJumped) {
		jumpStart(entity, { initJumpSpeed: 4 });
		actor.alreadyJumped = true;
		actor.rotationSimulator.damping = 0.3;
		actor.arcadeVelocityIsAdditive = true;
		actor.arcadeVelocityInfluence.set(0.5, 0, 0.5);

	}
	else if (actor.timer > 0.24) {
		checkIfDropped(entity, null, delta);
	}
	else
		onAnimationEnded(entity, { transitionToState: FallingState }, delta);

};
