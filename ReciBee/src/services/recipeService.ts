import type { RecipeCard } from "../types/recipe-card";

type RecipeData = {
  id: number;
  name: string;
  description?: string;
  rating?: number;
  cookingTime: { hours: number; minutes: number };
  serves: number;
  createdUserId: number;
  ingredients: { quantityAmount: string; quantityUnit: string; name: string }[];
  steps: { step: number; text: string; imageUrl: string | null }[];
  imageUrl?: string;
};

export class Recipe implements RecipeData {
  id!: number;
  name!: string;
  description?: string;
  rating?: number;
  cookingTime!: { hours: number; minutes: number };
  serves!: number;
  createdUserId!: number;
  ingredients!: { quantityAmount: string; quantityUnit: string; name: string }[];
  steps!: { step: number; text: string; imageUrl: string | null }[];
  imageUrl?: string;

  constructor(data: RecipeData) {
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

export async function getRecipes(): Promise<RecipeCard[]> {
  // Use a relative URL so the request goes through the Vite dev-server proxy
  // (see vite.config.ts). This avoids cross-origin, CORS, and http/https issues.
  const response = await fetch(`/api/recipes/`);
  if (!response.ok) {
    throw new Error("Failed to fetch recipes");
  }

  const data = await response.json();
  return data.map(formatRecipeData);
}

function formatRecipeData(data: any): Recipe {
  const mappedRecipe: Recipe = {
    id: data.recipeId,
    name: data.name,
    description: data.description,
    rating: data.rating,
    cookingTime: {
      hours: data.cookingTime.hours,
      minutes: data.cookingTime.minutes,
    },
    serves: data.serves,
    createdUserId: data.createdUserId,
    ingredients: data.ingredients.map((item: any) => ({
      quantityAmount: item.quantityAmount,
      quantityUnit: item.quantityUnit,
      name: item.name,
    })),
    steps: data.steps.map((step: any) => ({
      step: step.step,
      text: step.text,
      imageUrl: step.imageUrl,
    })),
    imageUrl: data.imageUrl,
  };
  return mappedRecipe;
}
