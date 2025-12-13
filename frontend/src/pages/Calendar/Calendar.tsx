import { useState, useEffect } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import './Calendar.css';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
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
  serving: number;
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

/**
 * Calendar component displays the user's meal plan in a monthly calendar view.
 * Users can navigate between months and click on meals to view detailed information.
 * Fetches planner data from backend if not provided via navigation state.
 * 
 * @returns {JSX.Element} The Calendar page component
 */
export default function Calendar() {
  const location = useLocation();
  const { user: currentUser } = useAuth();
  const receivedPlanner = location.state?.planner as Planner | undefined;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayMealPopUp, setDisplayMealPopUp] = useState<boolean>(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal>();
  const [planner, setPlanner] = useState<Planner | undefined>(receivedPlanner);
  const [loading, setLoading] = useState<boolean>(!receivedPlanner);
  const [consentGranted, setConsentGranted] = useState<boolean>(false);
  const [hasLoadedConsentGranted, setHasLoadedConsentGranted] = useState<boolean>(false);


  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); 

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  /**
   * Navigates to the previous month in the calendar view.
   */
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  /**
   * Navigates to the next month in the calendar view.
   */
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  /**
   * Retrieves meal data for a specific date from the planner.
   * 
   * @param {number} day - The day of the month to get meals for
   * @returns {Day | null} The day's meal data or null if not found
   */
  const getMealsForDate = (day: number) => {
    if (!planner || !planner.meals) return null;

    const dayData = planner.meals.find(meal => 
      meal.date.day === day.toString() &&
      meal.date.month === (month + 1).toString() &&
      meal.date.year === year.toString()
    );

  
    return dayData;
  }

  /**
   * Fetches the user's meal planner from the backend.
   * Sets loading state while fetching and updates planner state on success.
   * 
   * @throws {Error} When planner fetch fails
   */
  const fetchPlanner = async () => {
    setLoading(true);
    try{
      const response = await axios.get(`http://localhost:8080/getPlannerForUser/${currentUser?.id}`);

      if (response.data.success){
        setPlanner(response.data.planner)
      } else{
        throw new Error("Failed to fetch planner");
      }
    } catch(error){
      console.error("Error while fetching planner", error);
    } finally{
      setLoading(false);
    }
  }

  /**
   * Fetches the user's general consent status from the backend.
   * Determines whether meal voting/feedback features should be enabled.
   * Sets hasLoadedConsentGranted flag when complete.
   */
  const getConsent = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/getUserConsent/${currentUser?.id}`);

      if (response.data.success && response.data.exists){
        if (response.data.generalConsent === "granted"){
          setConsentGranted(true);
        } else {
          setConsentGranted(false);
        }
      } 
      setHasLoadedConsentGranted(true);
    } catch (error){
      console.error("Error while fetching consent", error);
      setHasLoadedConsentGranted(true);
    }
  }

  /**
   * Renders the calendar grid with all days of the month.
   * Includes empty cells for days before/after the month and meal data for each day.
   * 
   * @returns {JSX.Element[]} Array of calendar day elements
   */
  const renderCalendarDays = () => {
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-start-${i}`} className="calendar-day empty" role="gridcell" aria-hidden="true"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayMeals = getMealsForDate(day);
      const lunchMeal = dayMeals ? ('main' in dayMeals.lunch ? dayMeals.lunch.main : dayMeals.lunch) : null;
      const dinnerMeal = dayMeals ? ('main' in dayMeals.dinner ? dayMeals.dinner.main : dayMeals.dinner) : null;

      days.push(
        <div 
          key={day} 
          className="calendar-day"
          role="gridcell"
          aria-label={`${monthNames[month]} ${day}, ${year}${dayMeals ? ', 3 meals planned' : ''}`}
        >
          <div className="day-number" aria-hidden="true">{day}</div>
          {dayMeals && (
            <div className="meals-list" role="list">
              <button 
                className="meal-item" 
                role="listitem"
                onClick={() => onMealClick(dayMeals.breakfast)}
                aria-label={`View details for Breakfast: ${dayMeals.breakfast.name}`}
              >
                <span aria-hidden="true">B: {dayMeals.breakfast.name}</span>
              </button>
              <button 
                className="meal-item" 
                role="listitem"
                onClick={() => onMealClick(lunchMeal!)}
                aria-label={`View details for Lunch: ${lunchMeal?.name}`}
              >
                <span aria-hidden="true">L: {lunchMeal?.name}</span>
              </button>
              <button 
                className="meal-item" 
                role="listitem"
                onClick={() => onMealClick(dinnerMeal!)}
                aria-label={`View details for Dinner: ${dinnerMeal?.name}`}
              >
                <span aria-hidden="true">D: {dinnerMeal?.name}</span>
              </button>
            </div>
          )}
        </div>
      );
    }
    
    const totalCells = startingDayOfWeek + daysInMonth;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 0; i < remainingCells; i++) {
      days.push(<div key={`empty-end-${i}`} className="calendar-day empty"></div>);
    }
    
    return days;
  };

  /**
   * Closes the meal detail popup/sidebar.
   */
  const onClose = () => {
    setDisplayMealPopUp(false);
  }

  /**
   * Opens the meal detail popup/sidebar for a selected meal.
   * 
   * @param {Meal} meal - The meal to display details for
   */
  const onMealClick = (meal: Meal) => {
    setSelectedMeal(meal);
    setDisplayMealPopUp(true);
  }

  useEffect(() => {
    if (currentUser && !planner && !hasLoadedConsentGranted){
      fetchPlanner();
      getConsent();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="calendar-page">
      <h1 className="calendar-title" style={{ marginTop: '1.5rem' }}>Your Meal Calender</h1>
      <div className="calendar-instruction">
        <small aria-label="Click on a meal to learn more about it!">
          Click on a meal to learn more about it!
        </small>
      </div>
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
          <div className="calendar-instruction">
            <small aria-label="Click on a meal to learn more about it!">
              Click on a meal to learn more about it!
            </small>
          </div>
          <div className="calendar-container">
              <div
                className="no-meal-plan-message"
                aria-label="No meal plan found. Please generate a plan first."
              >
                No meal plan found. Please{' '}
                <Link
                  to="/generate-plan"
                  className="generate-plan-link"
                  aria-label="Go to Generate Plan page to create your meal plan"
                >
                  generate your plan
                </Link>
                {' '}first.
              </div>
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
          <div className="calendar-instruction">
            <small aria-label="Click on a meal to learn more about it!">
              Click on a meal to learn more about it!
            </small>
          </div>
          
          <div className="calendar-container">
            <div className="calendar-header" role="toolbar" aria-label="Calendar navigation">
              <button 
                className="nav-arrow" 
                onClick={goToPreviousMonth}
                aria-label="Go to previous month"
              >
                ←
              </button>
              <h2 className="month-year" id="current-month-year" aria-live="polite">
                {monthNames[month]}, {year}
              </h2>
              <button 
                className="nav-arrow" 
                onClick={goToNextMonth}
                aria-label="Go to next month"
              >
                →
              </button>
            </div>
            
            <div className="calendar-grid" role="grid" aria-labelledby="current-month-year">
              <div className="weekday-header" role="columnheader">Sun</div>
              <div className="weekday-header" role="columnheader">Mon</div>
              <div className="weekday-header" role="columnheader">Tue</div>
              <div className="weekday-header" role="columnheader">Wed</div>
              <div className="weekday-header" role="columnheader">Thu</div>
              <div className="weekday-header" role="columnheader">Fri</div>
              <div className="weekday-header" role="columnheader">Sat</div>
              
              {renderCalendarDays()}
            </div>
            <p className="meal-label-disclaimer" aria-hidden="true">
              *Meal Labels: B = Breakfast, L = Lunch, and D = Dinner
            </p>
          </div>
        </div>
        
        {displayMealPopUp && selectedMeal && (
          <MealCard 
            onClose={onClose}
            meal={selectedMeal}
            consentGranted={consentGranted}
          />
        )}
      </div>
      <Footer />
    </>
  );
}
