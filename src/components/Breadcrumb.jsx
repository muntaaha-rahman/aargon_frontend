export default function Breadcrumb({ items }) {
  return (
    <nav className="text-gray-600 text-sm my-4 px-6">
      <ol className="flex space-x-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center">
            {idx > 0 && <span className="mx-1">/</span>}
            <a
              href={item.href}
              className="hover:text-green-600 transition"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
