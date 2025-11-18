import CalendarView from "../components/calendar/CalendarView.tsx";
import Sidebar from "../components/sidebar/Sidebar.tsx";

export default function Home() {
  return (
    <div style={{ display: "flex", gap: 16 }}>
      <Sidebar />
      <main style={{ flex: 1 }}>
        <h1>Home</h1>
        <CalendarView />
      </main>
    </div>
  );
}
