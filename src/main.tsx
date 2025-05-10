
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Auth0Provider } from "@auth0/auth0-react";
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain="dev-example.us.auth0.com"  // Replace with your Auth0 domain when deploying
    clientId="ExampleClientId123"      // Replace with your Auth0 client ID when deploying
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Auth0Provider>
);
