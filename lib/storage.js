// LocalStorage management for tabs and editor preferences

const STORAGE_KEY = "notepad_web_tabs_v2";
const SETTINGS_KEY = "notepad_web_settings_v1";

export const INITIAL_TABS = [
  {
    id: "tab-1",
    title: "untitled.txt",
    content: "Happy Coding! 🚀\n\n",
    language: "plaintext",
    updatedAt: Date.now(),
  },
];

export const DEFAULT_SETTINGS = {
  fontFamily: "Consolas, 'Courier New', monospace",
  fontSize: "14px",
  wordWrap: true,
  lineNumbers: true,
  theme: "dark", // Developer dark theme by default
};

export function loadLocalData() {
  if (typeof window === "undefined") {
    return { tabs: INITIAL_TABS, activeTabId: INITIAL_TABS[0].id };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { tabs: INITIAL_TABS, activeTabId: INITIAL_TABS[0].id };
    }
    const data = JSON.parse(raw);
    if (data && Array.isArray(data.tabs) && data.tabs.length > 0) {
      return {
        tabs: data.tabs,
        activeTabId: data.activeTabId || data.tabs[0].id,
      };
    }
  } catch (e) {
    console.error("Failed to load local tabs:", e);
  }

  return { tabs: INITIAL_TABS, activeTabId: INITIAL_TABS[0].id };
}

export function saveLocalData(tabs, activeTabId) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        tabs,
        activeTabId,
        savedAt: Date.now(),
      })
    );
  } catch (e) {
    console.error("Failed to save local tabs:", e);
  }
}

export function loadSettings() {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error("Failed to load settings:", e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save settings:", e);
  }
}
