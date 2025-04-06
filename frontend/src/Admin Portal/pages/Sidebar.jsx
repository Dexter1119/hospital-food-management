import React, { useState } from "react";
import styled from "styled-components";
import 'font-awesome/css/font-awesome.min.css';

const SidebarWrapper = styled.div`
  /* Sidebar Styles */
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${(props) => (props.isOpen ? "240px" : "0")};
  background-color: #14b1be;
  padding: ${(props) => (props.isOpen ? "20px" : "0")};
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: ${(props) => (props.isOpen ? "2px 0 10px rgba(0, 0, 0, 0.1)" : "none")};
  overflow: hidden;
  transition: width 0.3s ease, padding 0.3s ease;
  z-index: 1000;

  /* Logo Section */
  .logo {
    text-align: center;
    margin-top: 30px;
    display: ${(props) => (props.isOpen ? "block" : "none")};
  }

  .logo h2 {
    font-size: 1.5rem;
    margin: 0;
  }

  .navItem {
    padding: 10px 15px;
    border-radius: 5px;
    margin-top: 20px;
    cursor: pointer;
    text-align: center;
    background-color: #17a2b8;
    color: white;
    font-weight: bold;
    transition: background-color 0.3s ease;
    display: ${(props) => (props.isOpen ? "block" : "none")};
  }

  .navItem:hover {
    background-color: #138f99;
  }

  .logoutButtonContainer {
    padding-bottom: 400px;
    margin-top: auto;
    display: ${(props) => (props.isOpen ? "block" : "none")};
    opacity: ${(props) => (props.isOpen ? 1 : 0)};
    transform: ${(props) => (props.isOpen ? "translateX(0)" : "translateX(-100%)")};
    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  }

  .logoutButton {
    padding: 10px;
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.3s ease;
    width: 100%;
  }

  .logoutButton:hover {
    background-color: #c0392b;
  }

  /* Mobile Styles */
  @media (max-width: 768px) {
    .toggleButton {
      display: inline-block;
    }
  }
`;

const ToggleButton = styled.button`
  position: fixed;
  top: 15px;
  left: 15px;
  background-color: #17a2b8;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 15px 20px;
  font-size: 18px;
  cursor: pointer;
  z-index: 1100;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #138f99;
  }
`;

const Sidebar = ({ setActiveView }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle Button */}
      <ToggleButton onClick={toggleSidebar}>
        ☰
      </ToggleButton>

      {/* Sidebar */}
      <SidebarWrapper isOpen={isOpen}>
        {/* Logo Section */}
        <div className="logo">
          <h2>Admin Dashboard</h2>
        </div>

        {/* Navigation Links */}
        <div className="navItem" onClick={() => setActiveView("overview")}>
          Dashboard Overview
        </div>
        <div className="navItem" onClick={() => setActiveView("patient-management")}>
          Add Patient
        </div>
        <div className="navItem" onClick={() => setActiveView("Add-Pantry-Staff")}>
          Add Pantry-Staff
        </div>
        <div className="navItem" onClick={() => setActiveView("diet-chart-management")}>
          Diet Chart Management
        </div>
        <div className="navItem" onClick={() => setActiveView("pantry-task-management")}>
          Pantry Task Management
        </div>
        <div className="navItem" onClick={() => setActiveView("patient-details")}>
          Patient Details
        </div>

        {/* Logout Button */}
        <div className="navItem" onClick={() => setActiveView("logout")}>
          Logout
        </div>
      </SidebarWrapper >
    </>
  );
};

export default Sidebar;
