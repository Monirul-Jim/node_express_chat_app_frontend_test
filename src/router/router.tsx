import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../Home/Register/Register";
import Login from "../Home/Login/Login"; // Assuming you also have Login

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);

export default router;
