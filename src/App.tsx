import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Breadcrumb from "./components/Breadcrumb";
import Login from "./pages/Login";
import PrivateRoutes from "./PrivateRoutes";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? 
            <Login onLogin={handleLogin} /> : 
            <Navigate to="/" replace />
          } 
        />
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex flex-col flex-1">
                  <Topbar />
                  <Breadcrumb />
                  <main className="p-6 flex-1 overflow-auto">
                    <PrivateRoutes />
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;