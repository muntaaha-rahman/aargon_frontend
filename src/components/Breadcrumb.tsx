import { useLocation } from "react-router-dom";

function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="bg-gray-100 px-4 py-2 text-sm text-gray-600">
      <ol className="flex space-x-2">
        <li>Home</li>
        {pathnames.map((name, index) => {
          const path = "/" + pathnames.slice(0, index + 1).join("/");
          return (
            <li key={path} className="flex items-center space-x-2">
              <span>/</span>
              <span className="capitalize">{name}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
