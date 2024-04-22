import { NavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
  const actualLocation = useLocation().pathname;
  const locations = [
    { to: "/", name: "Ordenes" },
    { to: "/menu", name: "Menú" }
  ];
  return (
    <div className="md:w-1/5 xl:w-1/5 bg-gray-800">
      <div className="p-6">
        <p className="uppercase text-white text-2xl tracking-wide text-center font-bold">
          NutriConti
        </p>
        <p className="mt-3 text-gray-600">
          Administra tu restaurant con las siguientes opciones:
        </p>
        <nav className="mt-10">
          {locations.map((value, index) => (
            <NavLink
              className={
                value.to === actualLocation
                  ? "text-yellow-400 block hover:bg-yellow-500 hover:text-gray-900"
                  : "p-1 text-gray-400 block hover:bg-yellow-500 hover:text-gray-900"
              }
              key={index}
              to={value.to}
            >
              {value.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
