from typing import Optional

from fastapi import APIRouter, Body, Request, Response, HTTPException, status
from pydantic import BaseModel

from models import Recipe, RecipeBrief, Ingredient, Instruction

router = APIRouter(prefix="/api/recipes", tags=["Recipes"])


class RecipeCreate(BaseModel):
    title: str
    description: str
    ingredients: list[str]
    instructions: list[str]


class RecipeResponse(BaseModel):
    id: int
    name: str
    imageUrl: Optional[str] = None
    ingredients: list[Ingredient]
    steps: list[Instruction]


@router.get("/{user_id}", response_model=list[RecipeBrief])
async def get_recipes(recipe_id: int, request: Request):
    if (recipe := request.app.database["recipe-info"].find({"createdUserId": user_id})) is not None:
        return recipe //map to new object?
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with ID {user_id} has no recipes")
    # raise HTTPException(status_code=501, detail="Not implemented")


@router.get("/{recipe_id}", response_model=Recipe)
async def get_recipe(recipe_id: int, request: Request):
    if (recipe := request.app.database["recipe-info"].find_one({"recipeId": recipe_id})) is not None:
        return recipe
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Recipe with ID {recipe_id} not found")
    # raise HTTPException(status_code=501, detail="Not implemented")


@router.post("/", response_model=Recipe, status_code=201) //add in recipe in request 
async def create_recipe(recipe: Recipe, request: Request):
    if (recipe := request.app.database["recipe-info"].insert_one({recipe})) is true: //check this is how you check if true
        return recipe
    # TODO: Implement recipe creation
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Recipe {recipe.recipeId} could not be added")
    # raise HTTPException(status_code=501, detail="Not implemented")


@router.put("/{recipe_id}", response_model=RecipeResponse)
async def update_recipe(recipe_id: int, recipe: RecipeCreate):
    # TODO: Implement recipe update
    raise HTTPException(status_code=501, detail="Not implemented")


@router.delete("/{recipe_id}", status_code=204)
async def delete_recipe(recipe_id: int):
    # TODO: Implement recipe deletion
    raise HTTPException(status_code=501, detail="Not implemented")
