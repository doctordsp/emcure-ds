import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Navigate, useParams } from "react-router-dom";
import type { EmcureDesign } from "../domain/types";
import { getDesign, saveDesign } from "../persistence/storage";

type DesignContextValue = {
  design: EmcureDesign;
  saveState: "saved" | "error";
  update: (updater: (design: EmcureDesign) => EmcureDesign) => void;
};

const DesignContext = createContext<DesignContextValue | null>(null);

export function DesignProvider({ children }: { children: ReactNode }) {
  const { designId } = useParams();
  const [design, setDesign] = useState<EmcureDesign | null>(() =>
    designId ? getDesign(designId) : null,
  );
  const [saveState, setSaveState] = useState<"saved" | "error">("saved");

  const update = useCallback((updater: (current: EmcureDesign) => EmcureDesign) => {
    setDesign((current) => {
      if (!current) return current;
      try {
        const saved = saveDesign(updater(current));
        setSaveState("saved");
        return saved;
      } catch {
        setSaveState("error");
        return current;
      }
    });
  }, []);

  const value = useMemo(
    () => (design ? { design, saveState, update } : null),
    [design, saveState, update],
  );

  if (!design || !value) return <Navigate to="/" replace />;

  return <DesignContext.Provider value={value}>{children}</DesignContext.Provider>;
}

export function useDesign(): DesignContextValue {
  const value = useContext(DesignContext);
  if (!value) {
    throw new Error("useDesign must be used inside DesignProvider");
  }
  return value;
}
