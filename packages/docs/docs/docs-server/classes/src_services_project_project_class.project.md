---
id: "src_services_project_project_class.project"
title: "Class: Project"
sidebar_label: "Project"
custom_edit_url: null
hide_title: true
---

# Class: Project

[src/services/project/project.class](../modules/src_services_project_project_class.md).Project

## Implements

* *ServiceMethods*<Data\>

## Constructors

### constructor

\+ **new Project**(`options?`: ServiceOptions, `app`: [*Application*](../modules/src_declarations.md#application)): [*Project*](src_services_project_project_class.project.md)

#### Parameters:

Name | Type |
:------ | :------ |
`options` | ServiceOptions |
`app` | [*Application*](../modules/src_declarations.md#application) |

**Returns:** [*Project*](src_services_project_project_class.project.md)

Defined in: [packages/server/src/services/project/project.class.ts:26](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/project/project.class.ts#L26)

## Properties

### app

• **app**: [*Application*](../modules/src_declarations.md#application)

Defined in: [packages/server/src/services/project/project.class.ts:23](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/project/project.class.ts#L23)

___

### docs

• **docs**: *any*

Defined in: [packages/server/src/services/project/project.class.ts:26](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/project/project.class.ts#L26)

___

### models

• **models**: *any*

Defined in: [packages/server/src/services/project/project.class.ts:25](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/project/project.class.ts#L25)

___

### options

• **options**: ServiceOptions

Defined in: [packages/server/src/services/project/project.class.ts:24](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/project/project.class.ts#L24)

## Methods

### create

▸ **create**(`data`: *any*, `params`: Params): *Promise*<any\>

A function which is used to create new project

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`data` | *any* | used to create new project   |
`params` | Params | contains user info   |

**Returns:** *Promise*<any\>

{@Object} of created new project

Implementation of: void

Defined in: [packages/server/src/services/project/project.class.ts:101](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/project/project.class.ts#L101)

___

### find

▸ **find**(`params`: Params): *Promise*<any\>

A function which is used to display all projects

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`params` | Params | contains current user   |

**Returns:** *Promise*<any\>

{@Object} contains all project

Implementation of: void

Defined in: [packages/server/src/services/project/project.class.ts:41](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/project/project.class.ts#L41)

___

### get

▸ **get**(`id`: Id, `params`: Params): *Promise*<any\>

A function which is used to find specific project

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`id` | Id | of single project   |
`params` | Params | contains current user   |

**Returns:** *Promise*<any\>

{@Object} contains specific project

Implementation of: void

Defined in: [packages/server/src/services/project/project.class.ts:65](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/project/project.class.ts#L65)

___

### patch

▸ **patch**(`projectId`: Id, `data`: *any*, `params`: Params): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`projectId` | Id |
`data` | *any* |
`params` | Params |

**Returns:** *Promise*<any\>

Implementation of: void

Defined in: [packages/server/src/services/project/project.class.ts:132](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/project/project.class.ts#L132)

___

### reloadProject

▸ `Private`**reloadProject**(`projectId`: *string*, `loadedProject?`: *any*): *Promise*<any\>

A function which is used to reload project

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`projectId` | *string* | of specific project   |
`loadedProject?` | *any* | data of loaded project   |

**Returns:** *Promise*<any\>

{@Object} of loaded Project

Defined in: [packages/server/src/services/project/project.class.ts:292](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/project/project.class.ts#L292)

___

### remove

▸ **remove**(`id`: Id, `params?`: Params): *Promise*<Data\>

A function which is used to remove specific project

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`id` | Id | of specific project   |
`params?` | Params |  |

**Returns:** *Promise*<Data\>

{@Object} of updated project

Implementation of: void

Defined in: [packages/server/src/services/project/project.class.ts:270](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/project/project.class.ts#L270)

___

### update

▸ **update**(`id`: Id, `data`: Data, `params?`: Params): *Promise*<Data\>

A function which is used to update new project

**`author`** Vyacheslav Solovjov

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`id` | Id |  |
`data` | Data | of new project   |
`params?` | Params |  |

**Returns:** *Promise*<Data\>

{@Object} of updated project

Implementation of: void

Defined in: [packages/server/src/services/project/project.class.ts:128](https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/server/src/services/project/project.class.ts#L128)
