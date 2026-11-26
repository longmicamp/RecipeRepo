import uuid
from typing import Literal, Optional

from bson import ObjectId
from pydantic import BaseModel, ConfigDict, Field, field_validator


class Ingredient(BaseModel):
    name: str
    quantityAmount: str
    quantityUnit: str

    class Config:
        schema_extra = {
            "example": {
                "name": "Flour",
                "quantityAmount": "1",
                "quantityUnit": "cup"
            }
        }


class Instruction(BaseModel):
    step: int
    text: str
    imageUrl: Optional[str] = None

    class Config:
        schema_extra = {
            "example": {
                "step": 1,
                "text": "Preheat the oven to 350°F (175°C).",
                "imageUrl": "https://example.com/image.jpg"
            }
        }

class CookTime(BaseModel):
    hours: int
    minutes: int
    class Config:
        schema_extra = {
            "example": {
                "hours": 1,
                "minutes": 1
            }
        }

class RecipeCreate(BaseModel):
    name: str = Field(min_length=1)
    description: Optional[str] = None
    difficulty: Optional[Literal["Easy", "Medium", "Hard"]] = None
    category: Optional[str] = None
    createdDate: str
    cookTime: CookTime
    serves: int = Field(ge=1)
    ingredients: list[Ingredient] = Field(min_length=1)
    steps: list[Instruction] = Field(min_length=1)
    imageUrl: Optional[str] = None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "Chocolate Chip Cookies",
                "description": "Delicious homemade chocolate chip cookies.",
                "difficulty": "Easy",
                "createdDate": "2023-06-01T12:00:00Z",
                "cookTime": {"hours": 0, "minutes": 25},
                "serves": 12,
                "ingredients": [
                    {"name": "Flour", "quantityAmount": "1", "quantityUnit": "cup"},
                    {"name": "Eggs", "quantityAmount": "2", "quantityUnit": "piece"},
                ],
                "steps": [
                    {"step": 1, "text": "Preheat the oven to 175°C.", "imageUrl": None},
                    {"step": 2, "text": "Mix all ingredients in a bowl.", "imageUrl": None},
                ],
                "imageUrl": None,
            }
        }
    )


class MongoModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")

    @field_validator("id", mode="before")
    @classmethod
    def convert_object_id(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v

    class Config:
        allow_population_by_field_name = True


class RecipeBrief(MongoModel):
    recipeId: int
    name: str
    serves: int
    rating: float
    createdUserId: str
    category: Optional[str] = None
    createdDate: str
    cookTime: CookTime
    imageUrl: Optional[str] = None


class Recipe(MongoModel):
    recipeId: int
    name: str
    description: Optional[str] = None
    difficulty: Optional[str] = None
    category: Optional[str] = None
    serves: int
    rating: float
    createdUserId: str
    createdDate: str
    cookTime: CookTime
    imageUrl: Optional[str] = None
    ingredients: list[Ingredient]
    steps: list[Instruction]

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "serves" : 1,
                "rating" : 1,
                "cookTime.hours": 1,
                "cookTime.minutes": 1,
                "createdUserId": '997ee458-80a1-70b3-5f77-b8c8d17e2187',
                "createdDate": "2023-06-01T12:00:00Z",
                "title": "Chocolate Chip Cookies",
                "description": "Delicious homemade chocolate chip cookies.",
                "difficulty": "Easy",
                "category": "Dessert",
                "ingredients": [
                    "1 cup of flour",
                    "2 eggs",
                    "1/2 cup of sugar",
                    "1/2 cup of chocolate chips"
                ],
                "instructions": [
                    "Preheat the oven to 350°F (175°C).",
                    "Mix all ingredients in a bowl.",
                    "Scoop spoonfuls of dough onto a baking sheet.",
                    "Bake for 10-12 minutes or until golden brown."
                ]
            }
        }