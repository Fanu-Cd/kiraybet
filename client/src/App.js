import React from "react";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/routes";
import "./utils/i18n";
import LanguageProvider from "./context/language-provider";
import SessionProvider from "./context/session-provider";
import Footer from "./components/common/footer";
function App() {
  return (
    <div className="w-full p-0 flex flex-col min-h-screen">
      <LanguageProvider>
        <SessionProvider>
          <RouterProvider router={routes()} />
        </SessionProvider>
      </LanguageProvider>
      <Footer />
    </div>
  );
}

export default App;
