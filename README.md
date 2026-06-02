# PCDN Manager

PCDN 多平台设备管理 Web 系统首版工程。

## 功能

- 公司管理员与代理两类账号。
- 代理数据隔离：设备、操作日志、告警均按 `agentId` 限制。
- 多平台 adapter 接入层，前端不直接感知平台 API 差异。
- 设备绑定、查询、拨号、压测、监控同步、基础告警。
- Vue 3 管理后台与 NestJS REST API。

## 本地运行

```powershell
npm install
npm run dev
npm run dev:web
```

默认账号：

- 管理员：`admin` / `admin123`
- 代理：`agent-a` / `agent123`

API 默认监听 `http://localhost:3000`，Web 默认监听 `http://localhost:5173`。

## Docker

```powershell
docker compose up --build
```

## 接入真实平台

在 `apps/api/src/platforms` 中新增 adapter，实现 `PlatformAdapter` 接口，并在 `PlatformRegistry` 注册。真实平台的 API Key/Secret 应通过环境变量或数据库加密字段保存，不要写死在代码中。
