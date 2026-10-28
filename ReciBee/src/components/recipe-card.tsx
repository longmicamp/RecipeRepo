import type { RecipeCardData as RecipeCardType } from "../types/recipe-data";
import "./recipe-card.css";
import burritoImage from "../assets/Burrito_1200x800.jpg";
import { useNavigate } from "react-router";

const RecipeCard = (props: RecipeCardType) => {
  const { id, title, cookingTime, category, rating, serves } = props;
  const navigate = useNavigate();
  const filledStars = Math.round(rating);

  return (
    <div
      className="recipe-card"
      onClick={() => navigate(`/recipe`, { state: { id } })}
    >
      <div className="recipe-card-image">
        <img src={burritoImage} alt={title} className="recipe-card-img" />
        <span className="recipe-card-badge">{category}</span>
      </div>
      <div className="recipe-card-content">
        <h3 className="recipe-card-title">{title}</h3>
        <div className="recipe-card-meta">
          <span className="recipe-card-meta-item">
            <svg
              className="recipe-card-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            {cookingTime}
          </span>
          <span className="recipe-card-meta-item">
            <svg
              className="recipe-card-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M16 20v-2a4 4 0 0 0-8 0v2" />
              <circle cx="12" cy="8" r="3" />
            </svg>
            {serves}
          </span>
          <span
            className="recipe-card-rating"
            aria-label={`${rating} out of 5`}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={
                  i < filledStars
                    ? "recipe-card-star filled"
                    : "recipe-card-star"
                }
              >
                ★
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
