import { NavLink } from "react-router-dom";
import { Home, Settings, BarChart3, Users, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-gray-900 text-gray-100 h-screen p-4 flex flex-col transition-all duration-300`}
    >
      <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 mb-6">
        {isOpen ? <X /> : <Menu />}
      </button>

      <nav className="flex flex-col space-y-4">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 hover:text-green-400"
        >
          <Home size={20} />
          {isOpen && <span>Dashboard</span>}
        </NavLink>
        <NavLink
          to="/analytics"
          className="flex items-center gap-3 hover:text-green-400"
        >
          <BarChart3 size={20} />
          {isOpen && <span>Analytics</span>}
        </NavLink>
        <NavLink
          to="/users"
          className="flex items-center gap-3 hover:text-green-400"
        >
          <Users size={20} />
          {isOpen && <span>Users</span>}
        </NavLink>
        <NavLink
          to="/settings"
          className="flex items-center gap-3 hover:text-green-400"
        >
          <Settings size={20} />
          {isOpen && <span>Settings</span>}
        </NavLink>
      </nav>
    </div>
  );
}
