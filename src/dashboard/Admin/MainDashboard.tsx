import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";

const MainDashboard = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default MainDashboard;
