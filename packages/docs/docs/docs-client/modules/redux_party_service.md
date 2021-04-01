---
id: "redux_party_service"
title: "Module: redux/party/service"
sidebar_label: "redux/party/service"
custom_edit_url: null
hide_title: true
---

# Module: redux/party/service

## Functions

### createParty

▸ **createParty**(`values`: *any*): *function*

#### Parameters:

Name | Type |
:------ | :------ |
`values` | *any* |

**Returns:** (`dispatch`: *Dispatch*<AnyAction\>) => *Promise*<any\>

Defined in: [packages/client-core/redux/party/service.ts:70](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/client-core/redux/party/service.ts#L70)

___

### getParties

▸ `Const`**getParties**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [packages/client-core/redux/party/service.ts:32](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/client-core/redux/party/service.ts#L32)

___

### getParty

▸ **getParty**(): *function*

**Returns:** (`dispatch`: *Dispatch*<AnyAction\>, `getState`: *any*) => *Promise*<any\>

Defined in: [packages/client-core/redux/party/service.ts:17](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/client-core/redux/party/service.ts#L17)

___

### removeParty

▸ **removeParty**(`partyId`: *string*): *function*

#### Parameters:

Name | Type |
:------ | :------ |
`partyId` | *string* |

**Returns:** (`dispatch`: *Dispatch*<AnyAction\>) => *Promise*<any\>

Defined in: [packages/client-core/redux/party/service.ts:82](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/client-core/redux/party/service.ts#L82)

___

### removePartyUser

▸ **removePartyUser**(`partyUserId`: *string*): *function*

#### Parameters:

Name | Type |
:------ | :------ |
`partyUserId` | *string* |

**Returns:** (`dispatch`: *Dispatch*<AnyAction\>) => *Promise*<any\>

Defined in: [packages/client-core/redux/party/service.ts:102](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/client-core/redux/party/service.ts#L102)

___

### transferPartyOwner

▸ **transferPartyOwner**(`partyUserId`: *string*): *function*

#### Parameters:

Name | Type |
:------ | :------ |
`partyUserId` | *string* |

**Returns:** (`dispatch`: *Dispatch*<AnyAction\>) => *Promise*<any\>

Defined in: [packages/client-core/redux/party/service.ts:113](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/client-core/redux/party/service.ts#L113)
