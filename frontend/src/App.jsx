import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage'; // Adjust import path if needed
import AdminDashboard from './Admin Portal/AdminDashboard'; // Adjust import path if needed
import InnerPantryDashboard from './Innerpantry Portal/InnerPantry Portal';
import ErrorPage from './pages/ErrorPage';
import PantryLogin from "./logins/InnerPantryLogin"
import DeliveryDashboard from "./Delivery portal/DeliveryDashboard";
import DeliveryLogin from "./logins/DeliveryLogin"

import AdminLogin from './logins/AdminLogin';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<ErrorPage />} />


        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/innerpantry-dashboard" element={<InnerPantryDashboard />} />
        <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />


        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/innerpantry-login" element={<PantryLogin />} />
        <Route path="/delivery-portal" element={<DeliveryLogin />} />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
