---
id: "src_services_auth_management_auth_management_class.authmanagement"
title: "Class: Authmanagement"
sidebar_label: "Authmanagement"
custom_edit_url: null
hide_title: true
---

# Class: Authmanagement

[src/services/auth-management/auth-management.class](../modules/src_services_auth_management_auth_management_class.md).Authmanagement

authManagement class for GET, CREATE, UPDATE AND REMOVE.

## Implements

* *ServiceMethods*<Data\>

## Constructors

### constructor

\+ **new Authmanagement**(`options?`: ServiceOptions, `app`: [*Application*](../modules/src_declarations.md#application)): [*Authmanagement*](src_services_auth_management_auth_management_class.authmanagement.md)

#### Parameters:

Name | Type |
:------ | :------ |
`options` | ServiceOptions |
`app` | [*Application*](../modules/src_declarations.md#application) |

**Returns:** [*Authmanagement*](src_services_auth_management_auth_management_class.authmanagement.md)

Defined in: [packages/server/src/services/auth-management/auth-management.class.ts:15](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/auth-management/auth-management.class.ts#L15)

## Properties

### app

• **app**: [*Application*](../modules/src_declarations.md#application)

Defined in: [packages/server/src/services/auth-management/auth-management.class.ts:13](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/auth-management/auth-management.class.ts#L13)

___

### docs

• **docs**: *any*

Defined in: [packages/server/src/services/auth-management/auth-management.class.ts:15](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/auth-management/auth-management.class.ts#L15)

___

### options

• **options**: ServiceOptions

Defined in: [packages/server/src/services/auth-management/auth-management.class.ts:14](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/auth-management/auth-management.class.ts#L14)

## Methods

### create

▸ **create**(`data`: Data, `params?`: Params): *Promise*<Data\>

A function whivh create new auth

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`data` | Data | wich will be used for creating new auth   |
`params?` | Params |  |

**Returns:** *Promise*<Data\>

Implementation of: void

Defined in: [packages/server/src/services/auth-management/auth-management.class.ts:56](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/auth-management/auth-management.class.ts#L56)

___

### find

▸ **find**(`params?`: Params): *Promise*<Data[] \| Paginated<Data\>\>

A function which help to find all auth

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type |
:------ | :------ |
`params?` | Params |

**Returns:** *Promise*<Data[] \| Paginated<Data\>\>

{@Array} all listed auth

Implementation of: void

Defined in: [packages/server/src/services/auth-management/auth-management.class.ts:30](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/auth-management/auth-management.class.ts#L30)

___

### get

▸ **get**(`id`: Id, `params?`: Params): *Promise*<Data\>

A function which display specific auth

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`id` | Id | of specific auth   |
`params?` | Params |  |

**Returns:** *Promise*<Data\>

{@Object} contain single auth

Implementation of: void

Defined in: [packages/server/src/services/auth-management/auth-management.class.ts:43](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/auth-management/auth-management.class.ts#L43)

___

### patch

▸ **patch**(`id`: Id, `data`: Data, `params?`: Params): *Promise*<Data\>

A function which update auth

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`id` | Id |  |
`data` | Data | of updating auth   |
`params?` | Params |  |

**Returns:** *Promise*<Data\>

{@Object} data which contains auth

Implementation of: void

Defined in: [packages/server/src/services/auth-management/auth-management.class.ts:85](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/auth-management/auth-management.class.ts#L85)

___

### remove

▸ **remove**(`id`: Id, `params?`: Params): *Promise*<Data\>

A function which remove specific auth

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`id` | Id | of specific auth   |
`params?` | Params |  |

**Returns:** *Promise*<Data\>

id

Implementation of: void

Defined in: [packages/server/src/services/auth-management/auth-management.class.ts:96](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/auth-management/auth-management.class.ts#L96)

___

### update

▸ **update**(`id`: Id, `data`: Data, `params?`: Params): *Promise*<Data\>

A function which update auth

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`id` | Id |  |
`data` | Data | for updating auth   |
`params?` | Params |  |

**Returns:** *Promise*<Data\>

Implementation of: void

Defined in: [packages/server/src/services/auth-management/auth-management.class.ts:73](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/auth-management/auth-management.class.ts#L73)
