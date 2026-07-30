import type { RecipeCard as RecipeCardType } from "../types/recipe-card";

const RecipeCard = ({
  title,
  cookingTime,
  category,
  rating,
  serves,
}: RecipeCardType) => {
  return (
    <div className="recipe-card">
      <h3 className="recipe-card-title">{title}</h3>
      <p className="recipe-card-category">{category}</p>
      <p className="recipe-card-meta">
        {cookingTime} · Serves {serves} · ⭐ {rating}
      </p>
    </div>
  );
};

export default RecipeCard;
