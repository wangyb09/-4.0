import React, { useState } from 'react';
import {
  LayoutDashboard,
  Database,
  ArrowDownToLine,
  ShieldCheck,
  Code2,
  Clock,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { PrimaryModule, ModuleNavInfo } from '../types';
import { PRIMARY_MODULES } from '../data/mockData';

interface NavigationProps {
  activeModule: PrimaryModule;
  onSelectModule: (module: PrimaryModule, subMenuId?: string) => void;
  activeSubMenuId?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeModule,
  onSelectModule,
  activeSubMenuId,
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

  const currentModuleInfo = PRIMARY_MODULES.find((m) => m.key === activeModule);

  return (
    <div className="bg-white border-b border-[#E5E6EB] sticky top-12 z-30 shadow-2xs">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Main Module Tabs in Aliyun navigation style */}
          <nav className="flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-none">
            {PRIMARY_MODULES.map((module) => {
              const isActive = activeModule === module.key;
              return (
                <div
                  key={module.key}
                  className="relative group"
                  onMouseEnter={() => setHoveredModule(module.key)}
                  onMouseLeave={() => setHoveredModule(null)}
                >
                  <button
                    id={`nav-module-${module.key}`}
                    onClick={() => onSelectModule(module.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all shrink-0 ${
                      isActive
                        ? 'bg-orange-50 text-[#FF6A00] font-semibold border-b-2 border-[#FF6A00] rounded-b-none'
                        : 'text-slate-600 hover:text-[#FF6A00] hover:bg-slate-50'
                    }`}
                  >
                    <span className={isActive ? 'text-[#FF6A00]' : 'text-slate-400 group-hover:text-[#FF6A00]'}>
                      {getIcon(module.icon)}
                    </span>
                    <span>{module.title}</span>
                  </button>

                  {/* Flyout Submenu on Hover in Aliyun style */}
                  {hoveredModule === module.key && module.subMenus.length > 0 && (
                    <div className="absolute left-0 top-full mt-0.5 w-64 bg-white border border-[#E5E6EB] rounded-lg shadow-xl p-2 z-50 animate-in fade-in duration-100">
                      <div className="px-2 py-1 mb-1 text-[11px] font-semibold text-slate-400 border-b border-slate-100 flex items-center justify-between">
                        <span>{module.title} 子系统</span>
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
                                ? 'bg-orange-50 text-[#FF6A00] font-semibold'
                                : 'hover:bg-slate-50 text-slate-700 hover:text-[#FF6A00]'
                            }`}
                          >
                            <div>
                              <div className="font-medium flex items-center gap-1.5 text-slate-800">
                                <span>{sub.title}</span>
                                {sub.tag && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-50 text-[#FF6A00] border border-orange-200">
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

          {/* Quick Submenu Quick Pills for the active module */}
          {activeModule !== 'home' && currentModuleInfo && (
            <div className="hidden lg:flex items-center gap-1.5 pl-4 border-l border-[#E5E6EB] text-xs text-slate-500">
              <span className="text-[11px] text-slate-400 font-medium">快速直达:</span>
              {currentModuleInfo.subMenus.slice(0, 3).map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => onSelectModule(activeModule, sub.id)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors border ${
                    activeSubMenuId === sub.id
                      ? 'bg-orange-50 text-[#FF6A00] border-orange-200 font-semibold'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border-[#D9D9D9]'
                  }`}
                >
                  {sub.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
