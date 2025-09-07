import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white flex-shrink-0">
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link to="/" className="block p-2 rounded hover:bg-gray-700">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/analytics" className="block p-2 rounded hover:bg-gray-700">
              Analytics
            </Link>
          </li>
          <li>
            <Link to="/users" className="block p-2 rounded hover:bg-gray-700">
              Users
            </Link>
          </li>
          <li>
            <Link to="/settings" className="block p-2 rounded hover:bg-gray-700">
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
