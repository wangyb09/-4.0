<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
  >
    <div class="w-full max-w-2xl bg-white border border-[#E5E6EB] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Modal Header -->
      <div class="px-5 py-4 border-b border-[#E5E6EB] flex items-center justify-between bg-[#FAFAFA]">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 text-[#FF6A00] flex items-center justify-center">
            <SlidersHorizontal class="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-800 flex items-center gap-2">
              <span>快捷入口自定义配置</span>
              <span class="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                当前共 {{ list.length }} 项
              </span>
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              支持新增自定义入口、关联两级跳转菜单、编辑修改与排序维护
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            v-if="!isEditing"
            id="btn-add-shortcut"
            @click="handleStartAdd"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>新增</span>
          </button>
          <button
            @click="$emit('close')"
            class="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="p-5 overflow-y-auto flex-1">
        <!-- Add / Edit Form -->
        <form v-if="isEditing" @submit.prevent="handleSaveForm" class="space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <span class="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span class="w-1.5 h-3.5 bg-[#FF6A00] rounded-xs inline-block" />
              {{ editingId ? '编辑快捷入口' : '新增快捷入口' }}
            </span>
            <button
              type="button"
              @click="isEditing = false"
              class="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              返回列表
            </button>
          </div>

          <div v-if="formError" class="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle class="w-4 h-4 shrink-0 text-rose-500" />
            <span>{{ formError }}</span>
          </div>

          <!-- Title -->
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <span>名称</span>
              <span class="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              v-model="formTitle"
              placeholder="例如：离线数据集成管道"
              class="w-full px-3 py-2 text-xs rounded-md border border-[#D9D9D9] focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]/20 text-slate-800"
            />
          </div>

          <!-- Description -->
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-700">
              描述
            </label>
            <input
              type="text"
              v-model="formDesc"
              placeholder="简要说明此快捷入口的核心操作或功能（建议20字以内）"
              class="w-full px-3 py-2 text-xs rounded-md border border-[#D9D9D9] focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]/20 text-slate-800"
            />
          </div>

          <!-- Jump Menu (Must Select up to 2nd Level) -->
          <div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-slate-800 flex items-center gap-1">
                <span>跳转目标菜单 (必须选择到二级菜单)</span>
                <span class="text-rose-500">*</span>
              </label>
              <span class="text-[11px] text-[#FF6A00] font-medium bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                直达：{{ getTargetMenuLabel(formModule, formSubMenuId) }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <!-- Step 1: Primary Module -->
              <div class="space-y-1">
                <span class="text-[11px] text-slate-500 font-medium">1. 选择一级功能模块</span>
                <select
                  v-model="formModule"
                  @change="handleModuleChange(formModule)"
                  class="w-full px-3 py-2 text-xs rounded-md border border-[#D9D9D9] bg-white text-slate-800 focus:outline-none focus:border-[#FF6A00]"
                >
                  <option v-for="mod in PRIMARY_MODULES" :key="mod.key" :value="mod.key">
                    {{ mod.title }}
                  </option>
                </select>
              </div>

              <!-- Step 2: Secondary Menu -->
              <div class="space-y-1">
                <span class="text-[11px] text-slate-500 font-medium">2. 选择二级具体子菜单</span>
                <select
                  v-model="formSubMenuId"
                  class="w-full px-3 py-2 text-xs rounded-md border border-[#D9D9D9] bg-white text-slate-800 focus:outline-none focus:border-[#FF6A00]"
                >
                  <option v-for="sub in availableSubMenus" :key="sub.id" :value="sub.id">
                    {{ sub.title }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Icon Picker -->
          <div class="space-y-2">
            <label class="text-xs font-semibold text-slate-700 block">
              选择入口图标
            </label>

            <div class="grid grid-cols-5 sm:grid-cols-10 gap-2 p-2.5 rounded-lg border border-[#E5E6EB] bg-slate-50/50 max-h-40 overflow-y-auto">
              <button
                v-for="ic in AVAILABLE_ICONS"
                :key="ic.name"
                type="button"
                @click="formIcon = ic.name"
                :class="[
                  'p-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all text-center cursor-pointer',
                  formIcon === ic.name
                    ? 'bg-white border-2 border-[#FF6A00] shadow-xs text-[#FF6A00] scale-105'
                    : 'bg-white border border-[#E5E6EB] text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                ]"
                :title="ic.label"
              >
                <component :is="ic.icon" class="w-4 h-4" />
                <span class="text-[9px] truncate w-full leading-none">{{ ic.label }}</span>
              </button>
            </div>
          </div>

          <!-- Form Action Buttons -->
          <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              @click="isEditing = false"
              class="px-4 py-1.5 rounded-md border border-[#D9D9D9] text-slate-600 hover:bg-slate-50 text-xs font-medium cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-5 py-1.5 rounded-md bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium shadow-xs cursor-pointer"
            >
              {{ editingId ? '保存' : '确认' }}
            </button>
          </div>
        </form>

        <!-- Management List -->
        <div v-else class="space-y-3">
          <div class="text-xs text-slate-500 flex items-center justify-between">
            <span>可通过“上移 / 下移”调整卡片在工作台上的排列次序：</span>
            <span class="text-[11px] text-slate-400">支持点击右侧笔头图标进行编辑</span>
          </div>

          <div class="divide-y divide-slate-100 border border-[#E5E6EB] rounded-lg overflow-hidden bg-white shadow-2xs">
            <div
              v-for="(sc, index) in list"
              :key="sc.id"
              class="p-3 sm:p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
            >
              <!-- Left: Icon & Info -->
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-lg bg-orange-50 border border-orange-200/80 flex items-center justify-center text-[#FF6A00] shrink-0">
                  <component :is="getIconComp(sc.icon)" class="w-5 h-5" />
                </div>

                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-slate-800 truncate">
                      {{ sc.title }}
                    </span>
                    <span class="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 truncate">
                      {{ getTargetMenuLabel(sc.module, sc.subMenuId) }}
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-500 truncate mt-0.5">
                    {{ sc.description }}
                  </p>
                </div>
              </div>

              <!-- Right: Actions -->
              <div class="flex items-center gap-1 shrink-0">
                <!-- Move Up -->
                <button
                  type="button"
                  @click="handleMove(index, 'up')"
                  :disabled="index === 0"
                  class="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                  title="上移"
                >
                  <ArrowUp class="w-3.5 h-3.5" />
                </button>

                <!-- Move Down -->
                <button
                  type="button"
                  @click="handleMove(index, 'down')"
                  :disabled="index === list.length - 1"
                  class="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                  title="下移"
                >
                  <ArrowDown class="w-3.5 h-3.5" />
                </button>

                <!-- Edit Button -->
                <button
                  type="button"
                  @click="handleStartEdit(sc)"
                  class="p-1.5 rounded text-slate-600 hover:text-[#FF6A00] hover:bg-orange-50 transition-colors ml-1 cursor-pointer"
                  title="编辑修改此快捷入口"
                >
                  <Pencil class="w-3.5 h-3.5" />
                </button>

                <!-- Delete Button -->
                <button
                  type="button"
                  @click="handleDeleteItem(sc.id)"
                  class="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="删除此快捷入口"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div v-if="!isEditing" class="px-5 py-3.5 bg-[#FAFAFA] border-t border-[#E5E6EB] flex items-center justify-end">
        <button
          type="button"
          @click="$emit('close')"
          class="px-5 py-1.5 rounded-md bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
        >
          完成
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  X,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  SlidersHorizontal,
  AlertCircle,
  FolderPlus,
  Terminal,
  Database,
  ShieldCheck,
  Clock,
  Share2,
  Activity,
  Network,
  ArrowDownToLine,
  Table,
  Workflow,
  Zap,
  BarChart3,
  Cpu,
  KeyRound,
  FileText,
  Sparkles,
  Search,
  Settings,
  Code2,
} from 'lucide-vue-next';
import { ShortcutItem, PrimaryModule } from '../types';
import { PRIMARY_MODULES } from '../data/mockData';

interface ShortcutConfigModalProps {
  isOpen: boolean;
  shortcuts: ShortcutItem[];
}

const props = defineProps<ShortcutConfigModalProps>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saveShortcuts', updated: ShortcutItem[]): void;
}>();

const AVAILABLE_ICONS = [
  { name: 'Terminal', label: '终端/IDE', icon: Terminal },
  { name: 'Code2', label: '代码编写', icon: Code2 },
  { name: 'Database', label: '数据湖仓', icon: Database },
  { name: 'ShieldCheck', label: '数据治理', icon: ShieldCheck },
  { name: 'Clock', label: '调度运维', icon: Clock },
  { name: 'Share2', label: '服务共享', icon: Share2 },
  { name: 'Activity', label: '实时监控', icon: Activity },
  { name: 'FolderPlus', label: '集成新建', icon: FolderPlus },
  { name: 'Network', label: '图谱建模', icon: Network },
  { name: 'ArrowDownToLine', label: '采集接入', icon: ArrowDownToLine },
  { name: 'Table', label: '资产表单', icon: Table },
  { name: 'Workflow', label: 'DAG工作流', icon: Workflow },
  { name: 'Zap', label: '实时计算', icon: Zap },
  { name: 'BarChart3', label: '分析图表', icon: BarChart3 },
  { name: 'Cpu', label: '计算引擎', icon: Cpu },
  { name: 'KeyRound', label: '权限审计', icon: KeyRound },
  { name: 'FileText', label: '标准规范', icon: FileText },
  { name: 'Sparkles', label: '智能助手', icon: Sparkles },
  { name: 'Search', label: '资产检索', icon: Search },
  { name: 'Settings', label: '系统管理', icon: Settings },
];

const list = ref<ShortcutItem[]>([]);
const isEditing = ref(false);
const editingId = ref<string | null>(null);

const formTitle = ref('');
const formDesc = ref('');
const formIcon = ref('Terminal');
const formModule = ref<PrimaryModule>('development');
const formSubMenuId = ref<string>('sql_studio');
const formError = ref('');

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      list.value = props.shortcuts.map(({ badge, ...rest }) => ({ ...rest }));
      isEditing.value = false;
      editingId.value = null;
      formError.value = '';
    }
  },
  { immediate: true }
);

const selectedModuleConfig = computed(() => {
  return PRIMARY_MODULES.find((m) => m.key === formModule.value);
});

const availableSubMenus = computed(() => {
  return selectedModuleConfig.value?.subMenus || [];
});

const handleModuleChange = (newModule: PrimaryModule) => {
  formModule.value = newModule;
  const modConfig = PRIMARY_MODULES.find((m) => m.key === newModule);
  if (modConfig && modConfig.subMenus.length > 0) {
    formSubMenuId.value = modConfig.subMenus[0].id;
  } else {
    formSubMenuId.value = '';
  }
};

const handleStartAdd = () => {
  editingId.value = null;
  formTitle.value = '';
  formDesc.value = '';
  formIcon.value = 'Terminal';
  formModule.value = 'development';
  formSubMenuId.value = 'sql_studio';
  formError.value = '';
  isEditing.value = true;
};

const handleStartEdit = (item: ShortcutItem) => {
  editingId.value = item.id;
  formTitle.value = item.title;
  formDesc.value = item.description;
  formIcon.value = item.icon || 'Terminal';
  formModule.value = item.module || 'development';

  const modConfig = PRIMARY_MODULES.find((m) => m.key === item.module);
  const validSubId =
    item.subMenuId && modConfig?.subMenus.some((s) => s.id === item.subMenuId)
      ? item.subMenuId
      : modConfig?.subMenus[0]?.id || '';
  formSubMenuId.value = validSubId;

  formError.value = '';
  isEditing.value = true;
};

const handleSaveForm = () => {
  if (!formTitle.value.trim()) {
    formError.value = '请输入名称';
    return;
  }
  if (!formSubMenuId.value) {
    formError.value = '请选择具体的跳转二级功能菜单';
    return;
  }

  if (editingId.value) {
    const updated = list.value.map((item) => {
      if (item.id === editingId.value) {
        return {
          ...item,
          title: formTitle.value.trim(),
          description: formDesc.value.trim() || '快速直达该功能模块',
          icon: formIcon.value,
          module: formModule.value,
          subMenuId: formSubMenuId.value,
          actionKey: item.actionKey || `nav_${formModule.value}_${formSubMenuId.value}`,
        };
      }
      return item;
    });
    list.value = updated;
    emit('saveShortcuts', updated);
  } else {
    const newItem: ShortcutItem = {
      id: `sc_custom_${Date.now()}`,
      title: formTitle.value.trim(),
      description: formDesc.value.trim() || '快速直达该功能模块',
      icon: formIcon.value,
      module: formModule.value,
      subMenuId: formSubMenuId.value,
      category: 'develop',
      pinned: true,
      actionKey: `nav_${formModule.value}_${formSubMenuId.value}`,
    };
    const updated = [...list.value, newItem];
    list.value = updated;
    emit('saveShortcuts', updated);
  }

  isEditing.value = false;
  editingId.value = null;
};

const handleDeleteItem = (id: string) => {
  if (list.value.length <= 1) {
    alert('至少保留 1 个快捷入口，无法全部删除');
    return;
  }
  const updated = list.value.filter((i) => i.id !== id);
  list.value = updated;
  emit('saveShortcuts', updated);
};

const handleMove = (index: number, direction: 'up' | 'down') => {
  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= list.value.length) return;
  const updated = [...list.value];
  const temp = updated[index];
  updated[index] = updated[targetIndex];
  updated[targetIndex] = temp;
  list.value = updated;
  emit('saveShortcuts', updated);
};

const getIconComp = (iconName?: string) => {
  const found = AVAILABLE_ICONS.find((i) => i.name === iconName);
  return found?.icon || Table;
};

const getTargetMenuLabel = (moduleKey?: PrimaryModule, subMenuId?: string) => {
  if (!moduleKey) return '未指定';
  const mod = PRIMARY_MODULES.find((m) => m.key === moduleKey);
  if (!mod) return '未指定';
  const sub = mod.subMenus.find((s) => s.id === subMenuId);
  return `${mod.title} > ${sub?.title || mod.subMenus[0]?.title || '概览'}`;
};
</script>
