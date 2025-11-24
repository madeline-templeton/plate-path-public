import { useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import './GeneratePlan.css';

export default function GeneratePlan() {
  const [selectedAge, setSelectedAge] = useState('');
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedWeightGoal, setSelectedWeightGoal] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [weightError, setWeightError] = useState<'too-low' | 'too-high' | null>(null);
  const [selectedActivityLevel, setSelectedActivityLevel] = useState('');
  const [selectedPlanDuration, setSelectedPlanDuration] = useState('');
  
  // Validation errors
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [heightFeetError, setHeightFeetError] = useState(false);
  const [heightInchesError, setHeightInchesError] = useState(false);
  const [weightInputError, setWeightInputError] = useState(false);
  const [weightGoalError, setWeightGoalError] = useState(false);
  const [activityLevelError, setActivityLevelError] = useState(false);
  const [planDurationError, setPlanDurationError] = useState(false);

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

  const handleDietaryChange = (restriction: string) => {
    if (dietaryRestrictions.includes(restriction)) {
      setDietaryRestrictions(dietaryRestrictions.filter(r => r !== restriction));
    } else {
      setDietaryRestrictions([...dietaryRestrictions, restriction]);
    }
  };

  const handleGeneratePlan = () => {
    // Reset errors
    setShowValidationErrors(false);
    setAgeError(false);
    setHeightFeetError(false);
    setHeightInchesError(false);
    setWeightInputError(false);
    setWeightGoalError(false);
    setActivityLevelError(false);
    setPlanDurationError(false);

    // Validate all required fields
    let hasErrors = false;

    if (!selectedAge) {
      setAgeError(true);
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

    if (hasErrors) {
      setShowValidationErrors(true);
    } else {
      // Form is valid - functionality to be added later
      console.log('Form is valid, ready to generate plan');
    }
  };

  return (
    <>
      <Header />
      <div className="generate-plan-page">
        <h1 className="plan-title">Generate Your Plan</h1>
        
        <form className="plan-form">
          {/* Age Section */}
          <div className="form-section">
            <h2 className="section-label">Age</h2>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="age"
                  value="18-25"
                  checked={selectedAge === '18-25'}
                  onChange={(e) => setSelectedAge(e.target.value)}
                />
                <span>18-25</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="age"
                  value="25-35"
                  checked={selectedAge === '25-35'}
                  onChange={(e) => setSelectedAge(e.target.value)}
                />
                <span>25-35</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="age"
                  value="35-45"
                  checked={selectedAge === '35-45'}
                  onChange={(e) => setSelectedAge(e.target.value)}
                />
                <span>35-45</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="age"
                  value="45-55"
                  checked={selectedAge === '45-55'}
                  onChange={(e) => setSelectedAge(e.target.value)}
                />
                <span>45-55</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="age"
                  value="55-65"
                  checked={selectedAge === '55-65'}
                  onChange={(e) => setSelectedAge(e.target.value)}
                />
                <span>55-65</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="age"
                  value="65+"
                  checked={selectedAge === '65+'}
                  onChange={(e) => setSelectedAge(e.target.value)}
                />
                <span>65+</span>
              </label>
            </div>
            {ageError && (
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
                <span>extreme weight loss (1-2 lbs per week)</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="weightGoal"
                  value="weight-loss"
                  checked={selectedWeightGoal === 'weight-loss'}
                  onChange={(e) => setSelectedWeightGoal(e.target.value)}
                />
                <span>weight loss (0.5-1 lbs per week)</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="weightGoal"
                  value="maintain"
                  checked={selectedWeightGoal === 'maintain'}
                  onChange={(e) => setSelectedWeightGoal(e.target.value)}
                />
                <span>maintain weight</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="weightGoal"
                  value="weight-gain"
                  checked={selectedWeightGoal === 'weight-gain'}
                  onChange={(e) => setSelectedWeightGoal(e.target.value)}
                />
                <span>weight gain (0.5-1 lbs per week)</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="weightGoal"
                  value="extreme-gain"
                  checked={selectedWeightGoal === 'extreme-gain'}
                  onChange={(e) => setSelectedWeightGoal(e.target.value)}
                />
                <span>extreme weight gain (1-2 lbs per week)</span>
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
                  value="no-activity"
                  checked={selectedActivityLevel === 'no-activity'}
                  onChange={(e) => setSelectedActivityLevel(e.target.value)}
                />
                <span>No Activity</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="activityLevel"
                  value="light-activity"
                  checked={selectedActivityLevel === 'light-activity'}
                  onChange={(e) => setSelectedActivityLevel(e.target.value)}
                />
                <span>Light Activity (exercise 1-3 days per week)</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="activityLevel"
                  value="moderate-activity"
                  checked={selectedActivityLevel === 'moderate-activity'}
                  onChange={(e) => setSelectedActivityLevel(e.target.value)}
                />
                <span>Moderate Activity (exercise 3-4 times per week)</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="activityLevel"
                  value="high-activity"
                  checked={selectedActivityLevel === 'high-activity'}
                  onChange={(e) => setSelectedActivityLevel(e.target.value)}
                />
                <span>High Activity (exercise 5-7 times per week)</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="activityLevel"
                  value="extremely-high-activity"
                  checked={selectedActivityLevel === 'extremely-high-activity'}
                  onChange={(e) => setSelectedActivityLevel(e.target.value)}
                />
                <span>Extremely High Activity (intense exercise 5-7 times per week)</span>
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
                  value="one-week"
                  checked={selectedPlanDuration === 'one-week'}
                  onChange={(e) => setSelectedPlanDuration(e.target.value)}
                />
                <span>One Week</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="planDuration"
                  value="two-weeks"
                  checked={selectedPlanDuration === 'two-weeks'}
                  onChange={(e) => setSelectedPlanDuration(e.target.value)}
                />
                <span>Two Weeks</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="planDuration"
                  value="four-weeks"
                  checked={selectedPlanDuration === 'four-weeks'}
                  onChange={(e) => setSelectedPlanDuration(e.target.value)}
                />
                <span>Four Weeks</span>
              </label>
            </div>
            {planDurationError && (
              <p className="field-error">must input plan duration</p>
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
