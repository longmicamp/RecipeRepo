from typing import Optional

from fastapi import Depends, APIRouter, Body, Request, Response, HTTPException, status
from pydantic import BaseModel
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from pymongo import DESCENDING, ReturnDocument
from models import Recipe, RecipeBrief, Ingredient, Instruction, RecipeCreate
import requests
import os

router = APIRouter(prefix="/api/recipes", tags=["Recipes"])

TENANT_ID = os.environ["ENTRA_TENANT_ID"]
TENANT_SUBDOMAIN = os.environ["ENTRA_TENANT_SUBDOMAIN"]
API_CLIENT_ID = os.environ["ENTRA_API_CLIENT_ID"]
REQUIRED_SCOPE = "recipes.readwrite"

METADATA_URL = f"https://{TENANT_SUBDOMAIN}.ciamlogin.com/{TENANT_ID}/v2.0/.well-known/openid-configuration"

metadata = requests.get(METADATA_URL).json()
ISSUER = metadata["issuer"]
JWKS = requests.get(metadata["jwks_uri"]).json()["keys"]

bearer = HTTPBearer()


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
            issuer=ISSUER, audience=API_CLIENT_ID,
        )
    except (claims.get("scp") is None or REQUIRED_SCOPE not in claims["scp"].split()):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient scope")
    except jwt.JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return claims["oid"]  

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


def next_recipe_id(db) -> int:
    counters = db["counters"]
    counter = counters.find_one_and_update(
        {"_id": "recipeId"}, {"$inc": {"seq": 1}}, return_document=ReturnDocument.AFTER
    )
    if counter is None:
        highest = db["recipe-info"].find_one(sort=[("recipeId", DESCENDING)], projection={"recipeId": 1})
        counters.update_one(
            {"_id": "recipeId"},
            {"$setOnInsert": {"seq": highest["recipeId"] if highest else 0}},
            upsert=True,
        )
        counter = counters.find_one_and_update(
            {"_id": "recipeId"}, {"$inc": {"seq": 1}}, return_document=ReturnDocument.AFTER
        )
    return counter["seq"]


@router.post("", response_model=Recipe, status_code=status.HTTP_201_CREATED)
async def create_recipe(
    recipe: RecipeCreate,
    request: Request,
    user_id: str = Depends(get_current_user),
):
    db = request.app.database

    new_recipe = Recipe(
        **recipe.model_dump(),
        recipeId=next_recipe_id(db),
        createdUserId=user_id,
        rating=0,
    )

    result = db["recipe-info"].insert_one(new_recipe.model_dump(by_alias=True))
    if not result.acknowledged:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Recipe could not be saved",
        )
    return new_recipe


@router.put("/{recipe_id}", response_model=RecipeResponse)
async def update_recipe(recipe_id: int, recipe: RecipeCreate):
    # TODO: Implement recipe update
    raise HTTPException(status_code=501, detail="Not implemented")


@router.delete("/{recipe_id}", status_code=204)
async def delete_recipe(recipe_id: int):
    # TODO: Implement recipe deletion
    raise HTTPException(status_code=501, detail="Not implemented")
