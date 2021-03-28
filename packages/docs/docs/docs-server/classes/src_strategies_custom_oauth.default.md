---
id: "src_strategies_custom_oauth.default"
title: "Class: default"
sidebar_label: "default"
custom_edit_url: null
hide_title: true
---

# Class: default

[src/strategies/custom-oauth](../modules/src_strategies_custom_oauth.md).default

## Hierarchy

* *OAuthStrategy*

  ↳ **default**

  ↳↳ [*default*](src_strategies_facebook.default.md)

  ↳↳ [*default*](src_strategies_github.default.md)

  ↳↳ [*default*](src_strategies_google.default.md)

  ↳↳ [*default*](src_strategies_linkedin.default.md)

  ↳↳ [*default*](src_strategies_twitter.default.md)

## Constructors

### constructor

\+ **new default**(): [*default*](src_strategies_custom_oauth.default.md)

**Returns:** [*default*](src_strategies_custom_oauth.default.md)

Inherited from: void

## Properties

### app

• `Optional` **app**: *Application*<{}\>

Inherited from: void

Defined in: node_modules/@feathersjs/authentication/lib/strategy.d.ts:5

___

### authentication

• `Optional` **authentication**: *AuthenticationBase*

Inherited from: void

Defined in: node_modules/@feathersjs/authentication/lib/strategy.d.ts:4

___

### name

• `Optional` **name**: *string*

Inherited from: void

Defined in: node_modules/@feathersjs/authentication/lib/strategy.d.ts:6

## Accessors

### configuration

• get **configuration**(): *any*

**Returns:** *any*

Defined in: node_modules/@feathersjs/authentication-oauth/lib/strategy.d.ts:8

___

### entityId

• get **entityId**(): *string*

**Returns:** *string*

Defined in: node_modules/@feathersjs/authentication-oauth/lib/strategy.d.ts:9

___

### entityService

• get **entityService**(): *Service*<any\>

**Returns:** *Service*<any\>

Defined in: node_modules/@feathersjs/authentication/lib/strategy.d.ts:11

## Methods

### authenticate

▸ **authenticate**(`authentication`: AuthenticationRequest, `originalParams`: Params): *Promise*<{ [x: string]: *any*; `authentication`: { `strategy`: *string*  }  }\>

#### Parameters:

Name | Type |
:------ | :------ |
`authentication` | AuthenticationRequest |
`originalParams` | Params |

**Returns:** *Promise*<{ [x: string]: *any*; `authentication`: { `strategy`: *string*  }  }\>

Inherited from: void

Defined in: node_modules/@feathersjs/authentication-oauth/lib/strategy.d.ts:23

___

### createEntity

▸ **createEntity**(`profile`: OAuthProfile, `params`: Params): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`profile` | OAuthProfile |
`params` | Params |

**Returns:** *Promise*<any\>

Inherited from: void

Defined in: node_modules/@feathersjs/authentication-oauth/lib/strategy.d.ts:20

___

### findEntity

▸ **findEntity**(`profile`: OAuthProfile, `params`: Params): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`profile` | OAuthProfile |
`params` | Params |

**Returns:** *Promise*<any\>

Inherited from: void

Defined in: node_modules/@feathersjs/authentication-oauth/lib/strategy.d.ts:19

___

### getCurrentEntity

▸ **getCurrentEntity**(`params`: Params): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`params` | Params |

**Returns:** *Promise*<any\>

Inherited from: void

Defined in: node_modules/@feathersjs/authentication-oauth/lib/strategy.d.ts:17

___

### getEntity

▸ **getEntity**(`result`: *any*, `params`: Params): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`result` | *any* |
`params` | Params |

**Returns:** *Promise*<any\>

Inherited from: void

Defined in: node_modules/@feathersjs/authentication-oauth/lib/strategy.d.ts:22

___

### getEntityData

▸ **getEntityData**(`profile`: OAuthProfile, `_existingEntity`: *any*, `_params`: Params): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`profile` | OAuthProfile |
`_existingEntity` | *any* |
`_params` | Params |

**Returns:** *Promise*<any\>

Overrides: void

Defined in: [packages/server/src/strategies/custom-oauth.ts:12](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/strategies/custom-oauth.ts#L12)

___

### getEntityQuery

▸ **getEntityQuery**(`profile`: OAuthProfile, `_params`: Params): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`profile` | OAuthProfile |
`_params` | Params |

**Returns:** *Promise*<any\>

Overrides: void

Defined in: [packages/server/src/strategies/custom-oauth.ts:6](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/strategies/custom-oauth.ts#L6)

___

### getProfile

▸ **getProfile**(`data`: AuthenticationRequest, `_params`: Params): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`data` | AuthenticationRequest |
`_params` | Params |

**Returns:** *Promise*<any\>

Inherited from: void

Defined in: node_modules/@feathersjs/authentication-oauth/lib/strategy.d.ts:16

___

### getRedirect

▸ **getRedirect**(`data`: Error \| AuthenticationResult, `params?`: Params): *Promise*<string\>

#### Parameters:

Name | Type |
:------ | :------ |
`data` | Error \| AuthenticationResult |
`params?` | Params |

**Returns:** *Promise*<string\>

Inherited from: void

Defined in: node_modules/@feathersjs/authentication-oauth/lib/strategy.d.ts:18

___

### setApplication

▸ **setApplication**(`app`: *Application*<{}\>): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`app` | *Application*<{}\> |

**Returns:** *void*

Inherited from: void

Defined in: node_modules/@feathersjs/authentication/lib/strategy.d.ts:8

___

### setAuthentication

▸ **setAuthentication**(`auth`: *AuthenticationBase*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`auth` | *AuthenticationBase* |

**Returns:** *void*

Inherited from: void

Defined in: node_modules/@feathersjs/authentication/lib/strategy.d.ts:7

___

### setName

▸ **setName**(`name`: *string*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`name` | *string* |

**Returns:** *void*

Inherited from: void

Defined in: node_modules/@feathersjs/authentication/lib/strategy.d.ts:9

___

### updateEntity

▸ **updateEntity**(`entity`: *any*, `profile`: OAuthProfile, `params`: Params): *Promise*<any[]\>

#### Parameters:

Name | Type |
:------ | :------ |
`entity` | *any* |
`profile` | OAuthProfile |
`params` | Params |

**Returns:** *Promise*<any[]\>

Inherited from: void

Defined in: node_modules/@feathersjs/authentication-oauth/lib/strategy.d.ts:21
