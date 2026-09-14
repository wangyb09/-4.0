<template>
  <!-- If not logged in, render the Login Page directly -->
  <LoginPage
    v-if="!isLoggedIn"
    :config="loginConfig"
    @loginSuccess="handleLoginSuccess"
    @showToast="showToast"
  />

  <!-- Main Authenticated Application Shell -->
  <div
    v-else
    class="min-h-screen bg-[#F2F3F5] text-slate-800 font-sans antialiased flex flex-col selection:bg-[#FF6A00] selection:text-white"
  >
    <!-- 1. Global Header with integrated 1st-level Navigation & User Profile Avatar -->
    <Header
      :activeModule="activeModule"
      :activeSubMenuId="activeSubMenuId"
      :pendingTodos="todos"
      :alerts="alerts"
      :userProfile="userProfile"
      :platformTitle="loginConfig.platformTitle"
      :platformLogo="loginConfig.platformLogo"
      @selectModule="handleSelectModule"
      @openTodos="handleOpenTodos"
      @openAlerts="handleOpenAlerts"
      @navigateHome="handleNavigateHome"
      @openProfile="handleOpenProfile"
      @logout="handleLogout"
    />

    <!-- 2. Main Workspace Area -->
    <main class="flex-1 max-w-[1600px] w-full mx-auto p-3.5 sm:p-5">
      <!-- 2.1 Home Workbench -->
      <div v-if="activeModule === 'home'" class="space-y-3.5">
        <!-- 3.1 Platform Core Metrics Overview - Top 4 Cards -->
        <section id="workbench-metrics-overview">
          <MetricsOverview
            :metrics="metrics"
            @filterAlerts="handleFilterAlerts"
            @navigateDevelopment="activeModule = 'development'"
            @navigateScheduling="activeModule = 'scheduling'"
            @navigateQuality="activeModule = 'governance'"
          />
        </section>

        <!-- 3.2 Data Overview Statistics (数据总览统计: 数据源, 数据表, 字段, 数据量) -->
        <section id="workbench-data-overview-section">
          <DataOverviewStats
            @showToast="showToast"
            @selectDimension="handleSelectDimension"
          />
        </section>

        <!-- 3.3 Quick Shortcuts Bar -->
        <section id="workbench-shortcuts-section" class="pt-2 sm:pt-2.5">
          <QuickShortcuts
            :shortcuts="shortcuts"
            @triggerAction="handleTriggerShortcut"
            @openConfigModal="isShortcutConfigOpen = true"
          />
        </section>
      </div>

      <!-- 2.2 Dedicated Personal Center View (Requested) -->
      <UserProfileView
        v-else-if="activeModule === 'profile'"
        :profile="userProfile"
        @saveProfile="handleSaveProfile"
        @navigateHome="handleNavigateHome"
        @logout="handleLogout"
        @showToast="showToast"
      />

      <!-- 2.3 Subsystem Dedicated Module Workspace -->
      <SubsystemModuleView
        v-else
        :module="activeModule"
        :activeSubMenuId="activeSubMenuId"
        :loginConfig="loginConfig"
        @navigateHome="handleNavigateHome"
        @openQuickAction="handleTriggerShortcut"
        @saveLoginConfig="handleSaveLoginConfig"
        @previewLoginPage="handlePreviewLoginPage"
        @openProfile="handleOpenProfile"
        @showToast="showToast"
      />
    </main>

    <!-- 4. Global Modals -->
    <!-- 4.1 Global Search Modal (Cmd+K) -->
    <GlobalSearchModal
      :isOpen="isSearchOpen"
      @close="isSearchOpen = false"
      @selectItem="handleSearchSelectItem"
    />

    <!-- 4.2 Alert RCA Detail Modal -->
    <AlertDetailModal
      :alert="selectedAlert"
      @close="selectedAlert = null"
      @resolve="handleResolveAlert"
    />

    <!-- 4.3 Todo Approval Detail Modal -->
    <TodoDetailModal
      :todo="selectedTodo"
      @close="selectedTodo = null"
      @approve="handleApproveTodo"
      @reject="handleRejectTodo"
    />

    <!-- 4.4 Customize Shortcuts Config Modal -->
    <ShortcutConfigModal
      :isOpen="isShortcutConfigOpen"
      :shortcuts="shortcuts"
      @close="isShortcutConfigOpen = false"
      @saveShortcuts="handleSaveShortcuts"
      @resetDefault="handleResetDefaultShortcuts"
    />

    <!-- 4.5 Quick Action / SQL IDE / Sync / Perm Modal -->
    <QuickActionModal
      :actionKey="quickActionKey"
      @close="quickActionKey = null"
      @successToast="showToast"
    />

    <!-- 5. Toast Feedback -->
    <div
      v-if="toastMessage"
      class="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200"
    >
      <div
        :class="[
          'px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2.5 text-xs font-medium border bg-white',
          toastType === 'success'
            ? 'border-emerald-200 text-slate-800'
            : toastType === 'warning'
            ? 'border-amber-200 text-slate-800'
            : 'border-blue-200 text-slate-800'
        ]"
      >
        <CheckCircle2 v-if="toastType === 'success'" class="w-4 h-4 text-[#00B365] shrink-0" />
        <AlertCircle v-else class="w-4 h-4 text-[#FF6A00] shrink-0" />
        <span>{{ toastMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Header from './components/Header.vue';
import MetricsOverview from './components/MetricsOverview.vue';
import DataOverviewStats from './components/DataOverviewStats.vue';
import QuickShortcuts from './components/QuickShortcuts.vue';
import GlobalSearchModal from './components/GlobalSearchModal.vue';
import AlertDetailModal from './components/AlertDetailModal.vue';
import TodoDetailModal from './components/TodoDetailModal.vue';
import ShortcutConfigModal from './components/ShortcutConfigModal.vue';
import QuickActionModal from './components/QuickActionModal.vue';
import SubsystemModuleView from './components/SubsystemModuleView.vue';
import UserProfileView from './components/UserProfileView.vue';
import LoginPage from './components/LoginPage.vue';

import {
  PrimaryModule,
  PlatformMetrics,
  AlertItem,
  TodoItem,
  ShortcutItem,
  AlertSeverity,
  UserProfile,
  LoginPageConfig,
} from './types';
import {
  INITIAL_METRICS,
  INITIAL_ALERTS,
  INITIAL_TODOS,
  INITIAL_SHORTCUTS,
  DEFAULT_USER_PROFILE,
  DEFAULT_LOGIN_CONFIG,
} from './data/mockData';
import { CheckCircle2, AlertCircle } from 'lucide-vue-next';

// Authentication & Login State
const isLoggedIn = ref(true);

// User Profile State with LocalStorage Persistence
const getUserProfile = (): UserProfile => {
  try {
    const saved = localStorage.getItem('datacraft_user_profile');
    if (saved) {
      return { ...DEFAULT_USER_PROFILE, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load user profile from storage', e);
  }
  return DEFAULT_USER_PROFILE;
};

const userProfile = ref<UserProfile>(getUserProfile());

// Login Page Configuration State with LocalStorage Persistence
const getLoginConfig = (): LoginPageConfig => {
  try {
    const saved = localStorage.getItem('datacraft_login_config');
    if (saved) {
      return { ...DEFAULT_LOGIN_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load login config from storage', e);
  }
  return DEFAULT_LOGIN_CONFIG;
};

const loginConfig = ref<LoginPageConfig>(getLoginConfig());

// Navigation state
const activeModule = ref<PrimaryModule>('home');
const activeSubMenuId = ref<string | undefined>(undefined);

// Core Data States
const metrics = ref<PlatformMetrics>(INITIAL_METRICS);
const alerts = ref<AlertItem[]>(INITIAL_ALERTS);
const todos = ref<TodoItem[]>(INITIAL_TODOS);

const getInitialShortcuts = (): ShortcutItem[] => {
  try {
    const saved = localStorage.getItem('datacraft_shortcuts_v4');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item: ShortcutItem) => {
          const { badge, ...rest } = item;
          return rest;
        });
      }
    }
  } catch (e) {
    console.error('Failed to load shortcuts from localStorage:', e);
  }
  return INITIAL_SHORTCUTS;
};

const shortcuts = ref<ShortcutItem[]>(getInitialShortcuts());

// Modal states
const isSearchOpen = ref(false);
const selectedAlert = ref<AlertItem | null>(null);
const selectedTodo = ref<TodoItem | null>(null);
const isShortcutConfigOpen = ref(false);
const quickActionKey = ref<string | null>(null);

// Toast Notification state
const toastMessage = ref<string | null>(null);
const toastType = ref<'success' | 'info' | 'warning'>('success');
let toastTimer: any = null;

const showToast = (msg: string, type: 'success' | 'info' | 'warning' = 'success') => {
  if (toastTimer) clearTimeout(toastTimer);
  toastMessage.value = msg;
  toastType.value = type;
  toastTimer = setTimeout(() => {
    toastMessage.value = null;
  }, 3200);
};

// User Profile Actions
const handleOpenProfile = () => {
  activeModule.value = 'profile';
  activeSubMenuId.value = undefined;
};

const handleSaveProfile = (updated: UserProfile) => {
  userProfile.value = updated;
  try {
    localStorage.setItem('datacraft_user_profile', JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
  showToast('个人资料已成功更新保存！', 'success');
};

// System & Login Page Configuration Actions
const handleSaveLoginConfig = (cfg: LoginPageConfig) => {
  loginConfig.value = cfg;
  try {
    localStorage.setItem('datacraft_login_config', JSON.stringify(cfg));
  } catch (e) {
    console.error(e);
  }
  if (cfg.platformTitle) {
    document.title = `${cfg.platformTitle} - 一体化智能数据中台`;
  }
  showToast('系统配置与登录页配置已成功保存并实时生效！', 'success');
};

const handlePreviewLoginPage = () => {
  isLoggedIn.value = false;
  showToast('已进入全屏登录页体验模式', 'info');
};

const handleLoginSuccess = (username: string) => {
  isLoggedIn.value = true;
  if (username && username !== userProfile.value.username) {
    userProfile.value.username = username;
  }
  showToast(`欢迎回来，${userProfile.value.realName || username}！`, 'success');
};

const handleLogout = () => {
  isLoggedIn.value = false;
  showToast('已安全退出当前会话，返回登录页', 'info');
};

// Keyboard shortcut: Cmd/Ctrl + K for Global Search
const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    isSearchOpen.value = !isSearchOpen.value;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  if (toastTimer) clearTimeout(toastTimer);
});

const handleSelectModule = (mod: PrimaryModule, subId?: string) => {
  activeModule.value = mod;
  activeSubMenuId.value = subId;
};

const handleNavigateHome = () => {
  activeModule.value = 'home';
  activeSubMenuId.value = undefined;
};

const handleOpenTodos = () => {
  selectedTodo.value = todos.value.find((t) => t.status === 'pending') || todos.value[0] || null;
};

const handleOpenAlerts = () => {
  selectedAlert.value = alerts.value.find((a) => a.status === 'active') || alerts.value[0] || null;
};

const handleFilterAlerts = (sev: AlertSeverity) => {
  selectedAlert.value = alerts.value.find((a) => a.severity === sev) || alerts.value[0] || null;
};

const handleSelectDimension = (key: string) => {
  if (key === 'table') {
    activeModule.value = 'metadata';
  } else if (key === 'datasource') {
    activeModule.value = 'ingestion';
  }
};

// Alert Handlers
const handleResolveAlert = (alertId: string) => {
  alerts.value = alerts.value.map((a) =>
    a.id === alertId ? { ...a, status: 'resolved' as const } : a
  );
  showToast('告警已成功处置并自动触发重跑自愈链路！');
};

// Todo Handlers
const handleApproveTodo = (id: string) => {
  todos.value = todos.value.map((t) =>
    t.id === id ? { ...t, status: 'approved' as const } : t
  );
  showToast('审批已同意通过，权限/模型变更已自动下发生效！');
};

const handleRejectTodo = (id: string) => {
  todos.value = todos.value.map((t) =>
    t.id === id ? { ...t, status: 'rejected' as const } : t
  );
  showToast('审批工单已驳回并通知申请人重新提交', 'info');
};

// Shortcut Save / Reset Handlers
const handleSaveShortcuts = (updated: ShortcutItem[]) => {
  shortcuts.value = updated;
  try {
    localStorage.setItem('datacraft_shortcuts_v4', JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
  showToast('快捷入口配置已成功保存并实时生效！');
};

const handleResetDefaultShortcuts = () => {
  shortcuts.value = INITIAL_SHORTCUTS;
  try {
    localStorage.removeItem('datacraft_shortcuts_v4');
    localStorage.removeItem('datacraft_shortcuts_v3');
    localStorage.removeItem('datacraft_shortcuts_v2');
  } catch (e) {
    console.error(e);
  }
  showToast('已成功恢复系统预设快捷入口');
};

// Trigger Action from Shortcut - directly navigate to the corresponding secondary menu without popups
const handleTriggerShortcut = (actionKey: string, module?: PrimaryModule, subMenuId?: string) => {
  if (module && module !== 'home') {
    activeModule.value = module;
    activeSubMenuId.value = subMenuId;
    return;
  }

  if (actionKey) {
    quickActionKey.value = actionKey;
  }
};

const handleSearchSelectItem = (item: { title: string; type: string }) => {
  showToast(`已定位资产：【${item.title}】(${item.type})`);
};
</script>
