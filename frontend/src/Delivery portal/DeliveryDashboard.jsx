import React, { useState } from "react";
import Sidebar from "./pages/sidebar"; // Importing the Sidebar component
// Importing the TopBar component
import PendingTasks from "./pages/pendingTask"; // Importing PendingTasks component
import Profile from "./pages/profile"; // Importing Profile component
import UpdateAvailability from "./pages/updateAvaiblity"; // Importing UpdateAvailability component
import Logout from "./pages/logout";

const DeliveryDashboard = () => {
  // State to handle active view in the dashboard
  const [activeView, setActiveView] = useState("pending-tasks");

  // Function to render the active view based on the selected option
  const renderDashboardView = () => {
    switch (activeView) {
      case "profile":
        return <Profile />;
      case "pending-tasks":
        return <PendingTasks />;

      case "update-availability":
        return <UpdateAvailability />;
      case "logout":
        return <Logout />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar setActiveView={setActiveView} />

      {/* Main Dashboard Area */}
      <div className="flex-1">

        <div className="p-6">
          {/* Render Active View */}
          {renderDashboardView()}
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
