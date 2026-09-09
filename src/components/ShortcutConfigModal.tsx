import React, { useState } from 'react';
import {
  X,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  SlidersHorizontal,
  Check,
  AlertCircle,
  FolderPlus,
  Terminal,
  Database,
  ShieldCheck,
  Clock,
  Share2,
  Activity,
  Network,
  ArrowDownToLine,
  Table,
  Workflow,
  Zap,
  BarChart3,
  Cpu,
  KeyRound,
  FileText,
  Sparkles,
  Search,
  Settings,
  Code2,
  ExternalLink,
} from 'lucide-react';
import { ShortcutItem, PrimaryModule } from '../types';
import { PRIMARY_MODULES } from '../data/mockData';

interface ShortcutConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: ShortcutItem[];
  onSaveShortcuts: (updated: ShortcutItem[]) => void;
  onResetDefault?: () => void;
}

// Selectable icons for shortcuts
const AVAILABLE_ICONS = [
  { name: 'Terminal', label: '终端/IDE', icon: Terminal, color: 'text-[#FF6A00] bg-orange-50 border-orange-200' },
  { name: 'Code2', label: '代码编写', icon: Code2, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  { name: 'Database', label: '数据湖仓', icon: Database, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
  { name: 'ShieldCheck', label: '数据治理', icon: ShieldCheck, color: 'text-[#00B365] bg-emerald-50 border-emerald-200' },
  { name: 'Clock', label: '调度运维', icon: Clock, color: 'text-[#FA8C16] bg-amber-50 border-amber-200' },
  { name: 'Share2', label: '服务共享', icon: Share2, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { name: 'Activity', label: '实时监控', icon: Activity, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { name: 'FolderPlus', label: '集成新建', icon: FolderPlus, color: 'text-sky-600 bg-sky-50 border-sky-200' },
  { name: 'Network', label: '图谱建模', icon: Network, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { name: 'ArrowDownToLine', label: '采集接入', icon: ArrowDownToLine, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { name: 'Table', label: '资产表单', icon: Table, color: 'text-slate-600 bg-slate-100 border-slate-200' },
  { name: 'Workflow', label: 'DAG工作流', icon: Workflow, color: 'text-violet-600 bg-violet-50 border-violet-200' },
  { name: 'Zap', label: '实时计算', icon: Zap, color: 'text-amber-500 bg-amber-50 border-amber-200' },
  { name: 'BarChart3', label: '分析图表', icon: BarChart3, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { name: 'Cpu', label: '计算引擎', icon: Cpu, color: 'text-blue-500 bg-blue-50 border-blue-200' },
  { name: 'KeyRound', label: '权限审计', icon: KeyRound, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { name: 'FileText', label: '标准规范', icon: FileText, color: 'text-teal-600 bg-teal-50 border-teal-200' },
  { name: 'Sparkles', label: '智能助手', icon: Sparkles, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { name: 'Search', label: '资产检索', icon: Search, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { name: 'Settings', label: '系统管理', icon: Settings, color: 'text-slate-700 bg-slate-100 border-slate-200' },
];

export const ShortcutConfigModal: React.FC<ShortcutConfigModalProps> = ({
  isOpen,
  onClose,
  shortcuts,
  onSaveShortcuts,
  onResetDefault,
}) => {
  // Local working list
  const [list, setList] = useState<ShortcutItem[]>(shortcuts);

  // Form edit / add state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formIcon, setFormIcon] = useState('Terminal');
  const [formModule, setFormModule] = useState<PrimaryModule>('development');
  const [formSubMenuId, setFormSubMenuId] = useState<string>('sql_studio');
  const [formError, setFormError] = useState('');

  // Sync list when modal opens with shortcuts
  React.useEffect(() => {
    if (isOpen) {
      setList(shortcuts.map(({ badge, ...rest }) => rest));
      setIsEditing(false);
      setEditingId(null);
      setFormError('');
    }
  }, [isOpen, shortcuts]);

  if (!isOpen) return null;

  // Selected module config
  const selectedModuleConfig = PRIMARY_MODULES.find((m) => m.key === formModule);
  const availableSubMenus = selectedModuleConfig?.subMenus || [];

  // When primary module changes in form, automatically set the first secondary menu
  const handleModuleChange = (newModule: PrimaryModule) => {
    setFormModule(newModule);
    const modConfig = PRIMARY_MODULES.find((m) => m.key === newModule);
    if (modConfig && modConfig.subMenus.length > 0) {
      setFormSubMenuId(modConfig.subMenus[0].id);
    } else {
      setFormSubMenuId('');
    }
  };

  // Open form for adding
  const handleStartAdd = () => {
    setEditingId(null);
    setFormTitle('');
    setFormDesc('');
    setFormIcon('Terminal');
    setFormModule('development');
    setFormSubMenuId('sql_studio');
    setFormError('');
    setIsEditing(true);
  };

  // Open form for editing existing
  const handleStartEdit = (item: ShortcutItem) => {
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormDesc(item.description);
    setFormIcon(item.icon || 'Terminal');
    setFormModule(item.module || 'development');
    
    // Determine appropriate subMenuId
    const modConfig = PRIMARY_MODULES.find((m) => m.key === item.module);
    const validSubId = item.subMenuId && modConfig?.subMenus.some((s) => s.id === item.subMenuId)
      ? item.subMenuId
      : modConfig?.subMenus[0]?.id || '';
    setFormSubMenuId(validSubId);

    setFormError('');
    setIsEditing(true);
  };

  // Save form (Add or Edit)
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('请输入名称');
      return;
    }
    if (!formSubMenuId) {
      setFormError('请选择具体的跳转二级功能菜单');
      return;
    }

    if (editingId) {
      // Update existing
      const updatedList = list.map((item) => {
        if (item.id === editingId) {
          return {
            ...item,
            title: formTitle.trim(),
            description: formDesc.trim() || '快速直达该功能模块',
            icon: formIcon,
            module: formModule,
            subMenuId: formSubMenuId,
            actionKey: item.actionKey || `nav_${formModule}_${formSubMenuId}`,
          };
        }
        return item;
      });
      setList(updatedList);
      onSaveShortcuts(updatedList);
    } else {
      // Create new
      const newItem: ShortcutItem = {
        id: `sc_custom_${Date.now()}`,
        title: formTitle.trim(),
        description: formDesc.trim() || '快速直达该功能模块',
        icon: formIcon,
        module: formModule,
        subMenuId: formSubMenuId,
        category: 'develop',
        pinned: true,
        actionKey: `nav_${formModule}_${formSubMenuId}`,
      };
      const updatedList = [...list, newItem];
      setList(updatedList);
      onSaveShortcuts(updatedList);
    }

    setIsEditing(false);
    setEditingId(null);
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    if (list.length <= 1) {
      alert('至少保留 1 个快捷入口，无法全部删除');
      return;
    }
    const updatedList = list.filter((i) => i.id !== id);
    setList(updatedList);
    onSaveShortcuts(updatedList);
  };

  // Move item up / down
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const updated = [...list];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setList(updated);
    onSaveShortcuts(updated);
  };

  // Helper to render icon preview
  const renderIconPreview = (iconName: string, className = 'w-5 h-5') => {
    const found = AVAILABLE_ICONS.find((i) => i.name === iconName);
    const IconComp = found?.icon || Table;
    return <IconComp className={className} />;
  };

  // Helper to get module & submenu title
  const getTargetMenuLabel = (moduleKey: PrimaryModule, subMenuId?: string) => {
    const mod = PRIMARY_MODULES.find((m) => m.key === moduleKey);
    if (!mod) return '未指定';
    const sub = mod.subMenus.find((s) => s.id === subMenuId);
    return `${mod.title} > ${sub?.title || mod.subMenus[0]?.title || '概览'}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white border border-[#E5E6EB] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#E5E6EB] flex items-center justify-between bg-[#FAFAFA]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 text-[#FF6A00] flex items-center justify-center">
              <SlidersHorizontal className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span>快捷入口自定义配置</span>
                <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  当前共 {list.length} 项
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                支持新增自定义入口、关联两级跳转菜单、编辑修改与排序维护
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                id="btn-add-shortcut"
                onClick={handleStartAdd}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {isEditing ? (
            /* Add / Edit Form */
            <form onSubmit={handleSaveForm} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-[#FF6A00] rounded-xs inline-block" />
                  {editingId ? '编辑快捷入口' : '新增快捷入口'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  返回列表
                </button>
              </div>

              {formError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <span>名称</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="例如：离线数据集成管道"
                  className="w-full px-3 py-2 text-xs rounded-md border border-[#D9D9D9] focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]/20 text-slate-800"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  描述
                </label>
                <input
                  type="text"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="简要说明此快捷入口的核心操作或功能（建议20字以内）"
                  className="w-full px-3 py-2 text-xs rounded-md border border-[#D9D9D9] focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]/20 text-slate-800"
                />
              </div>

              {/* Jump Menu (Must Select up to 2nd Level) */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <span>跳转目标菜单 (必须选择到二级菜单)</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-[#FF6A00] font-medium bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    直达：{getTargetMenuLabel(formModule, formSubMenuId)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Step 1: Primary Module */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-500 font-medium">1. 选择一级功能模块</span>
                    <select
                      value={formModule}
                      onChange={(e) => handleModuleChange(e.target.value as PrimaryModule)}
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#D9D9D9] bg-white text-slate-800 focus:outline-none focus:border-[#FF6A00]"
                    >
                      {PRIMARY_MODULES.map((mod) => (
                        <option key={mod.key} value={mod.key}>
                          {mod.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Step 2: Secondary Menu */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-500 font-medium">2. 选择二级具体子菜单</span>
                    <select
                      value={formSubMenuId}
                      onChange={(e) => setFormSubMenuId(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#D9D9D9] bg-white text-slate-800 focus:outline-none focus:border-[#FF6A00]"
                    >
                      {availableSubMenus.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Icon Picker */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  选择入口图标
                </label>

                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 p-2.5 rounded-lg border border-[#E5E6EB] bg-slate-50/50 max-h-40 overflow-y-auto">
                  {AVAILABLE_ICONS.map((ic) => {
                    const isSelected = formIcon === ic.name;
                    const IconC = ic.icon;
                    return (
                      <button
                        type="button"
                        key={ic.name}
                        onClick={() => setFormIcon(ic.name)}
                        className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all text-center ${
                          isSelected
                            ? 'bg-white border-2 border-[#FF6A00] shadow-xs text-[#FF6A00] scale-105'
                            : 'bg-white border border-[#E5E6EB] text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                        title={ic.label}
                      >
                        <IconC className="w-4 h-4" />
                        <span className="text-[9px] truncate w-full leading-none">{ic.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-1.5 rounded-md border border-[#D9D9D9] text-slate-600 hover:bg-slate-50 text-xs font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-md bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium shadow-xs"
                >
                  {editingId ? '保存' : '确认'}
                </button>
              </div>
            </form>
          ) : (
            /* Management List */
            <div className="space-y-3">
              <div className="text-xs text-slate-500 flex items-center justify-between">
                <span>可通过“上移 / 下移”调整卡片在工作台上的排列次序：</span>
                <span className="text-[11px] text-slate-400">支持点击右侧笔头图标进行编辑</span>
              </div>

              <div className="divide-y divide-slate-100 border border-[#E5E6EB] rounded-lg overflow-hidden bg-white shadow-2xs">
                {list.map((sc, index) => {
                  return (
                    <div
                      key={sc.id}
                      className="p-3 sm:p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Left: Icon & Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-200/80 flex items-center justify-center text-[#FF6A00] shrink-0">
                          {renderIconPreview(sc.icon)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800 truncate">
                              {sc.title}
                            </span>
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 truncate">
                              {getTargetMenuLabel(sc.module, sc.subMenuId)}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {sc.description}
                          </p>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Move Up */}
                        <button
                          type="button"
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                          title="上移"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === list.length - 1}
                          className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                          title="下移"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleStartEdit(sc)}
                          className="p-1.5 rounded text-slate-600 hover:text-[#FF6A00] hover:bg-orange-50 transition-colors ml-1"
                          title="编辑修改此快捷入口"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(sc.id)}
                          className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="删除此快捷入口"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer (Hidden during Add/Edit to avoid button confusion) */}
        {!isEditing && (
          <div className="px-5 py-3.5 bg-[#FAFAFA] border-t border-[#E5E6EB] flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-1.5 rounded-md bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium shadow-xs transition-colors"
            >
              完成
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
