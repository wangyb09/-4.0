export type PrimaryModule = 
  | 'home'
  | 'metadata'
  | 'ingestion'
  | 'governance'
  | 'development'
  | 'scheduling'
  | 'assets'
  | 'service'
  | 'system'
  | 'bigdata_platform'
  | 'ontology'
  | 'profile';

export interface SecondaryMenuItem {
  id: string;
  title: string;
  description?: string;
  tag?: string;
  icon?: string;
}

export interface Level1MenuItem {
  id: string;
  title: string;
  icon?: string;
  subMenus: SecondaryMenuItem[];
}

export interface ModuleNavInfo {
  key: PrimaryModule;
  title: string;
  subTitle: string;
  icon: string;
  badge?: string;
  level1Menus?: Level1MenuItem[];
  subMenus: SecondaryMenuItem[];
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
  subMenuId?: string;
  icon: string;
  category?: 'common' | 'develop' | 'governance' | 'ops' | 'asset';
  badge?: string;
  pinned?: boolean;
  actionKey?: string;
}

export interface PlatformMetrics {
  totalTables: number;
  tablesDelta: number;
  totalStoragePB: number;
  storageDeltaTB: number;
  scriptJobsCount?: number;
  scriptJobsSuccessRate?: number;
  scriptJobsDelta?: number;
  scriptJobsRunningCount?: number;
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

export interface DataOverviewStatItem {
  id: string;
  name: string;
  dimensionKey: 'datasource' | 'table' | 'field' | 'volume';
  icon: string;
  badge: string;
  // 累计值统计 (Cumulative)
  cumulativeValue: string;
  cumulativeUnit: string;
  cumulativeDesc: string;
  // 当日值统计 (Today)
  todayValue: string;
  todayUnit: string;
  todayDesc: string;
  todayTrend: string;
  todayTrendType: 'up' | 'down' | 'neutral';
  // 分布与明细标签
  breakdown: { label: string; value: string }[];
  highlightTag?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  realName: string;
  nickname: string;
  avatar: string;
  avatarType: 'preset' | 'custom_url' | 'upload';
  email: string;
  phone: string;
  department: string;
  role: string;
  roleLevel: string;
  bio: string;
  mfaEnabled: boolean;
  loginNotify: boolean;
  lastLoginTime: string;
  lastLoginIp: string;
  lastLoginLocation: string;
}

export interface LoginPageConfig {
  platformTitle: string;
  platformLogo?: string;
  welcomeHeadline: string;
  welcomeSubtitle: string;
  bgTheme?: 'screenshot_geometric' | 'tech_dark_blue' | 'gradient_mesh' | 'custom_image';
  customBgUrl: string;
  bgBlur: number;
  bgOpacity: number;
  showcaseStyle?: 'isometric_cards' | 'topology_chart' | 'custom_image';
  customShowcaseUrl?: string;
  cardTitle: string;
  enableCaptcha?: boolean;
  captchaType?: 'arithmetic' | 'alphanumeric';
  requirePrivacyCheck: boolean;
  privacyPolicyTitle?: string;
  privacyPolicyContent?: string;
  helpLinks: { label: string; url?: string }[];
  footerCopyright: string;
}

export type SystemConfig = LoginPageConfig;


