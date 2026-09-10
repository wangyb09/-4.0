<template>
  <div
    v-if="todo"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
  >
    <div class="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
      <!-- Header -->
      <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
            <FileCheck class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200">
                审批工单
              </span>
              <span class="text-xs font-mono text-slate-400">{{ todo.id }}</span>
            </div>
            <h2 class="text-base font-bold text-slate-800 mt-1">{{ todo.title }}</h2>
          </div>
        </div>

        <button
          @click="$emit('close')"
          class="p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto space-y-5 text-xs text-slate-600">
        <!-- Metadata Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <div class="text-slate-400 text-[10px]">申请人</div>
            <div class="text-slate-800 font-medium mt-0.5 flex items-center gap-1.5">
              <User class="w-3.5 h-3.5 text-slate-400" />
              {{ todo.applicant }}
            </div>
          </div>
          <div>
            <div class="text-slate-400 text-[10px]">所属部门</div>
            <div class="text-slate-800 font-medium mt-0.5 flex items-center gap-1.5">
              <Building class="w-3.5 h-3.5 text-slate-400" />
              {{ todo.department }}
            </div>
          </div>
          <div>
            <div class="text-slate-400 text-[10px]">提交时间</div>
            <div class="text-slate-800 font-medium mt-0.5 flex items-center gap-1.5">
              <Calendar class="w-3.5 h-3.5 text-slate-400" />
              {{ todo.createTime }}
            </div>
          </div>
        </div>

        <!-- Target Object -->
        <div>
          <h3 class="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            目标数据资产 / 范围
          </h3>
          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-blue-700 flex items-center justify-between">
            <span>{{ todo.targetObject }}</span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
              {{ todo.targetCategory }}
            </span>
          </div>
        </div>

        <!-- Application Reason -->
        <div>
          <h3 class="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            申请事由与背景说明
          </h3>
          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            {{ todo.reason }}
          </div>
        </div>

        <!-- Security Compliance Audit -->
        <div class="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1.5">
          <h4 class="text-xs font-bold text-blue-800 flex items-center gap-1.5">
            <AlertCircle class="w-4 h-4" />
            数据安全与合规预检通过
          </h4>
          <p class="text-slate-600 text-[11px] leading-relaxed">
            系统已完成静态脱敏规则核对，敏感列已自动配置动态掩码（脱敏等级 L2）。批准后将自动记录到平台审计日志中。
          </p>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <button
          @click="$emit('close')"
          class="px-4 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium"
        >
          返回
        </button>

        <div v-if="todo.status === 'pending'" class="flex items-center gap-2">
          <button
            @click="handleReject"
            class="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm"
          >
            <XCircle class="w-4 h-4" />
            <span>驳回申请</span>
          </button>
          <button
            @click="handleApprove"
            class="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm"
          >
            <CheckCircle class="w-4 h-4" />
            <span>同意并通过审批</span>
          </button>
        </div>
        <span v-else class="text-xs text-slate-400 font-medium">该审批单已处理完毕</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  X,
  FileCheck,
  User,
  Building,
  Calendar,
  AlertCircle,
  XCircle,
  CheckCircle,
} from 'lucide-vue-next';
import { TodoItem } from '../types';

interface TodoDetailModalProps {
  todo: TodoItem | null;
}

const props = defineProps<TodoDetailModalProps>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'approve', id: string): void;
  (e: 'reject', id: string): void;
}>();

const handleApprove = () => {
  if (props.todo) {
    emit('approve', props.todo.id);
    emit('close');
  }
};

const handleReject = () => {
  if (props.todo) {
    emit('reject', props.todo.id);
    emit('close');
  }
};
</script>
