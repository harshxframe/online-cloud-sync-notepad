"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, X, Edit2, Check } from "lucide-react";

export default function TabBar({
  tabs,
  activeTabId,
  onSelectTab,
  onNewTab,
  onCloseTab,
  onRenameTab,
  settings,
}) {
  const [editingTabId, setEditingTabId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const inputRef = useRef(null);
  const isDark = settings?.theme === "dark";

  useEffect(() => {
    if (editingTabId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingTabId]);

  const startRename = (tab, e) => {
    e.stopPropagation();
    setEditingTabId(tab.id);
    setEditTitle(tab.title);
  };

  const handleRenameSubmit = (tabId) => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed.length > 0) {
      onRenameTab(tabId, trimmed);
    }
    setEditingTabId(null);
  };

  const handleKeyDown = (e, tabId) => {
    if (e.key === "Enter") {
      handleRenameSubmit(tabId);
    } else if (e.key === "Escape") {
      setEditingTabId(null);
    }
  };

  return (
    <div
      className={`no-print px-1 pt-1 flex items-center overflow-x-auto select-none no-scrollbar transition-colors ${
        isDark
          ? "bg-[#252526] border-b border-[#1e1e1e]"
          : "bg-[#e8e8e8] border-b border-[#c8c8c8]"
      }`}
    >
      <div className="flex items-center space-x-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const isEditing = editingTabId === tab.id;

          let tabStyle = "";
          if (isDark) {
            tabStyle = isActive
              ? "bg-[#1e1e1e] border-t-2 border-t-[#007acc] text-white font-medium shadow-sm -mb-[1px] pb-2 z-10 border-l border-r border-[#333333]"
              : "bg-[#2d2d2d] hover:bg-[#353535] text-[#969696] hover:text-[#cccccc] border-t-2 border-t-transparent";
          } else {
            tabStyle = isActive
              ? "bg-white border-[#c8c8c8] text-gray-900 font-medium shadow-sm -mb-[1px] pb-2 z-10 border-t border-l border-r"
              : "bg-[#dedede] hover:bg-[#eaeaea] border-transparent text-gray-600 border-t";
          }

          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              onDoubleClick={(e) => startRename(tab, e)}
              className={`group flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-t transition-all cursor-pointer relative max-w-[200px] ${tabStyle}`}
              title="Double click to rename tab"
            >
              {isEditing ? (
                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, tab.id)}
                    onBlur={() => handleRenameSubmit(tab.id)}
                    className={`w-24 px-1 py-0.5 text-xs rounded outline-none border ${
                      isDark
                        ? "bg-[#2a2a2a] text-white border-[#007acc]"
                        : "bg-white text-gray-800 border-blue-500"
                    }`}
                  />
                  <button
                    onClick={() => handleRenameSubmit(tab.id)}
                    className="p-0.5 text-blue-400 hover:bg-blue-900/30 rounded"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="truncate">{tab.title}</span>
                  <button
                    onClick={(e) => startRename(tab, e)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-blue-400 text-gray-400 rounded transition-opacity"
                    title="Rename Tab"
                  >
                    <Edit2 className="w-2.5 h-2.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(tab.id);
                    }}
                    className={`p-0.5 rounded transition-colors ml-1 ${
                      isDark
                        ? "hover:bg-[#383838] hover:text-red-400 text-gray-500"
                        : "hover:bg-gray-200 hover:text-red-600 text-gray-400"
                    }`}
                    title="Close Tab"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          );
        })}

        {/* Add Tab Button */}
        <button
          onClick={onNewTab}
          className={`p-1 rounded transition-colors mb-0.5 ${
            isDark
              ? "hover:bg-[#333333] text-[#969696] hover:text-white"
              : "hover:bg-[#d0d0d0] text-gray-600 hover:text-gray-900"
          }`}
          title="New Tab (Ctrl+N)"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
