<template>
  <header class="sticky top-0 z-40 bg-[#1F2329] text-white border-b border-[#2B313A] shadow-md select-none">
    <div class="max-w-[1680px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
      <!-- Left: Brand Logo + Primary Navigation Menu aligned to the left -->
      <div class="flex items-center gap-6 flex-1 min-w-0 h-full">
        <button
          id="btn-platform-home"
          @click="$emit('navigateHome')"
          class="flex items-center gap-2.5 text-left group focus:outline-none shrink-0 cursor-pointer"
        >
          <!-- Aliyun-style Geometric Matrix Icon -->
          <div class="w-7 h-7 rounded bg-[#FF6A00] flex items-center justify-center shadow-xs group-hover:bg-[#FF7D1A] transition-colors">
            <Layers class="w-4 h-4 text-white" />
          </div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-base tracking-tight text-white group-hover:text-[#FF6A00] transition-colors whitespace-nowrap">
              一体化数据平台
            </span>
          </div>
        </button>

        <!-- Top-Level Primary Navigation Menu positioned to the left -->
        <nav class="flex items-center justify-start gap-1 overflow-x-auto py-1 scrollbar-none h-full pl-2 border-l border-[#2B313A]">
          <button
            v-for="module in PRIMARY_MODULES"
            :key="module.key"
            :id="`nav-module-${module.key}`"
            @click="$emit('selectModule', module.key)"
            :class="[
              'relative flex items-center px-3.5 py-1.5 rounded text-xs font-medium transition-all shrink-0 h-9 cursor-pointer',
              activeModule === module.key
                ? 'text-[#FF6A00] bg-[#2B313C] font-semibold shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            ]"
          >
            <span>{{ module.title }}</span>
            <div
              v-if="activeModule === module.key"
              class="absolute bottom-0 left-2 right-2 h-[2px] bg-[#FF6A00] rounded-full"
            />
          </button>
        </nav>
      </div>

      <!-- Right: Alerts, Todos & Profile -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Pending Todos Indicator -->
        <button
          id="btn-header-todos"
          @click="$emit('openTodos')"
          title="查看待办审批任务"
          class="relative p-2 rounded bg-[#2A303A] hover:bg-[#343B47] text-slate-300 hover:text-white transition-colors border border-white/5 cursor-pointer"
        >
          <CheckSquare class="w-4 h-4" />
          <span
            v-if="pendingTodosCount > 0"
            class="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-[16px] text-[10px] font-bold bg-[#FF6A00] text-white rounded-full flex items-center justify-center shadow-xs"
          >
            {{ pendingTodosCount }}
          </span>
        </button>

        <!-- Alert Center Indicator -->
        <button
          id="btn-header-alerts"
          @click="$emit('openAlerts')"
          title="查看异常告警中心"
          class="relative p-2 rounded bg-[#2A303A] hover:bg-[#343B47] text-slate-300 hover:text-white transition-colors border border-white/5 cursor-pointer"
        >
          <Bell class="w-4 h-4" />
          <span v-if="p0p1AlertsCount > 0" class="absolute -top-1 -right-1 flex h-4 w-4">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-4 w-4 bg-[#F5222D] text-white text-[10px] font-bold items-center justify-center">
              {{ p0p1AlertsCount }}
            </span>
          </span>
        </button>

        <!-- User Profile Avatar (Static Display, as requested) -->
        <div class="flex items-center pl-2 border-l border-[#2B313A]">
          <div
            id="header-user-avatar"
            class="w-7 h-7 rounded bg-[#FF6A00] flex items-center justify-center text-white font-bold text-xs shadow-xs ring-1 ring-white/10 select-none cursor-default"
            title="李晨 (超级管理员)"
          >
            LC
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Bell, CheckSquare, Layers } from 'lucide-vue-next';
import { AlertItem, TodoItem, PrimaryModule } from '../types';
import { PRIMARY_MODULES } from '../data/mockData';

interface HeaderProps {
  activeModule: PrimaryModule;
  activeSubMenuId?: string;
  pendingTodos: TodoItem[];
  alerts: AlertItem[];
}

const props = defineProps<HeaderProps>();

defineEmits<{
  (e: 'selectModule', module: PrimaryModule, subMenuId?: string): void;
  (e: 'openTodos'): void;
  (e: 'openAlerts'): void;
  (e: 'navigateHome'): void;
}>();

const pendingTodosCount = computed(() => {
  return props.pendingTodos.filter((t) => t.status === 'pending').length;
});

const p0p1AlertsCount = computed(() => {
  return props.alerts.filter(
    (a) => (a.severity === 'P0' || a.severity === 'P1') && a.status !== 'resolved'
  ).length;
});
</script>
