import { System, SystemAttributes } from '../../ecs/classes/System'
import { SoundEffect } from '../components/SoundEffect'
import { BackgroundMusic } from '../components/BackgroundMusic'
import { PlaySoundEffect } from '../components/PlaySoundEffect'
import { SystemUpdateType } from '../../ecs/functions/SystemUpdateType'
import { getMutableComponent } from '../../ecs/functions/EntityFunctions'

/** System class which provides methods for Audio system. */
export class AudioSystem extends System {
  /** Update type of this system. **Default** to
   * {@link ecs/functions/SystemUpdateType.SystemUpdateType.Fixed | Fixed} type. */
  updateType = SystemUpdateType.Fixed

  /** Indicates whether the system is ready or not. */
  audioReady: boolean
  /** Callbacks to be called after system is ready. */
  callbacks: any[]
  /** Queries for different events related to Audio System. */
  queries: any
  /** Audio Element. */
  audio: any
  /** Audio Context. */
  context: AudioContext

  /** Constructs Audio System. */
  constructor (attributes: SystemAttributes = {}) {
    super(attributes)
    this.startAudio = this.startAudio.bind(this)
    this.audioReady = false
    this.callbacks = []
    window.addEventListener('touchstart', this.startAudio, true)
    window.addEventListener('touchend', this.startAudio, true)
    window.addEventListener('click', this.startAudio, true)
  }

  /** Dispose audio system and remove event listeners. */
  dispose (): void {
    this.audioReady = false
    this.callbacks = []
    window.removeEventListener('touchstart', this.startAudio, true)
    window.removeEventListener('touchend', this.startAudio, true)
    window.removeEventListener('click', this.startAudio, true)
  }

  /**
   * Execute the audio system for different events of queries.
   * @param delta time since last frame.
   * @param time current time.
   */
  execute (delta, time): void {
    this.queryResults.sound_effects.added?.forEach(entity => {
      const effect = getMutableComponent(entity, SoundEffect)
      if (effect.src && !this.audio) {
        effect.audio = new Audio()
        effect.audio.addEventListener('loadeddata', () => {
          effect.audio.volume = effect.volume
        })
        effect.audio.src = effect.src
      }
    })
    this.queryResults.music.added?.forEach(entity => {
      this.whenReady(() => this.startBackgroundMusic(entity))
    })
    this.queryResults.music.removed?.forEach(entity => {
      this.stopBackgroundMusic(entity)
    })
    this.queryResults.play.added?.forEach(entity => {
      this.whenReady(() => this.playSoundEffect(entity))
    })
  }

  /**
   * Call the callbacks when system is ready or push callbacks in array otherwise.
   * @param cb Callback to be called when system is ready.
   */
  whenReady (cb): void {
    if (this.audioReady) {
      cb()
    } else {
      this.callbacks.push(cb)
    }
  }

  /** Enable and start audio system. */
  startAudio (): void {
    if (this.audioReady) return
    console.log('starting audio')
    this.audioReady = true
    window.AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (window.AudioContext) {
      this.context = new window.AudioContext()
      // Create empty buffer
      const buffer = this.context.createBuffer(1, 1, 22050)
      const source = this.context.createBufferSource()
      source.buffer = buffer
      // Connect to output (speakers)
      source.connect(this.context.destination)
      // Play sound
      if (source.start) {
        source.start(0)
      } else if ((source as any).play) {
        (source as any).play(0)
      }
    }

    this.callbacks.forEach(cb => cb())
    this.callbacks = null
  }

  /**
   * Start Background music if available.
   * @param ent Entity to get the {@link audio/components/BackgroundMusic.BackgroundMusic | BackgroundMusic} Component.
   */
  startBackgroundMusic (ent): void {
    const music = ent.getComponent(BackgroundMusic)
    if (music.src && !this.audio) {
      music.audio = new Audio()
      music.audio.loop = true
      music.audio.volume = music.volume
      music.audio.addEventListener('loadeddata', () => {
        music.audio.play()
      })
      music.audio.src = music.src
    }
  }

  /**
   * Stop Background Music.
   * @param ent Entity to get the {@link audio/components/BackgroundMusic.BackgroundMusic | BackgroundMusic} Component.
   */
  stopBackgroundMusic (ent): void {
    const music = ent.getComponent(BackgroundMusic)
    if (music && music.audio) {
      music.audio.pause()
    }
  }

  /**
   * Play sound effect.
   * @param ent Entity to get the {@link audio/components/PlaySoundEffect.PlaySoundEffect | PlaySoundEffect} Component.
   */
  playSoundEffect (ent): void {
    const sound = ent.getComponent(SoundEffect)
    sound.audio.play()
    ent.removeComponent(PlaySoundEffect)
  }
}

AudioSystem.queries = {
  sound_effects: {
    components: [SoundEffect],
    listen: {
      added: true
    }
  },
  music: {
    components: [BackgroundMusic],
    listen: {
      added: true,
      removed: true
    }
  },
  play: {
    components: [SoundEffect, PlaySoundEffect],
    listen: {
      added: true
    }
  }
}
