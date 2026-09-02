import React, { useState } from 'react';
import {
  Terminal,
  FolderPlus,
  GitFork,
  KeyRound,
  CheckCircle2,
  Activity,
  RotateCw,
  BookOpen,
  SlidersHorizontal,
  Pin,
  Sparkles,
  Search,
  ExternalLink,
  Table,
  Plus,
  ShieldCheck,
  Clock,
  Share2,
} from 'lucide-react';
import { ShortcutItem } from '../types';

interface QuickShortcutsProps {
  shortcuts: ShortcutItem[];
  onTriggerAction: (actionKey: string) => void;
  onOpenConfigModal: () => void;
}

export const QuickShortcuts: React.FC<QuickShortcutsProps> = ({
  shortcuts,
  onTriggerAction,
  onOpenConfigModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: '全部快捷入口' },
    { id: 'develop', label: '数据开发' },
    { id: 'governance', label: '治理与标准' },
    { id: 'ops', label: '调度与运维' },
    { id: 'asset', label: '资产与权限' },
  ];

  const filteredShortcuts = shortcuts.filter((sc) => {
    if (selectedCategory === 'all') return true;
    return sc.category === selectedCategory;
  });

  const getIconWrapper = (iconName: string) => {
    switch (iconName) {
      case 'Terminal':
        return (
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-[#FF6A00] group-hover:scale-110 transition-all border border-orange-100/80 shrink-0 shadow-2xs">
            <Terminal className="w-5.5 h-5.5" />
          </div>
        );
      case 'FolderPlus':
        return (
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#1677FF] group-hover:scale-110 transition-all border border-blue-100/80 shrink-0 shadow-2xs">
            <FolderPlus className="w-5.5 h-5.5" />
          </div>
        );
      case 'GitFork':
        return (
          <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-all border border-cyan-100/80 shrink-0 shadow-2xs">
            <GitFork className="w-5.5 h-5.5" />
          </div>
        );
      case 'ShieldCheck':
        return (
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-[#00B365] group-hover:scale-110 transition-all border border-emerald-100/80 shrink-0 shadow-2xs">
            <ShieldCheck className="w-5.5 h-5.5" />
          </div>
        );
      case 'Clock':
        return (
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-[#FA8C16] group-hover:scale-110 transition-all border border-amber-100/80 shrink-0 shadow-2xs">
            <Clock className="w-5.5 h-5.5" />
          </div>
        );
      case 'Share2':
        return (
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-all border border-indigo-100/80 shrink-0 shadow-2xs">
            <Share2 className="w-5.5 h-5.5" />
          </div>
        );
      case 'KeyRound':
        return (
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-[#FA8C16] group-hover:scale-110 transition-all border border-amber-100/80 shrink-0 shadow-2xs">
            <KeyRound className="w-5.5 h-5.5" />
          </div>
        );
      case 'CheckCircle2':
        return (
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-[#722ED1] group-hover:scale-110 transition-all border border-purple-100/80 shrink-0 shadow-2xs">
            <CheckCircle2 className="w-5.5 h-5.5" />
          </div>
        );
      case 'Activity':
        return (
          <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-[#F5222D] group-hover:scale-110 transition-all border border-rose-100/80 shrink-0 shadow-2xs">
            <Activity className="w-5.5 h-5.5" />
          </div>
        );
      case 'RotateCw':
        return (
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-all border border-indigo-100/80 shrink-0 shadow-2xs">
            <RotateCw className="w-5.5 h-5.5" />
          </div>
        );
      case 'BookOpen':
        return (
          <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 group-hover:scale-110 transition-all border border-teal-100/80 shrink-0 shadow-2xs">
            <BookOpen className="w-5.5 h-5.5" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 group-hover:scale-110 transition-all border border-slate-200 shrink-0 shadow-2xs">
            <Table className="w-5.5 h-5.5" />
          </div>
        );
    }
  };

  return (
    <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 sm:p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-4 rounded-xs bg-[#FF6A00]" />
          <h2 className="text-base font-bold text-slate-800 tracking-wide">常用快捷入口</h2>
          <span className="text-xs text-slate-400">高频数据研发、运维与治理一键直达</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Category Tabs in Aliyun style */}
          <div className="flex items-center bg-[#F2F3F5] p-0.5 rounded-md text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded transition-all font-medium ${
                  selectedCategory === cat.id
                    ? 'bg-white text-[#FF6A00] shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Config Button */}
          <button
            id="btn-configure-shortcuts"
            onClick={onOpenConfigModal}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white hover:bg-slate-50 border border-[#D9D9D9] text-slate-600 hover:border-[#FF6A00] hover:text-[#FF6A00] text-xs transition-colors"
            title="自定义快捷入口与排序"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">自定义配置</span>
          </button>
        </div>
      </div>

      {/* Grid of Shortcuts in vertical orientation, 7 cards in a row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5 mt-4">
        {filteredShortcuts.map((sc) => (
          <button
            key={sc.id}
            id={`shortcut-${sc.id}`}
            onClick={() => onTriggerAction(sc.actionKey)}
            className="bg-[#FAFAFA] hover:bg-white p-3.5 sm:py-6 sm:px-3 border border-[#E5E6EB] rounded-xl text-center hover:border-[#FF6A00] hover:shadow-md cursor-pointer transition-all duration-200 group relative flex flex-col items-center justify-between min-h-[175px] sm:min-h-[188px]"
          >
            {sc.pinned && (
              <Pin className="w-3.5 h-3.5 text-[#FF6A00] fill-[#FF6A00] absolute top-2.5 right-2.5 opacity-80" />
            )}
            {sc.badge && (
              <span className="absolute top-2.5 left-2.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-50 text-[#FF6A00] border border-orange-200/80 leading-none">
                {sc.badge}
              </span>
            )}
            <div className="flex flex-col items-center w-full pt-1.5">
              {getIconWrapper(sc.icon)}
              <div className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-[#FF6A00] transition-colors mt-3.5 text-center w-full truncate">
                {sc.title}
              </div>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed text-center w-full px-1">
              {sc.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
