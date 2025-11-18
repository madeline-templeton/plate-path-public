import './App.css'
import "./styles/globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { PlannerProvider } from "./contexts/PlannerContext";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import CalendarView from "./components/calendar/CalendarView";
import Sidebar from "./components/sidebar/Sidebar";

export default function App() {
  return (
    <AuthProvider>
      <PlannerProvider>
        <div className="app-container">
          <Header />
          
          <div className="main-content">
            <CalendarView />
            <Sidebar />
          </div>
          
          <Footer />
        </div>
      </PlannerProvider>
    </AuthProvider>
  );
}
