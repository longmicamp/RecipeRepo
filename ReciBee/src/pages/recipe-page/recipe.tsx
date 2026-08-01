import "./recipe.css";
import heroImage from "../../assets/hero.png";
import { useEffect } from "react";

const ingredients = [
  { quantity: "1 whole", name: "chicken (~1.8kg)" },
  { quantity: "2 tbsp", name: "olive oil" },
  { quantity: "4 cloves", name: "garlic, crushed" },
  { quantity: "½ bunch", name: "fresh thyme" },
];

const steps = [
  {
    text: "Heat oven to 220°C. Pat the chicken dry and rub all over with oil, salt, and pepper.",
    image: null,
  },
  {
    text: "Scatter garlic and thyme in the pan. Roast 70 minutes, basting once, until the juices run clear.",
    image: heroImage,
  },
  {
    text: "Rest 15 minutes before carving. Spoon over the pan juices to serve.",
    image: null,
  },
];

function RecipePage() {
  const rating = 3;

  useEffect(() => {
    console.log("Component loaded!");
  }, []);
  return (
    <div className="recipe-page">
      <div className="recipe-hero">
        <img
          className="recipe-hero-img"
          src={heroImage}
          alt="Roast chicken & herbs"
        />
        <div className="recipe-hero-overlay">
          <span className="recipe-hero-badge">Dinner</span>
          <h1 className="recipe-hero-title">Roast chicken &amp; herbs</h1>
        </div>
      </div>

      <div className="recipe-toolbar">
        <div className="recipe-author">
          <span className="recipe-avatar">R</span>
          <div className="recipe-author-info">
            <span className="recipe-author-name">Rosa</span>
            <span className="recipe-author-meta">added 2 days ago</span>
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
            1h 20m
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
            4 servings
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
            Medium
          </span>
          <span className="recipe-rating" aria-label={`${rating} out of 5`}>
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={i < rating ? "recipe-star filled" : "recipe-star"}
              >
                ★
              </span>
            ))}
          </span>
        </div>

        <div className="recipe-actions">
          <button className="recipe-save-button">♡ Save</button>
          <button className="recipe-edit-button">Edit</button>
        </div>
      </div>

      <div className="recipe-divider"></div>

      <p className="recipe-description">
        A weeknight-worthy roast that tastes like Sunday — crisp skin, garlicky
        pan juices, and a bright lift of fresh thyme.
      </p>

      <div className="recipe-body">
        <section className="recipe-ingredients">
          <h2 className="recipe-section-title">Ingredients</h2>
          <ul className="ingredient-list">
            {ingredients.map((item, i) => (
              <li key={i} className="ingredient-item">
                <span className="ingredient-quantity">{item.quantity}</span>{" "}
                {item.name}
              </li>
            ))}
          </ul>
        </section>

        <section className="recipe-method">
          <h2 className="recipe-section-title">Method</h2>
          <ol className="method-list">
            {steps.map((step, i) => (
              <li key={i} className="method-step">
                <span className="method-number">{i + 1}</span>
                <div className="method-content">
                  <p className="method-text">{step.text}</p>
                  {step.image && (
                    <img
                      className="method-image"
                      src={step.image}
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
  );
}
export default RecipePage;
