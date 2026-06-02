# API Overview

所有接口前缀为 `/api`。除登录外，均需要 `Authorization: Bearer <token>`。

## Auth

- `POST /auth/login`
  - body: `{ "username": "admin", "password": "admin123" }`

## Devices

- `GET /devices?keyword=&platformId=&onlineStatus=`
- `GET /devices/:id`
- `POST /devices/bind`
  - body: `{ "platformId": "mock-alpha", "platformDeviceId": "ALPHA-10002", "agentId": "agent-a" }`

## Operations

- `POST /devices/:id/dial`
- `POST /devices/:id/stress`
- `GET /operations`

## Monitoring

- `GET /dashboard`
- `GET /alerts`

## Platforms

- `GET /platforms`
