import TransformGizmo from '@xrengine/engine/src/scene/classes/TransformGizmo'
import {
  TransformAxis,
  TransformAxisConstraints,
  TransformMode,
  TransformPivot
} from '@xrengine/engine/src/scene/constants/transformConstants'
import EventEmitter from 'eventemitter3'
import {
  Box3,
  Layers,
  MathUtils as _Math,
  Matrix3,
  PerspectiveCamera,
  Plane,
  Quaternion,
  Ray,
  Raycaster,
  Sphere,
  Spherical,
  Vector2,
  Vector3
} from 'three'
import { CommandManager } from '../managers/CommandManager'
import EditorCommands from '../constants/EditorCommands'
import EditorEvents from '../constants/EditorEvents'
import { TransformSpace } from '../constants/TransformSpace'
import getIntersectingNode from '../functions/getIntersectingNode'
import { EditorInputs, EditorMapping, Fly } from './input-mappings'
import { SceneManager } from '../managers/SceneManager'

export const SnapMode = {
  Disabled: 'Disabled',
  Grid: 'Grid'
}
const viewDirection = new Vector3()
function sortDistance(a, b) {
  return a.distance - b.distance
}
export default class EditorControls extends EventEmitter {
  camera: PerspectiveCamera
  inputManager: any
  flyControls: any
  enabled: boolean
  normalMatrix: Matrix3
  vector: Vector3
  delta: Vector3
  center: Vector3
  spherical: Spherical
  panSpeed: number
  zoomSpeed: number
  orbitSpeed: number
  lookSensitivity: number
  selectSensitivity: number
  boostSpeed: number
  moveSpeed: number
  initialLookSensitivity: any
  initialBoostSpeed: any
  initialMoveSpeed: any
  distance: number
  maxFocusDistance: number
  raycaster: Raycaster
  raycasterResults: any[]
  scene: any
  box: Box3
  sphere: Sphere
  centerViewportPosition: Vector2
  raycastIgnoreLayers: Layers
  renderableLayers: Layers
  transformGizmo: TransformGizmo
  transformMode: string
  multiplePlacement: boolean
  transformModeOnCancel: string
  transformSpace: TransformSpace
  transformPivot: string
  transformAxis: any
  grabHistoryCheckpoint: any
  placementObjects: any[]
  snapMode: string
  translationSnap: number
  rotationSnap: number
  scaleSnap: number
  selectionBoundingBox: Box3
  selectStartPosition: Vector2
  selectEndPosition: Vector2
  inverseGizmoQuaternion: Quaternion
  dragOffset: Vector3
  transformRay: Ray
  transformPlane: Plane
  planeIntersection: Vector3
  planeNormal: Vector3
  translationVector: Vector3
  initRotationDragVector: Vector3
  prevRotationAngle: number
  curRotationDragVector: Vector3
  normalizedInitRotationDragVector: Vector3
  normalizedCurRotationDragVector: Vector3
  initDragVector: Vector3
  dragVector: Vector3
  deltaDragVector: Vector3
  prevScale: Vector3
  curScale: Vector3
  scaleVector: Vector3
  dragging: boolean
  selectionChanged: boolean
  transformPropertyChanged: boolean
  transformModeChanged: boolean
  transformPivotChanged: boolean
  transformSpaceChanged: boolean
  flyStartTime: number
  flyModeSensitivity: number
  constructor(camera, inputManager, flyControls) {
    super()
    this.camera = camera
    this.inputManager = inputManager
    this.flyControls = flyControls
    this.enabled = false
    this.normalMatrix = new Matrix3()
    this.vector = new Vector3()
    this.delta = new Vector3()
    this.center = new Vector3()
    this.spherical = new Spherical()
    this.panSpeed = 1
    this.zoomSpeed = 0.1
    this.orbitSpeed = 5
    this.lookSensitivity = 5
    this.selectSensitivity = 0.001
    this.boostSpeed = 4
    this.moveSpeed = 4
    this.initialLookSensitivity = flyControls.lookSensitivity
    this.initialBoostSpeed = flyControls.boostSpeed
    this.initialMoveSpeed = flyControls.moveSpeed
    this.distance = 0
    this.maxFocusDistance = 1000
    this.raycaster = new Raycaster()
    this.raycasterResults = []
    this.scene = SceneManager.instance.scene
    this.box = new Box3()
    this.sphere = new Sphere()
    this.centerViewportPosition = new Vector2()
    this.raycastIgnoreLayers = new Layers()
    this.raycastIgnoreLayers.set(1)
    this.renderableLayers = new Layers()
    this.transformGizmo = new TransformGizmo()
    SceneManager.instance.helperScene.add(this.transformGizmo)
    this.transformMode = TransformMode.Translate
    this.multiplePlacement = false
    this.transformModeOnCancel = TransformMode.Translate
    this.transformSpace = TransformSpace.World
    this.transformPivot = TransformPivot.Selection
    this.transformAxis = null
    this.grabHistoryCheckpoint = null
    this.placementObjects = []
    this.snapMode = SnapMode.Grid
    this.translationSnap = 0.5
    this.rotationSnap = 10
    this.scaleSnap = 0.1
    SceneManager.instance.grid.setSize(this.translationSnap)
    this.selectionBoundingBox = new Box3()
    this.selectStartPosition = new Vector2()
    this.selectEndPosition = new Vector2()
    this.inverseGizmoQuaternion = new Quaternion()
    this.dragOffset = new Vector3()
    this.transformRay = new Ray()
    this.transformPlane = new Plane()
    this.planeIntersection = new Vector3()
    this.planeNormal = new Vector3()
    this.translationVector = new Vector3()
    this.initRotationDragVector = new Vector3()
    this.prevRotationAngle = 0
    this.curRotationDragVector = new Vector3()
    this.normalizedInitRotationDragVector = new Vector3()
    this.normalizedCurRotationDragVector = new Vector3()
    this.initDragVector = new Vector3()
    this.dragVector = new Vector3()
    this.deltaDragVector = new Vector3()
    this.prevScale = new Vector3()
    this.curScale = new Vector3()
    this.scaleVector = new Vector3()
    this.dragging = false
    this.selectionChanged = true
    this.transformPropertyChanged = true
    this.transformModeChanged = true
    this.transformPivotChanged = true
    this.transformSpaceChanged = true
    this.flyStartTime = 0
    this.flyModeSensitivity = 0.25
    CommandManager.instance.addListener(EditorEvents.BEFORE_SELECTION_CHANGED.toString(), this.onBeforeSelectionChanged)
    CommandManager.instance.addListener(EditorEvents.SELECTION_CHANGED.toString(), this.onSelectionChanged)
    CommandManager.instance.addListener(EditorEvents.OBJECTS_CHANGED.toString(), this.onObjectsChanged)
  }
  onSceneSet = (scene) => {
    this.scene = scene
  }
  onBeforeSelectionChanged = () => {
    if (this.transformMode === TransformMode.Grab) {
      const checkpoint = this.grabHistoryCheckpoint
      this.setTransformMode(this.transformModeOnCancel)
      CommandManager.instance.revert(checkpoint)
    } else if (this.transformMode === TransformMode.Placement) {
      this.setTransformMode(this.transformModeOnCancel)
      CommandManager.instance.executeCommandWithHistoryOnSelection(EditorCommands.REMOVE_OBJECTS)
    }
  }
  onSelectionChanged = () => {
    this.selectionChanged = true
  }
  onObjectsChanged = (_objects, property) => {
    if (property === 'position' || property === 'rotation' || property === 'scale' || property === 'matrix') {
      this.transformPropertyChanged = true
    }
  }
  enable() {
    this.enabled = true
    this.inputManager.enableInputMapping(EditorInputs, EditorMapping)
  }
  disable() {
    this.enabled = false
    this.inputManager.disableInputMapping(EditorInputs)
  }
  update() {
    if (!this.enabled) return
    const input = this.inputManager
    if (input.get(EditorInputs.enableFlyMode)) {
      this.flyStartTime = performance.now()
      this.distance = this.camera.position.distanceTo(this.center)
    } else if (input.get(EditorInputs.disableFlyMode)) {
      this.flyControls.disable()
      this.flyControls.lookSensitivity = this.initialLookSensitivity
      this.flyControls.boostSpeed = this.initialBoostSpeed
      this.flyControls.moveSpeed = this.initialMoveSpeed
      this.center.addVectors(
        this.camera.position,
        this.vector.set(0, 0, -this.distance).applyMatrix3(this.normalMatrix.getNormalMatrix(this.camera.matrix))
      )
      CommandManager.instance.emitEvent(EditorEvents.FLY_MODE_CHANGED)
      if (performance.now() - this.flyStartTime < this.flyModeSensitivity * 1000) {
        this.cancel()
      }
    }
    const flying = input.get(EditorInputs.flying)
    if (flying && !this.flyControls.enabled && performance.now() - this.flyStartTime > 100) {
      this.flyControls.enable()
      this.initialLookSensitivity = this.flyControls.lookSensitivity
      this.initialMoveSpeed = this.flyControls.moveSpeed
      this.initialBoostSpeed = this.flyControls.boostSpeed
      this.flyControls.lookSensitivity = this.lookSensitivity
      this.flyControls.moveSpeed = this.moveSpeed
      this.flyControls.boostSpeed = this.boostSpeed
      CommandManager.instance.emitEvent(EditorEvents.FLY_MODE_CHANGED)
    }
    const shift = input.get(EditorInputs.shift)
    const selected = CommandManager.instance.selected
    const selectedTransformRoots = CommandManager.instance.selectedTransformRoots
    const modifier = input.get(EditorInputs.modifier)
    let grabStart = false
    if (this.transformModeChanged) {
      this.transformGizmo.setTransformMode(this.transformMode)
      if (this.transformMode === TransformMode.Grab || this.transformMode === TransformMode.Placement) {
        grabStart = true
      }
    }
    const selectStart =
      input.get(EditorInputs.selectStart) &&
      !flying &&
      this.transformMode !== TransformMode.Grab &&
      this.transformMode !== TransformMode.Placement
    if (selectedTransformRoots.length > 0 && this.transformMode !== TransformMode.Disabled) {
      const lastSelectedObject = selected[selected.length - 1]
      if (
        this.selectionChanged ||
        this.transformModeChanged ||
        this.transformPivotChanged ||
        this.transformPropertyChanged
      ) {
        if (this.transformPivot === TransformPivot.Selection) {
          lastSelectedObject.getWorldPosition(this.transformGizmo.position)
        } else {
          this.selectionBoundingBox.makeEmpty()
          for (let i = 0; i < selectedTransformRoots.length; i++) {
            this.selectionBoundingBox.expandByObject(selectedTransformRoots[i])
          }
          if (this.transformPivot === TransformPivot.Center) {
            this.selectionBoundingBox.getCenter(this.transformGizmo.position)
          } else {
            this.transformGizmo.position.x = (this.selectionBoundingBox.max.x + this.selectionBoundingBox.min.x) / 2
            this.transformGizmo.position.y = this.selectionBoundingBox.min.y
            this.transformGizmo.position.z = (this.selectionBoundingBox.max.z + this.selectionBoundingBox.min.z) / 2
          }
        }
      }
      if (
        this.selectionChanged ||
        this.transformModeChanged ||
        this.transformSpaceChanged ||
        this.transformPropertyChanged
      ) {
        if (this.transformSpace === TransformSpace.LocalSelection) {
          lastSelectedObject.getWorldQuaternion(this.transformGizmo.quaternion)
        } else {
          this.transformGizmo.rotation.set(0, 0, 0)
        }
        this.inverseGizmoQuaternion.copy(this.transformGizmo.quaternion).invert()
      }
      if ((this.transformModeChanged || this.transformSpaceChanged) && this.transformMode === TransformMode.Scale) {
        this.transformGizmo.setLocalScaleHandlesVisible(this.transformSpace !== TransformSpace.World)
      }
      this.transformGizmo.visible = true
    } else {
      this.transformGizmo.visible = false
    }
    this.selectionChanged = false
    this.transformModeChanged = false
    this.transformPivotChanged = false
    this.transformSpaceChanged = false
    // Set up the transformRay
    const cursorPosition = input.get(EditorInputs.cursorPosition)
    if (selectStart) {
      const selectStartPosition = input.get(EditorInputs.selectStartPosition)
      this.selectStartPosition.copy(selectStartPosition)
      this.raycaster.setFromCamera(selectStartPosition, this.camera)
      if (this.transformGizmo.activeControls) {
        this.transformAxis = this.transformGizmo.selectAxisWithRaycaster(this.raycaster)
        if (this.transformAxis) {
          const axisInfo = (this.transformGizmo as any).selectedAxis.axisInfo
          this.planeNormal.copy(axisInfo.planeNormal).applyQuaternion(this.transformGizmo.quaternion).normalize()
          this.transformPlane.setFromNormalAndCoplanarPoint(this.planeNormal, this.transformGizmo.position)
          this.dragging = true
        } else {
          this.dragging = false
        }
      }
    } else if ((this.transformGizmo as any).activeControls && !this.dragging) {
      this.raycaster.setFromCamera(cursorPosition, this.camera)
      this.transformGizmo.highlightHoveredAxis(this.raycaster)
    }
    const selectEnd = input.get(EditorInputs.selectEnd) === 1
    if (this.dragging || this.transformMode === TransformMode.Grab || this.transformMode === TransformMode.Placement) {
      let constraint
      if (this.transformMode === TransformMode.Grab || this.transformMode === TransformMode.Placement) {
        this.getRaycastPosition(flying ? this.centerViewportPosition : cursorPosition, this.planeIntersection, modifier)
        constraint = TransformAxisConstraints.XYZ
      } else {
        this.transformRay.origin.setFromMatrixPosition(this.camera.matrixWorld)
        this.transformRay.direction
          .set(cursorPosition.x, cursorPosition.y, 0.5)
          .unproject(this.camera)
          .sub(this.transformRay.origin)
        this.transformRay.intersectPlane(this.transformPlane, this.planeIntersection)
        constraint = TransformAxisConstraints[this.transformAxis]
      }
      if (!constraint) {
        console.warn(
          `Axis Constraint is undefined. transformAxis was ${this.transformAxis} transformMode was ${this.transformMode} dragging was ${this.dragging}`
        )
      }
      if (selectStart) {
        this.dragOffset.subVectors(this.transformGizmo.position, this.planeIntersection)
      } else if (grabStart) {
        this.dragOffset.set(0, 0, 0)
      }
      this.planeIntersection.add(this.dragOffset)
      if (
        this.transformMode === TransformMode.Translate ||
        this.transformMode === TransformMode.Grab ||
        this.transformMode === TransformMode.Placement
      ) {
        this.translationVector
          .subVectors(this.planeIntersection, this.transformGizmo.position)
          .applyQuaternion(this.inverseGizmoQuaternion)
          .multiply(constraint)
        this.translationVector.applyQuaternion(this.transformGizmo.quaternion)
        this.transformGizmo.position.add(this.translationVector)
        if (this.shouldSnap(modifier)) {
          const transformPosition = this.transformGizmo.position
          const prevX = transformPosition.x
          const prevY = transformPosition.y
          const prevZ = transformPosition.z
          const transformedConstraint = new Vector3().copy(constraint).applyQuaternion(this.transformGizmo.quaternion)
          transformPosition.set(
            transformedConstraint.x !== 0
              ? Math.round(transformPosition.x / this.translationSnap) * this.translationSnap
              : transformPosition.x,
            transformedConstraint.y !== 0
              ? Math.round(transformPosition.y / this.translationSnap) * this.translationSnap
              : transformPosition.y,
            transformedConstraint.z !== 0
              ? Math.round(transformPosition.z / this.translationSnap) * this.translationSnap
              : transformPosition.z
          )
          const diffX = transformPosition.x - prevX
          const diffY = transformPosition.y - prevY
          const diffZ = transformPosition.z - prevZ

          this.translationVector.set(
            this.translationVector.x + diffX,
            this.translationVector.y + diffY,
            this.translationVector.z + diffZ
          )
        }
        CommandManager.instance.executeCommandWithHistoryOnSelection(EditorCommands.POSITION, {
          positions: this.translationVector,
          space: this.transformSpace,
          addToPosition: true
        })

        if (grabStart && this.transformMode === TransformMode.Grab) {
          this.grabHistoryCheckpoint = CommandManager.instance.selected ? CommandManager.instance.selected[0].id : 0
        }
      } else if (this.transformMode === TransformMode.Rotate) {
        if (selectStart) {
          this.initRotationDragVector
            .subVectors(this.planeIntersection, this.dragOffset)
            .sub(this.transformGizmo.position)
          this.prevRotationAngle = 0
        }
        this.curRotationDragVector.subVectors(this.planeIntersection, this.dragOffset).sub(this.transformGizmo.position)
        this.normalizedInitRotationDragVector.copy(this.initRotationDragVector).normalize()
        this.normalizedCurRotationDragVector.copy(this.curRotationDragVector).normalize()
        let rotationAngle = this.curRotationDragVector.angleTo(this.initRotationDragVector)
        rotationAngle *=
          this.normalizedInitRotationDragVector.cross(this.normalizedCurRotationDragVector).dot(this.planeNormal) > 0
            ? 1
            : -1
        if (this.shouldSnap(modifier)) {
          const rotationSnapAngle = _Math.DEG2RAD * this.rotationSnap
          rotationAngle = Math.round(rotationAngle / rotationSnapAngle) * rotationSnapAngle
        }
        const relativeRotationAngle = rotationAngle - this.prevRotationAngle
        this.prevRotationAngle = rotationAngle
        CommandManager.instance.executeCommandWithHistoryOnSelection(EditorCommands.ROTATE_AROUND, {
          pivot: this.transformGizmo.position,
          axis: this.planeNormal,
          angle: relativeRotationAngle
        })
        const selectedAxisInfo = (this.transformGizmo as any).selectedAxis.axisInfo
        if (selectStart) {
          selectedAxisInfo.startMarker.visible = true
          selectedAxisInfo.endMarker.visible = true
          if (this.transformSpace !== TransformSpace.World) {
            const startMarkerLocal = selectedAxisInfo.startMarkerLocal
            startMarkerLocal.position.copy(this.transformGizmo.position)
            startMarkerLocal.quaternion.copy(this.transformGizmo.quaternion)
            startMarkerLocal.scale.copy(this.transformGizmo.scale)
            this.scene.add(startMarkerLocal)
          }
        }
        if (this.transformSpace === TransformSpace.World) {
          if (!selectedAxisInfo.rotationTarget) {
            throw new Error(
              `Couldn't rotate object due to an unknown error. The selected axis is ${
                (this.transformGizmo as any).selectedAxis.name
              } The selected axis info is: ${JSON.stringify(selectedAxisInfo)}`
            )
          }
          selectedAxisInfo.rotationTarget.rotateOnAxis(selectedAxisInfo.planeNormal, relativeRotationAngle)
        } else {
          this.transformGizmo.rotateOnAxis(selectedAxisInfo.planeNormal, relativeRotationAngle)
        }
        if (selectEnd) {
          selectedAxisInfo.startMarker.visible = false
          selectedAxisInfo.endMarker.visible = false
          selectedAxisInfo.rotationTarget.rotation.set(0, 0, 0)
          if (this.transformSpace !== TransformSpace.World) {
            const startMarkerLocal = selectedAxisInfo.startMarkerLocal
            this.scene.remove(startMarkerLocal)
          }
        }
      } else if (this.transformMode === TransformMode.Scale) {
        this.dragVector.copy(this.planeIntersection).applyQuaternion(this.inverseGizmoQuaternion).multiply(constraint)
        if (selectStart) {
          this.initDragVector.copy(this.dragVector)
          this.prevScale.set(1, 1, 1)
        }
        this.deltaDragVector.subVectors(this.dragVector, this.initDragVector)
        this.deltaDragVector.multiply(constraint)
        let scaleFactor
        if (this.transformAxis === TransformAxis.XYZ) {
          scaleFactor =
            1 +
            this.camera
              .getWorldDirection(viewDirection)
              .applyQuaternion(this.transformGizmo.quaternion)
              .dot(this.deltaDragVector)
        } else {
          scaleFactor = 1 + constraint.dot(this.deltaDragVector)
        }
        this.curScale.set(
          constraint.x === 0 ? 1 : scaleFactor,
          constraint.y === 0 ? 1 : scaleFactor,
          constraint.z === 0 ? 1 : scaleFactor
        )
        if (this.shouldSnap(modifier)) {
          this.curScale.divideScalar(this.scaleSnap).round().multiplyScalar(this.scaleSnap)
        }
        this.curScale.set(
          this.curScale.x <= 0 ? Number.EPSILON : this.curScale.x,
          this.curScale.y <= 0 ? Number.EPSILON : this.curScale.y,
          this.curScale.z <= 0 ? Number.EPSILON : this.curScale.z
        )
        this.scaleVector.copy(this.curScale).divide(this.prevScale)
        this.prevScale.copy(this.curScale)

        CommandManager.instance.executeCommandWithHistoryOnSelection(EditorCommands.SCALE, {
          scales: this.scaleVector,
          space: this.transformSpace
        })
      }
    }
    if (selectEnd) {
      if (this.transformMode === TransformMode.Grab || this.transformMode === TransformMode.Placement) {
        if (this.transformMode === TransformMode.Grab) {
          if (shift || input.get(Fly.boost)) {
            this.setTransformMode(TransformMode.Placement)
          } else {
            this.setTransformMode(this.transformModeOnCancel)
          }
        }
        if (this.transformMode === TransformMode.Placement) {
          if (shift || input.get(Fly.boost) || this.multiplePlacement) {
            CommandManager.instance.executeCommandWithHistoryOnSelection(EditorCommands.DUPLICATE_OBJECTS, {
              isObjectSelected: false
            })
          } else {
            this.setTransformMode(this.transformModeOnCancel)
          }
        }
      } else {
        const selectEndPosition = input.get(EditorInputs.selectEndPosition)
        if (this.selectStartPosition.distanceTo(selectEndPosition) < this.selectSensitivity) {
          const result = this.raycastNode(selectEndPosition)
          if (result) {
            if (shift) {
              CommandManager.instance.executeCommandWithHistory(EditorCommands.TOGGLE_SELECTION, result.node)
            } else {
              CommandManager.instance.executeCommandWithHistory(EditorCommands.REPLACE_SELECTION, result.node)
            }
          } else if (!shift) {
            CommandManager.instance.executeCommandWithHistory(EditorCommands.REPLACE_SELECTION, [])
          }
        }
        this.transformGizmo.deselectAxis()
        this.dragging = false
      }
    }
    this.transformPropertyChanged = false
    if (input.get(EditorInputs.rotateLeft)) {
      CommandManager.instance.executeCommandWithHistoryOnSelection(EditorCommands.ROTATE_AROUND, {
        pivot: this.transformGizmo.position,
        axis: new Vector3(0, 1, 0),
        angle: this.rotationSnap * _Math.DEG2RAD
      })
    } else if (input.get(EditorInputs.rotateRight)) {
      CommandManager.instance.executeCommandWithHistoryOnSelection(EditorCommands.ROTATE_AROUND, {
        pivot: this.transformGizmo.position,
        axis: new Vector3(0, 1, 0),
        angle: -this.rotationSnap * _Math.DEG2RAD
      })
    } else if (input.get(EditorInputs.grab)) {
      if (this.transformMode === TransformMode.Grab || this.transformMode === TransformMode.Placement) {
        this.cancel()
      }
      if (CommandManager.instance.selected.length > 0) {
        this.setTransformMode(TransformMode.Grab)
      }
    } else if (input.get(EditorInputs.cancel)) {
      this.cancel()
    } else if (input.get(EditorInputs.focusSelection)) {
      this.focus(CommandManager.instance.selected)
    } else if (input.get(EditorInputs.setTranslateMode)) {
      this.setTransformMode(TransformMode.Translate)
    } else if (input.get(EditorInputs.setRotateMode)) {
      this.setTransformMode(TransformMode.Rotate)
    } else if (input.get(EditorInputs.setScaleMode)) {
      this.setTransformMode(TransformMode.Scale)
    } else if (input.get(EditorInputs.toggleSnapMode)) {
      this.toggleSnapMode()
    } else if (input.get(EditorInputs.toggleTransformPivot)) {
      this.changeTransformPivot()
    } else if (input.get(EditorInputs.toggleTransformSpace)) {
      this.toggleTransformSpace()
    } else if (input.get(EditorInputs.incrementGridHeight)) {
      SceneManager.instance.grid.incrementGridHeight()
    } else if (input.get(EditorInputs.decrementGridHeight)) {
      SceneManager.instance.grid.decrementGridHeight()
    } else if (input.get(EditorInputs.undo)) {
      CommandManager.instance.undo()
    } else if (input.get(EditorInputs.redo)) {
      CommandManager.instance.redo()
    } else if (input.get(EditorInputs.duplicateSelected)) {
      CommandManager.instance.executeCommandWithHistoryOnSelection(EditorCommands.DUPLICATE_OBJECTS)
    } else if (input.get(EditorInputs.groupSelected)) {
      CommandManager.instance.executeCommandWithHistoryOnSelection(EditorCommands.GROUP)
    } else if (input.get(EditorInputs.deleteSelected)) {
      CommandManager.instance.executeCommandWithHistoryOnSelection(EditorCommands.REMOVE_OBJECTS)
    } else if (input.get(EditorInputs.saveProject)) {
      // TODO: Move save to Project class
      CommandManager.instance.emitEvent(EditorEvents.SAVE_PROJECT)
    }
    if (flying) {
      this.updateTransformGizmoScale()
      return
    }
    const selecting = input.get(EditorInputs.selecting)
    const orbiting = selecting && !this.dragging
    const zoomDelta = input.get(EditorInputs.zoomDelta)
    const cursorDeltaX = input.get(EditorInputs.cursorDeltaX)
    const cursorDeltaY = input.get(EditorInputs.cursorDeltaY)
    if (zoomDelta !== 0) {
      const camera = this.camera
      const delta = this.delta
      const center = this.center
      delta.set(0, 0, zoomDelta)
      const distance = camera.position.distanceTo(center)
      delta.multiplyScalar(distance * this.zoomSpeed)
      if (delta.length() > distance) return
      delta.applyMatrix3(this.normalMatrix.getNormalMatrix(camera.matrix))
      camera.position.add(delta)
    } else if (input.get(EditorInputs.focus)) {
      const result = this.raycastNode(input.get(EditorInputs.focusPosition))
      if (result) {
        this.focus([result.node])
      }
    } else if (input.get(EditorInputs.panning)) {
      const camera = this.camera
      const delta = this.delta
      const center = this.center
      const distance = camera.position.distanceTo(center)
      delta
        .set(cursorDeltaX, -cursorDeltaY, 0)
        .multiplyScalar(distance * this.panSpeed)
        .applyMatrix3(this.normalMatrix.getNormalMatrix(this.camera.matrix))
      camera.position.add(delta)
      center.add(delta)
    } else if (orbiting) {
      const camera = this.camera
      const center = this.center
      const vector = this.vector
      const spherical = this.spherical
      vector.copy(camera.position).sub(center)
      spherical.setFromVector3(vector)
      spherical.theta += cursorDeltaX * this.orbitSpeed
      spherical.phi += cursorDeltaY * this.orbitSpeed
      spherical.makeSafe()
      vector.setFromSpherical(spherical)
      camera.position.copy(center).add(vector)
      camera.lookAt(center)
    }
    this.updateTransformGizmoScale()
  }
  raycastNode(coords) {
    this.raycaster.setFromCamera(coords, this.camera)
    this.raycasterResults.length = 0
    this.raycaster.intersectObject(this.scene, true, this.raycasterResults)
    return getIntersectingNode(this.raycasterResults, this.scene)
  }
  focus(objects) {
    const box = this.box
    const center = this.center
    const delta = this.delta
    const camera = this.camera
    let distance = 0
    if (objects.length === 0) {
      center.set(0, 0, 0)
      distance = 10
    } else {
      box.makeEmpty()
      for (const object of objects) {
        box.expandByObject(object)
      }
      if (box.isEmpty() === false) {
        box.getCenter(center)
        distance = box.getBoundingSphere(this.sphere).radius
      } else {
        // Focusing on an Group, AmbientLight, etc
        center.setFromMatrixPosition(objects[0].matrixWorld)
        distance = 0.1
      }
    }
    delta.set(0, 0, 1)
    delta.applyQuaternion(camera.quaternion)
    delta.multiplyScalar(Math.min(distance, this.maxFocusDistance) * 4)
    camera.position.copy(center).add(delta)
  }
  updateTransformGizmoScale() {
    const eyeDistance = this.transformGizmo.position.distanceTo(this.camera.position)
    this.transformGizmo.scale.set(1, 1, 1).multiplyScalar(eyeDistance / 5)
  }
  _raycastRecursive(object, excludeObjects?, excludeLayers?) {
    if (
      (excludeObjects && excludeObjects.indexOf(object) !== -1) ||
      (excludeLayers && excludeLayers.test(object.layers)) ||
      (SceneManager.instance.renderer.renderer.batchManager &&
        SceneManager.instance.renderer.renderer.batchManager.batches.indexOf(object) !== -1) ||
      !object.visible
    ) {
      return
    }
    this.raycaster.intersectObject(object, false, this.raycasterResults)
    const children = object.children
    for (let i = 0; i < children.length; i++) {
      this._raycastRecursive(children[i], excludeObjects, excludeLayers)
    }
  }
  getRaycastPosition(coords, target, modifier) {
    this.raycaster.setFromCamera(coords, this.camera)
    this.raycasterResults.length = 0
    this._raycastRecursive(this.scene, CommandManager.instance.selectedTransformRoots, this.raycastIgnoreLayers)
    this._raycastRecursive(SceneManager.instance.grid)
    this.raycasterResults.sort(sortDistance)
    const result = this.raycasterResults[0]
    if (result && result.distance < 100) {
      target.copy(result.point)
    } else {
      this.raycaster.ray.at(10, target)
    }
    if (this.shouldSnap(modifier)) {
      const translationSnap = this.translationSnap
      target.set(
        Math.round(target.x / translationSnap) * translationSnap,
        Math.round(target.y / translationSnap) * translationSnap,
        Math.round(target.z / translationSnap) * translationSnap
      )
    }
  }
  setTransformMode(mode, multiplePlacement?) {
    if (
      (mode === TransformMode.Placement || mode === TransformMode.Grab) &&
      CommandManager.instance.selected.some((node) => node.disableTransform) // TODO: this doesn't prevent nesting and then grabbing
    ) {
      // Dont allow grabbing / placing objects with transform disabled.
      return
    }
    if (mode !== TransformMode.Placement && mode !== TransformMode.Grab) {
      this.transformModeOnCancel = mode
    }
    if (mode === TransformMode.Placement) {
      this.placementObjects = CommandManager.instance.selected.slice(0)
    } else {
      this.placementObjects = []
    }
    this.multiplePlacement = multiplePlacement || false
    this.grabHistoryCheckpoint = null
    this.transformMode = mode
    this.transformModeChanged = true
    CommandManager.instance.emitEvent(EditorEvents.TRANSFROM_MODE_CHANGED, mode)
  }
  setTransformSpace(transformSpace) {
    this.transformSpace = transformSpace
    this.transformSpaceChanged = true
    CommandManager.instance.emitEvent(EditorEvents.TRANSFORM_SPACE_CHANGED)
  }
  toggleTransformSpace() {
    this.setTransformSpace(
      this.transformSpace === TransformSpace.World ? TransformSpace.LocalSelection : TransformSpace.World
    )
  }
  setTransformPivot(pivot) {
    this.transformPivot = pivot
    this.transformPivotChanged = true
    CommandManager.instance.emitEvent(EditorEvents.TRANSFORM_PIVOT_CHANGED)
  }
  transformPivotModes = [TransformPivot.Selection, TransformPivot.Center, TransformPivot.Bottom]
  changeTransformPivot() {
    const curPivotModeIndex = this.transformPivotModes.indexOf(this.transformPivot)
    const nextPivotModeIndex = (curPivotModeIndex + 1) % this.transformPivotModes.length
    this.setTransformPivot(this.transformPivotModes[nextPivotModeIndex])
  }
  setSnapMode(snapMode) {
    this.snapMode = snapMode
    CommandManager.instance.emitEvent(EditorEvents.SNAP_SETTINGS_CHANGED)
  }
  toggleSnapMode() {
    this.setSnapMode(this.snapMode === SnapMode.Disabled ? SnapMode.Grid : SnapMode.Disabled)
  }
  shouldSnap(invertSnap = false) {
    return (this.snapMode === SnapMode.Grid) === !invertSnap
  }
  setTranslationSnap(value) {
    this.translationSnap = value
    SceneManager.instance.grid.setSize(value)
    CommandManager.instance.emitEvent(EditorEvents.SNAP_SETTINGS_CHANGED)
  }
  setScaleSnap(value) {
    this.scaleSnap = value
    CommandManager.instance.emitEvent(EditorEvents.SNAP_SETTINGS_CHANGED)
  }
  setRotationSnap(value) {
    this.rotationSnap = value
    CommandManager.instance.emitEvent(EditorEvents.SNAP_SETTINGS_CHANGED)
  }
  cancel() {
    if (this.transformMode === TransformMode.Grab) {
      const checkpoint = this.grabHistoryCheckpoint
      this.setTransformMode(this.transformModeOnCancel)
      CommandManager.instance.revert(checkpoint)
    } else if (this.transformMode === TransformMode.Placement) {
      this.setTransformMode(this.transformModeOnCancel)
      CommandManager.instance.executeCommandWithHistoryOnSelection(EditorCommands.REMOVE_OBJECTS)
    }
    CommandManager.instance.executeCommandWithHistory(EditorCommands.REPLACE_SELECTION, [])
  }
}
