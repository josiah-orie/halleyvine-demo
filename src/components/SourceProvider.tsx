"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { resolveSource } from "@/lib/source";
import { trackEvent } from "@/lib/analytics";
import type { InterestValue } from "@/content/site";

// The source code is resolved once per page load (URL first, then sessionStorage) and cached.
let cachedSource: string | null | undefined;
function getClientSource(): string | null {
  if (cachedSource === undefined) {
    let storage: Storage | null = null;
    try {
      storage = window.sessionStorage;
    } catch {
      storage = null;
    }
    cachedSource = resolveSource(window.location.search, storage);
  }
  return cachedSource;
}
const getServerSource = () => null;
const noopSubscribe = () => () => {};

type Ctx = {
  source: string | null;
  interest: InterestValue | "";
  setInterest: (v: InterestValue | "") => void;
  /** Preselect an interest and scroll to the enquiry form. */
  goToEnquiry: (v?: InterestValue) => void;
};

const SourceContext = createContext<Ctx>({
  source: null,
  interest: "",
  setInterest: () => {},
  goToEnquiry: () => {},
});

export function SourceProvider({ children }: { children: ReactNode }) {
  const source = useSyncExternalStore(noopSubscribe, getClientSource, getServerSource);
  const [interest, setInterest] = useState<InterestValue | "">("");

  useEffect(() => {
    if (source) trackEvent("source_captured", { source });
  }, [source]);

  const goToEnquiry = useCallback((v?: InterestValue) => {
    if (v) setInterest(v);
    document.getElementById("enquiry")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const value = useMemo(() => ({ source, interest, setInterest, goToEnquiry }), [source, interest, goToEnquiry]);
  return <SourceContext.Provider value={value}>{children}</SourceContext.Provider>;
}

export const useSource = () => useContext(SourceContext);
