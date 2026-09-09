import React from 'react';
import {
  Bell,
  CheckSquare,
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
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  onSelectModule,
  pendingTodos,
  alerts,
  onOpenTodos,
  onOpenAlerts,
  onNavigateHome,
}) => {
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
                <button
                  key={module.key}
                  id={`nav-module-${module.key}`}
                  onClick={() => onSelectModule(module.key)}
                  className={`relative flex items-center px-3.5 py-1.5 rounded text-xs font-medium transition-all shrink-0 h-9 ${
                    isActive
                      ? 'text-[#FF6A00] bg-[#2B313C] font-semibold shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{module.title}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#FF6A00] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Alerts, Todos & Profile */}
        <div className="flex items-center gap-2 shrink-0">
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

          {/* User Profile Avatar (Static Display) */}
          <div className="flex items-center pl-2 border-l border-[#2B313A]">
            <div
              id="header-user-avatar"
              className="w-7 h-7 rounded bg-[#FF6A00] flex items-center justify-center text-white font-bold text-xs shadow-xs ring-1 ring-white/10 select-none cursor-default"
              title="李晨 (超级管理员)"
            >
              LC
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

