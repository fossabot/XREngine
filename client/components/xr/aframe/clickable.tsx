import AFRAME from 'aframe'

export const ComponentName = 'clickable'

export interface ClickableData {
  id?: string
  enabled?: boolean
  clickevent?: string
  clickeventData?: string
  enableevent?: string
  disableevent?: string
}

export const ClickableComponentSchema: AFRAME.MultiPropertySchema<ClickableData> = {
  id: { type: 'string', default: '' },
  enabled: { type: 'boolean', default: true },
  clickevent: { type: 'string', default: 'cellclicked' },
  clickeventData: { type: 'string', default: '' },
  enableevent: { type: 'string', default: 'enable-clickable' },
  disableevent: { type: 'string', default: 'disable-clickable' }
}

export interface Props {
  clickHandler: () => void
  raycasterIntersectedHandler: (e: any) => void
  raycasterIntersectedClearedHandler: () => void
  addHandlers: () => void
  removeHandlers: () => void
  firstUpdate: boolean
  intersectingRaycaster: any
  intersection: any
  beganClickableClass: boolean
}

export const ClickableComponent: AFRAME.ComponentDefinition<Props> = {
  schema: ClickableComponentSchema,
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  data: {} as ClickableData,

  intersectingRaycaster: null,
  intersection: null,
  firstUpdate: true,
  beganClickableClass: false,

  init () {
    this.clickHandler = this.clickHandler.bind(this)
    this.raycasterIntersectedHandler = this.raycasterIntersectedHandler.bind(this)
    this.raycasterIntersectedClearedHandler = this.raycasterIntersectedClearedHandler.bind(this)

    this.beganClickableClass = this.el.classList.contains('clickable')
    this.el.classList.add('clickable')
  },

  tick: function () {
    if (!this.intersectingRaycaster) {
      return
    }

    const intersection = this.intersectingRaycaster.getIntersection(this.el)
    this.intersection = intersection
  },

  update (oldData) {
    const data = this.data
    const changedData = Object.keys(this.data).filter(x => this.data[x] !== oldData[x])

    if (this.firstUpdate) {
      this.firstUpdate = false
      return
    }
    if (changedData.includes('enabled')) {
      if (data.enabled) {
        this.addHandlers()
      } else {
        this.removeHandlers()
      }
    }
  },

  remove () {
    this.removeHandlers()
    if (!this.beganClickableClass) {
      this.el.classList.remove('clickable')
    }
  },

  play () {
    if (this.data.enabled) {
      this.addHandlers()
    }
  },

  pause () {
    if (this.data.enabled) {
      this.removeHandlers()
    }
  },

  clickHandler () {
    if (this.intersectingRaycaster) {
      const intersection = this.intersectingRaycaster.getIntersection(this.el)
      if (intersection) {
        // CustomEvent allows passing data through 'detail' property.
        const eventData: any = this.data.clickeventData ? { detail: JSON.parse(this.data.clickeventData) } : { detail: {} }
        eventData.detail.intersection = intersection
        const clickEvent = new CustomEvent(this.data.clickevent,
          {
            bubbles: true,
            ...eventData
          }
        )
        this.el.dispatchEvent(clickEvent)
      }
    }
  },

  raycasterIntersectedHandler (evt) {
    this.intersectingRaycaster = evt.detail.el.components.raycaster
  },

  raycasterIntersectedClearedHandler () {
    if (this.intersectingRaycaster != null) {
      const intersection = this.intersectingRaycaster.getIntersection(this.el)
      if (intersection === undefined) {
        this.intersectingRaycaster = null
      }
    }
  },

  addHandlers: function () {
    this.el.addEventListener('click', this.clickHandler)
    this.el.addEventListener('raycaster-intersected', this.raycasterIntersectedHandler)
    this.el.addEventListener('raycaster-intersected-cleared', this.raycasterIntersectedClearedHandler)
  },

  removeHandlers: function () {
    this.el.removeEventListener('click', this.clickHandler)
    this.el.removeEventListener('raycaster-intersected', this.raycasterIntersectedHandler)
    this.el.removeEventListener('raycaster-intersected-cleared', this.raycasterIntersectedClearedHandler)
  }

}

const ComponentSystem = {
  name: ComponentName,
  component: ClickableComponent
}

export default ComponentSystem
