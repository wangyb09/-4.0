import React, { useState } from 'react';
import {
  AlertTriangle,
  Flame,
  Clock,
  User,
  GitFork,
  CheckCircle,
  RotateCcw,
  Eye,
  Filter,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Check,
  Ban,
  Activity,
} from 'lucide-react';
import { AlertItem, AlertSeverity } from '../types';

interface AlertCenterProps {
  alerts: AlertItem[];
  onSelectAlert: (alert: AlertItem) => void;
  onResolveAlert: (alertId: string) => void;
  onIgnoreAlert: (alertId: string) => void;
  activeFilter?: string;
}

export const AlertCenter: React.FC<AlertCenterProps> = ({
  alerts,
  onSelectAlert,
  onResolveAlert,
  onIgnoreAlert,
  activeFilter = 'all',
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>(activeFilter);
  const [statusFilter, setStatusFilter] = useState<'all' | 'unresolved' | 'resolved'>('unresolved');

  const filteredAlerts = alerts.filter((alert) => {
    if (statusFilter === 'unresolved' && alert.status === 'resolved') return false;
    if (statusFilter === 'resolved' && alert.status !== 'resolved') return false;
    if (severityFilter === 'all') return true;
    return alert.severity === severityFilter;
  });

  const p0Count = alerts.filter((a) => a.severity === 'P0' && a.status !== 'resolved').length;
  const p1Count = alerts.filter((a) => a.severity === 'P1' && a.status !== 'resolved').length;
  const p2Count = alerts.filter((a) => a.severity === 'P2' && a.status !== 'resolved').length;
  const p3Count = alerts.filter((a) => a.severity === 'P3' && a.status !== 'resolved').length;

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'P0':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded text-[10px] font-bold bg-[#FFF1F0] text-[#F5222D] border border-[#FFA39E]">
            <Flame className="w-3 h-3 text-[#F5222D]" />
            P0 紧急阻断
          </span>
        );
      case 'P1':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded text-[10px] font-semibold bg-[#FFF7E6] text-[#FA8C16] border border-[#FFD591]">
            <AlertTriangle className="w-3 h-3 text-[#FA8C16]" />
            P1 严重异常
          </span>
        );
      case 'P2':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded text-[10px] font-medium bg-[#E6F4FF] text-[#1677FF] border border-[#91CAFF]">
            <Clock className="w-3 h-3 text-[#1677FF]" />
            P2 告警波动
          </span>
        );
      case 'P3':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded text-[10px] font-medium bg-[#F5F5F5] text-[#595959] border border-[#D9D9D9]">
            P3 变更提示
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs">
      {/* Title & Filter Tabs in Aliyun console style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-3.5 rounded-xs bg-[#F5222D]" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-800 tracking-wide">异常告警中心 (CloudMonitor)</h2>
              <span className="text-xs px-2 py-0.2 rounded bg-[#FFF1F0] text-[#F5222D] font-bold border border-[#FFA39E]">
                {p0Count + p1Count} 条待处置
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              实时追踪任务实例失败、SLA延迟破线、数据质量断言及元数据 Schema 漂移
            </p>
          </div>
        </div>

        {/* Severity Filter Pills in Aliyun style */}
        <div className="flex items-center bg-[#F2F3F5] p-0.5 rounded text-xs self-start sm:self-auto gap-0.5">
          <button
            onClick={() => setSeverityFilter('all')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              severityFilter === 'all'
                ? 'bg-white text-slate-800 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            全部 ({alerts.length})
          </button>
          <button
            onClick={() => setSeverityFilter('P0')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              severityFilter === 'P0'
                ? 'bg-[#FFF1F0] text-[#F5222D] shadow-xs font-bold border border-[#FFA39E]'
                : 'text-slate-500 hover:text-[#F5222D]'
            }`}
          >
            P0 ({p0Count})
          </button>
          <button
            onClick={() => setSeverityFilter('P1')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              severityFilter === 'P1'
                ? 'bg-[#FFF7E6] text-[#FA8C16] shadow-xs font-bold border border-[#FFD591]'
                : 'text-slate-500 hover:text-[#FA8C16]'
            }`}
          >
            P1 ({p1Count})
          </button>
          <button
            onClick={() => setSeverityFilter('P2')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              severityFilter === 'P2'
                ? 'bg-[#E6F4FF] text-[#1677FF] shadow-xs font-semibold border border-[#91CAFF]'
                : 'text-slate-500 hover:text-[#1677FF]'
            }`}
          >
            P2 ({p2Count})
          </button>
          <button
            onClick={() => setSeverityFilter('P3')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              severityFilter === 'P3'
                ? 'bg-white text-slate-800 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            P3 ({p3Count})
          </button>
        </div>
      </div>

      {/* Alert Items List */}
      <div className="mt-3.5 space-y-2.5">
        {filteredAlerts.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
            <CheckCircle className="w-7 h-7 text-[#00B365] mb-2 opacity-80" />
            <span>当前筛选条件下无未解决告警，所有数仓节点运行良好</span>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isResolved = alert.status === 'resolved';
            return (
              <div
                key={alert.id}
                className={`p-3.5 rounded-lg border transition-all ${
                  isResolved
                    ? 'bg-[#FAFAFA] border-[#E5E6EB] opacity-60'
                    : alert.severity === 'P0'
                    ? 'bg-[#FFF9F9] border-[#FFCCC7] hover:border-[#F5222D]'
                    : alert.severity === 'P1'
                    ? 'bg-[#FFFAF0] border-[#FFE7BA] hover:border-[#FA8C16]'
                    : 'bg-white border-[#E5E6EB] hover:border-[#FF6A00]'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  {/* Left info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {getSeverityBadge(alert.severity)}
                      <span className="text-xs px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                        {alert.sourceType}
                      </span>
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {alert.title}
                      </span>
                      {isResolved && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#E6F7EB] text-[#00B365] border border-[#B7EB8F] font-medium">
                          已自愈/已处置
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-2 font-mono bg-[#F9FAFB] p-2 rounded border border-slate-200">
                      {alert.details}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1 text-slate-700">
                        <User className="w-3 h-3 text-slate-400" />
                        责任人: <span className="font-medium">{alert.owner}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        发生: {alert.occurredTime} ({alert.duration})
                      </span>
                      <span className="flex items-center gap-1 text-[#FF6A00]">
                        <GitFork className="w-3 h-3" />
                        {alert.impactScope}
                      </span>
                    </div>
                  </div>

                  {/* Right Actions in Aliyun Button Style */}
                  <div className="flex items-center gap-2 shrink-0 md:self-center">
                    <button
                      onClick={() => onSelectAlert(alert)}
                      className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-slate-700 border border-[#D9D9D9] hover:border-[#FF6A00] hover:text-[#FF6A00] text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#1677FF]" />
                      <span>查看根因</span>
                    </button>

                    {!isResolved && (
                      <>
                        <button
                          onClick={() => onResolveAlert(alert.id)}
                          className="px-3 py-1 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] active:bg-[#E65A00] text-white text-xs font-medium transition-colors flex items-center gap-1 shadow-xs"
                          title="确认已处置或触发重跑链路"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>一键处置</span>
                        </button>
                        <button
                          onClick={() => onIgnoreAlert(alert.id)}
                          className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors border border-transparent hover:border-slate-200"
                          title="静默此告警"
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
