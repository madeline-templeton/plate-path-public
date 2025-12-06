import { useEffect, useState } from "react";
import { Meal } from "../../pages/Calendar/Calendar";
import "./MealCard.css";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { auth } from "../../services/firebase";

interface MealCardProps{
  onClose: () => void;
  meal: Meal
}


export default function MealCard({ onClose, meal} : MealCardProps) {
  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const { user: currentUser } = useAuth();
  const [hasLoadedPreference, setHasLoadedPreference] = useState(false);
  // Parse comma-separated ingredients into an array
  const ingredientsList = meal.ingredients
    .split(',')
    .map(ingredient => ingredient.trim())
    .filter(ingredient => ingredient.length > 0);

    const getMealVote = async () => {
      try {
        console.log("HERE")
        const response = await axios.get(`http://localhost:8080/checkIfMealVoted/${currentUser?.id}?mealId=${meal.id}`);
        console.log(response.data)


      if (response.data.success && response.data.hasVotes && response.data.mealPresent) {
        setIsLiked(response.data.liked);
      } else {
        setIsLiked(null);
      }
        setHasLoadedPreference(true);
      } catch (error){
        console.error(error, "Error while fetching vote");
        setHasLoadedPreference(true);
      }
    }

    const updateMealVote = async (liked: boolean) => {
      try {
        const token = await auth.currentUser?.getIdToken();
        console.log({mealId: meal.id, 
          mealName: meal.name, 
          liked: liked})

        const response = await axios.put(`http://localhost:8080/updateUserMealVote`, {
          mealId: meal.id, 
          mealName: meal.name, 
          liked: liked
        }, {
          headers: {
          'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data)


        if (response.data.success) {
          setIsLiked(liked);
        } 

      } catch (error){
        console.error(error, "Error while updating vote");

      }
    }

  useEffect(() => {
    if (currentUser) {
      setHasLoadedPreference(false);
      setIsLiked(null);
      getMealVote();
    }

  }, [currentUser, meal.id]);

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
              ))}
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
            <button 
            className={`vote-button downvote-button ${isLiked === false ? 'active' : ''}`}
            aria-label="Downvote meal"
            onClick={() => updateMealVote(false)}
            >
              <span className="vote-arrow">↓</span>
            </button>
            <span className="vote-text">I DON'T love this meal</span>
          </div>
          <div className="vote-container">
            <button 
            className={`vote-button upvote-button ${isLiked === true ? 'active' : ''}`}
            aria-label="Upvote meal"
            onClick={() => updateMealVote(true)}
            >
              <span className="vote-arrow">↑</span>
            </button>
            <span className="vote-text">I DO love this meal</span>
          </div>
        </div>

      </div>
    </div>
  )
}
