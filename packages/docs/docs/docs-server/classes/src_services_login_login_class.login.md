---
id: "src_services_login_login_class.login"
title: "Class: Login"
sidebar_label: "Login"
custom_edit_url: null
hide_title: true
---

# Class: Login

[src/services/login/login.class](../modules/src_services_login_login_class.md).Login

A class for Login service

**`author`** Vyacheslav Solovjov

## Implements

* *ServiceMethods*<Data\>

## Constructors

### constructor

\+ **new Login**(`options?`: ServiceOptions, `app`: [*Application*](../modules/src_declarations.md#application)): [*Login*](src_services_login_login_class.login.md)

#### Parameters:

Name | Type |
:------ | :------ |
`options` | ServiceOptions |
`app` | [*Application*](../modules/src_declarations.md#application) |

**Returns:** [*Login*](src_services_login_login_class.login.md)

Defined in: [packages/server/src/services/login/login.class.ts:17](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/login/login.class.ts#L17)

## Properties

### app

• **app**: [*Application*](../modules/src_declarations.md#application)

Defined in: [packages/server/src/services/login/login.class.ts:15](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/login/login.class.ts#L15)

___

### docs

• **docs**: *any*

Defined in: [packages/server/src/services/login/login.class.ts:17](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/login/login.class.ts#L17)

___

### options

• **options**: ServiceOptions

Defined in: [packages/server/src/services/login/login.class.ts:16](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/login/login.class.ts#L16)

## Methods

### create

▸ **create**(`data`: Data, `params?`: Params): *Promise*<Data\>

A function which is used for login

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`data` | Data | of new login details   |
`params?` | Params | contain user info   |

**Returns:** *Promise*<Data\>

created data

Implementation of: void

Defined in: [packages/server/src/services/login/login.class.ts:82](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/login/login.class.ts#L82)

___

### find

▸ **find**(`params?`: Params): *Promise*<Data[] \| Paginated<Data\>\>

A function which find login details and display it

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type |
:------ | :------ |
`params?` | Params |

**Returns:** *Promise*<Data[] \| Paginated<Data\>\>

{@Array} all login details

Implementation of: void

Defined in: [packages/server/src/services/login/login.class.ts:31](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/login/login.class.ts#L31)

___

### get

▸ **get**(`id`: Id, `params?`: Params): *Promise*<any\>

A function which find specific login details

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`id` | Id | of specific login detail   |
`params?` | Params |  |

**Returns:** *Promise*<any\>

{@token}

Implementation of: void

Defined in: [packages/server/src/services/login/login.class.ts:43](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/login/login.class.ts#L43)

___

### patch

▸ **patch**(`id`: Id, `data`: Data, `params?`: Params): *Promise*<Data\>

A function which is used to update data

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`id` | Id |  |
`data` | Data | to be updated   |
`params?` | Params |  |

**Returns:** *Promise*<Data\>

data

Implementation of: void

Defined in: [packages/server/src/services/login/login.class.ts:111](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/login/login.class.ts#L111)

___

### remove

▸ **remove**(`id`: Id, `params?`: Params): *Promise*<Data\>

A function which is used to remove login details

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`id` | Id | of login to be removed   |
`params?` | Params |  |

**Returns:** *Promise*<Data\>

id

Implementation of: void

Defined in: [packages/server/src/services/login/login.class.ts:123](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/login/login.class.ts#L123)

___

### update

▸ **update**(`id`: Id, `data`: Data, `params?`: Params): *Promise*<Data\>

A function which is used to update login details

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`id` | Id | of login detail   |
`data` | Data | which will be used for updating login   |
`params?` | Params |  |

**Returns:** *Promise*<Data\>

updated data

Implementation of: void

Defined in: [packages/server/src/services/login/login.class.ts:99](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/login/login.class.ts#L99)
