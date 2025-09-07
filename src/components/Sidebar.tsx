import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <aside
      className={`${
        isExpanded ? "w-64" : "w-20"
      } bg-gray-900 text-white h-screen flex flex-col transition-all duration-300`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isExpanded && <h1 className="text-xl font-bold">Aargon</h1>}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white"
        >
          {isExpanded ? "<" : ">"}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {/* Dashboard */}
          <li>
            <Link
              to="/"
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
            >
              <LayoutDashboard size={20} />
              {isExpanded && <span>Dashboard</span>}
            </Link>
          </li>

          {/* Analytics (with submenu) */}
          <li>
            <button
              onClick={() => toggleMenu("analytics")}
              className="flex items-center gap-2 w-full p-2 rounded hover:bg-gray-700"
            >
              <BarChart3 size={20} />
              {isExpanded && (
                <>
                  <span className="flex-1 text-left">Analytics</span>
                  {openMenu === "analytics" ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </>
              )}
            </button>
            {openMenu === "analytics" && isExpanded && (
              <ul className="ml-8 mt-1 space-y-1 text-sm">
                <li>
                  <Link
                    to="/analytics/overview"
                    className="block p-2 rounded hover:bg-gray-700"
                  >
                    Overview
                  </Link>
                </li>
                <li>
                  <Link
                    to="/analytics/reports"
                    className="block p-2 rounded hover:bg-gray-700"
                  >
                    Reports
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Users */}
          <li>
            <Link
              to="/users"
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
            >
              <Users size={20} />
              {isExpanded && <span>Users</span>}
            </Link>
          </li>

          {/* Settings */}
          <li>
            <Link
              to="/settings"
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
            >
              <Settings size={20} />
              {isExpanded && <span>Settings</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
