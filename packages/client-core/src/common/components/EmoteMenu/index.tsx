import React, { MouseEventHandler } from 'react'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import ScrollableElement from '../ScrollableElement'
// @ts-ignore
import defaultStyles from './EmoteMenu.module.scss'
import { hasComponent } from '@xrengine/engine/src/ecs/functions/EntityFunctions'
import { LocalInputReceiverComponent } from '@xrengine/engine/src/input/components/LocalInputReceiverComponent'
import { WeightsParameterType, AvatarAnimations, AvatarStates } from '@xrengine/engine/src/avatar/animations/Util'
import { AnimationGraph } from '@xrengine/engine/src/avatar/animations/AnimationGraph'
import { World } from '@xrengine/engine/src/ecs/classes/World'

type MenuItemType = {
  body: any
  containerProps: {
    onClick: MouseEventHandler<HTMLButtonElement>
  }
}

type EmoteMenuPropsType = {
  styles?: any
  radius?: number
}

type EmoteMenuStateType = {
  items: MenuItemType[]
  menuRadius: number
  menuItemWidth: number
  isOpen: boolean
}

const DEFAULT_MENU_THICKNESS = 100
const MIN_MENU_RADIUS = 150

class EmoteMenuCore extends React.Component<EmoteMenuPropsType, EmoteMenuStateType> {
  menuItemWidth: number
  menuItemRadius: number
  effectiveRadius: number
  menuPadding: number = 20
  menuThickness: number = 100
  styles: any
  constructor(props) {
    super(props)
    this.styles = props.styles ?? defaultStyles
    this.state = {
      menuRadius: this.calculateMenuRadius(),
      items: [
        {
          body: <img src="/static/Dance1.svg" alt="Dance 1" />,
          containerProps: {
            onClick: () => this.runAnimation(AvatarStates.LOOPABLE_EMOTE, { animationName: AvatarAnimations.DANCING_1 })
          }
        },
        {
          body: <img src="/static/Dance2.svg" alt="Dance 2" />,
          containerProps: {
            onClick: () => this.runAnimation(AvatarStates.LOOPABLE_EMOTE, { animationName: AvatarAnimations.DANCING_2 })
          }
        },
        {
          body: <img src="/static/Dance3.svg" alt="Dance 3" />,
          containerProps: {
            onClick: () => this.runAnimation(AvatarStates.LOOPABLE_EMOTE, { animationName: AvatarAnimations.DANCING_3 })
          }
        },
        {
          body: <img src="/static/Dance4.svg" alt="Dance 4" />,
          containerProps: {
            onClick: () => this.runAnimation(AvatarStates.LOOPABLE_EMOTE, { animationName: AvatarAnimations.DANCING_4 })
          }
        },
        {
          body: <img src="/static/Clap.svg" alt="Clap" />,
          containerProps: {
            onClick: () => this.runAnimation(AvatarStates.EMOTE, { animationName: AvatarAnimations.CLAP })
          }
        },
        {
          body: <img src="/static/Cry.svg" alt="Cry" />,
          containerProps: {
            onClick: () => this.runAnimation(AvatarStates.EMOTE, { animationName: AvatarAnimations.CRY })
          }
        },
        {
          body: <img src="/static/Laugh.svg" alt="Laugh" />,
          containerProps: {
            onClick: () => this.runAnimation(AvatarStates.EMOTE, { animationName: AvatarAnimations.LAUGH })
          }
        },
        {
          body: <img src="/static/Defeat.svg" alt="Defeat" />,
          containerProps: {
            onClick: () => this.runAnimation(AvatarStates.EMOTE, { animationName: AvatarAnimations.DEFEAT })
          }
        },
        {
          body: <img src="/static/Kiss.svg" alt="Kiss" />,
          containerProps: {
            onClick: () => this.runAnimation(AvatarStates.EMOTE, { animationName: AvatarAnimations.KISS })
          }
        },
        {
          body: <img src="/static/Wave.svg" alt="Wave" />,
          containerProps: {
            onClick: () => this.runAnimation(AvatarStates.EMOTE, { animationName: AvatarAnimations.WAVE })
          }
        }
      ] as any
    } as EmoteMenuStateType

    this.calculateOtherValues()
  }

  calculateMenuRadius = (): number => {
    return Math.max(
      Math.min(this.props.radius || (Math.min(window.innerWidth, window.innerHeight) * 0.6) / 2),
      MIN_MENU_RADIUS
    )
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize)
  }

  openEmoteMenu = () => {
    this.setState({ isOpen: true })
  }

  closeEmoteMenu = () => {
    this.setState({ isOpen: false })
  }

  handleWindowResize = () => {
    this.setState({ menuRadius: this.calculateMenuRadius() }, this.calculateOtherValues)
  }

  calculateOtherValues = (): void => {
    this.menuThickness = this.state.menuRadius > 190 ? 100 : 80
    this.menuItemWidth = this.menuThickness - this.menuPadding
    this.menuItemRadius = this.menuItemWidth / 2
    this.effectiveRadius = this.state.menuRadius - this.menuItemRadius - this.menuPadding / 2
  }

  runAnimation = (animationName: string, params: WeightsParameterType) => {
    const entity = World.defaultWorld.entities.find((e) => hasComponent(e, LocalInputReceiverComponent))

    AnimationGraph.forceUpdateAnimationState(entity, animationName, params)

    this.closeEmoteMenu()
  }

  render() {
    const angle = 360 / this.state.items.length
    return (
      <>
        <section className={this.styles.emoteMenu + ' ' + (!this.state.isOpen ? this.styles.hideMenu : '')}>
          <ClickAwayListener onClickAway={this.closeEmoteMenu} mouseEvent="onMouseDown">
            <div
              className={this.styles.itemContainer}
              style={{
                width: this.state.menuRadius * 2,
                height: this.state.menuRadius * 2,
                borderWidth: this.menuThickness
              }}
            >
              <div
                className={this.styles.menuItemBlock}
                style={{
                  width: this.menuItemRadius,
                  height: this.menuItemRadius
                }}
              >
                {this.state.items.map((item, index) => {
                  const itemAngle = angle * index + 270
                  const x = this.effectiveRadius * Math.cos((itemAngle * Math.PI) / 180)
                  const y = this.effectiveRadius * Math.sin((itemAngle * Math.PI) / 180)
                  return (
                    <Button
                      className={this.styles.menuItem}
                      key={index}
                      style={{
                        width: this.menuItemWidth,
                        height: this.menuItemWidth,
                        transform: 'translate(' + x + 'px, ' + y + 'px)'
                      }}
                      {...item.containerProps}
                    >
                      {item.body}
                    </Button>
                  )
                })}
              </div>
            </div>
          </ClickAwayListener>
        </section>
        <section className={this.styles.emoteMenuSidebar}>
          <ScrollableElement height={400}>
            <Button className={this.styles.menuItem} onClick={this.openEmoteMenu}>
              <img src="/static/EmoteIcon.svg" alt="E" />
            </Button>
          </ScrollableElement>
          {/* <div className={this.styles.jumpContainer}>
              <Button
                  className={this.styles.menuItem}
                  onMouseDown={jumpStart}
                  onMouseUp={jumpStop}
              >
                  <img src="/static/Jump.svg" alt="Jump" />
              </Button>
            </div> */}
        </section>
      </>
    )
  }
}

export default EmoteMenuCore
