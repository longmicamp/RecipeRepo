export type RecipeCardData = {
  id: number;
  recipeId: number;
  title: string;
  cookingTime: string;
  category: string;
  rating: number;
  serves: number;
};

export type RecipeData = {
  id: number;
  name: string;
  description?: string;
  rating?: number;
  cookingTime: { hours: number; minutes: number };
  serves: number;
  createdUserId: string;
  ingredients: { quantityAmount: string; quantityUnit: string; name: string }[];
  steps: { step: number; text: string; imageUrl: string | null }[];
  imageUrl?: string;
};
