// import { Outlet } from "react-router-dom";
// import Sidebar from "./SideBar";
// import { useAppSelector } from "../../redux/feature/hooks";

// const MainDashboard = () => {
//   const user = useAppSelector((state) => state.auth.user);
//   console.log(user);

//   return (
//     <div className="flex min-h-screen">
//       <Sidebar />

//       <div className="flex-1 p-6">
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default MainDashboard;

import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "./SideBar";
import { useAppSelector } from "../../redux/feature/hooks";

const MainDashboard = () => {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

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
