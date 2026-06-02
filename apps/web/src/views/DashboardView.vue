<template>
  <h1 class="page-title">仪表盘</h1>
  <section class="metric-grid">
    <div class="metric">设备总数<strong>{{ data.totalDevices }}</strong></div>
    <div class="metric">在线设备<strong>{{ data.onlineDevices }}</strong></div>
    <div class="metric">离线设备<strong>{{ data.offlineDevices }}</strong></div>
    <div class="metric">未处理告警<strong>{{ data.activeAlerts }}</strong></div>
  </section>
  <section class="panel" style="margin-top: 16px">
    <h2>最近监控</h2>
    <el-table :data="data.latestSnapshots" height="360">
      <el-table-column prop="deviceId" label="设备" />
      <el-table-column prop="platformId" label="平台" />
      <el-table-column prop="onlineStatus" label="状态" />
      <el-table-column prop="bandwidthMbps" label="带宽 Mbps" />
      <el-table-column prop="createdAt" label="采集时间" />
    </el-table>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { http } from '../api/http';

const data = reactive({
  totalDevices: 0,
  onlineDevices: 0,
  offlineDevices: 0,
  activeAlerts: 0,
  latestSnapshots: []
});

onMounted(async () => {
  Object.assign(data, (await http.get('/dashboard')).data);
});
</script>
