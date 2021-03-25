---
id: "client_core_redux_instanceconnection_reducers"
title: "Module: client-core/redux/instanceConnection/reducers"
sidebar_label: "client-core/redux/instanceConnection/reducers"
custom_edit_url: null
hide_title: true
---

# Module: client-core/redux/instanceConnection/reducers

## Variables

### initialState

• `Const` **initialState**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`channelId` | *string* |
`connected` | *boolean* |
`instance` | *object* |
`instance.ipAddress` | *string* |
`instance.port` | *string* |
`instanceProvisioned` | *boolean* |
`instanceProvisioning` | *boolean* |
`instanceServerConnecting` | *boolean* |
`locationId` | *string* |
`readyToConnect` | *boolean* |
`sceneId` | *string* |
`socket` | *object* |
`updateNeeded` | *boolean* |

Defined in: [packages/client-core/redux/instanceConnection/reducers.ts:17](https://github.com/xr3ngine/xr3ngine/blob/5c3dcaef1/packages/client-core/redux/instanceConnection/reducers.ts#L17)

## Functions

### default

▸ `Const`**default**(`state?`: *any*, `action`: [*InstanceServerAction*](client_core_redux_instanceconnection_actions.md#instanceserveraction)): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`state` | *any* |
`action` | [*InstanceServerAction*](client_core_redux_instanceconnection_actions.md#instanceserveraction) |

**Returns:** *any*

Defined in: [packages/client-core/redux/instanceConnection/reducers.ts:38](https://github.com/xr3ngine/xr3ngine/blob/5c3dcaef1/packages/client-core/redux/instanceConnection/reducers.ts#L38)
