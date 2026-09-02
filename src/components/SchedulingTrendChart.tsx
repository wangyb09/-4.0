import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Clock, Activity, RefreshCw, CheckCircle2, AlertTriangle, Zap, Server } from 'lucide-react';
import { HourlyTaskStats } from '../types';
import { HOURLY_TASK_STATS } from '../data/mockData';

interface SchedulingTrendChartProps {
  data?: HourlyTaskStats[];
}

export const SchedulingTrendChart: React.FC<SchedulingTrendChartProps> = ({
  data = HOURLY_TASK_STATS,
}) => {
  const [timeRange, setTimeRange] = useState<'today' | '7days'>('today');

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-4 rounded-full bg-blue-600" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-800 tracking-wide">调度实例执行流速走势</h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                SLA 履约率 99.85%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              全平台 8,420 个离线与实时 DAG 实例小时级调度产出监控
            </p>
          </div>
        </div>

        {/* Time Filter & Live Indicator */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            集群调度中
          </span>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px]">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                timeRange === 'today'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              今日 24H
            </button>
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                timeRange === '7days'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              近 7 日
            </button>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-64 mt-4 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorRunning" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e11d48" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#e11d48" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="hour"
              stroke="#94a3b8"
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderRadius: '8px',
                color: '#1e293b',
                fontSize: '12px',
                boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.08)',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="success"
              name="成功实例"
              stroke="#2563eb"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSuccess)"
            />
            <Area
              type="monotone"
              dataKey="running"
              name="运行中"
              stroke="#0284c7"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRunning)"
            />
            <Area
              type="monotone"
              dataKey="failed"
              name="失败重试"
              stroke="#e11d48"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorFailed)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Cluster Queue Status Footnotes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <Server className="w-3.5 h-3.5 text-blue-600" />
          <div className="min-w-0">
            <div className="text-slate-500 text-[10px]">Spark 离线队列</div>
            <div className="text-slate-800 font-semibold truncate">负载 68% (正常)</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <Zap className="w-3.5 h-3.5 text-cyan-600" />
          <div className="min-w-0">
            <div className="text-slate-500 text-[10px]">Flink Checkpoint</div>
            <div className="text-emerald-600 font-semibold truncate">99.98% 成功</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <Activity className="w-3.5 h-3.5 text-amber-600" />
          <div className="min-w-0">
            <div className="text-slate-500 text-[10px]">StarRocks 实时</div>
            <div className="text-slate-800 font-semibold truncate">P99: 45ms</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-teal-600" />
          <div className="min-w-0">
            <div className="text-slate-500 text-[10px]">夜间跑批最高峰</div>
            <div className="text-slate-800 font-semibold truncate">03:00 - 05:30</div>
          </div>
        </div>
      </div>
    </div>
  );
};
