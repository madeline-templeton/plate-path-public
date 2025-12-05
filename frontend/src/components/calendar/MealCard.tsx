import { Meal } from "../../pages/Calendar/Calendar";
import "./MealCard.css";

interface MealCardProps{
  onClose: () => void;
  meal: Meal
}


export default function MealCard({ onClose, meal} : MealCardProps) {
  // Parse comma-separated ingredients into an array
  const ingredientsList = meal.ingredients
    .split(',')
    .map(ingredient => ingredient.trim())
    .filter(ingredient => ingredient.length > 0);

  return (
    <div className="meal-card-background">
      <div className="meal-card">
        <button
        className="close-popup"
        aria-label="Close"
        onClick={onClose}
        >
          x
        </button>
        <div className="meal-header">
          <h2 className="meal-title">{meal.name}</h2>
          <p className="meal-content">{meal.mealTime} - {meal.diet} - {meal.calories} calories</p>
        </div>

        <div className="meal-recipe">
          <div className="recipe-detail">
            <h3 className="recipe-header">Ingredients</h3>
            <ul className="ingredient-list">
              {ingredientsList.map((ingredient, index) => (
                <li key={index} className="ingredient">
                  {ingredient}
                </li>
              ))
              }
            </ul>
          </div>

          <div className="recipe-detail">
            <h3 className="recipe-header">Recipe Link</h3>
            <a 
              href={meal.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="video-link"
            >
              {meal.website}
            </a>
          </div>

        </div>

        <div className="meal-voting">
          <div className="vote-container">
            <button className="vote-button downvote-button" aria-label="Downvote meal">
              <span className="vote-arrow">↓</span>
            </button>
            <span className="vote-text">I DON'T love this meal</span>
          </div>
          <div className="vote-container">
            <button className="vote-button upvote-button" aria-label="Upvote meal">
              <span className="vote-arrow">↑</span>
            </button>
            <span className="vote-text">I DO love this meal</span>
          </div>
        </div>

      </div>
    </div>
  )
}
