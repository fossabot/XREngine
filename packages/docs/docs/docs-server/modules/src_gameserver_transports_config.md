---
id: "src_gameserver_transports_config"
title: "Module: src/gameserver/transports/config"
sidebar_label: "src/gameserver/transports/config"
custom_edit_url: null
hide_title: true
---

# Module: src/gameserver/transports/config

## Variables

### config

• `Const` **config**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`httpPeerStale` | *number* |
`mediasoup` | *object* |
`mediasoup.router` | *object* |
`mediasoup.router.mediaCodecs` | ({ `channels`: *number* = 2; `clockRate`: *number* = 48000; `kind`: *string* = "audio"; `mimeType`: *string* = "audio/opus"; `parameters`: *undefined*  } \| { `channels`: *undefined* = 2; `clockRate`: *number* = 90000; `kind`: *string* = "video"; `mimeType`: *string* = "video/VP8"; `parameters`: { `level-asymmetry-allowed`: *undefined* = 1; `packetization-mode`: *undefined* = 1; `profile-level-id`: *undefined* = "4d0032" }  } \| { `channels`: *undefined* = 2; `clockRate`: *number* = 90000; `kind`: *string* = "video"; `mimeType`: *string* = "video/h264"; `parameters`: { `level-asymmetry-allowed`: *number* = 1; `packetization-mode`: *number* = 1; `profile-level-id`: *string* = "4d0032" }  })[] |
`mediasoup.webRtcTransport` | *object* |
`mediasoup.webRtcTransport.initialAvailableOutgoingBitrate` | *number* |
`mediasoup.webRtcTransport.listenIps` | { `announcedIp`: *any* = null; `ip`: *string* = "192.168.0.81" }[] |
`mediasoup.webRtcTransport.maxIncomingBitrate` | *number* |
`mediasoup.worker` | *object* |
`mediasoup.worker.logLevel` | *string* |
`mediasoup.worker.logTags` | *string*[] |
`mediasoup.worker.rtcMaxPort` | *number* |
`mediasoup.worker.rtcMinPort` | *number* |

Defined in: [packages/server/src/gameserver/transports/config.ts:11](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/gameserver/transports/config.ts#L11)

___

### localConfig

• `Const` **localConfig**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`httpPeerStale` | *number* |
`mediasoup` | *object* |
`mediasoup.router` | *object* |
`mediasoup.router.mediaCodecs` | ({ `channels`: *number* = 2; `clockRate`: *number* = 48000; `kind`: *string* = "audio"; `mimeType`: *string* = "audio/opus"; `parameters`: *undefined*  } \| { `channels`: *undefined* = 2; `clockRate`: *number* = 90000; `kind`: *string* = "video"; `mimeType`: *string* = "video/VP8"; `parameters`: { `level-asymmetry-allowed`: *undefined* = 1; `packetization-mode`: *undefined* = 1; `profile-level-id`: *undefined* = "4d0032" }  } \| { `channels`: *undefined* = 2; `clockRate`: *number* = 90000; `kind`: *string* = "video"; `mimeType`: *string* = "video/h264"; `parameters`: { `level-asymmetry-allowed`: *number* = 1; `packetization-mode`: *number* = 1; `profile-level-id`: *string* = "4d0032" }  })[] |
`mediasoup.webRtcTransport` | *object* |
`mediasoup.webRtcTransport.initialAvailableOutgoingBitrate` | *number* |
`mediasoup.webRtcTransport.listenIps` | { `announcedIp`: *any* = null; `ip`: *string* = "192.168.0.81" }[] |
`mediasoup.webRtcTransport.maxIncomingBitrate` | *number* |
`mediasoup.worker` | *object* |
`mediasoup.worker.logLevel` | *string* |
`mediasoup.worker.logTags` | *string*[] |
`mediasoup.worker.rtcMaxPort` | *number* |
`mediasoup.worker.rtcMinPort` | *number* |

Defined in: [packages/server/src/gameserver/transports/config.ts:70](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/gameserver/transports/config.ts#L70)

___

### sctpParameters

• `Const` **sctpParameters**: SctpParameters

Defined in: [packages/server/src/gameserver/transports/config.ts:4](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/gameserver/transports/config.ts#L4)
