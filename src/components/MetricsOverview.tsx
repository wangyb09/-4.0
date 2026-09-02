import React from 'react';
import {
  Database,
  HardDrive,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Zap,
  ShieldCheck,
  RefreshCw,
  Globe,
} from 'lucide-react';
import { PlatformMetrics } from '../types';

interface MetricsOverviewProps {
  metrics: PlatformMetrics;
  onFilterAlerts?: (severity: 'P0' | 'P1' | 'all') => void;
  onNavigateScheduling?: () => void;
  onNavigateQuality?: () => void;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  metrics,
  onFilterAlerts,
  onNavigateScheduling,
  onNavigateQuality,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* 1. 数据资产全景 */}
      <div className="bg-white p-4 rounded-lg border border-[#E5E6EB] shadow-xs hover:border-[#FF6A00] hover:shadow-sm transition-all group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-3 bg-[#FF6A00] rounded-xs inline-block"></span>
            <span className="text-xs text-slate-500 font-medium">
              数据资产全景
            </span>
          </div>
          <div className="w-8 h-8 rounded bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6A00]">
            <Database className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-800 tracking-tight font-mono">
            {metrics.totalTables.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400">张数据表</span>
          <span className="inline-flex items-center gap-0.5 text-xs text-[#00B365] font-semibold ml-auto bg-[#E6F7EB] px-2 py-0.5 rounded border border-[#B7EB8F]">
            <ArrowUpRight className="w-3 h-3" />
            +{metrics.tablesDelta} 新增
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-slate-400" />
            <span>存储总量:</span>
            <span className="font-semibold text-slate-700">{metrics.totalStoragePB} PB</span>
          </div>
          <span className="text-[11px] text-slate-400">
            日增 +{metrics.storageDeltaTB} TB
          </span>
        </div>
      </div>

      {/* 2. 数据质量合格率 (调整到数据资产全景右侧) */}
      <div
        onClick={onNavigateQuality}
        className="bg-white p-4 rounded-lg border border-[#E5E6EB] shadow-xs hover:border-[#FF6A00] hover:shadow-sm cursor-pointer transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-3 bg-[#00B365] rounded-xs inline-block"></span>
            <span className="text-xs text-slate-500 font-medium">
              数据质量合格率
            </span>
          </div>
          <div className="w-8 h-8 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#00B365]">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-800 tracking-tight font-mono">
            {metrics.qualityPassedRulesRate}%
          </span>
          <span className="text-xs text-slate-400">综合得分 {metrics.dataQualityScore}分</span>
          <div className="ml-auto flex items-center gap-1.5">
            {metrics.p0AlertsCount > 0 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onFilterAlerts?.('P0');
                }}
                className="px-1.5 py-0.5 rounded text-[10px] bg-[#FFF1F0] text-[#F5222D] border border-[#FFA39E] font-bold hover:bg-rose-100"
              >
                P0: {metrics.p0AlertsCount}
              </span>
            )}
            {metrics.p1AlertsCount > 0 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onFilterAlerts?.('P1');
                }}
                className="px-1.5 py-0.5 rounded text-[10px] bg-[#FFF7E6] text-[#FA8C16] border border-[#FFD591] font-semibold hover:bg-amber-100"
              >
                P1: {metrics.p1AlertsCount}
              </span>
            )}
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>规则校验通过率达标 (优)</span>
          <span className="text-[11px] text-[#FF6A00] group-hover:underline">治理中心 &rarr;</span>
        </div>
      </div>

      {/* 3. API累计调用次数 */}
      <div className="bg-white p-4 rounded-lg border border-[#E5E6EB] shadow-xs hover:border-[#FF6A00] hover:shadow-sm transition-all group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-3 bg-[#1677FF] rounded-xs inline-block"></span>
            <span className="text-xs text-slate-500 font-medium">
              API累计调用次数
            </span>
          </div>
          <div className="w-8 h-8 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1677FF]">
            <Globe className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-800 tracking-tight font-mono">
            {metrics.totalApiCalls.toLocaleString()}
          </span>
          <span className="text-xs font-medium text-slate-500">万次</span>
          <span className="inline-flex items-center gap-0.5 text-xs text-[#1677FF] font-semibold ml-auto bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            <TrendingUp className="w-3 h-3" />
            +{metrics.apiCallsDeltaPercent}% vs昨日
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span>今日调用:</span>
            <span className="font-semibold text-slate-700">{metrics.dailyApiCallsWan ?? 86.2} 万次</span>
          </div>
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#E6F7EB] text-[#00B365] border border-[#B7EB8F] font-medium">
            成功率 {metrics.apiSuccessRate ?? 99.98}%
          </span>
        </div>
      </div>

      {/* 4. 调度实例健康 */}
      <div
        onClick={onNavigateScheduling}
        className="bg-white p-4 rounded-lg border border-[#E5E6EB] shadow-xs hover:border-[#FF6A00] hover:shadow-sm cursor-pointer transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-3 bg-[#722ED1] rounded-xs inline-block"></span>
            <span className="text-xs text-slate-500 font-medium">
              调度任务实例
            </span>
          </div>
          <div className="w-8 h-8 rounded bg-purple-50 border border-purple-100 flex items-center justify-center text-[#722ED1]">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-800 tracking-tight font-mono">
            {metrics.taskSuccessRate}%
          </span>
          <span className="text-xs text-slate-400">成功率</span>
          <span className="text-xs text-slate-600 font-medium ml-auto bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            共 {metrics.scheduledTasksCount.toLocaleString()} 实例
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#00B365] font-medium">
              <CheckCircle2 className="w-3 h-3" />
              <span>{metrics.scheduledTasksCount - metrics.taskFailedCount - metrics.taskRunningCount}</span>
            </span>
            <span className="flex items-center gap-1 text-[#1677FF] font-medium">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>{metrics.taskRunningCount} 运行</span>
            </span>
            <span className="flex items-center gap-1 text-[#F5222D] font-semibold">
              <AlertTriangle className="w-3 h-3" />
              <span>{metrics.taskFailedCount} 失败</span>
            </span>
          </div>
          <span className="text-[11px] text-[#FF6A00] group-hover:underline">运维大盘 &rarr;</span>
        </div>
      </div>
    </div>
  );
};
