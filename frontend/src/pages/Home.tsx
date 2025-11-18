import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import CalendarView from "../components/calendar/CalendarView";
import Sidebar from "../components/sidebar/Sidebar";
import "./Home.css";

export default function Home() {
  return (
    <div className="app-container">
      <Header />
      
      <div className="main-content">
        <CalendarView />
        <Sidebar />
      </div>
      
      <Footer />
    </div>
  );
}
