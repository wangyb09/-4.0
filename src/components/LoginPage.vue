<template>
  <div class="min-h-screen w-full relative flex flex-col justify-between select-none overflow-x-hidden font-sans">
    <!-- 1. Background Layer (Configurable) -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <!-- Uploaded Custom Image Background -->
      <div
        v-if="config.customBgUrl"
        class="absolute inset-0 bg-cover bg-center transition-all duration-300"
        :style="{
          backgroundImage: `url(${config.customBgUrl})`,
          filter: config.bgBlur ? `blur(${config.bgBlur}px)` : 'none',
          opacity: (config.bgOpacity ?? 100) / 100,
        }"
      />

      <!-- Default Background: Soft 3D Tilted Isometric Geometric Wireframes & Planes -->
      <div
        v-else
        class="absolute inset-0 bg-[#F4F6FB] bg-gradient-to-br from-[#EEF2FC] via-[#F8FAFF] to-[#F1F4FA]"
      >
        <svg class="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="planeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#E1E7F8" stop-opacity="0.8" />
              <stop offset="100%" stop-color="#F2F5FD" stop-opacity="0.2" />
            </linearGradient>
            <linearGradient id="planeGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#D9E3FC" stop-opacity="0.6" />
              <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.1" />
            </linearGradient>
            <linearGradient id="cubeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.15" />
              <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.05" />
            </linearGradient>
          </defs>

          <!-- Large Ambient Radial Highlights -->
          <circle cx="20%" cy="40%" r="400" fill="url(#cubeGlow)" />
          <circle cx="85%" cy="85%" r="500" fill="url(#cubeGlow)" />

          <!-- Perspective Isometric Grid Lines & Polygons -->
          <g transform="translate(0, 0)">
            <!-- Top Right geometric plane -->
            <polygon points="1200,-50 1900,300 1600,600 900,250" fill="url(#planeGrad1)" stroke="#D6E0F5" stroke-width="1.2" />
            <!-- Center background floating tilted block -->
            <polygon points="200,450 750,150 1200,380 650,680" fill="url(#planeGrad2)" stroke="#CCD9F3" stroke-width="1" />
            <!-- Bottom left tilted plane -->
            <polygon points="-100,750 400,500 850,720 350,970" fill="url(#planeGrad1)" stroke="#CBD7F2" stroke-width="1" opacity="0.7" />
            <!-- Bottom large isometric perspective platform -->
            <polygon points="300,900 1100,500 1800,850 1000,1250" fill="url(#planeGrad2)" stroke="#D5E0F7" stroke-width="1.2" opacity="0.8" />
          </g>
        </svg>
      </div>
    </div>

    <!-- 2. Top Header Navigation -->
    <header class="relative z-10 w-full px-6 sm:px-12 py-5 flex items-center justify-between">
      <!-- Left: Logo + Platform Title -->
      <div class="flex items-center gap-3">
        <!-- Logo: Custom image or default 3D isometric cube -->
        <div class="w-9 h-9 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] relative overflow-hidden group">
          <img
            v-if="config.platformLogo"
            :src="config.platformLogo"
            alt="Logo"
            class="w-full h-full object-contain p-1 bg-white/20"
          />
          <svg v-else class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#93C5FD" fill-opacity="0.9" />
            <path d="M2 17L12 22V12L2 7V17Z" fill="#3B82F6" />
            <path d="M12 22L22 17V7L12 12V22Z" fill="#1D4ED8" />
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="0.75" />
            <path d="M2 17L12 22V12L2 7V17Z" stroke="white" stroke-width="0.75" />
            <path d="M12 22L22 17V7L12 12V22Z" stroke="white" stroke-width="0.75" />
          </svg>
        </div>

        <h1 class="text-xl font-bold tracking-tight select-none text-slate-900">
          {{ config.platformTitle || '数据中台' }}
        </h1>
      </div>
    </header>

    <!-- 3. Main Center Content (2-Column Grid matching image.png) -->
    <main class="relative z-10 max-w-[1440px] w-full mx-auto px-6 sm:px-12 py-4 sm:py-8 flex-1 flex items-center justify-center">
      <div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        <!-- 3.1 Left Column: Welcome Headline & Isometric 3D Showcase (Matching image.png) -->
        <div class="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:pl-10 xl:pl-16">
          <!-- Main Welcome Headline -->
          <div class="lg:pl-2">
            <h2
              :class="[
                'text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-tight',
                config.bgTheme === 'tech_dark_blue' ? 'text-white' : 'text-slate-900'
              ]"
            >
              {{ config.welcomeHeadline || '欢迎进入数据中台' }}
            </h2>
            <p
              v-if="config.welcomeSubtitle"
              :class="[
                'text-sm sm:text-base mt-2 max-w-xl',
                config.bgTheme === 'tech_dark_blue' ? 'text-slate-400' : 'text-slate-500'
              ]"
            >
              {{ config.welcomeSubtitle }}
            </p>
          </div>

          <!-- 3D Perspective Isometric Product Mockup Cards (Exactly as in image.png) -->
          <div class="w-full max-w-[560px] py-3 relative group">
            <!-- Simulated 3D Multi-Layer Windows -->
            <div class="relative w-full aspect-[16/10] perspective-[1000px]">
              <!-- Layer 1: Back Background Card (tilted) -->
              <div
                class="absolute top-0 left-4 right-12 bottom-8 bg-white/90 rounded-xl shadow-lg border border-slate-200/80 p-3 transform rotate-[-3deg] -skew-y-2 scale-95 opacity-80 backdrop-blur-xs transition-transform duration-500 group-hover:rotate-[-2deg]"
              >
                <!-- Window Topbar -->
                <div class="flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <div class="w-2 h-2 rounded-full bg-red-400" />
                  <div class="w-2 h-2 rounded-full bg-amber-400" />
                  <div class="w-2 h-2 rounded-full bg-emerald-400" />
                  <span class="text-[9px] text-slate-400 ml-2 font-mono">集成任务编排与离线管道</span>
                </div>
                <!-- Mini Grid Content -->
                <div class="grid grid-cols-4 gap-2 mt-2">
                  <div class="h-10 rounded bg-blue-50 border border-blue-100 p-1">
                    <div class="w-8 h-1.5 bg-blue-300 rounded" />
                    <div class="w-12 h-2 bg-blue-500 rounded mt-2" />
                  </div>
                  <div class="h-10 rounded bg-slate-50 border border-slate-100 p-1">
                    <div class="w-8 h-1.5 bg-slate-300 rounded" />
                    <div class="w-10 h-2 bg-slate-400 rounded mt-2" />
                  </div>
                  <div class="h-10 rounded bg-emerald-50 border border-emerald-100 p-1">
                    <div class="w-8 h-1.5 bg-emerald-300 rounded" />
                    <div class="w-10 h-2 bg-emerald-500 rounded mt-2" />
                  </div>
                  <div class="h-10 rounded bg-orange-50 border border-orange-100 p-1">
                    <div class="w-8 h-1.5 bg-orange-300 rounded" />
                    <div class="w-10 h-2 bg-orange-500 rounded mt-2" />
                  </div>
                </div>
              </div>

              <!-- Layer 2: Foreground Main Focused Card (Floating Isometric Card from screenshot) -->
              <div
                class="absolute top-6 left-12 right-2 bottom-0 bg-white rounded-xl shadow-2xl border border-blue-200/90 p-3.5 transform rotate-[1deg] skew-y-1 transition-transform duration-500 group-hover:rotate-[0deg] group-hover:scale-[1.02] flex flex-col justify-between"
              >
                <!-- Window Chrome -->
                <div>
                  <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div class="flex items-center gap-1.5">
                      <div class="w-2.5 h-2.5 rounded-full bg-blue-500 flex items-center justify-center">
                        <div class="w-1 h-1 rounded-full bg-white" />
                      </div>
                      <span class="text-[11px] font-bold text-slate-800">智能数据中台 · 生产全域大盘</span>
                    </div>
                    <span class="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 font-mono">
                      SLO 99.98%
                    </span>
                  </div>

                  <!-- Mini Stats Top -->
                  <div class="grid grid-cols-3 gap-2 mt-2.5">
                    <div class="p-2 rounded bg-gradient-to-r from-blue-500 to-blue-600 text-white text-left">
                      <div class="text-[9px] opacity-80">总纳管数据源</div>
                      <div class="text-xs font-bold font-mono mt-0.5">18 个</div>
                    </div>
                    <div class="p-2 rounded bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-left">
                      <div class="text-[9px] opacity-80">核心元数据表</div>
                      <div class="text-xs font-bold font-mono mt-0.5">3,420 张</div>
                    </div>
                    <div class="p-2 rounded bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-left">
                      <div class="text-[9px] opacity-80">调度执行作业</div>
                      <div class="text-xs font-bold font-mono mt-0.5">156 条</div>
                    </div>
                  </div>

                  <!-- Mini Flow Diagram / List -->
                  <div class="mt-2.5 space-y-1.5">
                    <div class="flex items-center justify-between p-1.5 rounded bg-slate-50 border border-slate-100 text-[10px]">
                      <span class="font-mono text-slate-700">ods_user_behavior_cdc</span>
                      <span class="text-emerald-600 font-semibold">● 运行正常</span>
                      <span class="text-slate-400 font-mono">08:35:12</span>
                    </div>
                    <div class="flex items-center justify-between p-1.5 rounded bg-slate-50 border border-slate-100 text-[10px]">
                      <span class="font-mono text-slate-700">dwd_order_master_snapshot</span>
                      <span class="text-blue-600 font-semibold">● 计算完成</span>
                      <span class="text-slate-400 font-mono">08:32:04</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Carousel indicator dots below (matching image.png) -->
            <div class="flex items-center justify-center gap-1.5 mt-4">
              <span class="w-5 h-1.5 rounded-full bg-blue-600 transition-all" />
              <span class="w-1.5 h-1.5 rounded-full bg-slate-300 transition-all hover:bg-slate-400 cursor-pointer" />
              <span class="w-1.5 h-1.5 rounded-full bg-slate-300 transition-all hover:bg-slate-400 cursor-pointer" />
            </div>
          </div>
        </div>

        <!-- 3.2 Right Column: Crisp White Login Card (Matching image.png) -->
        <div class="lg:col-span-5 flex justify-center lg:justify-end">
          <div
            class="w-full max-w-[420px] bg-white rounded-2xl shadow-xl border border-[#E5E9F2] p-7 sm:p-9 relative"
          >
            <!-- Card Title (欢迎登录) -->
            <div class="mb-6">
              <h3 class="text-2xl font-bold text-slate-900 tracking-tight">
                {{ config.cardTitle || '欢迎登录' }}
              </h3>
            </div>

            <!-- Login Form -->
            <form @submit.prevent="handleLoginSubmit" class="space-y-4">
              <!-- Username Field -->
              <div class="space-y-1">
                <div class="relative flex items-center">
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User class="w-4 h-4" />
                  </div>
                  <input
                    id="login-input-username"
                    v-model="loginForm.username"
                    type="text"
                    required
                    autocomplete="username"
                    placeholder="请输入用户名"
                    class="w-full pl-10 pr-3.5 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 border border-[#DCDFE6] hover:border-[#409EFF] focus:border-[#2563EB] rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100 transition-colors"
                  />
                </div>
              </div>

              <!-- Password Field -->
              <div class="space-y-1">
                <div class="relative flex items-center">
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock class="w-4 h-4" />
                  </div>
                  <input
                    id="login-input-password"
                    v-model="loginForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    autocomplete="current-password"
                    placeholder="请输入密码"
                    class="w-full pl-10 pr-10 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 border border-[#DCDFE6] hover:border-[#409EFF] focus:border-[#2563EB] rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100 transition-colors"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <EyeOff v-if="showPassword" class="w-4 h-4" />
                    <Eye v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- Captcha Field (验证码, matching image.png `0*0=?`) -->
              <div class="space-y-1">
                <div class="flex items-center gap-2.5">
                  <div class="relative flex-1">
                    <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <ShieldCheck class="w-4 h-4" />
                    </div>
                    <input
                      id="login-input-captcha"
                      v-model="loginForm.captcha"
                      type="text"
                      required
                      placeholder="请输入验证码"
                      class="w-full pl-10 pr-3 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 border border-[#DCDFE6] hover:border-[#409EFF] focus:border-[#2563EB] rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100 transition-colors"
                    />
                  </div>

                  <!-- Captcha Graphic Box (0*0=?) -->
                  <button
                    type="button"
                    @click="refreshCaptcha"
                    title="点击刷新验证码"
                    class="h-[46px] w-[108px] rounded-lg border border-[#DCDFE6] bg-[#E8EDF5] hover:bg-[#DCE4F0] flex items-center justify-center font-mono font-bold text-sm tracking-wider select-none shadow-inner cursor-pointer relative overflow-hidden transition-all group shrink-0"
                  >
                    <div class="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:6px_6px]" />
                    <span
                      class="relative z-10 text-indigo-700 tracking-wider font-extrabold select-none italic text-base drop-shadow-xs"
                    >
                      {{ currentCaptchaCode }}
                    </span>
                    <RotateCw class="w-3 h-3 text-slate-400 group-hover:text-[#2563EB] absolute bottom-1 right-1 opacity-60 group-hover:rotate-180 transition-all duration-300" />
                  </button>
                </div>
              </div>

              <!-- Login Primary Button (Big Blue Button from screenshot) -->
              <div class="pt-2">
                <button
                  id="btn-login-submit"
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full py-3 px-4 rounded-lg bg-[#2F68FF] hover:bg-[#2558E8] active:bg-[#1E48CC] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
                  <span>{{ isSubmitting ? '正在验证登录...' : '登 录' }}</span>
                </button>
              </div>

              <!-- Agreement Checkbox & Forgot Password (Matching image.png) -->
              <div class="flex items-center justify-between text-xs pt-2">
                <label class="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                  <input
                    id="checkbox-login-privacy"
                    v-model="loginForm.agreedPrivacy"
                    type="checkbox"
                    class="w-4 h-4 rounded text-[#2F68FF] border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>
                    我已阅读并同意
                    <a
                      href="javascript:void(0)"
                      @click.stop="isPrivacyModalOpen = true"
                      class="text-[#2F68FF] hover:underline font-medium"
                    >
                      {{ config.privacyPolicyTitle || '《服务协议与隐私条款》' }}
                    </a>
                  </span>
                </label>

                <button
                  type="button"
                  @click="handleForgotPassword"
                  class="text-slate-500 hover:text-[#2F68FF] transition-colors cursor-pointer"
                >
                  忘记密码?
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>

    <!-- 4. Privacy Policy Modal -->
    <div
      v-if="isPrivacyModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
    >
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <h4 class="text-base font-bold text-slate-900">
            {{ config.privacyPolicyTitle || '服务协议与隐私条款' }}
          </h4>
          <button @click="isPrivacyModalOpen = false" class="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </div>
        <div class="text-xs text-slate-600 leading-relaxed max-h-72 overflow-y-auto whitespace-pre-line pr-1 space-y-2">
          <div v-if="config.privacyPolicyContent" class="whitespace-pre-line">
            {{ config.privacyPolicyContent }}
          </div>
          <template v-else>
            <p>
              尊敬的中台用户：欢迎使用平台。为保障企业数据资产安全与个人隐私合法权益，本系统严格遵守《中华人民共和国数据安全法》及《网络安全法》。
            </p>
            <p>
              1. <strong>日志留存与审计</strong>：为保障系统运行稳定性及排查安全事件，平台将合规记录您的登录IP、浏览器环境及调度研发敏感操作。
            </p>
            <p>
              2. <strong>权限管控与脱敏</strong>：所有业务表访问均遵循 RBAC 授权与行级/列级动态脱敏策略，未经审批严禁导出或解密核心生产数据。
            </p>
          </template>
        </div>
        <div class="flex justify-end pt-2">
          <button
            @click="isPrivacyModalOpen = false; loginForm.agreedPrivacy = true"
            class="px-4 py-2 rounded-lg bg-[#2F68FF] text-white text-xs font-semibold hover:bg-[#2558E8] cursor-pointer"
          >
            我已阅读并同意
          </button>
        </div>
      </div>
    </div>

    <!-- 6. Help / Feedback Modal -->
    <div
      v-if="modalInfo"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
    >
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-3">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <h4 class="text-sm font-bold text-slate-900">{{ modalInfo.title }}</h4>
          <button @click="modalInfo = null" class="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed">{{ modalInfo.content }}</p>
        <div class="flex justify-end pt-2">
          <button
            @click="modalInfo = null"
            class="px-3.5 py-1.5 rounded-lg bg-[#2F68FF] text-white text-xs font-medium cursor-pointer"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  RotateCw,
  Loader2,
  X,
} from 'lucide-vue-next';
import { LoginPageConfig } from '../types';

interface Props {
  config: LoginPageConfig;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'loginSuccess', username: string): void;
  (e: 'showToast', msg: string, type?: 'success' | 'info' | 'warning'): void;
}>();

// Form States
const loginForm = reactive({
  username: 'admin',
  password: '•••',
  captcha: '',
  agreedPrivacy: true,
});

const showPassword = ref(false);
const isSubmitting = ref(false);
const isPrivacyModalOpen = ref(false);
const modalInfo = ref<{ title: string; content: string } | null>(null);

// Captcha Generator (Arithmetic Formula matching image.png 0*0=?)
const currentCaptchaCode = ref('0*0=?');
const expectedCaptchaResult = ref('0');

const refreshCaptcha = () => {
  const operations = [
    { q: '0*0=?', a: '0' },
    { q: '7+8=?', a: '15' },
    { q: '9-4=?', a: '5' },
    { q: '3*6=?', a: '18' },
    { q: '25-5=?', a: '20' },
    { q: '4*2=?', a: '8' },
    { q: '6+9=?', a: '15' },
    { q: '12-7=?', a: '5' },
  ];
  const picked = operations[Math.floor(Math.random() * operations.length)];
  currentCaptchaCode.value = picked.q;
  expectedCaptchaResult.value = picked.a;
};

onMounted(() => {
  refreshCaptcha();
});

// Login Handlers
const handleLoginSubmit = () => {
  if (!loginForm.username.trim()) {
    emit('showToast', '请输入用户名', 'warning');
    return;
  }
  if (!loginForm.password) {
    emit('showToast', '请输入登录密码', 'warning');
    return;
  }

  // Captcha validation
  if (!loginForm.captcha.trim()) {
    emit('showToast', '请输入验证码', 'warning');
    return;
  }
  const inputVal = loginForm.captcha.trim().toLowerCase();
  if (inputVal !== expectedCaptchaResult.value.toLowerCase()) {
    emit('showToast', `验证码错误，请重新输入（当前计算式为 ${currentCaptchaCode.value}）`, 'warning');
    refreshCaptcha();
    loginForm.captcha = '';
    return;
  }

  // Privacy agreement validation
  if (props.config.requirePrivacyCheck && !loginForm.agreedPrivacy) {
    emit('showToast', `请先阅读并勾选同意${props.config.privacyPolicyTitle || '隐私条款'}`, 'warning');
    return;
  }

  isSubmitting.value = true;
  setTimeout(() => {
    isSubmitting.value = false;
    emit('loginSuccess', loginForm.username.trim());
  }, 600);
};

const handleForgotPassword = () => {
  modalInfo.value = {
    title: '密码找回与重置指引',
    content: '为保障企业中台核心数据安全，密码重置请联系集团超级管理员（admin@datacraft.io），或通过企业微信/钉钉中台运维助手提交工单。',
  };
};
</script>
