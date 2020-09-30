import { LifecycleValue } from '../../common/enums/LifecycleValue';
import { Behavior } from '../../common/interfaces/Behavior';
import { BinaryType, NumericalType } from '../../common/types/NumericalTypes';
import { Entity } from '../../ecs/classes/Entity';
import { Input } from '../components/Input';
import { InputType } from '../enums/InputType';
import { InputValue } from '../interfaces/InputValue';
import { InputAlias } from '../types/InputAlias';
import { getMutableComponent } from '../../ecs/functions/EntityFunctions';
import { BinaryValue } from '../../common/enums/BinaryValue';
import { DefaultInput } from "../../templates/shared/DefaultInput";

/**
 * Call all behaviors associated with current input in it's current lifecycle phase
 * i.e. if the player has pressed some buttons that have added the value to the input queue,
 * call behaviors (move, jump, drive, etc) associated with that input
 * 
 * @param {Entity} entity The entity
 * @param args
 * @param {Number} delta Time since last frame
 */
export const handleInput: Behavior = (entity: Entity, args: {}, delta: number): void => {
  // Get immutable reference to Input and check if the button is defined -- ignore undefined buttons
  const input = getMutableComponent(entity, Input);
  
  // For each input currently on the input object:
  input.data.forEach((value: InputValue<NumericalType>, key: InputAlias) => {
    // If the input is a button
    if (value.type === InputType.BUTTON) {
      // If the input exists on the input map (otherwise ignore it)
      if (input.schema.inputButtonBehaviors[key]) {
        // If the button is pressed
        if(value.value === BinaryValue.ON) {
        // If the lifecycle hasn't been set or just started (so we don't keep spamming repeatedly)
        if (value.lifecycleState === undefined) value.lifecycleState = LifecycleValue.STARTED
        if(value.lifecycleState === LifecycleValue.STARTED) {
          // Set the value of the input to continued to debounce
          input.schema.inputButtonBehaviors[key].started?.forEach(element =>
            element.behavior(entity, element.args, delta)
          );
        } else if (value.lifecycleState === LifecycleValue.CONTINUED) {
          // If the lifecycle equal continued
          input.schema.inputButtonBehaviors[key].continued?.forEach(element =>
            element.behavior(entity, element.args, delta)
          );
        }
      } else {
        input.schema.inputButtonBehaviors[key].ended?.forEach(element =>
          element.behavior(entity, element.args, delta)
        );
        input.data.delete(key);
      }
      }
    }
    else if (
      value.type === InputType.ONEDIM ||
      value.type === InputType.TWODIM ||
      value.type === InputType.THREEDIM
    ) {
      if (input.schema.inputAxisBehaviors[key]) {
        // If lifecycle hasn't been set, init it
        if (value.lifecycleState === undefined) value.lifecycleState = LifecycleValue.STARTED
        if(value.lifecycleState === LifecycleValue.STARTED) {
          // Set the value to continued to debounce
          input.schema.inputAxisBehaviors[key].started?.forEach(element =>
            element.behavior(entity, element.args, delta)
          );
          input.prevData.set(key, value);
          // Evaluate if the number is the same as last time, send the delta 
        } else if(value.lifecycleState === LifecycleValue.CHANGED) {
          // If the value is different from last frame, update it
          if(input.prevData.has(key) && JSON.stringify(value.value) !== JSON.stringify(input.prevData.get(key).value)) {
            input.schema.inputAxisBehaviors[key].changed?.forEach(element => {
              element.behavior(entity, element.args, delta)
            });
            input.prevData.set(key, value);
          }
          // Otherwise, remove it from the frame
          else {
            input.schema.inputAxisBehaviors[key].unchanged?.forEach(element =>
              element.behavior(entity, element.args, delta)
            );
          }
        }
      }
    } else {
      console.error('handleInput called with an invalid input type');
    }
  });

  // store prevData
  input.prevData.clear();
  input.data.forEach((value: InputValue<NumericalType>, key: InputAlias) => {
    input.prevData.set(key, value);
  })

  // clean processed LifecycleValue.ENDED inputs
  input.data.forEach((value: InputValue<NumericalType>, key: InputAlias) => {
    if (value.type === InputType.BUTTON) {
      if (value.lifecycleState === LifecycleValue.ENDED) {
        input.data.delete(key)
      }
    }
    // else if (
    //   value.type === InputType.ONEDIM ||
    //   value.type === InputType.TWODIM ||
    //   value.type === InputType.THREEDIM
    // ) {
    //   // if (value.lifecycleState === LifecycleValue.UNCHANGED) {
    //   //   input.data.delete(key)
    //   // }
    // }
  })
};
