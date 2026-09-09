import React from 'react';
import {
  Terminal,
  FolderPlus,
  GitFork,
  KeyRound,
  CheckCircle2,
  Activity,
  RotateCw,
  BookOpen,
  Sparkles,
  Search,
  ExternalLink,
  Table,
  Plus,
  ShieldCheck,
  Clock,
  Share2,
  Database,
  Code2,
  Network,
  ArrowDownToLine,
  Workflow,
  Zap,
  BarChart3,
  Cpu,
  FileText,
  Settings,
  SlidersHorizontal,
} from 'lucide-react';
import { ShortcutItem, PrimaryModule } from '../types';

interface QuickShortcutsProps {
  shortcuts: ShortcutItem[];
  onTriggerAction: (actionKey: string, module?: PrimaryModule, subMenuId?: string) => void;
  onOpenConfigModal?: () => void;
}

export const QuickShortcuts: React.FC<QuickShortcutsProps> = ({
  shortcuts,
  onTriggerAction,
  onOpenConfigModal,
}) => {
  const getIconWrapper = (iconName: string) => {
    switch (iconName) {
      case 'Terminal':
        return (
          <div className="w-11 h-11 bg-orange-50 rounded-lg flex items-center justify-center text-[#FF6A00] group-hover:scale-110 transition-all border border-orange-100/80 shrink-0 shadow-2xs">
            <Terminal className="w-5.5 h-5.5" />
          </div>
        );
      case 'Code2':
        return (
          <div className="w-11 h-11 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-all border border-indigo-100/80 shrink-0 shadow-2xs">
            <Code2 className="w-5.5 h-5.5" />
          </div>
        );
      case 'FolderPlus':
        return (
          <div className="w-11 h-11 bg-sky-50 rounded-lg flex items-center justify-center text-sky-600 group-hover:scale-110 transition-all border border-sky-100/80 shrink-0 shadow-2xs">
            <FolderPlus className="w-5.5 h-5.5" />
          </div>
        );
      case 'Database':
        return (
          <div className="w-11 h-11 bg-cyan-50 rounded-lg flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-all border border-cyan-100/80 shrink-0 shadow-2xs">
            <Database className="w-5.5 h-5.5" />
          </div>
        );
      case 'ShieldCheck':
        return (
          <div className="w-11 h-11 bg-emerald-50 rounded-lg flex items-center justify-center text-[#00B365] group-hover:scale-110 transition-all border border-emerald-100/80 shrink-0 shadow-2xs">
            <ShieldCheck className="w-5.5 h-5.5" />
          </div>
        );
      case 'Clock':
        return (
          <div className="w-11 h-11 bg-amber-50 rounded-lg flex items-center justify-center text-[#FA8C16] group-hover:scale-110 transition-all border border-amber-100/80 shrink-0 shadow-2xs">
            <Clock className="w-5.5 h-5.5" />
          </div>
        );
      case 'Share2':
        return (
          <div className="w-11 h-11 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:scale-110 transition-all border border-blue-100/80 shrink-0 shadow-2xs">
            <Share2 className="w-5.5 h-5.5" />
          </div>
        );
      case 'Activity':
        return (
          <div className="w-11 h-11 bg-rose-50 rounded-lg flex items-center justify-center text-[#F5222D] group-hover:scale-110 transition-all border border-rose-100/80 shrink-0 shadow-2xs">
            <Activity className="w-5.5 h-5.5" />
          </div>
        );
      case 'Network':
        return (
          <div className="w-11 h-11 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 group-hover:scale-110 transition-all border border-purple-100/80 shrink-0 shadow-2xs">
            <Network className="w-5.5 h-5.5" />
          </div>
        );
      case 'ArrowDownToLine':
        return (
          <div className="w-11 h-11 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-all border border-emerald-100/80 shrink-0 shadow-2xs">
            <ArrowDownToLine className="w-5.5 h-5.5" />
          </div>
        );
      case 'Workflow':
        return (
          <div className="w-11 h-11 bg-violet-50 rounded-lg flex items-center justify-center text-violet-600 group-hover:scale-110 transition-all border border-violet-100/80 shrink-0 shadow-2xs">
            <Workflow className="w-5.5 h-5.5" />
          </div>
        );
      case 'Zap':
        return (
          <div className="w-11 h-11 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500 group-hover:scale-110 transition-all border border-amber-100/80 shrink-0 shadow-2xs">
            <Zap className="w-5.5 h-5.5" />
          </div>
        );
      case 'BarChart3':
        return (
          <div className="w-11 h-11 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-all border border-emerald-100/80 shrink-0 shadow-2xs">
            <BarChart3 className="w-5.5 h-5.5" />
          </div>
        );
      case 'Cpu':
        return (
          <div className="w-11 h-11 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 group-hover:scale-110 transition-all border border-blue-100/80 shrink-0 shadow-2xs">
            <Cpu className="w-5.5 h-5.5" />
          </div>
        );
      case 'KeyRound':
        return (
          <div className="w-11 h-11 bg-amber-50 rounded-lg flex items-center justify-center text-[#FA8C16] group-hover:scale-110 transition-all border border-amber-100/80 shrink-0 shadow-2xs">
            <KeyRound className="w-5.5 h-5.5" />
          </div>
        );
      case 'FileText':
        return (
          <div className="w-11 h-11 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 group-hover:scale-110 transition-all border border-teal-100/80 shrink-0 shadow-2xs">
            <FileText className="w-5.5 h-5.5" />
          </div>
        );
      case 'Sparkles':
        return (
          <div className="w-11 h-11 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 group-hover:scale-110 transition-all border border-purple-100/80 shrink-0 shadow-2xs">
            <Sparkles className="w-5.5 h-5.5" />
          </div>
        );
      case 'Search':
        return (
          <div className="w-11 h-11 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:scale-110 transition-all border border-blue-100/80 shrink-0 shadow-2xs">
            <Search className="w-5.5 h-5.5" />
          </div>
        );
      case 'Settings':
        return (
          <div className="w-11 h-11 bg-slate-100 rounded-lg flex items-center justify-center text-slate-700 group-hover:scale-110 transition-all border border-slate-200 shrink-0 shadow-2xs">
            <Settings className="w-5.5 h-5.5" />
          </div>
        );
      default:
        return (
          <div className="w-11 h-11 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 group-hover:scale-110 transition-all border border-slate-200 shrink-0 shadow-2xs">
            <Table className="w-5.5 h-5.5" />
          </div>
        );
    }
  };

  return (
    <div
      id="workbench-shortcuts-container"
      className="bg-white border border-[#E5E6EB] rounded-lg p-3.5 sm:p-4 shadow-xs"
    >
      {/* Container Header */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-3.5 bg-[#FF6A00] rounded-xs" />
          <h2 className="text-sm font-bold text-slate-800 tracking-tight">
            快捷入口
          </h2>
          <span className="text-xs text-slate-400 font-normal hidden sm:inline-block">
            常用功能一键直达
          </span>
        </div>

        {onOpenConfigModal && (
          <button
            id="btn-configure-shortcuts"
            onClick={onOpenConfigModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-[#D9D9D9] text-slate-600 hover:border-[#FF6A00] hover:text-[#FF6A00] text-xs transition-colors font-medium cursor-pointer"
            title="自定义配置快捷入口"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span>自定义配置</span>
          </button>
        )}
      </div>

      {/* Grid of Shortcuts inside the unified card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {shortcuts.map((sc) => (
          <button
            key={sc.id}
            id={`shortcut-${sc.id}`}
            onClick={() => onTriggerAction(sc.actionKey || '', sc.module, sc.subMenuId)}
            className="bg-[#F8F9FA] hover:bg-[#FFF7F0] p-3 sm:py-4.5 sm:px-3 border border-[#EBEDF0] hover:border-[#FF6A00] rounded-lg text-center cursor-pointer transition-all duration-200 group relative flex flex-col items-center justify-between min-h-[162px] sm:min-h-[170px]"
          >
            <div className="flex flex-col items-center w-full pt-1.5">
              {getIconWrapper(sc.icon)}
              <div className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-[#FF6A00] transition-colors mt-2.5 text-center w-full truncate">
                {sc.title}
              </div>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 group-hover:text-slate-500 line-clamp-2 mt-1.5 leading-relaxed text-center w-full px-1">
              {sc.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
