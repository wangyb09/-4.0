import React, { useState } from 'react';
import {
  X,
  User,
  Shield,
  KeyRound,
  Bell,
  CheckCircle2,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Plus,
  Trash2,
  AlertCircle,
  Smartphone,
  Save,
  RotateCcw,
  Check,
  ShieldCheck,
  Award,
  Layers,
  FileCode,
  Sliders,
  ExternalLink,
} from 'lucide-react';

export interface UserProfileData {
  avatarText: string;
  name: string;
  englishName: string;
  empId: string;
  title: string;
  department: string;
  team: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  role: string;
  roleBadge: string;
  tenant: string;
  workspace: string;
  joinedDate: string;
  lastLogin: string;
  mfaEnabled: boolean;
  smsAlertEnabled: boolean;
  emailAlertEnabled: boolean;
  dingTalkWebhook: string;
}

const DEFAULT_PROFILE: UserProfileData = {
  avatarText: 'LC',
  name: '李晨',
  englishName: 'Chen Li',
  empId: 'EMP_9528',
  title: '资深大数据架构专家 / 平台负责人',
  department: '技术中台部',
  team: '大数据研发与平台架构运维组',
  email: 'li.chen@datacraft.enterprise.com',
  phone: '138-0013-8899',
  location: '阿里中心 · 望朝大厦 12F-B区',
  bio: '负责全域大数据架构体系建设、数据资产全生命周期治理、实时计算与引擎调度资源统筹。',
  role: '超级管理员 (Super Admin)',
  roleBadge: '最高权限',
  tenant: 'PROD_DATACRAFT_CORP',
  workspace: 'default_production_workspace',
  joinedDate: '2023-03-15',
  lastLogin: '2026-09-08 15:38:22 (IP: 10.128.45.12)',
  mfaEnabled: true,
  smsAlertEnabled: true,
  emailAlertEnabled: true,
  dingTalkWebhook: 'https://oapi.dingtalk.com/robot/send?access_token=e47b9...8a1c',
};

interface AccessKeyItem {
  id: string;
  accessKeyId: string;
  accessKeySecret: string;
  status: 'active' | 'disabled';
  createdAt: string;
  lastUsed: string;
}

const INITIAL_ACCESS_KEYS: AccessKeyItem[] = [
  {
    id: 'ak_1',
    accessKeyId: 'LTAI5t7eW92pD...8XyZ',
    accessKeySecret: 'K9xM2nQ8pL0vT3wR7yB4...sZ9',
    status: 'active',
    createdAt: '2025-11-20 10:14:32',
    lastUsed: '2026-09-08 14:20:11 (DataWorks CLI)',
  },
  {
    id: 'ak_2',
    accessKeyId: 'LTAI5t2qR66vM...3FaB',
    accessKeySecret: 'V3mK8pL9sR2tW7xY4b0...jK2',
    status: 'disabled',
    createdAt: '2025-05-12 16:45:00',
    lastUsed: '2026-01-10 09:12:44 (Flink Pipeline API)',
  },
];

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
  initialTab?: 'profile' | 'security' | 'permissions' | 'notifications';
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  initialTab = 'profile',
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'permissions' | 'notifications'>(
    initialTab
  );

  // Profile Form State
  const [profile, setProfile] = useState<UserProfileData>(DEFAULT_PROFILE);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [showSecretMap, setShowSecretMap] = useState<Record<string, boolean>>({});

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // AccessKeys state
  const [accessKeys, setAccessKeys] = useState<AccessKeyItem[]>(INITIAL_ACCESS_KEYS);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('个人基本信息已成功更新并同步全域权限中心！', 'success');
  };

  const handleResetProfile = () => {
    setProfile(DEFAULT_PROFILE);
    onShowToast('已重置为系统登记初始个人信息', 'info');
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKeyId(id);
    onShowToast('已复制到剪贴板', 'success');
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleToggleKeyStatus = (id: string) => {
    setAccessKeys((prev) =>
      prev.map((k) =>
        k.id === id ? { ...k, status: k.status === 'active' ? 'disabled' : 'active' } : k
      )
    );
    onShowToast('AccessKey 状态变更已生效！', 'info');
  };

  const handleCreateAccessKey = () => {
    if (accessKeys.length >= 4) {
      onShowToast('每个用户最多创建 4 组 AccessKey 凭证', 'warning');
      return;
    }
    const randId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newKey: AccessKeyItem = {
      id: `ak_${Date.now()}`,
      accessKeyId: `LTAI5t${randId}...${randId.slice(0, 3)}`,
      accessKeySecret: `${Math.random().toString(36).substring(2, 12)}...${Math.random().toString(36).substring(2, 6)}`,
      status: 'active',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      lastUsed: '从未调用',
    };
    setAccessKeys((prev) => [newKey, ...prev]);
    onShowToast('已成功签发新 AccessKey 凭证，请妥善保管 Secret！', 'success');
  };

  const handleDeleteAccessKey = (id: string) => {
    setAccessKeys((prev) => prev.filter((k) => k.id !== id));
    onShowToast('该 AccessKey 已从鉴权中心彻底注销并回收', 'warning');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword) {
      onShowToast('请输入当前旧密码', 'warning');
      return;
    }
    if (newPassword.length < 8) {
      onShowToast('新密码长度不能少于 8 位，须包含大小写字母与特殊字符', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      onShowToast('两次输入的新密码不一致，请核对', 'warning');
      return;
    }
    setPasswordSuccess(true);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onShowToast('登录密码修改成功，建议妥善保管新密码！', 'success');
    setTimeout(() => setPasswordSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#1E222D] text-white flex items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF6A00] flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white/20">
              {profile.avatarText}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  {profile.name} <span className="text-xs text-slate-300 font-normal">({profile.englishName})</span>
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#FF6A00]/20 text-[#FF6A00] border border-[#FF6A00]/40">
                  {profile.role}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  正常在职
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                <span>工号: {profile.empId}</span>
                <span>•</span>
                <span>{profile.department} / {profile.team}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-6 shrink-0 gap-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 py-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'text-[#FF6A00] border-[#FF6A00]'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>个人基本信息</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 py-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'security'
                ? 'text-[#FF6A00] border-[#FF6A00]'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>安全设置与 AccessKey</span>
          </button>

          <button
            onClick={() => setActiveTab('permissions')}
            className={`flex items-center gap-2 py-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'permissions'
                ? 'text-[#FF6A00] border-[#FF6A00]'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>角色与权限明细</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 py-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'notifications'
                ? 'text-[#FF6A00] border-[#FF6A00]'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>告警通知与偏好</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: Profile Info Form */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#FF6A00]" />
                    <span>姓名</span>
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#D9D9D9] rounded-md focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] outline-none"
                  />
                </div>

                {/* English Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">英文名 / 拼音</label>
                  <input
                    type="text"
                    value={profile.englishName}
                    onChange={(e) => setProfile({ ...profile, englishName: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#D9D9D9] rounded-md focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] outline-none"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>企业工作邮箱</span>
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#D9D9D9] rounded-md focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] outline-none"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>联系手机</span>
                  </label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#D9D9D9] rounded-md focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] outline-none"
                  />
                </div>

                {/* Location */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>常驻办公地点</span>
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#D9D9D9] rounded-md focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] outline-none"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">个人职责简介</label>
                  <textarea
                    rows={3}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full text-xs p-3 bg-white border border-[#D9D9D9] rounded-md focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Read-only System Org Info */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#FF6A00]" />
                  <span>组织与租户信息 (由系统同步)</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">工号:</span>
                    <span className="font-semibold text-slate-800">{profile.empId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">主属租户:</span>
                    <span className="font-semibold text-slate-800 font-mono">{profile.tenant}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">入职时间:</span>
                    <span className="font-semibold text-slate-800">{profile.joinedDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">最近登录审计:</span>
                    <span className="text-[11px] text-slate-600 block leading-tight">{profile.lastLogin}</span>
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleResetProfile}
                  className="px-4 py-2 rounded-md border border-[#D9D9D9] text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重置</span>
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-[#FF6A00] hover:bg-[#E55F00] text-xs font-bold text-white shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>保存个人信息</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Security & AccessKeys */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* MFA Card */}
              <div className="p-4 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-800">多因子身份验证 (MFA)</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700">
                        已开启保护
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      登录或敏感操作（如删除核心表/修改调度流水线）时须进行动态 Authenticator 验证码校验。
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setProfile({ ...profile, mfaEnabled: !profile.mfaEnabled });
                    onShowToast(profile.mfaEnabled ? 'MFA 验证已关闭' : 'MFA 验证已开启', 'info');
                  }}
                  className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                    profile.mfaEnabled
                      ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                      : 'bg-[#FF6A00] text-white border-[#FF6A00]'
                  }`}
                >
                  {profile.mfaEnabled ? '已启用 (点击管理)' : '立即启用'}
                </button>
              </div>

              {/* Password Change Box */}
              <div className="p-5 rounded-lg border border-slate-200 bg-white space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Lock className="w-4 h-4 text-[#FF6A00]" />
                    <span>修改平台登录密码</span>
                  </div>
                  {passwordSuccess && (
                    <span className="text-xs text-emerald-600 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 密码已成功更新
                    </span>
                  )}
                </div>

                <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">原旧密码</label>
                    <input
                      type="password"
                      placeholder="输入当前旧密码"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 bg-white border border-[#D9D9D9] rounded focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">新密码</label>
                    <input
                      type="password"
                      placeholder="至少8位(含大小写+数字)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 bg-white border border-[#D9D9D9] rounded focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">确认新密码</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        placeholder="重复新密码"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full text-xs px-3 py-1.5 bg-white border border-[#D9D9D9] rounded focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] outline-none"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shrink-0 transition-colors"
                      >
                        更新
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* AccessKey Management */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-[#FF6A00]" />
                      <span>AccessKey 开发者密钥对管理</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      用于 DataWorks CLI、OpenAPI、Flink/Spark 调度流水线鉴权，请严格保管 Secret，切勿外泄。
                    </p>
                  </div>
                  <button
                    onClick={handleCreateAccessKey}
                    className="px-3 py-1.5 rounded bg-[#FF6A00] hover:bg-[#E55F00] text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>创建 AccessKey</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                        <th className="py-2.5 px-3">AccessKey ID</th>
                        <th className="py-2.5 px-3">AccessKey Secret</th>
                        <th className="py-2.5 px-3">状态</th>
                        <th className="py-2.5 px-3">创建时间 / 最近调用</th>
                        <th className="py-2.5 px-3 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {accessKeys.map((ak) => {
                        const isSecretVisible = showSecretMap[ak.id];
                        return (
                          <tr key={ak.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2.5 px-3 font-mono font-medium text-slate-700">
                              <div className="flex items-center gap-1.5">
                                <span>{ak.accessKeyId}</span>
                                <button
                                  onClick={() => handleCopyText(ak.accessKeyId, `ak_${ak.id}`)}
                                  className="text-slate-400 hover:text-[#FF6A00] transition-colors"
                                  title="复制 AccessKey ID"
                                >
                                  {copiedKeyId === `ak_${ak.id}` ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-slate-600">
                              <div className="flex items-center gap-2">
                                <span>{isSecretVisible ? ak.accessKeySecret : '••••••••••••••••••••'}</span>
                                <button
                                  onClick={() =>
                                    setShowSecretMap({ ...showSecretMap, [ak.id]: !isSecretVisible })
                                  }
                                  className="text-slate-400 hover:text-slate-700 transition-colors"
                                  title={isSecretVisible ? '隐藏 Secret' : '查看 Secret'}
                                >
                                  {isSecretVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                </button>
                                {isSecretVisible && (
                                  <button
                                    onClick={() => handleCopyText(ak.accessKeySecret, `sec_${ak.id}`)}
                                    className="text-slate-400 hover:text-[#FF6A00] transition-colors"
                                    title="复制 Secret"
                                  >
                                    {copiedKeyId === `sec_${ak.id}` ? (
                                      <Check className="w-3 h-3 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  ak.status === 'active'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                                }`}
                              >
                                {ak.status === 'active' ? '启用中' : '已禁用'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-[11px] text-slate-500">
                              <div>{ak.createdAt}</div>
                              <div className="text-[10px] text-slate-400">{ak.lastUsed}</div>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleToggleKeyStatus(ak.id)}
                                  className="text-[11px] text-[#FF6A00] hover:underline font-medium"
                                >
                                  {ak.status === 'active' ? '禁用' : '启用'}
                                </button>
                                <span className="text-slate-200">|</span>
                                <button
                                  onClick={() => handleDeleteAccessKey(ak.id)}
                                  className="text-[11px] text-rose-500 hover:underline font-medium"
                                >
                                  删除
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Roles & Permissions Matrix */}
          {activeTab === 'permissions' && (
            <div className="space-y-4">
              {/* Role Badges */}
              <div className="p-4 rounded-lg bg-orange-50/60 border border-orange-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#FF6A00] text-white">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>当前分配角色: {profile.role}</span>
                      <span className="px-2 py-0.2 rounded text-[10px] bg-[#FF6A00] text-white font-semibold">
                        最高级权限 (ALL)
                      </span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      具备全域数据湖仓引擎、元数据纳管、调度策略下发与敏感数据脱敏穿透权限。
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-500">归属授权组织:</span>
                  <span className="text-xs font-semibold text-slate-800 bg-white px-2 py-1 rounded border border-orange-200">
                    集团数据架构委员会
                  </span>
                </div>
              </div>

              {/* Functional Permission Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#FF6A00]" />
                      元数据与数据资产管控
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold">读写与审核 (RW)</span>
                  </div>
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                    <li>全域元仓接入、表元数据采集解析、血缘拓扑关系图谱探查</li>
                    <li>字段级安全等级分类分级（C1/C2/C3/C4）标定与下发生效</li>
                    <li>业务知识本体模型与概念术语全生命周期建模</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5 text-[#FF6A00]" />
                      数据集成与同步引擎
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold">完全管控 (Full)</span>
                  </div>
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                    <li>数据源连接池增删改查、SSL凭据配置与心跳健康监控</li>
                    <li>海量批量/实时流同步管道创建、CDC解析与自动映射</li>
                    <li>全域数据传输流控限速与断点续传容灾管理</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#FF6A00]" />
                      任务调度与基线运维
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold">生产运维管理员</span>
                  </div>
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                    <li>全流程 DAG 依赖拓扑编排、即时下发重跑与补数据</li>
                    <li>DolphinScheduler / XXL-JOB 调度集群基线保障与SLA监控</li>
                    <li>P0级任务智能压制与应急熔断处置</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#FF6A00]" />
                      数据服务与开放共享
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold">API 发布与流控</span>
                  </div>
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                    <li>Data API 零代码生成与向导式发布上线</li>
                    <li>跨租户应用密钥授权审批、频次流控与熔断保护</li>
                    <li>API 累计共享调用量审计追踪与数据合规防泄漏</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Notifications & Webhook */}
          {activeTab === 'notifications' && (
            <div className="space-y-5">
              <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-3">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#FF6A00]" />
                  <span>告警通知通道选择</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center gap-2.5 p-2.5 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.smsAlertEnabled}
                      onChange={(e) => setProfile({ ...profile, smsAlertEnabled: e.target.checked })}
                      className="accent-[#FF6A00] w-4 h-4 rounded"
                    />
                    <div>
                      <span className="font-semibold text-slate-800 block">短信与语音强提醒</span>
                      <span className="text-[11px] text-slate-500">接收 P0 级基线破线、核心集群故障告警</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.emailAlertEnabled}
                      onChange={(e) => setProfile({ ...profile, emailAlertEnabled: e.target.checked })}
                      className="accent-[#FF6A00] w-4 h-4 rounded"
                    />
                    <div>
                      <span className="font-semibold text-slate-800 block">企业邮箱日报与周报</span>
                      <span className="text-[11px] text-slate-500">每日调度汇总、数据质量趋势与审批流提醒</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Webhook Configuration */}
              <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-3">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#FF6A00]" />
                  <span>钉钉 / 企业微信群机器人 Webhook</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  配置群机器人 Webhook 地址后，系统异常告警与审批提醒将自动推送至指定群组。
                </p>
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={profile.dingTalkWebhook}
                    onChange={(e) => setProfile({ ...profile, dingTalkWebhook: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 bg-white border border-[#D9D9D9] rounded-md focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] outline-none"
                    placeholder="https://oapi.dingtalk.com/robot/send?access_token=..."
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onShowToast('机器人测试消息已下发，请在群组查看！', 'success')}
                    className="px-3 py-1.5 rounded border border-[#D9D9D9] hover:bg-slate-50 text-xs text-slate-700 font-medium transition-colors"
                  >
                    发送测试告警
                  </button>
                  <button
                    type="button"
                    onClick={() => onShowToast('Webhook 配置已保存并已立即生效', 'success')}
                    className="px-4 py-1.5 rounded bg-[#FF6A00] hover:bg-[#E55F00] text-xs font-bold text-white transition-colors"
                  >
                    保存配置
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>当前会话受企业数字签名与安全审计全链路保护</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-white border border-[#D9D9D9] hover:bg-slate-50 text-slate-700 font-medium transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
