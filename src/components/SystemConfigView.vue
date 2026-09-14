<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <!-- Top Action Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h3 class="text-base font-bold text-slate-800 flex items-center gap-2">
          <Settings class="w-4 h-4 text-[#FF6A00]" />
          系统配置
        </h3>
        <p class="text-xs text-slate-400 mt-1">
          统一配置平台基本信息与登录页自定义选项
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          type="button"
          @click="resetToDefault"
          class="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors cursor-pointer"
        >
          恢复系统默认
        </button>
        <button
          type="button"
          @click="saveConfig"
          class="px-4 py-1.5 rounded-lg bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Save class="w-3.5 h-3.5" />
          <span>保存配置</span>
        </button>
      </div>
    </div>

    <!-- 1. 基本信息配置 (平台名称、平台Logo) -->
    <section class="bg-white border border-[#E5E6EB] rounded-xl p-5 shadow-xs space-y-5">
      <div class="flex items-center gap-2 pb-3 border-b border-slate-100">
        <Sliders class="w-4 h-4 text-[#FF6A00]" />
        <h4 class="text-sm font-bold text-slate-800">基本信息配置</h4>
        <span class="text-xs text-slate-400">（修改系统平台名称及平台 Logo）</span>
      </div>

      <!-- 1.1 平台名称 -->
      <div class="space-y-2">
        <label class="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Layers class="w-3.5 h-3.5 text-[#FF6A00]" />
          平台名称
        </label>
        <div class="max-w-xl space-y-1.5">
          <div class="flex items-center gap-2">
            <input
              v-model="localConfig.platformTitle"
              type="text"
              maxlength="30"
              placeholder="例如：一体化数据平台 / 数据中台"
              class="flex-1 px-3.5 py-2 text-xs bg-[#FAFAFA] border border-slate-200 rounded-lg focus:bg-white focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] focus:outline-none transition-colors"
            />
            <span class="text-[11px] text-slate-400 font-mono">
              {{ localConfig.platformTitle.length }}/30
            </span>
          </div>
          <p class="text-[11px] text-slate-400">
            该名称将展示在系统顶部导航栏、登录页首屏标识以及浏览器标头中。
          </p>
        </div>
      </div>

      <!-- 1.2 平台 Logo (仅上传图片，无风格) -->
      <div class="space-y-2 pt-2 border-t border-slate-100">
        <div class="flex items-center justify-between max-w-xl">
          <label class="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <ImageIcon class="w-3.5 h-3.5 text-[#FF6A00]" />
            平台 Logo
          </label>
          <button
            v-if="localConfig.platformLogo"
            @click="removeLogo"
            type="button"
            class="text-[11px] text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
          >
            <Trash2 class="w-3 h-3" />
            <span>恢复默认 Logo</span>
          </button>
        </div>

        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-[#FAFAFA] border border-slate-200 rounded-lg max-w-xl">
          <!-- Logo Preview Box -->
          <div class="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
            <img
              v-if="localConfig.platformLogo"
              :src="localConfig.platformLogo"
              alt="Platform Logo"
              class="w-full h-full object-contain p-1"
            />
            <div v-else class="w-10 h-10 rounded-lg bg-[#FF6A00] flex items-center justify-center text-white">
              <Layers class="w-5 h-5" />
            </div>
          </div>

          <!-- Upload Controls -->
          <div class="flex-1 space-y-2">
            <div class="flex items-center gap-2.5">
              <input
                ref="logoFileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleLogoFileSelect"
              />
              <button
                type="button"
                @click="triggerLogoUpload"
                class="px-3.5 py-1.5 rounded-lg bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Upload class="w-3.5 h-3.5" />
                <span>上传 Logo 图片</span>
              </button>

              <span v-if="localConfig.platformLogo" class="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <Check class="w-3 h-3" />
                已设置自定义 Logo
              </span>
              <span v-else class="text-[11px] text-slate-400">
                当前为系统默认 Logo
              </span>
            </div>
            <p class="text-[11px] text-slate-400 leading-relaxed">
              支持 PNG、JPG、SVG、WebP 格式图片，建议使用透明背景的正方形图片（小于 2MB）。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. 登录页配置 -->
    <section class="bg-white border border-[#E5E6EB] rounded-xl p-5 shadow-xs space-y-6">
      <div class="flex items-center gap-2 pb-3 border-b border-slate-100">
        <Palette class="w-4 h-4 text-[#FF6A00]" />
        <h4 class="text-sm font-bold text-slate-800">登录页配置</h4>
        <span class="text-xs text-slate-400">（修改登录页背景图片、标语及安全验证策略）</span>
      </div>

      <!-- 2.1 登录页背景图片 (仅上传图片，无风格) -->
      <div class="space-y-2">
        <div class="flex items-center justify-between max-w-xl">
          <label class="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <ImageIcon class="w-3.5 h-3.5 text-[#FF6A00]" />
            登录页背景图片
          </label>
          <button
            v-if="localConfig.customBgUrl"
            @click="removeBgImage"
            type="button"
            class="text-[11px] text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
          >
            <Trash2 class="w-3 h-3" />
            <span>恢复默认背景</span>
          </button>
        </div>

        <div class="p-4 bg-[#FAFAFA] border border-slate-200 rounded-lg space-y-3.5 max-w-xl">
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <!-- Thumbnail Box -->
            <div class="w-28 h-18 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 shadow-2xs flex items-center justify-center">
              <img
                v-if="localConfig.customBgUrl"
                :src="localConfig.customBgUrl"
                alt="Custom Background"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-[#EEF2FC] via-[#F8FAFF] to-[#F1F4FA] flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                <Layers class="w-5 h-5 text-blue-400 mb-0.5" />
                <span class="text-[9px] text-blue-500 font-semibold">系统默认背景</span>
              </div>
            </div>

            <!-- Upload Controls -->
            <div class="flex-1 space-y-2">
              <div class="flex items-center gap-2.5">
                <input
                  ref="bgFileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleBgFileSelect"
                />
                <button
                  type="button"
                  @click="triggerBgUpload"
                  class="px-3.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Upload class="w-3.5 h-3.5" />
                  <span>上传背景图片</span>
                </button>

                <span v-if="localConfig.customBgUrl" class="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <Check class="w-3 h-3" />
                  已设置自定义背景
                </span>
                <span v-else class="text-[11px] text-slate-400">
                  当前为系统预设轻透背景
                </span>
              </div>
              <p class="text-[11px] text-slate-400 leading-relaxed">
                支持 JPG、PNG、WebP 格式图片，建议分辨率 1920×1080 及以上（小于 5MB）。
              </p>
            </div>
          </div>

          <!-- Adjusters when custom image uploaded -->
          <div v-if="localConfig.customBgUrl" class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200">
            <div class="space-y-1">
              <div class="flex items-center justify-between text-[11px] text-slate-600">
                <span>背景不透明度</span>
                <span class="font-mono font-bold">{{ localConfig.bgOpacity }}%</span>
              </div>
              <input
                v-model.number="localConfig.bgOpacity"
                type="range"
                min="10"
                max="100"
                class="w-full accent-[#2563EB] cursor-pointer"
              />
            </div>

            <div class="space-y-1">
              <div class="flex items-center justify-between text-[11px] text-slate-600">
                <span>背景毛玻璃模糊度</span>
                <span class="font-mono font-bold">{{ localConfig.bgBlur }}px</span>
              </div>
              <input
                v-model.number="localConfig.bgBlur"
                type="range"
                min="0"
                max="20"
                class="w-full accent-[#2563EB] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 2.2 欢迎标语与卡片文案 -->
      <div class="space-y-3 pt-2 border-t border-slate-100 max-w-xl">
        <label class="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Type class="w-3.5 h-3.5 text-[#FF6A00]" />
          欢迎标语与卡片文案
        </label>

        <div class="space-y-3">
          <div class="space-y-1">
            <label class="text-[11px] font-semibold text-slate-600">欢迎主标语 (首屏居中大标题)</label>
            <input
              v-model="localConfig.welcomeHeadline"
              type="text"
              placeholder="例如：欢迎进入数据中台"
              class="w-full px-3.5 py-2 text-xs bg-[#FAFAFA] border border-slate-200 rounded-lg focus:bg-white focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] focus:outline-none transition-colors"
            />
          </div>

          <div class="space-y-1">
            <label class="text-[11px] font-semibold text-slate-600">副标题描述</label>
            <input
              v-model="localConfig.welcomeSubtitle"
              type="text"
              placeholder="例如：全域数据资产统一纳管，赋能业务高效洞察与敏捷开发"
              class="w-full px-3.5 py-2 text-xs bg-[#FAFAFA] border border-slate-200 rounded-lg focus:bg-white focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] focus:outline-none transition-colors"
            />
          </div>

          <div class="space-y-1">
            <label class="text-[11px] font-semibold text-slate-600">登录卡片标题</label>
            <input
              v-model="localConfig.cardTitle"
              type="text"
              placeholder="例如：欢迎登录 / 账号登录"
              class="w-full px-3.5 py-2 text-xs bg-[#FAFAFA] border border-slate-200 rounded-lg focus:bg-white focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      <!-- 2.3 隐私条款配置 (去掉图形验证码防护、验证码计算类型，需支持配置隐私条款内容) -->
      <div class="space-y-3 pt-2 border-t border-slate-100 max-w-xl">
        <div class="flex items-center justify-between">
          <label class="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <FileText class="w-3.5 h-3.5 text-[#FF6A00]" />
            隐私条款配置
          </label>
          <button
            type="button"
            @click="resetPrivacyPolicyToDefault"
            class="text-[11px] text-[#2F68FF] hover:underline cursor-pointer"
          >
            填入默认条款模板
          </button>
        </div>

        <div class="space-y-3">
          <!-- 隐私政策强制勾选开关 -->
          <div class="flex items-center justify-between p-3 bg-[#FAFAFA] border border-slate-200 rounded-lg">
            <div>
              <div class="text-xs font-semibold text-slate-800">强制勾选隐私条款</div>
              <div class="text-[11px] text-slate-400">开启后登录表单必须勾选同意条款才允许提交登录</div>
            </div>
            <input
              v-model="localConfig.requirePrivacyCheck"
              type="checkbox"
              class="w-4 h-4 rounded text-[#FF6A00] accent-[#FF6A00] cursor-pointer"
            />
          </div>

          <!-- 条款详细内容 -->
          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <label class="text-[11px] font-semibold text-slate-600">条款详细内容</label>
              <span class="text-[10px] text-slate-400 font-mono">
                {{ (localConfig.privacyPolicyContent || '').length }} 字
              </span>
            </div>
            <textarea
              v-model="localConfig.privacyPolicyContent"
              rows="7"
              placeholder="请输入企业数据中台服务协议、用户合规行为规范、保密义务及隐私保护条款详细内容..."
              class="w-full px-3.5 py-2 text-xs bg-[#FAFAFA] border border-slate-200 rounded-lg focus:bg-white focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] focus:outline-none transition-colors leading-relaxed font-sans"
            ></textarea>
            <p class="text-[11px] text-slate-400">
              用户在登录页点击该条款时将弹出窗口完整展示此处配置的内容。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom Action Bar: 右下角仅显示“保存”按钮 -->
    <div class="flex items-center justify-end pt-2">
      <button
        type="button"
        @click="saveConfig"
        class="px-6 py-2 rounded-lg bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
      >
        <Save class="w-4 h-4" />
        <span>保存</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import {
  Settings,
  Sliders,
  Palette,
  Image as ImageIcon,
  Type,
  FileText,
  Save,
  Upload,
  Trash2,
  Check,
  Layers,
} from 'lucide-vue-next';
import { LoginPageConfig } from '../types';
import { DEFAULT_LOGIN_CONFIG } from '../data/mockData';

interface Props {
  config: LoginPageConfig;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'saveConfig', config: LoginPageConfig): void;
  (e: 'previewLoginPage'): void;
  (e: 'showToast', msg: string): void;
}>();

const localConfig = reactive<LoginPageConfig>({
  ...DEFAULT_LOGIN_CONFIG,
  ...props.config,
});

watch(
  () => props.config,
  (newVal) => {
    if (newVal) {
      Object.assign(localConfig, newVal);
    }
  },
  { deep: true }
);

// File upload refs
const logoFileInput = ref<HTMLInputElement | null>(null);
const bgFileInput = ref<HTMLInputElement | null>(null);

const triggerLogoUpload = () => {
  logoFileInput.value?.click();
};

const triggerBgUpload = () => {
  bgFileInput.value?.click();
};

const handleLogoFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    emit('showToast', 'Logo图片大小不能超过 2MB！');
    target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    localConfig.platformLogo = event.target?.result as string;
    emit('showToast', '平台 Logo 图片已上传成功！请点击保存配置生效。');
  };
  reader.readAsDataURL(file);
  target.value = '';
};

const removeLogo = () => {
  localConfig.platformLogo = '';
  emit('showToast', '已恢复使用系统默认 Logo');
};

const handleBgFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    emit('showToast', '背景图片大小不能超过 5MB！');
    target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    localConfig.customBgUrl = event.target?.result as string;
    localConfig.bgTheme = 'custom_image';
    emit('showToast', '登录页背景图片已上传成功！请点击保存配置生效。');
  };
  reader.readAsDataURL(file);
  target.value = '';
};

const removeBgImage = () => {
  localConfig.customBgUrl = '';
  localConfig.bgTheme = 'screenshot_geometric';
  emit('showToast', '已恢复使用系统默认背景');
};

const resetPrivacyPolicyToDefault = () => {
  localConfig.privacyPolicyTitle = '《服务协议与隐私条款》';
  localConfig.privacyPolicyContent = DEFAULT_LOGIN_CONFIG.privacyPolicyContent;
  emit('showToast', '已填入默认企业服务协议与隐私条款模板');
};

const resetToDefault = () => {
  Object.assign(localConfig, DEFAULT_LOGIN_CONFIG);
  emit('showToast', '已重置为系统默认配置，请点击保存配置');
};

const saveConfig = () => {
  emit('saveConfig', { ...localConfig });
};
</script>
