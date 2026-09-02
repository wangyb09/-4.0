import React, { useState } from 'react';
import {
  Bell,
  CheckSquare,
  Database,
  LayoutDashboard,
  ArrowDownToLine,
  ShieldCheck,
  Code2,
  Clock,
  Settings,
  ChevronRight,
  ChevronDown,
  Search,
  HelpCircle,
  Layers,
} from 'lucide-react';
import { AlertItem, TodoItem, PrimaryModule } from '../types';
import { PRIMARY_MODULES } from '../data/mockData';

interface HeaderProps {
  activeModule: PrimaryModule;
  onSelectModule: (module: PrimaryModule, subMenuId?: string) => void;
  activeSubMenuId?: string;
  pendingTodos: TodoItem[];
  alerts: AlertItem[];
  onOpenTodos: () => void;
  onOpenAlerts: () => void;
  onNavigateHome: () => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  onSelectModule,
  activeSubMenuId,
  pendingTodos,
  alerts,
  onOpenTodos,
  onOpenAlerts,
  onNavigateHome,
  onOpenSearch,
}) => {
  const [hoveredModule, setHoveredModule] = useState<PrimaryModule | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'LayoutDashboard':
        return <LayoutDashboard className="w-3.5 h-3.5" />;
      case 'Database':
        return <Database className="w-3.5 h-3.5" />;
      case 'ArrowDownToLine':
        return <ArrowDownToLine className="w-3.5 h-3.5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'Code2':
        return <Code2 className="w-3.5 h-3.5" />;
      case 'Clock':
        return <Clock className="w-3.5 h-3.5" />;
      case 'Settings':
        return <Settings className="w-3.5 h-3.5" />;
      default:
        return <Database className="w-3.5 h-3.5" />;
    }
  };

  const pendingTodosCount = pendingTodos.filter((t) => t.status === 'pending').length;
  const p0p1AlertsCount = alerts.filter(
    (a) => (a.severity === 'P0' || a.severity === 'P1') && a.status !== 'resolved'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-[#1F2329] text-white border-b border-[#2B313A] shadow-md select-none">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand Logo + Primary Navigation Menu aligned to the left */}
        <div className="flex items-center gap-6 flex-1 min-w-0 h-full">
          <button
            id="btn-platform-home"
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0"
          >
            {/* Aliyun-style Geometric Matrix Icon */}
            <div className="w-7 h-7 rounded bg-[#FF6A00] flex items-center justify-center shadow-xs group-hover:bg-[#FF7D1A] transition-colors">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white group-hover:text-[#FF6A00] transition-colors whitespace-nowrap">
                一体化数据平台
              </span>
            </div>
          </button>

          {/* Top-Level Primary Navigation Menu positioned to the left */}
          <nav className="flex items-center justify-start gap-1 overflow-x-auto py-1 scrollbar-none h-full pl-2 border-l border-[#2B313A]">
            {PRIMARY_MODULES.map((module) => {
              const isActive = activeModule === module.key;
              return (
                <div
                  key={module.key}
                  className="relative group h-full flex items-center"
                  onMouseEnter={() => setHoveredModule(module.key)}
                  onMouseLeave={() => setHoveredModule(null)}
                >
                  <button
                    id={`nav-module-${module.key}`}
                    onClick={() => onSelectModule(module.key)}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all shrink-0 h-9 ${
                      isActive
                        ? 'text-[#FF6A00] bg-[#2B313C] font-semibold shadow-inner'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className={isActive ? 'text-[#FF6A00]' : 'text-slate-400 group-hover:text-slate-200'}>
                      {getIcon(module.icon)}
                    </span>
                    <span>{module.title}</span>
                    {module.subMenus.length > 0 && (
                      <ChevronDown
                        className={`w-3 h-3 transition-transform ${
                          isActive ? 'text-[#FF6A00]' : 'text-slate-400 group-hover:text-slate-200'
                        } ${hoveredModule === module.key ? 'rotate-180' : ''}`}
                      />
                    )}
                    {isActive && (
                      <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#FF6A00] rounded-full" />
                    )}
                  </button>

                  {/* Flyout Submenu on Hover */}
                  {hoveredModule === module.key && module.subMenus.length > 0 && (
                    <div className="absolute left-0 top-full -mt-0.5 w-64 bg-white text-slate-800 border border-[#E5E6EB] rounded-lg shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-2 py-1.5 mb-1 text-[11px] font-semibold text-slate-400 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-slate-600">{module.title} 功能集</span>
                        <span className="text-[10px] font-normal text-[#FF6A00]">{module.subTitle}</span>
                      </div>
                      <div className="space-y-0.5">
                        {module.subMenus.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              onSelectModule(module.key, sub.id);
                              setHoveredModule(null);
                            }}
                            className={`w-full text-left p-2 rounded text-xs transition-colors flex items-start justify-between group/sub ${
                              activeModule === module.key && activeSubMenuId === sub.id
                                ? 'bg-orange-50 text-[#FF6A00] font-medium'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div>
                              <div className="font-medium flex items-center gap-1.5 text-slate-800 group-hover/sub:text-[#FF6A00] transition-colors">
                                <span>{sub.title}</span>
                                {sub.tag && (
                                  <span className="text-[9px] px-1 py-0.2 rounded bg-orange-50 text-[#FF6A00] border border-orange-200">
                                    {sub.tag}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                                {sub.description}
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/sub:text-[#FF6A00] group-hover/sub:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Right: Search, Alerts, Todos & Profile */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Global Search Shortcut */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              title="全局检索 (⌘K)"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#2A303A] text-slate-300 hover:text-white hover:bg-[#343B47] text-xs border border-white/5 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 text-xs">搜索资产/任务</span>
              <kbd className="px-1 py-0.2 text-[10px] bg-[#1F2329] border border-white/10 rounded text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Pending Todos Indicator */}
          <button
            id="btn-header-todos"
            onClick={onOpenTodos}
            title="查看待办审批任务"
            className="relative p-2 rounded bg-[#2A303A] hover:bg-[#343B47] text-slate-300 hover:text-white transition-colors border border-white/5"
          >
            <CheckSquare className="w-4 h-4" />
            {pendingTodosCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-[16px] text-[10px] font-bold bg-[#FF6A00] text-white rounded-full flex items-center justify-center shadow-xs">
                {pendingTodosCount}
              </span>
            )}
          </button>

          {/* Alert Center Indicator */}
          <button
            id="btn-header-alerts"
            onClick={onOpenAlerts}
            title="查看异常告警中心"
            className="relative p-2 rounded bg-[#2A303A] hover:bg-[#343B47] text-slate-300 hover:text-white transition-colors border border-white/5"
          >
            <Bell className="w-4 h-4" />
            {p0p1AlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#F5222D] text-white text-[10px] font-bold items-center justify-center">
                  {p0p1AlertsCount}
                </span>
              </span>
            )}
          </button>

          {/* User Profile in Aliyun Style */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#2B313A]">
            <div className="w-7 h-7 rounded bg-[#FF6A00] flex items-center justify-center text-white font-bold text-xs shadow-xs">
              LC
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-medium text-slate-200 leading-tight">林晨 (主账号)</div>
              <div className="text-[10px] text-slate-400 leading-tight">企业数据架构师</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

