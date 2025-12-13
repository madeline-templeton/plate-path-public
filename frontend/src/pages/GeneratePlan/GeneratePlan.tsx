import { useEffect, useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import axios from "axios";
import './GeneratePlan.css';
import { useNavigate } from 'react-router-dom';
import { auth } from "../../services/firebase";
import { useAuth } from '../../contexts/AuthContext';

/**
 * GeneratePlan component provides a form for users to input their personal information
 * and dietary preferences to generate a personalized meal plan.
 * Handles form validation, user data persistence, and meal plan generation.
 * 
 * @returns {JSX.Element} The GeneratePlan page component
 */
export default function GeneratePlan() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1; 
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
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft-in">("ft-in");
  const [heightValue, setHeightValue] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("lb");
  
  const [selectedDay, setSelectedDay] = useState(currentDay.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  
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
  const [heightError, setHeightError] = useState<'too-low' | 'too-high' | null>(null);

  const [hasLoadedUserInfo, setHasLoadedUserInfo] = useState(false);
  const [sensitiveConsentGranted, setSensitiveConsentGranted] = useState(false);
  const [generalConsentGranted, setGeneralConsentGranted] = useState(false);
  const [hasLoadedSensitiveConsent, setHasLoadedSensitiveConsent] = useState(false);
  const [hasLoadedGeneralConsent, setHasLoadedGeneralConsent] = useState(false);
  const [hasLoadedMealPreferences, setHasLoadedMealPreferences] = useState(false);

  const [likedMeals, setLikedMeals] = useState([]);
  const [disLikedMeals, setDisLikedMeals] = useState([]);

  /**
   * Handles weight input changes and validates the value based on the selected unit.
   * Sets appropriate error states if weight is outside acceptable ranges.
   * 
   * @param {string} value - The weight value entered by the user
   */
  const handleWeightChange = (value: string) => {
    setWeight(value);
    const numValue = parseFloat(value);
    
    if (value === '' || isNaN(numValue)) {
      setWeightError(null);
    } else {
      if (weightUnit === "lb"){
        if (numValue < 75) {
          setWeightError('too-low');
        } else if (numValue > 550) {
          setWeightError('too-high');
        } else {
          setWeightError(null);
        }
      } else {
        if (numValue < 35) {
          setWeightError('too-low');
        } else if (numValue > 250) {
          setWeightError('too-high');
        } else {
          setWeightError(null);
        }
      }
    }
  };

  /**
   * Handles height input changes (for cm unit) and validates the value.
   * Sets appropriate error states if height is outside acceptable ranges.
   * 
   * @param {string} value - The height value entered by the user in centimeters
   */
  const handleHeightChange = (value: string) => {
    setHeightValue(value);
    const numValue = parseFloat(value);
    
    if (value === '' || isNaN(numValue)) {
      setHeightError(null);
    } else {
      if (heightUnit === "cm"){
        if (numValue < 120) {
          setHeightError('too-low');
        } else if (numValue > 270) {
          setHeightError('too-high');
        } else {
          setHeightError(null);
        }
      }
    }
  };

  /**
   * Handles age input changes and validates the value.
   * Sets error states if age is below 18 or above 120.
   * 
   * @param {string} value - The age value entered by the user
   */
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

  /**
   * Toggles a dietary restriction on or off in the user's selection.
   * 
   * @param {string} restriction - The dietary restriction to toggle
   */
  const handleDietaryChange = (restriction: string) => {
    if (dietaryRestrictions.includes(restriction)) {
      setDietaryRestrictions(dietaryRestrictions.filter(r => r !== restriction));
    } else {
      setDietaryRestrictions([...dietaryRestrictions, restriction]);
    }
  };

  /**
   * Validates all form fields and initiates meal plan generation if valid.
   * Sets appropriate error states for any invalid or missing fields.
   */
  const handleGeneratePlan = async () => {
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

    let hasErrors = false;

    if (!selectedAge) {
      setAgeInputError(true);
      hasErrors = true;
    } else if (ageError) {
      hasErrors = true;
    }

    if (!selectedSex) {
      setSexError(true);
      hasErrors = true;
    }

    if (heightUnit === 'ft-in') {
      if (!heightFeet || heightFeet === '-' || heightFeet === '') {
        setHeightFeetError(true);
        hasErrors = true;
      }
      if (heightInches === '' || heightInches === '-') {
        setHeightInchesError(true);
        hasErrors = true;
      }
    } else {
      if (!heightValue) {
        setHeightFeetError(true); 
        hasErrors = true;
      } else if (heightError) {
        hasErrors = true;
      }
    } 

    if (!weight) {
      setWeightInputError(true);
      hasErrors = true;
    } else if (weightError) {
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
      await getPlan();
    }
  
  };

  /**
   * Generates a meal plan by sending user constraints to the backend API.
   * If consent is granted, updates user info and planner data.
   * Navigates to calendar view on success.
   * 
   * @throws {Error} When meal plan generation fails or server is unreachable
   */
  const getPlan = async () => {
    try{
      let heightValueToSend;
      if (heightUnit === "ft-in"){
        heightValueToSend = [heightFeet, heightInches];
      } else {
        heightValueToSend = [heightValue];
      }


      const constraints = {
        userId: currentUser?.id,
        age: selectedAge,
        sex: selectedSex,
        height : {
          value: heightValueToSend,
          unit: heightUnit
        },
        weight: {
          value: weight,
          unit: weightUnit
        },
        activityLevel: selectedActivityLevel,
        weightGoal: selectedWeightGoal,
        dietaryRestrictions: dietaryRestrictions,
        downvotedMealIds: disLikedMeals,
        preferredMealIds: likedMeals,
        weeks: selectedPlanDuration,
        date: {
          day: selectedDay,
          month: selectedMonth,
          year: selectedYear
        }
      }

      const response = await axios.post("http://localhost:8080/api/planner/generate", {
        constraints: constraints
      });
      
      if (response.data.success && response.data.planner){
        if (generalConsentGranted){
          await updatePlanner(response.data.planner);
          if (sensitiveConsentGranted){
            await updateUserInfo(constraints);
          }
        }
        navigate("/calendar", {state: {planner: response.data.planner}});
      } else {
        alert(`Failed to generate meal plan: ${response.data.message || response.data.error || 'Unknown error'}`);
      }
    } catch (error: any){
      if (error.response) {
        alert(`Error generating meal plan: ${error.response.data.message || error.response.data.error || 'Server error'}`);
      } else if (error.request) {
        alert("Could not connect to server. Please make sure the backend is running.");
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  }

  /**
   * Saves the generated meal planner to the backend for the authenticated user.
   * 
   * @param {any} planner - The meal planner object to save
   * @throws {Error} When planner update fails
   */
  const updatePlanner = async (planner: any) => {
    try{
      const token = await auth.currentUser?.getIdToken();

      const response = await axios.put("http://localhost:8080/updatePlanner", {
        planner: planner
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success){
        console.log("Planner updated successfully");
      } 

    } catch (error){
      console.error("Error while updating planner", error);
    }
  }

  /**
   * Saves user information (constraints) to the backend for the authenticated user.
   * Only called if user has granted sensitive data consent.
   * 
   * @param {any} userInfo - The user information/constraints object to save
   * @throws {Error} When user info update fails
   */
  const updateUserInfo = async (userInfo: any) => {
    try {
      const token = await auth.currentUser?.getIdToken();

      const response = await axios.put("http://localhost:8080/updateUserInformation", {
        userInfo: userInfo
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success){
        console.log("User Info updated successfully");
      } 

    } catch (error){
      console.error("Error while updating userInfo", error);
    }
  }
  
  /**
   * Fetches previously saved user information from the backend.
   * Pre-populates form fields with saved data if available.
   * Sets hasLoadedUserInfo flag when complete.
   */
  const getUserInfo = async () => {
    try{
      const response = await axios.get(`http://localhost:8080/getUserInformation/${currentUser?.id}`);

      if (response.data.success){
        setSelectedAge(response.data.userInfo.age);
        setSelectedSex(response.data.userInfo.sex);
        setSelectedWeightGoal(response.data.userInfo.weightGoal);
        setSelectedActivityLevel(response.data.userInfo.activityLevel);
        setDietaryRestrictions(response.data.userInfo.dietaryRestrictions);
        setSelectedPlanDuration(response.data.userInfo.weeks.toString());
        setSelectedDay(response.data.userInfo.startDate.day);
        setSelectedMonth(response.data.userInfo.startDate.month);
        setSelectedYear(response.data.userInfo.startDate.year);

        if (response.data.userInfo.height.unit === "ft-in"){
          setHeightUnit("ft-in");
          setHeightFeet(response.data.userInfo.height.value[0]);
          setHeightInches(response.data.userInfo.height.value[1]);
        }  else if (response.data.userInfo.height.unit === "cm"){
          setHeightUnit("cm");
          setHeightValue(response.data.userInfo.height.value[0]);
        } 
        if (response.data.userInfo.weight.unit === "kg"){
          setWeightUnit("kg");
          setWeight(response.data.userInfo.weight.value);
        } else {
          setWeightUnit("lb");
          setWeight(response.data.userInfo.weight.value);
        } 

        setHasLoadedUserInfo(true);
      }
    } catch (error: any){
      setHasLoadedUserInfo(true);
    }
  }

  /**
   * Fetches the user's meal voting history (liked and disliked meals) from the backend.
   * Used to personalize future meal plan generation.
   * Sets hasLoadedMealPreferences flag when complete.
   */
  const getUserMealVotes = async () => {
    try{
      const response = await axios.get(`http://localhost:8080/getUserMealVotes/${currentUser?.id}`);

      if (response.data.success){
        if (response.data.liked){
          setLikedMeals(response.data.liked);
        } 

        if (response.data.disliked){
          setDisLikedMeals(response.data.disliked);
        } 

        setHasLoadedMealPreferences(true);
      }
    } catch (error: any){
      setHasLoadedMealPreferences(true);
    }
  }

  useEffect(() => {
    if (currentUser && !hasLoadedUserInfo && !hasLoadedGeneralConsent && !hasLoadedSensitiveConsent && !hasLoadedMealPreferences){
      getConsent();
      getUserInfo();
      getUserMealVotes();
    }
  }, [currentUser]);

  /**
   * Fetches the user's consent preferences from the backend.
   * Determines whether sensitive and general data can be stored.
   * Sets hasLoadedSensitiveConsent and hasLoadedGeneralConsent flags when complete.
   */
  const getConsent = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/getUserConsent/${currentUser?.id}`);

      if (response.data.success && response.data.exists){
        if (response.data.sensitiveConsent === "granted"){
          setSensitiveConsentGranted(true);
        } else {
          setSensitiveConsentGranted(false);
        }
        if (response.data.generalConsent === "granted"){
          setGeneralConsentGranted(true);
        } else {
          setGeneralConsentGranted(false);
        }
      } 
      setHasLoadedGeneralConsent(true);
      setHasLoadedSensitiveConsent(true);
    } catch (error){
      setHasLoadedGeneralConsent(true);
      setHasLoadedSensitiveConsent(true);
    }
  }



  return (
    <>
      <Header />
      <main role="main" className="generate-plan-page">
        <h1 id="generate-plan-title" className="plan-title">Generate Your Plan</h1>
        
        <div style={{ width: '100%', maxWidth: 700, textAlign: 'left', margin: 0, padding: 0 }}>
          <small aria-hidden="true" className="required-disclaimer">
            <span className="asterisk">*</span> indicates a required field.
          </small>
        </div>
        <form className="plan-form" aria-labelledby="generate-plan-title">
          {/* Age Section */}

          {/* Current Age Section */}
          <div className="form-section">
            <label htmlFor="age-input" className="section-label">Age <span style={{ color: 'red' }} aria-hidden="true">*</span></label>
            <p className="field-hint" id="age-hint">Used to calculate your metabolic rate</p>
            <div className="weight-input">
              <input
                type="number"
                value={selectedAge}
                onChange={(e) => handleAgeChange(e.target.value)}
                placeholder=""
                min="18"
                max="120"
                aria-required="true"
                aria-describedby={`age-hint${ageError ? ' age-error' : ''}${ageInputError ? ' age-input-error' : ''}`}
                id="age-input"
              />
            </div>
            {ageError && (
              <div id="age-error" className="weight-error" aria-live="polite">
                <p className="error-message">
                  {ageError === 'too-low' ? 'Entered age too low' : 'Entered age too high'}
                </p>
                <p className="error-disclaimer">
                  PlatePath cannot responsibly advise on dietary needs at this age
                </p>
              </div>
            )}
            {ageInputError && (
              <p id="age-input-error" className="field-error" aria-live="polite">must input age</p>
            )}
          </div>

          {/* Sex Section */}
          <fieldset className="form-section" aria-required="true">
            <legend className="section-label">Sex <span style={{ color: 'red' }} aria-hidden="true">*</span></legend>
            <p className="field-hint" id="sex-hint">Affects calorie needs</p>
            <div className="radio-group">
              <label className="radio-option" htmlFor="sex-male">
                <input
                  id="sex-male"
                  type="radio"
                  name="sex"
                  value="M"
                  checked={selectedSex === 'M'}
                  onChange={(e) => setSelectedSex(e.target.value)}
                  aria-describedby={`sex-hint${sexError ? ' sex-error' : ''}`}
                />
                <span>Male</span>
              </label>
              <label className="radio-option" htmlFor="sex-female">
                <input
                  id="sex-female"
                  type="radio"
                  name="sex"
                  value="F"
                  checked={selectedSex === 'F'}
                  onChange={(e) => setSelectedSex(e.target.value)}
                  aria-describedby={`sex-hint${sexError ? ' sex-error' : ''}`}
                />
                <span>Female</span>
              </label>
            </div>
            {sexError && (
              <p id="sex-error" className="field-error" aria-live="polite">must input sex</p>
            )}
          </fieldset>

          {/* Height Section */}
          <fieldset className="form-section">
            <legend className="section-label">Height <span style={{ color: 'red' }} aria-hidden="true">*</span></legend>
            <p className="field-hint" id="height-hint">For energy requirement calculation</p>

            <div className="unit-selector" role="radiogroup" aria-label="Height unit">
              <label className="unit-option">
                <input
                  type="radio"
                  name="heightUnit"
                  value="ft-in"
                  checked={heightUnit === 'ft-in'}
                  onChange={(e) => setHeightUnit(e.target.value as "ft-in")}
                />
                <span>Feet & Inches</span>
              </label>
              <label className="unit-option">
                <input
                  type="radio"
                  name="heightUnit"
                  value="cm"
                  checked={heightUnit === 'cm'}
                  onChange={(e) => setHeightUnit(e.target.value as "cm")}
                />
                <span>Centimeters</span>
              </label>
            </div>



            {/* Conditional height input based on unit */}
            {heightUnit === 'ft-in' ? (
              <div className="height-inputs">
                <div className="height-field">
                  <label htmlFor="height-feet" className="unit-label">Height Feet</label>
                  <select
                    id="height-feet"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e.target.value)}
                    className="height-select"
                    aria-required="true"
                    aria-describedby="height-hint"
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
                  <label htmlFor="height-inches" className="unit-label">Height Inches</label>
                  <select
                    id="height-inches"
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}
                    className="height-select"
                    aria-required="true"
                    aria-describedby="height-hint"
                  >
                    <option value="">-</option>
                    {Array.from({ length: 12 }, (_, i) => i).map(inch => (
                      <option key={inch} value={inch}>{inch}</option>
                    ))}
                  </select>
                  <span className="unit-label">inches</span>
                </div>
              </div>
            ) : (
              <div className="weight-input">
                <label htmlFor="height-cm" className="unit-label">Centimeters</label>
                <input
                  id="height-cm"
                  type="number"
                  value={heightValue}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  placeholder=""
                  min="0"
                  aria-required="true"
                  aria-describedby="height-hint"
                />
                <span className="unit-label">{heightUnit}</span>
              </div>
            )}

            {heightError && (
              <div id="height-error" className="weight-error" aria-live="polite">
                <p className="error-message">
                  {heightError === 'too-low' ? 'Entered height too low' : 'Entered height too high'}
                </p>
                <p className="error-disclaimer">
                  PlatePath cannot responsibly advise on dietary needs at this height
                </p>
              </div>
            )}
          
            {(heightFeetError || heightInchesError) && (
              <p id="height-input-error" className="field-error" aria-live="polite">must input height</p>
            )}
          </fieldset>

          {/* Current Weight Section */}
          <div className="form-section">
            <label htmlFor="weight-input" className="section-label">Current Weight <span style={{ color: 'red' }} aria-hidden="true">*</span></label>
            <p className="field-hint" id="weight-hint">For calorie target calculation</p>

            {/* Unit selector */}
            <div className="unit-selector" role="radiogroup" aria-label="Weight unit">
              <label className="unit-option">
                <input
                  type="radio"
                  name="weightUnit"
                  value="lb"
                  checked={weightUnit === 'lb'}
                  onChange={(e) => {
                    setWeightUnit(e.target.value as "lb");
                    handleWeightChange(weight); // Re-validate with new unit
                  }}
                />
                <span>Pounds (lb)</span>
              </label>
              <label className="unit-option">
                <input
                  type="radio"
                  name="weightUnit"
                  value="kg"
                  checked={weightUnit === 'kg'}
                  onChange={(e) => {
                    setWeightUnit(e.target.value as "kg");
                    handleWeightChange(weight);
                  }}
                />
                <span>Kilograms (kg)</span>
              </label>
            </div>

            <div className="weight-input">
              <input
                id="weight-input"
                type="number"
                value={weight}
                onChange={(e) => handleWeightChange(e.target.value)}
                placeholder=""
                min={weightUnit === 'lb' ? "75" : "34"}
                max={weightUnit === 'lb' ? "550" : "250"}
                aria-required="true"
                aria-describedby={`weight-hint${weightError ? ' weight-error' : ''}${weightInputError ? ' weight-input-error' : ''}`}
              />
              <span className="unit-label">{weightUnit}</span>
            </div>
            {weightError && (
              <div id="weight-error" className="weight-error" aria-live="polite">
                <p className="error-message">
                  {weightError === 'too-low' ? 'Entered weight too low' : 'Entered weight too high'}
                </p>
                <p className="error-disclaimer">
                  PlatePath cannot responsibly advise on dietary needs at this weight
                </p>
              </div>
            )}
            {weightInputError && (
              <p id="weight-input-error" className="field-error" aria-live="polite">must input weight</p>
            )}
          </div>

          {/* Weight Goals Section */}
          <fieldset className="form-section" aria-required="true">
            <legend className="section-label">Weight Goals <span style={{ color: 'red' }} aria-hidden="true">*</span></legend>
            <p className="field-hint" id="weight-goal-hint">Determines your calorie adjustment</p>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="weightGoal"
                  value="extreme-loss"
                  checked={selectedWeightGoal === 'extreme-loss'}
                  onChange={(e) => setSelectedWeightGoal(e.target.value)}
                  aria-describedby={`weight-goal-hint${weightGoalError ? ' weight-goal-error' : ''}`}
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
                  aria-describedby={`weight-goal-hint${weightGoalError ? ' weight-goal-error' : ''}`}
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
                  aria-describedby={`weight-goal-hint${weightGoalError ? ' weight-goal-error' : ''}`}
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
                  aria-describedby={`weight-goal-hint${weightGoalError ? ' weight-goal-error' : ''}`}
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
                  aria-describedby={`weight-goal-hint${weightGoalError ? ' weight-goal-error' : ''}`}
                />
                <span>Extreme Weight Gain (1-2 lbs per week)</span>
              </label>
            </div>
            {weightGoalError && (
              <p id="weight-goal-error" className="field-error" aria-live="polite">must input weight goal</p>
            )}
          </fieldset>

          {/* Activity Level Section */}
          <fieldset className="form-section" aria-required="true">
            <legend className="section-label">Activity Level <span style={{ color: 'red' }} aria-hidden="true">*</span></legend>
            <p className="field-hint" id="activity-level-hint">Affects your daily calorie target</p>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="activityLevel"
                  value="not-active"
                  checked={selectedActivityLevel === 'not-active'}
                  onChange={(e) => setSelectedActivityLevel(e.target.value)}
                  aria-describedby={`activity-level-hint${activityLevelError ? ' activity-level-error' : ''}`}
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
                  aria-describedby={`activity-level-hint${activityLevelError ? ' activity-level-error' : ''}`}
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
                  aria-describedby={`activity-level-hint${activityLevelError ? ' activity-level-error' : ''}`}
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
                  aria-describedby={`activity-level-hint${activityLevelError ? ' activity-level-error' : ''}`}
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
                  aria-describedby={`activity-level-hint${activityLevelError ? ' activity-level-error' : ''}`}
                />
                <span>Very Active (intense exercise 5-7 times per week)</span>
              </label>
            </div>
            {activityLevelError && (
              <p id="activity-level-error" className="field-error" aria-live="polite">must input activity level</p>
            )}
          </fieldset>

          {/* Dietary Restrictions Section */}
          <fieldset className="form-section">
            <legend className="section-label">Dietary Restrictions <span className="select-all">(select all that apply)</span></legend>
            <p className="field-hint" id="dietary-restrictions-hint">Filter meals to match your needs</p>
            <div className="checkbox-group">
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={dietaryRestrictions.includes('vegetarian')}
                  onChange={() => handleDietaryChange('vegetarian')}
                  aria-describedby="dietary-restrictions-hint"
                />
                <span>Vegetarian</span>
              </label>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={dietaryRestrictions.includes('vegan')}
                  onChange={() => handleDietaryChange('vegan')}
                  aria-describedby="dietary-restrictions-hint"
                />
                <span>Vegan</span>
              </label>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={dietaryRestrictions.includes('nut-free')}
                  onChange={() => handleDietaryChange('nut-free')}
                  aria-describedby="dietary-restrictions-hint"
                />
                <span>Nut Free</span>
              </label>
            </div>
          </fieldset>

          {/* Plan Duration Section */}
          <fieldset className="form-section" aria-required="true">
            <legend className="section-label">Plan Duration <span style={{ color: 'red' }} aria-hidden="true">*</span></legend>
            <p className="field-hint" id="plan-duration-hint">How many weeks of meals to generate</p>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="planDuration"
                  value="1"
                  checked={selectedPlanDuration === '1'}
                  onChange={(e) => setSelectedPlanDuration(e.target.value)}
                  aria-describedby={`plan-duration-hint${planDurationError ? ' plan-duration-error' : ''}`}
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
                  aria-describedby={`plan-duration-hint${planDurationError ? ' plan-duration-error' : ''}`}
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
                  aria-describedby={`plan-duration-hint${planDurationError ? ' plan-duration-error' : ''}`}
                />
                <span>Four Weeks</span>
              </label>
            </div>
            {planDurationError && (
              <p id="plan-duration-error" className="field-error" aria-live="polite">must input plan duration</p>
            )}
          </fieldset>

          {/* Start Date Section */}
          <div className="form-section">
            <h2 className="section-label">Start Date <span style={{ color: 'red' }} aria-hidden="true">*</span></h2>
            <p className="field-hint" id="start-date-hint">When your meal plan begins</p>
            <div className="height-inputs">
              <div className="height-field">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="height-select month-select"
                  aria-required="true"
                  aria-describedby={`start-date-hint${startDateError ? ' start-date-error' : ''}`}
                  aria-label="Start month"
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
                  aria-required="true"
                  aria-describedby={`start-date-hint${startDateError ? ' start-date-error' : ''}`}
                  aria-label="Start day"
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
                  aria-required="true"
                  aria-describedby={`start-date-hint${startDateError ? ' start-date-error' : ''}`}
                  aria-label="Start year"
                >
                  {Array.from({ length: 5 }, (_, i) => currentYear + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            {startDateError && (
              <p id="start-date-error" className="field-error" aria-live="polite">must input start date</p>
            )}
          </div>

          {/* Main Validation Error Message */}
          {showValidationErrors && (
            <p className="main-error-message" role="alert">Please fill in all required fields</p>
          )}

          {/* Submit Button */}
          <button 
            type="button" 
            className="generate-plan-button" 
            onClick={handleGeneratePlan}
            aria-label="Generate meal plan based on your preferences and dietary needs"
          >
            Generate Plan
          </button>
          <div
            aria-hidden="true"
            style={{
              fontSize: '0.9em',
              color: '#666',
              marginTop: '0.5em',
              textAlign: 'center',
              position: 'relative',
              top: '0.5em',
              lineHeight: 1.2,
              paddingBottom: 0,
            }}
          >
            Generate Plan and go to your customized meal calender!
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
