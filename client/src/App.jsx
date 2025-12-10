import React from "react";
import { useAuth } from "./AuthContext";
import AuthPage from "./AuthPage";
import Home from "./Home";

const App = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return user ? <Home /> : <AuthPage />;
};

export default App;
