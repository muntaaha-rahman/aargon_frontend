import { useLocation, Link } from "react-router-dom";

function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="bg-white shadow-sm rounded-lg px-4 py-3 m-4">
      <nav className="text-sm text-gray-600">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="hover:text-blue-600 font-medium">
              Home
            </Link>
          </li>
          {pathnames.map((name, index) => {
            const path = "/" + pathnames.slice(0, index + 1).join("/");
            const isLast = index === pathnames.length - 1;

            return (
              <li key={path} className="flex items-center space-x-2">
                <span className="text-gray-400">/</span>
                {isLast ? (
                  <span className="capitalize text-gray-800 font-semibold">
                    {name}
                  </span>
                ) : (
                  <Link
                    to={path}
                    className="capitalize hover:text-blue-600 font-medium"
                  >
                    {name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

export default Breadcrumb;
