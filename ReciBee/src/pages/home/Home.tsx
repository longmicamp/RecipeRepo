import "./Home.css";
import RecipeCard from "../../components/recipe-card";
import type { RecipeCard as RecipeCardType } from "../../types/recipe-card";

const recipes: RecipeCardType[] = [
  {
    title: "Spaghetti Carbonara",
    cookingTime: "25 min",
    category: "Italian",
    rating: 4.8,
    serves: 2,
    id: 5,
  },
  {
    title: "Chicken Tikka Masala",
    cookingTime: "45 min",
    category: "Indian",
    rating: 4.6,
    serves: 4,
    id: 4,
  },
  {
    title: "Avocado Toast",
    cookingTime: "10 min",
    category: "Breakfast",
    rating: 4.2,
    serves: 1,
    id: 3,
  },
  {
    title: "Beef Tacos",
    cookingTime: "30 min",
    category: "Mexican",
    rating: 4.7,
    serves: 3,
    id: 2,
  },
  {
    title: "Greek Salad",
    cookingTime: "15 min",
    category: "Salad",
    rating: 4.4,
    serves: 2,
    id: 1,
  },
];

function Home() {
  return (
    <main className="home-page">
      <div className="navbar">
        <h1 className="home-title">The Chopping Block</h1>
        <nav className="navbar-links">
          <a className="nav-button" href="#">
            My Recipes
          </a>
          <a className="nav-button" href="#">
            Discover
          </a>
          <a className="nav-button" href="#">
            Favourites
          </a>
          <a className="nav-button" href="#">
            Collections
          </a>
        </nav>
        <div className="horizontal-line">
          <img className="profile-image" id="my-api-image" src="" />
          <h3 className="profile-name" id="my-api-name">
            Username
          </h3>
        </div>
      </div>
      <div className="recipe-list">
        <div className="search-bar">
          <div className="search-input-wrapper">
            <span className="search-icon" aria-hidden="true"></span>
            <input
              className="search-input"
              type="text"
              placeholder="Search for your recipes..."
            />
          </div>
          <button className="search-button">Search</button>
          <button className="create-button">+ Create</button>
        </div>
        <div className="large-horizontal-line"></div>
        <div className="recipes">
          <div className="recipe-header">
            <h2 className="recipe-list-title">My Recipes</h2>
            <h4 className="recipe-count">{recipes.length} recipes</h4>
          </div>
          <div className="recipe-cards">
            {recipes.map((recipe, index) => (
              <RecipeCard key={index} {...recipe} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
