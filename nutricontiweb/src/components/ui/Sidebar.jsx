import { useEffect, useContext, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { FirebaseContext } from "../../firebase";

const Sidebar = (props) => {
  const { firebase } = useContext(FirebaseContext)
  const [loading, setLoading] = useState(true);
  const [usuario, guardarUsuario] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.db.collection('usuarios').doc(props.user.uid)
      .onSnapshot(doc => {
        if (doc.exists) {
          const usuario = {
            id: doc.id,
            ...doc.data()
          };
          setLoading(false);
          guardarUsuario(usuario);
        } else {
          console.log('No such document!');
        }
      }, error => {
        console.log('Error getting document:', error);
      });

    // Limpiar la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []);

  const actualLocation = useLocation().pathname;
  const locations = [
    { to: "/", name: "Ordenes", icon: "fas fa-clipboard-list mr-2" },
    { to: "/ordenes-pasadas", name: "Ordenes Pasadas", icon: "fas fa-clipboard-check mr-2" },
    { to: "/menu", name: "Menú", icon: "fas fa-utensils mr-2" },
    { to: "/usuarios", name: "Usuarios", icon: "fas fa-users mr-2 fa-xs" },
  ];

  if (loading) {
    return (
      <LoadingSpinner isOpen={loading} />
    );
  }

  return (
    <div className="md:w-1/4 xl:w-1/5">
      <div className="md:w-1/4 xl:w-1/5 bg-gray-800 md:fixed h-full overflow-y-auto flex flex-col">
        <div className="p-6 flex-grow">
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
        <div>
          <div className="p-2 text-white flex items-center">
            {props.user && (
              <>
                <img className="h-16 w-16 rounded-full" src={props.user.photoURL} alt={props.user.displayName} />
                <div className="ml-4 overflow-hidden">
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
            className="w-full bg-red-500 text-white py-2 px-4 hover:bg-red-700 transition duration-200 uppercase font-bold"
            onClick={props.onLogout}
          >
            <i className="fa-solid fa-right-from-bracket fa-rotate-180 mr-2"></i>
            Cerrar sesión</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
