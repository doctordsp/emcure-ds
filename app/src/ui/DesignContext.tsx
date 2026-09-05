import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import type { EmcureDesign } from "../domain/types";
import { getDesign, saveDesign } from "../persistence/storage";

type DesignContextValue = {
  design: EmcureDesign;
  saveState: "saved" | "saving" | "error";
  update: (updater: (design: EmcureDesign) => EmcureDesign) => void;
};

const DesignContext = createContext<DesignContextValue | null>(null);

function mergeSavedAssets(latest: EmcureDesign, saved: EmcureDesign): EmcureDesign {
  return {
    ...latest,
    updatedAt: saved.updatedAt,
    card: latest.card
      ? {
          ...latest.card,
          featuredImagePath: saved.card?.featuredImagePath ?? latest.card.featuredImagePath,
          featuredImageDataUrl: saved.card?.featuredImagePath
            ? undefined
            : latest.card.featuredImageDataUrl,
        }
      : saved.card,
    distributionDocuments: (latest.distributionDocuments ?? []).map((doc) => {
      const match = saved.distributionDocuments?.find((item) => item.id === doc.id);
      if (!match) return doc;
      return {
        ...doc,
        storagePath: match.storagePath ?? doc.storagePath,
        dataUrl: match.storagePath ? undefined : doc.dataUrl,
      };
    }),
  };
}

export function DesignProvider({ children }: { children: ReactNode }) {
  const { designId } = useParams();
  const { ready } = useAuth();
  const [design, setDesign] = useState<EmcureDesign | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "missing" | "ready">("loading");
  const [saveState, setSaveState] = useState<"saved" | "saving" | "error">("saved");
  const persistChain = useRef(Promise.resolve());

  useEffect(() => {
    if (!ready || !designId) return;
    let cancelled = false;
    setLoadState("loading");
    void getDesign(designId).then((found) => {
      if (cancelled) return;
      if (found) {
        setDesign(found);
        setLoadState("ready");
      } else {
        setDesign(null);
        setLoadState("missing");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [designId, ready]);

  const update = useCallback((updater: (current: EmcureDesign) => EmcureDesign) => {
    setDesign((current) => {
      if (!current) return current;
      const next = updater(current);
      setSaveState("saving");
      persistChain.current = persistChain.current
        .then(() => saveDesign(next))
        .then((saved) => {
          setSaveState("saved");
          setDesign((latest) => {
            if (!latest || latest.id !== saved.id) return latest;
            return mergeSavedAssets(latest, saved);
          });
        })
        .catch(() => {
          setSaveState("error");
        });
      return next;
    });
  }, []);

  const value = useMemo(
    () => (design ? { design, saveState, update } : null),
    [design, saveState, update],
  );

  if (!ready || loadState === "loading") {
    return (
      <div className="page-loading">
        <p>Loading EM-CURE…</p>
      </div>
    );
  }

  if (loadState === "missing" || !design || !value) {
    return <Navigate to="/" replace />;
  }

  return <DesignContext.Provider value={value}>{children}</DesignContext.Provider>;
}

export function useDesign(): DesignContextValue {
  const value = useContext(DesignContext);
  if (!value) {
    throw new Error("useDesign must be used inside DesignProvider");
  }
  return value;
}
