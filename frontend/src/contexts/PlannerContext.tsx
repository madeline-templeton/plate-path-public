import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Event } from "../types/models";
// get the planner currently saved
type PlannerContextValue = {
  events: Event[];
  setEvents: (e: Event[]) => void;
};

const PlannerContext = createContext<PlannerContextValue | undefined>(
  undefined
);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const value = useMemo(() => ({ events, setEvents }), [events]);
  return (
    <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>
  );
}

export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error("usePlanner must be used within PlannerProvider");
  return ctx;
}
