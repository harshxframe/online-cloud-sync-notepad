"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  FolderOpen,
  Save,
  Printer,
  Scissors,
  Copy,
  Clipboard,
  Undo2,
  Redo2,
  Search,
  Maximize2,
  Minimize2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";

export const FONT_FAMILIES = [
  { label: "Consolas", value: "Consolas, 'Courier New', monospace" },
  { label: "Fira Code", value: "'Fira Code', 'Courier New', monospace" },
  { label: "Courier New", value: "Courier New, Courier, monospace" },
  { label: "Monaco", value: "Monaco, Menlo, 'Courier New', monospace" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "System UI", value: "system-ui, -apple-system, sans-serif" },
];

export const FONT_SIZES = [
  { label: "11px", value: "1" },
  { label: "12px", value: "2" },
  { label: "14px", value: "3" },
  { label: "16px", value: "4" },
  { label: "18px", value: "5" },
  { label: "24px", value: "6" },
  { label: "32px", value: "7" },
];

const TEXT_COLORS = [
  "#ffffff",
  "#d4d4d4",
  "#9cdcfe",
  "#4ec9b0",
  "#ce9178",
  "#dcdcaa",
  "#b5cea8",
  "#f43f5e",
  "#ec4899",
  "#8b5cf6",
  "#3b82f6",
  "#000000",
];

const HIGHLIGHT_COLORS = [
  "transparent",
  "#264f78",
  "#6b21a8",
  "#065f46",
  "#854d0e",
  "#881337",
  "#334155",
  "#fef08a",
];

export default function Toolbar({
  onNewTab,
  onOpenFile,
  onSave,
  onPrint,
  onCut,
  onCopy,
  onPaste,
  onUndo,
  onRedo,
  onFindReplace,
  onFormatCommand,
  onToggleFullscreen,
  isFullscreen,
  settings,
  onUpdateSettings,
}) {
  const isDark = settings?.theme === "dark";
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState(isDark ? "#ffffff" : "#000000");
  const [selectedHighlight, setSelectedHighlight] = useState("transparent");

  const colorRef = useRef(null);
  const highlightRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (colorRef.current && !colorRef.current.contains(e.target)) {
        setShowColorPicker(false);
      }
      if (highlightRef.current && !highlightRef.current.contains(e.target)) {
        setShowHighlightPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApplyColor = (color) => {
    setSelectedColor(color);
    setShowColorPicker(false);
    onFormatCommand("foreColor", color);
  };

  const handleApplyHighlight = (color) => {
    setSelectedHighlight(color);
    setShowHighlightPicker(false);
    onFormatCommand("hiliteColor", color);
  };

  const btnClass = `p-1.5 rounded border border-transparent transition-colors ${
    isDark
      ? "hover:bg-[#3a3d41] active:bg-[#45494e] hover:border-[#4e5157] text-[#cccccc]"
      : "hover:bg-[#e4e4e4] active:bg-[#d0d0d0] hover:border-[#cccccc] text-gray-700"
  }`;

  const dividerClass = `h-4 w-[1px] mx-1 ${isDark ? "bg-[#3e3e42]" : "bg-gray-300"}`;

  return (
    <div
      className={`no-print px-2 py-1 flex items-center flex-wrap gap-1 select-none text-xs transition-colors ${
        isDark
          ? "bg-[#2d2d2d] border-b border-[#3c3c3c] text-[#cccccc]"
          : "bg-[#f7f7f7] border-b border-[#d8d8d8] text-gray-700"
      }`}
    >
      {/* File Action Icons */}
      <button onClick={onNewTab} title="New Tab (Ctrl+N)" className={btnClass}>
        <FileText className="w-4 h-4 text-blue-400" />
      </button>

      <button onClick={onOpenFile} title="Open File (Ctrl+O)" className={btnClass}>
        <FolderOpen className="w-4 h-4 text-amber-500" />
      </button>

      <button onClick={onSave} title="Save (Ctrl+S)" className={btnClass}>
        <Save className="w-4 h-4 text-emerald-400" />
      </button>

      <button onClick={onPrint} title="Print (Ctrl+P)" className={btnClass}>
        <Printer className="w-4 h-4" />
      </button>

      <div className={dividerClass} />

      {/* Edit Action Icons */}
      <button onClick={onCut} title="Cut (Ctrl+X)" className={btnClass}>
        <Scissors className="w-4 h-4" />
      </button>

      <button onClick={onCopy} title="Copy (Ctrl+C)" className={btnClass}>
        <Copy className="w-4 h-4" />
      </button>

      <button onClick={onPaste} title="Paste (Ctrl+V)" className={btnClass}>
        <Clipboard className="w-4 h-4" />
      </button>

      <div className={dividerClass} />

      {/* Undo / Redo */}
      <button onClick={onUndo} title="Undo (Ctrl+Z)" className={btnClass}>
        <Undo2 className="w-4 h-4" />
      </button>

      <button onClick={onRedo} title="Redo (Ctrl+Y)" className={btnClass}>
        <Redo2 className="w-4 h-4" />
      </button>

      <div className={dividerClass} />

      {/* Binoculars / Find & Replace */}
      <button
        onClick={onFindReplace}
        title="Find & Replace (Ctrl+F)"
        className={btnClass}
      >
        <Search className="w-4 h-4 text-blue-400 font-bold" />
      </button>

      <div className={dividerClass} />

      {/* SELECTION STYLING CONTROLS */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          onFormatCommand("bold");
        }}
        title="Bold (Ctrl+B) on selection"
        className={btnClass}
      >
        <Bold className="w-3.5 h-3.5" />
      </button>

      <button
        onMouseDown={(e) => {
          e.preventDefault();
          onFormatCommand("italic");
        }}
        title="Italic (Ctrl+I) on selection"
        className={btnClass}
      >
        <Italic className="w-3.5 h-3.5" />
      </button>

      <button
        onMouseDown={(e) => {
          e.preventDefault();
          onFormatCommand("underline");
        }}
        title="Underline (Ctrl+U) on selection"
        className={btnClass}
      >
        <Underline className="w-3.5 h-3.5" />
      </button>

      <button
        onMouseDown={(e) => {
          e.preventDefault();
          onFormatCommand("strikeThrough");
        }}
        title="Strikethrough on selection"
        className={btnClass}
      >
        <Strikethrough className="w-3.5 h-3.5" />
      </button>

      <div className={dividerClass} />

      {/* TEXT COLOR PICKER (Applied to selection) */}
      <div className="relative" ref={colorRef}>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setShowColorPicker(!showColorPicker)}
          title="Text Color (applies to selected text)"
          className={`flex items-center gap-0.5 p-1 rounded border border-transparent transition-colors ${
            isDark ? "hover:bg-[#3a3d41] hover:border-[#4e5157]" : "hover:bg-[#e4e4e4] hover:border-[#cccccc]"
          }`}
        >
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold font-serif leading-none px-0.5">A</span>
            <span
              className="w-3.5 h-1 rounded-sm mt-0.5 shadow-xs"
              style={{ backgroundColor: selectedColor }}
            />
          </div>
          <ChevronDown className="w-2.5 h-2.5 opacity-60" />
        </button>

        {showColorPicker && (
          <div
            className={`absolute top-full left-0 mt-1 p-2 shadow-2xl rounded-md z-50 w-44 ${
              isDark ? "bg-[#252526] border border-[#454545] text-[#cccccc]" : "bg-white border border-gray-300 text-gray-800"
            }`}
          >
            <div className="text-[11px] font-semibold mb-1.5 opacity-80">
              Select Text Color:
            </div>
            <div className="grid grid-cols-6 gap-1.5 mb-2">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleApplyColor(c);
                  }}
                  className="w-5 h-5 rounded border border-gray-400 hover:scale-110 transition-transform shadow-xs"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5 pt-1.5 border-t border-gray-400/20">
              <span className="text-[10px] opacity-70">Custom:</span>
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => handleApplyColor(e.target.value)}
                className="w-6 h-6 p-0 border border-gray-400 rounded cursor-pointer bg-transparent"
                title="Choose custom color"
              />
            </div>
          </div>
        )}
      </div>

      {/* HIGHLIGHT COLOR (Applied to selection) */}
      <div className="relative" ref={highlightRef}>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setShowHighlightPicker(!showHighlightPicker)}
          title="Highlight Color (applies to selected text)"
          className={`flex items-center gap-0.5 p-1 rounded border border-transparent transition-colors ${
            isDark ? "hover:bg-[#3a3d41] hover:border-[#4e5157]" : "hover:bg-[#e4e4e4] hover:border-[#cccccc]"
          }`}
        >
          <div className="flex flex-col items-center">
            <Highlighter className="w-3.5 h-3.5" />
            <span
              className="w-3.5 h-1 rounded-sm mt-0.5"
              style={{
                backgroundColor:
                  selectedHighlight === "transparent" ? (isDark ? "#555555" : "#d1d5db") : selectedHighlight,
              }}
            />
          </div>
          <ChevronDown className="w-2.5 h-2.5 opacity-60" />
        </button>

        {showHighlightPicker && (
          <div
            className={`absolute top-full left-0 mt-1 p-2 shadow-2xl rounded-md z-50 w-44 ${
              isDark ? "bg-[#252526] border border-[#454545] text-[#cccccc]" : "bg-white border border-gray-300 text-gray-800"
            }`}
          >
            <div className="text-[11px] font-semibold mb-1.5 opacity-80">
              Highlight Color:
            </div>
            <div className="grid grid-cols-4 gap-1.5 mb-2">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleApplyHighlight(c);
                  }}
                  className="h-6 rounded border border-gray-400/40 text-[10px] flex items-center justify-center hover:scale-105 transition-transform"
                  style={{ backgroundColor: c === "transparent" ? (isDark ? "#333333" : "#f3f4f6") : c }}
                  title={c}
                >
                  {c === "transparent" ? "None" : ""}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={dividerClass} />

      {/* Font Family Dropdown */}
      <div className="flex items-center">
        <select
          onChange={(e) => {
            const font = e.target.value;
            onFormatCommand("fontName", font);
          }}
          className={`rounded px-2 py-1 text-xs focus:outline-none cursor-pointer min-w-[125px] transition-colors ${
            isDark
              ? "bg-[#3c3c3c] border border-[#555555] text-[#d4d4d4] focus:ring-1 focus:ring-blue-400"
              : "bg-white border border-[#c4c4c4] text-gray-800 focus:ring-1 focus:ring-blue-500"
          }`}
          title="Font Family (applies to selection)"
          defaultValue="Consolas, 'Courier New', monospace"
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size Dropdown */}
      <div className="flex items-center ml-1">
        <select
          onChange={(e) => {
            const size = e.target.value;
            onFormatCommand("fontSize", size);
          }}
          className={`rounded px-2 py-1 text-xs focus:outline-none cursor-pointer min-w-[70px] transition-colors ${
            isDark
              ? "bg-[#3c3c3c] border border-[#555555] text-[#d4d4d4] focus:ring-1 focus:ring-blue-400"
              : "bg-white border border-[#c4c4c4] text-gray-800 focus:ring-1 focus:ring-blue-500"
          }`}
          title="Font Size (applies to selection)"
          defaultValue="3"
        >
          {FONT_SIZES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className={dividerClass} />

      {/* Fullscreen Button */}
      <button
        onClick={onToggleFullscreen}
        title={isFullscreen ? "Exit Fullscreen (F11)" : "Fullscreen (F11)"}
        className={`${btnClass} ml-auto`}
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
