import './App.css'
import "./styles/globals.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext";
import { PlannerProvider } from "./contexts/PlannerContext";
import Home from "./pages/Home";
import Login from "./pages/login/Login";
import Calendar from './pages/Calendar/Calendar';
import GeneratePlan from './pages/GeneratePlan/GeneratePlan';
import Account from './pages/Account/Account';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlannerProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/generate-plan" element={<GeneratePlan />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </PlannerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
