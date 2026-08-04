const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export interface Recipe {
  id: number;
  name: string;
  ingredients: { quantityAmount: string; quantityUnit: string; name: string }[];
  steps: { step: number; text: string; image: string | null }[];
  image?: string;
}

export async function getRecipe(recipeId: string): Promise<Recipe> {
  console.log("api base url", API_BASE_URL);
  // implement when API is setup
  // const response = await fetch(`${API_BASE_URL}/api/recipes/${recipeId}`);
  // if (!response.ok) {
  //   throw new Error("Failed to fetch recipe");
  // }
  // return response.json();
}
