import { useState } from "react";
import { getRecipe, getRecipes, Recipe } from "../services/recipeService";

export function useRecipe() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRecipe = async (recipeId: string) => {
    setLoading(true);
    setError("");
    try {
      const data = await getRecipe(recipeId);
      setRecipe(new Recipe(data));
    } catch (err) {
      setError("No data for this Recipe ID.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipes = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getRecipes();
      setRecipes(data.map((item) => new Recipe(item)));
    } catch (err) {
      setError("Failed to load recipes.");
    } finally {
      setLoading(false);
    }
  };

  return { recipe, recipes, loading, error, fetchRecipe, fetchRecipes };
}
