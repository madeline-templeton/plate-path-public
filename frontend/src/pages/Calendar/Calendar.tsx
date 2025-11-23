import { useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import './Calendar.css';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get the first day of the month and total days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate calendar days
  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-start-${i}`} className="calendar-day empty"></div>);
    }
    
    // Actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div key={day} className="calendar-day">
          <div className="day-number">{day}</div>
          {/* Meal lines will go here later */}
        </div>
      );
    }
    
    // Empty cells to fill out the rest of the grid (to complete the last week)
    const totalCells = startingDayOfWeek + daysInMonth;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 0; i < remainingCells; i++) {
      days.push(<div key={`empty-end-${i}`} className="calendar-day empty"></div>);
    }
    
    return days;
  };

  return (
    <>
      <Header />
      <div className="calendar-page">
        <h1 className="calendar-title">Your Meal Calender</h1>
        
        <div className="calendar-container">
          <div className="calendar-header">
            <button className="nav-arrow" onClick={goToPreviousMonth}>←</button>
            <h2 className="month-year">{monthNames[month]}, {year}</h2>
            <button className="nav-arrow" onClick={goToNextMonth}>→</button>
          </div>
          
          <div className="calendar-grid">
            <div className="weekday-header">Sun</div>
            <div className="weekday-header">Mon</div>
            <div className="weekday-header">Tue</div>
            <div className="weekday-header">Wed</div>
            <div className="weekday-header">Thu</div>
            <div className="weekday-header">Fri</div>
            <div className="weekday-header">Sat</div>
            
            {renderCalendarDays()}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
