"use client";

import React, { useRef, useEffect } from "react";

export default function EditorArea({
  content,
  onChange,
  settings,
  onCursorChange,
  editorRef,
  title,
}) {
  const lineNumbersRef = useRef(null);
  const isDark = settings?.theme === "dark";

  // Synchronize content into innerHTML when tab changes, but avoid re-rendering loop while typing
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content || "";
    }
  }, [content, editorRef]);

  // Track cursor and selection
  const updateCursorAndStats = () => {
    if (!editorRef.current) return;
    const sel = window.getSelection();
    let line = 1;
    let col = 1;

    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editorRef.current);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      const text = preCaretRange.toString();
      const lines = text.split("\n");
      line = lines.length;
      col = lines[lines.length - 1].length + 1;
    }

    const plainText = editorRef.current.innerText || editorRef.current.textContent || "";
    const words = plainText.trim() ? plainText.trim().split(/\s+/).filter(Boolean).length : 0;
    const chars = plainText.length;

    if (onCursorChange) {
      onCursorChange({
        line,
        col,
        wordCount: words,
        charCount: chars,
        plainText,
      });
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      updateCursorAndStats();
    }
  };

  // Tab key indentation
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const sel = window.getSelection();
      if (sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        const spaceNode = document.createTextNode("  ");
        range.insertNode(spaceNode);
        range.setStartAfter(spaceNode);
        range.setEndAfter(spaceNode);
        sel.removeAllRanges();
        sel.addRange(range);
        handleInput();
      }
    }
  };

  const handleScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const plainText = typeof window !== "undefined" && editorRef.current ? (editorRef.current.innerText || "") : "";
  const linesCount = Math.max(1, (plainText || content || "").split("\n").length);

  return (
    <div
      className={`flex-1 flex overflow-hidden relative transition-colors ${
        isDark ? "bg-[#1e1e1e]" : "bg-white"
      }`}
    >
      {/* Line Numbers Gutter (Hidden during Print) */}
      {settings.lineNumbers && (
        <div
          ref={lineNumbersRef}
          className={`no-print select-none text-right py-4 px-2.5 overflow-hidden transition-colors ${
            isDark
              ? "bg-[#1e1e1e] border-r border-[#2d2d2d] text-[#6e7681]"
              : "bg-[#f4f4f4] border-r border-[#e0e0e0] text-[#a0a0a0]"
          }`}
          style={{
            fontFamily: settings.fontFamily,
            fontSize: settings.fontSize,
            lineHeight: "1.6",
          }}
        >
          {Array.from({ length: linesCount }, (_, i) => (
            <div key={i + 1} className="leading-[1.6] text-xs font-mono">
              {i + 1}
            </div>
          ))}
        </div>
      )}

      {/* Editor & Printable Area */}
      <div className="flex-1 w-full h-full flex flex-col overflow-hidden">
        {/* Document Title (Shown only when printing) */}
        <div className="print-document-title">
          {title || "Untitled Document"}
        </div>

        {/* Rich Text contentEditable Area */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onKeyUp={updateCursorAndStats}
          onClick={updateCursorAndStats}
          onSelect={updateCursorAndStats}
          onScroll={handleScroll}
          spellCheck={false}
          className={`print-document-content flex-1 w-full h-full p-4 outline-none leading-[1.6] transition-colors ${
            isDark
              ? "bg-[#1e1e1e] text-[#d4d4d4] caret-[#007acc]"
              : "bg-white text-[#1e1e1e] caret-black"
          } ${
            settings.wordWrap ? "overflow-y-auto whitespace-pre-wrap" : "overflow-auto whitespace-pre"
          }`}
          style={{
            fontFamily: settings.fontFamily,
            fontSize: settings.fontSize,
            minHeight: "100%",
          }}
          data-placeholder="Type or paste code / text here..."
        />
      </div>
    </div>
  );
}
