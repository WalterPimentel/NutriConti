import { useState, useEffect } from "react";

import firebase, { FirebaseContext } from "./firebase";
import { UserRoleContext } from "./contexts/UserRoleContext";

import Header from "./components/ui/Header";
import Sidebar from "./components/ui/Sidebar";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import Login from "./components/paginas/Login";
import Routes from "./components/routing/Routes";

import useWindowSize from "./hooks/useWindowSize";
import useIdleTimeout from "./hooks/useIdleTimeout";

import useAuth from "./auth/useAuth";

function App() {

  const TIMEOUT = 60 * 60 * 1000;

  const size = useWindowSize();
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const { user, userRole, loading, isAuthenticated, error } = useAuth();

  useEffect(() => {
    const shouldBeVisible = size.width >= 800;
    if (isSidebarVisible !== shouldBeVisible) {
      setSidebarVisible(shouldBeVisible);
    }
  }, [size]);

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  useIdleTimeout(handleLogout, TIMEOUT);

  if (loading) {
    return <LoadingSpinner isOpen={loading} />;
  }

  if (error) {
    return <div>{error}</div>;
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
            <nav className={`bg-gray-800 fixed h-full overflow-y-auto ${isSidebarVisible ? (size.width >= 800 ? 'md:w-1/4 xl:w-1/5' : 'md:w-1/4 xl:w-1/5') : (size.width >= 800 ? 'w-[3.1rem]' : 'hidden')} pt-12`}>
              <Sidebar
                user={user}
                onLogout={handleLogout}
                isSidebarVisible={isSidebarVisible}
                setSidebarVisible={setSidebarVisible}
              />
            </nav>
            <div className={`flex flex-col flex-grow ${isSidebarVisible ? 'ml-[25%] xl:ml-[20%]' : 'ml-10'}`}>
              <div className="flex flex-grow overflow-auto">
                <main className={`w-[95%] mt-16 min-h-0 ${isSidebarVisible ? 'ml-6' : 'ml-8'}`}>
                  <article className="min-h-screen">
                    <Routes userRole={userRole} />
                  </article>
                </main>
              </div>
              <footer className={`p-2 bg-white flex justify-between border-t-2  ${isSidebarVisible ? (size.width >= 800 ? 'ml-0' : 'ml-0') : (size.width >= 800 ? 'ml-1' : '-ml-10')}`}>
                <p>{new Date().getFullYear()} Restaurante.</p>
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
