"use client";

import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";

export default function FindReplaceModal({
  isOpen,
  onClose,
  content,
  onUpdateContent,
  editorRef,
  settings,
}) {
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [matchCase, setMatchCase] = useState(false);
  const [matchInfo, setMatchInfo] = useState("");
  const isDark = settings?.theme === "dark";

  useEffect(() => {
    if (!findText) {
      setMatchInfo("");
      return;
    }
    const plainText = editorRef?.current?.innerText || content || "";
    const regex = new RegExp(
      findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      matchCase ? "g" : "gi"
    );
    const matches = plainText.match(regex);
    const count = matches ? matches.length : 0;
    setMatchInfo(count === 1 ? "1 match found" : `${count} matches found`);
  }, [findText, matchCase, content, editorRef]);

  if (!isOpen) return null;

  const handleFindNext = () => {
    if (!findText) return;
    if (typeof window !== "undefined" && window.find) {
      const found = window.find(findText, matchCase, false, true);
      if (found) {
        setMatchInfo("Match found");
      } else {
        setMatchInfo("No matches found");
      }
    }
  };

  const handleReplace = () => {
    if (!findText) return;
    const sel = window.getSelection();
    if (sel && sel.toString()) {
      const selectedStr = sel.toString();
      const matches = matchCase
        ? selectedStr === findText
        : selectedStr.toLowerCase() === findText.toLowerCase();

      if (matches) {
        document.execCommand("insertText", false, replaceText);
        if (editorRef?.current) {
          onUpdateContent(editorRef.current.innerHTML);
        }
        handleFindNext();
        return;
      }
    }
    handleFindNext();
  };

  const handleReplaceAll = () => {
    if (!findText || !editorRef?.current) return;
    const regex = new RegExp(
      findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      matchCase ? "g" : "gi"
    );
    const currentHtml = editorRef.current.innerHTML;
    const matches = currentHtml.match(regex);
    const count = matches ? matches.length : 0;
    if (count > 0) {
      const newHtml = currentHtml.replace(regex, replaceText);
      editorRef.current.innerHTML = newHtml;
      onUpdateContent(newHtml);
      setMatchInfo(`Replaced ${count} occurrence${count > 1 ? "s" : ""}`);
    } else {
      setMatchInfo("No matches to replace");
    }
  };

  return (
    <div
      className={`fixed top-24 right-8 z-50 shadow-2xl rounded-lg w-80 text-xs select-none animate-in fade-in duration-100 border ${
        isDark
          ? "bg-[#252526] border-[#454545] text-[#cccccc]"
          : "bg-white border-[#c0c0c0] text-gray-800"
      }`}
    >
      <div
        className={`px-3 py-2 flex items-center justify-between rounded-t-lg border-b ${
          isDark ? "bg-[#1e1e1e] border-[#333333]" : "bg-[#f2f2f2] border-[#d8d8d8]"
        }`}
      >
        <div className="flex items-center gap-1.5 font-semibold">
          <Search className="w-3.5 h-3.5 text-blue-400" />
          <span>Find & Replace</span>
        </div>
        <button
          onClick={onClose}
          className={`p-0.5 rounded transition-colors ${
            isDark ? "text-gray-400 hover:text-white hover:bg-[#333333]" : "text-gray-400 hover:text-gray-700 hover:bg-gray-200"
          }`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3 space-y-2.5">
        <div>
          <label className="block text-[11px] font-medium mb-1 opacity-80">
            Find:
          </label>
          <input
            type="text"
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFindNext()}
            placeholder="Search string..."
            className={`w-full px-2 py-1 rounded outline-none border text-xs ${
              isDark
                ? "bg-[#1e1e1e] border-[#3e3e42] text-white focus:border-blue-400"
                : "bg-white border-gray-300 text-gray-800 focus:border-blue-500"
            }`}
            autoFocus
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium mb-1 opacity-80">
            Replace with:
          </label>
          <input
            type="text"
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleReplace()}
            placeholder="Replacement string..."
            className={`w-full px-2 py-1 rounded outline-none border text-xs ${
              isDark
                ? "bg-[#1e1e1e] border-[#3e3e42] text-white focus:border-blue-400"
                : "bg-white border-gray-300 text-gray-800 focus:border-blue-500"
            }`}
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-1.5 cursor-pointer opacity-80">
            <input
              type="checkbox"
              checked={matchCase}
              onChange={(e) => setMatchCase(e.target.checked)}
              className="rounded text-blue-500"
            />
            <span>Match case</span>
          </label>
          {matchInfo && (
            <span className="text-[11px] text-blue-400 font-medium">
              {matchInfo}
            </span>
          )}
        </div>

        <div className={`grid grid-cols-3 gap-1.5 pt-2 border-t ${isDark ? "border-[#333333]" : "border-gray-100"}`}>
          <button
            onClick={handleFindNext}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              isDark ? "bg-[#333333] hover:bg-[#3e3e42] text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
          >
            Find Next
          </button>
          <button
            onClick={handleReplace}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              isDark ? "bg-[#333333] hover:bg-[#3e3e42] text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
          >
            Replace
          </button>
          <button
            onClick={handleReplaceAll}
            className="px-2 py-1 bg-[#007acc] hover:bg-[#0062a3] text-white rounded text-[11px] font-medium transition-colors"
          >
            Replace All
          </button>
        </div>
      </div>
    </div>
  );
}
