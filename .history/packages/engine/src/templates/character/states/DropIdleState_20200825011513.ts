import { StateSchemaValue } from '../../interfaces/StateSchema';
import { initializeCharacterState, updateCharacterState } from '../../../actor/classes/characters/character_states/CharacterStateBase';
import { CharacterComponent } from '../../../actor/components/CharacterComponent';
import { DefaultStateGroups, setCharacterAnimation, checkFalling } from '../CharacterStateSchema';
import { setArcadeVelocityInfluence } from '../../../character/behaviors/CharacterMovementBehaviors';
// Idle Behavior

export const DropIdleState: StateSchemaValue = {
  group: DefaultStateGroups.MOVEMENT,
  componentProperties: {
    component: CharacterComponent,
    properties: {
      ['timer']: 0,
      ['velocitySimulator.damping']: 0.5,
      ['velocitySimulator.mass']: 7,
      ['velocityTarget']: { x: 0, y: 0, z: 0 },
      ['canFindVehiclesToEnter']: true,
      ['canEnterVehicles']: false,
      ['canLeaveVehicles']: true
    }
  },
  onEntry: [
    {
      behavior: initializeCharacterState
    },
    { 
      behavior: setArcadeVelocityInfluence,
      args: {
        x: 1, y: 0, z: 1
      }
    },
    {
      behavior: setCharacterAnimation,
      args: {
        name: 'drop_idle',
        transitionDuration: 0.1
      }
    }
  ],
  onUpdate: [{ behavior: updateCharacterState }, { behavior: checkFalling }]
};

export const initializeCharacterState: Behavior = (entity) => {

}