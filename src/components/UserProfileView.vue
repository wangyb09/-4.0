<template>
  <div class="max-w-3xl mx-auto space-y-4">
    <!-- 1. Top Breadcrumb & Header -->
    <div class="flex items-center justify-between pb-1">
      <div class="flex items-center gap-2 text-xs text-slate-500">
        <button
          @click="$emit('navigateHome')"
          class="hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          <span>返回工作台</span>
        </button>
        <span>/</span>
        <span class="font-medium text-slate-800">个人中心</span>
      </div>

      <!-- Top Right Action: "修改" / "保存" Toggle Button -->
      <div class="flex items-center gap-2">
        <button
          v-if="isEditing"
          type="button"
          @click="cancelEdit"
          class="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-600 text-xs font-medium transition-colors cursor-pointer"
        >
          取消
        </button>
        <button
          id="btn-profile-toggle-edit"
          type="button"
          @click="handleMainButtonClick"
          class="px-4 py-1.5 rounded-lg bg-[#FF6A00] hover:bg-[#FF7D1A] active:bg-[#E55F00] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Check v-if="isEditing" class="w-3.5 h-3.5" />
          <Edit3 v-else class="w-3.5 h-3.5" />
          <span>{{ isEditing ? '保存' : '修改' }}</span>
        </button>
      </div>
    </div>

    <!-- 2. Main Profile Card -->
    <div class="bg-white rounded-xl border border-[#E5E6EB] shadow-xs p-6 space-y-6">
      <!-- 2.1 Avatar Section: Only Support Image Upload -->
      <div class="flex items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div class="flex items-center gap-4">
          <!-- Current Avatar -->
          <div
            class="w-18 h-18 rounded-2xl bg-gradient-to-tr from-[#FF6A00] to-[#FFA940] flex items-center justify-center text-white text-2xl font-bold shadow-md ring-4 ring-orange-50 shrink-0 overflow-hidden"
          >
            <img
              v-if="form.avatarType !== 'preset' && form.avatar"
              :src="form.avatar"
              alt="Avatar"
              class="w-full h-full object-cover"
              referrerpolicy="no-referrer"
            />
            <span v-else>{{ form.avatar || 'LC' }}</span>
          </div>

          <!-- User Brief Details -->
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-base font-bold text-slate-900">{{ form.realName || '李晨' }}</h2>
              <span class="text-[11px] px-2 py-0.5 rounded-full bg-orange-50 text-[#FF6A00] border border-orange-200 font-medium">
                {{ form.role || '超级管理员' }}
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-1 font-mono">@{{ form.username }}</p>
          </div>
        </div>

        <!-- Only Upload Image Button -->
        <div>
          <label
            :class="[
              'px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer',
              isEditing
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-2xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
            ]"
          >
            <Upload class="w-3.5 h-3.5 text-slate-500" />
            <span>上传图片</span>
            <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />
          </label>
        </div>
      </div>

      <!-- 2.2 Basic Information Fields -->
      <div class="space-y-3">
        <h3 class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <User class="w-4 h-4 text-[#FF6A00]" />
          基本信息
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Username -->
          <div>
            <label class="block text-xs text-slate-600 mb-1">
              用户名 <span v-if="isEditing" class="text-rose-500">*</span>
            </label>
            <input
              id="profile-input-username"
              v-model="form.username"
              type="text"
              :disabled="!isEditing"
              required
              :class="[
                'w-full px-3 py-2 text-xs border rounded-lg transition-colors',
                isEditing
                  ? 'border-slate-200 focus:outline-none focus:border-[#FF6A00] bg-white text-slate-800'
                  : 'border-slate-100 bg-[#F9FAFB] text-slate-600 cursor-default'
              ]"
            />
          </div>

          <!-- Real Name -->
          <div>
            <label class="block text-xs text-slate-600 mb-1">
              真实姓名 <span v-if="isEditing" class="text-rose-500">*</span>
            </label>
            <input
              id="profile-input-realname"
              v-model="form.realName"
              type="text"
              :disabled="!isEditing"
              required
              :class="[
                'w-full px-3 py-2 text-xs border rounded-lg transition-colors',
                isEditing
                  ? 'border-slate-200 focus:outline-none focus:border-[#FF6A00] bg-white text-slate-800'
                  : 'border-slate-100 bg-[#F9FAFB] text-slate-600 cursor-default'
              ]"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-xs text-slate-600 mb-1">
              电子邮箱 <span v-if="isEditing" class="text-rose-500">*</span>
            </label>
            <input
              id="profile-input-email"
              v-model="form.email"
              type="email"
              :disabled="!isEditing"
              required
              :class="[
                'w-full px-3 py-2 text-xs border rounded-lg transition-colors',
                isEditing
                  ? 'border-slate-200 focus:outline-none focus:border-[#FF6A00] bg-white text-slate-800'
                  : 'border-slate-100 bg-[#F9FAFB] text-slate-600 cursor-default'
              ]"
            />
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-xs text-slate-600 mb-1">
              联系电话 <span v-if="isEditing" class="text-rose-500">*</span>
            </label>
            <input
              id="profile-input-phone"
              v-model="form.phone"
              type="tel"
              :disabled="!isEditing"
              required
              :class="[
                'w-full px-3 py-2 text-xs border rounded-lg transition-colors',
                isEditing
                  ? 'border-slate-200 focus:outline-none focus:border-[#FF6A00] bg-white text-slate-800'
                  : 'border-slate-100 bg-[#F9FAFB] text-slate-600 cursor-default'
              ]"
            />
          </div>

          <!-- Department -->
          <div class="sm:col-span-2">
            <label class="block text-xs text-slate-600 mb-1">所属部门</label>
            <input
              v-model="form.department"
              type="text"
              :disabled="!isEditing"
              :class="[
                'w-full px-3 py-2 text-xs border rounded-lg transition-colors',
                isEditing
                  ? 'border-slate-200 focus:outline-none focus:border-[#FF6A00] bg-white text-slate-800'
                  : 'border-slate-100 bg-[#F9FAFB] text-slate-600 cursor-default'
              ]"
            />
          </div>
        </div>
      </div>

      <!-- 2.3 Password Modification (Visible & Editable) -->
      <div class="space-y-3 pt-4 border-t border-slate-100">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <KeyRound class="w-4 h-4 text-[#FF6A00]" />
            修改密码
          </h3>
          <span class="text-[11px] text-slate-400">如不修改密码，请将以下输入框留空</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <!-- Current Password -->
          <div>
            <label class="block text-xs text-slate-600 mb-1">原密码</label>
            <input
              v-model="passwordForm.currentPassword"
              type="password"
              :disabled="!isEditing"
              placeholder="请输入原密码"
              :class="[
                'w-full px-3 py-2 text-xs border rounded-lg transition-colors',
                isEditing
                  ? 'border-slate-200 focus:outline-none focus:border-[#FF6A00] bg-white text-slate-800'
                  : 'border-slate-100 bg-[#F9FAFB] text-slate-400 cursor-default'
              ]"
            />
          </div>

          <!-- New Password -->
          <div>
            <label class="block text-xs text-slate-600 mb-1">新密码</label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              :disabled="!isEditing"
              placeholder="至少 6 位字符"
              :class="[
                'w-full px-3 py-2 text-xs border rounded-lg transition-colors',
                isEditing
                  ? 'border-slate-200 focus:outline-none focus:border-[#FF6A00] bg-white text-slate-800'
                  : 'border-slate-100 bg-[#F9FAFB] text-slate-400 cursor-default'
              ]"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-xs text-slate-600 mb-1">确认新密码</label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              :disabled="!isEditing"
              placeholder="再次输入新密码"
              :class="[
                'w-full px-3 py-2 text-xs border rounded-lg transition-colors',
                isEditing
                  ? 'border-slate-200 focus:outline-none focus:border-[#FF6A00] bg-white text-slate-800'
                  : 'border-slate-100 bg-[#F9FAFB] text-slate-400 cursor-default'
              ]"
            />
          </div>
        </div>

        <!-- Mini Password Match Helper -->
        <div v-if="isEditing && passwordForm.newPassword" class="text-[11px] pt-1">
          <span
            v-if="passwordForm.confirmPassword && passwordForm.newPassword === passwordForm.confirmPassword"
            class="text-emerald-600 flex items-center gap-1 font-medium"
          >
            ✓ 两次新密码输入一致
          </span>
          <span
            v-else-if="passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword"
            class="text-rose-500 font-medium"
          >
            ✕ 两次新密码输入不一致
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import {
  User,
  KeyRound,
  ArrowLeft,
  Upload,
  Edit3,
  Check,
} from 'lucide-vue-next';
import { UserProfile } from '../types';

interface Props {
  profile: UserProfile;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'saveProfile', updated: UserProfile): void;
  (e: 'navigateHome'): void;
  (e: 'showToast', msg: string, type?: 'success' | 'info' | 'warning'): void;
}>();

// Editing state: defaults to false (view mode with "修改" button)
const isEditing = ref(false);

const form = reactive<UserProfile>({ ...props.profile });

watch(
  () => props.profile,
  (newVal) => {
    Object.assign(form, newVal);
  },
  { deep: true }
);

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const cancelEdit = () => {
  Object.assign(form, props.profile);
  passwordForm.currentPassword = '';
  passwordForm.newPassword = '';
  passwordForm.confirmPassword = '';
  isEditing.value = false;
};

const handleAvatarUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    if (file.size > 2 * 1024 * 1024) {
      emit('showToast', '头像图片不能超过 2MB', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        form.avatar = event.target.result as string;
        form.avatarType = 'upload';
        isEditing.value = true;
        emit('showToast', '头像已更新预览，点击右上角「保存」即可生效');
      }
    };
    reader.readAsDataURL(file);
  }
};

const handleMainButtonClick = () => {
  if (!isEditing.value) {
    // Switch to edit mode
    isEditing.value = true;
    return;
  }

  // Currently in edit mode, validate and save
  if (!form.username.trim()) {
    emit('showToast', '用户名不能为空', 'warning');
    return;
  }
  if (!form.realName.trim()) {
    emit('showToast', '真实姓名不能为空', 'warning');
    return;
  }
  if (!form.email.trim()) {
    emit('showToast', '电子邮箱不能为空', 'warning');
    return;
  }
  if (!form.phone.trim()) {
    emit('showToast', '联系电话不能为空', 'warning');
    return;
  }

  // If password changed, validate
  if (passwordForm.newPassword || passwordForm.currentPassword) {
    if (!passwordForm.currentPassword) {
      emit('showToast', '请输入原密码进行校验', 'warning');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      emit('showToast', '新密码长度至少需 6 位', 'warning');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      emit('showToast', '两次输入的新密码不一致，请核对', 'warning');
      return;
    }
  }

  emit('saveProfile', { ...form });
  passwordForm.currentPassword = '';
  passwordForm.newPassword = '';
  passwordForm.confirmPassword = '';
  isEditing.value = false;
  emit('showToast', '个人资料与信息已成功保存！');
};
</script>
