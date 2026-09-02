import React from 'react';
import { X, Pin, Check, SlidersHorizontal, Plus, Trash2 } from 'lucide-react';
import { ShortcutItem } from '../types';

interface ShortcutConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: ShortcutItem[];
  onTogglePin: (id: string) => void;
}

export const ShortcutConfigModal: React.FC<ShortcutConfigModalProps> = ({
  isOpen,
  onClose,
  shortcuts,
  onTogglePin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white border border-[#E5E6EB] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#E5E6EB] flex items-center justify-between bg-[#FAFAFA]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-orange-50 border border-orange-200 text-[#FF6A00]">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">自定义快捷入口配置</h2>
              <p className="text-xs text-slate-500 mt-0.5">置顶或隐藏常用研发与治理快捷功能卡片</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of shortcuts with toggle pin */}
        <div className="p-4 overflow-y-auto space-y-2">
          {shortcuts.map((sc) => (
            <div
              key={sc.id}
              className="p-3 rounded-lg bg-[#FAFAFA] hover:bg-white border border-[#E5E6EB] flex items-center justify-between gap-3 hover:border-[#FF6A00] shadow-2xs transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-800">{sc.title}</span>
                  {sc.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-50 text-[#FF6A00] border border-orange-200 font-medium">
                      {sc.badge}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{sc.description}</div>
              </div>

              <button
                onClick={() => onTogglePin(sc.id)}
                className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  sc.pinned
                    ? 'bg-orange-50 text-[#FF6A00] border border-[#FF6A00]'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-[#D9D9D9]'
                }`}
              >
                <Pin className={`w-3 h-3 ${sc.pinned ? 'fill-[#FF6A00] text-[#FF6A00]' : ''}`} />
                <span>{sc.pinned ? '已固定' : '设为常用'}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#FAFAFA] border-t border-[#E5E6EB] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#FF6A00] hover:bg-[#FF7D1A] text-white text-xs font-medium shadow-xs transition-colors"
          >
            完成配置并保存
          </button>
        </div>
      </div>
    </div>
  );
};
