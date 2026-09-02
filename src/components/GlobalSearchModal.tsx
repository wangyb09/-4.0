import React, { useState } from 'react';
import {
  Search,
  X,
  Database,
  Terminal,
  Activity,
  GitFork,
  ArrowRight,
  Sparkles,
  Command,
  FileCode,
  Tag,
  Clock,
} from 'lucide-react';
import { GLOBAL_SEARCH_MOCK_ITEMS } from '../data/mockData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectItem,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState<string>('all');

  if (!isOpen) return null;

  const filteredItems = GLOBAL_SEARCH_MOCK_ITEMS.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (activeType === 'all') return true;
    return item.type === activeType;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white border border-[#E5E6EB] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E5E6EB] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#FF6A00] shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索全平台表名、SQL作业、DAG任务、血缘字段、标准指标..."
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded bg-slate-100 text-slate-500 hover:text-slate-700 text-xs border border-slate-200 font-mono"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 border-b border-[#E5E6EB] flex items-center gap-2 overflow-x-auto text-xs bg-[#FAFAFA]">
          <span className="text-slate-400 text-[11px]">分类:</span>
          {['all', '数据表', '调度DAG', '指标定义', '实时流'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-2.5 py-1 rounded transition-colors font-medium ${
                activeType === t
                  ? 'bg-orange-50 text-[#FF6A00] border border-orange-200 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {t === 'all' ? '全部' : t}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              没有找到匹配的数据资产，请尝试搜索关键词如 &quot;dws&quot;、&quot;order&quot;、&quot;crm&quot;、&quot;gmv&quot;
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectItem(item);
                  onClose();
                }}
                className="p-3 rounded-lg bg-[#FAFAFA] hover:bg-white border border-[#E5E6EB] hover:border-[#FF6A00] cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-white border border-[#E5E6EB] group-hover:scale-105 transition-transform">
                    {item.type === '数据表' ? (
                      <Database className="w-4 h-4 text-[#FF6A00]" />
                    ) : item.type === '调度DAG' ? (
                      <Activity className="w-4 h-4 text-[#00B365]" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-[#1677FF]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-[#FF6A00] font-mono">
                        {item.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                        {item.type}
                      </span>
                      {item.layer && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-orange-50 text-[#FF6A00] border border-orange-200">
                          {item.layer}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-1">
                      <span>{item.desc}</span>
                      <span>·</span>
                      <span>责任人: {item.owner}</span>
                    </div>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF6A00] group-hover:translate-x-1 transition-all" />
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="p-3 bg-[#FAFAFA] border-t border-[#E5E6EB] flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>按 ↑↓ 选择</span>
            <span>按 Enter 打开</span>
            <span>按 ESC 关闭</span>
          </div>
          <span className="text-[#FF6A00] font-medium">智能资产语义索引库已连接</span>
        </div>
      </div>
    </div>
  );
};
