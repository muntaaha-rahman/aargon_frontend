import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import ClientsList from "./pages/Clients/ClientList";
import AddClient from "./pages/Clients/AddClient";
import EditClient from "./pages/Clients/EditClient";
import AddService from "./pages/Services/AddService";
import EditService from "./pages/Services/EditService";
import ViewServices from "./pages/Services/ViewServices";
import StartService from "./pages/Services/StartService";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PrivateRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
      <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/clients" element={<PrivateRoute><ClientsList /></PrivateRoute>} />
      <Route path="/clients/add" element={<PrivateRoute><AddClient /></PrivateRoute>} />
      <Route path="/clients/edit/:id" element={<PrivateRoute><EditClient /></PrivateRoute>} />
      <Route path="/services/add" element={<PrivateRoute><AddService /></PrivateRoute>} />
      <Route path="/services/edit/:id" element={<PrivateRoute><EditService /></PrivateRoute>} />
      <Route path="/services" element={<PrivateRoute><ViewServices /></PrivateRoute>} />
      <Route path="/start_services" element={<PrivateRoute><StartService /></PrivateRoute>} />
    </Routes>
  );
};

export default PrivateRoutes;