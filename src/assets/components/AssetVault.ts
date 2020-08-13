import { Component, Types } from "../../ecs"
import { AssetMap, AssetId, AssetUrl } from "../types/AssetTypes"

// This component should only be used once per game
export default class AssetVault extends Component<AssetVault> {
  static instance: AssetVault
  assets: AssetMap
  assetsLoaded!: boolean

  constructor() {
    super()
    AssetVault.instance = this
  }

  static schema = {
    assetsLoaded: { type: Types.Boolean, default: false },
    assets: { type: Types.Ref, default: new Map<AssetId, AssetUrl>() }
  }
}
