import { useCallback, useState } from "react";
import {
  createRecipe,
  getRecipe,
  getRecipes,
  RecipeCard,
} from "../services/recipeService";
import type { NewRecipe, Recipe } from "../types/recipe-data";
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

export function useCreateRecipe() {
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const auth = useAuth();

  const submitRecipe = useCallback(
    async (recipe: NewRecipe): Promise<string | null> => {
      if (!auth.user) {
        setError("Not signed in.");
        return null;
      }
      setLoading(true);
      setError("");
      try {
        console.log("Submitting recipe:", recipe);
        const id = await createRecipe(recipe, auth.user.access_token);
        setCreatedId(id);
        return id;
      } catch (err) {
        setError("Failed to create recipe.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [auth.user],
  );

  return { createdId, loading, error, createRecipe: submitRecipe };
}
