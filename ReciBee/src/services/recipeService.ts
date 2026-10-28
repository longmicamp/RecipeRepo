import type { RecipeCardData } from "../types/recipe-data";

export type Difficulty = "Easy" | "Medium" | "Hard";
export type CookingTime = { hours: number; minutes: number };
export type Ingredient = {
  quantityAmount: string;
  quantityUnit: string;
  name: string;
};
export type Step = { step: number; text: string; imageUrl: string | null };

export type Recipe = {
  id: number;
  name: string;
  description?: string;
  difficulty?: Difficulty; // honestly optional
  rating?: number;
  cookingTime: CookingTime;
  serves: number;
  createdUserId: string;
  ingredients: Ingredient[];
  steps: Step[];
  imageUrl?: string;
};

export class RecipeCard {
  id!: number;
  recipeId!: number;
  createdUserId!: string;
  title!: string;
  cookingTime!: string;
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
  const response = await fetch(`/api/recipes/${recipeId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch recipe");
  }

  const data = await response.json();
  return formatRecipeData(data);
}

export async function getRecipes(token: string): Promise<RecipeCard[]> {
  // Use a relative URL so the request goes through the Vite dev-server proxy
  // (see vite.config.ts). This avoids cross-origin, CORS, and http/https issues.
  const response = await fetch(`/api/recipes`, {
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
    cookingTime: `${data.cookTime.hours}h ${data.cookTime.minutes}m`,
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
  cookTime: CookingTime;
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
    cookingTime: data.cookTime,
    serves: data.serves,
    createdUserId: data.createdUserId,
    ingredients: data.ingredients,
    steps: data.steps,
    imageUrl: data.imageUrl,
  };
}
