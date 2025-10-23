import React from 'react';
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from 'react';

// Lazy load all pages with explicit imports
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Users = lazy(() => import('./pages/Users'));
const Settings = lazy(() => import('./pages/Settings'));
const ViewClients = lazy(() => import('./pages/Clients/ViewClients'));
const AddClient = lazy(() => import('./pages/Clients/AddClient'));
const EditClient = lazy(() => import('./pages/Clients/EditClient'));
const AddService = lazy(() => import('./pages/Services/AddService'));
const EditService = lazy(() => import('./pages/Services/EditService'));
const ViewServices = lazy(() => import('./pages/Services/ViewServices'));
const StartService = lazy(() => import('./pages/Services/StartService'));
const ViewClientServices = lazy(() => import('./pages/Services/ViewClientServices'));
const InvoiceGeneration = lazy(() => import('./pages/Invoices/InvoiceGeneration'));

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
  
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
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