from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from pymongo import MongoClient
from dotenv import load_dotenv

from app.routers.authentication import router as auth_router
from app.routers.recipe import router as recipe_router

load_dotenv()

app = FastAPI()

allowed_origins = os.environ.get("AllowedOrigins", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(recipe_router)

connection_string = os.environ.get("ConnectionStrings__reciBee")
@app.on_event("startup")
def startup_db_client():
    app.mongodb_client = MongoClient(connection_string)
    app.database = app.mongodb_client["recipe-db"]
    pingresponse = app.database.command("ping")
    if pingresponse.get("ok") != 1.0:
        raise Exception("Failed to connect to the MongoDB database! Change")
    else:
        print("Successfully connected to the MongoDB database!")

@app.get("/")
async def root():
    return {"message": "Welcome to ReciBee API"}

@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()    
