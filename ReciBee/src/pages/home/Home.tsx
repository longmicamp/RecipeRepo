import "./Home.css";
import RecipeCard from "../../components/recipe-card";
import { useEffect, useState } from "react";
import { useRecipes } from "../../hooks/useRecipe";
import { useAuth } from "react-oidc-context";
import RecipeCreationModal from "../../modals/recipe-creation/recipe-creation";
import { useNavigate } from "react-router";
import UrlImportModal from "../../modals/url-import/url-import";

function Home() {
  const { recipes, loading, fetchRecipes } = useRecipes();
  const [showModal, setShowModal] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const navigate = useNavigate();

  const auth = useAuth();
  useEffect(() => {
    if (!auth.isAuthenticated) return;
    fetchRecipes();
  }, [auth.isAuthenticated, fetchRecipes]);

  return (
    <main className="home-page">
      {showModal ? (
        <div className="modal-container">
          <RecipeCreationModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSelectOption={(option) => {
              if (option === "url") {
                setShowModal(false);
                setShowUrlModal(true);
                return;
              }
              navigate("/recipe-creation");
            }}
          />
        </div>
      ) : null}
      <UrlImportModal
        isOpen={showUrlModal}
        onClose={() => setShowUrlModal(false)}
        onImport={async (url) => {
          // TODO: replace with a real API call once the import endpoint exists
          await new Promise((resolve) => setTimeout(resolve, 2000));
          setShowUrlModal(false);
          navigate("/recipe-creation", { state: { importUrl: url } });
        }}
      />
      <div className="navbar">
        <div className="brand">
          <svg
            className="brand-mark"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2c.6 3.2-1.6 4.9-3 6.8C7.6 10.6 6.5 12.4 6.5 14.8A5.5 5.5 0 0 0 12 20.5a5.5 5.5 0 0 0 5.5-5.7c0-2.2-1-3.9-2.2-5.1.1 1.6-.5 2.9-1.6 3.4.3-3.6-.7-8.1-1.7-11.1Z" />
          </svg>
          <h1 className="home-title">
            <span className="home-title-the">The</span>
            <span className="home-title-main">Grease Pit</span>
          </h1>
        </div>
        <nav className="navbar-links">
          <a className="nav-button" href="#">
            My Recipes
          </a>
          <a className="nav-button" href="#">
            Discover
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
          {!loading && recipes.length === 0 ? (
            <div className="empty-state">
              <h3 className="empty-state-title">No recipes yet</h3>
              <p className="empty-state-text">
                Add your first recipe to start building your collection.
              </p>
              <button
                className="create-button"
                onClick={() => setShowModal(true)}
              >
                + Create Recipe
              </button>
            </div>
          ) : (
            <div className="recipe-cards">
              {recipes.map((recipe, index) => (
                <RecipeCard key={index} {...recipe} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Home;
