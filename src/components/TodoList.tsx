import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  KeyRound,
  FileCheck,
  RotateCw,
  Scale,
  ShieldAlert,
  User,
  Building,
  Check,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { TodoItem, TodoType } from '../types';

interface TodoListProps {
  todos: TodoItem[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetails: (todo: TodoItem) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onApprove,
  onReject,
  onViewDetails,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  const pendingTodos = todos.filter((t) => t.status === 'pending');
  const completedTodos = todos.filter((t) => t.status !== 'pending');

  const displayedTodos = activeTab === 'pending' ? pendingTodos : completedTodos;

  const getTypeIcon = (type: TodoType) => {
    switch (type) {
      case 'permission_apply':
        return <KeyRound className="w-4 h-4 text-amber-600" />;
      case 'model_publish':
        return <FileCheck className="w-4 h-4 text-blue-600" />;
      case 'backfill_confirm':
        return <RotateCw className="w-4 h-4 text-emerald-600" />;
      case 'sla_appeal':
        return <Scale className="w-4 h-4 text-cyan-600" />;
      case 'quality_issue':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
    }
  };

  const getUrgencyBadge = (urgency: '高' | '中' | '低') => {
    switch (urgency) {
      case '高':
        return <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-50 text-rose-700 font-bold border border-rose-200">紧急</span>;
      case '中':
        return <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700 font-medium border border-amber-200">普通</span>;
      case '低':
        return <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-normal">低优</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-4 rounded bg-amber-500" />
          <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase">待办任务与审批</h2>
          {pendingTodos.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200">
              {pendingTodos.length}
            </span>
          )}
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px]">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium ${
              activeTab === 'pending'
                ? 'bg-white text-slate-800 shadow-sm font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            待审批 ({pendingTodos.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium ${
              activeTab === 'completed'
                ? 'bg-white text-slate-800 shadow-sm font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            已处理 ({completedTodos.length})
          </button>
        </div>
      </div>

      {/* Todo List */}
      <div className="mt-3.5 space-y-3 flex-1 overflow-y-auto max-h-[460px] pr-1">
        {displayedTodos.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
            <CheckCircle className="w-8 h-8 text-emerald-500 mb-2 opacity-70" />
            <span>暂无待处理任务，您的审批队列已全部清空</span>
          </div>
        ) : (
          displayedTodos.map((todo) => {
            const isCompleted = todo.status !== 'pending';
            return (
              <div
                key={todo.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-50/60 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                      {getTypeIcon(todo.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                          {todo.title}
                        </span>
                        {getUrgencyBadge(todo.urgency)}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="text-slate-600 font-medium">{todo.applicant}</span>
                        <span>·</span>
                        <span>{todo.department}</span>
                        <span>·</span>
                        <span>{todo.createTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Target & Reason */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-slate-600 font-mono">
                    <span className="text-slate-400">对象:</span>
                    <span className="truncate max-w-[200px] text-blue-600 font-medium">{todo.targetObject}</span>
                  </div>
                  <div className="text-slate-500 line-clamp-2 bg-slate-50 p-2 rounded border border-slate-100 text-[11px]">
                    {todo.reason}
                  </div>
                </div>

                {/* Inline Action Bar */}
                <div className="mt-3 flex items-center justify-between pt-1">
                  <button
                    onClick={() => onViewDetails(todo)}
                    className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-0.5 transition-colors"
                  >
                    <span>详情与变更对比</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>

                  {!isCompleted ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onReject(todo.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-rose-50 text-rose-600 text-xs border border-slate-200 hover:border-rose-200 font-medium transition-colors flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        <span>驳回</span>
                      </button>
                      <button
                        onClick={() => onApprove(todo.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <Check className="w-3 h-3" />
                        <span>批准通过</span>
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        todo.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {todo.status === 'approved' ? '已批准通过' : '已驳回'}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
