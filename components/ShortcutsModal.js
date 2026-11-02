"use client";

import React from "react";
import { X, Keyboard } from "lucide-react";

export default function ShortcutsModal({ isOpen, onClose, settings }) {
  if (!isOpen) return null;

  const isDark = settings?.theme === "dark";

  const shortcuts = [
    { key: "Ctrl + N / Cmd + N", action: "Open a new blank tab" },
    { key: "Ctrl + O / Cmd + O", action: "Open a local text/JSON file" },
    { key: "Ctrl + S / Cmd + S", action: "Save current document to cloud / local" },
    { key: "Ctrl + B / Cmd + B", action: "Bold selected text" },
    { key: "Ctrl + I / Cmd + I", action: "Italicize selected text" },
    { key: "Ctrl + U / Cmd + U", action: "Underline selected text" },
    { key: "Ctrl + P / Cmd + P", action: "Print current document" },
    { key: "Ctrl + F / Cmd + F", action: "Open Find & Replace dialog" },
    { key: "Ctrl + Z / Cmd + Z", action: "Undo last edit" },
    { key: "Ctrl + Y / Cmd + Shift + Z", action: "Redo last edit" },
    { key: "Ctrl + W / Cmd + W", action: "Close current tab" },
    { key: "Tab", action: "Insert 2 spaces (indentation)" },
    { key: "F11", action: "Toggle Fullscreen mode" },
    { key: "Double click on tab", action: "Rename active tab" },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div
        className={`rounded-lg shadow-2xl border w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
          isDark
            ? "bg-[#252526] border-[#454545] text-[#cccccc]"
            : "bg-white border-gray-200 text-gray-800"
        }`}
      >
        <div
          className={`px-5 py-3.5 flex items-center justify-between border-b ${
            isDark ? "bg-[#1e1e1e] border-[#333333]" : "bg-[#f5f5f5] border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-sm">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`rounded p-1 transition-colors ${
              isDark ? "text-gray-400 hover:text-white hover:bg-[#333333]" : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2 text-xs max-h-[70vh] overflow-y-auto">
          <div className={`divide-y ${isDark ? "divide-[#333333]" : "divide-gray-100"}`}>
            {shortcuts.map((s, idx) => (
              <div
                key={idx}
                className="py-2 flex items-center justify-between"
              >
                <span>{s.action}</span>
                <kbd
                  className={`px-2 py-0.5 rounded text-[11px] font-mono shadow-xs border ${
                    isDark
                      ? "bg-[#1e1e1e] border-[#3e3e42] text-blue-300"
                      : "bg-gray-100 border-gray-300 text-gray-800"
                  }`}
                >
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>

          <div className={`pt-3 text-center border-t ${isDark ? "border-[#333333]" : "border-gray-100"}`}>
            <button
              onClick={onClose}
              className={`px-4 py-1.5 rounded font-medium text-xs transition-colors ${
                isDark
                  ? "bg-[#333333] hover:bg-[#3e3e42] text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
