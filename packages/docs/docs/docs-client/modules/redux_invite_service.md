---
id: "redux_invite_service"
title: "Module: redux/invite/service"
sidebar_label: "redux/invite/service"
custom_edit_url: null
hide_title: true
---

# Module: redux/invite/service

## Functions

### acceptInvite

▸ **acceptInvite**(`inviteId`: *string*, `passcode`: *string*): *function*

#### Parameters:

Name | Type |
:------ | :------ |
`inviteId` | *string* |
`passcode` | *string* |

**Returns:** (`dispatch`: *Dispatch*<AnyAction\>) => *Promise*<any\>

Defined in: [packages/client-core/redux/invite/service.ts:122](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/client-core/redux/invite/service.ts#L122)

___

### declineInvite

▸ **declineInvite**(`invite`: Invite): *function*

#### Parameters:

Name | Type |
:------ | :------ |
`invite` | Invite |

**Returns:** (`dispatch`: *Dispatch*<AnyAction\>) => *Promise*<any\>

Defined in: [packages/client-core/redux/invite/service.ts:137](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/client-core/redux/invite/service.ts#L137)

___

### removeInvite

▸ **removeInvite**(`invite`: Invite): *function*

#### Parameters:

Name | Type |
:------ | :------ |
`invite` | Invite |

**Returns:** (`dispatch`: *Dispatch*<AnyAction\>) => *Promise*<any\>

Defined in: [packages/client-core/redux/invite/service.ts:111](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/client-core/redux/invite/service.ts#L111)

___

### retrieveReceivedInvites

▸ **retrieveReceivedInvites**(`skip?`: *number*, `limit?`: *number*): *function*

#### Parameters:

Name | Type |
:------ | :------ |
`skip?` | *number* |
`limit?` | *number* |

**Returns:** (`dispatch`: *Dispatch*<AnyAction\>, `getState`: *any*) => *Promise*<any\>

Defined in: [packages/client-core/redux/invite/service.ts:73](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/client-core/redux/invite/service.ts#L73)

___

### retrieveSentInvites

▸ **retrieveSentInvites**(`skip?`: *number*, `limit?`: *number*): *function*

#### Parameters:

Name | Type |
:------ | :------ |
`skip?` | *number* |
`limit?` | *number* |

**Returns:** (`dispatch`: *Dispatch*<AnyAction\>, `getState`: *any*) => *Promise*<any\>

Defined in: [packages/client-core/redux/invite/service.ts:92](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/client-core/redux/invite/service.ts#L92)

___

### sendInvite

▸ **sendInvite**(`data`: *any*): *function*

#### Parameters:

Name | Type |
:------ | :------ |
`data` | *any* |

**Returns:** (`dispatch`: *Dispatch*<AnyAction\>, `getState`: *any*) => *Promise*<void\>

Defined in: [packages/client-core/redux/invite/service.ts:27](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/client-core/redux/invite/service.ts#L27)

___

### updateInviteTarget

▸ **updateInviteTarget**(`targetObjectType?`: *string*, `targetObjectId?`: *string*): *function*

#### Parameters:

Name | Type |
:------ | :------ |
`targetObjectType?` | *string* |
`targetObjectId?` | *string* |

**Returns:** (`dispatch`: *Dispatch*<AnyAction\>) => *Promise*<any\>

Defined in: [packages/client-core/redux/invite/service.ts:147](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/client-core/redux/invite/service.ts#L147)
