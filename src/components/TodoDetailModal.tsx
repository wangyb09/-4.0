import React from 'react';
import {
  X,
  CheckCircle,
  XCircle,
  KeyRound,
  FileCheck,
  RotateCw,
  Scale,
  ShieldAlert,
  User,
  Building,
  Calendar,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { TodoItem } from '../types';

interface TodoDetailModalProps {
  todo: TodoItem | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const TodoDetailModal: React.FC<TodoDetailModalProps> = ({
  todo,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!todo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200">
                  审批工单
                </span>
                <span className="text-xs font-mono text-slate-400">{todo.id}</span>
              </div>
              <h2 className="text-base font-bold text-slate-800 mt-1">{todo.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-600">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="text-slate-400 text-[10px]">申请人</div>
              <div className="text-slate-800 font-medium mt-0.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {todo.applicant}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">所属部门</div>
              <div className="text-slate-800 font-medium mt-0.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {todo.department}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">提交时间</div>
              <div className="text-slate-800 font-medium mt-0.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {todo.createTime}
              </div>
            </div>
          </div>

          {/* Target Object */}
          <div>
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              目标数据资产 / 范围
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-blue-700 flex items-center justify-between">
              <span>{todo.targetObject}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                {todo.targetCategory}
              </span>
            </div>
          </div>

          {/* Application Reason */}
          <div>
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              申请事由与背景说明
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              {todo.reason}
            </div>
          </div>

          {/* Security Compliance Audit */}
          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1.5">
            <h4 className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              数据安全与合规预检通过
            </h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              系统已完成静态脱敏规则核对，敏感列已自动配置动态掩码（脱敏等级 L2）。批准后将自动记录到平台审计日志中。
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium"
          >
            返回
          </button>

          {todo.status === 'pending' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onReject(todo.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm"
              >
                <XCircle className="w-4 h-4" />
                <span>驳回申请</span>
              </button>
              <button
                onClick={() => {
                  onApprove(todo.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                <span>同意并通过审批</span>
              </button>
            </div>
          ) : (
            <span className="text-xs text-slate-400 font-medium">该审批单已处理完毕</span>
          )}
        </div>
      </div>
    </div>
  );
};
