import Command, { CommandParams } from './Command'
import { serializeObject3DArray } from '../functions/debug'
import EditorCommands from '../constants/EditorCommands'
import { CommandManager } from '../managers/CommandManager'
import EditorEvents from '../constants/EditorEvents'

export default class ToggleSelectionCommand extends Command {
  constructor(objects?: any | any[], params?: CommandParams) {
    super(objects, params)

    if (!Array.isArray(objects)) {
      objects = [objects]
    }

    this.affectedObjects = objects.slice(0)
    this.oldSelection = CommandManager.instance.selected.slice(0)
  }

  execute() {
    this.emitBeforeExecuteEvent()

    for (let i = 0; i < this.affectedObjects.length; i++) {
      const object = this.affectedObjects[i]
      const index = CommandManager.instance.selected.indexOf(object)
      if (index > -1) {
        CommandManager.instance.selected.splice(index, 1)

        if (object.isNode) {
          object.onDeselect()
        }
      } else {
        if (object.isNode) {
          object.onSelect()
        }

        CommandManager.instance.selected.push(object)
      }
    }

    if (this.shouldGizmoUpdate) {
      CommandManager.instance.updateTransformRoots()
    }

    this.emitAfterExecuteEvent()
  }

  undo() {
    CommandManager.instance.executeCommand(EditorCommands.REPLACE_SELECTION, this.oldSelection)
  }

  toString() {
    return `SelectMultipleCommand id: ${this.id} objects: ${serializeObject3DArray(this.affectedObjects)}`
  }

  emitAfterExecuteEvent() {
    if (this.shouldEmitEvent) CommandManager.instance.emitEvent(EditorEvents.SELECTION_CHANGED)
  }

  emitBeforeExecuteEvent() {
    if (this.shouldEmitEvent) CommandManager.instance.emitEvent(EditorEvents.BEFORE_SELECTION_CHANGED)
  }
}
