import './App.css'

function App() {
  return (
    <div className="app-container">
      {/* Top bar */}
      <div className="top-bar">
        <div className="logo">Project Name</div>
      </div>
      
      {/* Main content area */}
      <div className="main-content">
        {/* Left side - Calendar */}
        <div className="left-section">
          <div className="calendar-box">
            <h2>Calendar goes here</h2>
          </div>
        </div>
        
        {/* Right side - Sidebar */}
        <div className="right-section">
          <h2>Sidebar goes here</h2>
        </div>
      </div>
    </div>
  )
}

export default App
