export class Recipe {
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

  constructor(data: {
    id: number;
    name: string;
    description?: string;
    rating?: number;
    cookingTime: { hours: number; minutes: number };
    serves: number;
    createdUserId: number;
    ingredients: {
      quantityAmount: string;
      quantityUnit: string;
      name: string;
    }[];
    steps: { step: number; text: string; imageUrl: string | null }[];
    imageUrl?: string;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.ingredients = data.ingredients;
    this.steps = data.steps;
    this.imageUrl = data.imageUrl;
    this.description = data.description;
    this.rating = data.rating;
    this.cookingTime = data.cookingTime;
    this.serves = data.serves;
    this.createdUserId = data.createdUserId;
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
