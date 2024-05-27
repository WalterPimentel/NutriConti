import useUsuario from "../../hooks/useUsuario";
import { NavLink, useLocation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const Sidebar = (props) => {

  const { usuario, loading } = useUsuario(props.user.uid);

  const actualLocation = useLocation().pathname;
  const locations = [
    { to: "/", name: "Ordenes", icon: "fas fa-clipboard-list mr-2", roles: ['administrador', 'caja', 'mesero'] },
    { to: "/ordenes-pasadas", name: "Ordenes Pasadas", icon: "fas fa-clipboard-check mr-2", roles: ['administrador', 'caja'] },
    { to: "/menu", name: "Menú", icon: "fas fa-utensils mr-2", roles: ['administrador', 'caja', 'mesero'] },
    { to: "/usuarios", name: "Usuarios", icon: "fas fa-users mr-2 fa-xs", roles: 'administrador' },
  ];

  if (loading) {
    return (
      <LoadingSpinner isOpen={loading} />
    );
  }

  return (
    <div
      className="h-full overflow-x-hidden overflow-y-auto flex flex-col"
      style={{

        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}
    >
      <div className={`${props.isSidebarVisible ? 'p-6 flex-grow' : 'p-4 flex-grow'}`}>
        <p className={`mt-2 text-center text-white text-lg ${!props.isSidebarVisible ? 'hidden' : ''}`}>Gestiona el restaurante con las siguientes opciones</p>
        <nav className="mt-10">
          {locations.filter(location => location.roles.includes(usuario.puesto)).map((value, index) => (
            <NavLink
              className={
                value.to === actualLocation
                  ? `${props.isSidebarVisible ? 'text-yellow-400 block hover:bg-yellow-500 hover:text-gray-900' : 'text-yellow-400 block hover:text-yellow-300'}`
                  : `${props.isSidebarVisible ? 'p-1 text-gray-400 block hover:bg-yellow-500 hover:text-gray-900' : 'text-gray-400 block hover:text-yellow-500'}`
              }
              key={index}
              to={value.to}
            >
              <i className={`${value.icon} ${props.isSidebarVisible ? '' : 'mb-5'}`} />
              <span className={`${!props.isSidebarVisible ? 'hidden' : ''}`}>{value.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex-shrink-0">
        <div className="p-2 text-white flex items-center">
          {props.user && (
            <>
              <img className={`rounded-full ${!props.isSidebarVisible ? 'h-9 w-9' : 'h-16 w-16'}`} src={props.user.photoURL} alt={props.user.displayName} />
              <div className={`ml-4 overflow-hidden ${!props.isSidebarVisible ? 'hidden' : ''}`}>
                <p className="overflow-hidden text-overflow-ellipsis whitespace-nowrap font-bold">
                  {props.user.displayName}
                </p>
                <p className="text-sm italic overflow-hidden text-overflow-ellipsis whitespace-nowrap">
                  {props.user.email}
                </p>
                <p className="uppercase text-sm">{usuario.puesto}</p>
              </div>
            </>
          )}
        </div>
        <button
          className={`w-full bg-red-500 text-white py-2 px-4 hover:bg-red-700 transition duration-200 uppercase font-bold ${!props.isSidebarVisible ? 'hidden' : ''}`}
          onClick={props.onLogout}
        >
          <i className="fa-solid fa-right-from-bracket fa-rotate-180 mr-2"></i>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
