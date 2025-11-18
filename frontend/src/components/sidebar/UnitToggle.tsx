import { useState } from "react";
import type { Unit } from "../../types/models";

export default function UnitToggle() {
  const [unit, setUnit] = useState<Unit>("metric");
  return (
    <button onClick={() => setUnit(unit === "metric" ? "imperial" : "metric")}>
      {unit === "metric" ? "Metric" : "Imperial"}
    </button>
  );
}
