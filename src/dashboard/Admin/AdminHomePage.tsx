const AdminHomePage = () => {
  return (
    <div className="flex flex-col ">
      {/* Main Content */}
      <main className="flex-1  p-6">
        {/* Welcome Section */}
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-2">Welcome, Admin!</h2>
          <p className="text-gray-600">
            Here you can manage users, view reports, and customize your
            platform.
          </p>
        </section>

        {/* Statistics Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-bold text-blue-600">10</h3>
            <p className="text-gray-600">Total Users</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-bold text-green-600">7</h3>
            <p className="text-gray-600">Active Users</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-bold text-red-600">3</h3>
            <p className="text-gray-600">Blocked User</p>
          </div>
        </section>

        {/* Actionable Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Management */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2">User Management</h3>
            <p className="text-gray-600">View, edit, and manage users.</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500">
              Go to Users
            </button>
          </div>

          {/* Reports */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2">Reports</h3>
            <p className="text-gray-600">
              View detailed reports and analytics.
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500">
              View Reports
            </button>
          </div>

          {/* Settings */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2">Settings</h3>
            <p className="text-gray-600">Customize your admin dashboard.</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500">
              Edit Settings
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminHomePage;
