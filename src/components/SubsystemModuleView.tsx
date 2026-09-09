import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  Filter,
  Network,
  Share2,
  Cpu,
  Server,
  Folder,
  FolderOpen,
  ListTree,
  Layers,
  BarChart3,
  BookOpen,
  Tag,
  Globe,
  FileText,
  Sliders,
  CheckCircle,
  RefreshCw,
  Eye,
  ShieldAlert,
  Monitor,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { PrimaryModule, Level1MenuItem, SecondaryMenuItem } from '../types';
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

  // Compute default sub menu
  const defaultSubId =
    currentModule?.level1Menus?.[0]?.subMenus?.[0]?.id ||
    currentModule?.subMenus?.[0]?.id ||
    '';

  const [selectedSubId, setSelectedSubId] = useState<string>(activeSubMenuId || defaultSubId);
  // Expanded Level 1 nodes state (set of level 1 IDs)
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  // Initialize expanded state when module changes
  useEffect(() => {
    if (currentModule?.level1Menus) {
      const initialExpanded: Record<string, boolean> = {};
      currentModule.level1Menus.forEach((l1) => {
        initialExpanded[l1.id] = true;
      });
      setExpandedNodes(initialExpanded);
    }
  }, [module, currentModule]);

  useEffect(() => {
    if (activeSubMenuId) {
      setSelectedSubId(activeSubMenuId);
    } else if (defaultSubId) {
      setSelectedSubId(defaultSubId);
    }
  }, [activeSubMenuId, defaultSubId]);

  if (!currentModule || module === 'home') return null;

  // Toggle expand/collapse for a level 1 tree node
  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  // Get current active submenu item details
  const activeSubItem = currentModule.subMenus.find((s) => s.id === selectedSubId) ||
    currentModule.level1Menus?.flatMap((l) => l.subMenus).find((s) => s.id === selectedSubId) ||
    currentModule.subMenus[0];

  // Filtered tree menu calculation
  const level1MenuList: Level1MenuItem[] = currentModule.level1Menus && currentModule.level1Menus.length > 0
    ? currentModule.level1Menus
    : [
        {
          id: `${currentModule.key}_default_group`,
          title: currentModule.title,
          subMenus: currentModule.subMenus,
        },
      ];

  return (
    <div className="space-y-4">
      {/* Subsystem Breadcrumb Header */}
      <div className="bg-white border border-[#E5E6EB] rounded-lg p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              <span
                className="text-xs text-[#FF6A00] font-medium cursor-pointer hover:underline"
                onClick={onNavigateHome}
              >
                工作台
              </span>
              <span className="text-xs text-slate-300">/</span>
              <h1 className="text-base font-bold text-slate-800 tracking-wide">{currentModule.title}</h1>
              {activeSubItem && (
                <>
                  <span className="text-xs text-slate-300">/</span>
                  <span className="text-xs font-semibold text-slate-600">{activeSubItem.title}</span>
                </>
              )}
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
            onClick={() => {
              if (module === 'bigdata_platform') {
                onShowToast('正在打开大数据支撑平台集群拓扑与资源配置控制台...');
                return;
              }
              onOpenQuickAction(
                module === 'development'
                  ? 'open_sql_ide'
                  : module === 'ingestion'
                  ? 'create_sync_job'
                  : module === 'governance'
                  ? 'create_quality_rule'
                  : module === 'service'
                  ? 'open_api_sharing'
                  : module === 'scheduling'
                  ? 'launch_backfill'
                  : module === 'metadata'
                  ? 'search_lineage'
                  : module === 'ontology'
                  ? 'search_lineage'
                  : 'open_sql_ide'
              );
            }}
            className="px-3.5 py-1.5 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{module === 'bigdata_platform' ? '集群扩缩容 / 配置' : `新建${currentModule.title}任务`}</span>
          </button>
        </div>
      </div>

      {/* Subsystem Body: Left Tree Menu Sidebar + Right Subsystem Content */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Left Hierarchical Menu Tree in Alibaba Cloud Console style */}
        <div className="w-full lg:w-[210px] shrink-0">
          <div className="bg-white border border-[#E5E6EB] rounded-lg shadow-xs overflow-hidden sticky top-16">
            {/* Tree Node List */}
            <div className="p-2.5 space-y-1 max-h-[calc(100vh-140px)] overflow-y-auto">
              {level1MenuList.map((level1) => {
                const isExpanded = expandedNodes[level1.id] !== false;
                const hasActiveChild = level1.subMenus.some((sub) => sub.id === selectedSubId);

                return (
                  <div key={level1.id} className="space-y-0.5">
                    {/* Level 1 Node Header */}
                    <button
                      onClick={() => toggleNode(level1.id)}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs font-semibold transition-colors group ${
                        hasActiveChild ? 'text-slate-900 bg-slate-100/70' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-slate-400 group-hover:text-slate-600 transition-transform shrink-0">
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 text-[#FF6A00]" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </span>
                        <span className="text-slate-400 shrink-0">
                          {isExpanded ? (
                            <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                          ) : (
                            <Folder className="w-3.5 h-3.5 text-amber-500" />
                          )}
                        </span>
                        <span className="truncate">{level1.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal px-1.5 py-0.2 rounded bg-slate-200/60 shrink-0">
                        {level1.subMenus.length}
                      </span>
                    </button>

                    {/* Level 2 Children (Tree Branch) */}
                    {isExpanded && (
                      <div className="ml-3 pl-2 border-l border-slate-200 space-y-0.5 pt-0.5 pb-1">
                        {level1.subMenus.map((sub) => {
                          const isActive = selectedSubId === sub.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => setSelectedSubId(sub.id)}
                              className={`w-full text-left px-2 py-1.5 rounded text-xs transition-all flex items-center group relative ${
                                isActive
                                  ? 'bg-orange-50 text-[#FF6A00] font-bold border-l-2 border-[#FF6A00] shadow-2xs'
                                  : 'text-slate-600 hover:bg-slate-50 hover:text-[#FF6A00]'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span
                                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                    isActive ? 'bg-[#FF6A00]' : 'bg-slate-300 group-hover:bg-[#FF6A00]'
                                  }`}
                                />
                                <span className="truncate">{sub.title}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Subsystem Content Area */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* ========================================================================= */}
          {/* METADATA MODULE CONTENT (元数据) */}
          {/* ========================================================================= */}
          {module === 'metadata' && (
            <div className="space-y-4">
              {/* If selected: 元数据概览 (metadata_overview) - THE DEFAULT VIEW */}
              {selectedSubId === 'metadata_overview' && (
                <div className="space-y-4">
                  {/* Top Stats Banner */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white border border-[#E5E6EB] rounded-lg p-3.5 shadow-xs">
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>全域数据表总数</span>
                        <Database className="w-4 h-4 text-[#FF6A00]" />
                      </div>
                      <div className="text-xl font-bold text-slate-800 font-mono mt-1">14,892 <span className="text-xs font-normal text-slate-500">张</span></div>
                      <div className="text-[11px] text-[#00B365] mt-1 flex items-center gap-1">
                        <span>今日新增 +38</span>
                        <span className="text-slate-400">· 覆盖率 100%</span>
                      </div>
                    </div>

                    <div className="bg-white border border-[#E5E6EB] rounded-lg p-3.5 shadow-xs">
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>元数据接入源</span>
                        <Server className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div className="text-xl font-bold text-slate-800 font-mono mt-1">18 <span className="text-xs font-normal text-slate-500">个实例</span></div>
                      <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>全部在线健康</span>
                      </div>
                    </div>

                    <div className="bg-white border border-[#E5E6EB] rounded-lg p-3.5 shadow-xs">
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>元数据字段总量</span>
                        <ListTree className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="text-xl font-bold text-slate-800 font-mono mt-1">32.85 <span className="text-xs font-normal text-slate-500">万个</span></div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        <span>已标注业务口径 92.4%</span>
                      </div>
                    </div>

                    <div className="bg-white border border-[#E5E6EB] rounded-lg p-3.5 shadow-xs">
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>全景血缘覆盖率</span>
                        <GitFork className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="text-xl font-bold text-slate-800 font-mono mt-1">99.4%</div>
                      <div className="text-[11px] text-[#00B365] mt-1">
                        <span>穿透分析最深 14 层</span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Architecture Layers Breakdown */}
                  <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#FF6A00]" />
                        <span>数仓四层架构资产分布</span>
                      </h3>
                      <span className="text-xs text-slate-400">更新时间: 今日 15:20:00</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        { layer: 'ODS (原始贴源层)', tables: '8,640', size: '6.4 PB', desc: '业务库CDC与日志采集' },
                        { layer: 'DWD (明细事实层)', tables: '4,320', size: '5.2 PB', desc: '标准化清洗事实事实表' },
                        { layer: 'DWS (汇总聚合层)', tables: '1,280', size: '2.8 PB', desc: '主题域公共宽表' },
                        { layer: 'ADS (应用数据层)', tables: '652', size: '920 TB', desc: '大屏与BI即席报表' },
                        { layer: 'DIM (通用维度层)', tables: '348', size: '180 TB', desc: '公共维表与字典' },
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700">{item.layer}</span>
                          </div>
                          <div className="text-base font-bold text-slate-900 font-mono mt-1.5">{item.tables} <span className="text-[11px] font-normal text-slate-500">张表</span></div>
                          <div className="text-[11px] text-slate-500 mt-0.5">存储: {item.size}</div>
                          <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Connected Data Sources Health Status */}
                  <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-800">元数据采集数据源健康监控</h3>
                        <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          18/18 在线
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedSubId('metadata_collect')}
                        className="text-xs text-[#FF6A00] hover:underline flex items-center gap-1"
                      >
                        <span>配置采集引擎</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { name: 'MaxCompute_Prod_ODPS', engine: 'MaxCompute', status: '正常同步', delay: '12ms', lastSync: '10分钟前' },
                        { name: 'Hologres_Interactive_DB', engine: 'Hologres', status: '正常同步', delay: '8ms', lastSync: '5分钟前' },
                        { name: 'StarRocks_Lakehouse_Cluster', engine: 'StarRocks', status: '正常同步', delay: '15ms', lastSync: '15分钟前' },
                        { name: 'MySQL_Trade_Master', engine: 'MySQL 8.0', status: '正常同步', delay: '22ms', lastSync: '1分钟前' },
                        { name: 'ClickHouse_Log_Cluster', engine: 'ClickHouse', status: '正常同步', delay: '18ms', lastSync: '8分钟前' },
                        { name: 'Apache_Iceberg_Lake', engine: 'Iceberg/Ozone', status: '正常同步', delay: '35ms', lastSync: '半小时前' },
                      ].map((ds, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-slate-800 font-mono">{ds.name}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{ds.engine} · 同步延迟: {ds.delay}</div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {ds.status}
                            </span>
                            <div className="text-[10px] text-slate-400 mt-1">{ds.lastSync}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Core Table Catalog Quick View */}
                  <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-800">全域核心数据表目录</h3>
                      <button
                        onClick={() => onOpenQuickAction('search_lineage')}
                        className="px-3 py-1.5 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <GitFork className="w-3.5 h-3.5" />
                        <span>查看全景血缘</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {[
                        { name: 'dws_trade_user_daily_dt', db: 'prod_dws_db', layer: 'DWS', owner: '李晨', rows: '4,500万', p0: true, desc: '用户日粒度交易汇总宽表' },
                        { name: 'dwd_order_detail_di', db: 'prod_dwd_db', layer: 'DWD', owner: '赵峰', rows: '1.2亿', p0: false, desc: '全渠道订单流水明细表' },
                        { name: 'ods_crm_customer_info', db: 'prod_ods_db', layer: 'ODS', owner: '周宇', rows: '860万', p0: false, desc: 'CRM核心客户基础档案表' },
                        { name: 'dim_ecommerce_sku_full_info', db: 'prod_dim_db', layer: 'DIM', owner: '赵峰', rows: '42万', p0: false, desc: '商品品类SKU全量维表' },
                        { name: 'ads_executive_gmv_realtime', db: 'prod_ads_db', layer: 'ADS', owner: '孙雨涵', rows: '12万', p0: false, desc: '总裁办经营驾驶舱实时指标表' },
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
                                <span>{row.desc}</span>
                                <span>·</span>
                                <span>数据量: {row.rows}</span>
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
                </div>
              )}

              {/* Subview: 元数据采集 (metadata_collect) */}
              {selectedSubId === 'metadata_collect' && (
                <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">元数据采集引擎与同步任务</h3>
                      <p className="text-xs text-slate-400 mt-0.5">定时扫描与增量DDL捕获，覆盖 Hive, MySQL, Doris, Hologres, StarRocks</p>
                    </div>
                    <button
                      onClick={() => onShowToast('正在触发全域元数据即时增量扫描同步...')}
                      className="px-3.5 py-1.5 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>立即触发元数据同步</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {[
                      { name: 'job_collect_maxcompute_daily', interval: '每天 01:00', duration: '2分15秒', count: '14,892张表', status: '成功' },
                      { name: 'job_collect_mysql_cdc_ddl', interval: '实时监听 CDC', duration: '持续运行', count: '32个库', status: '监听中' },
                      { name: 'job_collect_hologres_schema', interval: '每4小时', duration: '45秒', count: '1,420张表', status: '成功' },
                      { name: 'job_collect_iceberg_metadata', interval: '每1小时', duration: '1分10秒', count: '890张表', status: '成功' },
                    ].map((job, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-800 font-mono">{job.name}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">采集周期: {job.interval} · 采集耗时: {job.duration} · 覆盖: {job.count}</div>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {job.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subview: 元数据地图 (metadata_map) */}
              {selectedSubId === 'metadata_map' && (
                <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">元数据全景地图与血缘拓扑可视化</h3>
                      <p className="text-xs text-slate-400 mt-0.5">字段级/表级上下游影响分析，跨引擎端到端脉络追溯</p>
                    </div>
                    <button
                      onClick={() => onOpenQuickAction('search_lineage')}
                      className="px-3.5 py-1.5 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <GitFork className="w-3.5 h-3.5" />
                      <span>打开全景血缘拓扑画布</span>
                    </button>
                  </div>

                  <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-center space-y-3">
                    <GitFork className="w-10 h-10 text-[#FF6A00] mx-auto animate-pulse" />
                    <div className="text-sm font-bold text-white">全景元数据血缘拓扑图谱已就绪</div>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      包含 14,892 张物理表、58.2 万条字段级依赖关系与 412 个实时调度管道。
                    </p>
                    <button
                      onClick={() => onOpenQuickAction('search_lineage')}
                      className="px-4 py-2 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>进入血缘图谱交互探索</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Subview: 元数据分析 (metadata_analysis) */}
              {selectedSubId === 'metadata_analysis' && (
                <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">元数据生命周期与冷热深度分析</h3>
                      <p className="text-xs text-slate-400 mt-0.5">存储增长趋势、僵尸无访问表侦测与生命周期成本治理</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="text-xs text-slate-500">热数据表规模 (&lt;7天频繁读取)</div>
                      <div className="text-lg font-bold text-slate-800 font-mono mt-1">4,280 张</div>
                      <div className="text-[11px] text-emerald-600 mt-0.5">占比 28.7% · 高频访问</div>
                    </div>
                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="text-xs text-slate-500">温数据表规模 (7~90天正常读取)</div>
                      <div className="text-lg font-bold text-slate-800 font-mono mt-1">8,410 张</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">占比 56.5% · 定期汇总</div>
                    </div>
                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="text-xs text-slate-500">冷数据/僵尸表 (&gt;90天无访问)</div>
                      <div className="text-lg font-bold text-amber-600 font-mono mt-1">2,202 张</div>
                      <div className="text-[11px] text-amber-700 mt-0.5">建议归档或转冷存降本</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Subview: 业务域管理 (business_domain) */}
              {selectedSubId === 'business_domain' && (
                <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">业务域与主题域管理</h3>
                      <p className="text-xs text-slate-400 mt-0.5">按核心业务域统筹资产划归与责任人确权</p>
                    </div>
                    <button
                      onClick={() => onShowToast('打开新建业务域弹窗')}
                      className="px-3 py-1.5 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>新建业务域</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {[
                      { domain: '用户域 (User Domain)', code: 'DOM_USER', owner: '李晨', tables: '1,840 张表', status: '正常' },
                      { domain: '交易域 (Trade Domain)', code: 'DOM_TRADE', owner: '赵峰', tables: '3,210 张表', status: '正常' },
                      { domain: '商品域 (Item Domain)', code: 'DOM_ITEM', owner: '周宇', tables: '980 张表', status: '正常' },
                      { domain: '供应链域 (Supply Chain)', code: 'DOM_SCM', owner: '王丽', tables: '1,450 张表', status: '正常' },
                      { domain: '财务域 (Finance Domain)', code: 'DOM_FIN', owner: '张敏', tables: '860 张表', status: '正常' },
                    ].map((d, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-800">{d.domain}</span>
                          <span className="text-[10px] font-mono ml-2 px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">{d.code}</span>
                          <div className="text-[11px] text-slate-500 mt-0.5">归属表资产: {d.tables} · 业务负责人: {d.owner}</div>
                        </div>
                        <button
                          onClick={() => onShowToast(`查看【${d.domain}】资产拓扑与配置`)}
                          className="text-xs text-[#FF6A00] hover:underline"
                        >
                          管理资产
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subview: 术语管理 (glossary_mgmt) */}
              {selectedSubId === 'glossary_mgmt' && (
                <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">业务术语字典库 (Business Glossary)</h3>
                      <p className="text-xs text-slate-400 mt-0.5">统一定义全集团业务指标与术语统一计算口径</p>
                    </div>
                    <button
                      onClick={() => onShowToast('打开新建业务术语向导')}
                      className="px-3 py-1.5 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>新建术语</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {[
                      { term: 'GMV (Gross Merchandise Volume)', zh: '成交总额', desc: '拍下订单总金额，包含付款和未付款金额，剔除运费与优惠券', status: '集团标准' },
                      { term: 'DAU (Daily Active Users)', zh: '日活跃用户数', desc: '当日启动并产生有效网络请求的去重设备/用户账号总数', status: '集团标准' },
                      { term: 'AOV (Average Order Value)', zh: '客单价', desc: '一定时期内成交总额与总支付订单数的比值', status: '集团标准' },
                    ].map((t, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 font-mono">{t.term} ({t.zh})</span>
                          <span className="text-[10px] px-2 py-0.2 rounded bg-orange-50 text-[#FF6A00] border border-orange-200">
                            {t.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1">{t.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subview: 标签管理 (tag_mgmt) */}
              {selectedSubId === 'tag_mgmt' && (
                <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">数据密级与业务标签管理</h3>
                      <p className="text-xs text-slate-400 mt-0.5">安全分类分级 (C1公开 ~ C4极密) 与业务标签打标</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { tag: 'C4 绝密数据 (手机号/身份证/密码哈希)', level: '动态脱敏 + 严格行级审批', count: '148 个字段' },
                      { tag: 'C3 机密数据 (用户收货地址/银行卡号)', level: '静态脱敏 + 查询审计', count: '320 个字段' },
                      { tag: 'C2 秘密数据 (商户内部流水/折扣率)', level: '组织内授权可见', count: '1,240 个字段' },
                      { tag: 'C1 公开数据 (商品名称/公开百科)', level: '全员开放只读', count: '18,400 个字段' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="text-xs font-bold text-slate-800">{item.tag}</div>
                        <div className="text-[11px] text-[#FF6A00] mt-1">控制策略: {item.level}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">覆盖字段规模: {item.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* DATA INGESTION (数据采集) */}
          {/* ========================================================================= */}
          {module === 'ingestion' && (
            <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {activeSubItem?.title || '数据源管理与采集任务'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">50+ 种异构源连接池、42 条实时 CDC 管道 + 680 个离线批量同步任务</p>
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

          {/* ========================================================================= */}
          {/* DATA GOVERNANCE (数据治理: 数据标准 & 数据质量) */}
          {/* ========================================================================= */}
          {module === 'governance' && (
            <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {activeSubItem?.title || '数据治理 · 数据标准与数据质量'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">全域质量评分 98.4 分，1,280+条稽核规则，数据标准落标率 96.8%</p>
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
                  { name: 'RULE_PK_UNIQUE_01 (主键唯一校验)', target: 'dws_trade_user_daily_dt', status: '阻断告警', score: 'P0' },
                  { name: 'RULE_NOT_NULL_MOBILE (手机号非空校验)', target: 'ods_crm_customer_info', status: '波动告警', score: 'P1' },
                  { name: 'RULE_GMV_NON_NEGATIVE (金额非负数校验)', target: 'dwd_order_detail_di', status: '全部通过', score: 'P3' },
                  { name: 'RULE_ENUM_STANDARD_CODE (公共代码合规检查)', target: 'dim_ecommerce_sku_full_info', status: '全部通过', score: 'P3' },
                ].map((r, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#FAFAFA] hover:bg-white border border-[#E5E6EB] hover:border-[#FF6A00] flex items-center justify-between shadow-2xs transition-all"
                  >
                    <div>
                      <span className="text-xs font-mono font-bold text-slate-800">{r.name}</span>
                      <div className="text-[11px] text-slate-500 mt-0.5">校验目标: {r.target}</div>
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

          {/* ========================================================================= */}
          {/* DATA DEVELOPMENT (数据研发) */}
          {/* ========================================================================= */}
          {module === 'development' && (
            <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {activeSubItem?.title || '数据研发 · 作业开发与运维中心'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">支持 MaxCompute, Hologres, Spark, Flink 多引擎即席查询与可视化DAG编排</p>
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

          {/* ========================================================================= */}
          {/* TASK SCHEDULING (任务调度) */}
          {/* ========================================================================= */}
          {module === 'scheduling' && (
            <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {activeSubItem?.title || '任务调度中心 (DAG Orchestration & Ops)'}
                  </h3>
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
                        d.status.includes('延迟')
                          ? 'bg-[#FFF7E6] text-[#FA8C16] border-[#FFD591]'
                          : 'bg-[#E6F7EB] text-[#00B365] border-[#B7EB8F]'
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DATA ASSETS (数据资产) or ONTOLOGY */}
          {/* ========================================================================= */}
          {(module === 'assets' || module === 'ontology') && (
            <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {activeSubItem?.title || '数据资产 · 资产全景与目录'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    覆盖全集团 14,892 张表、48 个核心业务实体、沉淀 320 个关联拓扑关系
                  </p>
                </div>
                <button
                  onClick={() => onShowToast('已进入数据资产全景运营大盘')}
                  className="px-3 py-1.5 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Network className="w-3.5 h-3.5" />
                  <span>资产全景大盘</span>
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { name: 'Customer (客户实体)', domain: '用户域', props: '36 个业务属性', relations: '关联订单、合同、商户', status: '已生效' },
                  { name: 'Order (交易订单实体)', domain: '交易域', props: '52 个业务属性', relations: '关联客户、商品、结算单', status: '已生效' },
                  { name: 'Product_SKU (商品标品)', domain: '商品域', props: '28 个业务属性', relations: '关联类目、库存、商户', status: '已生效' },
                  { name: 'Enterprise_Contract (合同)', domain: '财务域', props: '24 个业务属性', relations: '关联合同方、发票、订单', status: '审核中' },
                ].map((ent, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#FAFAFA] hover:bg-white border border-[#E5E6EB] hover:border-[#FF6A00] flex items-center justify-between shadow-2xs transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-indigo-50 text-indigo-600">
                        <Network className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">{ent.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {ent.domain}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                          <span>{ent.props}</span>
                          <span>·</span>
                          <span>{ent.relations}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#E6F7EB] text-[#00B365] border border-[#B7EB8F]">
                        {ent.status}
                      </span>
                      <button
                        onClick={() => onShowToast(`已加载【${ent.name}】知识图谱与湖仓映射`)}
                        className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-[#FF6A00] text-xs border border-[#D9D9D9] hover:border-[#FF6A00] font-medium transition-colors"
                      >
                        查看实体图谱
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DATA SERVICE (数据服务) */}
          {/* ========================================================================= */}
          {module === 'service' && (
            <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {activeSubItem?.title || '数据服务开放平台 · API共享网关'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    已发布 286 个低代码 API，累计共享 1,285.4 万次，网关成功率 99.98%
                  </p>
                </div>
                <button
                  onClick={() => onOpenQuickAction('open_api_sharing')}
                  className="px-3 py-1.5 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>发布数据 API</span>
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { name: 'getUserDailyTradeProfile', path: '/api/v1/service/trade/user-daily', qps: '4,200 QPS', p99: '18ms', status: '正常运行' },
                  { name: 'queryInventoryRealtime', path: '/api/v1/service/stock/inventory-rt', qps: '8,650 QPS', p99: '22ms', status: '正常运行' },
                  { name: 'checkRiskCreditScore', path: '/api/v1/service/risk/credit-eval', qps: '1,320 QPS', p99: '35ms', status: '正常运行' },
                ].map((api, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#FAFAFA] hover:bg-white border border-[#E5E6EB] hover:border-[#FF6A00] flex items-center justify-between shadow-2xs transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-amber-50 text-amber-600">
                        <Share2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">{api.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                            {api.path}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                          <span>实时负载: {api.qps}</span>
                          <span>·</span>
                          <span>P99 延时: {api.p99}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#E6F7EB] text-[#00B365] border border-[#B7EB8F]">
                        {api.status}
                      </span>
                      <button
                        onClick={() => onShowToast(`已获取 ${api.name} 调用凭据与在线调试文档`)}
                        className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-[#FF6A00] text-xs border border-[#D9D9D9] hover:border-[#FF6A00] font-medium transition-colors"
                      >
                        在线测试
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SYSTEM MANAGEMENT (系统管理) */}
          {/* ========================================================================= */}
          {module === 'system' && (
            <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {activeSubItem?.title || '系统管理与用户权限中心'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">多租户隔离、RBAC鉴权、行级/列级安全访问策略与审计流水</p>
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

          {/* ========================================================================= */}
          {/* BIG DATA PLATFORM (大数据支撑平台) */}
          {/* ========================================================================= */}
          {module === 'bigdata_platform' && (
            <div className="bg-white border border-[#E5E6EB] rounded-lg p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {activeSubItem?.title || '大数据支撑平台与分布式基础设施集群'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    分布式底层存储、YARN & K8s 算力调度、Flink 实时流、Trino 查询及 Iceberg 湖仓引擎集群
                  </p>
                </div>
                <button
                  onClick={() => onShowToast('已进入多集群拓扑监控与硬件指标诊断大盘')}
                  className="px-3 py-1.5 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>集群拓扑大盘</span>
                </button>
              </div>

              {/* Infrastructure Capacity Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">分布式存储容量</div>
                  <div className="text-base font-bold text-slate-800 font-mono mt-0.5">16.8 PB</div>
                  <div className="text-[10px] text-slate-400">已使用 68.4% (HDFS/Ozone)</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">可用计算总核数</div>
                  <div className="text-base font-bold text-slate-800 font-mono mt-0.5">8,640 Cores</div>
                  <div className="text-[10px] text-emerald-600">YARN/K8s 弹性池就绪</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">实时流计算作业</div>
                  <div className="text-base font-bold text-slate-800 font-mono mt-0.5">412 个</div>
                  <div className="text-[10px] text-slate-400">吞吐 185万 TPS (Flink)</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">统一湖格式托管</div>
                  <div className="text-base font-bold text-slate-800 font-mono mt-0.5">14,892 表</div>
                  <div className="text-[10px] text-emerald-600">Iceberg / Paimon 湖仓</div>
                </div>
              </div>

              {/* Engine / Cluster Cards */}
              <div className="space-y-2.5">
                {[
                  {
                    name: 'HDFS & Ozone 分布式存储集群',
                    spec: '48 物理节点 (NVMe SSD + HDD)',
                    usage: '利用率 68.4% · 3副本冗余',
                    status: '运行正常',
                    statusColor: 'text-[#00B365] bg-[#E6F7EB] border-[#B7EB8F]',
                    type: '分布式存储',
                    icon: HardDrive,
                  },
                  {
                    name: 'Spark & YARN 离线计算资源池',
                    spec: '320 活跃容器 (Container) · 内存 32 TB',
                    usage: '队列分配均衡 · 动态抢占开启',
                    status: '运行正常',
                    statusColor: 'text-[#00B365] bg-[#E6F7EB] border-[#B7EB8F]',
                    type: '离线批计算',
                    icon: Cpu,
                  },
                  {
                    name: 'Apache Flink 实时流计算引擎集群',
                    spec: '96 TaskManager · 消息吞吐 185万/s',
                    usage: '平均延迟 18ms · Checkpoint 100%',
                    status: '运行正常',
                    statusColor: 'text-[#00B365] bg-[#E6F7EB] border-[#B7EB8F]',
                    type: '实时流处理',
                    icon: Activity,
                  },
                  {
                    name: 'Trino / Presto 高性能交互式查询引擎',
                    spec: '24 算力Worker节点 · 瞬时并发 42',
                    usage: 'P95响应 1.1s · 向量化加速就绪',
                    status: '健康',
                    statusColor: 'text-[#00B365] bg-[#E6F7EB] border-[#B7EB8F]',
                    type: '即席交互查询',
                    icon: Terminal,
                  },
                  {
                    name: 'Apache Iceberg 统一湖仓元数据服务',
                    spec: '14,892 张生产湖仓表统一注册',
                    usage: '自动Snapshot压缩与小文件合并自愈',
                    status: '服务就绪',
                    statusColor: 'text-[#00B365] bg-[#E6F7EB] border-[#B7EB8F]',
                    type: '数据湖引擎',
                    icon: Database,
                  },
                ].map((cluster, idx) => {
                  const IconComp = cluster.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg bg-[#FAFAFA] hover:bg-white border border-[#E5E6EB] hover:border-[#FF6A00] flex items-center justify-between shadow-2xs transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF6A00] border border-orange-200 flex items-center justify-center shrink-0">
                          <IconComp className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800">{cluster.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                              {cluster.type}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                            <span>{cluster.spec}</span>
                            <span>·</span>
                            <span className="text-slate-400">{cluster.usage}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${cluster.statusColor}`}>
                          {cluster.status}
                        </span>
                        <button
                          onClick={() => onShowToast(`已进入 ${cluster.name} 节点诊断与配置管理`)}
                          className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-[#FF6A00] text-xs border border-[#D9D9D9] hover:border-[#FF6A00] font-medium transition-colors"
                        >
                          节点管理
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
