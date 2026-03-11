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
  const [mounted, setMounted] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    setMounted(true);

    const check = () => {
      try {
        setIsPro(!!localStorage.getItem(STORAGE_KEY));
      } catch {
        // localStorage unavailable (e.g., private browsing mode)
        setIsPro(false);
      }
    };
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
      try {
        localStorage.setItem(STORAGE_KEY, trimmed);
      } catch {
        // localStorage unavailable or quota exceeded
        return false;
      }
      window.dispatchEvent(new Event(SYNC_EVENT));
      return true;
    }
    return false;
  }, []);

  const deactivate = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage unavailable
    }
    window.dispatchEvent(new Event(SYNC_EVENT));
  }, []);

  // Only return isPro=true after client-side mount to prevent hydration mismatch
  return { isPro: mounted && isPro, activate, deactivate };
}
