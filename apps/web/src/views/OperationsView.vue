<template>
  <h1 class="page-title">操作日志</h1>
  <section class="panel">
    <el-table :data="logs" height="620">
      <el-table-column prop="createdAt" label="时间" min-width="180" />
      <el-table-column prop="platformId" label="平台" />
      <el-table-column prop="deviceId" label="设备" />
      <el-table-column prop="type" label="类型" />
      <el-table-column prop="status" label="结果" />
      <el-table-column prop="error" label="错误" min-width="180" />
    </el-table>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { http } from '../api/http';

const logs = ref([]);

onMounted(async () => {
  logs.value = (await http.get('/operations')).data;
});
</script>
