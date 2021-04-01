---
id: "src_services_auth_management_auth_management_utils"
title: "Module: src/services/auth-management/auth-management.utils"
sidebar_label: "src/services/auth-management/auth-management.utils"
custom_edit_url: null
hide_title: true
---

# Module: src/services/auth-management/auth-management.utils

## Functions

### extractLoggedInUserFromParams

▸ `Const`**extractLoggedInUserFromParams**(`params`: Params): *any*

This method will extract the loggedIn User from params

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type |
:------ | :------ |
`params` | Params |

**Returns:** *any*

extracted user

Defined in: [packages/server/src/services/auth-management/auth-management.utils.ts:77](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/auth-management/auth-management.utils.ts#L77)

___

### getInviteLink

▸ **getInviteLink**(`type`: *string*, `id`: *string*, `passcode`: *string*): *string*

A method which get an invite link

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`type` | *string* |  |
`id` | *string* | of accept invite   |
`passcode` | *string* |  |

**Returns:** *string*

invite link

Defined in: [packages/server/src/services/auth-management/auth-management.utils.ts:28](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/auth-management/auth-management.utils.ts#L28)

___

### getLink

▸ **getLink**(`type`: *string*, `hash`: *string*, `subscriptionId?`: *string*): *string*

A method which get link

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`type` | *string* |  |
`hash` | *string* | hashed link   |
`subscriptionId?` | *string* | - |

**Returns:** *string*

login url

Defined in: [packages/server/src/services/auth-management/auth-management.utils.ts:13](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/auth-management/auth-management.utils.ts#L13)

___

### sendEmail

▸ **sendEmail**(`app`: [*Application*](src_declarations.md#application), `email`: *any*): *Promise*<void\>

A method which send an email

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`app` | [*Application*](src_declarations.md#application) |  |
`email` | *any* | which is going to recieve message Text message links can't have HTML escaped ampersands.   |

**Returns:** *Promise*<void\>

Defined in: [packages/server/src/services/auth-management/auth-management.utils.ts:40](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/auth-management/auth-management.utils.ts#L40)

___

### sendSms

▸ `Const`**sendSms**(`app`: [*Application*](src_declarations.md#application), `sms`: *any*): *Promise*<void\>

A function which send sms

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`app` | [*Application*](src_declarations.md#application) |  |
`sms` | *any* | text which is going to be sent   |

**Returns:** *Promise*<void\>

Defined in: [packages/server/src/services/auth-management/auth-management.utils.ts:62](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/auth-management/auth-management.utils.ts#L62)
