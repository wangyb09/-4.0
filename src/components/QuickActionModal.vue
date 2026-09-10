<template>
  <div
    v-if="actionKey"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
  >
    <div class="w-full max-w-3xl bg-white border border-[#E5E6EB] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
      <!-- Header -->
      <div class="p-4 border-b border-[#E5E6EB] flex items-center justify-between bg-[#FAFAFA]">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded bg-orange-50 border border-orange-200 text-[#FF6A00]">
            <Terminal v-if="actionKey === 'open_sql_ide'" class="w-4 h-4" />
            <FolderPlus v-else-if="actionKey === 'create_sync_job'" class="w-4 h-4" />
            <Database v-else-if="actionKey === 'search_lineage'" class="w-4 h-4 text-cyan-600" />
            <ShieldCheck v-else-if="actionKey === 'open_data_governance'" class="w-4 h-4 text-[#00B365]" />
            <Clock v-else-if="actionKey === 'open_task_scheduling'" class="w-4 h-4 text-[#FA8C16]" />
            <Share2 v-else-if="actionKey === 'open_api_sharing'" class="w-4 h-4 text-indigo-600" />
            <KeyRound v-else-if="actionKey === 'apply_table_perm'" class="w-4 h-4" />
            <CheckCircle2 v-else-if="actionKey === 'create_quality_rule'" class="w-4 h-4" />
            <RotateCw v-else class="w-4 h-4" />
          </div>
          <div>
            <h2 class="text-sm font-bold text-slate-800">
              <template v-if="actionKey === 'open_sql_ide'">SQL 开发工作台 · 交互调试 (DataStudio)</template>
              <template v-else-if="actionKey === 'create_sync_job'">新建数据集成管道 (DataWorks DataX)</template>
              <template v-else-if="actionKey === 'search_lineage'">统一元数据入湖 · 湖仓多源注册 (Metadata Lake)</template>
              <template v-else-if="actionKey === 'open_data_governance'">数据治理工作台 · 质量与标准</template>
              <template v-else-if="actionKey === 'open_task_scheduling'">任务调度编排与运行监控 (DAG Scheduler)</template>
              <template v-else-if="actionKey === 'open_api_sharing'">接口共享服务平台 · 数据服务API发布</template>
              <template v-else-if="actionKey === 'apply_table_perm'">快速申请数据表访问权限 (RAM Security)</template>
              <template v-else-if="actionKey === 'create_quality_rule'">新建数据质量稽核规则 (DQC)</template>
              <template v-else-if="actionKey === 'view_dag_ops'">调度任务运维实时大盘 (Operation Center)</template>
              <template v-else-if="actionKey === 'launch_backfill'">历史数据批量补数向导</template>
              <template v-else-if="actionKey === 'open_standards'">数仓标准与指标字典规范</template>
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              环境: <span class="text-[#FF6A00] font-mono">cn-hangzhou-prod (计算引擎 MaxCompute / Hologres)</span>
            </p>
          </div>
        </div>

        <button
          @click="$emit('close')"
          class="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Dynamic Action Content -->
      <div class="p-5 overflow-y-auto flex-1 space-y-4 text-xs text-slate-600">
        <!-- Case 1: SQL IDE -->
        <div v-if="actionKey === 'open_sql_ide'" class="space-y-3.5">
          <div class="flex items-center justify-between">
            <span class="text-slate-500 font-mono">计算引擎: MaxCompute / Hologres MPP (P99: 45ms)</span>
            <button
              @click="handleRunSql"
              :disabled="queryRunning"
              class="px-3 py-1.5 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] text-white font-medium flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Play :class="['w-3.5 h-3.5', queryRunning ? 'animate-spin' : 'fill-white']" />
              <span>{{ queryRunning ? '正在并行查询...' : '运行查询 (F8)' }}</span>
            </button>
          </div>

          <!-- Editor textarea -->
          <div class="rounded-lg border border-slate-700 overflow-hidden bg-[#1F2329] p-3">
            <textarea
              v-model="sqlCode"
              rows="8"
              class="w-full bg-transparent font-mono text-xs text-emerald-400 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <!-- Result table -->
          <div v-if="queryResult" class="space-y-2">
            <div class="text-xs font-semibold text-slate-800">查询结果集预览 (4 rows)</div>
            <div class="overflow-x-auto border border-[#E5E6EB] rounded-lg">
              <table class="w-full text-left font-mono text-[11px]">
                <thead class="bg-[#FAFAFA] text-slate-700 border-b border-[#E5E6EB]">
                  <tr>
                    <th class="p-2.5">stat_date</th>
                    <th class="p-2.5">channel_code</th>
                    <th class="p-2.5">active_users</th>
                    <th class="p-2.5">total_gmv</th>
                    <th class="p-2.5">arpu</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 bg-white">
                  <tr v-for="(row, idx) in queryResult" :key="idx" class="hover:bg-slate-50">
                    <td class="p-2.5 text-[#1677FF]">{{ row.stat_date }}</td>
                    <td class="p-2.5 text-slate-700">{{ row.channel_code }}</td>
                    <td class="p-2.5 text-slate-700">{{ row.active_users }}</td>
                    <td class="p-2.5 text-[#00B365] font-semibold">{{ row.total_gmv }}</td>
                    <td class="p-2.5 text-[#FF6A00]">{{ row.arpu }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Case 2: Create Sync Job -->
        <div v-else-if="actionKey === 'create_sync_job'" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-slate-600 mb-1.5 font-medium">源端数据源 (Source)</label>
              <select
                v-model="sourceType"
                class="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 focus:outline-none focus:border-[#FF6A00]"
              >
                <option>MySQL (阿里云 PolarDB / RDS)</option>
                <option>PostgreSQL (CRM 用户系统)</option>
                <option>Kafka (客户端事件埋点流)</option>
                <option>Oracle (财务结算核心)</option>
              </select>
            </div>
            <div>
              <label class="block text-slate-600 mb-1.5 font-medium">目标数据源 (Sink)</label>
              <select
                v-model="targetType"
                class="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 focus:outline-none focus:border-[#FF6A00]"
              >
                <option>Hologres (实时交互OLAP)</option>
                <option>MaxCompute (离线ODS归档)</option>
                <option>StarRocks (实时数仓DWD)</option>
                <option>ClickHouse (用户行为宽表)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-slate-600 mb-1.5 font-medium">同步模式</label>
            <div class="flex gap-2">
              <button
                v-for="mode in ['实时CDC增量捕获', '离线按天批量同步', '小时级滑动窗口增量']"
                :key="mode"
                @click="syncMode = mode"
                :class="[
                  'px-3 py-1.5 rounded text-xs font-medium border transition-colors cursor-pointer',
                  syncMode === mode
                    ? 'bg-orange-50 text-[#FF6A00] border-[#FF6A00] font-semibold'
                    : 'bg-white text-slate-600 border-[#D9D9D9] hover:bg-slate-50'
                ]"
              >
                {{ mode }}
              </button>
            </div>
          </div>

          <div class="p-3 rounded bg-orange-50/50 border border-orange-200 text-[11px] text-[#FF6A00]">
            ⚡ 系统将自动开启 Schema 漂移探测与毫秒级增量捕获，吞吐预计 45,000 QPS。
          </div>
        </div>

        <!-- Case: Unified Metadata Lake Ingestion -->
        <div v-else-if="actionKey === 'search_lineage'" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-slate-600 mb-1.5 font-medium">目标湖仓元数据目录 (Lake Catalog)</label>
              <select
                v-model="lakeCatalog"
                class="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 focus:outline-none focus:border-[#FF6A00]"
              >
                <option>Apache Iceberg Lakehouse (prod_iceberg_catalog)</option>
                <option>Apache Paimon 实时湖仓 (paimon_realtime_catalog)</option>
                <option>Hive Metastore (hive_emr_central_db)</option>
                <option>MaxCompute DataWorks 元数据总线</option>
              </select>
            </div>
            <div>
              <label class="block text-slate-600 mb-1.5 font-medium">源端多源纳管范围</label>
              <select
                v-model="metaSourceCluster"
                class="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 focus:outline-none focus:border-[#FF6A00]"
              >
                <option>全源多通道 (MySQL + PolarDB + Kafka + ClickHouse)</option>
                <option>OLTP 关系库集群 (PolarDB/MySQL 12个实例)</option>
                <option>实时消息流通道 (Kafka / Flink Catalog)</option>
                <option>数仓与分析引擎 (ClickHouse / Hologres / StarRocks)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-slate-600 mb-1.5 font-medium">元数据入湖同步策略</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="strat in ['CDC实时捕获 + 小时级增量巡检', '每日全量快照对账 (T+1)', '实时DDL变更事件驱动']"
                :key="strat"
                @click="metaSyncStrategy = strat"
                :class="[
                  'px-3 py-1.5 rounded text-xs font-medium border transition-colors cursor-pointer',
                  metaSyncStrategy === strat
                    ? 'bg-cyan-50 text-cyan-700 border-cyan-500 font-semibold'
                    : 'bg-white text-slate-600 border-[#D9D9D9] hover:bg-slate-50'
                ]"
              >
                {{ strat }}
              </button>
            </div>
          </div>

          <div class="grid grid-cols-4 gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <div>
              <div class="text-[10px] text-slate-400">已纳管数据源</div>
              <div class="text-sm font-bold text-slate-800 font-mono mt-0.5">16 个集群</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-400">湖仓注册表</div>
              <div class="text-sm font-bold text-cyan-600 font-mono mt-0.5">1,420 张</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-400">字段解析数</div>
              <div class="text-sm font-bold text-slate-800 font-mono mt-0.5">38,650 个</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-400">采集健康度</div>
              <div class="text-sm font-bold text-[#00B365] font-mono mt-0.5">99.8%</div>
            </div>
          </div>

          <div class="p-3 rounded bg-cyan-50/60 border border-cyan-200 text-[11px] text-cyan-800">
            🌊 统一元数据入湖引擎已开启自动 DDL 解析、字段注释推导、表物理统计采集与湖仓一体目录注册。
          </div>
        </div>

        <!-- Case 3: Apply Permission -->
        <div v-else-if="actionKey === 'apply_table_perm'" class="space-y-4">
          <div>
            <label class="block text-slate-600 mb-1.5 font-medium">申请目标数据表</label>
            <input
              type="text"
              v-model="targetTable"
              class="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 font-mono focus:outline-none focus:border-[#FF6A00]"
            />
          </div>

          <div>
            <label class="block text-slate-600 mb-1.5 font-medium">权限类型</label>
            <div class="grid grid-cols-2 gap-2.5">
              <button
                v-for="p in ['SELECT 查询权限 (脱敏)', 'SELECT 明文导出权限', 'INSERT 写入权限', 'ALTER DDL 变更权限']"
                :key="p"
                @click="permType = p"
                :class="[
                  'p-2 rounded text-xs font-medium border text-left transition-colors cursor-pointer',
                  permType === p
                    ? 'bg-orange-50 text-[#FF6A00] border-[#FF6A00] font-semibold'
                    : 'bg-white text-slate-600 border-[#D9D9D9] hover:bg-slate-50'
                ]"
              >
                {{ p }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-slate-600 mb-1.5 font-medium">申请理由与业务背景</label>
            <textarea
              v-model="permReason"
              placeholder="例如：用于Q3经营分析报表模型搭建，申请 30 天临时访问..."
              rows="3"
              class="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6A00]"
            />
          </div>
        </div>

        <!-- Case 4: Quality Rule -->
        <div v-else-if="actionKey === 'create_quality_rule'" class="space-y-4">
          <div>
            <label class="block text-slate-600 mb-1.5 font-medium">规则类型</label>
            <select
              v-model="ruleType"
              class="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 focus:outline-none focus:border-[#FF6A00]"
            >
              <option>主键唯一性校验 (PK_UNIQUE)</option>
              <option>字段非空率校验 (NOT_NULL &gt; 99%)</option>
              <option>数值波动率告警 (Volume Drift &lt; 30%)</option>
              <option>枚举值合法性范围 (Enum In List)</option>
            </select>
          </div>

          <div>
            <label class="block text-slate-600 mb-1.5 font-medium">绑定数据表</label>
            <input
              type="text"
              v-model="ruleTable"
              class="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 font-mono focus:outline-none focus:border-[#FF6A00]"
            />
          </div>
        </div>

        <!-- Case 5: Backfill -->
        <div v-else-if="actionKey === 'launch_backfill'" class="space-y-4">
          <div>
            <label class="block text-slate-600 mb-1.5 font-medium">补数时间周期</label>
            <input
              type="text"
              v-model="backfillDateRange"
              class="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 font-mono focus:outline-none focus:border-[#FF6A00]"
            />
          </div>

          <div class="p-3 rounded bg-orange-50/50 border border-orange-200 text-[11px] text-[#FF6A00]">
            ⏳ 补数引擎将自动解析下游 18 个依赖节点的拓扑关系并按顺序并发触发。
          </div>
        </div>

        <!-- Case 6: Data Governance -->
        <div v-else-if="actionKey === 'open_data_governance'" class="space-y-4">
          <div>
            <label class="block text-slate-600 mb-1.5 font-medium">治理模块</label>
            <select
              v-model="govTargetModule"
              class="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 focus:outline-none focus:border-[#FF6A00]"
            >
              <option>质量规则监控与智能巡检 (1,280条规则运行中)</option>
              <option>数据安全分类与动态脱敏审计 (L1~L4级数据分类)</option>
              <option>数仓建模规范与命名合规度检测 (ODS/DWD/DWS/ADS)</option>
              <option>存储生命周期与僵尸表下线分析 (节省约 14.8% 资源)</option>
            </select>
          </div>

          <div class="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded border border-slate-200 text-center">
            <div>
              <div class="text-[10px] text-slate-400">综合质量得分</div>
              <div class="text-base font-bold text-[#00B365] font-mono mt-0.5">98.4%</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-400">活跃监控规则</div>
              <div class="text-base font-bold text-slate-700 font-mono mt-0.5">1,280 条</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-400">规范覆盖率</div>
              <div class="text-base font-bold text-[#FF6A00] font-mono mt-0.5">99.1%</div>
            </div>
          </div>

          <div class="p-3 rounded bg-emerald-50/50 border border-emerald-200 text-[11px] text-emerald-800">
            🛡️ 平台已启用自动化质量保障引擎，每日自动对全域核心生产表进行全量对账与离群值探查。
          </div>
        </div>

        <!-- Case 7: Task Scheduling -->
        <div v-else-if="actionKey === 'open_task_scheduling'" class="space-y-4">
          <div>
            <label class="block text-slate-600 mb-1.5 font-medium">调度任务实例名称</label>
            <input
              type="text"
              v-model="scheduleTaskName"
              class="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 font-mono focus:outline-none focus:border-[#FF6A00]"
            />
          </div>

          <div>
            <label class="block text-slate-600 mb-1.5 font-medium">CRON 调度周期表达式</label>
            <input
              type="text"
              v-model="scheduleCron"
              class="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 font-mono focus:outline-none focus:border-[#FF6A00]"
            />
          </div>

          <div class="p-3 rounded bg-amber-50/50 border border-amber-200 text-[11px] text-amber-800">
            ⚡ DAG 引擎支持自愈式失败重试、SLA 产出基线预警及跨租户多引擎计算资源隔离。
          </div>
        </div>

        <!-- Case 8: API Sharing -->
        <div v-else-if="actionKey === 'open_api_sharing'" class="space-y-4">
          <div>
            <label class="block text-slate-600 mb-1.5 font-medium">API 服务标识</label>
            <input
              type="text"
              v-model="apiName"
              class="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 font-mono focus:outline-none focus:border-[#FF6A00]"
            />
          </div>

          <div>
            <label class="block text-slate-600 mb-1.5 font-medium">服务路由 Path</label>
            <input
              type="text"
              v-model="apiPath"
              class="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 font-mono focus:outline-none focus:border-[#FF6A00]"
            />
          </div>

          <div>
            <label class="block text-slate-600 mb-1.5 font-medium">流控与限流阈值</label>
            <input
              type="text"
              v-model="apiRateLimit"
              class="w-full bg-white border border-[#D9D9D9] rounded p-2 text-slate-800 font-mono focus:outline-none focus:border-[#FF6A00]"
            />
          </div>

          <div class="p-3 rounded bg-indigo-50/50 border border-indigo-200 text-[11px] text-indigo-800">
            🚀 数据接口已直连低延迟 Hologres MPP 计算加速层，提供毫秒级响应并自带鉴权白名单防护。
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-3.5 bg-[#FAFAFA] border-t border-[#E5E6EB] flex items-center justify-between">
        <button
          @click="$emit('close')"
          class="px-3.5 py-1.5 rounded bg-white hover:bg-slate-50 text-slate-700 border border-[#D9D9D9] text-xs font-medium cursor-pointer"
        >
          取消
        </button>

        <button
          @click="handleSubmit"
          class="px-4 py-1.5 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Check class="w-3.5 h-3.5" />
          <span>确认并提交生效</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  X,
  Terminal,
  FolderPlus,
  KeyRound,
  CheckCircle2,
  RotateCw,
  Play,
  Check,
  Database,
  ShieldCheck,
  Clock,
  Share2,
} from 'lucide-vue-next';

interface QuickActionModalProps {
  actionKey: string | null;
}

const props = defineProps<QuickActionModalProps>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'successToast', msg: string): void;
}>();

const sqlCode = ref(`-- MaxCompute / Hologres 交互式数据开发 Studio
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

const queryRunning = ref(false);
const queryResult = ref<any[] | null>(null);

const sourceType = ref('MySQL (阿里云 PolarDB / RDS)');
const targetType = ref('Hologres (实时交互OLAP)');
const syncMode = ref('实时CDC增量捕获');

const targetTable = ref('prod_dws_db.dws_trade_user_daily_dt');
const permType = ref('SELECT 查询权限 (脱敏)');
const permReason = ref('');

const ruleType = ref('主键唯一性校验 (PK_UNIQUE)');
const ruleTable = ref('dws_trade_user_daily_dt');

const backfillDateRange = ref('2026-08-15 ~ 2026-08-24');

const govTargetModule = ref('质量规则监控与智能巡检');

const scheduleTaskName = ref('dag_dws_trade_user_daily_summary');
const scheduleCron = ref('0 0 2 * * ? (每日凌晨02:00)');

const apiName = ref('queryUserTradeDailyStats');
const apiPath = ref('/api/v1/service/trade/user-daily');
const apiRateLimit = ref('10,000 QPS / IP');

const lakeCatalog = ref('Apache Iceberg Lakehouse (prod_iceberg_catalog)');
const metaSourceCluster = ref('全源多通道 (MySQL + PolarDB + Kafka + ClickHouse)');
const metaSyncStrategy = ref('CDC实时捕获 + 小时级增量巡检');

const handleRunSql = () => {
  queryRunning.value = true;
  setTimeout(() => {
    queryRunning.value = false;
    queryResult.value = [
      { stat_date: '2026-08-25', channel_code: 'APP_IOS', active_users: '142,500', total_gmv: '¥ 8,420,190', arpu: '¥ 59.08' },
      { stat_date: '2026-08-25', channel_code: 'APP_ANDROID', active_users: '198,200', total_gmv: '¥ 9,830,450', arpu: '¥ 49.59' },
      { stat_date: '2026-08-25', channel_code: 'WECHAT_MINI', active_users: '86,400', total_gmv: '¥ 3,210,000', arpu: '¥ 37.15' },
      { stat_date: '2026-08-24', channel_code: 'APP_IOS', active_users: '139,800', total_gmv: '¥ 8,190,000', arpu: '¥ 58.58' },
    ];
    emit('successToast', 'SQL 执行成功！计算引擎 MaxCompute 耗时 320ms，共返回 4 条聚合统计记录');
  }, 800);
};

const handleSubmit = () => {
  let title = '快捷操作生效';
  if (props.actionKey === 'open_sql_ide') title = 'SQL 工作台调试';
  else if (props.actionKey === 'create_sync_job') title = '新建数据集成管道';
  else if (props.actionKey === 'search_lineage') title = '统一元数据入湖';
  else if (props.actionKey === 'open_data_governance') title = '数据治理策略';
  else if (props.actionKey === 'open_task_scheduling') title = '任务调度编排';
  else if (props.actionKey === 'open_api_sharing') title = '接口共享发布';
  else if (props.actionKey === 'apply_table_perm') title = '申请数据表权限';
  else if (props.actionKey === 'create_quality_rule') title = '新建数据质量规则';

  emit('successToast', `操作成功：已完成【${title}】的提交并生效！`);
  emit('close');
};
</script>
