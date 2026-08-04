import uuid
from typing import Optional
from pydantic import BaseModel, Field


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


class Recipe(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    title: str
    description: Optional[str] = None
    ingredients: list[Ingredient]
    instructions: list[Instruction]

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "title": "Chocolate Chip Cookies",
                "description": "Delicious homemade chocolate chip cookies.",
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