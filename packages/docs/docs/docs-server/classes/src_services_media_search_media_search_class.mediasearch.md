---
id: "src_services_media_search_media_search_class.mediasearch"
title: "Class: MediaSearch"
sidebar_label: "MediaSearch"
custom_edit_url: null
hide_title: true
---

# Class: MediaSearch

[src/services/media-search/media-search.class](../modules/src_services_media_search_media_search_class.md).MediaSearch

A class for media search service

**`author`** Vyacheslav Solovjov

## Implements

* *ServiceMethods*<Data\>

## Constructors

### constructor

\+ **new MediaSearch**(`options`: ServiceOptions, `app`: [*Application*](../modules/src_declarations.md#application)): [*MediaSearch*](src_services_media_search_media_search_class.mediasearch.md)

#### Parameters:

Name | Type |
:------ | :------ |
`options` | ServiceOptions |
`app` | [*Application*](../modules/src_declarations.md#application) |

**Returns:** [*MediaSearch*](src_services_media_search_media_search_class.mediasearch.md)

Defined in: [packages/server/src/services/media-search/media-search.class.ts:22](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/media-search/media-search.class.ts#L22)

## Properties

### app

• **app**: [*Application*](../modules/src_declarations.md#application)

Defined in: [packages/server/src/services/media-search/media-search.class.ts:18](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/media-search/media-search.class.ts#L18)

___

### docs

• **docs**: *any*

Defined in: [packages/server/src/services/media-search/media-search.class.ts:20](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/media-search/media-search.class.ts#L20)

___

### options

• **options**: ServiceOptions

Defined in: [packages/server/src/services/media-search/media-search.class.ts:19](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/media-search/media-search.class.ts#L19)

___

### pageSize

• `Private` `Readonly` **pageSize**: *24*= 24

Defined in: [packages/server/src/services/media-search/media-search.class.ts:22](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/media-search/media-search.class.ts#L22)

## Methods

### create

▸ **create**(`data`: Data, `params?`: Params): *Promise*<Data\>

NB: This function doesn't do anything

#### Parameters:

Name | Type |
:------ | :------ |
`data` | Data |
`params?` | Params |

**Returns:** *Promise*<Data\>

Implementation of: void

Defined in: [packages/server/src/services/media-search/media-search.class.ts:90](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/media-search/media-search.class.ts#L90)

___

### find

▸ **find**(`params?`: Params): *Promise*<Data[] \| Paginated<Data\>\>

A function which find all media and display it

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`params?` | Params | with source of media   |

**Returns:** *Promise*<Data[] \| Paginated<Data\>\>

{@Array} of media

Implementation of: void

Defined in: [packages/server/src/services/media-search/media-search.class.ts:36](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/media-search/media-search.class.ts#L36)

___

### get

▸ **get**(`id`: Id, `params?`: Params): *Promise*<Data\>

A function which is used to find specific media

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`id` | Id | of media   |
`params?` | Params |  |

**Returns:** *Promise*<Data\>

{@Object} with id and message

Implementation of: void

Defined in: [packages/server/src/services/media-search/media-search.class.ts:77](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/media-search/media-search.class.ts#L77)

___

### patch

▸ **patch**(`id`: Id, `data`: Data, `params?`: Params): *Promise*<Data\>

A function used to update media

#### Parameters:

Name | Type |
:------ | :------ |
`id` | Id |
`data` | Data |
`params?` | Params |

**Returns:** *Promise*<Data\>

data

Implementation of: void

Defined in: [packages/server/src/services/media-search/media-search.class.ts:114](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/media-search/media-search.class.ts#L114)

___

### remove

▸ **remove**(`id`: Id, `params?`: Params): *Promise*<Data\>

A function used to remove specific media

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`id` | Id | for specific media   |
`params?` | Params |  |

**Returns:** *Promise*<Data\>

id

Implementation of: void

Defined in: [packages/server/src/services/media-search/media-search.class.ts:125](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/media-search/media-search.class.ts#L125)

___

### update

▸ **update**(`id`: Id, `data`: Data, `params?`: Params): *Promise*<Data\>

A function used to update media

#### Parameters:

Name | Type |
:------ | :------ |
`id` | Id |
`data` | Data |
`params?` | Params |

**Returns:** *Promise*<Data\>

data

Implementation of: void

Defined in: [packages/server/src/services/media-search/media-search.class.ts:103](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/media-search/media-search.class.ts#L103)
