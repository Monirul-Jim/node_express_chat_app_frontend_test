import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../Home/Register/Register";
import Login from "../Home/Login/Login"; // Assuming you also have Login
import MainDashboard from "../dashboard/Admin/MainDashboard";
import AdminHomePage from "../dashboard/Admin/AdminHomePage";
import ManageUsers from "../dashboard/Admin/ManageUsers";

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
  {
    path: "/dashboard",
    element: <MainDashboard />,
    children: [
      {
        path: "",
        element: <AdminHomePage />,
      },
      {
        path: "manage-users",
        element: <ManageUsers />,
      },
    ],
  },
]);

export default router;
