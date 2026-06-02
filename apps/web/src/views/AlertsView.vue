<template>
  <h1 class="page-title">告警中心</h1>
  <section class="panel">
    <el-table :data="alerts" height="620">
      <el-table-column prop="createdAt" label="时间" min-width="180" />
      <el-table-column prop="level" label="级别" />
      <el-table-column prop="type" label="类型" />
      <el-table-column prop="message" label="内容" min-width="260" />
      <el-table-column prop="resolved" label="已处理" />
    </el-table>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { http } from '../api/http';

const alerts = ref([]);

onMounted(async () => {
  alerts.value = (await http.get('/alerts')).data;
});
</script>
