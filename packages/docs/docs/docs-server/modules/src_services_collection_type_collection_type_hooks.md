---
id: "src_services_collection_type_collection_type_hooks"
title: "Module: src/services/collection-type/collection-type.hooks"
sidebar_label: "src/services/collection-type/collection-type.hooks"
custom_edit_url: null
hide_title: true
---

# Module: src/services/collection-type/collection-type.hooks

## Properties

### default

• **default**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`after` | *object* |
`after.all` | *any*[] |
`after.create` | (`context`: *any*) => *Promise*<void\>[] |
`after.find` | *any*[] |
`after.get` | *any*[] |
`after.patch` | *any*[] |
`after.remove` | *any*[] |
`after.update` | *any*[] |
`before` | *object* |
`before.all` | *any*[] |
`before.create` | *any*[] |
`before.find` | *any*[] |
`before.get` | *any*[] |
`before.patch` | *Hook*<any, Service<any\>\>[] |
`before.remove` | *any*[] |
`before.update` | *Hook*<any, Service<any\>\>[] |
`error` | *object* |
`error.all` | *any*[] |
`error.create` | *any*[] |
`error.find` | *any*[] |
`error.get` | *any*[] |
`error.patch` | *any*[] |
`error.remove` | *any*[] |
`error.update` | *any*[] |
