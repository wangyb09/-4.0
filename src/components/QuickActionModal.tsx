import React, { useState } from 'react';
import {
  X,
  Terminal,
  FolderPlus,
  GitFork,
  KeyRound,
  CheckCircle2,
  Activity,
  RotateCw,
  Play,
  Save,
  Check,
  Sparkles,
  Database,
  ShieldCheck,
  Clock,
  Share2,
} from 'lucide-react';

interface QuickActionModalProps {
  actionKey: string | null;
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  actionKey,
  onClose,
  onSuccessToast,
}) => {
  if (!actionKey) return null;

  const [sqlCode, setSqlCode] = useState(`-- MaxCompute / Hologres 交互式数据开发 Studio
SELECT 
    t.stat_date,
    t.channel_code,
    COUNT(DISTINCT t.user_id) AS active_users,
    SUM(t.pay_amount) AS total_gmv,
    ROUND(SUM(t.pay_amount) / COUNT(DISTINCT t.user_id), 2) AS arpu
FROM prod_dws_db.dws_trade_user_daily_dt t
WHERE t.stat_date >= DATE_SUB(CURRENT_DATE(), 7)
GROUP BY t.stat_date, t.channel_code
ORDER BY t.stat_date DESC, total_gmv DESC
LIMIT 100;`);

  const [queryRunning, setQueryRunning] = useState(false);
  const [queryResult, setQueryResult] = useState<any[] | null>(null);

  // Sync state
  const [sourceType, setSourceType] = useState('MySQL (阿里云 PolarDB / RDS)');
  const [targetType, setTargetType] = useState('Hologres (实时交互OLAP)');
  const [syncMode, setSyncMode] = useState('实时CDC增量捕获');

  // Permission state
  const [targetTable, setTargetTable] = useState('prod_dws_db.dws_trade_user_daily_dt');
  const [permType, setPermType] = useState('SELECT 查询权限 (脱敏)');
  const [permReason, setPermReason] = useState('');

  // Quality Rule state
  const [ruleType, setRuleType] = useState('主键唯一性校验 (PK_UNIQUE)');
  const [ruleTable, setRuleTable] = useState('dws_trade_user_daily_dt');

  // Backfill state
  const [backfillDateRange, setBackfillDateRange] = useState('2026-08-15 ~ 2026-08-24');

  // Governance state
  const [govTargetModule, setGovTargetModule] = useState('质量规则监控与智能巡检');
  
  // Scheduling state
  const [scheduleTaskName, setScheduleTaskName] = useState('dag_dws_trade_user_daily_summary');
  const [scheduleCron, setScheduleCron] = useState('0 0 2 * * ? (每日凌晨02:00)');

  // API sharing state
  const [apiName, setApiName] = useState('queryUserTradeDailyStats');
  const [apiPath, setApiPath] = useState('/api/v1/service/trade/user-daily');
  const [apiRateLimit, setApiRateLimit] = useState('10,000 QPS / IP');

  // Metadata lake ingestion state
  const [lakeCatalog, setLakeCatalog] = useState('Apache Iceberg Lakehouse (prod_iceberg_catalog)');
  const [metaSourceCluster, setMetaSourceCluster] = useState('全源多通道 (MySQL + PolarDB + Kafka + ClickHouse)');
  const [metaSyncStrategy, setMetaSyncStrategy] = useState('CDC实时捕获 + 小时级增量巡检');

  const handleRunSql = () => {
    setQueryRunning(true);
    setTimeout(() => {
      setQueryRunning(false);
      setQueryResult([
        { stat_date: '2026-08-25', channel_code: 'APP_IOS', active_users: '142,500', total_gmv: '¥ 8,420,190', arpu: '¥ 59.08' },
        { stat_date: '2026-08-25', channel_code: 'APP_ANDROID', active_users: '198,200', total_gmv: '¥ 9,830,450', arpu: '¥ 49.59' },
        { stat_date: '2026-08-25', channel_code: 'WECHAT_MINI', active_users: '86,400', total_gmv: '¥ 3,210,000', arpu: '¥ 37.15' },
        { stat_date: '2026-08-24', channel_code: 'APP_IOS', active_users: '139,800', total_gmv: '¥ 8,190,000', arpu: '¥ 58.58' },
      ]);
      onSuccessToast('SQL 执行成功！计算引擎 MaxCompute 耗时 320ms，共返回 4 条聚合统计记录');
    }, 800);
  };

  const handleGenericSubmit = (title: string) => {
    onSuccessToast(`操作成功：已完成【${title}】的提交并生效！`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white border border-[#E5E6EB] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#E5E6EB] flex items-center justify-between bg-[#FAFAFA]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-orange-50 border border-orange-200 text-[#FF6A00]">
              {actionKey === 'open_sql_ide' ? (
                <Terminal className="w-4 h-4" />
              ) : actionKey === 'create_sync_job' ? (
                <FolderPlus className="w-4 h-4" />
              ) : actionKey === 'search_lineage' ? (
                <Database className="w-4 h-4 text-cyan-600" />
              ) : actionKey === 'open_data_governance' ? (
                <ShieldCheck className="w-4 h-4 text-[#00B365]" />
              ) : actionKey === 'open_task_scheduling' ? (
                <Clock className="w-4 h-4 text-[#FA8C16]" />
              ) : actionKey === 'open_api_sharing' ? (
                <Share2 className="w-4 h-4 text-indigo-600" />
              ) : actionKey === 'apply_table_perm' ? (
                <KeyRound className="w-4 h-4" />
              ) : actionKey === 'create_quality_rule' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <RotateCw className="w-4 h-4" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                {actionKey === 'open_sql_ide' && 'SQL 开发工作台 · 交互调试 (DataStudio)'}
                {actionKey === 'create_sync_job' && '新建数据集成管道 (DataWorks DataX)'}
                {actionKey === 'search_lineage' && '统一元数据入湖 · 湖仓多源注册 (Metadata Lake)'}
                {actionKey === 'open_data_governance' && '数据治理工作台 · 质量与标准'}
                {actionKey === 'open_task_scheduling' && '任务调度编排与运行监控 (DAG Scheduler)'}
                {actionKey === 'open_api_sharing' && '接口共享服务平台 · 数据服务API发布'}
                {actionKey === 'apply_table_perm' && '快速申请数据表访问权限 (RAM Security)'}
                {actionKey === 'create_quality_rule' && '新建数据质量稽核规则 (DQC)'}
                {actionKey === 'view_dag_ops' && '调度任务运维实时大盘 (Operation Center)'}
                {actionKey === 'launch_backfill' && '历史数据批量补数向导'}
                {actionKey === 'open_standards' && '数仓标准与指标字典规范'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                环境: <span className="text-[#FF6A00] font-mono">cn-hangzhou-prod (计算引擎 MaxCompute / Hologres)</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Action Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs text-slate-600">
          {/* Case 1: SQL IDE */}
          {actionKey === 'open_sql_ide' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-mono">计算引擎: MaxCompute / Hologres MPP (P99: 45ms)</span>
                <button
                  onClick={handleRunSql}
                  disabled={queryRunning}
                  className="px-3 py-1.5 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] text-white font-medium flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Play className={`w-3.5 h-3.5 ${queryRunning ? 'animate-spin' : 'fill-white'}`} />
                  <span>{queryRunning ? '正在并行查询...' : '运行查询 (F8)'}</span>
                </button>
              </div>

              {/* Editor textarea */}
              <div className="rounded-lg border border-slate-700 overflow-hidden bg-[#1F2329] p-3">
                <textarea
                  value={sqlCode}
                  onChange={(e) => setSqlCode(e.target.value)}
                  rows={8}
                  className="w-full bg-transparent font-mono text-xs text-emerald-400 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Result table if any */}
              {queryResult && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-800">查询结果集预览 (4 rows)</div>
                  <div className="overflow-x-auto border border-[#E5E6EB] rounded-lg">
                    <table className="w-full text-left font-mono text-[11px]">
                      <thead className="bg-[#FAFAFA] text-slate-700 border-b border-[#E5E6EB]">
                        <tr>
                          <th className="p-2.5">stat_date</th>
                          <th className="p-2.5">channel_code</th>
                          <th className="p-2.5">active_users</th>
                          <th className="p-2.5">total_gmv</th>
                          <th className="p-2.5">arpu</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {queryResult.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2.5 text-[#1677FF]">{row.stat_date}</td>
                            <td className="p-2.5 text-slate-700">{row.channel_code}</td>
                            <td className="p-2.5 text-slate-700">{row.active_users}</td>
                            <td className="p-2.5 text-[#00B365] font-semibold">{row.total_gmv}</td>
                            <td className="p-2.5 text-[#FF6A00]">{row.arpu}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Case 2: Create Sync Job */}
          {actionKey === 'create_sync_job' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 mb-1.5 font-medium">源端数据源 (Source)</label>
                  <select
                    value={sourceType}
                    onChange={(e) => setSourceType(e.target.value)}
                    className="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 focus:outline-none focus:border-[#FF6A00]"
                  >
                    <option>MySQL (阿里云 PolarDB / RDS)</option>
                    <option>PostgreSQL (CRM 用户系统)</option>
                    <option>Kafka (客户端事件埋点流)</option>
                    <option>Oracle (财务结算核心)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1.5 font-medium">目标数据源 (Sink)</label>
                  <select
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value)}
                    className="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 focus:outline-none focus:border-[#FF6A00]"
                  >
                    <option>Hologres (实时交互OLAP)</option>
                    <option>MaxCompute (离线ODS归档)</option>
                    <option>StarRocks (实时数仓DWD)</option>
                    <option>ClickHouse (用户行为宽表)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1.5 font-medium">同步模式</label>
                <div className="flex gap-2">
                  {['实时CDC增量捕获', '离线按天批量同步', '小时级滑动窗口增量'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSyncMode(mode)}
                      className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                        syncMode === mode
                          ? 'bg-orange-50 text-[#FF6A00] border-[#FF6A00] font-semibold'
                          : 'bg-white text-slate-600 border-[#D9D9D9] hover:bg-slate-50'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded bg-orange-50/50 border border-orange-200 text-[11px] text-[#FF6A00]">
                ⚡ 系统将自动开启 Schema 漂移探测与毫秒级增量捕获，吞吐预计 45,000 QPS。
              </div>
            </div>
          )}

          {/* Case: Unified Metadata Lake Ingestion */}
          {actionKey === 'search_lineage' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 mb-1.5 font-medium">目标湖仓元数据目录 (Lake Catalog)</label>
                  <select
                    value={lakeCatalog}
                    onChange={(e) => setLakeCatalog(e.target.value)}
                    className="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 focus:outline-none focus:border-[#FF6A00]"
                  >
                    <option>Apache Iceberg Lakehouse (prod_iceberg_catalog)</option>
                    <option>Apache Paimon 实时湖仓 (paimon_realtime_catalog)</option>
                    <option>Hive Metastore (hive_emr_central_db)</option>
                    <option>MaxCompute DataWorks 元数据总线</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1.5 font-medium">源端多源纳管范围</label>
                  <select
                    value={metaSourceCluster}
                    onChange={(e) => setMetaSourceCluster(e.target.value)}
                    className="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 focus:outline-none focus:border-[#FF6A00]"
                  >
                    <option>全源多通道 (MySQL + PolarDB + Kafka + ClickHouse)</option>
                    <option>OLTP 关系库集群 (PolarDB/MySQL 12个实例)</option>
                    <option>实时消息流通道 (Kafka / Flink Catalog)</option>
                    <option>数仓与分析引擎 (ClickHouse / Hologres / StarRocks)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1.5 font-medium">元数据入湖同步策略</label>
                <div className="flex flex-wrap gap-2">
                  {['CDC实时捕获 + 小时级增量巡检', '每日全量快照对账 (T+1)', '实时DDL变更事件驱动'].map((strat) => (
                    <button
                      key={strat}
                      onClick={() => setMetaSyncStrategy(strat)}
                      className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                        metaSyncStrategy === strat
                          ? 'bg-cyan-50 text-cyan-700 border-cyan-500 font-semibold'
                          : 'bg-white text-slate-600 border-[#D9D9D9] hover:bg-slate-50'
                      }`}
                    >
                      {strat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ingestion Pipeline Metric Preview */}
              <div className="grid grid-cols-4 gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <div>
                  <div className="text-[10px] text-slate-400">已纳管数据源</div>
                  <div className="text-sm font-bold text-slate-800 font-mono mt-0.5">16 个集群</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">湖仓注册表</div>
                  <div className="text-sm font-bold text-cyan-600 font-mono mt-0.5">1,420 张</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">字段解析数</div>
                  <div className="text-sm font-bold text-slate-800 font-mono mt-0.5">38,650 个</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">采集健康度</div>
                  <div className="text-sm font-bold text-[#00B365] font-mono mt-0.5">99.8%</div>
                </div>
              </div>

              <div className="p-3 rounded bg-cyan-50/60 border border-cyan-200 text-[11px] text-cyan-800">
                🌊 统一元数据入湖引擎已开启自动 DDL 解析、字段注释推导、表物理统计采集与湖仓一体目录注册。
              </div>
            </div>
          )}

          {/* Case 3: Apply Permission */}
          {actionKey === 'apply_table_perm' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-600 mb-1.5 font-medium">申请目标数据表</label>
                <input
                  type="text"
                  value={targetTable}
                  onChange={(e) => setTargetTable(e.target.value)}
                  className="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 font-mono focus:outline-none focus:border-[#FF6A00]"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1.5 font-medium">权限类型</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {['SELECT 查询权限 (脱敏)', 'SELECT 明文导出权限', 'INSERT 写入权限', 'ALTER DDL 变更权限'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPermType(p)}
                      className={`p-2 rounded text-xs font-medium border text-left transition-colors ${
                        permType === p
                          ? 'bg-orange-50 text-[#FF6A00] border-[#FF6A00] font-semibold'
                          : 'bg-white text-slate-600 border-[#D9D9D9] hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1.5 font-medium">申请理由与业务背景</label>
                <textarea
                  value={permReason}
                  onChange={(e) => setPermReason(e.target.value)}
                  placeholder="例如：用于Q3经营分析报表模型搭建，申请 30 天临时访问..."
                  rows={3}
                  className="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6A00]"
                />
              </div>
            </div>
          )}

          {/* Case 4: Quality Rule */}
          {actionKey === 'create_quality_rule' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-600 mb-1.5 font-medium">规则类型</label>
                <select
                  value={ruleType}
                  onChange={(e) => setRuleType(e.target.value)}
                  className="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 focus:outline-none focus:border-[#FF6A00]"
                >
                  <option>主键唯一性校验 (PK_UNIQUE)</option>
                  <option>字段非空率校验 (NOT_NULL &gt; 99%)</option>
                  <option>数值波动率告警 (Volume Drift &lt; 30%)</option>
                  <option>枚举值合法性范围 (Enum In List)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1.5 font-medium">绑定数据表</label>
                <input
                  type="text"
                  value={ruleTable}
                  onChange={(e) => setRuleTable(e.target.value)}
                  className="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 font-mono focus:outline-none focus:border-[#FF6A00]"
                />
              </div>
            </div>
          )}

          {/* Case 5: Backfill */}
          {actionKey === 'launch_backfill' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-600 mb-1.5 font-medium">补数时间周期</label>
                <input
                  type="text"
                  value={backfillDateRange}
                  onChange={(e) => setBackfillDateRange(e.target.value)}
                  className="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 font-mono focus:outline-none focus:border-[#FF6A00]"
                />
              </div>

              <div className="p-3 rounded bg-orange-50/50 border border-orange-200 text-[11px] text-[#FF6A00]">
                ⏳ 补数引擎将自动解析下游 18 个依赖节点的拓扑关系并按顺序并发触发。
              </div>
            </div>
          )}
          {/* Case 6: Data Governance */}
          {actionKey === 'open_data_governance' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-600 mb-1.5 font-medium">治理模块</label>
                <select
                  value={govTargetModule}
                  onChange={(e) => setGovTargetModule(e.target.value)}
                  className="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 focus:outline-none focus:border-[#FF6A00]"
                >
                  <option>质量规则监控与智能巡检 (1,280条规则运行中)</option>
                  <option>数据安全分类与动态脱敏审计 (L1~L4级数据分类)</option>
                  <option>数仓建模规范与命名合规度检测 (ODS/DWD/DWS/ADS)</option>
                  <option>存储生命周期与僵尸表下线分析 (节省约 14.8% 资源)</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded border border-slate-200 text-center">
                <div>
                  <div className="text-[10px] text-slate-400">综合质量得分</div>
                  <div className="text-base font-bold text-[#00B365] font-mono mt-0.5">98.4%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">活跃监控规则</div>
                  <div className="text-base font-bold text-slate-700 font-mono mt-0.5">1,280 条</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">规范覆盖率</div>
                  <div className="text-base font-bold text-[#FF6A00] font-mono mt-0.5">99.1%</div>
                </div>
              </div>

              <div className="p-3 rounded bg-emerald-50/50 border border-emerald-200 text-[11px] text-emerald-800">
                🛡️ 平台已启用自动化质量保障引擎，每日自动对全域核心生产表进行全量对账与离群值探查。
              </div>
            </div>
          )}

          {/* Case 7: Task Scheduling */}
          {actionKey === 'open_task_scheduling' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-600 mb-1.5 font-medium">调度任务实例名称</label>
                <input
                  type="text"
                  value={scheduleTaskName}
                  onChange={(e) => setScheduleTaskName(e.target.value)}
                  className="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 font-mono focus:outline-none focus:border-[#FF6A00]"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1.5 font-medium">CRON 调度周期表达式</label>
                <input
                  type="text"
                  value={scheduleCron}
                  onChange={(e) => setScheduleCron(e.target.value)}
                  className="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 font-mono focus:outline-none focus:border-[#FF6A00]"
                />
              </div>

              <div className="p-3 rounded bg-amber-50/50 border border-amber-200 text-[11px] text-amber-800">
                ⚡ DAG 引擎支持自愈式失败重试、SLA 产出基线预警及跨租户多引擎计算资源隔离。
              </div>
            </div>
          )}

          {/* Case 8: API Sharing */}
          {actionKey === 'open_api_sharing' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-600 mb-1.5 font-medium">API 服务标识</label>
                <input
                  type="text"
                  value={apiName}
                  onChange={(e) => setApiName(e.target.value)}
                  className="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 font-mono focus:outline-none focus:border-[#FF6A00]"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1.5 font-medium">服务路由 Path</label>
                <input
                  type="text"
                  value={apiPath}
                  onChange={(e) => setApiPath(e.target.value)}
                  className="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 font-mono focus:outline-none focus:border-[#FF6A00]"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1.5 font-medium">流控与限流阈值</label>
                <input
                  type="text"
                  value={apiRateLimit}
                  onChange={(e) => setApiRateLimit(e.target.value)}
                  className="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 font-mono focus:outline-none focus:border-[#FF6A00]"
                />
              </div>

              <div className="p-3 rounded bg-indigo-50/50 border border-indigo-200 text-[11px] text-indigo-800">
                🚀 数据接口已直连低延迟 Hologres MPP 计算加速层，提供毫秒级响应并自带鉴权白名单防护。
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#FAFAFA] border-t border-[#E5E6EB] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded bg-white hover:bg-slate-50 text-slate-700 border border-[#D9D9D9] text-xs font-medium"
          >
            取消
          </button>

          <button
            onClick={() => handleGenericSubmit(
              actionKey === 'open_sql_ide' ? 'SQL 工作台调试' :
              actionKey === 'create_sync_job' ? '新建数据集成管道' :
              actionKey === 'search_lineage' ? '统一元数据入湖' :
              actionKey === 'open_data_governance' ? '数据治理策略' :
              actionKey === 'open_task_scheduling' ? '任务调度编排' :
              actionKey === 'open_api_sharing' ? '接口共享发布' :
              actionKey === 'apply_table_perm' ? '申请数据表权限' :
              actionKey === 'create_quality_rule' ? '新建数据质量规则' : '快捷操作生效'
            )}
            className="px-4 py-1.5 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>确认并提交生效</span>
          </button>
        </div>
      </div>
    </div>
  );
};
