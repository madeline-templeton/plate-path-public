import { useEffect, useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import axios from "axios";
import './GeneratePlan.css';
import { useNavigate } from 'react-router-dom';
import { auth } from "../../services/firebase";
import { useAuth } from '../../contexts/AuthContext';

export default function GeneratePlan() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

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
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft-in" | "inch" | "m">("cm");
  const [heightValue, setHeightValue] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  
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
  const [heightError, setHeightError] = useState<'too-low' | 'too-high' | null>(null);

  const [hasLoadedUserInfo, setHasLoadedUserInfo] = useState(false);
  const [consentGranted, setConsentGranted] = useState(false);
  const [hasLoadedConsent, setHasLoadedConsent] = useState(false);



  const handleWeightChange = (value: string) => {
    console.log("Prev weight", weight);
    console.log("New weight", value);
    setWeight(value);
    const numValue = parseFloat(value);
    console.log("Parsed", numValue);
    
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

  const handleHeightChange = (value: string) => {
    console.log("Prev height", heightValue);
    console.log("New height", value);
    setHeightValue(value);
    const numValue = parseFloat(value);
    console.log("Parsed", numValue);

    
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
      } else if (heightUnit === "inch") {
        if (numValue < 48) {
          setHeightError('too-low');
        } else if (numValue > 108) {
          setHeightError('too-high');
        } else {
          setHeightError(null);
        }
      } else if (heightUnit === "m") {
        if (numValue < 1.2) {
          setHeightError('too-low');
        } else if (numValue > 2.7) {
          setHeightError('too-high');
        } else {
          setHeightError(null);
        }
      }
    }
  };

  const handleAgeChange = (value: string) => {
    console.log("Prev age", selectedAge);
    console.log("New age", value);
    setSelectedAge(value);
    const numValue = parseFloat(value);
    console.log("Parsed", numValue);
    
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

    if (heightUnit === 'ft-in') {
      if (!heightFeet || heightFeet === '-') {
        setHeightFeetError(true);
        hasErrors = true;
      }
      if (!heightInches || heightInches === '-') {
        setHeightInchesError(true);
        hasErrors = true;
      }
    } else {
      if (!heightValue) {
        setHeightFeetError(true); // Reuse this error state
        hasErrors = true;
      }
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
        if (consentGranted){
          console.log("updating planner")
          await updatePlanner(response.data.planner);
          await updateUserInfo(constraints);
        }
        navigate("/calendar", {state: {planner: response.data.planner}});
      }
    } catch (error){
      console.error(error);
    }
  }

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
        console.log("planner saved successfully")
      }
      else{
        console.log(response.status);
        console.error(response.data.message);
      }
    } catch (error){
      console.error(error);
    }
  }


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
        console.log("User info saved successfully")
      }
      else{
        console.log(response.status);
        console.error(response.data.message);
      } 

    } catch (error){
      console.error(error, "Failed to update userInformation");
    }
  }
  

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
        } else if (response.data.userInfo.height.unit === "m"){
          setHeightUnit("m");
          setHeightValue(response.data.userInfo.height.value[0]);
        } else if (response.data.userInfo.height.unit === "cm"){
          setHeightUnit("cm");
          setHeightValue(response.data.userInfo.height.value[0]);
        } else if (response.data.userInfo.height.unit === "inch"){
          setHeightUnit("inch");
          setHeightValue(response.data.userInfo.height.value[0]);
        }
        console.log(response.data.userInfo.weight.value[0]);
        if (response.data.userInfo.weight.unit === "kg"){
          setWeightUnit("kg");
          setWeight(response.data.userInfo.weight.value);
        } else {
          setWeightUnit("lb");
          setWeight(response.data.userInfo.weight.value);
        } 

        setHasLoadedUserInfo(true);
      } else {
        console.log(`No data in memory for user ${currentUser?.id}`);
      }
    } catch (error: any){
      console.error(error, "Failed to get userInformation");
      setHasLoadedUserInfo(true);

    }
  }

  useEffect(() => {
    if (currentUser && !hasLoadedUserInfo && !hasLoadedConsent){
      getConsent();
      getUserInfo();
    }
  }, [currentUser]);

  const getConsent = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/getUserConsent/${currentUser?.id}`);
      console.log(response.data)

      if (response.data.success && response.data.exists){
        if (response.data.consent.consent === "granted"){
          console.log("here");
          setConsentGranted(true);
        }
      } else {
        console.log("there");
        setConsentGranted(false);
      }
      setHasLoadedConsent(true);
    } catch (error){
      console.error(error, "Error while fetching consent");
      setHasLoadedConsent(true);
    }
  }



  return (
    <>
      <Header />
      <div className="generate-plan-page">
        <h1 className="plan-title">Generate Your Plan</h1>
        
        <form className="plan-form">
          {/* Age Section */}

          {/* Current Age Section */}
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

            <div className="unit-selector">
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
              <label className="unit-option">
                <input
                  type="radio"
                  name="heightUnit"
                  value="m"
                  checked={heightUnit === 'm'}
                  onChange={(e) => setHeightUnit(e.target.value as "m")}
                />
                <span>Meters</span>
              </label>
              <label className="unit-option">
                <input
                  type="radio"
                  name="heightUnit"
                  value="inch"
                  checked={heightUnit === 'inch'}
                  onChange={(e) => setHeightUnit(e.target.value as "inch")}
                />
                <span>Inches</span>
              </label>
            </div>



            {/* Conditional height input based on unit */}
            {heightUnit === 'ft-in' ? (
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
                    {Array.from({ length: 12 }, (_, i) => i).map(inch => (
                      <option key={inch} value={inch}>{inch}</option>
                    ))}
                  </select>
                  <span className="unit-label">inches</span>
                </div>
              </div>
            ) : (
              <div className="weight-input">
                <input
                  type="number"
                  value={heightValue}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  placeholder=""
                  min="0"
                />
                <span className="unit-label">{heightUnit}</span>
              </div>
            )}

            {heightError && (
              <div className="weight-error">
                <p className="error-message">
                  {heightError === 'too-low' ? 'Entered height too low' : 'Entered height too high'}
                </p>
                <p className="error-disclaimer">
                  PlatePath cannot responsibly advise on dietary needs at this height
                </p>
              </div>
            )}
          
            {(heightFeetError || heightInchesError) && (
              <p className="field-error">must input height</p>
            )}
          </div>

          {/* Current Weight Section */}
          <div className="form-section">
            <h2 className="section-label">Current Weight</h2>

            {/* Unit selector */}
            <div className="unit-selector">
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
                    handleWeightChange(weight); // Re-validate with new unit
                  }}
                />
                <span>Kilograms (kg)</span>
              </label>
            </div>

            <div className="weight-input">
              <input
                type="number"
                value={weight}
                onChange={(e) => handleWeightChange(e.target.value)}
                placeholder=""
                min={weightUnit === 'lb' ? "75" : "34"}
                max={weightUnit === 'lb' ? "550" : "250"}
              />
              <span className="unit-label">{weightUnit}</span>
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
