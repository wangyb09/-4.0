import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { MetricsOverview } from './components/MetricsOverview';
import { QuickShortcuts } from './components/QuickShortcuts';
import { TodoList } from './components/TodoList';
import { RecentVisits } from './components/RecentVisits';
import { SchedulingTrendChart } from './components/SchedulingTrendChart';
import { DataQualityRadar } from './components/DataQualityRadar';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AlertDetailModal } from './components/AlertDetailModal';
import { TodoDetailModal } from './components/TodoDetailModal';
import { ShortcutConfigModal } from './components/ShortcutConfigModal';
import { QuickActionModal } from './components/QuickActionModal';
import { SubsystemModuleView } from './components/SubsystemModuleView';

import {
  PrimaryModule,
  PlatformMetrics,
  AlertItem,
  TodoItem,
  RecentVisitItem,
  ShortcutItem,
} from './types';
import {
  INITIAL_METRICS,
  INITIAL_ALERTS,
  INITIAL_TODOS,
  INITIAL_RECENT_VISITS,
  INITIAL_SHORTCUTS,
} from './data/mockData';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Navigation state
  const [activeModule, setActiveModule] = useState<PrimaryModule>('home');
  const [activeSubMenuId, setActiveSubMenuId] = useState<string | undefined>(undefined);
  const [currentSpace, setCurrentSpace] = useState<string>('prod_default');

  // Core Data States
  const [metrics, setMetrics] = useState<PlatformMetrics>(INITIAL_METRICS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [todos, setTodos] = useState<TodoItem[]>(INITIAL_TODOS);
  const [recentVisits, setRecentVisits] = useState<RecentVisitItem[]>(INITIAL_RECENT_VISITS);
  const [shortcuts, setShortcuts] = useState<ShortcutItem[]>(INITIAL_SHORTCUTS);

  // Modal states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null);
  const [isShortcutConfigOpen, setIsShortcutConfigOpen] = useState(false);
  const [quickActionKey, setQuickActionKey] = useState<string | null>(null);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info'>('success');

  const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Keyboard shortcut: Cmd/Ctrl + K for Global Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Alert Handlers
  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId ? { ...a, status: 'resolved' as const } : a
      )
    );
    showToast('告警已成功处置并自动触发重跑自愈链路！');
  };

  const handleIgnoreAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId ? { ...a, status: 'ignored' as const } : a
      )
    );
    showToast('该告警已加入静默观察白名单', 'info');
  };

  // Todo Handlers
  const handleApproveTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'approved' as const } : t))
    );
    showToast('审批已同意通过，权限/模型变更已自动下发生效！');
  };

  const handleRejectTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'rejected' as const } : t))
    );
    showToast('审批工单已驳回并通知申请人重新提交', 'info');
  };

  // Recent Visit Star Toggle
  const handleToggleStar = (id: string) => {
    setRecentVisits((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isStarred: !item.isStarred } : item
      )
    );
    const target = recentVisits.find((i) => i.id === id);
    if (target) {
      showToast(
        target.isStarred ? `已取消收藏 ${target.name}` : `已成功收藏 ${target.name} 至星标资产`
      );
    }
  };

  // Shortcut Pin Toggle
  const handleTogglePinShortcut = (id: string) => {
    setShortcuts((prev) =>
      prev.map((sc) => (sc.id === id ? { ...sc, pinned: !sc.pinned } : sc))
    );
  };

  // Trigger Action from Shortcut
  const handleTriggerAction = (actionKey: string) => {
    setQuickActionKey(actionKey);
  };

  // Open asset from Recent Visits
  const handleOpenAsset = (item: RecentVisitItem) => {
    if (item.category === 'sql_script') {
      setQuickActionKey('open_sql_ide');
    } else if (item.category === 'dag_task') {
      setQuickActionKey('view_dag_ops');
    } else {
      showToast(`已直达数据表【${item.name}】的字典与实时元数据视图`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F3F5] text-slate-800 font-sans antialiased flex flex-col selection:bg-[#FF6A00] selection:text-white">
      {/* 1. Global Header with integrated 1st-level Navigation */}
      <Header
        activeModule={activeModule}
        onSelectModule={(mod, subId) => {
          setActiveModule(mod);
          setActiveSubMenuId(subId);
        }}
        activeSubMenuId={activeSubMenuId}
        pendingTodos={todos}
        alerts={alerts}
        onOpenTodos={() => {
          if (activeModule !== 'home') setActiveModule('home');
          const element = document.getElementById('workbench-todo-section');
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAlerts={() => {
          setActiveModule('governance');
          setActiveSubMenuId('quality_rules');
        }}
        onNavigateHome={() => {
          setActiveModule('home');
          setActiveSubMenuId(undefined);
        }}
      />

      {/* 2. Main Workspace Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 space-y-6">
        {activeModule === 'home' ? (
          <>
            {/* 3.1 Platform Core Metrics Overview */}
            <section id="workbench-metrics-overview">
              <MetricsOverview
                metrics={metrics}
                onFilterAlerts={(sev) => {
                  setActiveModule('governance');
                  setActiveSubMenuId('quality_rules');
                }}
                onNavigateScheduling={() => {
                  setActiveModule('scheduling');
                }}
                onNavigateQuality={() => {
                  setActiveModule('governance');
                }}
              />
            </section>

            {/* 3.2 Quick Shortcuts Bar */}
            <section id="workbench-shortcuts-section">
              <QuickShortcuts
                shortcuts={shortcuts}
                onTriggerAction={handleTriggerAction}
                onOpenConfigModal={() => setIsShortcutConfigOpen(true)}
              />
            </section>
          </>
        ) : (
          /* Subsystem Dedicated Module Workspace */
          <SubsystemModuleView
            module={activeModule}
            activeSubMenuId={activeSubMenuId}
            onNavigateHome={() => {
              setActiveModule('home');
              setActiveSubMenuId(undefined);
            }}
            onOpenQuickAction={handleTriggerAction}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* 4. Global Modals */}
      {/* 4.1 Global Search Modal (Cmd+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectItem={(item) => {
          showToast(`已定位资产：【${item.title}】(${item.type})`);
        }}
      />

      {/* 4.2 Alert RCA Detail Modal */}
      <AlertDetailModal
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onResolve={handleResolveAlert}
      />

      {/* 4.3 Todo Approval Detail Modal */}
      <TodoDetailModal
        todo={selectedTodo}
        onClose={() => setSelectedTodo(null)}
        onApprove={handleApproveTodo}
        onReject={handleRejectTodo}
      />

      {/* 4.4 Customize Shortcuts Config Modal */}
      <ShortcutConfigModal
        isOpen={isShortcutConfigOpen}
        onClose={() => setIsShortcutConfigOpen(false)}
        shortcuts={shortcuts}
        onTogglePin={handleTogglePinShortcut}
      />

      {/* 4.5 Quick Action / SQL IDE / Sync / Perm Modal */}
      <QuickActionModal
        actionKey={quickActionKey}
        onClose={() => setQuickActionKey(null)}
        onSuccessToast={showToast}
      />

      {/* 5. Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div
            className={`px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2.5 text-xs font-medium border bg-white ${
              toastType === 'success'
                ? 'border-emerald-200 text-slate-800'
                : 'border-orange-200 text-slate-800'
            }`}
          >
            {toastType === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#00B365] shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#FF6A00] shrink-0" />
            )}
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 6. Footer in Aliyun console style */}
      <footer className="border-t border-[#E5E6EB] bg-white py-3 text-center text-xs text-slate-500">
        <div className="max-w-[1600px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>阿里云 DataWorks · 智能数据中台与治理工作台</span>
          <span className="font-mono text-slate-400">华东1 (杭州) 集群节点全量在线 · P99: 45ms</span>
        </div>
      </footer>
    </div>
  );
}
