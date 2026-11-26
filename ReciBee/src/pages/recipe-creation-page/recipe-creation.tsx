import { useReducer, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { useNavigate } from "react-router";
import "./recipe-creation.css";
import { useCreateRecipe } from "../../hooks/useRecipe";
import type { Difficulty, NewRecipe, Recipe } from "../../types/recipe-data";
import { Oval } from "react-loader-spinner";
import { useLocation } from "react-router";
import { useActionState } from "react";

type Ingredient = { amount: string; unit: string; name: string };
type Step = { text: string; image: File | null; previewUrl: string | null };

const initialState = {
  recipeName: "",
  prepHours: "",
  prepMinutes: "",
  serves: "",
  category: "",
  difficulty: "",
  description: "",
  ingredients: [{ amount: "", unit: "", name: "" }] as Ingredient[],
  steps: [{ text: "", image: null, previewUrl: null }] as Step[],
};

const UNIT_OPTIONS = [
  "g",
  "kg",
  "ml",
  "L",
  "tsp",
  "tbsp",
  "cup",
  "piece",
  "clove",
  "pinch",
  "slice",
];

const SERVES_OPTIONS = ["1", "2", "3", "4", "5", "6", "8", "10", "12+"];

const CATEGORY_OPTIONS = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Drink",
  "Side",
  "Sauce",
];

const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];

function RecipeCreationPage() {
  const navigate = useNavigate();
  const heroInputRef = useRef<HTMLInputElement>(null);
  const { createdId, loading, createRecipe } = useCreateRecipe();
  const location = useLocation();
  const editRecipe = location.state?.recipe;

  type State = {
    recipeName: string;
    prepHours: string;
    prepMinutes: string;
    serves: string;
    category: string;
    difficulty: string;
    description: string;
    ingredients: Ingredient[];
    steps: Step[];
  };

  type action =
    | { type: "SET_RECIPE_NAME"; payload: string }
    | { type: "SET_PREP_HOURS"; payload: string }
    | { type: "SET_PREP_MINUTES"; payload: string }
    | { type: "SET_SERVES"; payload: string }
    | { type: "SET_CATEGORY"; payload: string }
    | { type: "SET_DIFFICULTY"; payload: string }
    | { type: "SET_DESCRIPTION"; payload: string }
    | {
        type: "UPDATE_STEP";
        payload: { index: number; field: keyof Step; value: string };
      }
    | { type: "ADD_INGREDIENT" }
    | {
        type: "UPDATE_INGREDIENT";
        payload: { index: number; field: keyof Ingredient; value: string };
      }
    | { type: "REMOVE_INGREDIENT"; payload: number }
    | { type: "ADD_STEP" }
    | { type: "RESET" }
    | {
        type: "UPDATE_STEP_TEXT";
        payload: { index: number; value: string };
      }
    | {
        type: "UPDATE_STEP_IMAGE";
        payload: { index: number; file: File | null };
      }
    | { type: "REMOVE_STEP"; payload: number };

  const reducer = (state: State, action: action): State => {
    switch (action.type) {
      case "SET_RECIPE_NAME":
        return { ...state, recipeName: action.payload };
      case "SET_PREP_HOURS":
        return { ...state, prepHours: action.payload };
      case "SET_PREP_MINUTES":
        return { ...state, prepMinutes: action.payload };
      case "SET_SERVES":
        return { ...state, serves: action.payload };
      case "SET_CATEGORY":
        return { ...state, category: action.payload };
      case "SET_DIFFICULTY":
        return { ...state, difficulty: action.payload };
      case "SET_DESCRIPTION":
        return { ...state, description: action.payload };
      case "UPDATE_STEP":
        return {
          ...state,
          steps: state.steps.map((step, i) =>
            i === action.payload.index
              ? { ...step, [action.payload.field]: action.payload.value }
              : step,
          ),
        };
      case "ADD_INGREDIENT":
        return {
          ...state,
          ingredients: [
            ...state.ingredients,
            { amount: "", unit: "", name: "" },
          ],
        };
      case "UPDATE_INGREDIENT": {
        const updatedIngredients = state.ingredients.map((item, i) =>
          i === action.payload.index
            ? { ...item, [action.payload.field]: action.payload.value }
            : item,
        );
        return { ...state, ingredients: updatedIngredients };
      }
      case "REMOVE_INGREDIENT":
        return {
          ...state,
          ingredients: state.ingredients.filter((_, i) => i !== action.payload),
        };
      case "ADD_STEP":
        return {
          ...state,
          steps: [...state.steps, { text: "", image: null, previewUrl: null }],
        };
      case "UPDATE_STEP_IMAGE": {
        const updatedStepsImage = state.steps.map((item, i) => {
          if (i !== action.payload.index) return item;
          if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
          if (
            !action.payload.file ||
            !action.payload.file.type.startsWith("image/")
          ) {
            return { ...item, image: null, previewUrl: null };
          }
          return {
            ...item,
            image: action.payload.file,
            previewUrl: URL.createObjectURL(action.payload.file),
          };
        });
        return { ...state, steps: updatedStepsImage };
      }
      case "REMOVE_STEP": {
        const target = state.steps[action.payload];
        if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
        return {
          ...state,
          steps: state.steps.filter((_, i) => i !== action.payload),
        };
      }
      case "RESET":
        return initialState;
      default:
        return state;
    }
  };

  function toFormState(recipe: Recipe) {
    return {
      id: recipe.id,
      recipeName: recipe.name,
      description: recipe.description || "",
      difficulty: recipe.difficulty || "",
      category: recipe.category || "",
      prepHours: recipe.cookTime?.hours?.toString() || "0",
      prepMinutes: recipe.cookTime?.minutes?.toString() || "0",
      serves: recipe.serves?.toString() || "1",
      ingredients: recipe.ingredients.map((i) => ({
        amount: i.quantityAmount || "",
        unit: i.quantityUnit || "",
        name: i.name,
      })),
      steps: recipe.steps.map((s) => ({
        text: s.text,
        image: null,
        previewUrl: null,
      })),
    };
  }

  function toNewRecipe(state: State): NewRecipe {
    console.log("category:", state.category);
    return {
      name: state.recipeName.trim(),
      description: state.description.trim() || undefined,
      difficulty: (state.difficulty || undefined) as Difficulty | undefined,
      category: state.category || undefined,
      cookTime: {
        hours: parseInt(state.prepHours, 10) || 0,
        minutes: parseInt(state.prepMinutes, 10) || 0,
      },
      serves: parseInt(state.serves, 10) || 1, // "12+" → 12
      createdDate: new Date().toISOString(),
      ingredients: state.ingredients
        .filter((i) => i.name.trim()) // drop blank rows
        .map((i) => ({
          quantityAmount: i.amount.trim(),
          quantityUnit: i.unit,
          name: i.name.trim(),
        })),
      steps: state.steps
        .filter((s) => s.text.trim())
        .map((s, i) => ({ step: i + 1, text: s.text.trim(), imageUrl: null })),
    };
  }

  const [state, dispatch] = useReducer(reducer, editRecipe, (r) =>
    r ? toFormState(r) : initialState,
  );

  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [heroPreviewUrl, setHeroPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState("");

  const applyHeroImage = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setImageError("Only image files are supported.");
      return;
    }
    setImageError("");
    if (heroPreviewUrl) URL.revokeObjectURL(heroPreviewUrl);
    setHeroImage(file);
    setHeroPreviewUrl(URL.createObjectURL(file));
  };

  const handleHeroDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) applyHeroImage(file);
  };

  const handleHeroSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) applyHeroImage(file);
  };

  const removeHeroImage = () => {
    if (heroPreviewUrl) URL.revokeObjectURL(heroPreviewUrl);
    setHeroImage(null);
    setHeroPreviewUrl(null);
    setImageError("");
    if (heroInputRef.current) heroInputRef.current.value = "";
  };

  const handleSave = async () => {
    const recipe = toNewRecipe(state);
    if (!recipe.name) return setFormError("Give your recipe a name.");
    if (!recipe.ingredients.length)
      return setFormError("Add at least one ingredient.");
    if (!recipe.steps.length) return setFormError("Add at least one step.");

    const id = await createRecipe(recipe);
    if (id) navigate(`/recipe`, { state: { id } });
  };

  return (
    <div className="recipe-creation-page">
      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>
          &#8592; Back
        </button>
        <button className="save-button" onClick={handleSave}>
          Save Recipe
        </button>
      </div>
      <div className="large-horizontal-line"></div>

      <div className="title-section">
        <input
          className="recipe-name-input"
          type="text"
          name="recipeName"
          value={state.recipeName}
          placeholder="Enter recipe name"
          onChange={(e) =>
            dispatch({ type: "SET_RECIPE_NAME", payload: e.target.value })
          }
        />
      </div>
      <div className="large-horizontal-line"></div>
      <section className="creation-section photo-details-row">
        <div className="photo-column field">
          <span className="field-label">Photo</span>
          <div
            className={
              isDragging
                ? "image-dropzone image-dropzone-active"
                : "image-dropzone"
            }
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleHeroDrop}
            onClick={() => heroInputRef.current?.click()}
          >
            {heroPreviewUrl ? (
              <div className="dropzone-preview">
                <img
                  className="dropzone-preview-img"
                  src={heroPreviewUrl}
                  alt={heroImage?.name ?? "Recipe photo"}
                />
                <div className="dropzone-preview-meta">
                  <span className="dropzone-filename">{heroImage?.name}</span>
                  <button
                    className="remove-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeHeroImage();
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <>
                <svg
                  className="dropzone-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <circle cx="9" cy="11" r="2" />
                  <path d="m21 16-5.5-5.5L9 17" />
                </svg>
                <p className="dropzone-text">
                  Drag &amp; drop an image here, or click to browse
                </p>
                <p className="dropzone-hint">PNG, JPG, GIF or WEBP</p>
              </>
            )}
            <input
              ref={heroInputRef}
              className="visually-hidden"
              type="file"
              accept="image/*"
              onClick={(e) => e.stopPropagation()}
              onChange={handleHeroSelect}
            />
          </div>
          {imageError && <p className="field-error">{imageError}</p>}
        </div>
        if (this.loading){" "}
        {
          <div className="loading-spinner">
            <Oval
              height={40}
              width={40}
              color="#f6763b"
              secondaryColor="#e0e0e0"
              ariaLabel="oval-loading"
            />
          </div>
        }
        <div className="details-column">
          <div className="details-grid">
            <div
              className="field"
              role="group"
              aria-labelledby="prep-time-label"
            >
              <span className="field-label" id="prep-time-label">
                Prep Time
              </span>
              <div className="time-inputs">
                <div className="time-input">
                  <input
                    className="field-input"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder="0"
                    aria-label="Hours"
                    value={state.prepHours}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_PREP_HOURS",
                        payload: e.target.value,
                      })
                    }
                  />
                  <span className="time-unit">hrs</span>
                </div>
                <div className="time-input">
                  <input
                    className="field-input"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={59}
                    placeholder="0"
                    aria-label="Minutes"
                    value={state.prepMinutes}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_PREP_MINUTES",
                        payload: e.target.value,
                      })
                    }
                  />
                  <span className="time-unit">mins</span>
                </div>
              </div>
            </div>

            <label className="field">
              <span className="field-label">Serves</span>
              <select
                className="field-input"
                value={state.serves}
                onChange={(e) =>
                  dispatch({ type: "SET_SERVES", payload: e.target.value })
                }
              >
                <option value="">Select servings</option>
                {SERVES_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="field-label">Category</span>
              <select
                className="field-input"
                value={state.category}
                onChange={(e) =>
                  dispatch({ type: "SET_CATEGORY", payload: e.target.value })
                }
              >
                <option value="">Select category</option>
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="field-label">Difficulty</span>
              <select
                className="field-input"
                value={state.difficulty}
                onChange={(e) =>
                  dispatch({ type: "SET_DIFFICULTY", payload: e.target.value })
                }
              >
                <option value="">Select difficulty</option>
                {DIFFICULTY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="field">
            <span className="field-label">Notes</span>
            <textarea
              className="field-input notes-input"
              value={state.description}
              placeholder="Anything worth remembering next time..."
              onChange={(e) =>
                dispatch({ type: "SET_DESCRIPTION", payload: e.target.value })
              }
            />
          </label>
        </div>
      </section>

      <div className="ingredients-steps-row">
        <section className="creation-section">
          <h2 className="section-title">Ingredients</h2>

          <div className="row-list">
            {state.ingredients.map((ingredient, index) => (
              <div className="ingredient-row" key={index}>
                <input
                  className="field-input ingredient-amount"
                  type="text"
                  value={ingredient.amount}
                  placeholder="Amount"
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_INGREDIENT",
                      payload: {
                        index,
                        field: "amount",
                        value: e.target.value,
                      },
                    })
                  }
                />
                <select
                  className="field-input ingredient-unit"
                  value={ingredient.unit}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_INGREDIENT",
                      payload: {
                        index,
                        field: "unit",
                        value: e.target.value,
                      },
                    })
                  }
                >
                  <option value="">Unit</option>
                  {UNIT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <input
                  className="field-input ingredient-name"
                  type="text"
                  value={ingredient.name}
                  placeholder="Ingredient name"
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_INGREDIENT",
                      payload: {
                        index,
                        field: "name",
                        value: e.target.value,
                      },
                    })
                  }
                />
                <button
                  className="remove-button"
                  aria-label={`Remove ingredient ${index + 1}`}
                  disabled={state.ingredients.length === 1}
                  onClick={() =>
                    dispatch({ type: "REMOVE_INGREDIENT", payload: index })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            className="add-button add-button-below"
            onClick={() => dispatch({ type: "ADD_INGREDIENT" })}
          >
            + Add Ingredient
          </button>
        </section>

        <section className="creation-section">
          <h2 className="section-title">Steps</h2>

          <div className="row-list">
            {state.steps.map((step, index) => (
              <div className="step-row" key={index}>
                <span className="step-number">{index + 1}</span>
                <div className="step-body">
                  <textarea
                    className="field-input step-text"
                    value={step.text}
                    placeholder={`Describe step ${index + 1}`}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_STEP",
                        payload: {
                          index,
                          field: "text",
                          value: e.target.value,
                        },
                      })
                    }
                  />
                  <div className="step-image-row">
                    <label className="step-image-button">
                      {step.image ? "Change Image" : "Add Image (optional)"}
                      <input
                        className="visually-hidden"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_STEP_IMAGE",
                            payload: {
                              index,
                              file: e.target.files?.[0] ?? null,
                            },
                          })
                        }
                      />
                    </label>
                    {step.previewUrl && (
                      <div className="step-image-preview">
                        <img
                          className="step-preview-img"
                          src={step.previewUrl}
                          alt={`Step ${index + 1}`}
                        />
                        <button
                          className="remove-button"
                          onClick={() =>
                            dispatch({
                              type: "UPDATE_STEP_IMAGE",
                              payload: { index, file: null },
                            })
                          }
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  className="remove-button"
                  aria-label={`Remove step ${index + 1}`}
                  disabled={state.steps.length === 1}
                  onClick={() =>
                    dispatch({ type: "REMOVE_STEP", payload: index })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            className="add-button add-button-below"
            onClick={() => dispatch({ type: "ADD_STEP" })}
          >
            + Add Step
          </button>
        </section>
      </div>
    </div>
  );
}

export default RecipeCreationPage;
function setFormError(arg0: string) {
  throw new Error("Function not implemented.");
}
