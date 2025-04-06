import React, { useState } from "react";
import Sidebar from "./Pages/sidebar";  // Assuming Sidebar is in the same folder
import TopBar from "./Pages/Topbar";    // Assuming Topbar is in the same folder
import PendingTasks from "./Pages/PendingTask";  // Assuming PendingTasks is in the same folder
import Profile from "./Pages/profile";  // Assuming Profile is in the same folder
import AddDeliveryPersonnel from "./Pages/AddDeliveryPerson";  // Assuming AddDeliveryStaff is in the same folder
import Logout from "./Pages/LogOut";
import CompletedTasks from "./Pages/completedTask";


const InnerPantryDashboard = () => {
  const [activeView, setActiveView] = useState("my-profile"); // Set default view to 'my-profile'

  return (
    <div className="dashboard-container">
      {/* Sidebar and Topbar */}
      <Sidebar setActiveView={setActiveView} />
      <div className="main-content">

        <div className="content-body">
          {/* Conditional rendering based on active view */}
          {activeView === "pending-tasks" && <PendingTasks />}
          {activeView === "my-profile" && <Profile />}
          {activeView === "add-delivery-staff" && <AddDeliveryPersonnel />}
          {activeView === "logout" && <Logout />}
          {activeView === "completed-tasks" && <CompletedTasks />}

          {/* You can add more views like Diet Chart Management, Task Management, etc. */}
        </div>
      </div>
    </div>
  );
};

export default InnerPantryDashboard;
