import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentSession } from "../utils/getCurrentSession";
const SessionContext = createContext();
export const useSession = () => useContext(SessionContext);
const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    localStorage.getItem("userId") &&
      getCurrentSession().then((res) => {
        setSession(res?.data);
      });
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
