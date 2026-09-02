import React, { useState } from 'react';
import {
  Clock,
  Star,
  Table,
  FileCode,
  GitFork,
  ExternalLink,
  Copy,
  Check,
  Search,
  Sparkles,
  Database,
  Terminal,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { RecentVisitItem, AssetCategory } from '../types';

interface RecentVisitsProps {
  items: RecentVisitItem[];
  onToggleStar: (id: string) => void;
  onOpenAsset: (item: RecentVisitItem) => void;
}

export const RecentVisits: React.FC<RecentVisitsProps> = ({
  items,
  onToggleStar,
  onOpenAsset,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'starred' | 'table' | 'sql_script' | 'dag_task'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    if (activeFilter === 'starred') return item.isStarred;
    if (activeFilter === 'table') return item.category === 'table';
    if (activeFilter === 'sql_script') return item.category === 'sql_script';
    if (activeFilter === 'dag_task') return item.category === 'dag_task';
    return true;
  });

  const getLayerBadge = (layer?: string) => {
    if (!layer) return null;
    const styles: Record<string, string> = {
      ODS: 'bg-blue-50 text-blue-700 border-blue-200',
      DWD: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      DWS: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      ADS: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      DIM: 'bg-amber-50 text-amber-700 border-amber-200',
      STREAM: 'bg-pink-50 text-pink-700 border-pink-200',
    };
    return (
      <span
        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
          styles[layer] || 'bg-slate-100 text-slate-700'
        }`}
      >
        {layer}
      </span>
    );
  };

  const getCategoryIcon = (category: AssetCategory) => {
    switch (category) {
      case 'table':
        return <Table className="w-4 h-4 text-blue-600" />;
      case 'sql_script':
        return <Terminal className="w-4 h-4 text-indigo-600" />;
      case 'dag_task':
        return <Activity className="w-4 h-4 text-emerald-600" />;
      default:
        return <Database className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-4 rounded bg-cyan-500" />
          <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase">近期访问与收藏资产</h2>
          <span className="text-xs text-slate-400">快速继续未完成的开发与排查</span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs self-start sm:self-auto gap-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-md transition-all font-medium ${
              activeFilter === 'all'
                ? 'bg-white text-slate-800 shadow-sm font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            全部 ({items.length})
          </button>
          <button
            onClick={() => setActiveFilter('starred')}
            className={`px-3 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
              activeFilter === 'starred'
                ? 'bg-white text-amber-600 shadow-sm font-semibold'
                : 'text-slate-500 hover:text-amber-600'
            }`}
          >
            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
            <span>已收藏 ({items.filter((i) => i.isStarred).length})</span>
          </button>
          <button
            onClick={() => setActiveFilter('table')}
            className={`px-3 py-1 rounded-md transition-all font-medium ${
              activeFilter === 'table'
                ? 'bg-white text-blue-600 shadow-sm font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            数仓表
          </button>
          <button
            onClick={() => setActiveFilter('sql_script')}
            className={`px-3 py-1 rounded-md transition-all font-medium ${
              activeFilter === 'sql_script'
                ? 'bg-white text-blue-600 shadow-sm font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            SQL脚本
          </button>
          <button
            onClick={() => setActiveFilter('dag_task')}
            className={`px-3 py-1 rounded-md transition-all font-medium ${
              activeFilter === 'dag_task'
                ? 'bg-white text-blue-600 shadow-sm font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            调度DAG
          </button>
        </div>
      </div>

      {/* Grid of Recent Visits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onOpenAsset(item)}
            className="p-4 rounded-xl bg-white hover:bg-slate-50/70 border border-slate-200 hover:border-blue-400 cursor-pointer transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
          >
            <div>
              {/* Header inside card */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 group-hover:scale-105 transition-transform">
                    {getCategoryIcon(item.category)}
                  </div>
                  {getLayerBadge(item.layer)}
                  <span className="text-xs font-mono font-semibold text-slate-800 group-hover:text-blue-600 truncate transition-colors">
                    {item.name}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar(item.id);
                  }}
                  className="text-slate-300 hover:text-amber-400 p-1 transition-colors"
                  title={item.isStarred ? '取消收藏' : '添加收藏'}
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      item.isStarred ? 'fill-amber-400 text-amber-400' : 'text-slate-300 hover:text-amber-400'
                    }`}
                  />
                </button>
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Bottom Meta */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-slate-500">
                <Clock className="w-3 h-3 text-slate-400" />
                {item.lastVisitedTime}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleCopy(e, item.code || item.name, item.id)}
                  className="hover:text-slate-800 flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 transition-colors"
                  title="复制全路径表名/脚本ID"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600 font-medium">已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>复制</span>
                    </>
                  )}
                </button>

                <span className="text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center text-[10px] font-medium">
                  打开 &rarr;
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
