"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  FolderOpen,
  Save,
  Printer,
  FileDown,
  X,
  Undo2,
  Redo2,
  Scissors,
  Copy,
  Clipboard,
  Search,
  Check,
  Calendar,
  Code2,
  Maximize2,
  HelpCircle,
  LogIn,
  LogOut,
  User,
  Cloud,
  CloudOff,
  CloudUpload,
  Bold,
  Italic,
  Underline,
  Sun,
  Moon,
} from "lucide-react";

export default function MenuBar({
  onNewTab,
  onOpenFile,
  onSave,
  onExportPdf,
  onPrint,
  onCloseTab,
  onUndo,
  onRedo,
  onCut,
  onCopy,
  onPaste,
  onSelectAll,
  onClear,
  onFindReplace,
  onFormatCommand,
  onInsertText,
  settings,
  onUpdateSettings,
  onToggleFullscreen,
  isFullscreen,
  onOpenAuth,
  onOpenShortcuts,
  user,
  onLogout,
  syncStatus,
  isFirebaseReady,
}) {
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);
  const isDark = settings.theme === "dark";

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuClick = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleAction = (callback) => {
    setActiveMenu(null);
    if (callback) callback();
  };

  const toggleTheme = () => {
    onUpdateSettings({ theme: isDark ? "light" : "dark" });
  };

  return (
    <div
      ref={menuRef}
      className={`no-print select-none text-[13px] flex items-center justify-between px-2 py-0.5 relative z-50 transition-colors ${
        isDark
          ? "bg-[#252526] border-b border-[#333333] text-[#cccccc]"
          : "bg-[#f0f0f0] border-b border-[#d4d4d4] text-gray-800"
      }`}
    >
      {/* Left Menu Items */}
      <div className="flex items-center space-x-0.5">
        {/* FILE MENU */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick("file")}
            className={`px-2.5 py-1 rounded transition-colors ${
              isDark
                ? `hover:bg-[#37373d] ${activeMenu === "file" ? "bg-[#37373d]" : ""}`
                : `hover:bg-[#e0e0e0] ${activeMenu === "file" ? "bg-[#d0d0d0]" : ""}`
            }`}
          >
            File ▾
          </button>
          {activeMenu === "file" && (
            <div
              className={`absolute top-full left-0 mt-0.5 w-56 shadow-2xl rounded py-1 z-50 text-[13px] ${
                isDark
                  ? "bg-[#252526] border border-[#454545] text-[#cccccc]"
                  : "bg-white border border-[#c8c8c8] text-gray-800"
              }`}
            >
              <button
                onClick={() => handleAction(onNewTab)}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between ${
                  isDark ? "hover:bg-[#04395e] hover:text-white" : "hover:bg-[#e8f0fe] hover:text-[#1a73e8]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-blue-400" /> New Tab
                </span>
                <span className="text-gray-400 text-xs">Ctrl+N</span>
              </button>
              <button
                onClick={() => handleAction(onOpenFile)}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between ${
                  isDark ? "hover:bg-[#04395e] hover:text-white" : "hover:bg-[#e8f0fe] hover:text-[#1a73e8]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FolderOpen className="w-3.5 h-3.5 text-amber-500" /> Open File...
                </span>
                <span className="text-gray-400 text-xs">Ctrl+O</span>
              </button>
              <button
                onClick={() => handleAction(onSave)}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between ${
                  isDark ? "hover:bg-[#04395e] hover:text-white" : "hover:bg-[#e8f0fe] hover:text-[#1a73e8]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Save className="w-3.5 h-3.5 text-emerald-500" /> Save Document
                </span>
                <span className="text-gray-400 text-xs">Ctrl+S</span>
              </button>
              <div className={`my-1 border-t ${isDark ? "border-[#383838]" : "border-gray-200"}`} />
              <button
                onClick={() => handleAction(onExportPdf)}
                className={`w-full text-left px-3 py-1.5 flex items-center gap-2 ${
                  isDark ? "hover:bg-[#04395e] hover:text-white" : "hover:bg-[#e8f0fe] hover:text-[#1a73e8]"
                }`}
              >
                <FileDown className="w-3.5 h-3.5 text-red-500" /> Export to PDF
              </button>
              <button
                onClick={() => handleAction(onPrint)}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between ${
                  isDark ? "hover:bg-[#04395e] hover:text-white" : "hover:bg-[#e8f0fe] hover:text-[#1a73e8]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Printer className="w-3.5 h-3.5 text-gray-400" /> Print
                </span>
                <span className="text-gray-400 text-xs">Ctrl+P</span>
              </button>
              <div className={`my-1 border-t ${isDark ? "border-[#383838]" : "border-gray-200"}`} />
              <button
                onClick={() => handleAction(onCloseTab)}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between text-red-500 ${
                  isDark ? "hover:bg-[#4d1f24]" : "hover:bg-red-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <X className="w-3.5 h-3.5" /> Close Tab
                </span>
                <span className="text-xs opacity-75">Ctrl+W</span>
              </button>
            </div>
          )}
        </div>

        {/* EDIT MENU */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick("edit")}
            className={`px-2.5 py-1 rounded transition-colors ${
              isDark
                ? `hover:bg-[#37373d] ${activeMenu === "edit" ? "bg-[#37373d]" : ""}`
                : `hover:bg-[#e0e0e0] ${activeMenu === "edit" ? "bg-[#d0d0d0]" : ""}`
            }`}
          >
            Edit ▾
          </button>
          {activeMenu === "edit" && (
            <div
              className={`absolute top-full left-0 mt-0.5 w-52 shadow-2xl rounded py-1 z-50 text-[13px] ${
                isDark
                  ? "bg-[#252526] border border-[#454545] text-[#cccccc]"
                  : "bg-white border border-[#c8c8c8] text-gray-800"
              }`}
            >
              <button
                onClick={() => handleAction(onUndo)}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between ${
                  isDark ? "hover:bg-[#04395e]" : "hover:bg-[#e8f0fe]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Undo2 className="w-3.5 h-3.5" /> Undo
                </span>
                <span className="text-gray-400 text-xs">Ctrl+Z</span>
              </button>
              <button
                onClick={() => handleAction(onRedo)}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between ${
                  isDark ? "hover:bg-[#04395e]" : "hover:bg-[#e8f0fe]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Redo2 className="w-3.5 h-3.5" /> Redo
                </span>
                <span className="text-gray-400 text-xs">Ctrl+Y</span>
              </button>
              <div className={`my-1 border-t ${isDark ? "border-[#383838]" : "border-gray-200"}`} />
              <button
                onClick={() => handleAction(() => onFormatCommand("bold"))}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between font-bold ${
                  isDark ? "hover:bg-[#04395e]" : "hover:bg-[#e8f0fe]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Bold className="w-3.5 h-3.5" /> Bold Selection
                </span>
                <span className="text-gray-400 text-xs font-normal">Ctrl+B</span>
              </button>
              <button
                onClick={() => handleAction(() => onFormatCommand("italic"))}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between italic ${
                  isDark ? "hover:bg-[#04395e]" : "hover:bg-[#e8f0fe]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Italic className="w-3.5 h-3.5" /> Italic Selection
                </span>
                <span className="text-gray-400 text-xs font-normal">Ctrl+I</span>
              </button>
              <button
                onClick={() => handleAction(() => onFormatCommand("underline"))}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between underline ${
                  isDark ? "hover:bg-[#04395e]" : "hover:bg-[#e8f0fe]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Underline className="w-3.5 h-3.5" /> Underline Selection
                </span>
                <span className="text-gray-400 text-xs font-normal">Ctrl+U</span>
              </button>
              <div className={`my-1 border-t ${isDark ? "border-[#383838]" : "border-gray-200"}`} />
              <button
                onClick={() => handleAction(onCut)}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between ${
                  isDark ? "hover:bg-[#04395e]" : "hover:bg-[#e8f0fe]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Scissors className="w-3.5 h-3.5" /> Cut
                </span>
                <span className="text-gray-400 text-xs">Ctrl+X</span>
              </button>
              <button
                onClick={() => handleAction(onCopy)}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between ${
                  isDark ? "hover:bg-[#04395e]" : "hover:bg-[#e8f0fe]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Copy className="w-3.5 h-3.5" /> Copy
                </span>
                <span className="text-gray-400 text-xs">Ctrl+C</span>
              </button>
              <button
                onClick={() => handleAction(onPaste)}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between ${
                  isDark ? "hover:bg-[#04395e]" : "hover:bg-[#e8f0fe]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Clipboard className="w-3.5 h-3.5" /> Paste
                </span>
                <span className="text-gray-400 text-xs">Ctrl+V</span>
              </button>
              <div className={`my-1 border-t ${isDark ? "border-[#383838]" : "border-gray-200"}`} />
              <button
                onClick={() => handleAction(onFindReplace)}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between font-medium ${
                  isDark ? "hover:bg-[#04395e] text-blue-400" : "hover:bg-[#e8f0fe] text-blue-600"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5" /> Find & Replace
                </span>
                <span className="text-gray-400 text-xs">Ctrl+F</span>
              </button>
              <div className={`my-1 border-t ${isDark ? "border-[#383838]" : "border-gray-200"}`} />
              <button
                onClick={() => handleAction(onSelectAll)}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between ${
                  isDark ? "hover:bg-[#04395e]" : "hover:bg-[#e8f0fe]"
                }`}
              >
                <span>Select All</span>
                <span className="text-gray-400 text-xs">Ctrl+A</span>
              </button>
              <button
                onClick={() => handleAction(onClear)}
                className={`w-full text-left px-3 py-1.5 text-red-500 ${
                  isDark ? "hover:bg-[#4d1f24]" : "hover:bg-red-50"
                }`}
              >
                Clear Document
              </button>
            </div>
          )}
        </div>

        {/* INSERT MENU */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick("insert")}
            className={`px-2.5 py-1 rounded transition-colors ${
              isDark
                ? `hover:bg-[#37373d] ${activeMenu === "insert" ? "bg-[#37373d]" : ""}`
                : `hover:bg-[#e0e0e0] ${activeMenu === "insert" ? "bg-[#d0d0d0]" : ""}`
            }`}
          >
            Insert ▾
          </button>
          {activeMenu === "insert" && (
            <div
              className={`absolute top-full left-0 mt-0.5 w-52 shadow-2xl rounded py-1 z-50 text-[13px] ${
                isDark
                  ? "bg-[#252526] border border-[#454545] text-[#cccccc]"
                  : "bg-white border border-[#c8c8c8] text-gray-800"
              }`}
            >
              <button
                onClick={() => handleAction(() => onInsertText(new Date().toLocaleString()))}
                className={`w-full text-left px-3 py-1.5 flex items-center gap-2 ${
                  isDark ? "hover:bg-[#04395e]" : "hover:bg-[#e8f0fe]"
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-blue-400" /> Date & Time
              </button>
              <button
                onClick={() => handleAction(() => onInsertText(new Date().toISOString()))}
                className={`w-full text-left px-3 py-1.5 flex items-center gap-2 ${
                  isDark ? "hover:bg-[#04395e]" : "hover:bg-[#e8f0fe]"
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-green-400" /> ISO Timestamp
              </button>
              <div className={`my-1 border-t ${isDark ? "border-[#383838]" : "border-gray-200"}`} />
              <button
                onClick={() =>
                  handleAction(() =>
                    onInsertText('{\n  "title": "Example",\n  "status": "active",\n  "count": 1\n}')
                  )
                }
                className={`w-full text-left px-3 py-1.5 ${isDark ? "hover:bg-[#04395e]" : "hover:bg-[#e8f0fe]"}`}
              >
                Sample JSON Object
              </button>
              <button
                onClick={() =>
                  handleAction(() =>
                    onInsertText(
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    )
                  )
                }
                className={`w-full text-left px-3 py-1.5 ${isDark ? "hover:bg-[#04395e]" : "hover:bg-[#e8f0fe]"}`}
              >
                Lorem Ipsum Paragraph
              </button>
            </div>
          )}
        </div>

        {/* VIEW MENU */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick("view")}
            className={`px-2.5 py-1 rounded transition-colors ${
              isDark
                ? `hover:bg-[#37373d] ${activeMenu === "view" ? "bg-[#37373d]" : ""}`
                : `hover:bg-[#e0e0e0] ${activeMenu === "view" ? "bg-[#d0d0d0]" : ""}`
            }`}
          >
            View ▾
          </button>
          {activeMenu === "view" && (
            <div
              className={`absolute top-full left-0 mt-0.5 w-52 shadow-2xl rounded py-1 z-50 text-[13px] ${
                isDark
                  ? "bg-[#252526] border border-[#454545] text-[#cccccc]"
                  : "bg-white border border-[#c8c8c8] text-gray-800"
              }`}
            >
              <button
                onClick={() =>
                  handleAction(() =>
                    onUpdateSettings({ theme: isDark ? "light" : "dark" })
                  )
                }
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between ${
                  isDark ? "hover:bg-[#04395e]" : "hover:bg-[#e8f0fe]"
                }`}
              >
                <span className="flex items-center gap-2">
                  {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
                  <span>{isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}</span>
                </span>
              </button>
              <div className={`my-1 border-t ${isDark ? "border-[#383838]" : "border-gray-200"}`} />
              <button
                onClick={() =>
                  handleAction(() =>
                    onUpdateSettings({ wordWrap: !settings.wordWrap })
                  )
                }
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between ${
                  isDark ? "hover:bg-[#04395e]" : "hover:bg-[#e8f0fe]"
                }`}
              >
                <span>Word Wrap</span>
                {settings.wordWrap && <Check className="w-4 h-4 text-blue-400" />}
              </button>
              <button
                onClick={() =>
                  handleAction(() =>
                    onUpdateSettings({ lineNumbers: !settings.lineNumbers })
                  )
                }
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between ${
                  isDark ? "hover:bg-[#04395e]" : "hover:bg-[#e8f0fe]"
                }`}
              >
                <span>Line Numbers</span>
                {settings.lineNumbers && <Check className="w-4 h-4 text-blue-400" />}
              </button>
              <div className={`my-1 border-t ${isDark ? "border-[#383838]" : "border-gray-200"}`} />
              <button
                onClick={() => handleAction(onToggleFullscreen)}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between ${
                  isDark ? "hover:bg-[#04395e]" : "hover:bg-[#e8f0fe]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Maximize2 className="w-3.5 h-3.5" /> Fullscreen
                </span>
                <span className="text-gray-400 text-xs">F11</span>
              </button>
            </div>
          )}
        </div>

        {/* HELP MENU */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick("help")}
            className={`px-2.5 py-1 rounded transition-colors ${
              isDark
                ? `hover:bg-[#37373d] ${activeMenu === "help" ? "bg-[#37373d]" : ""}`
                : `hover:bg-[#e0e0e0] ${activeMenu === "help" ? "bg-[#d0d0d0]" : ""}`
            }`}
          >
            Help ▾
          </button>
          {activeMenu === "help" && (
            <div
              className={`absolute top-full left-0 mt-0.5 w-52 shadow-2xl rounded py-1 z-50 text-[13px] ${
                isDark
                  ? "bg-[#252526] border border-[#454545] text-[#cccccc]"
                  : "bg-white border border-[#c8c8c8] text-gray-800"
              }`}
            >
              <button
                onClick={() => handleAction(onOpenShortcuts)}
                className={`w-full text-left px-3 py-1.5 flex items-center gap-2 ${
                  isDark ? "hover:bg-[#04395e]" : "hover:bg-[#e8f0fe]"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" /> Keyboard Shortcuts
              </button>
              <div className={`my-1 border-t ${isDark ? "border-[#383838]" : "border-gray-200"}`} />
              <div className="px-3 py-1.5 text-xs text-gray-400">
                Web Notepad v1.1
                <div className="text-[11px] text-gray-500">Developer Dark Mode + Cloud Sync</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Theme Toggle, Cloud Sync & Account */}
      <div className="flex items-center gap-2">
        {/* Quick Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Theme" : "Switch to Dev Dark Theme"}
          className={`p-1 rounded transition-colors ${
            isDark ? "hover:bg-[#37373d] text-amber-400" : "hover:bg-[#e0e0e0] text-gray-600"
          }`}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Sync Status Badge with Error & Retry Support */}
        <button
          onClick={onSave}
          title={
            syncStatus === "error"
              ? "Sync failed. Click to retry!"
              : user
              ? "Click to sync to cloud now"
              : "Login to sync tabs to cloud"
          }
          className={`flex items-center gap-1.5 text-xs px-2 py-0.5 rounded shadow-sm border cursor-pointer transition-colors ${
            syncStatus === "error"
              ? "bg-red-950/40 border-red-500/50 text-red-400 hover:bg-red-900/60"
              : isDark
              ? "bg-[#1e1e1e] border-[#3e3e42] text-[#cccccc] hover:bg-[#2a2a2a]"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {syncStatus === "syncing" ? (
            <span className="flex items-center gap-1 text-amber-400">
              <CloudUpload className="w-3.5 h-3.5 animate-pulse" /> Syncing...
            </span>
          ) : syncStatus === "error" ? (
            <span className="flex items-center gap-1 text-red-400 font-semibold">
              <CloudOff className="w-3.5 h-3.5" /> Sync Failed (Retry)
            </span>
          ) : syncStatus === "synced" ? (
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Cloud className="w-3.5 h-3.5" /> Cloud Synced
            </span>
          ) : isFirebaseReady && user ? (
            <span className="flex items-center gap-1 text-blue-400">
              <Cloud className="w-3.5 h-3.5" /> Cloud Active
            </span>
          ) : (
            <span className="flex items-center gap-1 text-gray-400">
              <CloudOff className="w-3.5 h-3.5" /> Local Mode
            </span>
          )}
        </button>

        {/* User Account Button */}
        {user ? (
          <div
            className={`flex items-center gap-1 rounded px-2 py-0.5 border ${
              isDark ? "bg-[#1e1e1e] border-[#3e3e42]" : "bg-white border-gray-300"
            }`}
          >
            <User className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs max-w-[120px] truncate" title={user.email}>
              {user.displayName || user.email.split("@")[0]}
            </span>
            <button
              onClick={onLogout}
              className="ml-1 text-gray-400 hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 bg-[#007acc] hover:bg-[#0062a3] text-white text-xs px-2.5 py-1 rounded shadow-sm font-medium transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login / Sign Up</span>
          </button>
        )}
      </div>
    </div>
  );
}
