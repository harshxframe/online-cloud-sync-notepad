"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import MenuBar from "@/components/MenuBar";
import Toolbar from "@/components/Toolbar";
import TabBar from "@/components/TabBar";
import EditorArea from "@/components/EditorArea";
import StatusBar from "@/components/StatusBar";
import AuthModal from "@/components/AuthModal";
import FindReplaceModal from "@/components/FindReplaceModal";
import ShortcutsModal from "@/components/ShortcutsModal";
import {
  loadLocalData,
  saveLocalData,
  loadSettings,
  saveSettings,
  INITIAL_TABS,
  DEFAULT_SETTINGS,
} from "@/lib/storage";
import { exportTextToPdf } from "@/lib/exportPdf";
import {
  initFirebase,
  subscribeToAuth,
  logoutUser,
  syncTabsToCloud,
  fetchTabsFromCloud,
  subscribeToCloudTabs,
  isFirebaseConfigured,
} from "@/lib/firebase";

export default function NotepadPage() {
  // Direct initialization with defaults to avoid any blank or stuck loading states
  const [tabs, setTabs] = useState(INITIAL_TABS);
  const [activeTabId, setActiveTabId] = useState(INITIAL_TABS[0].id);

  // Reference to always have latest tabs in callbacks
  const tabsRef = useRef(tabs);
  const activeTabIdRef = useRef(activeTabId);

  useEffect(() => {
    tabsRef.current = tabs;
  }, [tabs]);

  useEffect(() => {
    activeTabIdRef.current = activeTabId;
  }, [activeTabId]);

  // Undo / Redo history
  const [history, setHistory] = useState({});

  // Settings (Default: dev-focused dark theme)
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // Cursor & stats tracking
  const [cursor, setCursor] = useState({
    line: 1,
    col: 1,
    wordCount: 0,
    charCount: 0,
    plainText: "",
  });

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState("");

  // User & Sync Status
  const [user, setUser] = useState(null);
  const [syncStatus, setSyncStatus] = useState("idle");
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  // Refs
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const syncTimeoutRef = useRef(null);
  const toastTimeoutRef = useRef(null);
  const isSelfUpdatingRef = useRef(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(""), 3000);
  };


  // Unique window/tab instance ID for cross-tab broadcast filtering
  const windowIdRef = useRef(null);
  const broadcastRef = useRef(null);

  useEffect(() => {
    windowIdRef.current = `win-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const bc = new BroadcastChannel("notepad_broadcast_sync");
      broadcastRef.current = bc;

      bc.onmessage = (e) => {
        if (
          e.data &&
          e.data.type === "TABS_UPDATED" &&
          e.data.senderId !== windowIdRef.current
        ) {
          if (Array.isArray(e.data.tabs) && e.data.tabs.length > 0) {
            setTabs(e.data.tabs);
          }
        }
      };

      return () => {
        bc.close();
      };
    }
  }, []);

  const broadcastTabs = (updatedTabs) => {
    if (broadcastRef.current) {
      try {
        broadcastRef.current.postMessage({
          type: "TABS_UPDATED",
          tabs: updatedTabs,
          senderId: windowIdRef.current,
        });
      } catch (e) {
        console.warn("BroadcastChannel error:", e);
      }
    }
  };

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    const local = loadLocalData();
    const storedSettings = loadSettings();
    setTabs(local.tabs);
    setActiveTabId(local.activeTabId);
    setSettings(storedSettings);
    tabsRef.current = local.tabs;
    activeTabIdRef.current = local.activeTabId;

    initFirebase();
    const configured = isFirebaseConfigured();
    setIsFirebaseReady(configured);

    // Multi-browser-tab local storage fallback sync
    const handleStorageChange = (e) => {
      if (e.key === "notepad_web_tabs_v2" && e.newValue) {
        try {
          const remote = JSON.parse(e.newValue);
          if (remote && Array.isArray(remote.tabs) && remote.tabs.length > 0) {
            setTabs(remote.tabs);
          }
        } catch (err) {
          console.error("Storage change sync error:", err);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // Auth state listener
    let cloudUnsub = null;
    const authUnsub = subscribeToAuth(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          setSyncStatus("syncing");
          const cloudData = await fetchTabsFromCloud(currentUser.uid);
          const currentLocalTabs = tabsRef.current;
          const currentLocalActiveId = activeTabIdRef.current;

          if (cloudData && Array.isArray(cloudData.tabs) && cloudData.tabs.length > 0) {
            // Smart Merge: Merge current local tabs with cloud tabs
            const cloudTabsMap = new Map(cloudData.tabs.map((t) => [t.id, t]));
            const merged = [...cloudData.tabs];

            currentLocalTabs.forEach((localTab) => {
              const existingCloudTab = cloudTabsMap.get(localTab.id);
              if (!existingCloudTab) {
                merged.push(localTab);
              } else if (
                (localTab.updatedAt || 0) > (existingCloudTab.updatedAt || 0) &&
                localTab.content !== existingCloudTab.content
              ) {
                const index = merged.findIndex((t) => t.id === localTab.id);
                if (index !== -1) merged[index] = localTab;
              }
            });

            const finalActiveId = currentLocalActiveId || cloudData.activeTabId || merged[0].id;
            setTabs(merged);
            setActiveTabId(finalActiveId);
            saveLocalData(merged, finalActiveId);

            // Sync merged state back to cloud
            await syncTabsToCloud(currentUser.uid, merged, finalActiveId);
            showToast(`Loaded & synced ${merged.length} tabs with Cloud`);
          } else {
            // First time cloud user: upload local tabs to cloud!
            await syncTabsToCloud(currentUser.uid, currentLocalTabs, currentLocalActiveId);
            showToast("Saved your tabs to your Cloud account!");
          }
          setSyncStatus("synced");

          // Subscribe to real-time changes across other browser tabs/devices
          if (cloudUnsub) cloudUnsub();
          cloudUnsub = subscribeToCloudTabs(currentUser.uid, (data) => {
            if (isSelfUpdatingRef.current) return;
            if (data && Array.isArray(data.tabs) && data.tabs.length > 0) {
              setTabs(data.tabs);
              saveLocalData(data.tabs, activeTabIdRef.current);
            }
          });
        } catch (err) {
          console.warn("Cloud tabs fetch/sync error:", err);
          setSyncStatus("error");
          if (err?.code === "permission-denied") {
            showToast("⚠️ Firestore Permission Denied: Allow read/write in Firebase Console Rules!");
          } else if (err?.code === "not-found") {
            showToast("⚠️ Firestore Database not created in Firebase Console yet!");
          } else {
            showToast(`⚠️ Cloud load failed: ${err.message || "Network issue"}`);
          }
        }
      } else {
        setSyncStatus("idle");
        if (cloudUnsub) cloudUnsub();
      }
    });

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      authUnsub();
      if (cloudUnsub) cloudUnsub();
    };
  }, []);

  // 2. Debounced save to LocalStorage, BroadcastChannel, and Firestore
  const triggerAutoSave = useCallback(
    (updatedTabs, targetActiveTabId) => {
      saveLocalData(updatedTabs, targetActiveTabId);
      broadcastTabs(updatedTabs);

      if (user) {
        setSyncStatus("syncing");
        if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = setTimeout(async () => {
          try {
            isSelfUpdatingRef.current = true;
            await syncTabsToCloud(user.uid, updatedTabs, targetActiveTabId);
            setSyncStatus("synced");
            setTimeout(() => {
              isSelfUpdatingRef.current = false;
            }, 600);
          } catch (err) {
            isSelfUpdatingRef.current = false;
            console.error("Cloud sync failed:", err);
            setSyncStatus("error");
            if (err?.code === "permission-denied") {
              showToast("⚠️ Firebase Error: Rules block writes! Please update Firestore Rules in Firebase Console.");
            } else {
              showToast(`⚠️ Cloud Sync failed: ${err.message || "Check network"}`);
            }
          }
        }, 800);
      }
    },
    [user]
  );

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0] || null;

  // Handle content change (HTML)
  const handleContentChange = (newContent) => {
    if (!activeTab) return;

    setHistory((prev) => {
      const tabHistory = prev[activeTab.id] || { past: [], future: [] };
      return {
        ...prev,
        [activeTab.id]: {
          past: [...tabHistory.past.slice(-30), activeTab.content],
          future: [],
        },
      };
    });

    const updated = tabs.map((t) =>
      t.id === activeTab.id
        ? { ...t, content: newContent, updatedAt: Date.now() }
        : t
    );
    setTabs(updated);
    triggerAutoSave(updated, activeTab.id);
  };

  // Selective Rich Text Formatting Command (Applies only to selected text!)
  const handleFormatCommand = (command, value = null) => {
    if (typeof window !== "undefined") {
      document.execCommand(command, false, value);
      if (editorRef.current) {
        const newHtml = editorRef.current.innerHTML;
        handleContentChange(newHtml);
      }
    }
  };

  // Undo / Redo
  const handleUndo = () => {
    if (typeof window !== "undefined") {
      document.execCommand("undo");
      if (editorRef.current) {
        handleContentChange(editorRef.current.innerHTML);
      }
    }
  };

  const handleRedo = () => {
    if (typeof window !== "undefined") {
      document.execCommand("redo");
      if (editorRef.current) {
        handleContentChange(editorRef.current.innerHTML);
      }
    }
  };

  // Tab Management
  const handleNewTab = () => {
    const newTabNum = tabs.length + 1;
    const newId = `tab-${Date.now()}`;
    const newTab = {
      id: newId,
      title: `Untitled-${newTabNum}.txt`,
      content: "",
      language: "plaintext",
      updatedAt: Date.now(),
    };
    const updated = [...tabs, newTab];
    setTabs(updated);
    setActiveTabId(newId);
    triggerAutoSave(updated, newId);
    showToast(`Created ${newTab.title}`);
  };

  const handleCloseTab = (tabIdToClose = activeTabId) => {
    if (tabs.length === 1) {
      const resetTab = {
        id: `tab-${Date.now()}`,
        title: "Untitled-1.txt",
        content: "",
        language: "plaintext",
        updatedAt: Date.now(),
      };
      setTabs([resetTab]);
      setActiveTabId(resetTab.id);
      triggerAutoSave([resetTab], resetTab.id);
      showToast("Reset to new tab");
      return;
    }

    const filtered = tabs.filter((t) => t.id !== tabIdToClose);
    let nextActive = activeTabId;
    if (activeTabId === tabIdToClose) {
      const closedIndex = tabs.findIndex((t) => t.id === tabIdToClose);
      const nextIndex = Math.max(0, closedIndex - 1);
      nextActive = filtered[nextIndex]?.id || filtered[0].id;
    }

    setTabs(filtered);
    setActiveTabId(nextActive);
    triggerAutoSave(filtered, nextActive);
  };

  const handleRenameTab = (tabId, newTitle) => {
    const updated = tabs.map((t) =>
      t.id === tabId ? { ...t, title: newTitle, updatedAt: Date.now() } : t
    );
    setTabs(updated);
    triggerAutoSave(updated, activeTabId);
    showToast(`Renamed tab to "${newTitle}"`);
  };

  // File Operations: Open File
  const handleOpenClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFilePicked = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target?.result;
      if (typeof fileContent === "string") {
        const newId = `tab-${Date.now()}`;
        const newTab = {
          id: newId,
          title: file.name,
          content: fileContent,
          language: file.name.endsWith(".json")
            ? "json"
            : file.name.endsWith(".md")
            ? "markdown"
            : "plaintext",
          updatedAt: Date.now(),
        };
        const updated = [...tabs, newTab];
        setTabs(updated);
        setActiveTabId(newId);
        triggerAutoSave(updated, newId);
        showToast(`Opened file: ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  // Save Document
  const handleSave = () => {
    if (!activeTab) return;
    saveLocalData(tabs, activeTabId);
    if (user) {
      setSyncStatus("syncing");
      syncTabsToCloud(user.uid, tabs, activeTabId)
        .then(() => {
          setSyncStatus("synced");
          showToast(`Saved "${activeTab.title}" to Cloud!`);
        })
        .catch(() => {
          setSyncStatus("error");
          showToast(`Saved locally (Cloud sync failed)`);
        });
    } else {
      showToast(`Saved "${activeTab.title}" locally!`);
    }
  };

  // Export to PDF
  const handleExportPdf = () => {
    if (!activeTab) return;
    try {
      showToast("Generating PDF...");
      exportTextToPdf({
        title: activeTab.title,
        content: activeTab.content,
        fontFamily: settings.fontFamily,
        fontSize: 10,
      });
      showToast(`PDF exported for "${activeTab.title}"!`);
    } catch (err) {
      console.error(err);
      showToast("Error generating PDF");
    }
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  // Clipboard operations
  const handleCut = () => {
    document.execCommand("cut");
    if (editorRef.current) {
      handleContentChange(editorRef.current.innerHTML);
    }
  };

  const handleCopy = () => {
    document.execCommand("copy");
    showToast("Copied to clipboard");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      document.execCommand("insertText", false, text);
      if (editorRef.current) {
        handleContentChange(editorRef.current.innerHTML);
      }
    } catch (e) {
      showToast("Use Ctrl+V to paste");
    }
  };

  const handleSelectAll = () => {
    if (editorRef.current) {
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear this document?")) {
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
      handleContentChange("");
    }
  };

  const handleInsertText = (snippet) => {
    document.execCommand("insertText", false, snippet);
    if (editorRef.current) {
      handleContentChange(editorRef.current.innerHTML);
    }
  };

  // Fullscreen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Update Settings
  const handleUpdateSettings = (newSettings) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    saveSettings(merged);
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (isCmdOrCtrl && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      } else if (isCmdOrCtrl && e.key.toLowerCase() === "n") {
        e.preventDefault();
        handleNewTab();
      } else if (isCmdOrCtrl && e.key.toLowerCase() === "o") {
        e.preventDefault();
        handleOpenClick();
      } else if (isCmdOrCtrl && e.key.toLowerCase() === "p") {
        e.preventDefault();
        handlePrint();
      } else if (isCmdOrCtrl && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setIsFindReplaceOpen((prev) => !prev);
      } else if (isCmdOrCtrl && e.key.toLowerCase() === "w") {
        e.preventDefault();
        handleCloseTab();
      } else if (isCmdOrCtrl && e.key.toLowerCase() === "b") {
        e.preventDefault();
        handleFormatCommand("bold");
      } else if (isCmdOrCtrl && e.key.toLowerCase() === "i") {
        e.preventDefault();
        handleFormatCommand("italic");
      } else if (isCmdOrCtrl && e.key.toLowerCase() === "u") {
        e.preventDefault();
        handleFormatCommand("underline");
      } else if (e.key === "F11") {
        e.preventDefault();
        handleToggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setSyncStatus("idle");
    showToast("Signed out. Switched to Local Mode.");
  };

  const isDark = settings?.theme === "dark";

  return (
    <main
      className={`flex flex-col h-screen w-screen overflow-hidden transition-colors ${
        isDark ? "bg-[#1e1e1e] text-[#d4d4d4]" : "bg-white text-gray-900"
      }`}
    >
      {/* Hidden File Input for Open */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.json,.md,.js,.jsx,.ts,.tsx,.html,.css,.csv,.xml,.log,.py,.sh,.yaml,.yml"
        className="hidden"
        onChange={handleFilePicked}
      />

      {/* Top Menu Bar */}
      <MenuBar
        onNewTab={handleNewTab}
        onOpenFile={handleOpenClick}
        onSave={handleSave}
        onExportPdf={handleExportPdf}
        onPrint={handlePrint}
        onCloseTab={() => handleCloseTab(activeTabId)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onCut={handleCut}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onSelectAll={handleSelectAll}
        onClear={handleClear}
        onFindReplace={() => setIsFindReplaceOpen(true)}
        onFormatCommand={handleFormatCommand}
        onInsertText={handleInsertText}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onToggleFullscreen={handleToggleFullscreen}
        isFullscreen={isFullscreen}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        user={user}
        onLogout={handleLogout}
        syncStatus={syncStatus}
        isFirebaseReady={isFirebaseReady}
      />

      {/* Quick Action Toolbar with Selection Styling, Colors & Dark Theme */}
      <Toolbar
        onNewTab={handleNewTab}
        onOpenFile={handleOpenClick}
        onSave={handleSave}
        onPrint={handlePrint}
        onCut={handleCut}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onFindReplace={() => setIsFindReplaceOpen(true)}
        onFormatCommand={handleFormatCommand}
        onToggleFullscreen={handleToggleFullscreen}
        isFullscreen={isFullscreen}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Multi-Tab Bar (Double click tab to rename) */}
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={(id) => setActiveTabId(id)}
        onNewTab={handleNewTab}
        onCloseTab={handleCloseTab}
        onRenameTab={handleRenameTab}
        settings={settings}
      />

      {/* Editor Content Area (Rich Text / Selective Formatting) */}
      <EditorArea
        content={activeTab?.content || ""}
        onChange={handleContentChange}
        settings={settings}
        onCursorChange={setCursor}
        editorRef={editorRef}
        title={activeTab?.title}
      />

      {/* Bottom Status Bar */}
      <StatusBar
        content={activeTab?.content || ""}
        cursor={cursor}
        syncStatus={syncStatus}
        isLoggedIn={!!user}
        settings={settings}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div
          className={`fixed bottom-10 right-6 z-50 text-xs px-3.5 py-2 rounded shadow-xl border animate-in fade-in duration-200 ${
            isDark
              ? "bg-[#252526] text-white border-[#454545]"
              : "bg-[#1e293b] text-white border-slate-700"
          }`}
        >
          {toastMessage}
        </div>
      )}

      {/* Find & Replace Modal */}
      <FindReplaceModal
        isOpen={isFindReplaceOpen}
        onClose={() => setIsFindReplaceOpen(false)}
        content={activeTab?.content || ""}
        onUpdateContent={handleContentChange}
        editorRef={editorRef}
        settings={settings}
      />

      {/* Auth Modal (Login / Sign Up) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(loggedUser) => {
          setUser(loggedUser);
          showToast(`Welcome back, ${loggedUser.displayName || loggedUser.email}!`);
        }}
        settings={settings}
      />

      {/* Keyboard Shortcuts Cheatsheet */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        settings={settings}
      />
    </main>
  );
}
