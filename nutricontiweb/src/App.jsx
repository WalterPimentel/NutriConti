import { useState, useEffect } from "react";

import firebase, { FirebaseContext } from "./firebase";
import { UserRoleContext } from "./contexts/UserRoleContext";

import Header from "./components/ui/Header";
import Sidebar from "./components/ui/Sidebar";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import Login from "./components/paginas/Login";
import Routes from "./components/routing/Routes";

import useWindowSize from "./hooks/useWindowSize";

import useAuth from "./auth/useAuth";

function App() {

  const size = useWindowSize();

  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const { user, userRole, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (size.width < 728) {
      setSidebarVisible(false);
    } else {
      setSidebarVisible(true);
    }
  }, [size]);

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  if (loading) {
    return <LoadingSpinner isOpen={loading} />;
  }

  if (!isAuthenticated || !user) {
    return <Login />;
  }

  return (
    <UserRoleContext.Provider value={userRole}>
      <FirebaseContext.Provider value={{ firebase }}>
        {user && (
          <div className="flex bg-gray-200">
            <header className={`fixed z-10 w-full`}>
              <Header
                user={user}
                onLogout={handleLogout}
                isSidebarVisible={isSidebarVisible}
                setSidebarVisible={setSidebarVisible}
              />
            </header>
            <nav className={`bg-gray-800 fixed h-full overflow-y-auto ${isSidebarVisible ? (size.width >= 728 ? 'md:w-1/4 xl:w-1/5' : 'md:w-1/4 xl:w-1/5') : (size.width >= 728 ? 'w-[3.1rem]' : 'hidden')} pt-12`}>
              <Sidebar
                user={user}
                onLogout={handleLogout}
                isSidebarVisible={isSidebarVisible}
                setSidebarVisible={setSidebarVisible}
              />
            </nav>
            <div className={`flex flex-col flex-grow ${isSidebarVisible ? 'ml-[25%] xl:ml-[20%]' : 'ml-10'}`}>
              <div className="flex flex-grow overflow-auto pt-10">
                <main className="w-full p-4 min-h-0">
                  <article className="min-h-screen">
                    <Routes userRole={userRole} />
                  </article>
                </main>
              </div>
              <footer className="p-2 bg-white flex justify-between border-t-2">
                <p>2024 Restaurante.</p>
                <p>Aplicación Web NutriConti</p>
              </footer>
            </div>
          </div>
        )}
      </FirebaseContext.Provider>
    </UserRoleContext.Provider>
  );
}

export default App;
