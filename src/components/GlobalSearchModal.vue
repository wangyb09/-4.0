<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
  >
    <div class="w-full max-w-2xl bg-white border border-[#E5E6EB] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
      <!-- Search Input Bar -->
      <div class="p-4 border-b border-[#E5E6EB] flex items-center gap-3">
        <Search class="w-5 h-5 text-[#FF6A00] shrink-0" />
        <input
          ref="inputRef"
          type="text"
          v-model="searchTerm"
          placeholder="搜索全平台表名、SQL作业、DAG任务、血缘字段、标准指标..."
          class="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          autofocus
        />
        <button
          v-if="searchTerm"
          @click="searchTerm = ''"
          class="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
        <button
          @click="$emit('close')"
          class="px-2 py-1 rounded bg-slate-100 text-slate-500 hover:text-slate-700 text-xs border border-slate-200 font-mono cursor-pointer"
        >
          ESC
        </button>
      </div>

      <!-- Filter Pills -->
      <div class="px-4 py-2 border-b border-[#E5E6EB] flex items-center gap-2 overflow-x-auto text-xs bg-[#FAFAFA]">
        <span class="text-slate-400 text-[11px]">分类:</span>
        <button
          v-for="t in ['all', '数据表', '调度DAG', '指标定义', '实时流']"
          :key="t"
          @click="activeType = t"
          :class="[
            'px-2.5 py-1 rounded transition-colors font-medium cursor-pointer',
            activeType === t
              ? 'bg-orange-50 text-[#FF6A00] border border-orange-200 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          ]"
        >
          {{ t === 'all' ? '全部' : t }}
        </button>
      </div>

      <!-- Results List -->
      <div class="flex-1 overflow-y-auto p-3 space-y-2">
        <div v-if="filteredItems.length === 0" class="py-12 text-center text-slate-400 text-xs">
          没有找到匹配的数据资产，请尝试搜索关键词如 "dws"、"order"、"crm"、"gmv"
        </div>
        <div
          v-else
          v-for="item in filteredItems"
          :key="item.id"
          @click="handleSelect(item)"
          class="p-3 rounded-lg bg-[#FAFAFA] hover:bg-white border border-[#E5E6EB] hover:border-[#FF6A00] cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 rounded bg-white border border-[#E5E6EB] group-hover:scale-105 transition-transform">
              <Database v-if="item.type === '数据表'" class="w-4 h-4 text-[#FF6A00]" />
              <Activity v-else-if="item.type === '调度DAG'" class="w-4 h-4 text-[#00B365]" />
              <Sparkles v-else class="w-4 h-4 text-[#1677FF]" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold text-slate-800 group-hover:text-[#FF6A00] font-mono">
                  {{ item.title }}
                </span>
                <span class="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                  {{ item.type }}
                </span>
                <span
                  v-if="item.layer"
                  class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-orange-50 text-[#FF6A00] border border-orange-200"
                >
                  {{ item.layer }}
                </span>
              </div>
              <div class="text-[11px] text-slate-500 flex items-center gap-3 mt-1">
                <span>{{ item.desc }}</span>
                <span>·</span>
                <span>责任人: {{ item.owner }}</span>
              </div>
            </div>
          </div>

          <ArrowRight class="w-4 h-4 text-slate-400 group-hover:text-[#FF6A00] group-hover:translate-x-1 transition-all" />
        </div>
      </div>

      <!-- Footer shortcuts hint -->
      <div class="p-3 bg-[#FAFAFA] border-t border-[#E5E6EB] flex items-center justify-between text-[11px] text-slate-500">
        <div class="flex items-center gap-3">
          <span>按 ↑↓ 选择</span>
          <span>按 Enter 打开</span>
          <span>按 ESC 关闭</span>
        </div>
        <span class="text-[#FF6A00] font-medium">智能资产语义索引库已连接</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import {
  Search,
  X,
  Database,
  Activity,
  ArrowRight,
  Sparkles,
} from 'lucide-vue-next';
import { GLOBAL_SEARCH_MOCK_ITEMS } from '../data/mockData';

interface GlobalSearchModalProps {
  isOpen: boolean;
}

const props = defineProps<GlobalSearchModalProps>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'selectItem', item: any): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const searchTerm = ref('');
const activeType = ref<string>('all');

const filteredItems = computed(() => {
  return GLOBAL_SEARCH_MOCK_ITEMS.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchTerm.value.toLowerCase());

    if (!matchesSearch) return false;
    if (activeType.value === 'all') return true;
    return item.type === activeType.value;
  });
});

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      searchTerm.value = '';
      activeType.value = 'all';
      nextTick(() => {
        inputRef.value?.focus();
      });
    }
  }
);

const handleSelect = (item: any) => {
  emit('selectItem', item);
  emit('close');
};
</script>
