"use client";

import React from "react";

export default function StatusBar({
  content = "",
  cursor = { line: 1, col: 1, wordCount: 0, charCount: 0 },
  syncStatus,
  isLoggedIn,
  settings,
}) {
  const isDark = settings?.theme === "dark";

  return (
    <div
      className={`no-print px-4 py-1 text-xs flex items-center justify-between select-none transition-colors ${
        isDark
          ? "bg-[#007acc] text-white font-mono text-[11px]"
          : "bg-[#f0f0f0] border-t border-[#d4d4d4] text-gray-600"
      }`}
    >
      {/* Left Details */}
      <div className="flex items-center space-x-6">
        <div>
          Ln {cursor.line}, Col {cursor.col}
        </div>
        <div>{cursor.charCount || 0} characters</div>
        <div>UTF-8</div>
        <div className="flex items-center gap-1.5">
          {isLoggedIn ? (
            syncStatus === "syncing" ? (
              <span className={`flex items-center gap-1 ${isDark ? "text-amber-200" : "text-amber-600"}`}>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                Syncing to Cloud...
              </span>
            ) : (
              <span className={`flex items-center gap-1 ${isDark ? "text-emerald-200" : "text-emerald-700"}`}>
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                Cloud Active
              </span>
            )
          ) : (
            <span className={`flex items-center gap-1 ${isDark ? "text-blue-100" : "text-gray-500"}`}>
              <span className={`w-2 h-2 rounded-full inline-block ${isDark ? "bg-blue-300" : "bg-gray-400"}`} />
              Local Storage
            </span>
          )}
        </div>
      </div>

      {/* Right Details */}
      <div className="font-medium">
        Words: {cursor.wordCount || 0}
      </div>
    </div>
  );
}
