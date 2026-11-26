import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import Login from "./pages/login/Login.tsx";
import Home from "./pages/home/Home.tsx";
import RecipePage from "./pages/recipe-page/recipe.tsx";

import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";
import RecipeCreationPage from "./pages/recipe-creation-page/recipe-creation.tsx";

const hostName = window.location.origin;

const authConfig = {
  authority:
    "https://TheGreasePitUsers.ciamlogin.com/6dae5b99-cf39-424e-9a2b-ff04d610f0a5/v2.0",
  client_id: "61d0465f-6736-4785-b270-c3e298cfb2f4",
  redirect_uri: `${hostName}/home`,
  response_type: "code",
  scope:
    "email openid profile offline_access api://a5b15563-c430-4372-a0bc-90b1db361d70/recipes.readwrite",
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
  <AuthProvider {...authConfig} onSigninCallback={onSigninCallback}>
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
