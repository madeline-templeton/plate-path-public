import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import OurStory from "./OurStory/OurStory";
import "./Home.css";

export default function Home() {
  return (
    <div className="app-container">
      <Header />
      
      <div className="main-content">
        <OurStory />
      </div>
      
      <Footer />
    </div>
  );
}
