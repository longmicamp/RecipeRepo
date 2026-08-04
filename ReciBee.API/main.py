from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from pymongo import MongoClient

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

connection_string = os.environ.get("ConnectionStrings__mydb")

@app.on_event("startup")
def startup_db_client():
    app.mongodb_client = MongoClient(connection_string)
    app.database = app.mongodb_client["reciBee"]
    print("Connected to the MongoDB database!")

@app.get("/")
async def root():
    return {"message": "Welcome to ReciBee API"}

@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()    
