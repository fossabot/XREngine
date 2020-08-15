# Armada
A data driven game engine for WebGL, building on Mozilla ECSY using a behavior-oriented ECS pattern to emphasize modularity.

## Quickstart
```
git clone https://github.com/xr3ngine/armada
cd armada
npm install
cp .env.https .env

// This will build the library and examples, and launch a server on https://localhost:8080
// NOTE: ONLY works with HTTPS right now, http://localhost:8080 will not work
npm run dev

// To run the server, open another terminal window and run
npm run dev-server
```

### What is a behavior?
A behavior is nothing more than a function that follows a specific interface.
The interface for a behavior looks like this
```typescript
interface Behavior {
  (entity: Entity, args?: any, delta?: number, entityOut?: Entity, time?: number): void
}
```
### What does a behavior look like?
A behavior that follows this interface looks like this:
```typescript
const handleMouseMovement: Behavior = (entity: Entity, args: { event: MouseEvent }): void => {
  input = getComponent(entity, Input) as Input
  _value[0] = (args.event.clientX / window.innerWidth) * 2 - 1
  _value[1] = (args.event.clientY / window.innerHeight) * -2 + 1
  // Set type to TWOD (two-dimensional axis) and value to a normalized -1, 1 on X and Y
  input.data.set(input.schema.mouseInputMap.axes["mousePosition"], {
    type: InputType.TWOD,
    value: _value
  })
}
```

### Neat, but why?
ECS is an architectural pattern that can be theoretically applied to to any programming paradigm. In ECSY, we construct components and systems from ES6 classes, which means we are largely following object oriented paradigms. ECSY becomes the framework to drive our game logic, and ECS becomes the pattern we follow to ensure that we get the ideal properties of of ECS. We are still constructing objects as normal, but we are enforcing strict rules about code separation and code execution. While ECS was created for performance benefit that we largely don't see in a high level language with managed memory, the ECS pattern helps enforce code modularity, separation of concern and inversion of control. ECS also makes object pooling easy to implement, and ECSY's object pooling should provide meaningful performance benefit for many applications.

A behavior is just a function, and almost always a function that transforms data on a component or between components on an entity. For example, the move() behavior, called when movement input occurs, transforms the velocity on the transform component, which later gets applied as a transformation to position.

We see "behaviors" as just another tool in the ECS toolkit, along with other patterns such as aprefabs and archetypes. However, in order to use behaviors effectively, aw little bit of mind-bending on how ECS should is required.

Most ECS code bases have systems that contain declarative game logic operating directly on components. Because the complexity of this logic becomes quite large and scripts become too long to manage, most people break up a single system (for example, "state", or "input") into numerous systems (for example, "AnimationState" and "PlayerState", or "MobileInput" and "DesktopInput"). For simple applications this is fine, but in production many apps following this pattern end up with hundreds of systems and components.  The point of the system is to make sure that all execution within a specific domain at specific times. When we separate the logic out of one closed system into several systems, we introduce expounding system complexity, code duplication, race conditions and over-querying.

## Systems, with regard to behaviors
Systems in Armada hold no game logic. Instead, systems are fundamentally concerned with ordering and execution of game logic, most of which can be expressed as a data transformation.
Behaviors contain all of the game logic. In this way a user can completely modify and build their own application from Armada by building and mapping behaviors. While Armada is compatible with other ECS systems and components built in the "classic" fashion, we hope to encapsulate nearly every common system and offer generalized systems like Subscriptions to allow for most use cases.

**The takeaway here is this:**
1. One system should be in charge the entire concern -- input system, physics system, networking system, etc.
2. Systems are concerned with the order and execution of behaviors
3. Behaviors are functions that transform data on components attached to entities

### How do systems process behaviors?
Let's take a look at the input system to see what's going on. To simplify, we'll just pick out the part that cares about button input:

```typescript
// this is called in execute() every frame
    this.queries.inputs.results.forEach(entity => handleInput(entity, args: { delta }))

// where the magic happens
export const handleInput: Behavior = (entity: Entity, delta: number): void => {
  getComponent(entity, Input).data.forEach((value: InputValue<NumericalType>, key: InputAlias) => {
    // If the input is a button
    if (value.type === InputType.BUTTON) { 
    // If the input exists on the input map (otherwise ignore it)
      if (input.schema.inputButtonBehaviors[key] && input.schema.inputButtonBehaviors[key][value.value as number]) { 
        // If the lifecycle hasn't been set or just started (so we don't keep spamming repeatedly)
        if (value.lifecycleState === undefined || value.lifecycleState === LifecycleValue.STARTED) {
          // Set the value of the input to continued to debounce
          input.data.set(key, {
            type: value.type,
            value: value.value as Binary,
            lifecycleState: LifecycleValue.CONTINUED
          })
          // Call the behavior with args
          input.schema.inputButtonBehaviors[key][value.value as number].behavior(
            entity,
            input.schema.inputButtonBehaviors[key][value.value as number].args,
            delta
          )
        }
      }
    }
      // More code for axes, etc...
  }
}
```
Note that when an Input component is added to an entity, we bind a DOM event to that InputComponent (so a user could theoretically control multiple inputs), and we unbind when the component is destroyed. The code for that is also in the system:

```typescript
      // Bind DOM events to event behavior
      Object.keys(this._inputComponent.schema.eventBindings)?.forEach((key: string) => {
        document.addEventListener(key, e => {
          this._inputComponent.schema.eventBindings[key].behavior(entity, { event: e, ...this._inputComponent.schema.eventBindings[key].args })
        })
```

#### How did our system know to bind an DOM event (key press, mouse move, button push, etc) to a specific behavior?
When we construct our Input component, we pass an InputSchema to it which contains everything the system needs to know about how to respond to input. This input schema follows an interface, which you can find at **src/input/interfaces/InputSchema**. You can construct your own input schema, and we advise using the DefaultInputSchema template as a guide (found in **src/input/defaults/DefaultInputSchema**)

Here are the event bindings from DefaultInputSchema that tell the InputSystem how to bind the DOM event to the behavior:
```typescript
  eventBindings: {
    // Keys
    ["keyup"]: {
      behavior: handleKey,
      args: {
        value: BinaryValue.OFF
      }
    },
    ["keydown"]: {
      behavior: handleKey,
      args: {
        value: BinaryValue.ON
      }
    }
  }
```
The handleKey behavior does what it says on the box. You can find the source code at **src/input/DesktopInputBehaviors**.

## Behavior Components
The behavior pattern has a matching component pattern which accepts a schema and a data map. The schema 

## How to add a new behavior
A behavior is just a function that implements the Behavior interface. You can find the Behavior interface itself at **src/common/interfaces/Behavior**.

Let's make a behavior.
```typescript
export const myBehavior: Behavior = (entity: Entity, args: { myArgs }): void => {
  const myComponent = getComponent(entity, MyComponent)
  myComponent.value = myArgs.someArg
}
```
That's really all there is to the behavior part. Now we can add it do a schema. As each behavior-oriented system has it's own schema, you should consult the interface as well as the default implementations for each type.
Again, we will focus on the input system, and bind an event:
```typescript
  eventBindings: {
    // DOM event triggers when right-click is pressed or long-press to open contextual menu
    ["contextmenu"]: {
      behavior: myBehavior
      // args are optional, if we wanted this behavior to be reusable we can pass an arg
      args: "contextmenu"
    }
  }
```
So every time someone tries to open the context menu on your site (i.e. right-click) your behavior is triggered.
This same pattern can be extended to states, network messages, subscriptions (which we'll get to in a minute) and potentially even fireworks and cars.

### Singleton Behaviors
A SingletonBehavior can be constructed that maps data from one entity to others, but this is rare -- in this case the behavior interface accepts an entityIn and entityOut. See the argument overloads to the Behavior interface. More often, though, you'll set your singleton components to be accessible globally so you only need to worry about the entityIn argument as the entity which the data transformation is being applied to.

### Note: Schema are Mutable
One of the benefits of using a schema system is that the values are not hardcoded, so you can easily remap the values. This enables flexibility such as allowing a user to redefine their input map and bind a key to another action. You can add behaviors to your schema or modify the mappings after initialization.

## Subscriptions
Subscriptions are a way to add behaviors to the execution lifecycle that don't fit into any specific domain other than general game logic. In Unity, this would be almost anything that goes into the Start(), Update(), LateUpdate(), Destroy(), etc lifecycle function calls. In Unreal, this is similar to ticks and tick groups. In Aframe, this is .init(), .update().
Subscriptions allow behaviors to "subscribe" to the world simulation to execute either forever or for a short period. The SubscriptionSystem publishes events to all subscribers. A good example of a subscription that executes forever is the decelerate() behavior on the default player, which reduces the character's velocity if there is no input and nonzero velocity.

### How to add a subscription
Subscriptions follow the same pattern as Input above, in that they are initialized with a schema, and execute according to the schema. Subscription schema can be altered at runtime, but it is more likely that you want to use the **state** system.

First, let's get an overview of the subscription system:
```typescript
public execute(delta: number, time: number): void {
    this.queries.subscriptions.added?.forEach(entity => {
      this.callBehaviorsForHook(entity, { phase: "onAdded", delta })
    })

    this.queries.subscriptions.changed?.forEach(entity => {
      this.callBehaviorsForHook(entity, { phase: "onChanged", delta })
    })

    this.queries.subscriptions.results?.forEach(entity => {
      this.callBehaviorsForHook(entity, { phase: "onUpdate", delta })
    })

    this.queries.subscriptions.results?.forEach(entity => {
          this.callBehaviorsForHook(entity, { phase: "onLateUpdate", delta })
    })

    this.queries.subscriptions.removed?.forEach(entity => {
      this.callBehaviorsForHook(entity, { phase: "onRemoved", delta })
    })
  }
  ```
The system looks for any behaviors mapped to these "phases" and executes them when appropriate. Note that onLateUpdate is called immediately after onUpdate-- use the LateUpdate wisely and sparingly to avoid race conditions.

callBehaviorsForHook is also a behavior:
```typescript
  callBehaviorsForHook: Behavior = (entity: Entity, args: { phase: string; }, delta: number) => {
    this.subscription = getComponent(entity, Subscription)
    // If the schema for this subscription component has any values in this phase
    if (this.subscription.schema[args.phase] !== undefined) {
      // Foreach value in this phase
      this.subscription.schema[args.phase].forEach((value: BehaviorArgValue) => {
        // Call the behavior with the args supplied in the schema, as well as delta provided here
        value.behavior(entity, value.args ? value.args : null, delta)
      })
    }
  }
```

The SubscriptionSchema interface is slightly different than the InputSchema interface but follows the same pattern. Here's a snippet from **src/subscriptions/defaults/DefaultSubscriptionSchema**
```typescript
export const DefaultSubscriptionSchema: SubscriptionSchema = {
  onUpdate: [
    {
      behavior: updatePosition
    }
  ]
}
```

### So where's the movement system?
Well, that's it right there, above. updatePosition() is a behavior that looks at the current velocity and changes the position in the entity's TransformComponent. Input is changing acceleration and velocity, so the subscription system just makes sure that the Transform component is updated at the end.

Each entity can have their own schema. A static building could have a subscription to checkIfPlayerIsInDoorway(), perhaps, but probably wouldn't have an updatePosition() behavior.

### State and State Groups
A lot of things in games and spatial applications can be represented by **state**. The concept for BECS came from trying to tackle some of the issues that many ECS systems have with managing state, especially grouped and overlapping states. The idea of using a schema to map transformation data is borrowed from the idea of State Tables and State Diagrams.

States define what something currently is. For example, the character could be jumping -- in which case you are likely to find the "jumping" state attached to the actor. Concretely, there is a jump() behavior mapped to the DefaultStateSchema.
```typescript
const jump: Behavior = (entity: Entity): void => {
  // Add the state to the entity (addState is also a behavior)
  addState(entity, { state: DefaultStateTypes.JUMPING })
  actor = getMutableComponent(entity, Actor)
  // Set actor's jump time to 0 -- jump will end when t increments to jump length
  actor.jump.t = 0
}
```
This function adds a state to the State component's .data field. States can trigger a behavior on entry or exit -- these are knows as "transitions" in finite state machine design. States can also execute logic every frame while active. We control this just like input and subscriptions, by defining our mapping on the StateSchema and initialization our State component with it.
Concretely, this is what the jumping state mapping in the DefaultStateSchema looks like:
```typescript
    [DefaultStateTypes.JUMPING]: { group: DefaultStateGroups.MOVEMENT_MODIFIERS, onUpdate: { behavior: jumpingBehavior } },
```
Jumping doesn't currently have entry or exit transitions, but does perform the jumping behavior every time the State system executes.
The jumping state is removed by the jumping behavior when the actor's jump time exceeds the jump duration. In a more complex scenario, the user's jumping state might get removed by landing back on ground or transitioning to another state, otherwise the jumping state would transition into falling. In this case, however, when jumping is over, we remove the state.
```typescript
export const jumping: Behavior = (entity: Entity, args, delta: number): void => {
  transform = getComponent(entity, TransformComponent)
  actor = getMutableComponent(entity, Actor)
  actor.jump.t += delta
  if (actor.jump.t < actor.jump.duration) {
    transform.velocity[1] = transform.velocity[1] + Math.cos((actor.jump.t / actor.jump.duration) * Math.PI)
    console.log("Jumping: " + actor.jump.t)
    return
  }
  removeState(entity, { state: DefaultStateTypes.JUMPING })
  console.log("Jumped")
}
```

### State Groups
Typically you will want to group states together as they are related, transition into each other and are often mutually exclusive. For example, you will want to know that if your character jumps, the crouching state will be overriden and removed until the character stops jumping (unless you're making a crouch jump game, more power to you!) By defining state groups, we can relate states to each other.
You can find the interface that defines state groups in the StateSchema at **src/state/defaults/interfaces/DefaultStateSchema**
```typescript
  groups: {
    [DefaultStateGroups.MOVEMENT]: {
      exclusive: true,
      default: DefaultStateTypes.IDLE,
      states: [DefaultStateTypes.IDLE, DefaultStateTypes.MOVING]
    },
    [DefaultStateGroups.MOVEMENT_MODIFIERS]: {
      exclusive: true,
      states: [DefaultStateTypes.CROUCHING, DefaultStateTypes.SPRINTING, DefaultStateTypes.JUMPING]
    }
  },
  ...
  ```
The DefaultStateSchema defines two groups, MOVEMENT and MOVEMENT_MODIFIERS. Both are exclusive, so any time a state is added it will transition over the existing state unless blocked. For example:
```typescript
  states: {
...
    [DefaultStateTypes.JUMPING]: { group: DefaultStateGroups.MOVEMENT_MODIFIERS, onUpdate: { behavior: jumpingBehavior } },
    [DefaultStateTypes.CROUCHING]: { group: DefaultStateGroups.MOVEMENT_MODIFIERS, blockedBy: DefaultStateTypes.JUMPING },
...  }
  ```
In the DefaultStateSchema example, CROUCHING is **blockedBy** JUMPING, so the character can't crouch mid-air.
The job of the state system is to ensure that these rules are respected and that changes in state have the appropriate side effects on other states.

#### So what's the difference between State and Subscriptions?
Subscriptions are typically not added to and removed from, and operate more like standard lifecycle events in other game engines. Subscriptions don't have a queue (.data), so to manipulate them you need to change the schema, which is acceptable but not often necessary. States are always changing, and can be added and removed from the State component often through the queue available at State.data, while the StateSchema is unlikely to be altered much after initialization (dynamic state machines are possible if you want to go full automata!)

### How to add a state and state group
Let's say we wanted to make a hunger system for our a monster in our game that the player must feed. So we will define a state group
```typescript
const StateGroups = {
  HUNGER: 0 // value should be unique but can be anything, numbers are easy to send over the network
}
```
Now we will define a StateSchema
```typescript
const MyStateSchema: StateSchema = {
  groups: {
    [StateGroups.HUNGER]: {
      exclusive: true,
      default: "FULL",
      states: ["FULL", "HUNGRY", "STARVING" ]
    },
  },
  states: {
    ["FULL"]: { group: StateGroups.HUNGER, onUpdate: { behavior: hungerBehavior, args: { type: "FULL" } } },
    ["HUNGRY"]: { group: StateGroups.HUNGER, onUpdate: { behavior: hungerBehavior, args: { type: "HUNGRY" } } },
    ["STARVING"]: { group: StateGroups.HUNGER, onUpdate: { behavior: hungerBehavior, args: { type: "STARVING"} } },
  }
}

```
The states are mutually exclusive, and while they all execute the same behavior, they pass a different argument. We can assume the hungerBehavior decreases some "fullness" value on a component, and issues different warnings to the player based on the current type.
You can then use this state elsewhere, for example you could program your movement behavior to check if the entity is hungry and slow movement speed on "hungry" or "starving".

#### Other systems can map to state
Behaviors allow us to make data transformations on a component, or between components. For example, when we press the "w" key, that issues the action "forward", which adds the state "moving" and removes the "idle" state if it's currently in the state queue.


## So what system should I put something in?
If the player presses, touches, shakes or rotates something with their head, this should be managed by the InputSystem.
If you want something to happen every frame when a component is attached, consider adding it as a **Subscription**.
If you want something to happen when ____ is _____, that should probably be framed as a State, especially if it interacts or transitions to other states.

### What if I wanted to do a "classic" system and integrate Armada?
Yes! Great! Each system in Armada has it's own initialization call, so you can add your own systems and order them however you like. Mix and match!

!!!! How networking works
!!!! Unreliable vs reliable messaging

#### Defaults are overridable
All of the defaults have been provided so that the library works out of the box, and to give you an example of best practice. However, every default is designed to be overriden. Create your own defaults and pass them in when you construct your Behavior Components.

#### You can have multiple of each schema type
Consider making one schema for each type of entity you plan on creating. All of the monsters in your game can probably be constructed from a shared schema. Schema are passed by reference, so if you alter the schema on a component make sure that it's not being referenced by other components, or be prepared to handle the side effects.

#### On singleton components - a design note
Some systems -- for example, the network system -- use a singleton component to store data. Singleton components can be initialized by the system they are attached to, and should set a static reference to themselves on creation so that they are accessible everywhere without a getComponent query.
You can store data, especially temp variables, on systems, if they rarely change, are only changed onAdded/onRemoved, and typically are a singleton. It is always better to query for all of the entities that match the component pattern over keeping and updating a list on the system.

### Networking
Networking is currently under development. Our default Transport uses socket.io and Mediasoup acting as an SFU to handing voice and video, as well as unreliable messaging over data channels.

## TODO:
We haven't finished these parts:
Prefab definition and creation
Switching from player to car
!!!! Adding a message type
!!!! Sending a message
!!!! Linking message type to behavior map

# Installation
```
npm install @xr3ngine/armada
```

# How to use
```javascript
import { World } from '../ecs/classes/World'
import { initializeInput } from '@xr3ngine/armada'

const world = new World()

const options = {
  debug: true
}

initializeInput(world, options)

world.execute()
```

You can override the input mappings per device
Input mappings map device input to abstract, cross-platform input

```javascript
      import { initializeInputSystems } from "../dist/armada.module.js"

      const Input = {
        SCREENXY: 0
      }

      const Actions = {
        PRIMARY: 0,
        SECONDARY: 0,
        FORWARD: 2,
        BACKWARD: 3,
        LEFT: 6,
        RIGHT: 7
      }

      const inputSchema = {
        mouse: {
          input: {
            0: Actions.PRIMARY
          },
          input: {
            mousePosition: Input.SCREENXY
          }
        },
        keyboard: {
          input: {
            w: Actions.FORWARD,
            a: Actions.LEFT,
            s: Actions.RIGHT,
            d: Actions.BACKWARD
          }
        },
        actionMap: {
          [Actions.FORWARD]: { opposes: [Actions.BACKWARD] },
          [Actions.BACKWARD]: { opposes: [Actions.FORWARD] },
          [Actions.LEFT]: { opposes: [Actions.RIGHT] },
          [Actions.RIGHT]: { opposes: [Actions.LEFT] }
        }
      }

      // Test input
      const inputOptions = {
        mouse: true,
        keyboard: true,
        touchscreen: true,
        gamepad: true,
        debug: true
      }

      const world = new World()
      initializeInputSystems(world, inputOptions, inputSchema)
```

# To Build
```
npm run build
```
This will open up the rollup dev server on port 10001
You can see input in the console

# Troubleshooting
## Errors on npm install
### ‘MSBuild’ is not recognized as an internal or external command, operable program or batch file (on mediasoup installation) and MSB5011: Parent project GUID not found in "mediasoup-worker" project dependency section.
One of our dependencies requires Python2 and Visual Studio >= 2015 for installation (build of worker binaries) 
```
node version >= v8.6.0
python version 2
python version 3 will be supported once GYP project fixes this issue
Visual Studio >= 2015
```
Append the path of MSBuild.exe folder to the Windows PATH environment variable (e.g. `“C:\Program Files (x86)\MSBuild\14.0\Bin”`).
Create a new Windows environment variable `GYP_MSVS_VERSION` with the version of Visual Studio as value (e.g. “2017” for Visual Studio 2017).

More recent instructions could be here: https://mediasoup.org/documentation/v3/mediasoup/installation/#windows

## Build - Bad character escape sequence (utf-8-validate)
add `"utf-8-validate"` to externals in server section in file `rollup.config.js`
## Run dev-server - path.resolve is not a function
add `"path"` to externals in server section in file `rollup.config.js`
and rebuild server