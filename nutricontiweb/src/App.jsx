import { useState, useEffect } from "react";
import { Routes, Route } from "react-router";

import firebase, { FirebaseContext } from "./firebase";

import Ordenes from "./components/paginas/Ordenes";
import Menu from "./components/paginas/Menu";
import NuevoPlatillo from "./components/paginas/NuevoPlatillo";
import Sidebar from "./components/ui/Sidebar";
import DetallePlato from "./components/paginas/DetallePlato";
import Usuarios from "./components/paginas/Usuarios";
import NuevoUsuario from "./components/paginas/NuevoUsuario";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import Login from "./components/paginas/Login";

function App() {

  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Nuevo estado para manejar la carga
  useEffect(() => {
    let timerId;
    firebase.auth().onAuthStateChanged((user) => {
      setUser(user); // Actualiza el estado del usuario cuando cambia
      setLoading(false); // Actualiza el estado de carga cuando se ha verificado el estado de autenticación
      if (user) {
        // El usuario ha iniciado sesión, inicia el temporizador        
        timerId = setTimeout(() => {
          firebase.auth().signOut();
        }, 60 * 60 * 1000); // Cierra la sesión después de 1 hora
      } else {
        // El usuario ha cerrado sesión, limpia el temporizador
        clearTimeout(timerId);
      }
    });
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  // Si la aplicación está cargando, muestra una pantalla de carga o un spinner
  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  // Si el usuario no está autenticado, muestra el componente Login
  if (!user) {
    return <Login />;
  }

  return (

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
              <Route path="/" element={<Ordenes />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/nuevo-usuario" element={<NuevoUsuario />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/nuevo-platillo" element={<NuevoPlatillo />} />
              <Route path="/menu/:platilloId" element={<DetallePlato />} />
            </Routes>
          </div>
        </div>
      )}
      {!user && (
        <Login />
      )}
    </FirebaseContext.Provider>
  );
}

export default App;
