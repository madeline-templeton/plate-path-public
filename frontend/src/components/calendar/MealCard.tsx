import { Meal } from "../../pages/Calendar/Calendar";
import "./MealCard.css";

interface MealCardProps{
  onClose: () => void;
  meal: Meal
}


export default function MealCard({ onClose, meal} : MealCardProps) {
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
          <p className="meal-content">{meal.category} - {meal.calories} calories</p>
        </div>

        <div className="meal-recipe">
          <div className="recipe-detail">
            <h3 className="recipe-header">Ingredients</h3>
            <ul className="ingredient-list">
              {meal.recipe.ingredients.map((ingredient) => (
                <li className="ingredient">
                  {ingredient}
                </li>
              ))
              }
            </ul>
          </div>
          
          
          <div className="recipe-detail">
            <h3 className="recipe-header">Instructions</h3>
            <p className="instructions">{meal.recipe.instructions}</p>
          </div>


          <div className="recipe-detail">
            <h3 className="recipe-header">Video</h3>
            <p className="video-link">{meal.recipe.video}</p>
          </div>

        </div>

      </div>
    </div>
  )
}
