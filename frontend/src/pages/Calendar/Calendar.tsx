import { useState, useEffect } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import './Calendar.css';
import { useLocation } from 'react-router-dom';
import MealCard from '../../components/calendar/MealCard';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

export interface Meal {
  id: number;
  name: string;
  mealTime: "breakfast" | "lunch" | "dinner" | "dessert";
  diet: string;
  ingredients: string;
  website: string;
  calories: number;
  occurrences: number;
}

interface Day {
  date: calendarDate;
  breakfast: Meal;
  lunch: Meal | { main: Meal; dessert: Meal };
  dinner: Meal | { main: Meal; dessert: Meal };
}

export interface Planner {
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
  const { user: currentUser } = useAuth();
  const receivedPlanner = location.state?.planner as Planner | undefined;
  console.log(receivedPlanner, "received");

  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayMealPopUp, setDisplayMealPopUp] = useState<boolean>(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal>();
  const [planner, setPlanner] = useState<Planner | undefined>(receivedPlanner);
  const [loading, setLoading] = useState<boolean>(!receivedPlanner);


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
    if (!planner || !planner.meals) return null;

    const dayData = planner.meals.find(meal => 
      meal.date.day === day.toString() &&
      meal.date.month === (month + 1).toString() &&
      meal.date.year === year.toString()
    );

  
    return dayData;
  }

  const fetchPlanner = async () => {
    console.log("called")
    setLoading(true);
    try{
      const response = await axios.get(`http://localhost:8080/getPlannerForUser/${currentUser?.id}`);

      if (response.data.success){
        setPlanner(response.data.planner)
      } else{
        console.error("Error while fetching Planner", response.status)
      }
    } catch(error){
      console.error(error, "Error while fetching Planner")
    } finally{
      setLoading(false);
    }
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

  useEffect(() => {
    if (currentUser && !planner){
      fetchPlanner();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="calendar-page">
          <h1 className="calendar-title">Your Meal Calender</h1>
          <div className="calendar-container">
            <p style={{ textAlign: 'center', padding: '40px', fontFamily: 'Quicksand, sans-serif', fontSize: '1.2rem' }}>
              Loading your meal plan...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!planner || !planner.meals) {
    return (
      <>
        <Header />
        <div className="calendar-page">
          <h1 className="calendar-title">Your Meal Calender</h1>
          <div className="calendar-container">
            <p style={{ textAlign: 'center', padding: '40px', fontFamily: 'Quicksand, sans-serif', fontSize: '1.2rem' }}>
              No meal plan found. Please generate a plan first.
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={`calendar-page ${displayMealPopUp ? 'with-sidebar' : ''}`}>
        <div className="calendar-content">
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
        
        {displayMealPopUp && selectedMeal && (
          <MealCard 
            onClose={onClose}
            meal={selectedMeal}
          />
        )}
      </div>
      <Footer />
    </>
  );
}
