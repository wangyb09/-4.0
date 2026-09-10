<template>
  <div
    v-if="alert"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
  >
    <div class="w-full max-w-3xl bg-white border border-[#E5E6EB] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
      <!-- Header -->
      <div class="p-4 border-b border-[#E5E6EB] flex items-center justify-between bg-[#FAFAFA]">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded bg-rose-50 border border-rose-200 text-[#F5222D]">
            <Flame class="w-4 h-4" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] px-1.5 py-0.2 rounded bg-[#FFF1F0] text-[#F5222D] font-bold border border-[#FFA39E]">
                {{ alert.severity }} 告警单
              </span>
              <span class="text-xs font-mono text-slate-400">{{ alert.id }}</span>
            </div>
            <h2 class="text-sm font-bold text-slate-800 mt-0.5">{{ alert.title }}</h2>
          </div>
        </div>

        <button
          @click="$emit('close')"
          class="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-5 overflow-y-auto space-y-4 text-xs text-slate-600">
        <!-- Metadata Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-[#FAFAFA] border border-[#E5E6EB]">
          <div>
            <div class="text-slate-400 text-[10px]">监控对象类型</div>
            <div class="text-slate-800 font-medium mt-0.5">{{ alert.sourceType }}</div>
          </div>
          <div>
            <div class="text-slate-400 text-[10px]">责任人</div>
            <div class="text-slate-800 font-medium mt-0.5">{{ alert.owner }}</div>
          </div>
          <div>
            <div class="text-slate-400 text-[10px]">首次发生时间</div>
            <div class="text-slate-800 font-medium mt-0.5">{{ alert.occurredTime }}</div>
          </div>
          <div>
            <div class="text-slate-400 text-[10px]">持续时长</div>
            <div class="text-[#F5222D] font-bold mt-0.5">{{ alert.duration }}</div>
          </div>
        </div>

        <!-- Root Cause Details -->
        <div>
          <h3 class="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldAlert class="w-3.5 h-3.5 text-[#FA8C16]" />
            告警现象与异常详情 (DataWorks / CloudMonitor)
          </h3>
          <div class="p-3 rounded-lg bg-[#FAFAFA] border border-[#E5E6EB] font-mono text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
            {{ alert.details }}
          </div>
        </div>

        <!-- Impact Lineage Topology -->
        <div>
          <h3 class="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <GitFork class="w-3.5 h-3.5 text-[#FF6A00]" />
            下游受影响链路与资产 (Lineage Impact)
          </h3>
          <div class="p-3.5 rounded-lg bg-[#FAFAFA] border border-[#E5E6EB] space-y-2.5">
            <div class="flex items-center gap-2 text-[#F5222D] font-medium text-xs">
              <span class="w-1.5 h-1.5 rounded-full bg-[#F5222D] animate-ping" />
              <span>{{ alert.impactScope }}</span>
            </div>

            <!-- Visual simulated pipeline -->
            <div class="flex items-center gap-2 text-[11px] overflow-x-auto py-1">
              <div class="p-2 rounded bg-white border border-rose-300 text-slate-700 shrink-0 font-mono shadow-2xs">
                {{ alert.sourceName.split(' ')[0] }}
                <div class="text-[9px] text-[#F5222D] font-semibold mt-0.5">发生异常 ⚠️</div>
              </div>
              <ArrowRight class="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <div class="p-2 rounded bg-white border border-amber-300 text-slate-700 shrink-0 font-mono shadow-2xs">
                dws_trade_settlement
                <div class="text-[9px] text-[#FA8C16] mt-0.5">下游等待中 ⏳</div>
              </div>
              <ArrowRight class="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <div class="p-2 rounded bg-white border border-[#E5E6EB] text-slate-700 shrink-0 font-mono shadow-2xs">
                ads_executive_gmv_realtime
                <div class="text-[9px] text-slate-400 mt-0.5">报表阻断 🛑</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommended Resolution Plan -->
        <div class="p-3 rounded-lg bg-orange-50/50 border border-orange-200">
          <h4 class="text-xs font-bold text-[#FF6A00] mb-1">推荐处置措施 (SOP)</h4>
          <p class="text-slate-600 text-[11px] leading-relaxed">
            1. 针对主键唯一性异常，可开启“MaxCompute 自动去重重洗 (Keep Latest)”；<br />
            2. 针对SLA延期，可开启“抢占式计算队列加速 (Priority Boost)”，提升并发线程；<br />
            3. 如系业务上游字段变更，请联系 PolarDB 上游负责人同步 Schema 变更。
          </p>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="p-3.5 bg-[#FAFAFA] border-t border-[#E5E6EB] flex items-center justify-between">
        <button
          @click="$emit('close')"
          class="px-3.5 py-1.5 rounded bg-white hover:bg-slate-50 text-slate-700 border border-[#D9D9D9] text-xs font-medium"
        >
          关闭返回
        </button>

        <div class="flex items-center gap-2">
          <button
            @click="handleResolve"
            class="px-4 py-1.5 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <CheckCircle class="w-3.5 h-3.5" />
            <span>标记已处置 / 触发自愈重跑</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  X,
  Flame,
  GitFork,
  ShieldAlert,
  ArrowRight,
  CheckCircle,
} from 'lucide-vue-next';
import { AlertItem } from '../types';

interface AlertDetailModalProps {
  alert: AlertItem | null;
}

const props = defineProps<AlertDetailModalProps>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'resolve', id: string): void;
}>();

const handleResolve = () => {
  if (props.alert) {
    emit('resolve', props.alert.id);
    emit('close');
  }
};
</script>
