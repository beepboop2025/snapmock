"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "snapmock_pro_license";
const SYNC_EVENT = "snapmock-license-change";

/**
 * Manages Pro license state across all components.
 * Uses localStorage for persistence and custom events for cross-component sync.
 * When one component activates a license, all others update instantly.
 */
export function useLicense() {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const check = () => setIsPro(!!localStorage.getItem(STORAGE_KEY));
    check();

    // Sync across components in the same tab
    window.addEventListener(SYNC_EVENT, check);
    // Sync across tabs
    window.addEventListener("storage", check);

    return () => {
      window.removeEventListener(SYNC_EVENT, check);
      window.removeEventListener("storage", check);
    };
  }, []);

  const activate = useCallback((key: string): boolean => {
    const trimmed = key.trim();
    if (trimmed.length >= 8) {
      localStorage.setItem(STORAGE_KEY, trimmed);
      window.dispatchEvent(new Event(SYNC_EVENT));
      return true;
    }
    return false;
  }, []);

  const deactivate = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(SYNC_EVENT));
  }, []);

  return { isPro, activate, deactivate };
}
