<template>
  <router-view v-if="$route.path === '/login'" />
  <el-container v-else class="shell">
    <el-aside width="216px" class="sidebar">
      <div class="brand">PCDN Manager</div>
      <el-menu router :default-active="$route.path" background-color="#14213d" text-color="#dbe4f0" active-text-color="#ffffff">
        <el-menu-item index="/dashboard">仪表盘</el-menu-item>
        <el-menu-item index="/devices">设备管理</el-menu-item>
        <el-menu-item index="/platforms">平台管理</el-menu-item>
        <el-menu-item index="/operations">操作日志</el-menu-item>
        <el-menu-item index="/alerts">告警中心</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="topbar">
        <span>{{ auth.user?.displayName }} · {{ auth.user?.role === 'admin' ? '公司管理员' : '代理账号' }}</span>
        <el-button type="primary" plain @click="logout">退出</el-button>
      </el-header>
      <el-main class="content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';

const auth = useAuthStore();
const router = useRouter();

function logout() {
  auth.logout();
  router.push('/login');
}
</script>
