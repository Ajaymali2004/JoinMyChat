import { createContext, useState, useEffect } from "react";
import { verify } from "../main/validateRoom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  let username = localStorage.getItem("username");
  const [user, setUser] = useState(username);

  useEffect(() => {
    const intial = async () => {
      username = localStorage.getItem("username");
      const token = localStorage.getItem("token");
      if (username && token) {
        const verification = await verify(username, token);
        if (verification) setUser(username);
        else setUser(null);
      } else {
        setUser(null);
      }
    }
    intial();
  }, []);

  const login = (username) => {
    localStorage.setItem("username", username);
    setUser(username);
  };

  const logout = () => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    if (username) localStorage.removeItem("username");

    if (token) localStorage.removeItem("token");

    setUser(null);
  };
  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
