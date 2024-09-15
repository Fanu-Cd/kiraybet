import React from "react";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/routes";
import './utils/i18n'; 
import LanguageProvider from "./context/language-provider";
function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={routes} />
    </LanguageProvider>
  );
}

export default App;
