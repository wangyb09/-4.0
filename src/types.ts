export type PrimaryModule = 
  | 'home'
  | 'metadata'
  | 'ingestion'
  | 'governance'
  | 'development'
  | 'scheduling'
  | 'system';

export interface ModuleNavInfo {
  key: PrimaryModule;
  title: string;
  subTitle: string;
  icon: string;
  badge?: string;
  subMenus: {
    id: string;
    title: string;
    description: string;
    tag?: string;
  }[];
}

export type AlertSeverity = 'P0' | 'P1' | 'P2' | 'P3';
export type AlertStatus = 'pending' | 'processing' | 'resolved' | 'ignored';

export interface AlertItem {
  id: string;
  title: string;
  severity: AlertSeverity;
  status: AlertStatus;
  type: 'task_failed' | 'sla_delay' | 'quality_anomaly' | 'cluster_high_load' | 'schema_drift';
  sourceName: string;
  sourceType: '调度任务' | '数据质量规则' | '实时CDC流' | '集群计算' | '元数据监控';
  occurredTime: string;
  duration: string;
  owner: string;
  details: string;
  impactScope: string;
}

export type TodoType = 'permission_apply' | 'model_publish' | 'sla_appeal' | 'quality_issue' | 'backfill_confirm';
export type TodoStatus = 'pending' | 'approved' | 'rejected';

export interface TodoItem {
  id: string;
  title: string;
  type: TodoType;
  applicant: string;
  applicantAvatar: string;
  department: string;
  createTime: string;
  urgency: '高' | '中' | '低';
  status: TodoStatus;
  targetObject: string;
  targetCategory: string;
  reason: string;
  expiredAt?: string;
}

export type AssetCategory = 'table' | 'sql_script' | 'dag_task' | 'stream_job' | 'quality_rule' | 'report_model';

export interface RecentVisitItem {
  id: string;
  name: string;
  code: string;
  category: AssetCategory;
  database?: string;
  layer?: 'ODS' | 'DWD' | 'DWS' | 'ADS' | 'DIM' | 'STREAM';
  lastVisitedTime: string;
  isStarred: boolean;
  owner: string;
  description: string;
}

export interface ShortcutItem {
  id: string;
  title: string;
  description: string;
  module: PrimaryModule;
  icon: string;
  category: 'common' | 'develop' | 'governance' | 'ops' | 'asset';
  badge?: string;
  pinned: boolean;
  actionKey: string;
}

export interface PlatformMetrics {
  totalTables: number;
  tablesDelta: number;
  totalStoragePB: number;
  storageDeltaTB: number;
  totalApiCalls: number;
  apiCallsDeltaPercent: number;
  dailyApiCallsWan?: number;
  activeApiServices?: number;
  apiSuccessRate?: number;
  scheduledTasksCount: number;
  taskSuccessRate: number;
  taskFailedCount: number;
  taskRunningCount: number;
  taskWaitingCount: number;
  dataQualityScore: number;
  qualityPassedRulesRate: number;
  p0AlertsCount: number;
  p1AlertsCount: number;
  pendingTodosCount: number;
}

export interface HourlyTaskStats {
  hour: string;
  success: number;
  running: number;
  failed: number;
  delayed: number;
}

export interface QualityDimensionScore {
  dimension: string;
  score: number;
  fullMark: number;
  ruleCount: number;
  abnormalCount: number;
}
