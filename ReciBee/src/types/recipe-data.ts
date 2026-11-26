export type RecipeCardData = {
  id: number;
  recipeId: number;
  title: string;
  cookTime: string;
  category: string;
  createdDate: string; // ISO 8601 date string
  rating: number;
  serves: number;
};

export type RecipeData = {
  id: number;
  name: string;
  description?: string;
  rating?: number;
  cookTime: { hours: number; minutes: number };
  serves: number;
  createdUserId: string;
  ingredients: { quantityAmount: string; quantityUnit: string; name: string }[];
  steps: { step: number; text: string; imageUrl: string | null }[];
  imageUrl?: string;
};

export type Difficulty = "Easy" | "Medium" | "Hard";
export type CookTime = { hours: number; minutes: number };
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
  category?: string;
  cookTime: CookTime;
  serves: number;
  createdUserId: string;
  createdDate: string; // ISO 8601 date string
  ingredients: Ingredient[];
  steps: Step[];
  imageUrl?: string;
};

/** What the frontend sends to POST /api/recipes — the server fills in the rest. */
export type NewRecipe = Omit<Recipe, "id" | "createdUserId" | "rating">;
