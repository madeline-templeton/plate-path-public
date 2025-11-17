import './App.css'

function App() {
  return (
    <div className="app-container">
      {/* Top bar */}
      <div className="top-bar">
        <div className="logo">PlatePath</div>
      </div>
      
      {/* Main content area */}
      <div className="main-content">
        {/* Left side - Calendar */}
        <div className="left-section">
          <h1 className="section-title">Your Meal Calender</h1>
          <div className="calendar-box">
            <h2>Calendar goes here</h2>
          </div>
        </div>
        
        {/* Right side - Sidebar */}
        <div className="right-section">
          <h2>Sidebar goes here</h2>
        </div>
      </div>
      
      {/* Bottom bar */}
      <div className="bottom-bar">
        <p>This is where we can put disclaimers about eating food responsibly and credit ourselves for creating the website</p>
      </div>
    </div>
  )
}

export default App
