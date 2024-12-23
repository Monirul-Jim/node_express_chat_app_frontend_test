import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-0 bg-gray-800 bg-opacity-75 z-50 transition-transform md:translate-x-0 md:bg-opacity-100 md:relative md:block md:w-64 md:bg-gray-800`}
      >
        <div className="p-5">
          {/* Close Button */}
          <button
            onClick={toggleSidebar}
            className="text-white absolute top-4 right-4 md:hidden"
            aria-label="Close Sidebar"
          >
            {/* Close Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h2 className="text-white text-xl">Sidebar</h2>
          <ul className="mt-4 space-y-4">
            <li>
              <a href="/dashboard" className="text-white hover:text-gray-400">
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="dashboard/manage-users"
                className="text-white hover:text-gray-400"
              >
                Manage Users
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Hamburger Menu Button for Mobile */}
        <button
          onClick={toggleSidebar}
          className="text-white bg-blue-500 p-2 rounded-md md:hidden"
        >
          {/* Hamburger Icon */}
          {!isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          ) : (
            // Close Icon for Sidebar
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
