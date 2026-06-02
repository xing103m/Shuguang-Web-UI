<template>
  <main class="login-page">
    <section class="login-panel">
      <h1>PCDN 设备管理</h1>
      <el-form @submit.prevent="submit">
        <el-form-item>
          <el-input v-model="username" placeholder="账号" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="password" type="password" placeholder="密码" show-password />
        </el-form-item>
        <el-button type="primary" native-type="submit" :loading="loading">登录</el-button>
      </el-form>
      <p class="hint">管理员 admin/admin123，代理 agent-a/agent123</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '../stores/auth';

const username = ref('admin');
const password = ref('admin123');
const loading = ref(false);
const auth = useAuthStore();
const router = useRouter();

async function submit() {
  loading.value = true;
  try {
    await auth.login(username.value, password.value);
    router.push('/dashboard');
  } catch {
    ElMessage.error('账号或密码错误');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #14213d, #2a9d8f);
}

.login-panel {
  width: min(420px, calc(100vw - 32px));
  background: white;
  border-radius: 8px;
  padding: 28px;
}

h1 {
  margin: 0 0 24px;
}

.hint {
  color: #64748b;
  font-size: 13px;
}
</style>
