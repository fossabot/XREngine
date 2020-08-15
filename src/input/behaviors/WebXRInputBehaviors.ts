import { Entity, ComponentConstructor } from "ecsy"
import { WebXRMainController } from "../components/WebXRMainController"
import { WebXRMainGamepad } from "../components/WebXRMainGamepad"
import { WebXRPointer } from "../components/WebXRPointer"
import { WebXRRenderer } from "../components/WebXRRenderer"
import { WebXRSecondController } from "../components/WebXRSecondController"
import { WebXRSecondGamepad } from "../components/WebXRSecondGamepad"
import { WebXRSession } from "../components/WebXRSession"
import { WebXRSpace } from "../components/WebXRSpace"
import { WebXRViewPoint } from "../components/WebXRViewPoint"
import { Behavior } from "../../common/interfaces/Behavior"
import { getInputSources } from "../functions/WebXRFunctions"

let mainControllerId: any
let secondControllerId: any

export const processSession: Behavior = (entity: Entity) => {
  const { session, isImmersive } = entity.getComponent(WebXRSession)
  if (isImmersive) {
    console.log("requesting animation frame", session)
    session.requestAnimationFrame((time, frame) => {
      console.log(time, "XRFrame", frame)
      //TODO:
      // let refSpace = session.isImmersive ?
      //     xrImmersiveRefSpace :
      //     inlineViewerHelper.referenceSpace;
      const { space, spaceType } = entity.getComponent(WebXRSpace)
      if (space) setComponent(entity, WebXRViewPoint, {pose: frame.getViewerPose(space) })

      const controllers = space ? getInputSources(session, frame, space) : []
      let main, second
      if (controllers.length == 1) {
        main = controllers[0]
      } else if (controllers.length == 2) {
        main = controllers[mainControllerId]
        second = controllers[secondControllerId]
        setComponent(entity, WebXRSecondController, {pose: second.gripPose, handId: second.handedness })
        const { gamepad } = second
        if (gamepad) setComponent(entity, WebXRSecondGamepad, {gamepad})
      } else return
      if (main.targetRayPose)
        setComponent(entity, WebXRPointer, {pose: main.targetRayPose, pointMode: main.targetRayMode })
      setComponent(entity, WebXRMainController, {pose: main.gripPose, handId: main.handedness })
      const { gamepad } = main
      if (gamepad) setComponent(entity, WebXRMainGamepad, {gamepad})
    })
  }
}

export const tracking: Behavior = (entity: Entity) => {
  const viewPoint = entity.getComponent(WebXRViewPoint)
  const pointer = entity.getComponent(WebXRPointer)
  const mainController = entity.getComponent(WebXRMainController)
  const secondController = entity.getComponent(WebXRSecondController)
  const poses = [viewPoint, pointer, mainController, secondController].map(({ pose }) => pose)
  console.log(poses)
}

export const initializeSession: Behavior = (entity: Entity, args: { webXRRenderer: any }) => {
  const { session, isImmersive } = entity.getComponent(WebXRSession)
  session.addEventListener("end", () => {
    entity.remove()
    args.webXRRenderer.requestAnimationFrame = WebXRRenderer.schema.requestAnimationFrame.default
  })
  // console.log("XR session added to", entity, "isImmersive", isImmersive)
  if (isImmersive /*entity.name == "vr-session"*/) {
    args.webXRRenderer.context.makeXRCompatible().then(() =>
      session.updateRenderState({
        baseLayer: new XRWebGLLayer(session, args.webXRRenderer.context)
      })
    )
    args.webXRRenderer.requestAnimationFrame = session.requestAnimationFrame.bind(session)
  }
  console.log("XR session started", session)
}

function setComponent(entity: Entity, Class: ComponentConstructor<any>, data: object) {
  if (entity.hasComponent(Class)) {
    const mutate = entity.getMutableComponent(Class)
    for (const property in data) mutate[property] = data[property]
  } else {
    entity.addComponent(Class, data)
  }
}
