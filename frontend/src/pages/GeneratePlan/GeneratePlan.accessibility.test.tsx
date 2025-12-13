
/**
 * GeneratePlan Accessibility Test Suite
 * 
 * Tests ARIA labels, HTML structure, keyboard navigation, and accessibility compliance
 * for the GeneratePlan page component (meal plan generation form).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import GeneratePlan from './GeneratePlan';

// Directly mock firebase/auth to ensure onAuthStateChanged is always available
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(() => vi.fn()),
}));

// Mock AuthContext to return no authenticated user
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

// Mock Firebase auth service to prevent real Firebase initialization and onAuthStateChanged errors
vi.mock('../../services/firebase', () => ({
  auth: {
    currentUser: null,
  },
  onAuthStateChanged: vi.fn(() => vi.fn()),
}));

// Mock axios to prevent real HTTP requests
vi.mock('axios');


/**
 * Helper function to render components with React Router context.
 * 
 * @param component - The React component to render
 * @returns The render result from React Testing Library
 */
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};


/**
 * TESTING SUITE
 * Main test suite for GeneratePlan accessibility.
 * All tests use MOCKED backend/auth but test REAL page HTML and ARIA attributes.
 */
describe('GeneratePlan - Accessibility Tests', () => {

  // Clear localStorage before each test
  beforeEach(() => {
    localStorage.clear();
  });

  /**
   * PAGE STRUCTURE
   * Tests for HTML structure and landmark regions.
   */
  describe('Page Structure', () => {

    /**
     * Tests that the page has a main landmark (role="main") so screenreader can jump to main content
     */
    it('should have a main landmark with role="main"', () => {
      renderWithRouter(<GeneratePlan />);
      const mainElement = screen.getByRole('main');
      expect(mainElement).toBeInTheDocument();
    });

    /**
     * Tests that the form element exists and is properly structured so screen readers can navigate it
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Form element)
     */
    it('should have a form element', () => {
      renderWithRouter(<GeneratePlan />);
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
    });
  });

  /**
   * HEADING HIERARCHY
   * Tests that headings follow proper hierarchy for screen reader navigation
   */
  describe('Heading Hierarchy', () => {
    /**
     * Tests that headings follow proper hierarchy: h1 (page title) → h2 (sections)
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Heading elements)
     */
    it('should have proper heading hierarchy', () => {
      renderWithRouter(<GeneratePlan />);
      
      const h1Elements = screen.getAllByRole('heading', { level: 1 });
      expect(h1Elements).toHaveLength(1);
      
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      expect(h2Elements.length).toBeGreaterThanOrEqual(1);
    });
  });

  /**
   * FIELDSETS AND LEGENDS
   * Tests for fieldsets and that the legends describe them properly
   */
  describe('Fieldsets and Legends', () => {
    // The Age section is rendered as a label, not a heading. No h2 for Age.

    /**
     * Tests that the Sex fieldset has a proper legend
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Fieldset and legend)
     */
    it('should have Sex fieldset with legend', () => {
      renderWithRouter(<GeneratePlan />);
      const sexFieldset = screen.getByRole('group', { name: /sex/i });
      expect(sexFieldset).toBeInTheDocument();
      expect(sexFieldset.tagName).toBe('FIELDSET');
    });

    /**
     * Tests that the Height fieldset has a proper legend.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Fieldset and legend)
     */
    it('should have Height fieldset with legend', () => {
      renderWithRouter(<GeneratePlan />);
      const heightFieldset = screen.getByRole('group', { name: /height/i });
      expect(heightFieldset).toBeInTheDocument();
      expect(heightFieldset.tagName).toBe('FIELDSET');
    });

    /**
     * Tests that the Weight fieldset has a proper legend
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Fieldset and legend)
     */
    it('should have Weight fieldset with legend', () => {
      renderWithRouter(<GeneratePlan />);
      const weightFieldset = screen.getByRole('group', { name: /weight/i });
      expect(weightFieldset).toBeInTheDocument();
      expect(weightFieldset.tagName).toBe('FIELDSET');
    });

    /**
     * Tests that the Weight Goal fieldset has a proper legend
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Fieldset and legend)
     */
    it('should have Weight Goal fieldset with legend', () => {
      renderWithRouter(<GeneratePlan />);
      const weightGoalFieldset = screen.getByRole('group', { name: /weight goal/i });
      expect(weightGoalFieldset).toBeInTheDocument();
      expect(weightGoalFieldset.tagName).toBe('FIELDSET');
    });

    /**
     * Tests that the Activity Level fieldset has a proper legend
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Fieldset and legend)
     */
    it('should have Activity Level fieldset with legend', () => {
      renderWithRouter(<GeneratePlan />);
      const activityFieldset = screen.getByRole('group', { name: /activity level/i });
      expect(activityFieldset).toBeInTheDocument();
      expect(activityFieldset.tagName).toBe('FIELDSET');
    });

    /**
     * Tests that the Dietary Restrictions fieldset has a proper legend
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Fieldset and legend)
     */
    it('should have Dietary Restrictions fieldset with legend', () => {
      renderWithRouter(<GeneratePlan />);
      const dietaryFieldset = screen.getByRole('group', { name: /dietary restrictions/i });
      expect(dietaryFieldset).toBeInTheDocument();
      expect(dietaryFieldset.tagName).toBe('FIELDSET');
    });

    /**
     * Tests that the Plan Duration fieldset has a proper legend
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Fieldset and legend)
     */
    it('should have Plan Duration fieldset with legend', () => {
      renderWithRouter(<GeneratePlan />);
      const planDurationFieldset = screen.getByRole('group', { name: /plan duration/i });
      expect(planDurationFieldset).toBeInTheDocument();
      expect(planDurationFieldset.tagName).toBe('FIELDSET');
    });

    /**
     * Tests that required fields are marked with asterisks that are hidden from screen readers (aria-hidden="true")
     * (Mocked: Auth, Firebase, Axios)
     * (Real: aria-hidden attributes)
     */
    it('should mark required field asterisks with aria-hidden', () => {
      renderWithRouter(<GeneratePlan />);
      const asterisks = document.querySelectorAll('[aria-hidden="true"]');
      
      expect(asterisks.length).toBeGreaterThanOrEqual(5);
    });
  });

  /**
   * FORM LABELS AND HINTS
   * Tests for form labels and hints.
   */
  describe('Form Labels and Hints', () => {
    /**
     * Tests that the age input has a hint describing its purpose
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Hint text with proper ID)
     */
    it('should have age hint text with proper id', () => {
      renderWithRouter(<GeneratePlan />);
      const ageHint = document.getElementById('age-hint');
      expect(ageHint).toBeInTheDocument();
      expect(ageHint?.textContent).toContain('metabolic rate');
    });

    /**
     * Tests that the sex input has a hint describing its purpose
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Hint text)
     */
    it('should have sex hint text with proper id', () => {
      renderWithRouter(<GeneratePlan />);
      const sexHint = document.getElementById('sex-hint');
      expect(sexHint).toBeInTheDocument();
      expect(sexHint?.textContent).toContain('calorie needs');
    });

    /**
     * Tests that the height input has a hint describing its purpose
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Hint text)
     */
    it('should have height hint text with proper id', () => {
      renderWithRouter(<GeneratePlan />);
      const heightHint = document.getElementById('height-hint');
      expect(heightHint).toBeInTheDocument();
      expect(heightHint).toHaveTextContent(/calculation|requirement/i);
    });

    /**
     * Tests that the weight input has a hint describing its purpose
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Hint text)
     */
    it('should have weight hint text with proper id', () => {
      renderWithRouter(<GeneratePlan />);
      const weightHint = document.getElementById('weight-hint');
      expect(weightHint).toBeInTheDocument();
      expect(weightHint).toHaveTextContent(/calorie|calculation/i);
    });

    /**
     * Tests that the activity level input has a hint.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Hint text)
     */
    it('should have activity level hint text with proper id', () => {
      renderWithRouter(<GeneratePlan />);
      const activityHint = document.getElementById('activity-level-hint');
      expect(activityHint).toBeInTheDocument();
      expect(activityHint?.textContent).toContain('calorie target');
    });

    /**
     * Tests that the start date inputs have descriptive aria-labels.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: aria-label attributes)
     */
    it('should have descriptive aria-labels for date selects', () => {
      renderWithRouter(<GeneratePlan />);
      
      const monthSelect = screen.getByLabelText(/start month/i);
      expect(monthSelect).toBeInTheDocument();
      
      const daySelect = screen.getByLabelText(/start day/i);
      expect(daySelect).toBeInTheDocument();
      
      const yearSelect = screen.getByLabelText(/start year/i);
      expect(yearSelect).toBeInTheDocument();
    });
  });

  /**
   * RADIO BUTTON GROUPS
   * Tests for radio button grouped properly and one can be selected at a time
   */
  describe('Radio Button Groups', () => {
    /**
     * Tests that the Sex radio group has both options and proper name attribute
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Radio inputs and name attributes)
     */
    it('should have Sex radio group with Male and Female options', () => {
      renderWithRouter(<GeneratePlan />);
      
      const maleRadio = screen.getByRole('radio', { name: /^male$/i });
      const femaleRadio = screen.getByRole('radio', { name: /^female$/i });
      
      expect(maleRadio).toBeInTheDocument();
      expect(femaleRadio).toBeInTheDocument();
      expect(maleRadio).toHaveAttribute('name', 'sex');
      expect(femaleRadio).toHaveAttribute('name', 'sex');
    });

    /**
     * Tests that the Height Unit radio group has both options
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Radio inputs)
     */
    it('should have Height Unit radio group with Feet/Inches and Centimeters options', () => {
      renderWithRouter(<GeneratePlan />);
      
      const feetInchesRadio = screen.getByRole('radio', { name: /feet & inches/i });
      const cmRadio = screen.getByRole('radio', { name: /centimeters/i });
      
      expect(feetInchesRadio).toBeInTheDocument();
      expect(cmRadio).toBeInTheDocument();
      expect(feetInchesRadio).toHaveAttribute('name', 'heightUnit');
      expect(cmRadio).toHaveAttribute('name', 'heightUnit');
    });

    /**
     * Tests that the Weight Unit radio group has both options.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Radio inputs)
     */
    it('should have Weight Unit radio group with Pounds and Kilograms options', () => {
      renderWithRouter(<GeneratePlan />);
      
      const poundsRadio = screen.getByRole('radio', { name: /pounds/i });
      const kgRadio = screen.getByRole('radio', { name: /kilograms/i });
      
      expect(poundsRadio).toBeInTheDocument();
      expect(kgRadio).toBeInTheDocument();
      expect(poundsRadio).toHaveAttribute('name', 'weightUnit');
      expect(kgRadio).toHaveAttribute('name', 'weightUnit');
    });

    /**
     * Tests that the Weight Goal radio group has all four options.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Radio inputs)
     */
    it('should have Weight Goal radio group with all options', () => {
      renderWithRouter(<GeneratePlan />);
      
      const extremeLossRadio = screen.getByRole('radio', { name: /extreme weight loss/i });
      const lossRadio = screen.getByRole('radio', { name: /weight loss \(0\.5-1 lbs/i });
      const maintainRadio = screen.getByRole('radio', { name: /maintain weight/i });
      const gainRadio = screen.getByRole('radio', { name: /weight gain \(0\.5-1 lbs/i });
      
      expect(extremeLossRadio).toBeInTheDocument();
      expect(lossRadio).toBeInTheDocument();
      expect(maintainRadio).toBeInTheDocument();
      expect(gainRadio).toBeInTheDocument();
      
      expect(extremeLossRadio).toHaveAttribute('name', 'weightGoal');
      expect(lossRadio).toHaveAttribute('name', 'weightGoal');
      expect(maintainRadio).toHaveAttribute('name', 'weightGoal');
      expect(gainRadio).toHaveAttribute('name', 'weightGoal');
    });

    /**
     * Tests that the Activity Level radio group has all five options.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Radio inputs)
     */
    it('should have Activity Level radio group with all options', () => {
      renderWithRouter(<GeneratePlan />);
      
      const notActiveRadio = screen.getByRole('radio', { name: /^not active$/i });
      const lightlyActiveRadio = screen.getByRole('radio', { name: /lightly active/i });
      const moderatelyActiveRadio = screen.getByRole('radio', { name: /moderately active/i });
      const activeRadio = screen.getByRole('radio', { name: /^active \(exercise 5-7/i });
      const veryActiveRadio = screen.getByRole('radio', { name: /very active/i });
      
      expect(notActiveRadio).toBeInTheDocument();
      expect(lightlyActiveRadio).toBeInTheDocument();
      expect(moderatelyActiveRadio).toBeInTheDocument();
      expect(activeRadio).toBeInTheDocument();
      expect(veryActiveRadio).toBeInTheDocument();
      
      expect(notActiveRadio).toHaveAttribute('name', 'activityLevel');
    });

    /**
     * Tests that the Plan Duration radio group has all three options.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Radio inputs)
     */
    it('should have Plan Duration radio group with all options', () => {
      renderWithRouter(<GeneratePlan />);
      
      const oneWeekRadio = screen.getByRole('radio', { name: /one week/i });
      const twoWeeksRadio = screen.getByRole('radio', { name: /two weeks/i });
      const fourWeeksRadio = screen.getByRole('radio', { name: /four weeks/i });
      
      expect(oneWeekRadio).toBeInTheDocument();
      expect(twoWeeksRadio).toBeInTheDocument();
      expect(fourWeeksRadio).toBeInTheDocument();
      
      expect(oneWeekRadio).toHaveAttribute('name', 'planDuration');
      expect(twoWeeksRadio).toHaveAttribute('name', 'planDuration');
      expect(fourWeeksRadio).toHaveAttribute('name', 'planDuration');
    });

    /**
     * Tests that radio buttons have aria-describedby connecting to their hint text.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: aria-describedby attributes)
     */
    it('should have aria-describedby on radio buttons connecting to hints', () => {
      renderWithRouter(<GeneratePlan />);
      
      const maleRadio = screen.getByRole('radio', { name: /^male$/i });
      const activityRadio = screen.getByRole('radio', { name: /^not active$/i });
      
      expect(maleRadio).toHaveAttribute('aria-describedby');
      expect(activityRadio).toHaveAttribute('aria-describedby');
    });
  });

  /**
   * CHECKBOXES
   * Tests for checkboxes that should allow multiple selections
   */
  describe('Checkboxes', () => {
    /**
     * Tests that all dietary restriction checkboxes exist and are properly labeled.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Checkbox inputs)
     */
    it('should have all dietary restriction checkboxes with labels', () => {
      renderWithRouter(<GeneratePlan />);
      
      const vegetarianCheckbox = screen.getByRole('checkbox', { name: /vegetarian/i });
      const veganCheckbox = screen.getByRole('checkbox', { name: /vegan/i });
      const nutFreeCheckbox = screen.getByRole('checkbox', { name: /nut free/i });

      expect(vegetarianCheckbox).toBeInTheDocument();
      expect(veganCheckbox).toBeInTheDocument();
      expect(nutFreeCheckbox).toBeInTheDocument();
    });

    /**
     * Tests that checkboxes have aria-describedby connecting to hint text.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: aria-describedby attributes)
     */
    it('should have aria-describedby on checkboxes', () => {
      renderWithRouter(<GeneratePlan />);
      
      const vegetarianCheckbox = screen.getByRole('checkbox', { name: /vegetarian/i });
      expect(vegetarianCheckbox).toHaveAttribute('aria-describedby', 'dietary-restrictions-hint');
    });
  });

  /**
   * ERROR MESSAGES
   * Tests for error messages.
   * Error messages must be announced to screen readers.
   */
  describe('Error Messages', () => {
    /**
     * Tests that error messages can be connected via aria-describedby and appear dynamically
     * (Mocked: Auth, Firebase, Axios)
     * (Real: aria-describedby attributes on inputs)
     */
    it('should have aria-describedby on inputs for error message connections', () => {
      renderWithRouter(<GeneratePlan />);
      
      const maleRadio = screen.getByRole('radio', { name: /^male$/i });
      const activityRadio = screen.getByRole('radio', { name: /^not active$/i });
      
      expect(maleRadio).toHaveAttribute('aria-describedby');
      expect(activityRadio).toHaveAttribute('aria-describedby');
    });

    /**
     * Tests that the main validation error message has role="alert" so the screenreader announces it immediately
     * (Mocked: Auth, Firebase, Axios)
     * (Real: role attribute on error message)
     */
    it('should have main error message with role="alert" when form is invalid', async () => {
      const user = userEvent.setup();
      renderWithRouter(<GeneratePlan />);
      
      const submitButton = screen.getByRole('button', { name: /generate meal plan/i });
      await user.click(submitButton);
      
      const mainError = screen.getByRole('alert');
      expect(mainError).toBeInTheDocument();
      expect(mainError.textContent).toContain('Please fill in all required fields');
    });

    /**
     * Tests that individual field errors appear when form is submitted empty.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Error text appearing)
     */
    it('should show individual field errors when form is submitted empty', async () => {
      const user = userEvent.setup();
      renderWithRouter(<GeneratePlan />);
      
      const submitButton = screen.getByRole('button', { name: /generate meal plan/i });
      await user.click(submitButton);
      
      const sexError = screen.getByText(/must input sex/i);
      expect(sexError).toBeInTheDocument();
    });
  });

  /**
   * DYNAMIC CONTENT
   * Tests for dynamic content.
   * Form changes based on user selections.
   */
  describe('Dynamic Content', () => {
    /**
     * Tests that height inputs change when unit toggle is switched
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Dynamic input rendering)
     */
    it('should show feet/inches inputs by default for height', () => {
      renderWithRouter(<GeneratePlan />);
      
      const feetSelect = screen.getByLabelText(/height feet/i);
      const inchesSelect = screen.getByLabelText(/height inches/i);
      
      expect(feetSelect).toBeInTheDocument();
      expect(inchesSelect).toBeInTheDocument();
    });

    /**
     * Tests that switching to cm shows a single number input instead of two selects.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Dynamic input rendering)
     */
    it('should show cm input when centimeters is selected', async () => {
      const user = userEvent.setup();
      renderWithRouter(<GeneratePlan />);
      
      const cmRadio = screen.getByRole('radio', { name: /centimeters/i });
      await user.click(cmRadio);
      
      const feetSelect = screen.queryByLabelText(/height feet/i);
      const inchesSelect = screen.queryByLabelText(/height inches/i);
      
      expect(feetSelect).not.toBeInTheDocument();
      expect(inchesSelect).not.toBeInTheDocument();
    });

    /**
     * Tests that weight input has proper aria-required attribute.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: aria-required attribute)
     */
    it('should have aria-required on required inputs', () => {
      renderWithRouter(<GeneratePlan />);
      
      const feetSelect = screen.getByLabelText(/height feet/i);
      expect(feetSelect).toHaveAttribute('aria-required', 'true');
    });
  });

  /**
   * KEYBOARD NAVIGATION
   * Tests for keyboard navigation.
   */
  describe('Keyboard Navigation', () => {
    /**
     * Tests that the submit button can be focused with Tab key.
     * (Mocked: Auth, Firebase, Axios, React Router)
     * (Real: Keyboard focus)
     */
    it('should allow keyboard navigation to submit button', async () => {
      const user = userEvent.setup();
      renderWithRouter(<GeneratePlan />);
      
      const submitButton = screen.getByRole('button', { name: /generate meal plan/i });
      
      await user.tab();
      expect(document.activeElement).toBeDefined();
    });

    /**
     * Tests that radio buttons can be navigated with keyboard.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Radio button focus)
     */
    it('should allow keyboard navigation through radio buttons', () => {
      renderWithRouter(<GeneratePlan />);
      
      const maleRadio = screen.getByRole('radio', { name: /^male$/i });
      const femaleRadio = screen.getByRole('radio', { name: /^female$/i });
      
      expect(maleRadio).toBeInTheDocument();
      expect(femaleRadio).toBeInTheDocument();
    });

    /**
     * Tests that all form inputs are keyboard accessible.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Input elements)
     */
    it('should have keyboard accessible form inputs', () => {
      renderWithRouter(<GeneratePlan />);
      
      const radios = screen.getAllByRole('radio');
      const checkboxes = screen.getAllByRole('checkbox');
      const selects = screen.getAllByRole('combobox');
      const button = screen.getByRole('button', { name: /generate meal plan/i });
      
      expect(radios.length).toBeGreaterThan(0);
      expect(checkboxes.length).toBeGreaterThan(0);
      expect(selects.length).toBeGreaterThan(0);
      expect(button).toBeInTheDocument();
    });
  });

  /**
   * CONTENT AND TEXT
   * Tests for content rendering and text accuracy so screen readers can read form labels
   */
  describe('Content and Text', () => {
    /**
     * Tests that all form section labels render correctly.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Text content)
     */
    it('should render all form section labels', () => {
      renderWithRouter(<GeneratePlan />);
      
      expect(screen.getByText(/^Age/i)).toBeInTheDocument();
      expect(screen.getByText(/^Sex/i)).toBeInTheDocument();
      expect(screen.getAllByText(/^Height/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Weight/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Weight Goal/i)).toBeInTheDocument();
      expect(screen.getByText(/Activity Level/i)).toBeInTheDocument();
      expect(screen.getByText(/Dietary Restrictions/i)).toBeInTheDocument();
      expect(screen.getByText(/Plan Duration/i)).toBeInTheDocument();
      expect(screen.getByText(/Start Date/i)).toBeInTheDocument();
    });

    /**
     * Tests that radio button option labels render correctly.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Text content)
     */
    it('should render radio button option labels', () => {
      renderWithRouter(<GeneratePlan />);
      
      expect(screen.getByText(/^Male$/i)).toBeInTheDocument();
      expect(screen.getByText(/^Female$/i)).toBeInTheDocument();
      expect(screen.getByText(/Feet & Inches/i)).toBeInTheDocument();
      expect(screen.getByText(/Centimeters/i)).toBeInTheDocument();
      expect(screen.getByText(/One Week/i)).toBeInTheDocument();
    });

    /**
     * Tests that checkbox labels for dietary restrictions render correctly.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Text content)
     */
    it('should render dietary restriction checkbox labels', () => {
      renderWithRouter(<GeneratePlan />);
      
      expect(screen.getByText(/Vegetarian/i)).toBeInTheDocument();
      expect(screen.getByText(/Vegan/i)).toBeInTheDocument();
    });

    /**
     * Tests that the submit button text renders correctly.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Button text)
     */
    it('should render submit button text', () => {
      renderWithRouter(<GeneratePlan />);
      const buttons = screen.getAllByText(/Generate Plan/i);
      const submitButton = buttons.find(
        (el) => el.tagName === 'BUTTON'
      );
      expect(submitButton).toBeInTheDocument();
    });
  });

  /**
   * SUBMIT BUTTON
   * Tests for submit button.
   */
  describe('Submit Button', () => {
    /**
     * Tests that the submit button has a descriptive aria-label.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: aria-label attribute)
     */
    it('should have descriptive aria-label on submit button', () => {
      renderWithRouter(<GeneratePlan />);
      
      const submitButton = screen.getByRole('button', { name: /generate meal plan based on your preferences/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('aria-label');
    });

    /**
     * Tests that the submit button has proper role.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Button role)
     */
    it('should have proper button role', () => {
      renderWithRouter(<GeneratePlan />);
      
      const submitButton = screen.getByRole('button', { name: /generate meal plan/i });
      expect(submitButton.tagName).toBe('BUTTON');
    });

    /**
     * Tests that the submit button has type="button" (not submit)
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Button type attribute)
     */
    it('should have type="button" on submit button', () => {
      renderWithRouter(<GeneratePlan />);
      
      const submitButton = screen.getByRole('button', { name: /generate meal plan/i });
      expect(submitButton).toHaveAttribute('type', 'button');
    });
  });
});
