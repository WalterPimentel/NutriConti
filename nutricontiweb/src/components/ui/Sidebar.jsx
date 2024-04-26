import { NavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
  const actualLocation = useLocation().pathname;
  const locations = [
    { to: "/", name: "Ordenes", icon: "fas fa-clipboard-list mr-2" },
    { to: "/menu", name: "Menú", icon: "fas fa-utensils mr-2" }
  ];
  return (
    <div className="md:w-1/4 xl:w-1/5">
      <div className="md:w-1/4 xl:w-1/5 bg-gray-800 md:fixed h-full overflow-y-auto">
        <div className="p-6">
          <p className="text-white text-center font-extrabold text-3xl whitespace-nowrap overflow-hidden">
            NutriConti
            <span className="text-green-500">Web</span>
          </p>
          <p className="mt-2 text-center text-white text-lg">Gestiona el restaurante con las siguientes opciones</p>
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
                <i className={value.icon}></i>
                {value.name}                
              </NavLink>
            ))}            
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
