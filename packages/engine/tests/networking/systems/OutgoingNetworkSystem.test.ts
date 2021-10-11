import { initializeEngine, shutdownEngine } from '../../../src/initializeEngine'
import { Engine } from '../../../src/ecs/classes/Engine'
import { engineTestSetup } from '../../util/setupEngine'
import assert, { strictEqual } from 'assert'
import { Network } from '../../../src/networking/classes/Network'
import OutgoingNetworkSystem, { forwardIncomingActionsFromOthersIfHost, queueAllOutgoingPoses, rerouteActions } from '../../../src/networking/systems/OutgoingNetworkSystem'
import { createWorld, World } from '../../../src/ecs/classes/World'
import { Action, ActionRecipients } from '../../../src/networking/interfaces/Action'
import { UserId } from '@xrengine/common/src/interfaces/UserId'
import { NetworkWorldAction } from '../../../src/networking/functions/NetworkWorldAction'
import matches from 'ts-matches'
import { TestNetworkTransport } from '../TestNetworkTransport'
import { WorldStateModel } from '../../../src/networking/schema/networkSchema'
import { createEntity } from '../../../src/ecs/functions/EntityFunctions'
import { addComponent } from '../../../src/ecs/functions/ComponentFunctions'
import { TransformComponent } from '../../../src/transform/components/TransformComponent'
import { Quaternion, Vector3 } from 'three'
import { VelocityComponent } from '../../../src/physics/components/VelocityComponent'
import { NetworkObjectComponent } from '../../../src/networking/components/NetworkObjectComponent'
import { NetworkId } from '@xrengine/common/src/interfaces/NetworkId'
import { TestNetwork } from '../TestNetwork'

describe('OutgoingNetworkSystem Unit Tests', () => {

  describe('forwardIncomingActionsFromOthersIfHost', () => {
  
    it('should forward incoming actions if the action is from a remote userId', () => {
      /* mock */
      const world = createWorld()

      // make this engine user the host
      // world.isHosting === true
      Engine.userId = world.hostId

      const action = NetworkWorldAction.spawnObject({
        userId: '0' as UserId,
        prefab: '',
        parameters: {},
        $tick: 0,
        // make action come from another user
        $from: '2' as UserId,
        // being sent to this server
        $to: 'server' as ActionRecipients,
      })
      
      world.incomingActions.add(action)

      /* run */
      forwardIncomingActionsFromOthersIfHost(world)

      /* assert */
      // verify incoming action was removed from incomingActions
      strictEqual(world.incomingActions.has(action), false)
      // and added to outgoingActions
      strictEqual(world.outgoingActions.has(action), true)
    })

    it('should clear incomingActions if hosting', () => {
      /* mock */
      const world = createWorld()

      // make this engine user the host
      // world.isHosting === true
      Engine.userId = world.hostId

      const action = NetworkWorldAction.spawnObject({
        userId: '2' as UserId,
        prefab: '',
        parameters: {},
        $tick: 0,
        // make action come from another user
        $from: '2' as UserId,
        // being sent to this server
        $to: 'server' as ActionRecipients,
      })
      
      world.incomingActions.add(action)

      /* run */
      forwardIncomingActionsFromOthersIfHost(world)

      /* assert */

      // verify incomingActions are cleared if we ARE a host
      strictEqual(world.incomingActions.size, 0)
    })

    it('should clear incomingActions if not hosting', () => {
      /* mock */
      const world = createWorld()

      // this engine user is not the host
      // world.isHosting === false
      Engine.userId = '0' as UserId

      const tick = 0

      world.fixedTick = tick

      const action = NetworkWorldAction.spawnObject({
        userId: '2' as UserId,
        prefab: '',
        parameters: {},
        $tick: tick,
        // make action come from another user
        $from: '2' as UserId,
        // being sent to this server
        $to: 'server' as ActionRecipients,
      })
      
      world.incomingActions.add(action)

      /* run */
      forwardIncomingActionsFromOthersIfHost(world)

      /* assert */

      // verify incomingActions are cleared if we are NOT a host
      strictEqual(world.incomingActions.size, 0)
    })

  })

})

describe('OutgoingNetworkSystem Integration Tests', async () => {
	
  let world

	beforeEach(() => {
    /* hoist */
		Network.instance = new TestNetwork()
		world = createWorld()
		Engine.currentWorld = world
	})

  it('should serialize and send poses', async () => {
    /* mock */
    // make this engine user the host (world.isHosting === true)
    Engine.userId = world.hostId

		const entity = createEntity()
		const transform = addComponent(entity, TransformComponent, {
			position: new Vector3(1,2,3),
			rotation: new Quaternion(),
			scale: new Vector3(),
		})
		const networkObject = addComponent(entity, NetworkObjectComponent, {
      // the host is the owner
			userId: Engine.userId as UserId,
			networkId: 0 as NetworkId,
			prefab: '',
			parameters: {},
		})

    /* run */
    // todo: passing world into the constructor makes the system stateful
    // ideally we want stateless systems
    const outgoingNetworkSystem = await OutgoingNetworkSystem(world)

    outgoingNetworkSystem()

    /* assert */
    const datum = (Network.instance as TestNetwork).transport.getSentData()
    strictEqual(datum.length, 1)

    const data0 = WorldStateModel.fromBuffer(datum[0])
    strictEqual(data0.pose[0].position[0], 1)
    strictEqual(data0.pose[0].position[1], 2)
    strictEqual(data0.pose[0].position[2], 3)
  })
})