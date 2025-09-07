import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Breadcrumb from "./components/Breadcrumb";

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

import ClientsList from "./pages/Clients/ClientList";
import AddClient from "./pages/Clients/AddClient";
import EditClient from "./pages/Clients/EditClient";

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Topbar />
          <Breadcrumb />
          <main className="p-6 flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
              {/* Clients */}
              <Route path="/clients" element={<ClientsList />} />
              <Route path="/clients/add" element={<AddClient />} />
              <Route path="/clients/edit/:id" element={<EditClient />} />

            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
