import { useCallback, useState } from "react";
import { getRecipe, getRecipes, RecipeCard } from "../services/recipeService";
import type { Recipe } from "../services/recipeService";
import { useAuth } from "react-oidc-context";

export function useRecipes() {
  const [recipes, setRecipes] = useState<RecipeCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const auth = useAuth();

  const fetchRecipes = useCallback(async () => {
    if (!auth.user) {
      setError("Not signed in.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await getRecipes(auth.user.access_token);
      setRecipes(data.map((item) => new RecipeCard(item)));
    } catch (err) {
      setError("Failed to load recipes.");
    } finally {
      setLoading(false);
    }
  }, [auth.user]);

  return { recipes, loading, error, fetchRecipes };
}

export function useRecipe() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const auth = useAuth();

  const fetchRecipe = useCallback(
    async (recipeId: string) => {
      if (!auth.user) {
        setError("Not signed in.");
        return;
      }
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
    },
    [auth.user],
  );

  return { recipe, loading, error, fetchRecipe };
}
