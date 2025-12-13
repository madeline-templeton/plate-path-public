import { useEffect, useState } from "react";
import { Meal } from "../../pages/Calendar/Calendar";
import "./MealCard.css";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { auth } from "../../services/firebase";

interface MealCardProps {
  onClose: () => void;
  meal: Meal;
  consentGranted: boolean
}

/**
 * MealCard component displays detailed information about a selected meal
 * in a modal/sidebar view. Shows ingredients, recipe link, nutritional info,
 * and voting options (if consent is granted).
 * 
 * @param {MealCardProps} props - Component props
 * @param {Function} props.onClose - Callback to close the meal card
 * @param {Meal} props.meal - The meal object to display
 * @param {boolean} props.consentGranted - Whether user has granted consent for voting
 * @returns {JSX.Element} The MealCard component
 */
export default function MealCard({ onClose, meal, consentGranted }: MealCardProps) {
  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const { user: currentUser } = useAuth();
  const [hasLoadedPreference, setHasLoadedPreference] = useState(false);
  const ingredientsList = meal.ingredients
    .split(",")
    .map((ingredient) => ingredient.trim())
    .filter((ingredient) => ingredient.length > 0);

  /**
   * Fetches the user's existing vote (like/dislike) for this meal from the backend.
   * Updates the isLiked state to reflect current preference.
   * Sets hasLoadedPreference flag when complete.
   */
  const getMealVote = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/checkIfMealVoted/${currentUser?.id}?mealId=${meal.id}`
      );

      if (
        response.data.success &&
        response.data.hasVotes &&
        response.data.mealPresent
      ) {
        setIsLiked(response.data.liked);
      } else {
        setIsLiked(null);
      }
      setHasLoadedPreference(true);
    } catch (error) {
      setHasLoadedPreference(true);
    }
  };

  /**
   * Updates the user's vote (like/dislike) for this meal.
   * If the same vote already exists, it removes the vote (toggles to neutral).
   * 
   * @param {boolean} liked - True for upvote, false for downvote
   */
  const updateMealVote = async (liked: boolean) => {
    try {
      const token = await auth.currentUser?.getIdToken();

      const response = await axios.put(
        `http://localhost:8080/updateUserMealVote`,
        {
          mealId: meal.id,
          mealName: meal.name,
          liked: liked,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        if (response.data.alreadyExisted) {
          setIsLiked(null);
        } else {
          setIsLiked(liked);
        }
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    if (currentUser) {
      setHasLoadedPreference(false);
      setIsLiked(null);
      getMealVote();
    }
  }, [currentUser, meal.id]);

  return (
    <div className="meal-card-background" role="dialog" aria-modal="true" aria-labelledby="meal-card-title">
      <div className="meal-card">
        <button 
          className="close-popup" 
          aria-label="Close meal details" 
          onClick={onClose}
        >
          x
        </button>
        <header className="meal-header">
          <h2 id="meal-card-title" className="meal-title">{meal.name}</h2>
          <p className="meal-content">
            {meal.mealTime}
            {meal.diet && meal.diet.toLowerCase() !== 'none' 
              ? ` - ${meal.diet.split(',').map(d => d.trim()).filter(d => d.toLowerCase() !== 'none').join(', ')}` 
              : ''} - serving size: {meal.serving} - {meal.calories * meal.serving} calories
          </p>
        </header>

        <div className="meal-recipe">
          <section className="recipe-detail" aria-labelledby="ingredients-heading">
            <h3 id="ingredients-heading" className="recipe-header">Ingredients</h3>
            <ul className="ingredient-list">
              {ingredientsList.map((ingredient, index) => (
                <li key={index} className="ingredient">
                  {ingredient}
                </li>
              ))}
            </ul>
          </section>

          <section className="recipe-detail" aria-labelledby="recipe-link-heading">
            <h3 id="recipe-link-heading" className="recipe-header">Recipe Link</h3>
            <a
              href={meal.website}
              target="_blank"
              rel="noopener noreferrer"
              className="video-link"
              aria-label={`View recipe for ${meal.name} on external website`}
            >
              {meal.website}
            </a>
          </section>
        </div>

        {consentGranted && (
          <section className="meal-voting" aria-label="Rate this meal">
            <div className="vote-container">
              <button
                className={`vote-button downvote-button ${
                  isLiked === false ? "active" : ""
                }`}
                aria-label={`Downvote ${meal.name}${isLiked === false ? ', currently downvoted' : ''}`}
                aria-pressed={isLiked === false}
                onClick={() => updateMealVote(false)}
              >
                <span className="vote-arrow" aria-hidden="true">↓</span>
              </button>
              <span className="vote-text" aria-hidden="true">I DON'T love this meal</span>
            </div>
            <div className="vote-container">
              <button
                className={`vote-button upvote-button ${
                  isLiked === true ? "active" : ""
                }`}
                aria-label={`Upvote ${meal.name}${isLiked === true ? ', currently upvoted' : ''}`}
                aria-pressed={isLiked === true}
                onClick={() => updateMealVote(true)}
              >
                <span className="vote-arrow" aria-hidden="true">↑</span>
              </button>
              <span className="vote-text" aria-hidden="true">I DO love this meal</span>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
