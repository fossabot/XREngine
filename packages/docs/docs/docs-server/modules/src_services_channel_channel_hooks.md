---
id: "src_services_channel_channel_hooks"
title: "Module: src/services/channel/channel.hooks"
sidebar_label: "src/services/channel/channel.hooks"
custom_edit_url: null
hide_title: true
---

# Module: src/services/channel/channel.hooks

## Properties

### default

• **default**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`after` | *object* |
`after.all` | *any*[] |
`after.create` | *any*[] |
`after.find` | *any*[] |
`after.get` | *any*[] |
`after.patch` | *any*[] |
`after.remove` | *any*[] |
`after.update` | *any*[] |
`before` | *object* |
`before.all` | (`context`: *HookContext*<any, Service<any\>\>) => *Promise*<HookContext<any, Service<any\>\>\>[] |
`before.create` | *Hook*<any, Service<any\>\>[] |
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
