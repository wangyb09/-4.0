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
          <!-- Aliyun-style Geometric Matrix Icon / Custom Logo -->
          <div class="w-7 h-7 rounded bg-[#FF6A00] flex items-center justify-center shadow-xs group-hover:bg-[#FF7D1A] transition-colors overflow-hidden shrink-0">
            <img
              v-if="platformLogo"
              :src="platformLogo"
              alt="Logo"
              class="w-full h-full object-contain p-0.5"
            />
            <Layers v-else class="w-4 h-4 text-white" />
          </div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-base tracking-tight text-white group-hover:text-[#FF6A00] transition-colors whitespace-nowrap">
              {{ platformTitle || '一体化数据平台' }}
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

        <!-- User Profile Avatar with Click & Dropdown Menu -->
        <div class="relative flex items-center pl-2 border-l border-[#2B313A]">
          <button
            id="header-user-avatar"
            @click="isUserMenuOpen = !isUserMenuOpen"
            class="flex items-center gap-2 group p-0.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer select-none focus:outline-none"
            :title="`${userProfile?.realName || '李晨'} (${userProfile?.role || '超级管理员'}) - 点击进入个人中心`"
          >
            <div
              class="w-7 h-7 rounded bg-[#FF6A00] group-hover:bg-[#FF7D1A] flex items-center justify-center text-white font-bold text-xs shadow-xs ring-1 ring-white/10 overflow-hidden shrink-0"
            >
              <img
                v-if="userProfile?.avatarType !== 'preset' && userProfile?.avatar"
                :src="userProfile.avatar"
                alt="Avatar"
                class="w-full h-full object-cover"
                referrerpolicy="no-referrer"
              />
              <span v-else>{{ userProfile?.avatar || 'LC' }}</span>
            </div>
            <span class="hidden md:inline-block text-xs font-medium text-slate-200 group-hover:text-white max-w-[70px] truncate">
              {{ userProfile?.realName || '李晨' }}
            </span>
            <ChevronDown class="w-3 h-3 text-slate-400 group-hover:text-white transition-transform" :class="{ 'rotate-180': isUserMenuOpen }" />
          </button>

          <!-- User Dropdown Menu: Only Profile and Logout -->
          <div
            v-if="isUserMenuOpen"
            class="absolute right-0 top-10 w-36 bg-[#2B313A] border border-[#3A424E] rounded-xl shadow-2xl py-1 text-xs text-slate-200 z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden"
          >
            <button
              id="menu-btn-profile"
              @click="isUserMenuOpen = false; $emit('openProfile')"
              class="w-full px-3.5 py-2 text-left hover:bg-white/10 text-slate-200 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
            >
              <User class="w-3.5 h-3.5 text-[#FF6A00]" />
              <span>个人中心</span>
            </button>

            <div class="border-t border-[#3A424E]/80 my-0.5"></div>

            <button
              id="menu-btn-logout"
              @click="isUserMenuOpen = false; $emit('logout')"
              class="w-full px-3.5 py-2 text-left hover:bg-red-500/20 text-rose-300 hover:text-rose-200 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut class="w-3.5 h-3.5 text-rose-400" />
              <span>退出登录</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Bell, CheckSquare, Layers, ChevronDown, User, LogOut } from 'lucide-vue-next';
import { AlertItem, TodoItem, PrimaryModule, UserProfile } from '../types';
import { PRIMARY_MODULES } from '../data/mockData';

interface HeaderProps {
  activeModule: PrimaryModule;
  activeSubMenuId?: string;
  pendingTodos: TodoItem[];
  alerts: AlertItem[];
  userProfile?: UserProfile;
  platformTitle?: string;
  platformLogo?: string;
}

const props = defineProps<HeaderProps>();

defineEmits<{
  (e: 'selectModule', module: PrimaryModule, subMenuId?: string): void;
  (e: 'openTodos'): void;
  (e: 'openAlerts'): void;
  (e: 'navigateHome'): void;
  (e: 'openProfile'): void;
  (e: 'logout'): void;
}>();

const isUserMenuOpen = ref(false);

const closeDropdown = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('#header-user-avatar') && !target.closest('.user-dropdown')) {
    isUserMenuOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  window.removeEventListener('click', closeDropdown);
});

const pendingTodosCount = computed(() => {
  return props.pendingTodos.filter((t) => t.status === 'pending').length;
});

const p0p1AlertsCount = computed(() => {
  return props.alerts.filter(
    (a) => (a.severity === 'P0' || a.severity === 'P1') && a.status !== 'resolved'
  ).length;
});
</script>
