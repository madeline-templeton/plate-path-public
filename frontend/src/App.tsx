import Home from "./pages/Home";
import "./styles/globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { PlannerProvider } from "./contexts/PlannerContext";

export default function App() {
  return (
    <AuthProvider>
      <PlannerProvider>
        <Home />
      </PlannerProvider>
    </AuthProvider>
  );
}
