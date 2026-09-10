<template>
  <section id="workbench-data-overview-stats" class="space-y-2">
    <!-- Section Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-0.5">
      <div class="flex items-center gap-2">
        <div class="w-1.5 h-3.5 bg-[#FF6A00] rounded-xs" />
        <h2 class="text-sm font-bold text-slate-800 tracking-tight">
          数据总览
        </h2>
        <span class="text-xs text-slate-400 font-normal hidden sm:inline-block">
          核心数据资产规模与每日动态
        </span>
      </div>

      <!-- View Mode Toggle -->
      <div class="flex items-center gap-3 self-end sm:self-auto text-xs">
        <div class="inline-flex rounded-md bg-[#F2F3F5] p-0.5 border border-[#E5E6EB]">
          <button
            id="btn-overview-mode-both"
            @click="viewMode = 'both'"
            :class="[
              'px-2.5 py-0.5 rounded text-xs font-medium transition-all cursor-pointer',
              viewMode === 'both'
                ? 'bg-white text-slate-800 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            ]"
          >
            全景并排
          </button>
          <button
            id="btn-overview-mode-cumulative"
            @click="viewMode = 'cumulative'"
            :class="[
              'px-2.5 py-0.5 rounded text-xs font-medium transition-all cursor-pointer',
              viewMode === 'cumulative'
                ? 'bg-white text-slate-800 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            ]"
          >
            累计值
          </button>
          <button
            id="btn-overview-mode-today"
            @click="viewMode = 'today'"
            :class="[
              'px-2.5 py-0.5 rounded text-xs font-medium transition-all cursor-pointer',
              viewMode === 'today'
                ? 'bg-white text-slate-800 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            ]"
          >
            当日动态
          </button>
        </div>
      </div>
    </div>

    <!-- 4 Cards Grid: 数据源, 数据表, 字段, 数据量 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      <div
        v-for="item in statsList"
        :key="item.id"
        :id="`stat-card-${item.dimensionKey}`"
        @click="handleCardClick(item)"
        :class="[
          'bg-white p-3.5 sm:p-4 rounded-lg border shadow-xs hover:border-[#FF6A00] hover:shadow-sm cursor-pointer transition-all group flex flex-col justify-between h-[148px]',
          selectedDimension === item.dimensionKey
            ? 'border-[#FF6A00] ring-1 ring-[#FF6A00]'
            : 'border-[#E5E6EB]'
        ]"
      >
        <!-- Row 1: Header - Title & badge on left, Icon on right -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span :class="['w-1.5 h-3.5 rounded-xs inline-block', getColors(item.dimensionKey).barBg]"></span>
            <span class="text-[13px] sm:text-sm text-slate-700 font-semibold tracking-tight">
              {{ item.name }}
            </span>
            <span class="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-normal leading-none">
              {{ item.badge }}
            </span>
          </div>
          <div :class="['w-7 h-7 rounded border flex items-center justify-center shrink-0', getColors(item.dimensionKey).iconBg]">
            <Database v-if="item.dimensionKey === 'datasource'" class="w-4 h-4" />
            <Table v-else-if="item.dimensionKey === 'table'" class="w-4 h-4" />
            <Columns v-else-if="item.dimensionKey === 'field'" class="w-4 h-4" />
            <HardDrive v-else-if="item.dimensionKey === 'volume'" class="w-4 h-4" />
            <Layers v-else class="w-4 h-4" />
          </div>
        </div>

        <!-- Row 2: Two Sub-Cards (累计总值 & 当日动态) -->
        <div class="grid grid-cols-2 gap-2 mt-2.5 flex-1">
          <!-- Sub-Card 1: 累计总值 -->
          <div
            :class="[
              'rounded-md p-2.5 border transition-all flex flex-col justify-center',
              viewMode === 'today'
                ? 'bg-[#F8F9FA]/60 border-[#EFEFEF] opacity-75'
                : viewMode === 'cumulative'
                ? 'bg-[#F0F5FF] border-[#ADC6FF] shadow-2xs'
                : 'bg-[#F8F9FA] border-[#EBEDF0] group-hover:border-slate-300'
            ]"
          >
            <div class="text-[11px] text-slate-500 font-medium">
              累计总值
            </div>
            <div class="flex items-baseline gap-1 mt-1">
              <span class="text-base sm:text-lg font-bold text-slate-800 font-mono tracking-tight">
                {{ item.cumulativeValue }}
              </span>
              <span class="text-[11px] text-slate-400 font-normal">
                {{ item.cumulativeUnit }}
              </span>
            </div>
          </div>

          <!-- Sub-Card 2: 当日动态 -->
          <div
            :class="[
              'rounded-md p-2.5 border transition-all flex flex-col justify-center',
              viewMode === 'cumulative'
                ? 'bg-[#F8F9FA]/60 border-[#EFEFEF] opacity-75'
                : viewMode === 'today'
                ? 'bg-[#E6F7EB] border-[#B7EB8F] shadow-2xs'
                : 'bg-[#F6FBF7] border-[#E0F2E5] group-hover:border-emerald-300'
            ]"
          >
            <div class="flex items-center justify-between">
              <span class="text-[11px] text-emerald-700 font-medium">
                当日动态
              </span>
              <span class="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#00B365] bg-[#E6F7EB] px-1 py-0.2 rounded leading-none border border-emerald-200/50">
                <ArrowUpRight class="w-2.5 h-2.5" />
                {{ formatPositive(item.todayTrend) }}
              </span>
            </div>
            <div class="flex items-baseline gap-1 mt-1">
              <span class="text-base sm:text-lg font-bold text-[#00B365] font-mono tracking-tight">
                {{ formatPositive(item.todayValue) }}
              </span>
              <span class="text-[11px] text-slate-400 font-normal">
                {{ item.todayUnit }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Database,
  Table,
  Columns,
  HardDrive,
  ArrowUpRight,
  Layers,
} from 'lucide-vue-next';
import { DataOverviewStatItem } from '../types';
import { DATA_OVERVIEW_STATS } from '../data/mockData';

interface DataOverviewStatsProps {
  stats?: DataOverviewStatItem[];
}

const props = withDefaults(defineProps<DataOverviewStatsProps>(), {
  stats: () => DATA_OVERVIEW_STATS,
});

const emit = defineEmits<{
  (e: 'selectDimension', key: string): void;
  (e: 'showToast', message: string): void;
}>();

const statsList = computed(() => props.stats || DATA_OVERVIEW_STATS);

const selectedDimension = ref<string | null>(null);
const viewMode = ref<'both' | 'cumulative' | 'today'>('both');

const getColors = (key: string) => {
  switch (key) {
    case 'datasource':
      return {
        barBg: 'bg-[#1677FF]',
        iconBg: 'bg-blue-50 border-blue-100 text-blue-600',
      };
    case 'table':
      return {
        barBg: 'bg-[#FF6A00]',
        iconBg: 'bg-orange-50 border-orange-100 text-[#FF6A00]',
      };
    case 'field':
      return {
        barBg: 'bg-[#00B365]',
        iconBg: 'bg-emerald-50 border-emerald-100 text-[#00B365]',
      };
    case 'volume':
      return {
        barBg: 'bg-[#722ED1]',
        iconBg: 'bg-purple-50 border-purple-100 text-purple-600',
      };
    default:
      return {
        barBg: 'bg-slate-400',
        iconBg: 'bg-slate-50 border-slate-100 text-slate-600',
      };
  }
};

const cleanNumber = (val?: string) => {
  if (!val) return '';
  return val.replace(/^\++/, '').trim();
};

const formatPositive = (val?: string) => {
  const num = cleanNumber(val);
  return num ? `+${num}` : '+0';
};

const handleCardClick = (item: DataOverviewStatItem) => {
  selectedDimension.value = item.dimensionKey;
  emit('selectDimension', item.dimensionKey);
  emit('showToast', `已筛选【${item.name}】全量资产明细与血缘分布`);
};
</script>
