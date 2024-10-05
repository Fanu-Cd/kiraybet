import React from "react";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/routes";
import "./utils/i18n";
import LanguageProvider from "./context/language-provider";
import SessionProvider from "./context/session-provider";
function App() {
  return (
    <LanguageProvider>
      <SessionProvider>
        <RouterProvider router={routes()} />
      </SessionProvider>
    </LanguageProvider>
  );
}

export default App;
