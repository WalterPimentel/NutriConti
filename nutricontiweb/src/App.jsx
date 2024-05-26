import { useState, useEffect } from "react";
import { useRoutes, Navigate } from "react-router-dom";

import firebase, { FirebaseContext } from "./firebase";
import { UserRoleContext } from "./contexts/UserRoleContext";

import Ordenes from "./components/paginas/Ordenes";
import Menu from "./components/paginas/Menu";
import NuevoPlatillo from "./components/paginas/NuevoPlatillo";
import Sidebar from "./components/ui/Sidebar";
import DetallePlato from "./components/paginas/DetallePlato";
import Usuarios from "./components/paginas/Usuarios";
import NuevoUsuario from "./components/paginas/NuevoUsuario";
import OrdenesPasadas from "./components/paginas/OrdenesPasadas";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import Login from "./components/paginas/Login";

function App() {

  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null);

  useEffect(() => {
    const authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const firestoreUnsubscribe = firebase.db.collection('usuarios').doc(user.uid)
          .onSnapshot(doc => {
            if (!doc.exists) {
              console.log('No existe documento para este usuario');
              firebase.auth().signOut();
            } else {
              const role = doc.data().puesto;
              setUserRole(role);
              localStorage.setItem('userRole', role);
              setUser(user);
              setLoading(false);
            }
          }, error => {
            console.log('Error al obtener documento:', error);
            // Aquí puedes redirigir al usuario a la página de inicio de sesión o mostrar un mensaje de error
          });
  
        return () => {
          authUnsubscribe();
          firestoreUnsubscribe();
        };
      } else {
        console.log('Usuario no autenticado');
        // Aquí puedes redirigir al usuario a la página de inicio de sesión o mostrar un mensaje de error
        setLoading(false);
      }
    });
  }, []);

  const routing = useRoutes([
    {
      path: '/ordenes-pasadas',
      element: userRole && ['administrador', 'caja']
        .includes(userRole) ? <OrdenesPasadas /> : <Navigate to="/" />
    },
    {
      path: '/usuarios',
      element: userRole && ['administrador']
        .includes(userRole) ? <Usuarios /> : <Navigate to="/" />
    },
    {
      path: '/nuevo-usuario',
      element: userRole && ['administrador']
        .includes(userRole) ? <NuevoUsuario /> : <Navigate to="/" />
    },
    {
      path: '/menu',
      element: userRole && ['administrador', 'caja', 'mesero']
        .includes(userRole) ? <Menu /> : <Navigate to="/" />
    },
    {
      path: '/nuevo-platillo',
      element: userRole && ['administrador', 'caja']
        .includes(userRole) ? <NuevoPlatillo /> : <Navigate to="/" />
    },
    {
      path: '/menu/:platilloId',
      element: userRole && ['administrador']
        .includes(userRole) ? <DetallePlato /> : <Navigate to="/" />
    },
    { path: '/', element: <Ordenes /> }
  ]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  if (loading) {
    return (
      <LoadingSpinner isOpen={loading} />
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <UserRoleContext.Provider value={userRole}>
      <FirebaseContext.Provider value={{ firebase }}>
        {user && (
          <div className="md:flex min-h-screen">
            {sidebarVisible && <Sidebar user={user} onLogout={handleLogout} />}
            <div className={`md:w-3/5 xl:w-4/5 p-6 ml-${sidebarVisible ? "1/4" : "0"} md:ml-0 transition-all duration-300 ease-in-out`}>
              <button onClick={toggleSidebar}>
                {sidebarVisible ? (
                  <>
                    <i className="fas fa-circle-arrow-left"></i> Ocultar Barra Lateral
                  </>
                ) : (
                  <>
                    <i className="fas fa-circle-arrow-right"></i> Mostrar Barra Lateral
                  </>
                )}
              </button>
              {routing}
            </div>
          </div>
        )}
      </FirebaseContext.Provider>
    </UserRoleContext.Provider>
  );
}

export default App;
