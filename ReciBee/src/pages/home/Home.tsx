import "./Home.css";
import RecipeCard from "../../components/recipe-card";
import { useEffect, useState } from "react";
import { useRecipes } from "../../hooks/useRecipe";
import { useAuth } from "react-oidc-context";
import RecipeCreationModal from "../../modals/recipe-creation/recipe-creation";

function Home() {
  const { recipes, fetchRecipes } = useRecipes();
  const [showModal, setShowModal] = useState(false);

  const auth = useAuth();
  useEffect(() => {
    if (!auth.isAuthenticated) return;
    fetchRecipes();
  }, [auth.isAuthenticated, fetchRecipes]);

  console.log("auth debug:", {
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    error: auth.error,
    activeNavigator: auth.activeNavigator,
    user: auth.user,
    url: window.location.href,
  });

  return (
    <main className="home-page">
      {showModal ? (
        <div className="modal-container">
          <RecipeCreationModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSelectOption={() => {
              /* "write" | "url" | "photos" */
            }}
          />
        </div>
      ) : null}
      <div className="navbar">
        <h1 className="home-title">The Grease Pit</h1>
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
        <div className="horizontal-line"></div>
        <div className="profile">
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
          <button className="create-button" onClick={() => setShowModal(true)}>
            + Create
          </button>
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
