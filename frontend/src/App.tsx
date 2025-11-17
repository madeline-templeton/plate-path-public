import './App.css'

function App() {
  return (
    <div className="app-container">
      {/* Top bar */}
      <div className="top-bar"></div>
      
      {/* Main content area */}
      <div className="main-content">
        {/* Logo in top left */}
        <div className="logo">Project Name</div>
        
        <div className="boxes-container">
          {/* Left side - Calendar (Orange box) */}
          <div className="calendar-box">
            <h2>Calendar goes here</h2>
          </div>
          
          {/* Right side - Sidebar (Green box) */}
          <div className="sidebar-box">
            <h2>Sidebar goes here</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
