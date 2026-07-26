import "./Home.css";

function Home() {
  return (
    <main className="home-page">
        <div className="navbar">
          <h1 className="home-title">The Chopping Block</h1>
          <nav className="navbar-links">
            <a className="nav-button" href="#">My Recipes</a>
            <a className="nav-button" href="#">Discover</a>
            <a className="nav-button" href="#">Favourites</a>
            <a className="nav-button" href="#">Collections</a>
          </nav>
        <div className="horizontal-line">
            <img className="profile-image" id="my-api-image" src=""/>
            <h3 className="profile-name" id="my-api-name">Username</h3>
        </div>
        </div>
        <div className="recipe-list">
            <div className="search-bar">
                <div className="search-input-wrapper">
                    <span className="search-icon">🔍</span>
                    <input className="search-input" type="text" placeholder="Search for your recipes" />
                </div>
                <button className="search-button">Search</button>
                <button className="create-button">+ Create</button>
            </div>
            <div className="large-horizontal-line"></div>
            <div className="recipes">
            </div>
        </div>
    </main>
  );
}

export default Home;
