import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { QualityDimensionScore } from '../types';
import { QUALITY_DIMENSIONS } from '../data/mockData';

interface DataQualityRadarProps {
  dimensions?: QualityDimensionScore[];
  onOpenGovernance?: () => void;
}

export const DataQualityRadar: React.FC<DataQualityRadarProps> = ({
  dimensions = QUALITY_DIMENSIONS,
  onOpenGovernance,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-4 rounded-full bg-emerald-500" />
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-wide">数据质量六维雷达</h3>
            <p className="text-[11px] text-slate-400">1,280+ 条自动化稽核规则实时监控</p>
          </div>
        </div>

        <button
          onClick={onOpenGovernance}
          className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-medium"
        >
          <span>质量中心</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Dimension Progress Bars */}
      <div className="mt-4 space-y-3">
        {dimensions.map((dim) => {
          const isWarning = dim.abnormalCount > 0;
          return (
            <div key={dim.dimension} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">{dim.dimension}</span>
                <div className="flex items-center gap-2">
                  {isWarning ? (
                    <span className="text-[10px] text-amber-600 font-medium">
                      {dim.abnormalCount} 处波动
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      全量通过
                    </span>
                  )}
                  <span className="font-bold text-slate-800 font-mono">{dim.score}</span>
                </div>
              </div>

              {/* Progress track */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    dim.score >= 98
                      ? 'bg-emerald-500'
                      : dim.score >= 95
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${dim.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Data Governance Tip */}
      <div className="mt-4 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-[11px] text-slate-600 leading-relaxed">
          <span className="font-semibold text-emerald-800">智能质量巡检建议: </span>
          检测到 <span className="font-mono text-slate-800 font-medium">dws_trade_user_daily</span> 主键规则出现阻断，建议优先开启主键去重前置过滤。
        </div>
      </div>
    </div>
  );
};
