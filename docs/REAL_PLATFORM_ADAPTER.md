# 真实平台接入说明

每个平台新增一个 adapter，实现以下能力：

```ts
interface PlatformAdapter {
  platformId: string;
  validateDevice(platformDeviceId: string): Promise<PlatformDeviceInfo>;
  dial(platformDeviceId: string): Promise<PlatformOperationResult>;
  stress(platformDeviceId: string): Promise<PlatformOperationResult>;
  monitor(platformDeviceId: string): Promise<PlatformMonitorResult>;
}
```

接入流程：

1. 在 `apps/api/src/platforms` 新增平台 adapter。
2. 将平台原始返回转换为系统统一状态。
3. 在 `PlatformRegistry` 注册 adapter。
4. 为该平台补充绑定、拨号、压测、监控接口测试。
5. 将 API Key/Secret 放入环境变量或数据库加密字段。

统一状态建议：

- 在线状态：`online`、`offline`、`unknown`
- 操作状态：`success`、`failed`、`running`
- 平台接口异常必须记录为 `platform_api_error` 告警。
