<template>
  <div class="space-y-4">
    <!-- Header banner -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-100">
      <div>
        <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Palette class="w-4 h-4 text-[#FF6A00]" />
          登录页自定义配置
        </h3>
        <p class="text-xs text-slate-400 mt-0.5">
          支持自定义登录页面背景风格、背景图片上传、欢迎标语、品牌标识与安全验证码策略
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="resetToDefault"
          class="px-3 py-1.5 rounded border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors cursor-pointer"
        >
          恢复系统默认
        </button>
        <button
          @click="$emit('previewLoginPage')"
          class="px-3 py-1.5 rounded border border-[#2F68FF] text-[#2F68FF] hover:bg-blue-50 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          title="以全屏实际体验当前配置的登录页"
        >
          <ExternalLink class="w-3.5 h-3.5" />
          <span>全屏预览登录页</span>
        </button>
        <button
          @click="saveConfig"
          class="px-4 py-1.5 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Save class="w-3.5 h-3.5" />
          <span>保存配置</span>
        </button>
      </div>
    </div>

    <!-- 2-Column Layout: Left Controls, Right Real-time Mini Preview -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-5">
      <!-- Left Controls (7 cols) -->
      <div class="xl:col-span-7 space-y-5">
        <!-- 1. Background Style Selection -->
        <div class="bg-[#FAFAFA] border border-[#E5E6EB] rounded-xl p-4 space-y-3">
          <label class="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Image class="w-3.5 h-3.5 text-[#FF6A00]" />
            1. 登录页背景风格与背景图片
          </label>

          <!-- 4 Preset Options Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <!-- Option 1: Screenshot Geometric 3D -->
            <button
              type="button"
              @click="localConfig.bgTheme = 'screenshot_geometric'"
              :class="[
                'p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between h-22 relative overflow-hidden',
                localConfig.bgTheme === 'screenshot_geometric'
                  ? 'border-[#FF6A00] ring-2 ring-orange-200 bg-white shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              ]"
            >
              <div class="h-8 w-full rounded bg-gradient-to-br from-[#EEF2FC] to-[#F1F4FA] border border-blue-100 flex items-center justify-center">
                <span class="text-[10px] text-blue-600 font-bold">立体几何 3D</span>
              </div>
              <div class="text-[11px] font-bold text-slate-800 truncate">经典立体几何</div>
              <span class="text-[10px] text-slate-400">推荐原稿设计</span>
            </button>

            <!-- Option 2: Tech Dark Blue -->
            <button
              type="button"
              @click="localConfig.bgTheme = 'tech_dark_blue'"
              :class="[
                'p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between h-22 relative overflow-hidden',
                localConfig.bgTheme === 'tech_dark_blue'
                  ? 'border-[#FF6A00] ring-2 ring-orange-200 bg-white shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              ]"
            >
              <div class="h-8 w-full rounded bg-[#0B132B] flex items-center justify-center">
                <span class="text-[10px] text-blue-300 font-bold">科技暗蓝</span>
              </div>
              <div class="text-[11px] font-bold text-slate-800 truncate">深邃科技蓝</div>
              <span class="text-[10px] text-slate-400">极客暗黑风</span>
            </button>

            <!-- Option 3: Gradient Mesh -->
            <button
              type="button"
              @click="localConfig.bgTheme = 'gradient_mesh'"
              :class="[
                'p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between h-22 relative overflow-hidden',
                localConfig.bgTheme === 'gradient_mesh'
                  ? 'border-[#FF6A00] ring-2 ring-orange-200 bg-white shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              ]"
            >
              <div class="h-8 w-full rounded bg-gradient-to-tr from-rose-200 via-sky-200 to-indigo-200 flex items-center justify-center">
                <span class="text-[10px] text-indigo-700 font-bold">柔光渐变</span>
              </div>
              <div class="text-[11px] font-bold text-slate-800 truncate">晨曦渐变流光</div>
              <span class="text-[10px] text-slate-400">轻柔现代感</span>
            </button>

            <!-- Option 4: Custom Image -->
            <button
              type="button"
              @click="localConfig.bgTheme = 'custom_image'"
              :class="[
                'p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between h-22 relative overflow-hidden',
                localConfig.bgTheme === 'custom_image'
                  ? 'border-[#FF6A00] ring-2 ring-orange-200 bg-white shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              ]"
            >
              <div class="h-8 w-full rounded bg-slate-100 flex items-center justify-center border border-dashed border-slate-300">
                <Upload class="w-3.5 h-3.5 text-slate-600" />
              </div>
              <div class="text-[11px] font-bold text-slate-800 truncate">自定义背景图</div>
              <span class="text-[10px] text-slate-400">支持上传或链接</span>
            </button>
          </div>

          <!-- Custom Image URL or Upload (Visible when custom_image selected) -->
          <div v-if="localConfig.bgTheme === 'custom_image'" class="space-y-3 pt-2 border-t border-slate-200">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">自定义背景图片 URL 地址</label>
              <div class="flex gap-2">
                <input
                  v-model="localConfig.customBgUrl"
                  type="url"
                  placeholder="https://images.unsplash.com/photo-xxx 或企业背景图链接"
                  class="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#FF6A00] bg-white font-mono"
                />
                <button
                  type="button"
                  @click="useSampleBgImage"
                  class="px-2.5 py-1.5 text-xs rounded border border-slate-200 hover:bg-white text-slate-600 cursor-pointer"
                >
                  填入推荐图
                </button>
              </div>
            </div>

            <!-- Local file picker for background -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">或本地上传背景图</label>
              <label class="flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-slate-300 bg-white hover:bg-slate-50 cursor-pointer text-xs text-slate-600 transition-colors">
                <Upload class="w-3.5 h-3.5 text-slate-500" />
                <span>选择本地电脑图片 (支持 PNG/JPG/WebP, 建议分辨率 1920×1080)</span>
                <input type="file" accept="image/*" class="hidden" @change="handleBgFileUpload" />
              </label>
            </div>

            <!-- Sliders for Blur & Opacity -->
            <div class="grid grid-cols-2 gap-4 pt-1">
              <div>
                <div class="flex justify-between text-xs text-slate-600 mb-1">
                  <span>背景模糊度</span>
                  <span class="font-mono font-bold">{{ localConfig.bgBlur }}px</span>
                </div>
                <input
                  v-model.number="localConfig.bgBlur"
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  class="w-full accent-[#FF6A00] cursor-pointer"
                />
              </div>
              <div>
                <div class="flex justify-between text-xs text-slate-600 mb-1">
                  <span>背景不透明度</span>
                  <span class="font-mono font-bold">{{ localConfig.bgOpacity }}%</span>
                </div>
                <input
                  v-model.number="localConfig.bgOpacity"
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  class="w-full accent-[#FF6A00] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Branding & Copywriting Customization -->
        <div class="bg-[#FAFAFA] border border-[#E5E6EB] rounded-xl p-4 space-y-3">
          <label class="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Type class="w-3.5 h-3.5 text-[#FF6A00]" />
            2. 欢迎标语与平台品牌文案
          </label>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-600 mb-1">平台系统名称</label>
              <input
                v-model="localConfig.platformTitle"
                type="text"
                placeholder="数据中台"
                class="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#FF6A00] bg-white font-medium"
              />
            </div>

            <div>
              <label class="block text-xs text-slate-600 mb-1">登录卡片标题</label>
              <input
                v-model="localConfig.cardTitle"
                type="text"
                placeholder="欢迎登录"
                class="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#FF6A00] bg-white font-medium"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-xs text-slate-600 mb-1">
                欢迎主标语 (展示在左侧大字标题)
              </label>
              <input
                v-model="localConfig.welcomeHeadline"
                type="text"
                placeholder="欢迎进入数据中台"
                class="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#FF6A00] bg-white font-bold"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-xs text-slate-600 mb-1">
                副标题 / 宣传语描述
              </label>
              <input
                v-model="localConfig.welcomeSubtitle"
                type="text"
                placeholder="全域数据资产统一纳管，赋能业务高效洞察与敏捷开发"
                class="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#FF6A00] bg-white"
              />
            </div>
          </div>
        </div>

        <!-- 3. Security & Captcha Policy -->
        <div class="bg-[#FAFAFA] border border-[#E5E6EB] rounded-xl p-4 space-y-3">
          <label class="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <ShieldCheck class="w-3.5 h-3.5 text-[#FF6A00]" />
            3. 登录安全与验证码策略
          </label>

          <div class="space-y-2">
            <!-- Captcha Toggle -->
            <div class="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
              <div>
                <span class="text-xs font-bold text-slate-800">强制输入计算验证码</span>
                <p class="text-[11px] text-slate-400">开启后防止恶意机器人扫描与撞库爆破</p>
              </div>
              <button
                type="button"
                @click="localConfig.enableCaptcha = !localConfig.enableCaptcha"
                :class="[
                  'w-10 h-5 rounded-full transition-colors relative cursor-pointer',
                  localConfig.enableCaptcha ? 'bg-[#00B365]' : 'bg-slate-200'
                ]"
              >
                <div
                  :class="[
                    'w-4 h-4 rounded-full bg-white transition-all transform absolute top-0.5',
                    localConfig.enableCaptcha ? 'left-5.5' : 'left-0.5'
                  ]"
                />
              </button>
            </div>

            <!-- Captcha Type Selection -->
            <div v-if="localConfig.enableCaptcha" class="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
              <div>
                <span class="text-xs font-bold text-slate-800">验证码算法形式</span>
                <p class="text-[11px] text-slate-400">推荐使用趣味算术算式（如设计稿 0*0=?）</p>
              </div>
              <select
                v-model="localConfig.captchaType"
                class="px-2 py-1 text-xs border border-slate-200 rounded bg-white text-slate-700 cursor-pointer"
              >
                <option value="arithmetic">数学算术 (如 0*0=?, 7+8=?)</option>
                <option value="alphanumeric">4位字母数字防刷码</option>
              </select>
            </div>

            <!-- Privacy Policy Checkbox Toggle -->
            <div class="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
              <div>
                <span class="text-xs font-bold text-slate-800">强制勾选《隐私政策》协议</span>
                <p class="text-[11px] text-slate-400">登录前必须阅读并勾选隐私保护条款</p>
              </div>
              <button
                type="button"
                @click="localConfig.requirePrivacyCheck = !localConfig.requirePrivacyCheck"
                :class="[
                  'w-10 h-5 rounded-full transition-colors relative cursor-pointer',
                  localConfig.requirePrivacyCheck ? 'bg-[#00B365]' : 'bg-slate-200'
                ]"
              >
                <div
                  :class="[
                    'w-4 h-4 rounded-full bg-white transition-all transform absolute top-0.5',
                    localConfig.requirePrivacyCheck ? 'left-5.5' : 'left-0.5'
                  ]"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Real-Time Mini Preview Window (5 cols) -->
      <div class="xl:col-span-5 space-y-3">
        <div class="flex items-center justify-between">
          <label class="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Eye class="w-3.5 h-3.5 text-[#FF6A00]" />
            实时效果微缩预览 (Live Preview)
          </label>
          <span class="text-[11px] text-slate-400">所见即所得</span>
        </div>

        <!-- Miniature Scaled Login Page Frame -->
        <div class="border-2 border-slate-300 rounded-2xl p-2 bg-slate-100 shadow-md">
          <!-- Mini Browser Chrome -->
          <div class="flex items-center gap-1.5 pb-2 px-2 border-b border-slate-200">
            <div class="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div class="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div class="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <div class="ml-2 flex-1 bg-white rounded text-[10px] px-2 py-0.5 text-slate-400 truncate font-mono text-center">
              https://datacraft.internal/login
            </div>
          </div>

          <!-- Mini Canvas -->
          <div class="relative w-full aspect-[16/10] rounded-xl overflow-hidden mt-1.5 shadow-inner select-none flex flex-col justify-between p-3">
            <!-- Mini Background -->
            <div
              v-if="localConfig.bgTheme === 'screenshot_geometric'"
              class="absolute inset-0 bg-gradient-to-br from-[#EEF2FC] via-[#F8FAFF] to-[#F1F4FA]"
            >
              <div class="absolute inset-0 opacity-40">
                <div class="w-32 h-32 rounded-full bg-blue-300/30 blur-xl absolute -top-4 -left-4" />
                <div class="w-40 h-40 rounded-full bg-indigo-300/20 blur-xl absolute -bottom-8 -right-8" />
              </div>
            </div>

            <div
              v-else-if="localConfig.bgTheme === 'tech_dark_blue'"
              class="absolute inset-0 bg-[#0B132B]"
            />

            <div
              v-else-if="localConfig.bgTheme === 'gradient_mesh'"
              class="absolute inset-0 bg-gradient-to-tr from-rose-100 via-sky-100 to-indigo-100"
            />

            <div
              v-else-if="localConfig.bgTheme === 'custom_image' && localConfig.customBgUrl"
              class="absolute inset-0 bg-cover bg-center"
              :style="{
                backgroundImage: `url(${localConfig.customBgUrl})`,
                filter: `blur(${localConfig.bgBlur / 4}px)`,
                opacity: localConfig.bgOpacity / 100
              }"
            />

            <div v-else class="absolute inset-0 bg-[#EEF2FC]" />

            <!-- Mini Header -->
            <div class="relative z-10 flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <div class="w-4 h-4 rounded bg-blue-600 flex items-center justify-center text-white text-[8px] font-bold">
                  D
                </div>
                <span :class="['text-[11px] font-bold', localConfig.bgTheme === 'tech_dark_blue' ? 'text-white' : 'text-slate-800']">
                  {{ localConfig.platformTitle || '数据中台' }}
                </span>
              </div>
              <div class="flex items-center gap-2 text-[8px] text-slate-400">
                <span>帮助</span>
                <span>反馈</span>
                <span>修复公示</span>
              </div>
            </div>

            <!-- Mini Center Columns -->
            <div class="relative z-10 grid grid-cols-12 gap-2 items-center flex-1 my-1">
              <!-- Left Mini Headline -->
              <div class="col-span-7 space-y-1">
                <div
                  :class="[
                    'text-xs font-bold leading-tight line-clamp-2',
                    localConfig.bgTheme === 'tech_dark_blue' ? 'text-white' : 'text-slate-900'
                  ]"
                >
                  {{ localConfig.welcomeHeadline || '欢迎进入数据中台' }}
                </div>
                <div
                  :class="[
                    'text-[8px] line-clamp-1',
                    localConfig.bgTheme === 'tech_dark_blue' ? 'text-slate-400' : 'text-slate-500'
                  ]"
                >
                  {{ localConfig.welcomeSubtitle }}
                </div>

                <!-- Mini 3D mock card -->
                <div class="w-full h-14 bg-white/90 rounded border border-blue-200 shadow-xs p-1.5 transform rotate-[1deg] flex flex-col justify-between">
                  <div class="flex items-center justify-between text-[7px] text-slate-400 pb-0.5 border-b border-slate-100">
                    <span>生产作业全域监控</span>
                    <span class="text-emerald-500 font-bold">99.9%</span>
                  </div>
                  <div class="grid grid-cols-3 gap-1">
                    <div class="h-4 bg-blue-50 rounded" />
                    <div class="h-4 bg-cyan-50 rounded" />
                    <div class="h-4 bg-indigo-50 rounded" />
                  </div>
                </div>
              </div>

              <!-- Right Mini Login Card -->
              <div class="col-span-5 flex justify-end">
                <div class="w-full bg-white rounded-lg shadow-md border border-slate-200 p-2 space-y-1 text-left">
                  <div class="text-[9px] font-bold text-slate-800">{{ localConfig.cardTitle || '欢迎登录' }}</div>
                  <!-- Mini inputs -->
                  <div class="h-3.5 rounded bg-slate-50 border border-slate-200 text-[7px] text-slate-400 px-1 flex items-center">
                    admin
                  </div>
                  <div class="h-3.5 rounded bg-slate-50 border border-slate-200 text-[7px] text-slate-400 px-1 flex items-center">
                    ••••••••
                  </div>
                  <div v-if="localConfig.enableCaptcha" class="flex gap-1">
                    <div class="flex-1 h-3.5 rounded bg-slate-50 border border-slate-200 text-[7px] text-slate-400 px-1 flex items-center">
                      验证码
                    </div>
                    <div class="w-8 h-3.5 rounded bg-blue-50 border border-blue-200 text-[6px] text-blue-700 font-bold flex items-center justify-center font-mono">
                      0*0=?
                    </div>
                  </div>
                  <!-- Mini Login Button -->
                  <div class="h-4 rounded bg-[#2F68FF] text-white text-[7px] font-bold flex items-center justify-center">
                    登录
                  </div>
                  <div class="text-[6px] text-slate-400 flex items-center justify-between pt-0.5">
                    <span>{{ localConfig.requirePrivacyCheck ? '☑ 隐私政策' : '隐私政策' }}</span>
                    <span>忘记密码</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Tips -->
        <div class="p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-xs text-slate-600 space-y-1">
          <div class="font-bold text-blue-900 flex items-center gap-1">
            <CheckCircle2 class="w-3.5 h-3.5 text-blue-600" />
            配置生效说明
          </div>
          <p class="text-[11px] leading-relaxed text-blue-800/80">
            点击右上角「保存配置」将持久化至本地存储；点击「全屏预览登录页」可一键进入真实登录页体验验证码交互与背景渲染效果。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import {
  Palette,
  ExternalLink,
  Save,
  Image,
  Upload,
  Type,
  ShieldCheck,
  Eye,
  CheckCircle2,
} from 'lucide-vue-next';
import { LoginPageConfig } from '../types';
import { DEFAULT_LOGIN_CONFIG } from '../data/mockData';

interface Props {
  config: LoginPageConfig;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'saveConfig', updated: LoginPageConfig): void;
  (e: 'previewLoginPage'): void;
  (e: 'showToast', msg: string, type?: 'success' | 'info' | 'warning'): void;
}>();

const localConfig = reactive<LoginPageConfig>({ ...props.config });

watch(
  () => props.config,
  (newVal) => {
    Object.assign(localConfig, newVal);
  },
  { deep: true }
);

const saveConfig = () => {
  emit('saveConfig', { ...localConfig });
  emit('showToast', '登录页自定义配置已成功保存！');
};

const resetToDefault = () => {
  Object.assign(localConfig, DEFAULT_LOGIN_CONFIG);
  emit('saveConfig', { ...localConfig });
  emit('showToast', '已成功恢复登录页默认配置');
};

const useSampleBgImage = () => {
  localConfig.customBgUrl = 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1920&auto=format&fit=crop';
  localConfig.bgBlur = 2;
  localConfig.bgOpacity = 90;
  emit('showToast', '已填入推荐科技背景图片地址');
};

const handleBgFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      emit('showToast', '背景图片文件过大，请选择小于 5MB 的图片', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        localConfig.customBgUrl = event.target.result as string;
        emit('showToast', '背景图片已成功加载并预览');
      }
    };
    reader.readAsDataURL(file);
  }
};
</script>
