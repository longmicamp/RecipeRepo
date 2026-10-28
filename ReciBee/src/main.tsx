import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import Login from "./pages/login/Login.tsx";
import Home from "./pages/home/Home.tsx";
import RecipePage from "./pages/recipe-page/recipe.tsx";

import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";
import RecipeCreationPage from "./pages/recipe-creation-page/recipe-creation.tsx";

const cognitoAuthConfig = {
  authority:
    "https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_rcqwarb2z",
  client_id: "20qf3imk30mr42205id1b1h1da",
  redirect_uri: "http://localhost:5173/home",
  response_type: "code",
  scope: "email openid phone",
  // Default is sessionStorage, which is per-tab and lost if the flow lands in a
  // different browsing context than the one that started it — the usual cause of
  // "No matching state found in storage".
  stateStore: new WebStorageStateStore({ store: window.localStorage }),
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

const onSigninCallback = (): void => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

createRoot(document.getElementById("root")!).render(
  <AuthProvider {...cognitoAuthConfig} onSigninCallback={onSigninCallback}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/recipe" element={<RecipePage />} />
        <Route path="/recipe-creation" element={<RecipeCreationPage />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>,
);
