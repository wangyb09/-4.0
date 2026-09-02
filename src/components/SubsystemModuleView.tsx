import React, { useState } from 'react';
import {
  Database,
  ArrowDownToLine,
  ShieldCheck,
  Code2,
  Clock,
  Settings,
  ArrowLeft,
  Search,
  Plus,
  Play,
  CheckCircle2,
  AlertTriangle,
  GitFork,
  Terminal,
  Activity,
  HardDrive,
  Users,
  KeyRound,
  FileCode,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { PrimaryModule } from '../types';
import { PRIMARY_MODULES } from '../data/mockData';

interface SubsystemModuleViewProps {
  module: PrimaryModule;
  activeSubMenuId?: string;
  onNavigateHome: () => void;
  onOpenQuickAction: (actionKey: string) => void;
  onShowToast: (msg: string) => void;
}

export const SubsystemModuleView: React.FC<SubsystemModuleViewProps> = ({
  module,
  activeSubMenuId,
  onNavigateHome,
  onOpenQuickAction,
  onShowToast,
}) => {
  const currentModule = PRIMARY_MODULES.find((m) => m.key === module);
  const [selectedSubId, setSelectedSubId] = useState(
    activeSubMenuId || currentModule?.subMenus[0]?.id || ''
  );
  const [searchFilter, setSearchFilter] = useState('');

  if (!currentModule || module === 'home') return null;

  return (
    <div className="space-y-4">
      {/* Subsystem Breadcrumb Header in Aliyun console style */}
      <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="p-1.5 rounded bg-white hover:bg-slate-50 text-slate-600 hover:text-[#FF6A00] transition-colors border border-[#D9D9D9] hover:border-[#FF6A00]"
            title="返回工作台概览首页"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#FF6A00] font-medium cursor-pointer hover:underline" onClick={onNavigateHome}>
                工作台
              </span>
              <span className="text-xs text-slate-300">/</span>
              <h1 className="text-base font-bold text-slate-800 tracking-wide">{currentModule.title}</h1>
              {currentModule.badge && (
                <span className="text-[10px] px-2 py-0.2 rounded bg-orange-50 text-[#FF6A00] font-semibold border border-orange-200">
                  {currentModule.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{currentModule.subTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateHome()}
            className="px-3 py-1.5 rounded bg-white hover:bg-slate-50 border border-[#D9D9D9] text-slate-700 hover:text-[#FF6A00] text-xs font-medium transition-colors"
          >
            返回控制台首页
          </button>
          <button
            onClick={() => onOpenQuickAction(
              module === 'development' ? 'open_sql_ide' :
              module === 'ingestion' ? 'create_sync_job' :
              module === 'governance' ? 'create_quality_rule' :
              module === 'metadata' ? 'search_lineage' : 'open_sql_ide'
            )}
            className="px-3.5 py-1.5 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新建{currentModule.title}任务</span>
          </button>
        </div>
      </div>

      {/* Subsystem Body Layout: Left Submenu sidebar + Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Submenu Navigation in Aliyun console style */}
        <div className="lg:col-span-1 space-y-3">
          <div className="bg-white border border-[#E5E6EB] rounded-lg p-2 shadow-xs space-y-1">
            <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {currentModule.title} 核心功能模块
            </div>
            {currentModule.subMenus.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubId(sub.id)}
                className={`w-full text-left p-2.5 rounded text-xs transition-all flex items-center justify-between group ${
                  selectedSubId === sub.id
                    ? 'bg-orange-50 text-[#FF6A00] font-semibold border-l-3 border-[#FF6A00] pl-2'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-[#FF6A00]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span>{sub.title}</span>
                    {sub.tag && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded ${
                          selectedSubId === sub.id
                            ? 'bg-[#FF6A00] text-white'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {sub.tag}
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-[10px] mt-0.5 line-clamp-1 ${
                      selectedSubId === sub.id ? 'text-[#FF6A00]/80' : 'text-slate-400'
                    }`}
                  >
                    {sub.description}
                  </div>
                </div>
                <ChevronRight
                  className={`w-3.5 h-3.5 shrink-0 ${
                    selectedSubId === sub.id ? 'text-[#FF6A00]' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Module Health Quick Box */}
          <div className="bg-white border border-[#E5E6EB] rounded-lg p-3.5 shadow-xs text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-600 font-medium">
              <span>子系统服务状态</span>
              <span className="flex items-center gap-1 text-[#00B365] text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00B365] animate-pulse" />
                健康运行中
              </span>
            </div>
            <div className="text-[11px] text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
              数据平台底层执行引擎已就绪，已挂载华东1 (杭州) 集群资源。
            </div>
          </div>
        </div>

        {/* Right Subsystem Content Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Metadata Module Content */}
          {module === 'metadata' && (
            <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {selectedSubId === 'lineage' ? '全景数据血缘与影响分析' : '数据资产目录检索'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    已收拢 14,892 张表，覆盖 MaxCompute, Hologres, MySQL, ClickHouse 多源统一元数据
                  </p>
                </div>
                <button
                  onClick={() => onOpenQuickAction('search_lineage')}
                  className="px-3 py-1.5 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium flex items-center gap-1 shadow-xs transition-colors"
                >
                  <GitFork className="w-3.5 h-3.5" />
                  <span>血缘拓扑可视化</span>
                </button>
              </div>

              {/* Asset table list */}
              <div className="space-y-2">
                {[
                  { name: 'dws_trade_user_daily_dt', db: 'prod_dws_db', layer: 'DWS', owner: '李晨', rows: '4,500万', p0: true },
                  { name: 'dwd_order_detail_di', db: 'prod_dwd_db', layer: 'DWD', owner: '赵峰', rows: '1.2亿', p0: false },
                  { name: 'ods_crm_customer_info', db: 'prod_ods_db', layer: 'ODS', owner: '周宇', rows: '860万', p0: false },
                  { name: 'dim_ecommerce_sku_full_info', db: 'prod_dim_db', layer: 'DIM', owner: '赵峰', rows: '42万', p0: false },
                  { name: 'ads_executive_gmv_realtime', db: 'prod_ads_db', layer: 'ADS', owner: '孙雨涵', rows: '12万', p0: false },
                ].map((row, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#FAFAFA] hover:bg-white border border-[#E5E6EB] hover:border-[#FF6A00] flex items-center justify-between shadow-2xs transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-orange-50 text-[#FF6A00]">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-800">{row.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-orange-50 text-[#FF6A00] border border-orange-200">
                            {row.layer}
                          </span>
                          <span className="text-[10px] text-slate-400">{row.db}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                          <span>总数据量: {row.rows}</span>
                          <span>·</span>
                          <span>负责人: {row.owner}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onShowToast(`已打开 ${row.name} 的元数据字典与血缘图谱`)}
                      className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-[#FF6A00] text-xs border border-[#D9D9D9] hover:border-[#FF6A00] font-medium transition-colors"
                    >
                      查看字典与血缘
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ingestion Module Content */}
          {module === 'ingestion' && (
            <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">数据采集与管道中心 (DataWorks DataX/Flink CDC)</h3>
                  <p className="text-xs text-slate-400 mt-0.5">42 条实时 CDC 管道 + 680 个离线批量同步任务</p>
                </div>
                <button
                  onClick={() => onOpenQuickAction('create_sync_job')}
                  className="px-3 py-1.5 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新建采集管道</span>
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { name: 'binlog_mysql_orders_to_starrocks', type: '实时CDC', qps: '18,400 QPS', delay: '12ms', status: '正常' },
                  { name: 'kafka_app_tracker_to_hdfs', type: '实时日志', qps: '42,000 QPS', delay: '8ms', status: '正常' },
                  { name: 'batch_oracle_finance_daily', type: '离线批量', qps: '已完成', delay: '0', status: '就绪' },
                ].map((pipe, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#FAFAFA] hover:bg-white border border-[#E5E6EB] hover:border-[#FF6A00] flex items-center justify-between shadow-2xs transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-emerald-50 text-[#00B365]">
                        <ArrowDownToLine className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-800">{pipe.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#E6F7EB] text-[#00B365] border border-[#B7EB8F]">
                            {pipe.type}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                          <span>实时流速: {pipe.qps}</span>
                          <span>·</span>
                          <span>端到端延迟: {pipe.delay}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#E6F7EB] text-[#00B365] border border-[#B7EB8F]">
                      {pipe.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Governance Module Content */}
          {module === 'governance' && (
            <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">数据治理与质量监控 (DataWorks DQC)</h3>
                  <p className="text-xs text-slate-400 mt-0.5">质量评分 98.4 分，动态脱敏规则覆盖率 100%</p>
                </div>
                <button
                  onClick={() => onOpenQuickAction('create_quality_rule')}
                  className="px-3 py-1.5 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新建治理规则</span>
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { name: 'RULE_PK_UNIQUE_01 (主键唯一)', target: 'dws_trade_user_daily_dt', status: '阻断告警', score: 'P0' },
                  { name: 'RULE_NOT_NULL_MOBILE (手机号非空)', target: 'ods_crm_customer_info', status: '波动告警', score: 'P1' },
                  { name: 'RULE_GMV_NON_NEGATIVE (金额非负)', target: 'dwd_order_detail_di', status: '全部通过', score: 'P3' },
                ].map((r, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#FAFAFA] hover:bg-white border border-[#E5E6EB] hover:border-[#FF6A00] flex items-center justify-between shadow-2xs transition-all"
                  >
                    <div>
                      <span className="text-xs font-mono font-bold text-slate-800">{r.name}</span>
                      <div className="text-[11px] text-slate-500 mt-0.5">目标: {r.target}</div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                        r.score === 'P0'
                          ? 'bg-[#FFF1F0] text-[#F5222D] border-[#FFA39E]'
                          : r.score === 'P1'
                          ? 'bg-[#FFF7E6] text-[#FA8C16] border-[#FFD591]'
                          : 'bg-[#E6F7EB] text-[#00B365] border-[#B7EB8F]'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Development Module Content */}
          {module === 'development' && (
            <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">SQL / Python / DAG 数据开发工作室</h3>
                  <p className="text-xs text-slate-400 mt-0.5">支持 MaxCompute, Hologres, Spark, Flink 多引擎即席查询</p>
                </div>
                <button
                  onClick={() => onOpenQuickAction('open_sql_ide')}
                  className="px-3 py-1.5 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>打开 SQL Studio</span>
                </button>
              </div>

              <div className="p-4 rounded-lg bg-[#1F2329] border border-slate-700 text-xs font-mono text-emerald-400 space-y-2">
                <div className="text-slate-400 text-[11px]">-- 推荐快速调试示例 (MaxCompute / Hologres):</div>
                <div>SELECT stat_date, count(*) FROM prod_dws_db.dws_trade_user_daily_dt GROUP BY 1 LIMIT 10;</div>
              </div>
            </div>
          )}

          {/* Scheduling Module Content */}
          {module === 'scheduling' && (
            <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">任务调度与运维编排中心 (Operation Center)</h3>
                  <p className="text-xs text-slate-400 mt-0.5">DAG流水线 8,420 实例，支持跨周期依赖与级联补数</p>
                </div>
                <button
                  onClick={() => onOpenQuickAction('launch_backfill')}
                  className="px-3 py-1.5 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>发起批量补数</span>
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { dag: 'dag_order_settlement_hourly', cron: '每小时整点', status: 'SLA延迟 (重试中)', owner: '张敏' },
                  { dag: 'dag_daily_financial_close_pipeline', cron: '每日 02:30', status: '运行成功', owner: '张敏' },
                  { dag: 'dag_offline_user_tag_pipeline', cron: '每日 04:00', status: '运行成功', owner: '赵峰' },
                ].map((d, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#FAFAFA] hover:bg-white border border-[#E5E6EB] hover:border-[#FF6A00] flex items-center justify-between shadow-2xs transition-all"
                  >
                    <div>
                      <span className="text-xs font-mono font-bold text-slate-800">{d.dag}</span>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        调度周期: {d.cron} · 责任人: {d.owner}
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                        d.status.includes('延迟') ? 'bg-[#FFF7E6] text-[#FA8C16] border-[#FFD591]' : 'bg-[#E6F7EB] text-[#00B365] border-[#B7EB8F]'
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Module Content */}
          {module === 'system' && (
            <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">系统管理与 RBAC 权限中心 (RAM / Security)</h3>
                  <p className="text-xs text-slate-400 mt-0.5">多租户隔离、行级/列级动态脱敏鉴权与安全审计</p>
                </div>
                <button
                  onClick={() => onOpenQuickAction('apply_table_perm')}
                  className="px-3 py-1.5 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium flex items-center gap-1 shadow-xs transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>权限申请</span>
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { role: '高级数据架构师 / PM', members: '12 人', access: '全项目空间读写 + 生产发布评审' },
                  { role: '数仓开发工程师', members: '48 人', access: 'DEV/TEST 空间读写 + PROD DWD/DWS' },
                  { role: '业务分析师 / BI', members: '120 人', access: 'PROD ADS 报表层只读 (动态脱敏)' },
                ].map((r, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#FAFAFA] hover:bg-white border border-[#E5E6EB] hover:border-[#FF6A00] flex items-center justify-between shadow-2xs transition-all"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-800">{r.role}</span>
                      <div className="text-[11px] text-slate-500 mt-0.5">{r.access}</div>
                    </div>
                    <span className="text-xs text-slate-600 font-mono font-medium">{r.members}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
