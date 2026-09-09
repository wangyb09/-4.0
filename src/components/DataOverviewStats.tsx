import React, { useState } from 'react';
import {
  Database,
  Table,
  Columns,
  HardDrive,
  ArrowUpRight,
  Layers,
} from 'lucide-react';
import { DataOverviewStatItem } from '../types';
import { DATA_OVERVIEW_STATS } from '../data/mockData';

interface DataOverviewStatsProps {
  stats?: DataOverviewStatItem[];
  onSelectDimension?: (key: string) => void;
  onShowToast?: (message: string) => void;
}

export const DataOverviewStats: React.FC<DataOverviewStatsProps> = ({
  stats = DATA_OVERVIEW_STATS,
  onSelectDimension,
  onShowToast,
}) => {
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'both' | 'cumulative' | 'today'>('both');

  const getDimensionIcon = (key: string) => {
    switch (key) {
      case 'datasource':
        return <Database className="w-4 h-4" />;
      case 'table':
        return <Table className="w-4 h-4" />;
      case 'field':
        return <Columns className="w-4 h-4" />;
      case 'volume':
        return <HardDrive className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  const getDimensionColorClasses = (key: string) => {
    switch (key) {
      case 'datasource':
        return {
          barBg: 'bg-[#1677FF]',
          iconBg: 'bg-blue-50 border-blue-100 text-blue-600',
        };
      case 'table':
        return {
          barBg: 'bg-[#FF6A00]',
          iconBg: 'bg-orange-50 border-orange-100 text-[#FF6A00]',
        };
      case 'field':
        return {
          barBg: 'bg-[#00B365]',
          iconBg: 'bg-emerald-50 border-emerald-100 text-[#00B365]',
        };
      case 'volume':
        return {
          barBg: 'bg-[#722ED1]',
          iconBg: 'bg-purple-50 border-purple-100 text-purple-600',
        };
      default:
        return {
          barBg: 'bg-slate-400',
          iconBg: 'bg-slate-50 border-slate-100 text-slate-600',
        };
    }
  };

  const cleanNumber = (val?: string) => {
    if (!val) return '';
    return val.replace(/^\++/, '').trim();
  };

  const formatPositive = (val?: string) => {
    const num = cleanNumber(val);
    return num ? `+${num}` : '+0';
  };

  const handleCardClick = (item: DataOverviewStatItem) => {
    setSelectedDimension(item.dimensionKey);
    if (onSelectDimension) {
      onSelectDimension(item.dimensionKey);
    }
    if (onShowToast) {
      onShowToast(`已筛选【${item.name}】全量资产明细与血缘分布`);
    }
  };

  return (
    <section id="workbench-data-overview-stats" className="space-y-2">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-0.5">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-3.5 bg-[#FF6A00] rounded-xs" />
          <h2 className="text-sm font-bold text-slate-800 tracking-tight">
            数据总览
          </h2>
          <span className="text-xs text-slate-400 font-normal hidden sm:inline-block">
            核心数据资产规模与每日动态
          </span>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-3 self-end sm:self-auto text-xs">
          <div className="inline-flex rounded-md bg-[#F2F3F5] p-0.5 border border-[#E5E6EB]">
            <button
              id="btn-overview-mode-both"
              onClick={() => setViewMode('both')}
              className={`px-2.5 py-0.5 rounded text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'both'
                  ? 'bg-white text-slate-800 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              全景并排
            </button>
            <button
              id="btn-overview-mode-cumulative"
              onClick={() => setViewMode('cumulative')}
              className={`px-2.5 py-0.5 rounded text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'cumulative'
                  ? 'bg-white text-slate-800 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              累计值
            </button>
            <button
              id="btn-overview-mode-today"
              onClick={() => setViewMode('today')}
              className={`px-2.5 py-0.5 rounded text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'today'
                  ? 'bg-white text-slate-800 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              当日动态
            </button>
          </div>
        </div>
      </div>

      {/* 4 Cards Grid: 数据源, 数据表, 字段, 数据量 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {stats.map((item) => {
          const colors = getDimensionColorClasses(item.dimensionKey);
          const isSelected = selectedDimension === item.dimensionKey;

          return (
            <div
              key={item.id}
              id={`stat-card-${item.dimensionKey}`}
              onClick={() => handleCardClick(item)}
              className={`bg-white p-3.5 sm:p-4 rounded-lg border shadow-xs hover:border-[#FF6A00] hover:shadow-sm cursor-pointer transition-all group flex flex-col justify-between h-[148px] ${
                isSelected ? 'border-[#FF6A00] ring-1 ring-[#FF6A00]' : 'border-[#E5E6EB]'
              }`}
            >
              {/* Row 1: Header - Title & badge on left, Icon on right */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-3.5 rounded-xs inline-block ${colors.barBg}`}></span>
                  <span className="text-[13px] sm:text-sm text-slate-700 font-semibold tracking-tight">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-normal leading-none">
                    {item.badge}
                  </span>
                </div>
                <div className={`w-7 h-7 rounded border flex items-center justify-center shrink-0 ${colors.iconBg}`}>
                  {getDimensionIcon(item.dimensionKey)}
                </div>
              </div>

              {/* Row 2: Two Sub-Cards (累计总值 & 当日动态) */}
              <div className="grid grid-cols-2 gap-2 mt-2.5 flex-1">
                {/* Sub-Card 1: 累计总值 */}
                <div
                  className={`rounded-md p-2.5 border transition-all flex flex-col justify-center ${
                    viewMode === 'today'
                      ? 'bg-[#F8F9FA]/60 border-[#EFEFEF] opacity-75'
                      : viewMode === 'cumulative'
                      ? 'bg-[#F0F5FF] border-[#ADC6FF] shadow-2xs'
                      : 'bg-[#F8F9FA] border-[#EBEDF0] group-hover:border-slate-300'
                  }`}
                >
                  <div className="text-[11px] text-slate-500 font-medium">
                    累计总值
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-base sm:text-lg font-bold text-slate-800 font-mono tracking-tight">
                      {item.cumulativeValue}
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      {item.cumulativeUnit}
                    </span>
                  </div>
                </div>

                {/* Sub-Card 2: 当日动态 */}
                <div
                  className={`rounded-md p-2.5 border transition-all flex flex-col justify-center ${
                    viewMode === 'cumulative'
                      ? 'bg-[#F8F9FA]/60 border-[#EFEFEF] opacity-75'
                      : viewMode === 'today'
                      ? 'bg-[#E6F7EB] border-[#B7EB8F] shadow-2xs'
                      : 'bg-[#F6FBF7] border-[#E0F2E5] group-hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-emerald-700 font-medium">
                      当日动态
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#00B365] bg-[#E6F7EB] px-1 py-0.2 rounded leading-none border border-emerald-200/50">
                      <ArrowUpRight className="w-2.5 h-2.5" />
                      {formatPositive(item.todayTrend)}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-base sm:text-lg font-bold text-[#00B365] font-mono tracking-tight">
                      {formatPositive(item.todayValue)}
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      {item.todayUnit}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
