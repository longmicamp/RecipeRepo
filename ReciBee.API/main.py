from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.controllers.authentication_controller import router as auth_router
from app.controllers.recipe_controller import router as recipe_router

app = FastAPI(title="ReciBee API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(recipe_router)


@app.get("/")
async def root():
    return {"message": "Welcome to ReciBee API"}
