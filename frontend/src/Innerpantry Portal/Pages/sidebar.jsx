import React, { useState } from "react";
import styled from "styled-components";
import { FaUserCircle, FaUserMd, FaClipboardList, FaTasks, FaSignOutAlt } from "react-icons/fa";
import 'font-awesome/css/font-awesome.min.css';

// Sidebar Wrapper styled component
const SidebarWrapper = styled.div`
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

const SidebarHeader = styled.h2`
  margin-top: 30px;
  font-size: 1.5rem;
  text-align: center;
`;

const NavItem = styled.div`
  padding: 10px 10px;
  border-radius: 5px;
  margin-top: 20px;
  cursor: pointer;
  text-align: center;
  background-color: #17a2b8;
  color: white;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #138f99;
  }
`;

const LogoutButton = styled.div`
  padding: 10px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  width: 100%;
  margin-top: 10px;
  margin-right:5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c0392b;
  }
`;

const Sidebar = ({ setActiveView }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <ToggleButton onClick={toggleSidebar}>
        ☰
      </ToggleButton>

      <SidebarWrapper isOpen={isOpen}>
        <SidebarHeader>Hospital Food Management</SidebarHeader>

        <NavItem onClick={() => setActiveView("my-profile")}>
          <FaUserCircle style={{ marginRight: "10px" }} />
          My Profile
        </NavItem>
        <NavItem onClick={() => setActiveView("add-delivery-staff")}>
          <FaUserMd style={{ marginRight: "10px" }} />
          Add Delivery Staff
        </NavItem>

        <NavItem onClick={() => setActiveView("pending-tasks")}>
          <FaTasks style={{ marginRight: "10px" }} />
          Pending Task Management
        </NavItem>
        <NavItem onClick={() => setActiveView("completed-tasks")}>
          <FaTasks style={{ marginRight: "10px" }} />
          Completed Task Management
        </NavItem>

        <LogoutButton onClick={() => setActiveView("logout")}>
          <FaSignOutAlt style={{ marginRight: "10px" }} />
          Logout
        </LogoutButton>
      </SidebarWrapper>
    </>
  );
};

export default Sidebar;
