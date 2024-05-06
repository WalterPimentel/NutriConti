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

import Login from "./components/paginas/Login";

function App() {

  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [user, setUser] = useState(null);
  useEffect(() => {
    firebase.firebase.auth().onAuthStateChanged((user) => {
      setUser(user); // Actualiza el estado del usuario cuando cambia
    });
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleLogout = () => {
    firebase.firebase.auth().signOut();
  };

  // Si el usuario no está autenticado, muestra el componente Login
  if (!user) {
    handleLogout();
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
