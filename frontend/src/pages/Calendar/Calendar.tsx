import { useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import './Calendar.css';
import { useLocation } from 'react-router-dom';
import MealCard from '../../components/calendar/MealCard';

export interface Meal {
  name: string;
  id: number;
  category: string;
  calories: number;
  recipe: {
    instructions: string;
    video: string;
    ingredients: string[];
  };
}

interface Day {
  date: calendarDate;
  breakfast: Meal;
  lunch: Meal | { main: Meal; dessert: Meal };
  dinner: Meal | { main: Meal; dessert: Meal };
}

interface Planner {
  userId: string;
  startDate: {
    day: string;
    month: string;
    year: string;
  };
  weeks: number;
  meals: Day[];
}

interface calendarDate {
  day: string,
  month: string, 
  year: string
}

export default function Calendar() {
  const location = useLocation();
  const planner = location.state?.planner as Planner | undefined;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayMealPopUp, setDisplayMealPopUp] = useState<boolean>(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal>();

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

  const getMealsForDate = (day: number) => {
    if (!planner) return null;

    const dayData = planner.meals.find(meal => 
      meal.date.day === day.toString() &&
      meal.date.month === (month + 1).toString() &&
      meal.date.year === year.toString()
    );
    console.log(day.toString())
    console.log((month + 1).toString())
    console.log(year.toString())
    

    return dayData;
  }

  // Generate calendar days
  const renderCalendarDays = () => {
    console.log(planner)
    const days = [];
    
    // Empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-start-${i}`} className="calendar-day empty"></div>);
    }
    
    // Actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayMeals = getMealsForDate(day);
      console.log(dayMeals);

      days.push(
        <div key={day} className="calendar-day">
          <div className="day-number">{day}</div>
          {dayMeals && (
            <div className="meals-list">
              <div className="meal-item" onClick={() => onMealClick(dayMeals.breakfast)}>
                Breakfast: {dayMeals.breakfast.name}
              </div>
              <div className="meal-item" onClick={() => onMealClick(('main' in dayMeals.lunch ? dayMeals.lunch.main : dayMeals.lunch))}>
                Lunch: {'main' in dayMeals.lunch ? dayMeals.lunch.main.name : dayMeals.lunch.name}
              </div>
              <div className="meal-item" onClick={() => onMealClick(('main' in dayMeals.dinner ? dayMeals.dinner.main : dayMeals.dinner))}>
                Dinner: {'main' in dayMeals.dinner ? dayMeals.dinner.main.name : dayMeals.dinner.name}
              </div>
            </div>
          )}
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

  const onClose = () => {
    setDisplayMealPopUp(false);
  }

  const onMealClick = (meal: Meal) => {
    setSelectedMeal(meal);
    setDisplayMealPopUp(true);
  }

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
      {displayMealPopUp && selectedMeal && (
        <MealCard 
          onClose={onClose}
          meal={selectedMeal}
        />
      )}
    </>
  );
}
