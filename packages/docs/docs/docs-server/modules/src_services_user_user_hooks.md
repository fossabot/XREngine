---
id: "src_services_user_user_hooks"
title: "Module: src/services/user/user.hooks"
sidebar_label: "src/services/user/user.hooks"
custom_edit_url: null
hide_title: true
---

# Module: src/services/user/user.hooks

## Properties

### default

• **default**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`after` | *object* |
`after.all` | *any*[] |
`after.create` | (`context`: *HookContext*<any, Service<any\>\>) => *Promise*<HookContext<any, Service<any\>\>\>[] |
`after.find` | (`context`: *HookContext*<any, Service<any\>\>) => *Promise*<HookContext<any, Service<any\>\>\>[] |
`after.get` | (`context`: *HookContext*<any, Service<any\>\>) => *Promise*<HookContext<any, Service<any\>\>\>[] |
`after.patch` | *any*[] |
`after.remove` | *any*[] |
`after.update` | *any*[] |
`before` | *object* |
`before.all` | (`context`: *HookContext*<any, Service<any\>\>) => *Promise*<HookContext<any, Service<any\>\>\>[] |
`before.create` | *any*[] |
`before.find` | *any*[] |
`before.get` | *any*[] |
`before.patch` | *any*[] |
`before.remove` | *any*[] |
`before.update` | *any*[] |
`error` | *object* |
`error.all` | *any*[] |
`error.create` | *any*[] |
`error.find` | *any*[] |
`error.get` | *any*[] |
`error.patch` | *any*[] |
`error.remove` | *any*[] |
`error.update` | *any*[] |
