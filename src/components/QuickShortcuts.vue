<template>
  <div
    id="workbench-shortcuts-container"
    class="bg-white border border-[#E5E6EB] rounded-lg p-3.5 sm:p-4 shadow-xs"
  >
    <!-- Container Header -->
    <div class="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
      <div class="flex items-center gap-2">
        <div class="w-1.5 h-3.5 bg-[#FF6A00] rounded-xs" />
        <h2 class="text-sm font-bold text-slate-800 tracking-tight">
          快捷入口
        </h2>
        <span class="text-xs text-slate-400 font-normal hidden sm:inline-block">
          常用功能一键直达
        </span>
      </div>

      <button
        id="btn-configure-shortcuts"
        @click="$emit('openConfigModal')"
        class="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-[#D9D9D9] text-slate-600 hover:border-[#FF6A00] hover:text-[#FF6A00] text-xs transition-colors font-medium cursor-pointer"
        title="自定义配置快捷入口"
      >
        <SlidersHorizontal class="w-3.5 h-3.5 text-[#FF6A00]" />
        <span>自定义配置</span>
      </button>
    </div>

    <!-- Grid of Shortcuts inside the unified card -->
    <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
      <button
        v-for="sc in shortcuts"
        :key="sc.id"
        :id="`shortcut-${sc.id}`"
        @click="$emit('triggerAction', sc.actionKey || '', sc.module, sc.subMenuId)"
        class="bg-[#F8F9FA] hover:bg-[#FFF7F0] p-3 sm:py-4.5 sm:px-3 border border-[#EBEDF0] hover:border-[#FF6A00] rounded-lg text-center cursor-pointer transition-all duration-200 group relative flex flex-col items-center justify-between min-h-[162px] sm:min-h-[170px]"
      >
        <div class="flex flex-col items-center w-full pt-1.5">
          <!-- Icon wrapper -->
          <div :class="['w-11 h-11 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all border shrink-0 shadow-2xs', getIconConfig(sc.icon).boxClass]">
            <component :is="getIconConfig(sc.icon).comp" class="w-5.5 h-5.5" />
          </div>
          <div class="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-[#FF6A00] transition-colors mt-2.5 text-center w-full truncate">
            {{ sc.title }}
          </div>
        </div>
        <p class="text-[11px] sm:text-xs text-slate-400 group-hover:text-slate-500 line-clamp-2 mt-1.5 leading-relaxed text-center w-full px-1">
          {{ sc.description }}
        </p>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  SlidersHorizontal,
  Terminal,
  Code2,
  FolderPlus,
  Database,
  ShieldCheck,
  Clock,
  Share2,
  Activity,
  Network,
  ArrowDownToLine,
  Workflow,
  Zap,
  BarChart3,
  Cpu,
  KeyRound,
  FileText,
  Sparkles,
  Search,
  Settings,
  Table,
} from 'lucide-vue-next';
import { ShortcutItem, PrimaryModule } from '../types';

interface QuickShortcutsProps {
  shortcuts: ShortcutItem[];
}

defineProps<QuickShortcutsProps>();

defineEmits<{
  (e: 'triggerAction', actionKey: string, module?: PrimaryModule, subMenuId?: string): void;
  (e: 'openConfigModal'): void;
}>();

const getIconConfig = (iconName: string) => {
  switch (iconName) {
    case 'Terminal':
      return { comp: Terminal, boxClass: 'bg-orange-50 text-[#FF6A00] border-orange-100/80' };
    case 'Code2':
      return { comp: Code2, boxClass: 'bg-indigo-50 text-indigo-600 border-indigo-100/80' };
    case 'FolderPlus':
      return { comp: FolderPlus, boxClass: 'bg-sky-50 text-sky-600 border-sky-100/80' };
    case 'Database':
      return { comp: Database, boxClass: 'bg-cyan-50 text-cyan-600 border-cyan-100/80' };
    case 'ShieldCheck':
      return { comp: ShieldCheck, boxClass: 'bg-emerald-50 text-[#00B365] border-emerald-100/80' };
    case 'Clock':
      return { comp: Clock, boxClass: 'bg-amber-50 text-[#FA8C16] border-amber-100/80' };
    case 'Share2':
      return { comp: Share2, boxClass: 'bg-blue-50 text-blue-600 border-blue-100/80' };
    case 'Activity':
      return { comp: Activity, boxClass: 'bg-rose-50 text-[#F5222D] border-rose-100/80' };
    case 'Network':
      return { comp: Network, boxClass: 'bg-purple-50 text-purple-600 border-purple-100/80' };
    case 'ArrowDownToLine':
      return { comp: ArrowDownToLine, boxClass: 'bg-emerald-50 text-emerald-600 border-emerald-100/80' };
    case 'Workflow':
      return { comp: Workflow, boxClass: 'bg-violet-50 text-violet-600 border-violet-100/80' };
    case 'Zap':
      return { comp: Zap, boxClass: 'bg-amber-50 text-amber-500 border-amber-100/80' };
    case 'BarChart3':
      return { comp: BarChart3, boxClass: 'bg-emerald-50 text-emerald-600 border-emerald-100/80' };
    case 'Cpu':
      return { comp: Cpu, boxClass: 'bg-blue-50 text-blue-500 border-blue-100/80' };
    case 'KeyRound':
      return { comp: KeyRound, boxClass: 'bg-amber-50 text-[#FA8C16] border-amber-100/80' };
    case 'FileText':
      return { comp: FileText, boxClass: 'bg-teal-50 text-teal-600 border-teal-100/80' };
    case 'Sparkles':
      return { comp: Sparkles, boxClass: 'bg-purple-50 text-purple-600 border-purple-100/80' };
    case 'Search':
      return { comp: Search, boxClass: 'bg-blue-50 text-blue-600 border-blue-100/80' };
    case 'Settings':
      return { comp: Settings, boxClass: 'bg-slate-100 text-slate-700 border-slate-200' };
    default:
      return { comp: Table, boxClass: 'bg-slate-100 text-slate-600 border-slate-200' };
  }
};
</script>
