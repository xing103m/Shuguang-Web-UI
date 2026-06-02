<template>
  <h1 class="page-title">设备管理</h1>
  <div class="toolbar">
    <el-input v-model="keyword" placeholder="搜索设备 ID" clearable style="width: 220px" />
    <el-select v-model="platformId" placeholder="平台" clearable style="width: 180px">
      <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
    <el-select v-model="onlineStatus" placeholder="状态" clearable style="width: 140px">
      <el-option label="在线" value="online" />
      <el-option label="离线" value="offline" />
    </el-select>
    <el-button type="primary" @click="load">查询</el-button>
    <el-button @click="bindOpen = true">绑定设备</el-button>
  </div>
  <section class="panel">
    <el-table :data="devices" height="560">
      <el-table-column prop="platformDeviceId" label="设备 ID" min-width="150" />
      <el-table-column prop="platform.name" label="平台" />
      <el-table-column prop="agent.name" label="代理" />
      <el-table-column prop="onlineStatus" label="在线状态" />
      <el-table-column prop="dialStatus" label="拨号" />
      <el-table-column prop="stressStatus" label="压测" />
      <el-table-column prop="lastMonitorAt" label="最近监控" min-width="180" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="operate(row.id, 'dial')">拨号</el-button>
          <el-button size="small" @click="operate(row.id, 'stress')">压测</el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
  <el-dialog v-model="bindOpen" title="绑定设备" width="420px">
    <el-form label-width="90px">
      <el-form-item label="平台">
        <el-select v-model="bindForm.platformId" style="width: 100%">
          <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="设备 ID">
        <el-input v-model="bindForm.platformDeviceId" placeholder="例如 ALPHA-10002" />
      </el-form-item>
      <el-form-item label="代理 ID">
        <el-input v-model="bindForm.agentId" placeholder="管理员填写，代理账号可留空" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="bindOpen = false">取消</el-button>
      <el-button type="primary" @click="bindDevice">绑定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { http } from '../api/http';

const devices = ref<any[]>([]);
const platforms = ref<any[]>([]);
const keyword = ref('');
const platformId = ref('');
const onlineStatus = ref('');
const bindOpen = ref(false);
const bindForm = reactive({ platformId: '', platformDeviceId: '', agentId: 'agent-a' });

async function load() {
  devices.value = (
    await http.get('/devices', {
      params: { keyword: keyword.value, platformId: platformId.value, onlineStatus: onlineStatus.value }
    })
  ).data;
}

async function operate(id: string, type: 'dial' | 'stress') {
  await http.post(`/devices/${id}/${type}`);
  ElMessage.success(type === 'dial' ? '拨号已执行' : '压测已执行');
  await load();
}

async function bindDevice() {
  await http.post('/devices/bind', bindForm);
  ElMessage.success('设备已绑定');
  bindOpen.value = false;
  await load();
}

onMounted(async () => {
  platforms.value = (await http.get('/platforms')).data;
  bindForm.platformId = platforms.value[0]?.id ?? '';
  await load();
});
</script>
