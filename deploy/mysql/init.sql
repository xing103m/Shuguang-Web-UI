CREATE TABLE IF NOT EXISTS agents (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  contact VARCHAR(64),
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  username VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'agent') NOT NULL,
  agent_id VARCHAR(64),
  display_name VARCHAR(128) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES agents(id)
);

CREATE TABLE IF NOT EXISTS platforms (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  base_url VARCHAR(255) NOT NULL,
  auth_type VARCHAR(32) NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  encrypted_config JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS devices (
  id VARCHAR(64) PRIMARY KEY,
  platform_id VARCHAR(64) NOT NULL,
  platform_device_id VARCHAR(128) NOT NULL,
  agent_id VARCHAR(64) NOT NULL,
  online_status ENUM('online', 'offline', 'unknown') NOT NULL DEFAULT 'unknown',
  dial_status VARCHAR(32) NOT NULL DEFAULT 'idle',
  stress_status VARCHAR(32) NOT NULL DEFAULT 'idle',
  last_monitor_at TIMESTAMP NULL,
  last_operation_at TIMESTAMP NULL,
  raw JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_platform_device (platform_id, platform_device_id),
  KEY idx_agent_status (agent_id, online_status),
  FOREIGN KEY (platform_id) REFERENCES platforms(id),
  FOREIGN KEY (agent_id) REFERENCES agents(id)
);

CREATE TABLE IF NOT EXISTS operation_logs (
  id VARCHAR(64) PRIMARY KEY,
  device_id VARCHAR(64) NOT NULL,
  agent_id VARCHAR(64) NOT NULL,
  platform_id VARCHAR(64) NOT NULL,
  type ENUM('dial', 'stress') NOT NULL,
  status ENUM('success', 'failed', 'running') NOT NULL,
  request JSON NOT NULL,
  response JSON NOT NULL,
  error VARCHAR(512),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_agent_created (agent_id, created_at),
  FOREIGN KEY (device_id) REFERENCES devices(id)
);

CREATE TABLE IF NOT EXISTS monitor_snapshots (
  id VARCHAR(64) PRIMARY KEY,
  device_id VARCHAR(64) NOT NULL,
  agent_id VARCHAR(64) NOT NULL,
  platform_id VARCHAR(64) NOT NULL,
  online_status ENUM('online', 'offline', 'unknown') NOT NULL,
  bandwidth_mbps DECIMAL(10,2) NOT NULL DEFAULT 0,
  raw JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_device_created (device_id, created_at),
  KEY idx_agent_created (agent_id, created_at)
);

CREATE TABLE IF NOT EXISTS alerts (
  id VARCHAR(64) PRIMARY KEY,
  agent_id VARCHAR(64) NOT NULL,
  device_id VARCHAR(64),
  platform_id VARCHAR(64),
  type VARCHAR(64) NOT NULL,
  level ENUM('warning', 'critical') NOT NULL,
  message VARCHAR(512) NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_agent_resolved (agent_id, resolved)
);

INSERT IGNORE INTO agents (id, name, contact) VALUES
('agent-a', '华东代理', '13800000000'),
('agent-b', '华南代理', '13900000000');

INSERT IGNORE INTO platforms (id, name, base_url, auth_type) VALUES
('mock-alpha', 'Alpha 平台', 'mock://alpha', 'api_key'),
('mock-beta', 'Beta 平台', 'mock://beta', 'token');
