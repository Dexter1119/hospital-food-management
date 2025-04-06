import React, { useState } from "react";
import Sidebar from "./pages/Sidebar";

import PatientManagement from "./pages/PatientManagement";
import DietChartManagement from "./pages/DietChartManagement";
import PantryTaskManagement from "./pages/PantryTaskManagement";
import MealDeliveryOverview from "./pages/MealDeliveryOverview";
import PatientDetailsPage from "./pages/PatientDetailsPage";
import AddPantryStaff from "./pages/AddPantryStaff";
import logout from "./pages/logout";


const AdminDashboard = () => {
  // States to handle dashboard views
  const [activeView, setActiveView] = useState("overview");

  const renderDashboardView = () => {
    switch (activeView) {
      case "overview":
        return <MealDeliveryOverview />;
      case "patient-management":
        return <PatientManagement />;
      case "patient-details":
        return <PatientDetailsPage />;
      case "diet-chart-management":
        return <DietChartManagement />;
      case "pantry-task-management":
        return <PantryTaskManagement />;
      case "Add-Pantry-Staff":
        return <AddPantryStaff />;
        case "logout":
        return <logout />;

      default:
        return <MealDeliveryOverview />;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar setActiveView={setActiveView} />

      {/* Main Dashboard Area */}
      <div className="flex-1">


        <div className="p-6">
          {/* //<h2 className="text-2xl font-semibold mb-6">Hospital Food Management Dashboard</h2> */}

          {/* Render Active View */}s
          {renderDashboardView()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
