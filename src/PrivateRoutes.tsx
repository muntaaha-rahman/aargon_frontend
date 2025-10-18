import React from 'react';
import { Routes, Route } from "react-router-dom";
import { lazyLoad } from './utils/lazyLoad';

// Lazy load all pages
const Dashboard = lazyLoad('Dashboard');
const Analytics = lazyLoad('Analytics');
const Users = lazyLoad('Users');
const Settings = lazyLoad('Settings');
const ViewClients = lazyLoad('Clients/ViewClients');
const AddClient = lazyLoad('Clients/AddClient');
const EditClient = lazyLoad('Clients/EditClient');
const AddService = lazyLoad('Services/AddService');
const EditService = lazyLoad('Services/EditService');
const ViewServices = lazyLoad('Services/ViewServices');
const StartService = lazyLoad('Services/StartService');
const ViewClientServices = lazyLoad('Services/ViewClientServices');
const InvoiceGeneration = lazyLoad('Invoices/InvoiceGeneration');

// Loading component for suspense fallback
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

// Private Route wrapper with suspense
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }
  
  return <React.Suspense fallback={<LoadingSpinner />}>{children}</React.Suspense>;
};

const PrivateRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
      <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/clients" element={<PrivateRoute><ViewClients /></PrivateRoute>} />
      <Route path="/clients/add" element={<PrivateRoute><AddClient /></PrivateRoute>} />
      <Route path="/clients/edit/:id" element={<PrivateRoute><EditClient /></PrivateRoute>} />
      <Route path="/services/add" element={<PrivateRoute><AddService /></PrivateRoute>} />
      <Route path="/services/edit/:id" element={<PrivateRoute><EditService /></PrivateRoute>} />
      <Route path="/services" element={<PrivateRoute><ViewServices /></PrivateRoute>} />
      <Route path="/start_services" element={<PrivateRoute><StartService /></PrivateRoute>} />
      <Route path="/view_client_services" element={<PrivateRoute><ViewClientServices /></PrivateRoute>} />
      <Route path="/invoice" element={<PrivateRoute><InvoiceGeneration /></PrivateRoute>} />
    </Routes>
  );
};

export default PrivateRoutes;