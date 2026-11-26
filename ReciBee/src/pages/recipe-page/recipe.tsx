import "./recipe.css";
import { useEffect } from "react";
import type { CookTime } from "../../types/recipe-data";
import { useRecipe } from "../../hooks/useRecipe";
import { useLocation } from "react-router";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";

/** "1h 20m", "45m", "2h" — or null when no time was given. */
function formatCookTime(time?: CookTime): string | null {
  if (!time || (!time.hours && !time.minutes)) return null;
  const parts = [];
  if (time.hours) parts.push(`${time.hours}h`);
  if (time.minutes) parts.push(`${time.minutes}m`);
  return parts.join(" ");
}

function RecipePage() {
  const location = useLocation();
  const { id } = location.state || {};
  const { recipe, loading, error, fetchRecipe } = useRecipe();
  const navigate = useNavigate();

  const auth = useAuth();
  useEffect(() => {
    if (!id || !auth.isAuthenticated) return;
    const fetchData = async () => {
      await fetchRecipe(id);
    };

    fetchData();
  }, [id, auth.isAuthenticated, fetchRecipe]);

  if (loading) {
    return (
      <div className="recipe-page">
        <p className="recipe-status">Loading recipe...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="recipe-page">
        <p className="recipe-status">{error || "Recipe not found."}</p>
      </div>
    );
  }

  const filledStars = Math.round(recipe.rating ?? 0);
  const cookTime = formatCookTime(recipe.cookTime);

  return (
    <div className="recipe-page">
      <div className="recipe-hero">
        {recipe.imageUrl && (
          <img className="recipe-hero-img" src={recipe.imageUrl} alt="" />
        )}
        <div className="recipe-hero-overlay">
          <span className="recipe-hero-badge">
            {recipe.category || "Uncategorized"}
          </span>
          <h1 className="recipe-hero-title">{recipe.name}</h1>
        </div>
      </div>

      <div className="recipe-content">
        <div className="recipe-toolbar">
          <div className="recipe-author">
            <span className="recipe-avatar"></span>
            <div className="recipe-author-info">
              <span className="recipe-author-name">{recipe.createdUserId}</span>
              <span className="recipe-author-meta">{recipe.createdDate}</span>
            </div>
          </div>

          <div className="recipe-stats">
            <span className="recipe-stat">
              <svg
                className="recipe-icon"
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
              {cookTime ?? "Not specified"}
            </span>
            <span className="recipe-stat">
              <svg
                className="recipe-icon"
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
              {recipe.serves
                ? `${recipe.serves} ${recipe.serves === 1 ? "serving" : "servings"}`
                : "Not specified"}
            </span>
            <span className="recipe-stat">
              <svg
                className="recipe-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2 2 12l10 10 10-10z" />
              </svg>
              {recipe.difficulty || "Not specified"}
            </span>
            <span
              className="recipe-rating"
              aria-label={`${filledStars} out of 5`}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={
                    i < filledStars ? "recipe-star filled" : "recipe-star"
                  }
                >
                  ★
                </span>
              ))}
            </span>
          </div>

          <div className="recipe-actions">
            <button className="recipe-save-button">♡ Save</button>
            <button
              className="recipe-edit-button"
              onClick={() =>
                navigate(`/recipe-creation`, { state: { recipe } })
              }
            >
              Edit
            </button>
          </div>
        </div>

        <div className="recipe-divider"></div>

        <p className="recipe-description">
          {recipe.description || "No description available."}
        </p>

        <div className="recipe-body">
          <section className="recipe-ingredients">
            <h2 className="recipe-section-title">Ingredients</h2>
            <ul className="ingredient-list">
              {recipe.ingredients.map((item, i) => (
                <li key={i} className="ingredient-item">
                  <span className="ingredient-quantity">
                    {item.quantityAmount} {item.quantityUnit}
                  </span>{" "}
                  {item.name}
                </li>
              ))}
            </ul>
          </section>

          <section className="recipe-method">
            <h2 className="recipe-section-title">Method</h2>
            <ol className="method-list">
              {recipe.steps.map((step, i) => (
                <li key={i} className="method-step">
                  <span className="method-number">{i + 1}</span>
                  <div className="method-content">
                    <p className="method-text">{step.text}</p>
                    {step.imageUrl && (
                      <img
                        className="method-image"
                        src={step.imageUrl}
                        alt={`Step ${i + 1}`}
                      />
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
export default RecipePage;
