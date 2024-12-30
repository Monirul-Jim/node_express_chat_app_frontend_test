import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import { useAppSelector } from "./redux/feature/hooks";

function App() {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && location.pathname !== "/chat") {
      navigate("/chat", { replace: true });
    } else if (!user && !["/", "/register"].includes(location.pathname)) {
      navigate("/", { replace: true });
    }
  }, [user, location.pathname, navigate]);

  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
