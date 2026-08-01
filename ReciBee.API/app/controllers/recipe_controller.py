from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/recipes", tags=["Recipes"])


class RecipeCreate(BaseModel):
    title: str
    description: str
    ingredients: list[str]
    instructions: list[str]


class RecipeResponse(BaseModel):
    id: int
    title: str
    description: str
    ingredients: list[str]
    instructions: list[str]


@router.get("/", response_model=list[RecipeResponse])
async def get_recipes():
    # TODO: Implement fetching all recipes
    raise HTTPException(status_code=501, detail="Not implemented")


@router.get("/{recipe_id}", response_model=RecipeResponse)
async def get_recipe(recipe_id: int):
    return {
        "id": recipe_id,
        "title": "Sample Recipe",
        "description": "This is a sample recipe description.",
        "ingredients": ["1 cup of flour", "2 eggs", "1/2 cup of sugar"],
        "instructions": [
            "Preheat the oven to 350°F (175°C).",
            "Mix all ingredients in a bowl.",
            "Pour the mixture into a baking pan.",
            "Bake for 30 minutes or until golden brown.",
        ],
    }
    # raise HTTPException(status_code=501, detail="Not implemented")


@router.post("/", response_model=RecipeResponse, status_code=201)
async def create_recipe(recipe: RecipeCreate):
    # TODO: Implement recipe creation
    raise HTTPException(status_code=501, detail="Not implemented")


@router.put("/{recipe_id}", response_model=RecipeResponse)
async def update_recipe(recipe_id: int, recipe: RecipeCreate):
    # TODO: Implement recipe update
    raise HTTPException(status_code=501, detail="Not implemented")


@router.delete("/{recipe_id}", status_code=204)
async def delete_recipe(recipe_id: int):
    # TODO: Implement recipe deletion
    raise HTTPException(status_code=501, detail="Not implemented")
