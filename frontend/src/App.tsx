import './App.css'
import "./styles/globals.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext";
import { PlannerProvider } from "./contexts/PlannerContext";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/Home";
import Login from "./pages/login/Login";
import OurStory from './pages/OurStory/OurStory';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlannerProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/story" element={<OurStory/>} />
          </Routes>
        </PlannerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
