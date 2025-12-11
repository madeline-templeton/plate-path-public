# Generate Plan Page - Complete ARIA Label Overview

## Overview
This document provides a comprehensive overview of all ARIA accessibility features implemented on the Generate Your Plan page, demonstrating WCAG 2.1 AA compliance.

---

## Page Structure

### Main Semantic Structure
```tsx
<main role="main" className="generate-plan-page">
  <h1 id="generate-plan-title">Generate Your Plan</h1>
  <form aria-labelledby="generate-plan-title">
    {/* Form sections */}
  </form>
</main>
```

**Screen reader announces:**
- "Main, landmark"
- "Generate Your Plan, heading level 1"
- "Generate Your Plan, form" (when entering form)

---

## Form Sections with ARIA

### 1. Age Section

**Structure:**
```tsx
<div className="form-section">
  <h2>Age *</h2>
  <p id="age-hint">Used to calculate your metabolic rate</p>
  <input 
    type="number"
    aria-required="true"
    aria-describedby="age-hint age-error age-input-error"
  />
</div>
```

**Error Messages:**
- `<div id="age-error" aria-live="polite">` - For age too low/high
- `<p id="age-input-error" aria-live="polite">` - For missing age

**Screen reader experience:**
- "Age, edit text, required, Used to calculate your metabolic rate"
- If error: "Entered age too low. PlatePath cannot responsibly advise on dietary needs at this age"

---

### 2. Sex Section

**Structure:**
```tsx
<fieldset aria-required="true">
  <legend>Sex *</legend>
  <p id="sex-hint">Affects calorie needs</p>
  <div className="radio-group">
    <input type="radio" name="sex" value="M" 
           aria-describedby="sex-hint sex-error" />
    <input type="radio" name="sex" value="F" 
           aria-describedby="sex-hint sex-error" />
  </div>
</fieldset>
```

**Error Messages:**
- `<p id="sex-error" aria-live="polite">must input sex</p>`

**Screen reader experience:**
- "Sex, group, required"
- "Male, radio button, not checked, Affects calorie needs"
- "Female, radio button, not checked, Affects calorie needs"

---

### 3. Height Section

**Structure:**
```tsx
<fieldset className="form-section">
  <legend>Height *</legend>
  <p id="height-hint">For energy requirement calculation</p>
  
  {/* Unit selector */}
  <div role="radiogroup" aria-label="Height unit">
    <input type="radio" name="heightUnit" value="ft-in" />
    <input type="radio" name="heightUnit" value="cm" />
  </div>
  
  {/* Height inputs with aria-label */}
  <select aria-label="Height feet" aria-describedby="height-hint" />
  <select aria-label="Height inches" aria-describedby="height-hint" />
</fieldset>
```

**Error Messages:**
- `<div id="height-error" aria-live="polite">` - For height too low/high
- `<p id="height-input-error" aria-live="polite">` - For missing height

**Screen reader experience:**
- "Height, group"
- "Height unit, radio group"
- "Feet & Inches, radio button, checked"
- "Height feet, popup button, For energy requirement calculation"
- "Height inches, popup button, For energy requirement calculation"

---

### 4. Current Weight Section

**Structure:**
```tsx
<div className="form-section">
  <h2>Current Weight *</h2>
  <p id="weight-hint">For calorie target calculation</p>
  
  {/* Unit selector */}
  <div role="radiogroup" aria-label="Weight unit">
    <input type="radio" name="weightUnit" value="lb" />
    <input type="radio" name="weightUnit" value="kg" />
  </div>
  
  <input type="number" 
         aria-required="true"
         aria-describedby="weight-hint weight-error weight-input-error" />
</div>
```

**Error Messages:**
- `<div id="weight-error" aria-live="polite">` - For weight too low/high
- `<p id="weight-input-error" aria-live="polite">` - For missing weight

**Screen reader experience:**
- "Current Weight, heading level 2"
- "Weight unit, radio group"
- "Pounds (lb), radio button, checked"
- "Edit text, required, For calorie target calculation"

---

### 5. Weight Goals Section

**Structure:**
```tsx
<fieldset aria-required="true">
  <legend>Weight Goals *</legend>
  <p id="weight-goal-hint">Determines your calorie adjustment</p>
  <div className="radio-group">
    <input type="radio" name="weightGoal" value="extreme-loss" 
           aria-describedby="weight-goal-hint weight-goal-error" />
    <input type="radio" name="weightGoal" value="weight-loss" 
           aria-describedby="weight-goal-hint weight-goal-error" />
    <input type="radio" name="weightGoal" value="maintain" 
           aria-describedby="weight-goal-hint weight-goal-error" />
    <input type="radio" name="weightGoal" value="weight-gain" 
           aria-describedby="weight-goal-hint weight-goal-error" />
    <input type="radio" name="weightGoal" value="extreme-gain" 
           aria-describedby="weight-goal-hint weight-goal-error" />
  </div>
</fieldset>
```

**Error Messages:**
- `<p id="weight-goal-error" aria-live="polite">must input weight goal</p>`

**Screen reader experience:**
- "Weight Goals, group, required"
- "Extreme Weight Loss (1-2 lbs per week), radio button, not checked, Determines your calorie adjustment"

---

### 6. Activity Level Section

**Structure:**
```tsx
<fieldset aria-required="true">
  <legend>Activity Level *</legend>
  <p id="activity-level-hint">Affects your daily calorie target</p>
  <div className="radio-group">
    <input type="radio" name="activityLevel" value="not-active" 
           aria-describedby="activity-level-hint activity-level-error" />
    <input type="radio" name="activityLevel" value="lightly-active" 
           aria-describedby="activity-level-hint activity-level-error" />
    <input type="radio" name="activityLevel" value="moderately-active" 
           aria-describedby="activity-level-hint activity-level-error" />
    <input type="radio" name="activityLevel" value="active" 
           aria-describedby="activity-level-hint activity-level-error" />
    <input type="radio" name="activityLevel" value="very-active" 
           aria-describedby="activity-level-hint activity-level-error" />
  </div>
</fieldset>
```

**Error Messages:**
- `<p id="activity-level-error" aria-live="polite">must input activity level</p>`

**Screen reader experience:**
- "Activity Level, group, required"
- "Not Active, radio button, not checked, Affects your daily calorie target"
- "Lightly Active (exercise 1-3 days per week), radio button, not checked, Affects your daily calorie target"

---

### 7. Dietary Restrictions Section

**Structure:**
```tsx
<fieldset>
  <legend>Dietary Restrictions (select all that apply)</legend>
  <p id="dietary-restrictions-hint">Filter meals to match your needs</p>
  <div className="checkbox-group">
    <input type="checkbox" aria-describedby="dietary-restrictions-hint" />
    {/* Multiple checkboxes for: vegetarian, vegan, dairy-free, nut-free, gluten-free */}
  </div>
</fieldset>
```

**Screen reader experience:**
- "Dietary Restrictions (select all that apply), group"
- "Vegetarian, checkbox, not checked, Filter meals to match your needs"
- "Vegan, checkbox, not checked, Filter meals to match your needs"

---

### 8. Plan Duration Section

**Structure:**
```tsx
<fieldset aria-required="true">
  <legend>Plan Duration *</legend>
  <p id="plan-duration-hint">How many weeks of meals to generate</p>
  <div className="radio-group">
    <input type="radio" name="planDuration" value="1" 
           aria-describedby="plan-duration-hint plan-duration-error" />
    <input type="radio" name="planDuration" value="2" 
           aria-describedby="plan-duration-hint plan-duration-error" />
    <input type="radio" name="planDuration" value="4" 
           aria-describedby="plan-duration-hint plan-duration-error" />
  </div>
</fieldset>
```

**Error Messages:**
- `<p id="plan-duration-error" aria-live="polite">must input plan duration</p>`

**Screen reader experience:**
- "Plan Duration, group, required"
- "One Week, radio button, not checked, How many weeks of meals to generate"
- "Two Weeks, radio button, not checked, How many weeks of meals to generate"

---

### 9. Start Date Section

**Structure:**
```tsx
<div className="form-section">
  <h2>Start Date *</h2>
  <p id="start-date-hint">When your meal plan begins</p>
  <div className="height-inputs">
    <select aria-label="Start month" 
            aria-required="true"
            aria-describedby="start-date-hint start-date-error" />
    <select aria-label="Start day" 
            aria-required="true"
            aria-describedby="start-date-hint start-date-error" />
    <select aria-label="Start year" 
            aria-required="true"
            aria-describedby="start-date-hint start-date-error" />
  </div>
</div>
```

**Error Messages:**
- `<p id="start-date-error" aria-live="polite">must input start date</p>`

**Screen reader experience:**
- "Start Date, heading level 2"
- "Start month, popup button, required, When your meal plan begins"
- "Start day, popup button, required, When your meal plan begins"
- "Start year, popup button, required, When your meal plan begins"

---

### 10. Submit Button

**Structure:**
```tsx
<button 
  type="button"
  onClick={handleGeneratePlan}
  aria-label="Generate meal plan based on your preferences and dietary needs"
>
  Generate Plan
</button>
```

**Screen reader experience:**
- "Generate meal plan based on your preferences and dietary needs, button"
- Visual text: "Generate Plan"
- ARIA label provides full context

---

### 11. Main Validation Error

**Structure:**
```tsx
{showValidationErrors && (
  <p className="main-error-message" role="alert">
    Please fill in all required fields
  </p>
)}
```

**Screen reader experience:**
- Announces immediately (assertive): "Please fill in all required fields"
- `role="alert"` makes it automatically `aria-live="assertive"`

---

## ARIA Attributes Summary

### Required Field Indicators
- All required inputs have `aria-required="true"`
- Red asterisks (*) have `aria-hidden="true"` (visual only)

### Error Announcements
- **Individual field errors**: `aria-live="polite"` (waits for user to pause)
- **Main validation error**: `role="alert"` (interrupts immediately)
- All errors have unique IDs for referencing

### Error Connections
- Inputs use `aria-describedby` to connect to:
  - Hint text (e.g., "age-hint")
  - Error messages (e.g., "age-error", "age-input-error")
  - Multiple IDs are space-separated

### Radio Groups
- Main option groups use `<fieldset>` and `<legend>`
- Unit selectors use `role="radiogroup"` with `aria-label`
- All radio inputs connected to hints via `aria-describedby`

### Dropdown Selects
- All dropdowns have `aria-label` describing their purpose
- Connected to hints via `aria-describedby`
- `aria-required="true"` on required dropdowns

---

## Complete Keyboard Navigation Flow

### Tab Order:
1. Age input
2. Sex radio buttons (Male → Female)
3. Height unit selector (Feet & Inches → Centimeters)
4. Height feet dropdown
5. Height inches dropdown
6. Weight unit selector (Pounds → Kilograms)
7. Weight input
8. Weight goal radio buttons (5 options)
9. Activity level radio buttons (5 options)
10. Dietary restriction checkboxes (5 options)
11. Plan duration radio buttons (3 options)
12. Start date dropdowns (Month → Day → Year)
13. Generate Plan button

### Landmark Navigation:
- Press `D` to jump to "Main, landmark"
- Press `F` to jump to form
- Press `H` to cycle through headings (H1 and H2)
- Press `B` to jump directly to "Generate Plan" button

---

## Error Announcement Behavior

### Real-Time Validation (as user types):
**Age too low:**
```
[User types 15]
[Brief pause]
"Entered age too low. PlatePath cannot responsibly advise on dietary needs at this age"
```

**Weight too high:**
```
[User types 600]
[Brief pause]
"Entered weight too high. PlatePath cannot responsibly advise on dietary needs at this weight"
```

### Form Submission Validation:
**Missing required fields:**
```
[User clicks "Generate Plan" with empty fields]
[Immediately announces]
"Please fill in all required fields"

[User tabs to age field]
"Age, edit text, required, Used to calculate your metabolic rate, must input age"
```

---

## Accessibility Best Practices Demonstrated

1. ✅ **Semantic HTML**: Uses `<main>`, `<form>`, `<fieldset>`, `<legend>`, `<label>`
2. ✅ **Landmark regions**: Main landmark for page content
3. ✅ **Form labeling**: Form connected to page title via `aria-labelledby`
4. ✅ **Required fields**: `aria-required="true"` on all required inputs
5. ✅ **Descriptive hints**: All fields have hint text via `aria-describedby`
6. ✅ **Error announcements**: Live regions announce validation errors
7. ✅ **Error connections**: Errors connected to inputs via `aria-describedby`
8. ✅ **Radio groups**: Proper grouping with `<fieldset>`/`<legend>` and `role="radiogroup"`
9. ✅ **Button context**: Submit button has descriptive `aria-label`
10. ✅ **Visual decorations hidden**: Red asterisks use `aria-hidden="true"`
11. ✅ **Alert for critical errors**: Main validation uses `role="alert"`
12. ✅ **Unique IDs**: All error messages and hints have unique IDs

---

## Testing Recommendations

### Test with:
- **VoiceOver** (Mac): Cmd + F5 to enable
- **NVDA** (Windows): Free screen reader
- **JAWS** (Windows): Professional screen reader

### Test scenarios:
1. Navigate form using only Tab key
2. Test required field validation
3. Trigger age/weight/height validation errors
4. Submit form with missing fields
5. Use landmark navigation to jump to form
6. Test radio button groups with arrow keys
7. Verify error announcements with screen reader
8. Test unit selector toggles
9. Navigate dropdowns with keyboard
10. Verify all hint text is announced

---

## Error Message Matrix

| Field | Input Error ID | Validation Error ID | aria-live |
|-------|---------------|---------------------|-----------|
| Age | `age-input-error` | `age-error` | polite |
| Sex | `sex-error` | - | polite |
| Height | `height-input-error` | `height-error` | polite |
| Weight | `weight-input-error` | `weight-error` | polite |
| Weight Goal | `weight-goal-error` | - | polite |
| Activity Level | `activity-level-error` | - | polite |
| Plan Duration | `plan-duration-error` | - | polite |
| Start Date | `start-date-error` | - | polite |
| **Main Validation** | - | (role="alert") | **assertive** |

---

## User Experience Benefits

**For screen reader users:**
- Clear understanding of all form requirements
- Real-time feedback on validation errors
- Descriptive context for all inputs
- Logical navigation structure
- Appropriate error severity (polite vs assertive)

**For keyboard-only users:**
- All functionality accessible via keyboard
- Logical tab order
- Radio buttons navigable with arrow keys
- No mouse required

**For all users:**
- Clear error messaging
- Helpful hint text
- Required fields clearly marked
- Validation provides actionable feedback

---

This implementation ensures the Generate Plan page is fully accessible and provides an excellent experience for all users, meeting WCAG 2.1 AA accessibility standards.
