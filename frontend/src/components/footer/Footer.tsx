import './Footer.css';

export default function Footer() {
  return (
    <footer className="bottom-bar" role="contentinfo">
      <p aria-label="Disclaimer about meal planning and nutritional information">
        <strong>Disclaimer:</strong> PlatePath provides meal planning suggestions for informational purposes only. 
        Calorie and nutritional information is approximate and should not replace professional medical or dietary advice. 
        Always consult a healthcare provider or registered dietitian for personalized nutrition guidance.
      </p>
      <p aria-label="Copyright and creator credits">
        © 2025 PlatePath. Created by Elizabeth Sessa, Maddie Templeton, and Erik Estienne.
      </p>
    </footer>
  );
}
