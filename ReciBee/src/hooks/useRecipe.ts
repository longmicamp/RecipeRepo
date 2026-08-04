import { useState } from "react";
import { getRecipe, type Recipe } from "../services/recipeService";

export function useRecipe() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRecipe = async (recipeId: string) => {
    setLoading(true);
    setError("");
    try {
      const data = await getRecipe(recipeId);
      setRecipe(data);
    } catch (err) {
      setError("No data for this Recipe ID.");
    } finally {
      setLoading(false);
    }
  };

  return { recipe, loading, error, fetchRecipe };
}
