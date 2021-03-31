---
id: "src_services_location_location_class.location"
title: "Class: Location"
sidebar_label: "Location"
custom_edit_url: null
hide_title: true
---

# Class: Location

[src/services/location/location.class](../modules/src_services_location_location_class.md).Location

## Hierarchy

* *Service*

  ↳ **Location**

## Constructors

### constructor

\+ **new Location**(`options`: *Partial*<SequelizeServiceOptions\>, `app`: [*Application*](../modules/src_declarations.md#application)): [*Location*](src_services_location_location_class.location.md)

#### Parameters:

Name | Type |
:------ | :------ |
`options` | *Partial*<SequelizeServiceOptions\> |
`app` | [*Application*](../modules/src_declarations.md#application) |

**Returns:** [*Location*](src_services_location_location_class.location.md)

Overrides: void

Defined in: [packages/server/src/services/location/location.class.ts:10](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/location/location.class.ts#L10)

## Properties

### Model

• **Model**: *any*

Inherited from: void

Defined in: node_modules/feathers-sequelize/types/index.d.ts:11

___

### app

• **app**: [*Application*](../modules/src_declarations.md#application)

Defined in: [packages/server/src/services/location/location.class.ts:9](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/location/location.class.ts#L9)

___

### docs

• **docs**: *any*

Defined in: [packages/server/src/services/location/location.class.ts:10](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/location/location.class.ts#L10)

___

### options

• **options**: SequelizeServiceOptions

Inherited from: void

Defined in: node_modules/feathers-sequelize/types/index.d.ts:12

## Accessors

### events

• get **events**(): *string*[]

**Returns:** *string*[]

Defined in: node_modules/@feathersjs/adapter-commons/lib/service.d.ts:86

___

### id

• get **id**(): *string*

**Returns:** *string*

Defined in: node_modules/@feathersjs/adapter-commons/lib/service.d.ts:85

## Methods

### \_create

▸ **_create**(`data`: *Partial*<any\> \| *Partial*<any\>[], `params?`: Params): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`data` | *Partial*<any\> \| *Partial*<any\>[] |
`params?` | Params |

**Returns:** *Promise*<any\>

Inherited from: void

Defined in: node_modules/feathers-sequelize/types/index.d.ts:20

___

### \_find

▸ **_find**(`params?`: Params): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`params?` | Params |

**Returns:** *Promise*<any\>

Inherited from: void

Defined in: node_modules/feathers-sequelize/types/index.d.ts:18

___

### \_get

▸ **_get**(`id`: Id, `params?`: Params): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | Id |
`params?` | Params |

**Returns:** *Promise*<any\>

Inherited from: void

Defined in: node_modules/feathers-sequelize/types/index.d.ts:19

___

### \_patch

▸ **_patch**(`id`: Id, `data`: *Partial*<any\>, `params?`: Params): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | Id |
`data` | *Partial*<any\> |
`params?` | Params |

**Returns:** *Promise*<any\>

Inherited from: void

Defined in: node_modules/feathers-sequelize/types/index.d.ts:22

___

### \_remove

▸ **_remove**(`id`: Id, `params?`: Params): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | Id |
`params?` | Params |

**Returns:** *Promise*<any\>

Inherited from: void

Defined in: node_modules/feathers-sequelize/types/index.d.ts:23

___

### \_update

▸ **_update**(`id`: Id, `data`: *any*, `params?`: Params): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | Id |
`data` | *any* |
`params?` | Params |

**Returns:** *Promise*<any\>

Inherited from: void

Defined in: node_modules/feathers-sequelize/types/index.d.ts:21

___

### allowsMulti

▸ **allowsMulti**(`method`: *string*): *boolean*

#### Parameters:

Name | Type |
:------ | :------ |
`method` | *string* |

**Returns:** *boolean*

Inherited from: void

Defined in: node_modules/@feathersjs/adapter-commons/lib/service.d.ts:95

___

### create

▸ **create**(`data`: *any*, `params`: Params): *Promise*<any\>

A function which is used to create new location

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`data` | *any* | of location   |
`params` | Params |  |

**Returns:** *Promise*<any\>

new location object

Overrides: void

Defined in: [packages/server/src/services/location/location.class.ts:200](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/location/location.class.ts#L200)

___

### createInstances

▸ **createInstances**(`__namedParameters`: { `id`: *any* ; `instance`: *any*  }): *Promise*<any\>

A function which is used to create new instance

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type |
:------ | :------ |
`__namedParameters` | *object* |
`__namedParameters.id` | *any* |
`__namedParameters.instance` | *any* |

**Returns:** *Promise*<any\>

Defined in: [packages/server/src/services/location/location.class.ts:63](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/location/location.class.ts#L63)

___

### createNewLocation

▸ **createNewLocation**(`__namedParameters`: { `data`: *any* ; `params`: Params  }): *Promise*<any\>

A method which is used to create new location

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type |
:------ | :------ |
`__namedParameters` | *object* |
`__namedParameters.data` | *any* |
`__namedParameters.params` | Params |

**Returns:** *Promise*<any\>

Defined in: [packages/server/src/services/location/location.class.ts:47](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/location/location.class.ts#L47)

___

### filterQuery

▸ **filterQuery**(`params?`: Params, `opts?`: *any*): { [key: string]: *any*;  } & { `paginate`: *false* \| *Pick*<PaginationOptions, *max*\> \| { `default?`: *number* ; `max?`: *number*  }  }

#### Parameters:

Name | Type |
:------ | :------ |
`params?` | Params |
`opts?` | *any* |

**Returns:** { [key: string]: *any*;  } & { `paginate`: *false* \| *Pick*<PaginationOptions, *max*\> \| { `default?`: *number* ; `max?`: *number*  }  }

Inherited from: void

Defined in: node_modules/@feathersjs/adapter-commons/lib/service.d.ts:87

___

### find

▸ **find**(`params`: Params): *Promise*<any\>

A function which help to find and display all locations

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`params` | Params | of query with limit number and skip number   |

**Returns:** *Promise*<any\>

{@Array} of all locations

Overrides: void

Defined in: [packages/server/src/services/location/location.class.ts:107](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/location/location.class.ts#L107)

___

### get

▸ **get**(`id`: Id, `params?`: Params): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | Id |
`params?` | Params |

**Returns:** *Promise*<any\>

Inherited from: void

Defined in: node_modules/@feathersjs/adapter-commons/lib/service.d.ts:97

___

### getModel

▸ **getModel**(`params`: Params): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`params` | Params |

**Returns:** *any*

Inherited from: void

Defined in: node_modules/feathers-sequelize/types/index.d.ts:16

___

### patch

▸ **patch**(`id`: *string*, `data`: *any*, `params`: Params): *Promise*<any\>

A function which is used to update location

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`id` | *string* | of location to update   |
`data` | *any* | of location going to be updated   |
`params` | Params |  |

**Returns:** *Promise*<any\>

updated location

Overrides: void

Defined in: [packages/server/src/services/location/location.class.ts:244](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/location/location.class.ts#L244)

___

### remove

▸ **remove**(`id`: *string*, `params`: Params): *Promise*<any\>

A function which is used to remove location

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`id` | *string* | of location which is going to be removed   |
`params` | Params | which contain user information   |

**Returns:** *Promise*<any\>

{@function} of remove data

Overrides: void

Defined in: [packages/server/src/services/location/location.class.ts:280](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/location/location.class.ts#L280)

___

### update

▸ **update**(`id`: Id, `data`: *any*, `params?`: Params): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | Id |
`data` | *any* |
`params?` | Params |

**Returns:** *Promise*<any\>

Inherited from: void

Defined in: node_modules/@feathersjs/adapter-commons/lib/service.d.ts:99
