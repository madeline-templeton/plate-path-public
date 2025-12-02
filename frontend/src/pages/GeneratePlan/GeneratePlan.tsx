import { useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import axios from "axios";
import './GeneratePlan.css';
import { useNavigate } from 'react-router-dom';

export default function GeneratePlan() {
  const navigate = useNavigate();

  // Get current date for defaults
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
  const currentYear = today.getFullYear();

  const [selectedAge, setSelectedAge] = useState('');
  const [heightFeet, setHeightFeet] = useState('');
  const [selectedSex, setSelectedSex] = useState("");
  const [heightInches, setHeightInches] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedWeightGoal, setSelectedWeightGoal] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [selectedActivityLevel, setSelectedActivityLevel] = useState('');
  const [selectedPlanDuration, setSelectedPlanDuration] = useState("");
  
  // Start date dropdowns with current date as default
  const [selectedDay, setSelectedDay] = useState(currentDay.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  
  // Validation errors
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [ageError, setAgeError] = useState<'too-low' | 'too-high' | null>(null);
  const [ageInputError, setAgeInputError] = useState(false);
  const [sexError, setSexError] = useState(false);
  const [heightFeetError, setHeightFeetError] = useState(false);
  const [heightInchesError, setHeightInchesError] = useState(false);
  const [weightInputError, setWeightInputError] = useState(false);
  const [weightGoalError, setWeightGoalError] = useState(false);
  const [weightError, setWeightError] = useState<'too-low' | 'too-high' | null>(null);
  const [activityLevelError, setActivityLevelError] = useState(false);
  const [planDurationError, setPlanDurationError] = useState(false);
  const [startDateError, setStartDateError] = useState(false);

  const handleWeightChange = (value: string) => {
    setWeight(value);
    const numValue = parseFloat(value);
    
    if (value === '' || isNaN(numValue)) {
      setWeightError(null);
    } else if (numValue < 75) {
      setWeightError('too-low');
    } else if (numValue > 550) {
      setWeightError('too-high');
    } else {
      setWeightError(null);
    }
  };

  const handleAgeChange = (value: string) => {
    setSelectedAge(value);
    const numValue = parseFloat(value);
    
    if (value === '' || isNaN(numValue)) {
      setAgeError(null);
    } else if (numValue < 18) {
      setAgeError('too-low');
    } else if (numValue > 120) {
      setAgeError('too-high');
    } else {
      setAgeError(null);
    }
  };

  const handleDietaryChange = (restriction: string) => {
    if (dietaryRestrictions.includes(restriction)) {
      setDietaryRestrictions(dietaryRestrictions.filter(r => r !== restriction));
    } else {
      setDietaryRestrictions([...dietaryRestrictions, restriction]);
    }
  };

  const handleGeneratePlan = async () => {
    // Reset errors
    setShowValidationErrors(false);
    setAgeInputError(false);
    setHeightFeetError(false);
    setHeightInchesError(false);
    setWeightInputError(false);
    setWeightGoalError(false);
    setActivityLevelError(false);
    setPlanDurationError(false);
    setStartDateError(false);
    setSexError(false);

    // Validate all required fields
    let hasErrors = false;

    if (!selectedAge) {
      setAgeInputError(true);
      hasErrors = true;
    }

    if (!selectedSex) {
      setSexError(true);
      hasErrors = true;
    }

    if (!heightFeet || heightFeet === '-') {
      setHeightFeetError(true);
      hasErrors = true;
    }

    if (!heightInches || heightInches === '-') {
      setHeightInchesError(true);
      hasErrors = true;
    }

    if (!weight) {
      setWeightInputError(true);
      hasErrors = true;
    } else if (weightError) {
      // Weight has validation error (too low or too high)
      hasErrors = true;
    }

    if (!selectedWeightGoal) {
      setWeightGoalError(true);
      hasErrors = true;
    }

    if (!selectedActivityLevel) {
      setActivityLevelError(true);
      hasErrors = true;
    }

    if (!selectedPlanDuration) {
      setPlanDurationError(true);
      hasErrors = true;
    }

    if (!selectedDay || !selectedMonth || !selectedYear) {
      setStartDateError(true);
      hasErrors = true;
    }

    if (hasErrors) {
      setShowValidationErrors(true);
    } else {
      // Form is valid - functionality to be added later
      console.log('Form is valid, ready to generate plan');
      await getPlan();
    }
  
  };

  const getPlan = async () => {
    try{
      const constraints = {
        age: selectedAge,
        sex: selectedSex,
        height : {
          value: [heightFeet, heightInches],
          unit: "ft-in"
        },
        weight: {
          value: weight,
          unit: "lb"
        },
        activityLevel: selectedActivityLevel,
        weightGoal: selectedWeightGoal,
        dietaryRestrictions: dietaryRestrictions,
        weeks: selectedPlanDuration,
        date: {
          day: selectedDay,
          month: selectedMonth,
          year: selectedYear
        }
      }

      console.log(constraints)
      const response = await axios.post("http://localhost:8080/api/planner/generate", {
        constraints: constraints
      });

      console.log(response.data)
      if (response.data.success && response.data.planner){
        navigate("/calendar", {state: {planner: response.data.planner}});
      }
    } catch (error){
      console.error(error);
    }
  }


  return (
    <>
      <Header />
      <div className="generate-plan-page">
        <h1 className="plan-title">Generate Your Plan</h1>
        
        <form className="plan-form">
          {/* Age Section */}
          {/* Current Weight Section */}
          <div className="form-section">
            <h2 className="section-label">Age</h2>
            <div className="weight-input">
              <input
                type="number"
                value={selectedAge}
                onChange={(e) => handleAgeChange(e.target.value)}
                placeholder=""
                min="18"
                max="120"
              />
            </div>
            {ageError && (
              <div className="weight-error">
                <p className="error-message">
                  {ageError === 'too-low' ? 'Entered age too low' : 'Entered age too high'}
                </p>
                <p className="error-disclaimer">
                  PlatePath cannot responsibly advise on dietary needs at this age
                </p>
              </div>
            )}
            {ageInputError && (
              <p className="field-error">must input age</p>
            )}
          </div>

          {/* Sex Section */}
          <div className="form-section">
            <h2 className="section-label">Sex</h2>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="sex"
                  value="M"
                  checked={selectedSex === 'M'}
                  onChange={(e) => setSelectedSex(e.target.value)}
                />
                <span>Male</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="sex"
                  value="F"
                  checked={selectedSex === 'F'}
                  onChange={(e) => setSelectedSex(e.target.value)}
                />
                <span>Female</span>
              </label>
            </div>
            {sexError && (
              <p className="field-error">must input age</p>
            )}
          </div>

          {/* Height Section */}
          <div className="form-section">
            <h2 className="section-label">Height</h2>
            <div className="height-inputs">
              <div className="height-field">
                <select
                  value={heightFeet}
                  onChange={(e) => setHeightFeet(e.target.value)}
                  className="height-select"
                >
                  <option value="">-</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                </select>
                <span className="unit-label">ft</span>
              </div>
              <div className="height-field">
                <select
                  value={heightInches}
                  onChange={(e) => setHeightInches(e.target.value)}
                  className="height-select"
                >
                  <option value="">-</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                </select>
                <span className="unit-label">inches</span>
              </div>
            </div>
            {(heightFeetError || heightInchesError) && (
              <p className="field-error">must input height</p>
            )}
          </div>

          {/* Current Weight Section */}
          <div className="form-section">
            <h2 className="section-label">Current Weight</h2>
            <div className="weight-input">
              <input
                type="number"
                value={weight}
                onChange={(e) => handleWeightChange(e.target.value)}
                placeholder=""
                min="75"
                max="550"
              />
              <span className="unit-label">lbs</span>
            </div>
            {weightError && (
              <div className="weight-error">
                <p className="error-message">
                  {weightError === 'too-low' ? 'Entered weight too low' : 'Entered weight too high'}
                </p>
                <p className="error-disclaimer">
                  PlatePath cannot responsibly advise on dietary needs at this weight
                </p>
              </div>
            )}
            {weightInputError && (
              <p className="field-error">must input weight</p>
            )}
          </div>

          {/* Weight Goals Section */}
          <div className="form-section">
            <h2 className="section-label">Weight Goals</h2>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="weightGoal"
                  value="extreme-loss"
                  checked={selectedWeightGoal === 'extreme-loss'}
                  onChange={(e) => setSelectedWeightGoal(e.target.value)}
                />
                <span>Extreme Weight Loss (1-2 lbs per week)</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="weightGoal"
                  value="weight-loss"
                  checked={selectedWeightGoal === 'weight-loss'}
                  onChange={(e) => setSelectedWeightGoal(e.target.value)}
                />
                <span>Weight Loss (0.5-1 lbs per week)</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="weightGoal"
                  value="maintain"
                  checked={selectedWeightGoal === 'maintain'}
                  onChange={(e) => setSelectedWeightGoal(e.target.value)}
                />
                <span>Maintain Weight</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="weightGoal"
                  value="weight-gain"
                  checked={selectedWeightGoal === 'weight-gain'}
                  onChange={(e) => setSelectedWeightGoal(e.target.value)}
                />
                <span>Weight Gain (0.5-1 lbs per week)</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="weightGoal"
                  value="extreme-gain"
                  checked={selectedWeightGoal === 'extreme-gain'}
                  onChange={(e) => setSelectedWeightGoal(e.target.value)}
                />
                <span>Extreme Weight Gain (1-2 lbs per week)</span>
              </label>
            </div>
            {weightGoalError && (
              <p className="field-error">must input weight goal</p>
            )}
          </div>

          {/* Activity Level Section */}
          <div className="form-section">
            <h2 className="section-label">Activity Level</h2>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="activityLevel"
                  value="not-active"
                  checked={selectedActivityLevel === 'not-active'}
                  onChange={(e) => setSelectedActivityLevel(e.target.value)}
                />
                <span>Not Active</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="activityLevel"
                  value="lightly-active"
                  checked={selectedActivityLevel === 'lightly-active'}
                  onChange={(e) => setSelectedActivityLevel(e.target.value)}
                />
                <span>Lightly Active (exercise 1-3 days per week)</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="activityLevel"
                  value="moderately-active"
                  checked={selectedActivityLevel === 'moderately-active'}
                  onChange={(e) => setSelectedActivityLevel(e.target.value)}
                />
                <span>Moderately Active (exercise 3-4 times per week)</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="activityLevel"
                  value="active"
                  checked={selectedActivityLevel === 'active'}
                  onChange={(e) => setSelectedActivityLevel(e.target.value)}
                />
                <span>Active (exercise 5-7 times per week)</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="activityLevel"
                  value="very-active"
                  checked={selectedActivityLevel === 'very-active'}
                  onChange={(e) => setSelectedActivityLevel(e.target.value)}
                />
                <span>Very Active (intense exercise 5-7 times per week)</span>
              </label>
            </div>
            {activityLevelError && (
              <p className="field-error">must input activity level</p>
            )}
          </div>

          {/* Dietary Restrictions Section */}
          <div className="form-section">
            <h2 className="section-label">Dietary Restrictions <span className="select-all">(select all that apply)</span></h2>
            <div className="checkbox-group">
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={dietaryRestrictions.includes('vegetarian')}
                  onChange={() => handleDietaryChange('vegetarian')}
                />
                <span>Vegetarian</span>
              </label>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={dietaryRestrictions.includes('vegan')}
                  onChange={() => handleDietaryChange('vegan')}
                />
                <span>Vegan</span>
              </label>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={dietaryRestrictions.includes('dairy-free')}
                  onChange={() => handleDietaryChange('dairy-free')}
                />
                <span>Dairy Free</span>
              </label>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={dietaryRestrictions.includes('nut-free')}
                  onChange={() => handleDietaryChange('nut-free')}
                />
                <span>Nut Free</span>
              </label>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={dietaryRestrictions.includes('gluten-free')}
                  onChange={() => handleDietaryChange('gluten-free')}
                />
                <span>Gluten Free</span>
              </label>
            </div>
          </div>

          {/* Plan Duration Section */}
          <div className="form-section">
            <h2 className="section-label">Plan Duration</h2>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="planDuration"
                  value="1"
                  checked={selectedPlanDuration === '1'}
                  onChange={(e) => setSelectedPlanDuration(e.target.value)}
                />
                <span>One Week</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="planDuration"
                  value="2"
                  checked={selectedPlanDuration === '2'}
                  onChange={(e) => setSelectedPlanDuration(e.target.value)}
                />
                <span>Two Weeks</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="planDuration"
                  value="4"
                  checked={selectedPlanDuration === '4'}
                  onChange={(e) => setSelectedPlanDuration(e.target.value)}
                />
                <span>Four Weeks</span>
              </label>
            </div>
            {planDurationError && (
              <p className="field-error">must input plan duration</p>
            )}
          </div>

          {/* Start Date Section */}
          <div className="form-section">
            <h2 className="section-label">Start Date</h2>
            <div className="height-inputs">
              <div className="height-field">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="height-select month-select"
                >
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
              <div className="height-field">
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="height-select"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div className="height-field">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="height-select"
                >
                  {Array.from({ length: 5 }, (_, i) => currentYear + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            {startDateError && (
              <p className="field-error">must input start date</p>
            )}
          </div>

          {/* Main Validation Error Message */}
          {showValidationErrors && (
            <p className="main-error-message">Please fill in all required fields</p>
          )}

          {/* Submit Button */}
          <button type="button" className="generate-plan-button" onClick={handleGeneratePlan}>
            Generate Plan
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
