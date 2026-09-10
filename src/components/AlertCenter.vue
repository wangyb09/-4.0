<template>
  <div class="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs">
    <!-- Title & Filter Tabs in Aliyun console style -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
      <div class="flex items-center gap-2">
        <div class="w-1.5 h-3.5 rounded-xs bg-[#F5222D]" />
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-sm font-bold text-slate-800 tracking-wide">异常告警中心 (CloudMonitor)</h2>
            <span class="text-xs px-2 py-0.2 rounded bg-[#FFF1F0] text-[#F5222D] font-bold border border-[#FFA39E]">
              {{ p0Count + p1Count }} 条待处置
            </span>
          </div>
          <p class="text-[11px] text-slate-400 mt-0.5">
            实时追踪任务实例失败、SLA延迟破线、数据质量断言及元数据 Schema 漂移
          </p>
        </div>
      </div>

      <!-- Severity Filter Pills in Aliyun style -->
      <div class="flex items-center bg-[#F2F3F5] p-0.5 rounded text-xs self-start sm:self-auto gap-0.5">
        <button
          @click="severityFilter = 'all'"
          :class="[
            'px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer',
            severityFilter === 'all'
              ? 'bg-white text-slate-800 shadow-xs font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          ]"
        >
          全部 ({{ alerts.length }})
        </button>
        <button
          @click="severityFilter = 'P0'"
          :class="[
            'px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer',
            severityFilter === 'P0'
              ? 'bg-[#FFF1F0] text-[#F5222D] shadow-xs font-bold border border-[#FFA39E]'
              : 'text-slate-500 hover:text-[#F5222D]'
          ]"
        >
          P0 ({{ p0Count }})
        </button>
        <button
          @click="severityFilter = 'P1'"
          :class="[
            'px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer',
            severityFilter === 'P1'
              ? 'bg-[#FFF7E6] text-[#FA8C16] shadow-xs font-bold border border-[#FFD591]'
              : 'text-slate-500 hover:text-[#FA8C16]'
          ]"
        >
          P1 ({{ p1Count }})
        </button>
        <button
          @click="severityFilter = 'P2'"
          :class="[
            'px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer',
            severityFilter === 'P2'
              ? 'bg-[#E6F4FF] text-[#1677FF] shadow-xs font-semibold border border-[#91CAFF]'
              : 'text-slate-500 hover:text-[#1677FF]'
          ]"
        >
          P2 ({{ p2Count }})
        </button>
        <button
          @click="severityFilter = 'P3'"
          :class="[
            'px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer',
            severityFilter === 'P3'
              ? 'bg-white text-slate-800 shadow-xs font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          ]"
        >
          P3 ({{ p3Count }})
        </button>
      </div>
    </div>

    <!-- Alert Items List -->
    <div class="mt-3.5 space-y-2.5">
      <div v-if="filteredAlerts.length === 0" class="py-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
        <CheckCircle class="w-7 h-7 text-[#00B365] mb-2 opacity-80" />
        <span>当前筛选条件下无未解决告警，所有数仓节点运行良好</span>
      </div>

      <template v-else>
        <div
          v-for="alert in filteredAlerts"
          :key="alert.id"
          :class="[
            'p-3.5 rounded-lg border transition-all',
            alert.status === 'resolved'
              ? 'bg-[#FAFAFA] border-[#E5E6EB] opacity-60'
              : alert.severity === 'P0'
              ? 'bg-[#FFF9F9] border-[#FFCCC7] hover:border-[#F5222D]'
              : alert.severity === 'P1'
              ? 'bg-[#FFFAF0] border-[#FFE7BA] hover:border-[#FA8C16]'
              : 'bg-white border-[#E5E6EB] hover:border-[#FF6A00]'
          ]"
        >
          <div class="flex flex-col md:flex-row md:items-start justify-between gap-3">
            <!-- Left info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <span
                  v-if="alert.severity === 'P0'"
                  class="inline-flex items-center gap-1 px-2 py-0.2 rounded text-[10px] font-bold bg-[#FFF1F0] text-[#F5222D] border border-[#FFA39E]"
                >
                  <Flame class="w-3 h-3 text-[#F5222D]" />
                  P0 紧急阻断
                </span>
                <span
                  v-else-if="alert.severity === 'P1'"
                  class="inline-flex items-center gap-1 px-2 py-0.2 rounded text-[10px] font-semibold bg-[#FFF7E6] text-[#FA8C16] border border-[#FFD591]"
                >
                  <AlertTriangle class="w-3 h-3 text-[#FA8C16]" />
                  P1 严重异常
                </span>
                <span
                  v-else-if="alert.severity === 'P2'"
                  class="inline-flex items-center gap-1 px-2 py-0.2 rounded text-[10px] font-medium bg-[#E6F4FF] text-[#1677FF] border border-[#91CAFF]"
                >
                  <Clock class="w-3 h-3 text-[#1677FF]" />
                  P2 告警波动
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1 px-2 py-0.2 rounded text-[10px] font-medium bg-[#F5F5F5] text-[#595959] border border-[#D9D9D9]"
                >
                  P3 变更提示
                </span>

                <span class="text-xs px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                  {{ alert.sourceType }}
                </span>
                <span class="text-xs font-bold text-slate-800 truncate">
                  {{ alert.title }}
                </span>
                <span
                  v-if="alert.status === 'resolved'"
                  class="text-[10px] px-1.5 py-0.2 rounded bg-[#E6F7EB] text-[#00B365] border border-[#B7EB8F] font-medium"
                >
                  已自愈/已处置
                </span>
              </div>

              <p class="text-xs text-slate-600 leading-relaxed mb-2 font-mono bg-[#F9FAFB] p-2 rounded border border-slate-200">
                {{ alert.details }}
              </p>

              <div class="flex items-center gap-4 text-[11px] text-slate-500 flex-wrap">
                <span class="flex items-center gap-1 text-slate-700">
                  <User class="w-3 h-3 text-slate-400" />
                  责任人: <span class="font-medium">{{ alert.owner }}</span>
                </span>
                <span class="flex items-center gap-1">
                  <Clock class="w-3 h-3 text-slate-400" />
                  发生: {{ alert.occurredTime }} ({{ alert.duration }})
                </span>
                <span class="flex items-center gap-1 text-[#FF6A00]">
                  <GitFork class="w-3 h-3" />
                  {{ alert.impactScope }}
                </span>
              </div>
            </div>

            <!-- Right Actions in Aliyun Button Style -->
            <div class="flex items-center gap-2 shrink-0 md:self-center">
              <button
                @click="$emit('selectAlert', alert)"
                class="px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-slate-700 border border-[#D9D9D9] hover:border-[#FF6A00] hover:text-[#FF6A00] text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Eye class="w-3.5 h-3.5 text-[#1677FF]" />
                <span>查看根因</span>
              </button>

              <template v-if="alert.status !== 'resolved'">
                <button
                  @click="$emit('resolveAlert', alert.id)"
                  class="px-3 py-1 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] active:bg-[#E65A00] text-white text-xs font-medium transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                  title="确认已处置或触发重跑链路"
                >
                  <Check class="w-3.5 h-3.5" />
                  <span>一键处置</span>
                </button>
                <button
                  @click="$emit('ignoreAlert', alert.id)"
                  class="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
                  title="静默此告警"
                >
                  <Ban class="w-3.5 h-3.5" />
                </button>
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  AlertTriangle,
  Flame,
  Clock,
  User,
  GitFork,
  CheckCircle,
  Eye,
  Check,
  Ban,
} from 'lucide-vue-next';
import { AlertItem } from '../types';

interface AlertCenterProps {
  alerts: AlertItem[];
  activeFilter?: string;
}

const props = withDefaults(defineProps<AlertCenterProps>(), {
  activeFilter: 'all',
});

defineEmits<{
  (e: 'selectAlert', alert: AlertItem): void;
  (e: 'resolveAlert', alertId: string): void;
  (e: 'ignoreAlert', alertId: string): void;
}>();

const severityFilter = ref<string>(props.activeFilter);
const statusFilter = ref<'all' | 'unresolved' | 'resolved'>('unresolved');

const filteredAlerts = computed(() => {
  return props.alerts.filter((alert) => {
    if (statusFilter.value === 'unresolved' && alert.status === 'resolved') return false;
    if (statusFilter.value === 'resolved' && alert.status !== 'resolved') return false;
    if (severityFilter.value === 'all') return true;
    return alert.severity === severityFilter.value;
  });
});

const p0Count = computed(() => props.alerts.filter((a) => a.severity === 'P0' && a.status !== 'resolved').length);
const p1Count = computed(() => props.alerts.filter((a) => a.severity === 'P1' && a.status !== 'resolved').length);
const p2Count = computed(() => props.alerts.filter((a) => a.severity === 'P2' && a.status !== 'resolved').length);
const p3Count = computed(() => props.alerts.filter((a) => a.severity === 'P3' && a.status !== 'resolved').length);
</script>
