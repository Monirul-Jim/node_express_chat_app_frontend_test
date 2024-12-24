import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import { useAppSelector } from "./redux/feature/hooks";

function App() {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/chat");
    } else {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
