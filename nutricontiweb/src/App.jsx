import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";

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
  const [loading, setLoading] = useState(true); // Nuevo estado para manejar la carga
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const authUnsubscribe = firebase.auth().onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);

      if (user) {
        const firestoreUnsubscribe = firebase.db.collection('usuarios').doc(user.uid)
          .onSnapshot(doc => {
            if (!doc.exists) {
              // El documento del usuario no existe, cerrar la sesión
              firebase.auth().signOut();
            } else {
              setUserRole(doc.data().puesto);
            }
          }, error => {
            console.log('Error getting document:', error);
          });

        // Devolver una función de limpieza que desuscribe el listener de Firestore
        return () => firestoreUnsubscribe();
      }
    });

    // Devolver una función de limpieza que desuscribe el listener de Auth
    return () => authUnsubscribe();

  }, [user]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  // Si la aplicación está cargando, muestra una pantalla de carga o un spinner
  if (loading) {
    return (
      <LoadingSpinner isOpen={loading} />
    );
  }

  // Si el usuario no está autenticado, muestra el componente Login
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
              <Routes>
                <Route path="/ordenes-pasadas" element={userRole && ['administrador', 'caja'].includes(userRole) ? <OrdenesPasadas /> : <Navigate to="/" />} />
                <Route path="/usuarios" element={userRole && ['administrador'].includes(userRole) ? <Usuarios /> : <Navigate to="/" />} />
                <Route path="/nuevo-usuario" element={userRole && ['administrador'].includes(userRole) ? <NuevoUsuario /> : <Navigate to="/" />} />
                <Route path="/menu" element={userRole && ['administrador', 'caja', 'mesero'].includes(userRole) ? <Menu /> : <Navigate to="/" />} />
                <Route path="/nuevo-platillo" element={userRole && ['administrador', 'caja'].includes(userRole) ? <NuevoPlatillo /> : <Navigate to="/" />} />
                <Route path="/menu/:platilloId" element={userRole && ['administrador'].includes(userRole) ? <DetallePlato /> : <Navigate to="/" />} />
                <Route path="/" element={<Ordenes />} />
              </Routes>
            </div>
          </div>
        )}
        {!user && (
          <Login />
        )}
      </FirebaseContext.Provider>
    </UserRoleContext.Provider>
  );
}

export default App;
