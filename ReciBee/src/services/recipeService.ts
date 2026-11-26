import type {
  CookTime,
  Difficulty,
  Ingredient,
  NewRecipe,
  Recipe,
  RecipeCardData,
  Step,
} from "../types/recipe-data";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://container-app-c9b4.bravewater-eec3c7fa.westus2.azurecontainerapps.io";

export class RecipeCard {
  id!: number;
  recipeId!: number;
  createdUserId!: string;
  title!: string;
  cookTime!: string;
  category!: string;
  rating!: number;
  serves!: number;

  constructor(data: RecipeCardData) {
    Object.assign(this, data);
  }
}

export async function getRecipe(recipeId: string): Promise<Recipe> {
  // Use a relative URL so the request goes through the Vite dev-server proxy
  // (see vite.config.ts). This avoids cross-origin, CORS, and http/https issues.
  const response = await fetch(`${API_BASE_URL}/api/recipes/${recipeId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch recipe");
  }

  const data = await response.json();
  return formatRecipeData(data);
}

export async function createRecipe(
  recipe: NewRecipe,
  token: string,
): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(recipe),
  });
  if (!response.ok) {
    throw new Error("Failed to create recipe");
  }
  const data = await response.json();
  return String(data.recipeId);
}

export async function getRecipes(token: string): Promise<RecipeCard[]> {
  console.log("Api base URL:", API_BASE_URL);
  // Use a relative URL so the request goes through the Vite dev-server proxy
  // (see vite.config.ts). This avoids cross-origin, CORS, and http/https issues.
  const response = await fetch(`${API_BASE_URL}/api/recipes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch recipes");
  }

  const data = await response.json();
  return data.map(formatRecipeCardData);
}

function formatRecipeCardData(data: any): RecipeCard {
  return new RecipeCard({
    id: data.recipeId,
    recipeId: data.recipeId,
    title: data.name,
    cookTime: `${data.cookTime.hours}h ${data.cookTime.minutes}m`,
    category: data.category ?? "",
    rating: data.rating,
    serves: data.serves,
  });
}

/** The shape the API actually returns for a recipe. */
type RecipeApiResponse = {
  recipeId: number;
  name: string;
  description?: string;
  difficulty?: Difficulty;
  rating?: number;
  cookTime: CookTime;
  serves: number;
  createdUserId: string;
  ingredients: Ingredient[];
  steps: Step[];
  imageUrl?: string;
};

function formatRecipeData(data: RecipeApiResponse): Recipe {
  return {
    id: data.recipeId,
    name: data.name,
    description: data.description,
    difficulty: data.difficulty,
    rating: data.rating,
    cookTime: data.cookTime,
    serves: data.serves,
    createdUserId: data.createdUserId,
    ingredients: data.ingredients,
    steps: data.steps,
    imageUrl: data.imageUrl,
  };
}
