export default function Topbar() {
  return (
    <div className="w-full h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="font-bold text-xl text-gray-800">Aargon Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">Hello, Muntaaha 👋</span>
        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </div>
  );
}
