<template>
  <h1 class="page-title">平台管理</h1>
  <section class="panel">
    <el-table :data="platforms">
      <el-table-column prop="name" label="平台" />
      <el-table-column prop="baseUrl" label="接口地址" />
      <el-table-column prop="authType" label="认证方式" />
      <el-table-column prop="enabled" label="启用" />
    </el-table>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { http } from '../api/http';

const platforms = ref([]);

onMounted(async () => {
  platforms.value = (await http.get('/platforms')).data;
});
</script>
