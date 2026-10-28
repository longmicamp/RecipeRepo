from typing import Optional

from fastapi import Depends, APIRouter, Body, Request, Response, HTTPException, status
from pydantic import BaseModel
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from models import Recipe, RecipeBrief, Ingredient, Instruction
import requests

router = APIRouter(prefix="/api/recipes", tags=["Recipes"])

REGION = "ap-southeast-2"
USER_POOL_ID = "ap-southeast-2_rcqwarb2z"
CLIENT_ID = "20qf3imk30mr42205id1b1h1da"
ISSUER = f"https://cognito-idp.{REGION}.amazonaws.com/{USER_POOL_ID}"
JWKS = requests.get(f"{ISSUER}/.well-known/jwks.json").json()["keys"]

bearer = HTTPBearer()

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

def get_current_user(creds: HTTPAuthorizationCredentials = Depends(bearer)) -> str:
    try:
        claims = jwt.decode(
            creds.credentials, JWKS, algorithms=["RS256"],
            issuer=ISSUER, audience=CLIENT_ID,
            options={"verify_aud": False},  # access tokens carry client_id, not aud — see note below
        )
    except jwt.JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return claims["sub"]  # stable Cognito user id

@router.get("", response_model=list[RecipeBrief])
async def get_recipes(request: Request, user_id: str = Depends(get_current_user)):
    if (recipes := request.app.database["recipe-info"].find({"createdUserId": user_id})) is not None:
        return recipes
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with ID {user_id} has no recipes")
    # raise HTTPException(status_code=501, detail="Not implemented")


@router.get("/{recipe_id}", response_model=Recipe)
async def get_recipe(recipe_id: int, request: Request):
    if (recipe := request.app.database["recipe-info"].find_one({"recipeId": recipe_id})) is not None:
        return recipe
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Recipe with ID {recipe_id} not found")
    # raise HTTPException(status_code=501, detail="Not implemented")


@router.post("", response_model=Recipe, status_code=201)
async def create_recipe(recipe: Recipe, request: Request):
    if (recipe := request.app.database["recipe-info"].insert_one({recipe})) is true: 
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
